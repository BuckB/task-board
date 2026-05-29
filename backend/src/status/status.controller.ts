import { Controller, Get } from '@nestjs/common';
import { Status } from './model/status.entity';
import { StatusService } from './status.service';

@Controller('status')
export class StatusController {

    constructor(private statusService: StatusService) {}

    @Get()
    async findAllStatuses(): Promise<Status[]> {
        return await this.statusService.findAll();
    }
}
