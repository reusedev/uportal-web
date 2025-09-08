// 代币任务数据接口
interface TokenTask {
  task_id: number;
  task_name: string;
  task_desc: string;
  token_reward: number;
  daily_limit: number;
  interval_seconds: number;
  repeatable: number; // 0: 不可重复, 1: 可重复
  status: number; // 0: 禁用, 1: 启用
  valid_from:string;
  valid_to:string;
  task_key: string;
  logo:{
    id:string;
    url:string;
  },
  action:string;
  params:string
  action_text:string;
}

// 代币消费特性数据接口
interface TokenFeature {
  feature_id: number;
  feature_name: string;
  feature_desc: string;
  token_cost: number;
  feature_code: string;
  status: number; // 0: 禁用, 1: 启用
  classify: string; // 可选分类字段
}

// 用户数据接口
interface User {
  id: string;
  phone: string;
  email: string;
  nickname: string;
  avatar: string;
  status: number; // 0: 禁用, 1: 启用
  token_balance: number;
  created_at: string;
  last_login_at: string;
  language?: string;
  updated_at?: string;
  auth_providers?: string[];
}

// 用户登录日志接口
interface LoginLog {
  log_id: number;
  login_time: string;
  login_method: string;
  login_platform: string;
  ip_address: string;
  device_info: string;
}

// 代币记录接口
interface TokenRecord {
  record_id: number;
  change_amount: number;
  balance_after: number;
  change_type: string;
  task_id?: number;
  task_name?: string;
  change_time: string;
  remark: string;
  created_at: string;
}

// 充值方案接口
interface RechargePlan {
  plan_id: number;
  token_amount: number;
  price: number;
  currency: string;
  description: string;
  status: number; // 0: 禁用, 1: 启用
  created_at: string;
  name: string; // 新增名称字段
  tag: string; // 新增标签字段
  is_recommend: number; // 新增推荐字段，默认为 false
}

// 充值订单接口
interface RechargeOrder {
  order_id: number;
  user_id: number;
  nickname: string;
  plan_id: number;
  plan_name?: string;
  token_amount: number;
  amount_paid: number;
  payment_method: string;
  status: number; // 0: 待支付, 1: 支付成功, 2: 支付失败, 3: 已退款
  transaction_id: string;
  created_at: string;
  paid_at: string;
}

// 商品数据接口
interface Goods {
  id: string;
  name: string;
  code: string;
  price: number;
  status: number; // 0: 禁用, 1: 启用
  desc?: string;
  cover_pic?: {
    id: string;
    url: string;
  };
}
