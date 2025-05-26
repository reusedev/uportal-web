import { Routes } from '@angular/router';
import { LayoutComponent } from './layouts';
import { TokenComponent } from './pages/token/token.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', component: DashboardComponent },
      { path: 'token', component: TokenComponent },
      // 其他路由将在这里添加
      { path: '**', redirectTo: 'dashboard' },
    ]
  }
];
