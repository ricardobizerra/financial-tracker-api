import { catchError, firstValueFrom } from 'rxjs';
import { CdiValuesResponse } from './types/cdi-values-response';
import { HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';
import { Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class IpeadataService {
  constructor(
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
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
      this.cacheService.set('external-ipeadata-cdi-daily', cdiValues),
      this.cacheService.set(
        'external-ipeadata-cdi-last-date',
        cdiValues?.[cdiValues?.length - 1]?.VALDATA,
      ),
    ]);
  }
}
