<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      title="菜单列表"
      row-key="path"
      :indent="20"
      :columns="columns"
      :data="menuData"
      @search="handleSearch"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-button type="primary" :icon="CirclePlus" @click="openMenuDrawer('新增')">新增菜单 </el-button>
      </template>
      <!-- 菜单图标 -->
      <template #icon="scope">
        <el-icon :size="18">
          <component :is="scope.row.meta.icon"></component>
        </el-icon>
      </template>
      <!-- 菜单操作 -->
      <template #operation="scope">
        <el-button type="primary" link :icon="CirclePlus" @click="openMenuDrawer('添加子项', scope.row)"> 添加子项 </el-button>
        <el-button type="primary" link :icon="EditPen" @click="openMenuDrawer('编辑', scope.row)"> 编辑 </el-button>
        <el-button type="primary" link :icon="Delete"> 删除 </el-button>
      </template>
    </ProTable>
    <MenuDrawer ref="menuDrawerRef" />
  </div>
</template>

<script setup lang="ts" name="menuMange">
import { ref } from "vue";
import { ColumnProps } from "@/components/ProTable/interface";
import { Delete, EditPen, CirclePlus } from "@element-plus/icons-vue";
import authMenuList from "@/assets/json/authMenuList.json";
import ProTable from "@/components/ProTable/index.vue";
import MenuDrawer from "@/views/system/menuMange/menuDrawer.vue";

const proTable = ref();

const menuData = ref(authMenuList.data);

const handleSearch = () => {
  console.log(proTable.value.searchParam);
};
const menuDrawerRef = ref<InstanceType<typeof MenuDrawer> | null>(null);
const openMenuDrawer = (title: string, row: Partial<Menu.MenuBody> = {}) => {
  const params = {
    title,
    isView: title === "查看",
    row: { ...row },
    api: /* title === "新增" ? addUser : title === "编辑" ? editUser : */ undefined,
    getTableList: proTable.value?.getTableList
  };
  menuDrawerRef.value?.parentParams(params);
};
// 表格配置项
const columns: ColumnProps[] = [
  { prop: "meta.title", label: "菜单名称", width: 200, align: "left", search: { el: "input" } },
  { prop: "meta.icon", label: "菜单图标" },
  { prop: "name", label: "菜单编码", search: { el: "input" } },
  { prop: "path", label: "菜单路径", width: 300, search: { el: "input" } },
  { prop: "component", label: "组件路径", width: 300 },
  { prop: "operation", label: "操作", width: 250, fixed: "right" }
];
</script>
