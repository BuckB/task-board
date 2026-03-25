import { ComponentFixture, TestBed } from '@angular/core/testing';

import { of } from 'rxjs';
import { TaskService } from '../../services/task/task.service';
import { TaskDashboard } from './task-dashboard';
import { CreateTaskDTO, Task } from '../../models/task.model';

describe('TaskDashboard', () => {
  let component: TaskDashboard;
  let fixture: ComponentFixture<TaskDashboard>;
  let mockTaskService: any;

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
  });

  it('should create the task dashboard', () => {
    expect(component).toBeTruthy();
  });

  it('should render the dashboard title "Task Board"', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Task Board');
  });

  it('should call getTasks on TaskService when initialized', () => {
    fixture.detectChanges();
    expect(mockTaskService.getTasks).toHaveBeenCalled();
  });

  it('should display the correct number of tasks', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const taskItems = compiled.querySelectorAll('.task-item');
    expect(taskItems.length).toBe(2);
    expect(taskItems[0].textContent).toContain('Task 1');
    expect(taskItems[1].textContent).toContain('Task 2');
  });

  it('should call createTask on the service and add the new task to the list', () => {
    // Arrange
    const newTask: CreateTaskDTO = { title: 'TDD addTask', description: 'Testing POST', status: 'To Do' } as CreateTaskDTO;
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
    const compiled = fixture.nativeElement as HTMLElement;
    const titleInput = compiled.querySelector('input[formControlName="title"]');
    const descInput = compiled.querySelector('textarea[formControlName="description"]');
    const submitBtn = compiled.querySelector('button[type="submit"]');

    expect(titleInput).toBeTruthy();
    expect(descInput).toBeTruthy();
    expect(submitBtn).toBeTruthy();
  });

  it('should have a grid container for tasks', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.task-grid')).toBeTruthy();
  });

  it('should remove a task from the list when deleted', () => {
    // Setup: Component already has 1 task
    component.tasks.set([{ id: 1, title: 'Delete Me', description: 'I am a task to be deleted', status: 'To Do' }]);
    mockTaskService.deleteTask = vi.fn().mockReturnValue(of(null));

    // Act
    component.onDeleteTask(1);

    // Assert
    expect(mockTaskService.deleteTask).toHaveBeenCalledWith(1);
    expect(component.tasks().length).toBe(0);
  });
});
