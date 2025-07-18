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
import { Injectable } from '@nestjs/common';
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
            console.log(`Retrying (${retryCount}/${maxRetries})...`);
            return timer(retryCount * initialDelay);
          },
        }),
        catchError((error) => {
          console.error('API request failed after retries:', error.message);
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

  @Cron(CronExpression.EVERY_HOUR)
  async cachePoupancaValues() {
    const poupancaValues = await this.getPoupancaValues();

    await this.redisCacheService.set(
      'external-bacen-poupanca-daily',
      poupancaValues,
    );
  }
}
