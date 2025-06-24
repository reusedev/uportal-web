import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PublicModule } from '../../../public.module';
import { NzMessageService } from 'ng-zorro-antd/message';
import { HttpClient } from '@angular/common/http';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { RechargePlanAddComponent } from './recharge-plan-add/recharge-plan-add.component';

@Component({
  standalone: true,
  selector: 'app-recharge-plans',
  templateUrl: './recharge-plans.component.html',
  styleUrls: ['./recharge-plans.component.css'],
  imports: [CommonModule, RouterModule, PublicModule],
})
export class RechargePlansComponent implements OnInit {
  message = inject(NzMessageService);
  http = inject(HttpClient);
  drawer = inject(NzDrawerService);

  // 充值方案列表
  planList: RechargePlan[] = [];
  // 加载状态
  loading = false;
  // 状态筛选
  statusFilter: number | null = null;
  // 视图模式：'card' 或 'table'
  viewMode = 'card';

  ngOnInit() {
    this.loadPlanList();
  }

  // 加载充值方案列表
  loadPlanList(): void {
    this.loading = true;

    // 构建请求参数，只包含status筛选
    const params: any = {};
    if (this.statusFilter !== null) {
      params.status = this.statusFilter;
    }

    this.http
      .post<{ code: number; data: RechargePlan[] }>('/admin/recharge-plans/list', params)
      .subscribe({
        next: (res) => {
          this.loading = false;
          this.planList = res.data || [];
        },
        error: () => {
          this.message.error('获取充值方案列表失败');
          this.loading = false;
        },
      });
  }

  // 状态筛选变化
  onStatusFilterChange(): void {
    this.loadPlanList();
  }

  // 切换方案状态
  togglePlanStatus(plan: RechargePlan): void {
    const params = {
      plan_id: plan.plan_id,
      status: plan.status === 1 ? 0 : 1, // 切换状态
    };

    this.http.post('/admin/recharge-plans/edit', params).subscribe({
      next: () => {
        plan.status = plan.status === 1 ? 0 : 1; // 更新本地状态
        this.message.success('充值方案状态更新成功');
      },
      error: () => {
        this.message.error('充值方案状态更新失败');
      },
    });
  }

  // 添加充值方案
  addPlan() {
    const drawerRef = this.drawer.create({
      nzWidth: 520,
      nzTitle: '添加充值方案',
      nzContent: RechargePlanAddComponent,
      nzWrapClassName: 'custom-drawer',
      nzMaskClosable: false,
      nzKeyboard: false,
      nzContentParams: {},
    });

    drawerRef.afterClose.subscribe((data) => {
      if (data) {
        this.message.success('充值方案添加成功');
        this.loadPlanList(); // 重新加载列表
      }
    });
  }

  // 编辑充值方案
  editPlan(plan: RechargePlan) {
    const drawerRef = this.drawer.create({
      nzWidth: 520,
      nzTitle: '编辑充值方案',
      nzContent: RechargePlanAddComponent,
      nzWrapClassName: 'custom-drawer',
      nzMaskClosable: false,
      nzKeyboard: false,
      nzContentParams: {
        plan, // 传递当前方案数据
      },
    });

    drawerRef.afterClose.subscribe((data) => {
      if (data) {
        this.loadPlanList(); // 重新加载列表
      }
    });
  }

  // 切换视图模式
  toggleViewMode() {
    this.viewMode = this.viewMode === 'card' ? 'table' : 'card';
  }

  // 筛选方案
  get filteredPlans(): RechargePlan[] {
    if (this.statusFilter === null) {
      return this.planList;
    }

    return this.planList.filter(plan => plan.status === this.statusFilter);
  }
}
