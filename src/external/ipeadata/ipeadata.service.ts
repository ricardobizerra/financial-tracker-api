import { catchError, firstValueFrom } from 'rxjs';
import {
  IpeadataCachedValue,
  IpeadataResponse,
} from './types/ipeadata-response';
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

  private async getDataByCode(
    code: string,
  ): Promise<IpeadataResponse['value']> {
    const { data } = await firstValueFrom(
      this.httpService
        .get<IpeadataResponse>(
          `http://www.ipeadata.gov.br/api/odata4/Metadados('${code}')/Valores`,
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

  async getCdiValues(): Promise<IpeadataCachedValue[]> {
    const values = await this.getDataByCode('SGS366_CDI366');

    return values?.map((item) => ({
      date: item.VALDATA?.split('T')[0],
      value: item.VALVALOR,
    }));
  }

  // Monday to Friday, 8:00 to 12:00
  @Cron('0 0 8-12 * * 1-5')
  async cacheCdiValues() {
    const cdiValues = await this.getCdiValues();

    await Promise.all([
      this.redisCacheService.set('external-ipeadata-cdi-daily', cdiValues),
      this.redisCacheService.set(
        'external-ipeadata-cdi-last-date',
        cdiValues?.[cdiValues?.length - 1]?.date,
      ),
    ]);
  }
}
