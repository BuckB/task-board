import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task/task.service';

@Component({
  selector: 'app-task-dashboard',
  standalone: true,
  templateUrl: './task-dashboard.html',
  styleUrl: './task-dashboard.scss',
  imports: [ReactiveFormsModule]
})

export class TaskDashboard implements OnInit {
  title = 'Task Board';
  tasks: Task[] = [];

  private taskService: TaskService = inject(TaskService);

  ngOnInit(): void {
    this.taskService.getTasks().subscribe((data) => {
      this.tasks = data;
    });
  }

  taskForm = new FormGroup({
    title: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    description: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    status: new FormControl('Backlog', { nonNullable: true })
  });

  onSubmit(): void {
    if (this.taskForm.valid) {
      const newTask: Task = this.taskForm.getRawValue() as Task;
      this.addTask(newTask);
      this.taskForm.reset({ status: 'Backlog' });
    }
  }

  addTask(newTask: Task): void {
    this.taskService.createTask(newTask).subscribe((savedTask) => {
      this.tasks = [...this.tasks, savedTask];
    });
  }
}
