import { catchError, firstValueFrom } from 'rxjs';
import { CdiValuesResponse } from './types/cdi-values-response';
import { HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RedisCacheService } from '@/lib/redis/redis-cache.service';

@Injectable()
export class IpeadataService {
  constructor(
    private readonly httpService: HttpService,
    private redisCacheService: RedisCacheService,
  ) {}

  async getCdiValues(): Promise<CdiValuesResponse['value']> {
    const { data } = await firstValueFrom(
      this.httpService
        .get<CdiValuesResponse>(
          `http://www.ipeadata.gov.br/api/odata4/Metadados('SGS366_CDI366')/Valores`,
        )
        .pipe(
          catchError((error: AxiosError) => {
            console.error(error.response?.data);
            throw 'An error happened!';
          }),
        ),
    );

    return data.value;
  }

  @Cron(CronExpression.EVERY_HOUR)
  async cacheCdiValues() {
    const cdiValues = await this.getCdiValues();

    await Promise.all([
      this.redisCacheService.set('external-ipeadata-cdi-daily', cdiValues),
      this.redisCacheService.set(
        'external-ipeadata-cdi-last-date',
        cdiValues?.[cdiValues?.length - 1]?.VALDATA,
      ),
    ]);
  }
}
