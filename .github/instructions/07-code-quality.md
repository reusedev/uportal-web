# 07 - Code Quality
*代码质量标准、测试与验证实践*

## 概述

本文档定义了项目的代码质量标准，包括编码规范、测试策略、性能优化和代码审查流程，确保代码的可维护性、可测试性和高性能。

## 代码质量原则

### 1. SOLID 原则
- **单一职责原则**：每个类、函数只负责一个功能
- **开闭原则**：对扩展开放，对修改封闭
- **里氏替换原则**：子类能够完全替换父类
- **接口隔离原则**：不依赖不需要的接口
- **依赖倒置原则**：依赖抽象而非具体实现

### 2. Angular 特定原则
- **信号优先**：优先使用 Signal API 实现响应式功能
- **组件单一职责**：每个组件专注于单一用户界面功能
- **服务职责分离**：数据服务、业务逻辑服务、工具服务分离
- **依赖注入**：合理使用 Angular 依赖注入系统

## 编码规范

### 1. TypeScript 规范

#### 类型定义
```typescript
// ✅ 推荐：明确的类型定义
interface UserProfile {
  readonly id: string;
  name: string;
  email: string;
  roles: readonly string[];
  createdAt: Date;
  updatedAt?: Date;
}

// ✅ 使用联合类型
type LoadingState = 'idle' | 'loading' | 'success' | 'error';

// ✅ 泛型约束
interface Repository<T extends { id: string }> {
  findById(id: string): Promise<T | null>;
  save(entity: T): Promise<T>;
}
```

#### 函数签名
```typescript
// ✅ 推荐：清晰的函数签名
function calculateTotalPrice(
  items: readonly PriceItem[],
  discountRate: number = 0,
  taxRate: number = 0.1
): Promise<number> {
  // 实现
}

// ✅ 使用函数重载
function processData(data: string): string;
function processData(data: number): number;
function processData(data: string | number): string | number {
  // 实现
}
```

### 2. Angular 组件规范

#### 组件结构
```typescript
@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="user-profile">
      <!-- 模板内容 -->
    </div>
  `,
  styles: [`
    .user-profile {
      /* 组件专用样式 */
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserProfileComponent {
  // 1. Signal 状态
  private readonly userService = inject(UserService);
  user = signal<UserProfile | null>(null);
  isLoading = signal(false);
  error = signal<string | null>(null);

  // 2. 计算属性
  isAdmin = computed(() => {
    const user = this.user();
    return user?.roles.includes('admin') ?? false;
  });

  // 3. 输入输出
  userId = input.required<string>();
  userUpdated = output<UserProfile>();

  // 4. 生命周期
  ngOnInit() {
    this.loadUser();
  }

  // 5. 方法（按功能分组）
  private async loadUser(): Promise<void> {
    // 实现
  }

  onSaveUser(user: UserProfile): void {
    // 实现
  }
}
```

#### 服务规范
```typescript
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly cache = new Map<string, UserProfile>();

  // 公共 API
  async getUserById(id: string): Promise<UserProfile | null> {
    // 检查缓存
    if (this.cache.has(id)) {
      return this.cache.get(id)!;
    }

    try {
      const user = await this.fetchUserFromApi(id);
      this.cache.set(id, user);
      return user;
    } catch (error) {
      this.handleError('Failed to fetch user', error);
      return null;
    }
  }

  // 私有方法
  private async fetchUserFromApi(id: string): Promise<UserProfile> {
    return firstValueFrom(
      this.http.get<UserProfile>(`/api/users/${id}`)
    );
  }

  private handleError(message: string, error: unknown): void {
    console.error(message, error);
    // 可添加错误报告逻辑
  }
}
```

### 3. 错误处理规范

#### 统一错误处理
```typescript
// 错误类型定义
class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly cause?: Error
  ) {
    super(message);
    this.name = 'AppError';
  }
}

// 错误处理服务
@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  handleError(error: unknown, context?: string): void {
    const appError = this.normalizeError(error);
    
    // 记录错误
    console.error(`[${context || 'Unknown'}]`, appError);
    
    // 用户通知
    this.notifyUser(appError);
    
    // 错误报告
    this.reportError(appError, context);
  }

  private normalizeError(error: unknown): AppError {
    if (error instanceof AppError) {
      return error;
    }
    
    if (error instanceof Error) {
      return new AppError(error.message, 'UNKNOWN_ERROR', error);
    }
    
    return new AppError(
      'An unexpected error occurred',
      'UNEXPECTED_ERROR'
    );
  }
}
```

#### 组件错误边界
```typescript
@Component({
  selector: 'app-error-boundary',
  template: `
    @if (hasError()) {
      <div class="error-boundary">
        <h3>Something went wrong</h3>
        <p>{{ errorMessage() }}</p>
        <button (click)="retry()" class="btn-primary">
          Try Again
        </button>
      </div>
    } @else {
      <ng-content></ng-content>
    }
  `
})
export class ErrorBoundaryComponent {
  hasError = signal(false);
  errorMessage = signal('');

  private readonly errorHandler = inject(ErrorHandlerService);

  handleError(error: unknown): void {
    this.hasError.set(true);
    this.errorMessage.set('An error occurred while loading content');
    this.errorHandler.handleError(error, 'ErrorBoundary');
  }

  retry(): void {
    this.hasError.set(false);
    this.errorMessage.set('');
  }
}
```

## 测试策略

### 1. 测试金字塔

```
      /\
     /  \
    / E2E \    <- 少量端到端测试
   /______\
  /        \
 / Integration \ <- 适量集成测试
/______________\
/              \
/ Unit Tests     \ <- 大量单元测试
/__________________\
```

### 2. 单元测试规范

#### 组件测试
```typescript
describe('UserProfileComponent', () => {
  let component: UserProfileComponent;
  let fixture: ComponentFixture<UserProfileComponent>;
  let userService: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    const userServiceSpy = jasmine.createSpyObj('UserService', ['getUserById']);

    await TestBed.configureTestingModule({
      imports: [UserProfileComponent],
      providers: [
        { provide: UserService, useValue: userServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserProfileComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
  });

  describe('User Loading', () => {
    it('should load user on init', async () => {
      // Arrange
      const mockUser: UserProfile = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        roles: ['user'],
        createdAt: new Date()
      };
      userService.getUserById.and.returnValue(Promise.resolve(mockUser));
      
      // Act
      fixture.componentRef.setInput('userId', '1');
      fixture.detectChanges();
      await fixture.whenStable();

      // Assert
      expect(component.user()).toEqual(mockUser);
      expect(component.isLoading()).toBe(false);
      expect(userService.getUserById).toHaveBeenCalledWith('1');
    });

    it('should handle user loading error', async () => {
      // Arrange
      userService.getUserById.and.returnValue(Promise.reject(new Error('Network error')));
      
      // Act
      fixture.componentRef.setInput('userId', '1');
      fixture.detectChanges();
      await fixture.whenStable();

      // Assert
      expect(component.user()).toBeNull();
      expect(component.error()).toBeTruthy();
      expect(component.isLoading()).toBe(false);
    });
  });

  describe('Computed Properties', () => {
    it('should compute isAdmin correctly', () => {
      // Arrange
      const adminUser: UserProfile = {
        id: '1',
        name: 'Admin User',
        email: 'admin@example.com',
        roles: ['admin', 'user'],
        createdAt: new Date()
      };

      // Act
      component.user.set(adminUser);

      // Assert
      expect(component.isAdmin()).toBe(true);
    });
  });
});
```

#### 服务测试
```typescript
describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getUserById', () => {
    it('should fetch user from API', async () => {
      // Arrange
      const mockUser: UserProfile = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        roles: ['user'],
        createdAt: new Date()
      };

      // Act
      const userPromise = service.getUserById('1');
      
      // Assert
      const req = httpMock.expectOne('/api/users/1');
      expect(req.request.method).toBe('GET');
      req.flush(mockUser);

      const user = await userPromise;
      expect(user).toEqual(mockUser);
    });

    it('should return cached user on second call', async () => {
      // Arrange
      const mockUser: UserProfile = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        roles: ['user'],
        createdAt: new Date()
      };

      // Act
      const firstCall = service.getUserById('1');
      const req = httpMock.expectOne('/api/users/1');
      req.flush(mockUser);
      await firstCall;

      const secondCall = await service.getUserById('1');

      // Assert
      expect(secondCall).toEqual(mockUser);
      httpMock.expectNone('/api/users/1'); // 不应再次请求API
    });
  });
});
```

### 3. 集成测试
```typescript
describe('User Management Integration', () => {
  let component: UserManagementComponent;
  let fixture: ComponentFixture<UserManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        UserManagementComponent,
        HttpClientTestingModule,
        RouterTestingModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserManagementComponent);
    component = fixture.componentInstance;
  });

  it('should complete user creation workflow', async () => {
    // Arrange
    const newUser = {
      name: 'New User',
      email: 'newuser@example.com'
    };

    // Act
    component.createUser(newUser);
    fixture.detectChanges();
    await fixture.whenStable();

    // Assert
    expect(component.users()).toContain(jasmine.objectContaining(newUser));
    expect(component.isCreating()).toBe(false);
  });
});
```

## 性能优化

### 1. 变更检测优化
```typescript
@Component({
  // 使用 OnPush 策略
  changeDetection: ChangeDetectionStrategy.OnPush,
  // ...
})
export class OptimizedComponent {
  // 使用 Signal 实现高效的响应式更新
  data = signal<Data[]>([]);
  
  // 使用 computed 缓存计算结果
  filteredData = computed(() => {
    return this.data().filter(item => item.active);
  });

  // 使用 TrackBy 优化列表渲染
  trackByFn = (index: number, item: Data) => item.id;
}
```

### 2. 懒加载实现
```typescript
// 路由懒加载
const routes: Routes = [
  {
    path: 'admin',
    loadComponent: () => import('./admin/admin.component')
      .then(m => m.AdminComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'users',
    loadChildren: () => import('./users/users.routes')
      .then(m => m.USERS_ROUTES)
  }
];

// 组件懒加载
@Component({
  template: `
    @defer (when shouldLoadChart) {
      <app-chart [data]="chartData()"></app-chart>
    } @placeholder {
      <div class="chart-placeholder">Loading chart...</div>
    }
  `
})
export class DashboardComponent {
  shouldLoadChart = signal(false);
  chartData = signal<ChartData>([]);
}
```

### 3. 内存泄漏防护
```typescript
@Component({
  // ...
})
export class ComponentWithCleanup implements OnDestroy {
  private readonly destroyRef = inject(DestroyRef);
  
  ngOnInit() {
    // 自动清理订阅
    interval(1000)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(val => console.log(val));
    
    // 手动清理示例
    const subscription = this.someObservable$.subscribe();
    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }
}
```

## 代码审查流程

### 1. 审查清单

#### 功能性审查
- [ ] 功能实现符合需求
- [ ] 错误处理完整
- [ ] 边界条件考虑
- [ ] 性能影响评估

#### 代码质量审查
- [ ] 遵循编码规范
- [ ] 适当的类型注解
- [ ] 合理的函数拆分
- [ ] 适当的注释说明

#### Angular 特定审查
- [ ] 使用 Signal API
- [ ] OnPush 变更检测
- [ ] 适当的依赖注入
- [ ] 资源清理实现

#### 测试覆盖
- [ ] 单元测试覆盖核心逻辑
- [ ] 边界条件测试
- [ ] 错误场景测试
- [ ] 集成测试（如需要）

### 2. 自动化质量检查

#### ESLint 配置
```json
{
  "extends": [
    "@angular-eslint/recommended",
    "@typescript-eslint/recommended"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "@angular-eslint/prefer-on-push-component-change-detection": "error",
    "@angular-eslint/use-lifecycle-interface": "error"
  }
}
```

#### Prettier 配置
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
```

## 质量度量

### 1. 代码覆盖率
- **目标覆盖率**: 80% 以上
- **关键模块**: 90% 以上
- **测试命令**: `ng test --code-coverage`

### 2. 性能指标
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **Bundle Size**: < 500KB (gzipped)

### 3. 代码复杂度
- **圈复杂度**: 函数不超过 10
- **文件行数**: 单文件不超过 400 行
- **函数行数**: 单函数不超过 50 行

## 工具推荐

### 1. VS Code 扩展
- Angular Language Service
- ESLint
- Prettier
- Auto Rename Tag
- TypeScript Importer

### 2. 构建工具
```bash
# 安装开发依赖
pnpm add -D @angular-eslint/builder
pnpm add -D @angular-eslint/eslint-plugin
pnpm add -D @angular-eslint/eslint-plugin-template
pnpm add -D @angular-eslint/template-parser
```

### 3. 质量检查脚本
```json
{
  "scripts": {
    "lint": "ng lint",
    "lint:fix": "ng lint --fix",
    "test:coverage": "ng test --code-coverage",
    "build:analyze": "ng build --stats-json && npx webpack-bundle-analyzer dist/stats.json"
  }
}
```

## 相关文档

- [项目架构](./01-project-architecture.md) - 了解整体架构设计
- [Signal API](./02-signal-api.md) - 掌握现代 Angular API
- [组件开发](./03-component-development.md) - 组件开发最佳实践
- [依赖管理](./06-dependency-management.md) - 依赖质量标准

---

*最后更新: 2025-05-23*
