declare global {
  interface Navigator {
    msSaveOrOpenBlob: (blob: Blob, fileName: string) => void;
    browserLanguage: string;
  }
  /**
   * 下拉选项数据类型
   */
  interface OptionType {
    /** 值 */
    value: string | number;
    /** 文本 */
    label: string;
    /** 子列表  */
    children?: OptionType[];
  }
  /**
   * 分页响应对象
   */
  interface PageResult<T> {
    /** 数据列表 */
    list: T[];
    /** 总数 */
    total: number;
  }
  /**
   * 分页查询参数
   */
  interface PageQuery {
    pageNum: number;
    pageSize: number;
  }
  const ElMessage: (typeof import("element-plus/es"))["ElMessage"];
  const ElMessageBox: (typeof import("element-plus/es"))["ElMessageBox"];
  const ElForm: (typeof import("element-plus/es"))["ElForm"];
  const useDebounceFn: (typeof import("@vueuse/core"))["useDebounceFn"];
  const useVModel: (typeof import("@vueuse/core"))["useVModel"];
  const ElTree: (typeof import("element-plus/es"))["ElTree"];
}

export {};
