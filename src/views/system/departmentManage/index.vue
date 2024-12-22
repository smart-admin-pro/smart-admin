<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      :columns="columns"
      :request-api="getTableList"
      :init-param="initParam"
      :data-callback="dataCallback"
      @drag-sort="sortTable"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader="scope">
        <el-button type="primary" :icon="CirclePlus" @click="openDrawer('新增')">新增部门</el-button>
        <el-button type="danger" :icon="Delete" plain :disabled="!scope.isSelected" @click="batchDelete(scope.selectedListIds)">
          批量删除
        </el-button>
      </template>
      <!-- Expand -->
      <template #expand="scope">
        <el-table
          ref="multipleTableRef"
          :data="scope.row.children"
          style="width: 100%"
          row-key="id"
          size="small"
          :show-header="false"
          @selection-change="handleSelectionChange"
          border
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        >
          <el-table-column type="selection" width="60" />
          <el-table-column type="index" width="85" />
          <el-table-column prop="name" label="Name" />
          <el-table-column prop="status" label="status">
            <template #default="item">
              {{ item.row.status == 1 ? "启用" : "禁用" }}
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="createTime" />
          <el-table-column prop="updateTime" label="updateTime" />
          <el-table-column label="操作" min-width="240">
            <template #default="scoped">
              <el-button size="small" type="primary" link :icon="CirclePlus" @click="openDrawer('新增', scoped.row)">
                新增
              </el-button>
              <el-button size="small" type="primary" link :icon="EditPen" @click="openDrawer('编辑', scoped.row)">编辑</el-button>
              <el-button size="small" type="primary" link :icon="View" @click="openDrawer('查看', scoped.row)">查看</el-button>
              <el-button size="small" type="primary" link :icon="Delete" @click="deleteAccount(scoped.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <!-- usernameHeader -->
      <template #usernameHeader="scope">
        <el-button type="primary" @click="ElMessage.success('我是通过作用域插槽渲染的表头')">
          {{ scope.column.label }}
        </el-button>
      </template>
      <!-- createTime -->
      <template #createTime="scope">
        <el-button type="primary" link @click="ElMessage.success('我是通过作用域插槽渲染的内容')">
          {{ scope.row.createTime }}
        </el-button>
      </template>
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button type="primary" link :icon="CirclePlus" @click="openDrawer('新增', scope.row)">新增</el-button>
        <el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑', scope.row)">编辑</el-button>
        <el-button type="primary" link :icon="View" @click="openDrawer('查看', scope.row)">查看</el-button>
        <el-button type="primary" link :icon="Delete" @click="deleteAccount(scope.row)">删除</el-button>
      </template>
    </ProTable>
    <DeptDrawer ref="drawerRef" />
  </div>
</template>

<script setup lang="tsx" name="useProTable">
import { ref, reactive } from "vue";
// import { useRouter } from "vue-router";
import { User } from "@/api/interface";
import { useHandleData } from "@/hooks/useHandleData";
import { useAuthButtons } from "@/hooks/useAuthButtons";
import { ElMessage /* , ElMessageBox */ } from "element-plus";
import ProTable from "@/components/ProTable/index.vue";
import DeptDrawer from "@/views/system/departmentManage/deptDrawer.vue";
import { ProTableInstance, ColumnProps, HeaderRenderScope } from "@/components/ProTable/interface";
import { CirclePlus, Delete, EditPen, /* Download, Upload, */ View } from "@element-plus/icons-vue";
import {
  getUserList,
  deleteUser,
  editUser,
  addUser,
  changeUserStatus,
  getUserStatus,
  getUserDepartment
} from "@/api/modules/user";

import { getDepartmentList } from "@/api/modules/dept";

const multipleSelection = ref<User.ResDepartment[]>();
const handleSelectionChange = (val: User.ResDepartment[]) => {
  multipleSelection.value = val;
};
// ProTable 实例
const proTable = ref<ProTableInstance>();

// 如果表格需要初始化请求参数，直接定义传给 ProTable (之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)
const initParam = reactive({ type: 1 });

// dataCallback 是对于返回的表格数据做处理，如果你后台返回的数据不是 list && total 这些字段，可以在这里进行处理成这些字段
// 或者直接去 hooks/useTable.ts 文件中把字段改为你后端对应的就行
const dataCallback = (data: any) => {
  return {
    list: data.list,
    total: data.total
  };
};

// 如果你想在请求之前对当前请求参数做一些操作，可以自定义如下函数：params 为当前所有的请求参数（包括分页），最后返回请求列表接口
// 默认不做操作就直接在 ProTable 组件上绑定	:requestApi="getUserList"
const getTableList = (params: any) => {
  let newParams = JSON.parse(JSON.stringify(params));
  newParams.createTime && (newParams.startTime = newParams.createTime[0]);
  newParams.createTime && (newParams.endTime = newParams.createTime[1]);
  console.log(params);
  getUserList(newParams).then(res => {
    console.log(res);
  });
  // delete newParams.createTime;
  // return getUserList(newParams);
  return getDepartmentList();
  return getUserDepartment();
};

// 页面按钮权限（按钮权限既可以使用 hooks，也可以直接使用 v-auth 指令，指令适合直接绑定在按钮上，hooks 适合根据按钮权限显示不同的内容）
const { BUTTONS } = useAuthButtons();

// 自定义渲染表头（使用tsx语法）
const headerRender = (scope: HeaderRenderScope<User.ResDepartment>) => {
  return (
    <el-button type="primary" onClick={() => ElMessage.success("我是通过 tsx 语法渲染的表头")}>
      {scope.column.label}
    </el-button>
  );
};

// 表格配置项
const columns = reactive<ColumnProps<User.ResDepartment>[]>([
  { type: "selection", fixed: "left", width: 60 },
  // { type: "sort", label: "Sort", width: 80 },
  { type: "expand", label: "Expand", width: 85 },
  {
    prop: "name",
    label: "部门名称",
    search: { el: "input", tooltip: "我是搜索提示" },
    render: scope => {
      return (
        <el-button type="primary" link onClick={() => ElMessage.success("我是通过 tsx 语法渲染的内容")}>
          {scope.row.name}
        </el-button>
      );
    }
  },
  {
    prop: "status",
    label: "部门状态",
    enum: getUserStatus,
    search: { el: "tree-select", props: { filterable: true } },
    fieldNames: { label: "userLabel", value: "userStatus" },
    render: scope => {
      return (
        <>
          {BUTTONS.value.status ? (
            <el-switch
              model-value={scope.row.status}
              active-text={scope.row.status ? "启用" : "禁用"}
              active-value={1}
              inactive-value={0}
              onClick={() => changeStatus(scope.row)}
            />
          ) : (
            <el-tag type={scope.row.status ? "success" : "danger"}>{scope.row.status ? "启用" : "禁用"}</el-tag>
          )}
        </>
      );
    }
  },
  {
    prop: "createTime",
    label: "创建时间",
    headerRender,
    width: 180,
    search: {
      el: "date-picker",
      span: 2,
      props: { type: "datetimerange", valueFormat: "YYYY-MM-DD HH:mm:ss" },
      defaultValue: ["2022-11-12 11:35:00", "2022-12-12 11:35:00"]
    }
  },
  {
    prop: "updateTime",
    label: "修改时间",
    width: 180,
    search: {
      el: "date-picker",
      span: 2,
      props: { type: "datetimerange", valueFormat: "YYYY-MM-DD HH:mm:ss" },
      defaultValue: ["2022-11-12 11:35:00", "2022-12-12 11:35:00"]
    }
  },
  { prop: "operation", label: "操作", fixed: "right", width: 330 }
]);

// 表格拖拽排序
const sortTable = ({ newIndex, oldIndex }: { newIndex?: number; oldIndex?: number }) => {
  console.log(newIndex, oldIndex);
  console.log(proTable.value?.tableData);
  ElMessage.success("修改列表排序成功");
};

// 删除用户信息
const deleteAccount = async (params: User.ResDepartment) => {
  await useHandleData(deleteUser, { id: [params.id] }, `删除【${params.name}】部门`);
  proTable.value?.getTableList();
};

// 批量删除用户信息
const batchDelete = async (id: string[]) => {
  console.log(id);
  await useHandleData(deleteUser, { id }, "删除所选部门信息");
  proTable.value?.clearSelection();
  proTable.value?.getTableList();
};

// 切换状态
const changeStatus = async (row: User.ResDepartment) => {
  await useHandleData(changeUserStatus, { id: row.id, status: row.status == 1 ? 0 : 1 }, `切换【${row.name}】部门状态`);
  proTable.value?.getTableList();
};

// 打开 drawer(新增、查看、编辑)
const drawerRef = ref<InstanceType<typeof DeptDrawer> | null>(null);
const openDrawer = (title: string, row: Partial<User.ResDepartment> = {}) => {
  const params = {
    title,
    isView: title === "查看",
    row: { ...row },
    api: title === "新增" ? addUser : title === "编辑" ? editUser : undefined,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.parentParams(params);
};
</script>
