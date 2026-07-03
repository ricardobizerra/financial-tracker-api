import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { RedisCacheService } from '@/lib/redis/redis-cache.service';
import { Cron } from '@nestjs/schedule';
import csv = require('csv-parser');
import * as iconv from 'iconv-lite';
import { lastValueFrom, map, tap } from 'rxjs';

export type TesouroDiretoDataPoint = {
  tipoTitulo: string;
  dataVencimento: string;
  dataBase: string;
  taxaCompraManha: number;
  taxaVendaManha: number;
  puCompraManha: number;
  puVendaManha: number;
  puBaseManha: number;
};

@Injectable()
export class TesouroTransparenteService implements OnModuleInit {
  private readonly logger = new Logger(TesouroTransparenteService.name);
  private readonly CSV_URL =
    'https://www.tesourotransparente.gov.br/ckan/dataset/df56aa42-484a-4a59-8184-7676580c81e3/resource/796d2059-14e9-44e3-80c9-2d9e30b405c1/download/precotaxatesourodireto.csv';
  private readonly CACHE_KEY = 'external-tesouro-transparente-history';

  constructor(
    private readonly httpService: HttpService,
    private readonly redisCacheService: RedisCacheService,
  ) {}

  async onModuleInit() {
    const existing = await this.redisCacheService.get(this.CACHE_KEY);
    if (!existing) {
      this.logger.log('Cache missing on startup, triggering sync...');
      await this.syncData();
    }
  }

  @Cron('0 15 8-12 * * *')
  async syncDataCron() {
    this.logger.log('Cron: Starting Tesouro Transparente data sync');
    await this.syncData();
  }

  private parsePortugueseNumber(value: string): number {
    if (!value) return 0;
    const normalized = value.replace(/\./g, '').replace(',', '.');
    return Number(normalized);
  }

  async syncData(): Promise<void> {
    try {
      this.logger.log(`Downloading CSV from ${this.CSV_URL}...`);

      const response = await this.httpService.axiosRef.get(this.CSV_URL, {
        responseType: 'stream',
      });

      const groupedData: Record<string, TesouroDiretoDataPoint[]> = {};
      const indexList: string[] = [];

      await new Promise((resolve, reject) => {
        response.data
          .pipe(iconv.decodeStream('iso-8859-1'))
          .pipe(csv({ separator: ';' }))
          .on('data', (row: any) => {
            const key = `${row['Tipo Titulo']}|${row['Data Vencimento']}`;
            if (!groupedData[key]) {
              groupedData[key] = [];
              indexList.push(key);
            }
            groupedData[key].push({
              tipoTitulo: row['Tipo Titulo'],
              dataVencimento: row['Data Vencimento'],
              dataBase: row['Data Base'],
              taxaCompraManha: this.parsePortugueseNumber(
                row['Taxa Compra Manha'],
              ),
              taxaVendaManha: this.parsePortugueseNumber(
                row['Taxa Venda Manha'],
              ),
              puCompraManha: this.parsePortugueseNumber(row['PU Compra Manha']),
              puVendaManha: this.parsePortugueseNumber(row['PU Venda Manha']),
              puBaseManha: this.parsePortugueseNumber(row['PU Base Manha']),
            });
          })
          .on('end', resolve)
          .on('error', reject);
      });

      this.logger.log(`Parsed ${indexList.length} unique bonds. Caching...`);

      // Save index
      await this.redisCacheService.set(
        `${this.CACHE_KEY}:index` as any,
        indexList,
        24 * 60 * 60 * 1000,
      );

      // Save individual bond histories
      for (const key of indexList) {
        // Sort chronologically (DD/MM/YYYY)
        groupedData[key].sort((a, b) => {
          const dateA = a.dataBase.split('/').reverse().join('-');
          const dateB = b.dataBase.split('/').reverse().join('-');
          return dateA.localeCompare(dateB);
        });

        await this.redisCacheService.set(
          `${this.CACHE_KEY}:${key}` as any,
          groupedData[key],
          24 * 60 * 60 * 1000,
        );
      }

      this.logger.log(
        'Tesouro Transparente data synced and cached successfully.',
      );
    } catch (error: any) {
      this.logger.error(
        `Failed to sync Tesouro Transparente data: ${error.message}`,
      );
    }
  }

  async getAvailableBonds(tipoTituloPrefix: string): Promise<string[]> {
    let index = await this.redisCacheService.get(
      `${this.CACHE_KEY}:index` as any,
    );

    if (!index) {
      await this.syncData();
      index = await this.redisCacheService.get(
        `${this.CACHE_KEY}:index` as any,
      );
      if (!index) return [];
    }

    // Filter index keys starting with prefix
    const keys = (index as string[]).filter((k) =>
      k.startsWith(tipoTituloPrefix),
    );
    // Extract dates
    const dates = keys.map((k) => k.split('|')[1]);

    // Sort dates by year/month/day
    dates.sort((a, b) => {
      const da = a.split('/').reverse().join('-');
      const db = b.split('/').reverse().join('-');
      return da.localeCompare(db);
    });

    return [...new Set(dates)];
  }

  async getHistoricalDataForBond(
    tipoTituloPrefix: string,
    maturityStr: string,
  ): Promise<TesouroDiretoDataPoint[]> {
    const index = (await this.redisCacheService.get(
      `${this.CACHE_KEY}:index` as any,
    )) as string[];

    if (!index) return [];

    const exactKey = index.find(
      (k) => k.startsWith(tipoTituloPrefix) && k.endsWith(`|${maturityStr}`),
    );
    if (!exactKey) return [];

    const data = await this.redisCacheService.get(
      `${this.CACHE_KEY}:${exactKey}` as any,
    );
    return (data as TesouroDiretoDataPoint[]) || [];
  }
}
