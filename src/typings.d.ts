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
}

// 代币消费特性数据接口
interface TokenFeature {
  feature_id: number;
  feature_name: string;
  feature_desc: string;
  token_cost: number;
  feature_code: string;
  status: number; // 0: 禁用, 1: 启用
}

// 用户数据接口
interface User {
  id: string;
  phone: string;
  email: string;
  nickname: string;
  avatar_url: string;
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
}
