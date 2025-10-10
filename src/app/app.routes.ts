import { Routes } from '@angular/router';
import { LayoutComponent } from './layouts/layout.component';
import { authGuard } from './guard/auth.guard';
import { ChangePasswordPageComponent } from './pages/change-password-page/change-password-page.component';
import { EnterOldPasswordComponent } from './components/enter-old-password/enter-old-password.component';
import { EnterNewPasswordComponent } from './components/enter-new-password/enter-new-password.component';
import { ConfirmNewPasswordComponent } from './components/confirm-new-password/confirm-new-password.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'token/task',
        loadComponent: () => import('./pages/token/token-task/token-task.component').then(m => m.TokenTaskComponent)
      },
      {
        path: 'token/consume-rules',
        loadComponent: () => import('./pages/token/token-consume-rules/token-consume-rules.component').then(m => m.TokenConsumeRulesComponent)
      },
      {
        path: 'recharge/plans',
        loadComponent: () => import('./pages/recharge/recharge-plans/recharge-plans.component').then(m => m.RechargePlansComponent)
      },
      {
        path: 'recharge/orders',
        loadComponent: () => import('./pages/recharge/recharge-orders/recharge-orders.component').then(m => m.RechargeOrdersComponent)
      },
      {
        path: 'system/config',
        loadComponent: () => import('./pages/system/system-config/system-config.component').then(m => m.SystemConfigComponent)
      },
      {
        path: 'user/management',
        loadComponent: () => import('./pages/user/user-management/user-management.component').then(m => m.UserManagementComponent)
      },
      {
        path: 'user/management/detail',
        loadComponent: () => import('./pages/user/user-management/user-detail/user-detail.component').then(m => m.UserDetailComponent)
      },
      {
        path: 'account/management',
        loadComponent: () => import('./pages/admin/admin-management/admin-management.component').then(m => m.AdminManagementComponent)
      },
      {
        path: 'goods/management',
        loadComponent: () => import('./pages/goods/goods-management/goods-management.component').then(m => m.GoodsManagementComponent)
      },
      {
        path: 'goods/price/:code',
        loadComponent: () => import('./pages/goods/goods-price/goods-price.component').then(m => m.GoodsPriceComponent)
      },
      {
        path: 'change-password',
        component: ChangePasswordPageComponent,
        children: [
          { path: '', redirectTo: 'step1', pathMatch: 'full' },
          { path: 'step1', component: EnterOldPasswordComponent },
          { path: 'step2', component: EnterNewPasswordComponent },
          { path: 'step3', component: ConfirmNewPasswordComponent },
        ]
      },
        { path: '', redirectTo: 'user/management', pathMatch: 'full' },
    ],
     canActivate: [ authGuard ],
  },

  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  }
];
