import { Task } from "@app/tasks/model/task.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('statuses')
export class Status {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    name: string;

    @Column({ default: '#e2e8f0' })
    color: string;

    @Column({ default: 0 })
    orderIndex: number;

    @OneToMany(() => Task, task => task.status)
    tasks: Task[];
}