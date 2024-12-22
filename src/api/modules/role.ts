// import request from "@/utils/request";
import { PORT1 } from "@/api/config/servicePort";
import http from "@/api";

const RoleAPI = {
  /** 获取角色分页数据 */
  getPage(queryParams?: RolePageQuery) {
    return http.get<PageResult<RolePageVO[]>>(`${PORT1}/roles/page`, queryParams, { loading: false });
    /*  return request<any, PageResult<RolePageVO[]>>({
      url: `${PORT1}/roles/page`,
      method: "get",
      params: queryParams
    }); */
  },

  /** 获取角色下拉数据源 */
  getOptions() {
    return http.get<OptionType[]>(`${PORT1}/roles/options`, {}, { loading: false });
    /* return request<any, OptionType[]>({
      url: `${PORT1}/options`,
      method: "get"
    }); */
  },
  /**
   * 获取角色的菜单ID集合
   *
   * @param roleId 角色ID
   * @returns 角色的菜单ID集合
   */
  getRoleMenuIds(roleId: number) {
    return http.get<number[]>(`${PORT1}/roles/${roleId}/menuIds`, {}, { loading: false });
    /*  return request<any, number[]>({
      url: `${PORT1}/${roleId}/menuIds`,
      method: "get"
    }); */
  },

  /**
   * 分配菜单权限
   *
   * @param roleId 角色ID
   * @param data 菜单ID集合
   */
  updateRoleMenus(roleId: number, data: number[]) {
    return http.put(`${PORT1}/roles/${roleId}/menus`, data, { loading: false });
    /* return request({
      url: `${PORT1}/${roleId}/menus`,
      method: "put",
      data: data
    }); */
  },

  /**
   * 获取角色表单数据
   *
   * @param id 角色ID
   * @returns 角色表单数据
   */
  getFormData(id: number) {
    return http.get<RoleForm>(`${PORT1}/roles/${id}/form`, {}, { loading: false });
    /* return request<any, RoleForm>({
      url: `${PORT1}/${id}/form`,
      method: "get"
    }); */
  },

  /** 添加角色 */
  add(data: RoleForm) {
    return http.post(`${PORT1}/roles`, data, { loading: false });
    /* return request({
      url: `${PORT1}`,
      method: "post",
      data: data
    }); */
  },

  /**
   * 更新角色
   *
   * @param id 角色ID
   * @param data 角色表单数据
   */
  update(id: number, data: RoleForm) {
    return http.put(`${PORT1}/roles/${id}`, data, { loading: false });
    /* return request({
      url: `${PORT1}/${id}`,
      method: "put",
      data: data
    }); */
  },

  /**
   * 批量删除角色，多个以英文逗号(,)分割
   *
   * @param ids 角色ID字符串，多个以英文逗号(,)分割
   */
  deleteByIds(ids: string) {
    return http.delete(`${PORT1}/roles/${ids}`, {}, { loading: false });
    /* return request({
      url: `${PORT1}/${ids}`,
      method: "delete"
    }); */
  }
};

export default RoleAPI;

export const getRoleList = () => {
  return http.get<RolePageVO[]>(PORT1 + `/roles/page`);
};

/** 角色分页查询参数 */
export interface RolePageQuery extends PageQuery {
  /** 搜索关键字 */
  keywords?: string;
}

/** 角色分页对象 */
export interface RolePageVO {
  /** 角色编码 */
  code?: string;
  /** 角色ID */
  id?: number;
  /** 角色名称 */
  name?: string;
  /** 排序 */
  sort?: number;
  /** 角色状态 */
  status?: number;
  /** 创建时间 */
  createTime?: Date;
  /** 修改时间 */
  updateTime?: Date;
}

/** 角色表单对象 */
export interface RoleForm {
  /** 角色ID */
  id?: number;
  /** 角色编码 */
  code?: string;
  /** 数据权限 */
  dataScope?: number;
  /** 角色名称 */
  name?: string;
  /** 排序 */
  sort?: number;
  /** 角色状态(1-正常；0-停用) */
  status?: number;
}
