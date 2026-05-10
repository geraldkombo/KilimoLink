import { Global, Module } from '@nestjs/common';
import { QueuesService } from './queues.service';
import { WorkersService } from './workers.service';

@Global()
@Module({
  providers: [QueuesService, WorkersService],
  exports: [QueuesService]
})
export class QueuesModule {}
