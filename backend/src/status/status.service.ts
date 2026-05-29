import { Status } from '@app/status/model/status.entity';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class StatusService implements OnModuleInit {

    constructor(
        @InjectRepository(Status)
        private statusRepository: Repository<Status>
    ) {}

    async onModuleInit() {
        const count = await this.statusRepository.count();
        if (count === 0) {
            console.log('🌱 Seeding initial statuses...');
            await this.statusRepository.save([
                { name: 'BACKLOG', orderIndex: 0, color: '#94a3b8' },
                { name: 'TODO', orderIndex: 1, color: '#3b82f6' },
                { name: 'IN_PROGRESS', orderIndex: 2, color: '#f59e0b' },
                { name: 'DONE', orderIndex: 3, color: '#10b981' },
            ]);
        }
    }

    /**
     * Retrieves all statuses from the database, ordered by their orderIndex.
     * @returns Promise<Status[]>
     */
    async findAll(): Promise<Status[]> {
        return this.statusRepository.find({
            order: { orderIndex: 'ASC' },
        });
    }

    /**
     * Finds a status by its Id.
     * @param id The Id of the status to be found.
     * @returns Promise<Status | null>
     */
    async findById(id: string): Promise<Status | null> {
        return this.statusRepository.findOneBy({ id });
    }
}
