import { Module } from '@nestjs/common';
import { BusinessesController } from './businesses.controller';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [],
  controllers: [BusinessesController, UsersController],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule {}
