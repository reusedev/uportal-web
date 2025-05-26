import { Component, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { PageContainerComponent, CardComponent } from '../../components';

/**
 * 仪表盘组件
 *
 * 显示系统概览信息，包括统计数据和最近活动
 */
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [PageContainerComponent, CardComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {
  /** 页面标题 */
  protected readonly pageTitle = signal<string>('仪表盘');

  /** 页面描述 */
  protected readonly pageDescription = signal<string>('欢迎来到用户门户仪表盘');

  /** 统计数据 */
  protected readonly stats = signal([
    {
      id: 'users',
      label: '总用户数',
      value: 1234,
      icon: 'ri-user-line',
      color: 'blue',
      trend: '+12%'
    },
    {
      id: 'uptime',
      label: '系统运行状态',
      value: '89.5%',
      icon: 'ri-bar-chart-line',
      color: 'green',
      trend: '+2.1%'
    },
    {
      id: 'sessions',
      label: '活跃会话',
      value: 456,
      icon: 'ri-pulse-line',
      color: 'purple',
      trend: '+8%'
    }
  ]);

  /** 最近活动数据 */
  protected readonly activities = signal([
    {
      id: 1,
      message: '用户 John Doe 登录了系统',
      timestamp: '2 分钟前',
      type: 'login',
      color: 'blue'
    },
    {
      id: 2,
      message: '系统备份完成',
      timestamp: '15 分钟前',
      type: 'backup',
      color: 'green'
    },
    {
      id: 3,
      message: '新版本更新可用',
      timestamp: '1 小时前',
      type: 'update',
      color: 'yellow'
    }
  ]);

  /** 计算属性：格式化统计数据 */
  protected readonly formattedStats = computed(() => {
    return this.stats().map(stat => ({
      ...stat,
      displayValue: typeof stat.value === 'number'
        ? stat.value.toLocaleString()
        : stat.value,
      colorClasses: this.getColorClasses(stat.color)
    }));
  });

  /** 计算属性：格式化活动数据 */
  protected readonly formattedActivities = computed(() => {
    return this.activities().map(activity => ({
      ...activity,
      dotColorClass: this.getDotColorClass(activity.color)
    }));
  });

  /**
   * 获取颜色样式类
   * @param color 颜色名称
   * @returns 颜色样式类对象
   */
  private getColorClasses(color: string) {
    const colorMap = {
      blue: {
        text: 'text-blue-600',
        icon: 'text-blue-600'
      },
      green: {
        text: 'text-green-600',
        icon: 'text-green-600'
      },
      purple: {
        text: 'text-purple-600',
        icon: 'text-purple-600'
      }
    };

    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  }

  /**
   * 获取活动点颜色类
   * @param color 颜色名称
   * @returns 颜色样式类
   */
  private getDotColorClass(color: string): string {
    const colorMap = {
      blue: 'bg-blue-600',
      green: 'bg-green-600',
      yellow: 'bg-yellow-600',
      red: 'bg-red-600'
    };

    return colorMap[color as keyof typeof colorMap] || 'bg-gray-600';
  }
}
