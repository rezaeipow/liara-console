export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  twoFAEnabled?: boolean;
  emailVerified?: boolean;
}

export interface Account {
  id: string;
  name: string;
}

export interface Project {
  id: string;
  accountId: string;
  name: string;
  region: string;
  plan: string;
  createdAt: string;
}

export interface AppService {
  id: string;
  projectId: string;
  name: string;
  region: string;
  plan: string;
  status: "running" | "failed" | "deploying";
}

export interface Deployment {
  id: string;
  appId: string;
  version: string;
  status: "success" | "failed" | "running";
  createdAt: string;
}

export interface EnvVar {
  key: string;
  value: string;
  secret?: boolean;
}

export interface Vm {
  id: string;
  projectId: string;
  name: string;
  status: "running" | "stopped";
  cpu: number;
  ram: number;
  disk: number;
}

export interface Payment {
  id: string;
  amount: number;
  createdAt: string;
  status: "success" | "failed";
}

export interface Invoice {
  id: string;
  amount: number;
  createdAt: string;
  status: "paid" | "unpaid";
}

export interface TicketReply {
  id: string;
  body: string;
  createdAt: string;
  author: "user" | "support";
}

export interface Ticket {
  id: string;
  subject: string;
  category: string;
  body: string;
  status: "open" | "pending" | "closed";
  createdAt: string;
  replies: TicketReply[];
}

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
}
