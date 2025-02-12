import { catchError, firstValueFrom } from 'rxjs';
import { CdiValuesResponse } from './types/cdi-values-response';
import { HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class IpeadataService {
  constructor(private readonly httpService: HttpService) {}

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
}
