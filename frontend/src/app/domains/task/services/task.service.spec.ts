import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Status } from '@domains/status/model/status.model';
import { CreateTaskDTO } from '@domains/task/model/create-task.dto';
import { Task } from '@domains/task/model/task.model';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { TaskService } from './task.service';

describe('TaskService', () => {
  const apiUrl = 'http://localhost:3000/tasks';
  let service: TaskService;
  let httpMock: HttpTestingController;

  const mockStatus: Status = {
    id: 'status-uuid-111',
    name: 'TODO',
    color: '#3b82f6',
    orderIndex: 1,
  };

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
      { id: 'task-uuid-1', title: 'Task 1', description: 'Description 1', status: mockStatus },
      { id: 'task-uuid-2', title: 'Task 2', description: 'Description 2', status: mockStatus }
    ];
    service.getTasks().subscribe((tasks: Task[]) => {
      expect(tasks.length).toBe(2);
      expect(tasks).toEqual(mockTasks);
    });

    const req = httpMock.expectOne(`${apiUrl}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockTasks); // Resolve the request with mock data
  });

  it('should send a POST request to create a new task', () => {
    const newTask: CreateTaskDTO = {
      title: 'TDD addTask',
      description: 'Testing POST',
      statusId: 'status-uuid-111'
    };
    const mockResponse: Task = {
      id: 'task-uuid-1',
      title: newTask.title,
      description: newTask.description,
      status: mockStatus
    };

    service.createTask(newTask).subscribe((task: Task) => {
      expect(task).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${apiUrl}`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newTask);
    req.flush(mockResponse); // Resolve the request with mock data
  });

  it('should send a DELETE request to the correct URL', () => {
    const taskId: string = 'task-uuid-1';
    service.deleteTask(taskId).subscribe();
    const req = httpMock.expectOne(`${apiUrl}/${taskId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null); // Backend usually returns 204 No Content
  });

  it('should send a PATCH request to update a task status', () => {
    const taskId: string = 'task-uuid-1';
    const newStatusId: string = 'status-uuid-2';
    const updatedStatus: Status = { id: newStatusId, name: 'IN_PROGRESS', color: '#f59e0b', orderIndex: 2 };
    const mockUpdatedTask: Task = {
      id: taskId,
      title: 'Test Task',
      status: updatedStatus
    };

    service.updateTaskStatus(taskId, newStatusId).subscribe((task: Task) => {
      expect(task).toEqual(mockUpdatedTask);
    });

    const req = httpMock.expectOne(`${apiUrl}/${taskId}`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ statusId: newStatusId });
    req.flush(mockUpdatedTask); // Resolve the request with mock data
  });
});
