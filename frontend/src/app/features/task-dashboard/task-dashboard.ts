import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Status } from '@domains/status/model/status.model';
import { CreateTaskDTO } from '@domains/task/model/create-task.dto';
import { Task } from '@domains/task/model/task.model';
import { TaskService } from '@domains/task/services/task.service';

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
  protected TaskStatus: Status = {} as Status;
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
    statusId: new FormControl('', { nonNullable: true })
  });

  onSubmit(): void {
    if (this.taskForm.valid) {
      const newTask: CreateTaskDTO = this.taskForm.getRawValue() as CreateTaskDTO;
      this.addTask(newTask);
      this.taskForm.reset({ statusId: '' });
    }
  }

  addTask(newTask: CreateTaskDTO): void {
    this.taskService.createTask(newTask).subscribe((savedTask) => {
      this.tasks.update((currentTasks) => [...currentTasks, savedTask]);
    });
  }

  onDeleteTask(id: string): void {
    this.taskService.deleteTask(id).subscribe({
      next: () => {
        this.tasks.update((currentTasks) => currentTasks.filter(task => task.id !== id));
      },
      error: (err) => console.error('Error deleting task:', err)
    });
  }

  changeStatus(id: string, newStatusId: string): void {
    this.taskService.updateTaskStatus(id, newStatusId).subscribe({
      next: updatedTask => {
        this.tasks.update((currentTasks) => currentTasks.map(task => task.id === id ? updatedTask : task));
      },
      error: (err) => console.error('Task status update failed:', err)
    });
  }
}
