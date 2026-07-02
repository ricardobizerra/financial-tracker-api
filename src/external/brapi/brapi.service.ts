import {
  catchError,
  timer,
  lastValueFrom,
  map,
  throwError,
  defer,
  retry,
} from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { RedisCacheService } from '@/lib/redis/redis-cache.service';

export type BrapiTreasuryBond = {
  name: string;
  untrMtrtyVal: number;
  untrBizDayQtd: number;
  anulzedRate: number;
  minIvsmtVal: number;
  untrPricVal: number;
  mtrtyDate: string;
  idxrName?: string;
};

export type BrapiTreasuryResponse = {
  results: BrapiTreasuryBond[];
};

@Injectable()
export class BrapiService {
  private readonly logger = new Logger(BrapiService.name);

  constructor(
    private readonly httpService: HttpService,
    private redisCacheService: RedisCacheService,
  ) {}

  async getTreasuryBonds(): Promise<BrapiTreasuryBond[]> {
    const maxRetries = 3;
    const initialDelay = 3000;

    const data = await lastValueFrom(
      defer(() =>
        this.httpService.get<BrapiTreasuryResponse>(
          `https://brapi.dev/api/v2/treasury?token=${process.env.BRAPI_TOKEN || ''}`,
        ),
      ).pipe(
        map((response) => {
          if (!response?.data?.results) {
            throw new Error('Invalid response format: expected results array');
          }
          return response.data.results;
        }),
        retry({
          count: maxRetries,
          delay: (error, retryCount) => {
            this.logger.warn(
              `Retrying Brapi API request (${retryCount}/${maxRetries})...`,
            );
            return timer(retryCount * initialDelay);
          },
        }),
        catchError((error) => {
          this.logger.error(
            `Brapi API request failed after retries: ${error.message}`,
          );
          return throwError(
            () =>
              new Error(
                'Failed to fetch valid data from Brapi API after multiple attempts',
              ),
          );
        }),
      ),
    );

    return data;
  }

  @Cron('0 15 8-12 * * *')
  async cacheTreasuryBonds() {
    this.logger.log('Cron: Starting treasury bonds cache update');
    const bonds = await this.getTreasuryBonds();

    await this.redisCacheService.set('external-brapi-treasury-daily', bonds);
    this.logger.log(`Cron: Cached ${bonds?.length || 0} treasury bonds`);
  }
}
