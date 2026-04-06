import { Component, inject, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { CreateTaskDTO, Task } from '../../models/task.model';
import { TaskService } from '../../services/task/task.service';
import { TaskStatus } from '../../models/task-status.enum';

@Component({
  selector: 'app-task-dashboard',
  standalone: true,
  templateUrl: './task-dashboard.html',
  styleUrl: './task-dashboard.scss',
  imports: [ReactiveFormsModule]
})

export class TaskDashboard implements OnInit {
  readonly title = 'Task Board';
  readonly tasks = signal<Task[]>([]);
  protected TaskStatus = TaskStatus;

  private taskService: TaskService = inject(TaskService);

  ngOnInit(): void {
    this.taskService.getTasks().subscribe({
      next: (data) => {
        this.tasks.set(data);
      },
      error: (err) => console.error('Error fetching tasks:', err)
    });
  }

  taskForm = new FormGroup({
    title: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    description: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    status: new FormControl(TaskStatus.BACKLOG, { nonNullable: true })
  });

  onSubmit(): void {
    if (this.taskForm.valid) {
      const newTask: Task = this.taskForm.getRawValue() as Task;
      this.addTask(newTask);
      this.taskForm.reset({ status: TaskStatus.BACKLOG });
    }
  }

  addTask(newTask: CreateTaskDTO): void {
    this.taskService.createTask(newTask).subscribe((savedTask) => {
      this.tasks.update((currentTasks) => [...currentTasks, savedTask]);
    });
  }

  onDeleteTask(id: number): void {
    this.taskService.deleteTask(id).subscribe({
      next: () => {
        this.tasks.update((currentTasks) => currentTasks.filter(task => task.id !== id));
      },
      error: (err) => console.error('Error deleting task:', err)
    });
  }

  changeStatus(id: number, newStatus: TaskStatus): void {
    this.taskService.updateTaskStatus(id, newStatus).subscribe({
      next: updatedTask => {
        this.tasks.update((currentTasks) => currentTasks.map(task => task.id === id ? updatedTask : task));
      },
      error: (err) => console.error('Task status update failed:', err)
    });
  }
}
