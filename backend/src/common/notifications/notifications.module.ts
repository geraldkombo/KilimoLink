import { Global, Module } from '@nestjs/common';
import { NotificationTransportService } from './notification-transport.service';

@Global()
@Module({
  providers: [NotificationTransportService],
  exports: [NotificationTransportService]
})
export class NotificationsModule {}

