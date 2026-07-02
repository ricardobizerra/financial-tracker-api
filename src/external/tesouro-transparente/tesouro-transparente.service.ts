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

      const parsedData: TesouroDiretoDataPoint[] = [];

      await new Promise((resolve, reject) => {
        response.data
          .pipe(iconv.decodeStream('iso-8859-1'))
          .pipe(csv({ separator: ';' }))
          .on('data', (row: any) => {
            parsedData.push({
              tipoTitulo: row['Tipo Titulo'],
              dataVencimento: row['Data Vencimento'],
              dataBase: row['Data Base'],
              taxaCompraManha: this.parsePortugueseNumber(row['Taxa Compra Manha']),
              taxaVendaManha: this.parsePortugueseNumber(row['Taxa Venda Manha']),
              puCompraManha: this.parsePortugueseNumber(row['PU Compra Manha']),
              puVendaManha: this.parsePortugueseNumber(row['PU Venda Manha']),
              puBaseManha: this.parsePortugueseNumber(row['PU Base Manha']),
            });
          })
          .on('end', resolve)
          .on('error', reject);
      });

      this.logger.log(`Parsed ${parsedData.length} records. Caching...`);
      await this.redisCacheService.set(this.CACHE_KEY, parsedData, 24 * 60 * 60); // Cache for 24h
      this.logger.log('Tesouro Transparente data synced and cached successfully.');
    } catch (error: any) {
      this.logger.error(`Failed to sync Tesouro Transparente data: ${error.message}`);
    }
  }

  async getHistoricalData(): Promise<TesouroDiretoDataPoint[]> {
    let data = await this.redisCacheService.get(
      this.CACHE_KEY,
    );

    if (!data) {
      await this.syncData();
      data = (await this.redisCacheService.get(
        this.CACHE_KEY,
      )) || [];
    }

    return data;
  }
}
