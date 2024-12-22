// ? 系统全局字典

/**
 * @description：用户性别
 */
export const genderType = [
  { label: "男", value: 1 },
  { label: "女", value: 2 }
];

/**
 * @description：用户状态
 */
export const userStatus = [
  { label: "启用", value: 1, tagType: "success" },
  { label: "禁用", value: 0, tagType: "danger" }
];

export const taskStatus = [
  { label: "暂停", value: 2, tagType: "warning" },
  { label: "运行中", value: 1, tagType: "success" },
  { label: "终止", value: 0, tagType: "danger" }
];

export const taskLogStatus = [
  { label: "正常", value: 1, tagType: "success" },
  { label: "异常", value: 0, tagType: "danger" }
];

export const menuType = [
  { label: "菜单", value: 0 },
  { label: "按钮", value: 1 }
];
