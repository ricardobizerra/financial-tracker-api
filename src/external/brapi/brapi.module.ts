import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { BrapiService } from './brapi.service';
@Module({
  imports: [
    HttpModule.register({
      timeout: 10000,
    }),
  ],
  providers: [BrapiService],
  exports: [BrapiService],
})
export class BrapiModule {}
