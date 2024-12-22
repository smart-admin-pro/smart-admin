import { PORT1 } from "@/api/config/servicePort";
import http from "@/api";
import { ResPage } from "@/api/interface/index";

// 字典列表
export const getDictList = (params: DictQuery) => {
  return http.get<ResPage<DictBody[]>>(PORT1 + `/dict/page`, params, { loading: false }); // 正常 post json 请求  ==>  application/json
};
// 字典数据列表
export const getDictDataList = (params: DictDataQuery) => {
  return http.get<ResPage<DictDataBody[]>>(PORT1 + `/dict-data/page`, params, { loading: false }); // 正常 post json 请求  ==>  application/json
};
export const addDictData = (params: any) => {
  return http.post(PORT1 + `/dict-data/add`, params);
};
export const editDictData = (params: any) => {
  return http.post(PORT1 + `/dict-data/edit`, params);
};
/** 字典查询参数 */
export interface DictQuery extends PageQuery {
  /** 搜索关键字 */
  keywords?: string;
  /** 状态 */
  status?: number;
}

export interface DictBody {
  dictCode: string;
  id: string;
  name: string;
  status: number;
}

export interface DictDataQuery extends PageQuery {
  dictCode: string;
}

export interface DictDataBody {
  dictCode: string;
  id: string;
  label: string;
  sort: number;
  status: number;
  value: string;
}
