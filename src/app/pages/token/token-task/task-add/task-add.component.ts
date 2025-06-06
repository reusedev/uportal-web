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

        valid_from: [
          this.task.valid_from
            ? parse(this.task.valid_from, 'yyyy-MM-dd', new Date())
            : null,
          [Validators.required],
        ],
        valid_to: [
          this.task.valid_to
            ? parse(this.task.valid_to, 'yyyy-MM-dd', new Date())
            : null,
        ],
        repeatable: [this.task.repeatable, [Validators.required]],
        status: [this.task.status], // 默认为禁用状态
        task_key: [this.task.task_key, [Validators.required,Validators.pattern(/^[a-zA-Z][a-zA-Z0-9_]*$/)]],
      });

      // 如果是编辑模式，禁用task_key字段
      this.validateForm.get('task_key')?.disable();
    } else {
      this.validateForm = this.fb.group({
        task_name: [null, [Validators.required]],
        task_desc: [null],
        token_reward: [null, [Validators.required, Validators.min(1)]],
        daily_limit: [null, [Validators.required, Validators.min(1)]],
        interval_seconds: [null, [Validators.required, Validators.min(0)]],
        valid_from: [null, [Validators.required]],
        valid_to: [null],
        repeatable: [1, [Validators.required]],
        status: [0], // 默认为禁用状态
        task_key: [null, [Validators.required,Validators.pattern(/^[a-zA-Z][a-zA-Z0-9_]*$/)]],
      });
    }
  }

  close() {
    this.drawerRef.close(false);
  }

  submit() {
    if (this.validateForm.valid) {
      this.loading = true;

      const { valid_from, valid_to } = this.validateForm.value;

      const formData = {
        ...this.validateForm.value,
        valid_from: format(valid_from, 'yyyy-MM-dd'),
        valid_to: valid_to ? format(valid_to, 'yyyy-MM-dd') : null,
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
