import { Component, inject, Input, OnInit } from '@angular/core';
import { PublicModule } from '../../../../public.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';
import { format, parse } from 'date-fns';
import { NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  standalone: true,
  selector: 'app-task-add',
  templateUrl: './task-add.component.html',
  styleUrls: ['./task-add.component.css'],
  imports: [PublicModule, NgIf],
})
export class TaskAddComponent implements OnInit {
  @Input() task!: TokenTask;

  drawerRef = inject(NzDrawerRef);
  fb = inject(FormBuilder);
  http = inject(HttpClient);
  message = inject(NzMessageService);

  validateForm!: FormGroup;

  loading = false;

  ngOnInit() {
    console.log(this.task);
    if (this.task) {
      // 如果有传入任务数据，则初始化表单
      this.validateForm = this.fb.group({
        task_name: [this.task.task_name, [Validators.required]],
        task_desc: [this.task.task_desc],
        token_reward: [
          this.task.token_reward,
          [Validators.required, Validators.min(1)],
        ],
        daily_limit: [
          this.task.daily_limit,
          [Validators.required, Validators.min(1)],
        ],
        interval_seconds: [
          this.task.interval_seconds,
          [Validators.required, Validators.min(0)],
        ],
        valid_date: [
          this.task.valid_date.map((date) =>
            parse(date, 'yyyy-MM-dd', new Date())
          ),
          [Validators.required],
        ],
        repeatable: [this.task.repeatable, [Validators.required]],
        status: [this.task.status], // 默认为禁用状态
      });
    } else {
      this.validateForm = this.fb.group({
        task_name: [null, [Validators.required]],
        task_desc: [null],
        token_reward: [null, [Validators.required, Validators.min(1)]],
        daily_limit: [null, [Validators.required, Validators.min(1)]],
        interval_seconds: [null, [Validators.required, Validators.min(0)]],
        valid_date: [[], [Validators.required]],
        repeatable: [1, [Validators.required]],
        status: [0], // 默认为禁用状态
      });
    }
  }

  close() {
    this.drawerRef.close(false);
  }

  submit() {
    if (this.validateForm.valid) {
      this.loading = true;

      const { valid_date } = this.validateForm.value;
      const dates = valid_date.map((item: Date) => format(item, 'yyyy-MM-dd'));
      const formData = {
        ...this.validateForm.value,
        valid_date: dates,
      };

      if (this.task) {
        // 如果有传入任务数据，则更新任务
        formData['id'] = this.task.task_id;
        this.http.post('/admin/reward-tasks/edit', formData).subscribe({
          next: () => {
            this.drawerRef.close(true);
            this.message.success('任务编辑成功');
            this.loading = false;
          },
          error: () => {
            this.drawerRef.close(false);
            this.message.error('任务编辑失败');
            this.loading = false;
          },
        });
      } else {
        this.http.post('/admin/reward-tasks/create', formData).subscribe({
          next: () => {
            this.drawerRef.close(true);
            this.message.success('任务添加成功');
            this.loading = false;
          },
          error: () => {
            this.drawerRef.close(false);
            this.message.error('任务添加失败');
            this.loading = false;
          },
        });
      }
    } else {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
}
