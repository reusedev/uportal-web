import { Component } from '@angular/core';
import { PageContainerComponent } from '../../components/page-container/page-container.component';
import { CardComponent } from '../../components/card/card.component';
import { ButtonComponent } from '../../components/button/button.component';
import { InputComponent } from '../../components/input/input.component';
import { ModalComponent } from '../../components/modal/modal.component';
import { BadgeComponent } from '../../components/badge/badge.component';

export interface Task {
  name: string;
  desc: string;
  status: 'online' | 'offline';
}

export interface Rule {
  name: string;
  desc: string;
  status: 'online' | 'offline';
}

export interface ActionButton {
  label: string;
  type?: 'primary' | 'secondary' | 'danger';
}

@Component({
  selector: 'app-token',
  standalone: true,
  imports: [
    PageContainerComponent,
    CardComponent,
    ButtonComponent,
    InputComponent,
    ModalComponent,
    BadgeComponent
  ],
  templateUrl: './token.component.html',
  styleUrl: './token.component.css'
})
export class TokenComponent {
  // 任务管理相关
  taskColumns = [
    { key: 'name', label: '任务名称' },
    { key: 'desc', label: '描述' },
    { key: 'status', label: '状态' },
    { key: 'actions', label: '操作' }
  ];
  taskList: Task[] = [];
  taskModalOpen = false;
  editingTask: Task | null = null;

  // 规则管理相关
  ruleColumns = [
    { key: 'name', label: '规则名称' },
    { key: 'desc', label: '描述' },
    { key: 'status', label: '状态' },
    { key: 'actions', label: '操作' }
  ];
  ruleList: Rule[] = [];
  ruleModalOpen = false;
  editingRule: Rule | null = null;

  openTaskModal() { this.taskModalOpen = true; this.editingTask = null; }
  editTask(task: Task) { this.editingTask = task; this.taskModalOpen = true; }
  toggleTaskStatus(task: Task) { /* 状态切换逻辑后续补充 */ }

  taskActions: ActionButton[] = [
    {
      label: '编辑',
      type: 'primary',
    },
    {
      label: '上下线',
      type: 'secondary',
    }
  ];

  openRuleModal() { this.ruleModalOpen = true; this.editingRule = null; }
  editRule(rule: Rule) { this.editingRule = rule; this.ruleModalOpen = true; }
  toggleRuleStatus(rule: Rule) { /* 状态切换逻辑后续补充 */ }

  ruleActions: ActionButton[] = [
    {
      label: '编辑',
      type: 'primary',
    },
    {
      label: '上下线',
      type: 'secondary',
    }
  ];
}
