import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { CreateTaskDTO } from '@domains/task/model/create-task.dto';
import { Task } from '@domains/task/model/task.model';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root',
})

export class TaskService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/tasks';

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl);
  }

  createTask(taskDTO: CreateTaskDTO): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, taskDTO);
  }

  deleteTask(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updateTaskStatus(id: string, statusId: string): Observable<Task> {
    return this.http.patch<Task>(`${this.apiUrl}/${id}`, { statusId });
  }
}
