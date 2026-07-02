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
import { Cron, CronExpression } from '@nestjs/schedule';
import { RedisCacheService } from '@/lib/redis/redis-cache.service';
import {
  BacenApiRange,
  BacenCachedValue,
  BacenApiResponse,
} from './bacen.types';
import { format, sub } from 'date-fns';

@Injectable()
export class BacenService {
  private readonly logger = new Logger(BacenService.name);

  constructor(
    private readonly httpService: HttpService,
    private redisCacheService: RedisCacheService,
  ) {}

  private async getDataByCode(
    code: string,
    range?: BacenApiRange,
  ): Promise<BacenApiResponse[]> {
    const initialDateString = range?.initialDate
      ? format(range.initialDate, 'dd/MM/yyyy')
      : '';

    const finalDateString = range?.finalDate
      ? format(range.finalDate, 'dd/MM/yyyy')
      : '';

    const maxRetries = 3;
    const initialDelay = 3000;

    const data = await lastValueFrom(
      defer(() =>
        this.httpService.get<BacenApiResponse[]>(
          `https://api.bcb.gov.br/dados/serie/bcdata.sgs.${code}/dados?formato=json${range ? `&dataInicial=${initialDateString}&dataFinal=${finalDateString}` : ''}`,
        ),
      ).pipe(
        map((response) => {
          if (!Array.isArray(response?.data)) {
            throw new Error('Invalid response format: expected array');
          }
          return response.data;
        }),
        retry({
          count: maxRetries,
          delay: (error, retryCount) => {
            this.logger.warn(
              `Retrying Bacen API request (${retryCount}/${maxRetries})...`,
            );
            return timer(retryCount * initialDelay);
          },
        }),
        catchError((error) => {
          this.logger.error(
            `Bacen API request failed after retries: ${error.message}`,
          );
          return throwError(
            () =>
              new Error(
                'Failed to fetch valid data from Bacen API after multiple attempts',
              ),
          );
        }),
      ),
    );

    return data;
  }

  async getPoupancaValues(
    range: BacenApiRange = {
      initialDate: sub(new Date(), { years: 10 }),
      finalDate: new Date(),
    },
  ): Promise<BacenCachedValue[]> {
    const values = await this.getDataByCode('195', range);

    return values?.map((item) => ({
      data: this.correctBacenDateFormat(item.data),
      dataFim: this.correctBacenDateFormat(item.dataFim),
      valor: Number(item.valor),
    }));
  }

  private correctBacenDateFormat(date: string) {
    return format(new Date(date?.split('/').reverse().join('/')), 'yyyy-MM-dd');
  }

  // 8:00 to 12:00
  @Cron('0 0 8-12 * * *')
  async cachePoupancaValues() {
    this.logger.log('Cron: Starting poupanca values cache update');
    const poupancaValues = await this.getPoupancaValues();

    await this.redisCacheService.set(
      'external-bacen-poupanca-daily',
      poupancaValues,
    );
    this.logger.log(
      `Cron: Cached ${poupancaValues?.length || 0} poupanca values`,
    );
  }

  async getSelicValues(
    range: BacenApiRange = {
      initialDate: sub(new Date(), { years: 10 }),
      finalDate: new Date(),
    },
  ): Promise<BacenCachedValue[]> {
    const values = await this.getDataByCode('11', range);

    return values?.map((item) => ({
      data: this.correctBacenDateFormat(item.data),
      valor: Number(item.valor) / 100, // Selic is returned as a percentage (e.g. 0.04), we want 0.0004
    }));
  }

  @Cron('0 5 8-12 * * *')
  async cacheSelicValues() {
    this.logger.log('Cron: Starting selic values cache update');
    const selicValues = await this.getSelicValues();

    await this.redisCacheService.set(
      'external-bacen-selic-daily',
      selicValues,
    );
    this.logger.log(
      `Cron: Cached ${selicValues?.length || 0} selic values`,
    );
  }
}
