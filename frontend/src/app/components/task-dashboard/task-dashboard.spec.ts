import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskDashboard } from './task-dashboard';

describe('TaskDashboard', () => {
  let component: TaskDashboard;
  let fixture: ComponentFixture<TaskDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskDashboard],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskDashboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create the task dashboard', () => {
    expect(component).toBeTruthy();
  });

  describe('Render title', () => {
    it('should render the dashboard title "Task Board"', () => {
      const fixture = TestBed.createComponent(TaskDashboard);
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('h1')?.textContent).toContain('Task Board');
    });
  });
});
