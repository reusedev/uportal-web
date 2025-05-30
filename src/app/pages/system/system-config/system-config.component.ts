import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PublicModule } from '../../../public.module';
import { HttpClient } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { FormsModule } from '@angular/forms';
import { ConfigAddComponent } from './config-add/config-add.component';

interface SystemConfig {
  config_key: string;   // 配置键名
  config_value: string; // 配置值
  description: string;  // 配置描述
}

@Component({
  standalone: true,
  selector: 'app-system-config',
  templateUrl: './system-config.component.html',
  styleUrls: ['./system-config.component.css'],
  imports: [CommonModule, RouterModule, PublicModule, FormsModule],
})
export class SystemConfigComponent implements OnInit {
  message = inject(NzMessageService);
  http = inject(HttpClient);
  drawer = inject(NzDrawerService);

  // 配置列表
  configList: SystemConfig[] = [];
  // 加载状态
  loading = false;
  // 搜索关键词
  searchKeyword = '';
  // 视图模式：'card' 或 'table'
  viewMode = 'table';

  ngOnInit() {
    this.loadConfigList();
  }

  // 加载配置列表
  loadConfigList(): void {
    this.loading = true;
    this.http.get<{ code: number; data: SystemConfig[] }>('/admin/configs').subscribe({
      next: (res) => {
        this.loading = false;
        this.configList = res.data || [];
      },
      error: () => {
        this.message.error('获取系统配置列表失败');
        this.loading = false;
      },
    });
  }

  // 删除配置
  deleteConfig(config: SystemConfig): void {
    this.http.post('/admin/configs/delete', { config_key: config.config_key }).subscribe({
      next: () => {
        this.message.success('配置删除成功');
        this.loadConfigList(); // 重新加载配置列表
      },
      error: () => {
        this.message.error('配置删除失败');
      },
    });
  }

  // 添加配置
  addConfig() {
    const drawerRef = this.drawer.create({
      nzWidth: 520,
      nzTitle: '添加系统配置',
      nzContent: ConfigAddComponent,
      nzWrapClassName: 'custom-drawer',
      nzMaskClosable: false,
      nzKeyboard: false,
      nzContentParams: {},
    });

    drawerRef.afterClose.subscribe((data) => {
      if (data) {
        this.message.success('配置添加成功');
        this.loadConfigList(); // 重新加载配置列表
      }
    });
  }

  // 编辑配置
  editConfig(config: SystemConfig) {
    const drawerRef = this.drawer.create({
      nzWidth: 520,
      nzTitle: '编辑系统配置',
      nzContent: ConfigAddComponent,
      nzWrapClassName: 'custom-drawer',
      nzMaskClosable: false,
      nzKeyboard: false,
      nzContentParams: {
        config, // 传递当前配置数据
      },
    });

    drawerRef.afterClose.subscribe((data) => {
      if (data) {
        this.message.success('配置更新成功');
        this.loadConfigList(); // 重新加载配置列表
      }
    });
  }

  // 筛选配置
  get filteredConfigs(): SystemConfig[] {
    if (!this.searchKeyword) {
      return this.configList;
    }

    const keyword = this.searchKeyword.toLowerCase();
    return this.configList.filter(
      config =>
        config.config_key.toLowerCase().includes(keyword) ||
        config.description.toLowerCase().includes(keyword) ||
        config.config_value.toLowerCase().includes(keyword)
    );
  }
}
