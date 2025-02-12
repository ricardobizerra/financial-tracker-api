import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { IpeadataService } from './ipeadata.service';

@Module({
  imports: [HttpModule],
  providers: [IpeadataService],
  exports: [IpeadataService],
})
export class IpeadataModule {}
