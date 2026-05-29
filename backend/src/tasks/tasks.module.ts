import { StatusModule } from '@app/status/status.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './model/task.entity';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task]),
    StatusModule
  ],
  controllers: [TasksController],
  providers: [TasksService]
})
export class TasksModule {}
