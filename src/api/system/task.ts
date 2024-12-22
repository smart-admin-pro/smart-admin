import { PORT1 } from "@/api/config/servicePort";
import http from "@/api";
import { ResPage } from "@/api/interface/index";
import { ResultData } from "@/api/interface";

// 任务列表
export const getTaskList = (params: TaskQuery) => {
  return http.get<ResPage<TaskBody[]>>(PORT1 + `/task/list`, params, { loading: false }); // 正常 post json 请求  ==>  application/json
};

// 任务日志列表
export const getTaskLogsList = (params: TaskLogQuery) => {
  return http.get<ResPage<TaskLogBody[]>>(PORT1 + `/task/logs`, params, { loading: false }); // 正常 post json 请求  ==>  application/json
};

// 查看任务日志列表
export const getTaskLogItem = (params: TaskLogQuery) => {
  return http.get<TaskLogBody[]>(PORT1 + `/task/itemLog`, params, { loading: false }); // 正常 post json 请求  ==>  application/json
};

// 任务地址
export const getTaskAddress = () => {
  return http.get<ResultData<TaskAddress[]>>(PORT1 + `/task/address`, {}, { loading: false }); // 正常 post json 请求  ==>  application/json
};

export interface TaskBody {
  companyId: string;
  creatorTime: string;
  creatorUserId: string;
  cron: string;
  deleteMark: boolean;
  deleteTime: string;
  deleteUserId: string;
  deptId: string;
  description: string;
  emailAddress: string;
  enabledMark: boolean;
  endTime: string;
  errorCount: number;
  groupName: string;
  id: string;
  isLocal: boolean;
  jobCallAddress: string;
  jobCallParams: string;
  lastErrorTime: string;
  lastModifyTime: string;
  lastModifyUserId: string;
  lastRunTime: string;
  nextRunTime: string;
  runCount: number;
  sendMail: number;
  startTime: string;
  status: number;
  taskName: string;
  isSendMail?: string;
  dateTime?: string[];
}

/** 查询参数 */
export interface TaskQuery extends PageQuery {
  /** 搜索关键字 */
  keywords?: string;
  /** 状态 */
  startTime?: string;
  endTime?: string;
  order?: string;
  sort?: string;
}

export interface TaskLogBody {
  creatorTime: string;
  description: string;
  id: string;
  jobAction: string;
  status: boolean;
  taskId: string;
  taskName: string;
  color?: string;
}

export interface TaskAddress {
  [key: string]: string;
}

/** 查询参数 */
export interface TaskLogQuery extends TaskQuery {}
