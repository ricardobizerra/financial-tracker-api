import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { BacenService } from './bacen.service';

@Module({
  imports: [HttpModule],
  providers: [BacenService],
  exports: [BacenService],
})
export class BacenModule {}
