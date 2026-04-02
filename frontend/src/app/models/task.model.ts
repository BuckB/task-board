import { TaskStatus } from "./task-status.enum";

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: TaskStatus;
}

export type CreateTaskDTO = Omit<Task, 'id'>;