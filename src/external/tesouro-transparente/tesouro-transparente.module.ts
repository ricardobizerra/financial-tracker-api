import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TesouroTransparenteService } from './tesouro-transparente.service';
import { RedisModule } from '@/lib/redis/redis.module';

@Module({
  imports: [HttpModule, RedisModule],
  providers: [TesouroTransparenteService],
  exports: [TesouroTransparenteService],
})
export class TesouroTransparenteModule {}
