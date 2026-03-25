import { TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TaskService } from './task.service';
import { CreateTaskDTO, Task } from '../../models/task.model';

describe('TaskService', () => {
  let service: TaskService;
  let httpMock: HttpTestingController

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
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch tasks from the backend', () => {
    const mockTasks: Task[] = [
      { id: 1, title: 'Task 1', description: 'Description 1', status: 'To Do' },
      { id: 2, title: 'Task 2', description: 'Description 2', status: 'In Progress' }
    ];
    service.getTasks().subscribe(tasks => {
      expect(tasks.length).toBe(2);
      expect(tasks).toEqual(mockTasks);
    });

    const req = httpMock.expectOne('http://localhost:3000/tasks');
    expect(req.request.method).toBe('GET');
    req.flush(mockTasks); // Resolve the request with mock data
  });

  it('should send a POST request to create a new task', () => {
    const newTask: CreateTaskDTO = { title: 'TDD addTask', description: 'Testing POST', status: 'To Do' } as CreateTaskDTO;
    const mockResponse: Task = { id: 99, ...newTask };

    service.createTask(newTask).subscribe((task: Task) => {
      expect(task).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:3000/tasks');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newTask);
    req.flush(mockResponse); // Resolve the request with mock data
  });

  it('should send a DELETE request to the correct URL', () => {
    const taskId = 1;

    service.deleteTask(taskId).subscribe();

    const req = httpMock.expectOne(`http://localhost:3000/tasks/${taskId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null); // Backend usually returns 204 No Content
  });
});
