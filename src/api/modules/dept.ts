import { PORT1 } from "@/api/config/servicePort";
import http from "@/api";
import { ResPage, User } from "@/api/interface/index";

const DeptAPI = {
  /**
   * 获取部门列表
   *
   * @param queryParams 查询参数（可选）
   * @returns 部门树形表格数据
   */
  getList(queryParams?: DeptQuery) {
    return http.get<DeptVO[]>(PORT1 + `/dept/tree`, queryParams, { loading: false });
    /* return request<any, DeptVO[]>({
      url: `${PORT1}`,
      method: "get",
      params: queryParams
    }); */
  },

  /** 获取部门下拉列表 */
  getOptions() {
    return http.get<OptionType[]>(PORT1 + `/dept/options`, {}, { loading: false });

    /* return request<any, OptionType[]>({
      url: `${PORT1}/options`,
      method: "get"
    }); */
  },

  /**
   * 获取部门表单数据
   *
   * @param id 部门ID
   * @returns 部门表单数据
   */
  getFormData(id: number) {
    return http.get<DeptForm>(PORT1 + `/dept/form`, { id: id }, { loading: false });
    /* return request<any, DeptForm>({
      url: `${PORT1}/${id}/form`,
      method: "get"
    }); */
  },

  /**
   * 新增部门
   *
   * @param data 部门表单数据
   * @returns 请求结果
   */
  add(data: DeptForm) {
    return http.post<DeptForm>(PORT1 + `/dept`, data, { loading: false });
    /*  return request({
      url: `${PORT1}`,
      method: "post",
      data: data
    }); */
  },

  /**
   * 修改部门
   *
   * @param id 部门ID
   * @param data 部门表单数据
   * @returns 请求结果
   */
  update(id: string, data: DeptForm) {
    return http.put<DeptForm>(PORT1 + `/dept/${id}`, data, { loading: false });
    /*  return request({
      url: `${PORT1}/${id}`,
      method: "put",
      data: data
    }); */
  },

  /**
   * 删除部门
   *
   * @param ids 部门ID，多个以英文逗号(,)分隔
   * @returns 请求结果
   */
  deleteByIds(ids: string) {
    return http.delete<DeptForm>(PORT1 + `/dept/${ids}`, {}, { loading: false });
    /*  return request({
      url: `${PORT1}/${ids}`,
      method: "delete"
    }); */
  }
};

export default DeptAPI;

export const getDepartmentList = () => {
  return http.get<ResPage<User.ResDepartment[]>>(PORT1 + `/department/list`, {}, { cancel: false });
};

/** 部门查询参数 */
export interface DeptQuery {
  /** 搜索关键字 */
  keywords?: string;
  /** 状态 */
  status?: number;
}

/** 部门类型 */
export interface DeptVO {
  /** 子部门 */
  children?: DeptVO[];
  /** 创建时间 */
  createTime?: Date;
  /** 部门ID */
  id?: number;
  /** 部门名称 */
  name?: string;
  /** 部门编号 */
  code?: string;
  /** 父部门ID */
  parentId?: number;
  /** 排序 */
  sort?: number;
  /** 状态(1:启用；0:禁用) */
  status?: number;
  /** 修改时间 */
  updateTime?: Date;
}

/** 部门表单类型 */
export interface DeptForm {
  /** 部门ID(新增不填) */
  id?: string;
  /** 部门名称 */
  name?: string;
  /** 部门编号 */
  code?: string;
  /** 父部门ID */
  parentId: string;
  /** 排序 */
  sort?: number;
  /** 状态(1:启用；0：禁用) */
  status?: number;
}
