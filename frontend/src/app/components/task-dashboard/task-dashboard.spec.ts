import { ComponentFixture, TestBed } from '@angular/core/testing';

import { of } from 'rxjs';
import { TaskService } from '../../services/task/task.service';
import { TaskDashboard } from './task-dashboard';
import { Task } from '../../models/task.model';

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
    const newTask: Task = { title: 'TDD addTask', description: 'Testing addTask', status: 'To Do' } as Task;
    const savedTask: Task = { id: 3, ...newTask };

    mockTaskService.createTask = vi.fn().mockReturnValue(of(savedTask));

    // Act
    component.addTask(newTask);

    // Assert
    expect(mockTaskService.createTask).toHaveBeenCalledWith(newTask);
    expect(component.tasks).toContain(savedTask);
  });
});
