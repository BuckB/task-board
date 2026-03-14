import { Component, inject, OnInit } from '@angular/core';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task/task.service';

@Component({
  selector: 'app-task-dashboard',
  standalone: true,
  templateUrl: './task-dashboard.html',
  styleUrl: './task-dashboard.scss',
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
}
