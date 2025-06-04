import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PublicModule } from '../../../public.module';
import { NzMessageService } from 'ng-zorro-antd/message';
import { HttpClient } from '@angular/common/http';
import { TaskAddComponent } from './task-add/task-add.component';
import { NzDrawerService } from 'ng-zorro-antd/drawer';

@Component({
  standalone: true,
  selector: 'app-token-task',
  templateUrl: './token-task.component.html',
  styleUrls: ['./token-task.component.css'],
  imports: [CommonModule, RouterModule, PublicModule],
})
export class TokenTaskComponent implements OnInit {
  message = inject(NzMessageService);
  http = inject(HttpClient);
  // 任务列表
  taskList: TokenTask[] = [];
  // 加载状态
  loading = false;
  // 搜索关键词
  searchKeyword = '';
  // 视图模式：'card' 或 'table'
  viewMode = 'card';

  drawer = inject(NzDrawerService);

  ngOnInit() {
    this.loadTaskList();
  }

  // 加载任务列表
  loadTaskList(): void {
    this.loading = true;
    this.http
      .post<{ code: number; data: TokenTask[] }>('/admin/reward-tasks/list', {})
      .subscribe({
        next: (res) => {
          this.loading = false;
          this.taskList = res.data || [];
        },
        error: () => {
          this.message.error('获取任务列表失败');
          this.loading = false;
        },
      });
  }

  // 切换任务状态
  toggleTaskStatus(task: TokenTask): void {
    const params = {
      ...task,
      status: task.status === 1 ? 0 : 1, // 切换状态
      id: task.task_id,
    }
     this.http.post('/admin/reward-tasks/edit', params).subscribe({
          next: () => {
           task.status = task.status === 1 ? 0 : 1; // 更新本地状态
            this.message.success('任务状态更新成功');
          },
          error: () => {
            this.message.error('任务状态更新失败');
          },
        });

  }

  addTask() {
    const drawerRef = this.drawer.create({
      nzWidth: 520,
      nzTitle: '添加任务',
      nzContent: TaskAddComponent,
      nzWrapClassName: 'custom-drawer',
      nzMaskClosable: false,
      nzKeyboard: false,
      nzContentParams: {},
    });

    drawerRef.afterClose.subscribe((data) => {
      if (data) {
        this.message.success('任务添加成功');
        this.loadTaskList(); // 重新加载任务列表
      }
    });
  }

  editTask(task: TokenTask) {
    const drawerRef = this.drawer.create({
      nzWidth: 520,
      nzTitle: '编辑任务',
      nzContent: TaskAddComponent,
      nzWrapClassName: 'custom-drawer',
      nzMaskClosable: false,
      nzKeyboard: false,
      nzContentParams: {
        task, // 传递当前任务数据
      },
    });

    drawerRef.afterClose.subscribe((data) => {
      if (data) {
        this.loadTaskList(); // 重新加载任务列表
      }
    });

  }

  // 切换视图模式
  toggleViewMode() {
    this.viewMode = this.viewMode === 'card' ? 'table' : 'card';
  }

  // 筛选任务
  get filteredTasks(): TokenTask[] {
    if (!this.searchKeyword) {
      return this.taskList;
    }

    const keyword = this.searchKeyword.toLowerCase();
    return this.taskList.filter(
      task =>
        task.task_name.toLowerCase().includes(keyword) ||
        task.task_desc.toLowerCase().includes(keyword)
    );
  }
}
