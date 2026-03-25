export interface Task {
  id: number;
  title: string;
  description?: string;
  status: string;
}

export type CreateTaskDTO = Omit<Task, 'id'>;