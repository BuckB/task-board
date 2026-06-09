import { IsNotEmpty, IsUUID } from "class-validator";

export class UpdateTaskStatusDto {
    @IsUUID()
    @IsNotEmpty()
    statusId: string;
}