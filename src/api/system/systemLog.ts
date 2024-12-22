import { PORT1 } from "@/api/config/servicePort";
import http from "@/api";
import { ResPage } from "@/api/interface/index";

// 字典列表
export const getSysLogList = (params: LogsQuery) => {
  return http.get<ResPage<LogsBody[]>>(PORT1 + `/logs/page`, params, { loading: false }); // 正常 post json 请求  ==>  application/json
};

export interface LogsBody {
  id: string;
  module: string;
  content: string;
  requestUri: string;
  method: string;
  ip: string;
  region: string;
  browser: string;
  os: string;
  executionTime: string;
  createBy: string;
  createTime: string;
  operator: string;
}

/** 查询参数 */
export interface LogsQuery extends PageQuery {
  /** 搜索关键字 */
  keywords?: string;
  /** 状态 */
  startTime?: string;
  endTime?: string;
}
