import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { TaskStatus } from '../../models/task-status.enum';
import { CreateTaskDTO, Task } from '../../models/task.model';
import { TaskService } from '../../services/task/task.service';
import { TaskDashboard } from './task-dashboard';

describe('TaskDashboard', () => {
  let component: TaskDashboard;
  let fixture: ComponentFixture<TaskDashboard>;
  let mockTaskService: any;
  let compiled: HTMLElement;

  beforeEach(async () => {
    mockTaskService = {
      getTasks: vi.fn().mockReturnValue(of([
        { id: 1, title: 'Task 1', description: 'Description 1', status: 'To Do' },
        { id: 2, title: 'Task 2', description: 'Description 2', status: 'In Progress' }
      ])),
    };

    await TestBed.configureTestingModule({
      imports: [TaskDashboard],
      providers: [
        { provide: TaskService, useValue: mockTaskService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskDashboard);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement as HTMLElement;
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create the task dashboard', () => {
    expect(component).toBeTruthy();
  });

  it('should render the dashboard title "Task Board"', () => {
    fixture.detectChanges();
    expect(compiled.querySelector('h1')?.textContent).toContain('Task Board');
  });

  it('should call getTasks on TaskService when initialized', () => {
    fixture.detectChanges();
    expect(mockTaskService.getTasks).toHaveBeenCalled();
  });

  it('should display the correct number of tasks', () => {
    fixture.detectChanges();
    const taskItems = compiled.querySelectorAll('.task-item');
    expect(taskItems.length).toBe(2);
    expect(taskItems[0].textContent).toContain('Task 1');
    expect(taskItems[1].textContent).toContain('Task 2');
  });

  it('should call createTask on the service and add the new task to the list', () => {
    // Arrange
    const newTask: CreateTaskDTO = { title: 'TDD addTask', description: 'Testing POST', status: TaskStatus.TODO } as CreateTaskDTO;
    const savedTask: Task = { id: 99, ...newTask };

    mockTaskService.createTask = vi.fn().mockReturnValue(of(savedTask));

    // Act
    component.addTask(newTask);

    // Assert
    expect(mockTaskService.createTask).toHaveBeenCalledWith(newTask);
    expect(component.tasks()).toContain(savedTask);
  });

  it('should have a form with title and description inputs', () => {
    fixture.detectChanges();
    const titleInput = compiled.querySelector('input[formControlName="title"]');
    const descInput = compiled.querySelector('textarea[formControlName="description"]');
    const submitBtn = compiled.querySelector('button[type="submit"]');

    expect(titleInput).toBeTruthy();
    expect(descInput).toBeTruthy();
    expect(submitBtn).toBeTruthy();
  });

  it('should have a grid container for tasks', () => {
    fixture.detectChanges();
    expect(compiled.querySelector('.task-grid')).toBeTruthy();
  });

  it('should remove a task from the list when deleted', () => {
    // Setup: Component already has 1 task
    component.tasks.set([{ id: 1, title: 'Delete Me', description: 'I am a task to be deleted', status: TaskStatus.TODO }]);
    mockTaskService.deleteTask = vi.fn().mockReturnValue(of(null));

    // Act
    component.onDeleteTask(1);

    // Assert
    expect(mockTaskService.deleteTask).toHaveBeenCalledWith(1);
    expect(component.tasks().length).toBe(0);
  });

  it('should update task status in the list', () => {
    const taskId = 123;
    component.tasks.set([{ id: taskId, title: 'Test', description: 'This is a test', status: TaskStatus.TODO }]);

    mockTaskService.updateTaskStatus = vi.fn().mockReturnValue(of({ id: taskId, status: TaskStatus.DONE }));

    component.changeStatus(taskId, TaskStatus.DONE);

    expect(component.tasks()[0].status).toBe(TaskStatus.DONE);
  });
});
