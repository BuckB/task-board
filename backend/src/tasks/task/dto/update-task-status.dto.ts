import { IsEnum, IsNotEmpty } from "class-validator";
import { TaskStatus } from "../task-status.enum";

export class UpdateTaskStatusDto {
    @IsEnum(TaskStatus, {
        message: `Status must be one of the following: ${Object.values(TaskStatus).join(', ')}`
    })
    @IsNotEmpty()
    status: TaskStatus;
}