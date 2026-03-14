import { ComponentFixture, TestBed } from '@angular/core/testing';

import { of } from 'rxjs';
import { TaskService } from '../../services/task/task.service';
import { TaskDashboard } from './task-dashboard';

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
});
