import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { TaskStatus } from '../../models/task-status.enum';
import { CreateTaskDTO, Task } from '../../models/task.model';
import { TaskService } from './task.service';

describe('TaskService', () => {
  const apiUrl = 'http://localhost:3000/tasks';
  let service: TaskService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TaskService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(TaskService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    TestBed.resetTestingModule();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch tasks from the backend', () => {
    const mockTasks: Task[] = [
      { id: 1, title: 'Task 1', description: 'Description 1', status: TaskStatus.TODO },
      { id: 2, title: 'Task 2', description: 'Description 2', status: TaskStatus.IN_PROGRESS }
    ];
    service.getTasks().subscribe(tasks => {
      expect(tasks.length).toBe(2);
      expect(tasks).toEqual(mockTasks);
    });

    const req = httpMock.expectOne(`${apiUrl}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockTasks); // Resolve the request with mock data
  });

  it('should send a POST request to create a new task', () => {
    const newTask: CreateTaskDTO = { title: 'TDD addTask', description: 'Testing POST', status: TaskStatus.TODO } as CreateTaskDTO;
    const mockResponse: Task = { id: 99, ...newTask };

    service.createTask(newTask).subscribe((task: Task) => {
      expect(task).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${apiUrl}`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newTask);
    req.flush(mockResponse); // Resolve the request with mock data
  });

  it('should send a DELETE request to the correct URL', () => {
    const taskId = 1;

    service.deleteTask(taskId).subscribe();

    const req = httpMock.expectOne(`${apiUrl}/${taskId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null); // Backend usually returns 204 No Content
  });

  it('should send a PATCH request to update a task status', () => {
    const taskId = 99;
    const updatedStatus = TaskStatus.IN_PROGRESS;

    service.updateTaskStatus(taskId, updatedStatus).subscribe();

    const req = httpMock.expectOne(`${apiUrl}/${taskId}`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ status: updatedStatus });
    req.flush({ id: taskId, status: updatedStatus } as Task); // Resolve the request with mock data
  });
});
