import { IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { TaskStatus } from "../task-status.enum";

export class CreateTaskDto {
    @IsString()
    @IsNotEmpty()
    title: string;
    @IsString()
    @IsNotEmpty()
    description: string;
    @IsEnum(TaskStatus)
    status: TaskStatus;
}