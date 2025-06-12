import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PublicModule } from '../../../public.module';
import { NzMessageService } from 'ng-zorro-antd/message';
import { HttpClient } from '@angular/common/http';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { TokenFeatureAddComponent } from './token-feature-add/token-feature-add.component';

@Component({
  standalone: true,
  selector: 'app-token-consume-rules',
  templateUrl: './token-consume-rules.component.html',
  styleUrls: ['./token-consume-rules.component.css'],
  imports: [CommonModule, RouterModule, PublicModule],
})
export class TokenConsumeRulesComponent implements OnInit {
  message = inject(NzMessageService);
  http = inject(HttpClient);
  drawer = inject(NzDrawerService);

  // 特性列表
  featureList: TokenFeature[] = [];
  // 加载状态
  loading = false;
  // 搜索关键词
  searchKeyword = '';
  // 视图模式：'card' 或 'table'
  viewMode = 'card';

  ngOnInit() {
    this.loadFeatureList();
  }

  // 加载特性列表
  loadFeatureList(): void {
    this.loading = true;
    this.http
      .post<{ code: number; data: TokenFeature[] }>('/admin/token-consume-rules/list', {})
      .subscribe({
        next: (res) => {
          this.loading = false;
          this.featureList = res.data || [];
        },
        error: () => {
          this.message.error('获取代币消费规则列表失败');
          this.loading = false;
        },
      });
  }

  // 切换特性状态
  toggleFeatureStatus(feature: TokenFeature): void {
    const params = {
      ...feature,
      status: feature.status === 1 ? 0 : 1, // 切换状态
    };

    this.http.post('/admin/token-consume-rules/update', params).subscribe({
      next: () => {
        feature.status = feature.status === 1 ? 0 : 1; // 更新本地状态
        this.message.success('特性状态更新成功');
      },
      error: () => {
        this.message.error('特性状态更新失败');
      },
    });
  }

  // 添加特性
  addFeature() {
    const drawerRef = this.drawer.create({
      nzWidth: 520,
      nzTitle: '添加代币消费规则',
      nzContent: TokenFeatureAddComponent,
      nzWrapClassName: 'custom-drawer',
      nzMaskClosable: false,
      nzKeyboard: false,
      nzContentParams: {},
    });

    drawerRef.afterClose.subscribe((data) => {
      if (data) {
        this.message.success('代币消费规则添加成功');
        this.loadFeatureList(); // 重新加载特性列表
      }
    });
  }

  // 编辑特性
  editFeature(feature: TokenFeature) {
    const drawerRef = this.drawer.create({
      nzWidth: 520,
      nzTitle: '编辑代币消费规则',
      nzContent: TokenFeatureAddComponent,
      nzWrapClassName: 'custom-drawer',
      nzMaskClosable: false,
      nzKeyboard: false,
      nzContentParams: {
        feature, // 传递当前特性数据
      },
    });

    drawerRef.afterClose.subscribe((data) => {
      if (data) {
        this.loadFeatureList(); // 重新加载特性列表
      }
    });
  }

  // 切换视图模式
  toggleViewMode() {
    this.viewMode = this.viewMode === 'card' ? 'table' : 'card';
  }

  // 筛选特性
  get filteredFeatures(): TokenFeature[] {
    if (!this.searchKeyword) {
      return this.featureList;
    }

    const keyword = this.searchKeyword.toLowerCase();
    return this.featureList.filter(
      feature =>
        feature.feature_name.toLowerCase().includes(keyword) ||
        feature.feature_desc.toLowerCase().includes(keyword) ||
        feature.feature_code.toLowerCase().includes(keyword) ||
        (feature.classify && feature.classify.toLowerCase().includes(keyword))
    );
  }
}
