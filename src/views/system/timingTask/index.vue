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
        <el-button type="primary" :icon="CirclePlus" @click="openDrawer('新增')">新增</el-button>
        <!--  <el-button v-auth="'batchAdd'" type="primary" :icon="Upload" plain @click="batchAdd">批量添加用户</el-button>
        <el-button v-auth="'export'" type="primary" :icon="Download" plain @click="downloadFile">导出用户数据</el-button> -->
        <el-button type="danger" :icon="Delete" plain :disabled="!scope.isSelected" @click="batchDelete(scope.selectedListIds)">
          批量删除任务
        </el-button>
      </template>
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button type="primary" link :icon="View" @click="openTaskLogsView('查看日志', scope.row)">查看日志</el-button>
        <el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑', scope.row)">编辑</el-button>
        <el-button type="danger" link :icon="Delete" @click="deleteItem(scope.row)">删除</el-button>
      </template>
    </ProTable>
    <TaskDrawer ref="taskDrawerRef" />
    <TaskDialog ref="taskDialogRef"></TaskDialog>
  </div>
</template>

<script setup lang="tsx" name="timingTask">
import { ref, reactive } from "vue";
import { useHandleData } from "@/hooks/useHandleData";
// import { useDownload } from "@/hooks/useDownload";
import { useAuthButtons } from "@/hooks/useAuthButtons";
import { ElMessage /* , ElMessageBox */ } from "element-plus";
import ProTable from "@/components/ProTable/index.vue";
// import ImportExcel from "@/components/ImportExcel/index.vue";
import TaskDrawer from "@/views/system/timingTask/taskDrawer.vue";
import TaskDialog from "@/views/system/timingTask/taskDialog.vue";
import { ProTableInstance, ColumnProps /* , HeaderRenderScope */ } from "@/components/ProTable/interface";
import { CirclePlus, Delete, EditPen, /* Download, Upload, */ View } from "@element-plus/icons-vue";
import { deleteUser, editUser, addUser } from "@/api/modules/user";
import { getTaskList, TaskBody } from "@/api/system/task";
import { taskStatus } from "@/utils/dict";

// ProTable 实例
const proTable = ref<ProTableInstance>();

// 如果表格需要初始化请求参数，直接定义传给 ProTable (之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)
const initParam = reactive({});

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
  delete newParams.createTime;
  // return getUserList(newParams);
  return getTaskList(newParams);
};

// 页面按钮权限（按钮权限既可以使用 hooks，也可以直接使用 v-auth 指令，指令适合直接绑定在按钮上，hooks 适合根据按钮权限显示不同的内容）
const { BUTTONS } = useAuthButtons();

// 表格配置项
const columns = reactive<ColumnProps<TaskBody>[]>([
  { type: "selection", fixed: "left", width: 70 },
  // { prop: "sort", label: "Sort", width: 80 },
  {
    prop: "id",
    label: "任务ID"
  },
  { prop: "taskName", label: "任务名称", width: 120, search: { el: "input" } },
  { prop: "groupName", label: "分组名称", width: 120 },
  { prop: "Corn表达式", label: "corn" },
  {
    prop: "status",
    label: "状态",
    enum: taskStatus,
    search: { el: "tree-select", props: { filterable: true } },
    fieldNames: { label: "label", value: "value" },
    width: 90,
    render: scope => {
      return (
        <>
          {BUTTONS.value.status ? (
            {
              /*  <el-switch
              model-value={scope.row.status}
              active-text={scope.row.status ? "启用" : "禁用"}
              active-value={1}
              inactive-value={0}
              onClick={() => changeStatus(scope.row)}
            /> */
            }
          ) : (
            <el-tag type={scope.row.status == 0 ? "danger" : scope.row.status == 1 ? "success" : "warning"}>
              {scope.row.status == 0 ? "终止" : scope.row.status == 1 ? "运行中" : "暂停"}
            </el-tag>
          )}
        </>
      );
    }
  },
  { prop: "description", label: "简述" },
  { prop: "jobCallAddress", label: "任务地址", width: 180 },
  { prop: "startTime", label: "任务开始时间", width: 180 },
  { prop: "endTime", label: "任务结束时间", width: 180 },
  { prop: "lastRunTime", label: "最近执行时间", width: 180 },
  { prop: "nextRunTime", label: "下次执行时间", width: 180 },
  { prop: "runCount", label: "执行次数", width: 120 },
  { prop: "errorCount", label: "出错次数", width: 120 },
  { prop: "lastErrorTime", label: "出错时间", width: 180 },
  {
    prop: "enabledMark",
    label: "是否启用",
    width: 120,
    render: scope => {
      return (
        <>
          {BUTTONS.value.status ? (
            <el-switch
              model-value={scope.row.status}
              active-text={scope.row.status ? "是" : "否"}
              active-value={1}
              inactive-value={0}
              onClick={() => changeStatus(scope.row)}
            />
          ) : (
            <el-tag type={scope.row.status ? "danger" : "success"}>{scope.row.status ? "是" : "否"}</el-tag>
          )}
        </>
      );
    }
  },
  {
    prop: "deleteMark",
    label: "是否删除",
    width: 120,
    render: scope => {
      return (
        <>
          {BUTTONS.value.status ? (
            <el-switch
              model-value={scope.row.status}
              active-text={scope.row.status ? "是" : "否"}
              active-value={1}
              inactive-value={0}
              onClick={() => changeStatus(scope.row)}
            />
          ) : (
            <el-tag type={scope.row.status ? "danger" : "success"}>{scope.row.status ? "是" : "否"}</el-tag>
          )}
        </>
      );
    }
  },
  { prop: "creatorTime", label: "创建时间", width: 180 },
  { prop: "lastModifyTime", label: "更新时间", width: 180 },
  { prop: "operation", label: "操作", fixed: "right", width: 260 }
]);

// 表格拖拽排序
const sortTable = ({ newIndex, oldIndex }: { newIndex?: number; oldIndex?: number }) => {
  console.log(newIndex, oldIndex);
  console.log(proTable.value?.tableData);
  ElMessage.success("修改列表排序成功");
};

// 删除
const deleteItem = async (params: TaskBody) => {
  console.log(params);
  // await useHandleData(deleteUser, { id: [params.id] }, `删除【${params.name}】角色`);
  proTable.value?.getTableList();
};

// 批量删除用户信息
const batchDelete = async (id: string[]) => {
  console.log(id);
  await useHandleData(deleteUser, { id }, "删除所选用户信息");
  proTable.value?.clearSelection();
  proTable.value?.getTableList();
};

// 切换状态
const changeStatus = async (row: TaskBody) => {
  console.log(row);
  // await useHandleData(changeUserStatus, { id: row.id, status: row.status == 1 ? 0 : 1 }, `切换【${row.name}】状态`);
  proTable.value?.getTableList();
};

// 导出用户列表
/* const downloadFile = async () => {
  ElMessageBox.confirm("确认导出用户数据?", "温馨提示", { type: "warning" }).then(() =>
    useDownload(exportUserInfo, "用户列表", proTable.value?.searchParam)
  );
}; */

// 批量添加用户
// const dialogRef = ref<InstanceType<typeof ImportExcel> | null>(null);
/* const batchAdd = () => {
  const params = {
    title: "用户",
    tempApi: exportUserInfo,
    importApi: BatchAddUser,
    getTableList: proTable.value?.getTableList
  };
  dialogRef.value?.acceptParams(params);
};
 */
// 打开 drawer(新增、查看、编辑)
const taskDrawerRef = ref<InstanceType<typeof TaskDrawer> | null>(null);
const openDrawer = (title: string, row: Partial<TaskBody> = {}) => {
  const params = {
    title,
    isView: title === "查看",
    row: { ...row },
    api: title === "新增" ? addUser : title === "编辑" ? editUser : undefined,
    getTableList: proTable.value?.getTableList
  };
  taskDrawerRef.value?.parentParams(params);
};

const taskDialogRef = ref<InstanceType<typeof TaskDialog> | null>(null);
const openTaskLogsView = (title: string, row: Partial<TaskBody> = {}) => {
  const params = {
    title,
    isView: true,
    row: { ...row }
    // api: getTaskLogItem
    // getTableList: proTable.value?.getTableList
  };
  taskDialogRef.value?.parentParams(params);
};
</script>
