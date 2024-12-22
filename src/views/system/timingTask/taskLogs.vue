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
        <el-button type="danger" :icon="Delete" plain :disabled="!scope.isSelected" @click="batchDelete(scope.selectedListIds)">
          批量删除
        </el-button>
      </template>
    </ProTable>
  </div>
</template>

<script setup lang="tsx" name="timingTask">
import { ref, reactive } from "vue";
import { useHandleData } from "@/hooks/useHandleData";
import { useAuthButtons } from "@/hooks/useAuthButtons";
import { ElMessage /* , ElMessageBox */ } from "element-plus";
import ProTable from "@/components/ProTable/index.vue";
import { ProTableInstance, ColumnProps /* , HeaderRenderScope */ } from "@/components/ProTable/interface";
import { Delete } from "@element-plus/icons-vue";
import { deleteUser } from "@/api/modules/user";
import { getTaskLogsList, TaskBody } from "@/api/system/task";
import { taskLogStatus } from "@/utils/dict";

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
  return getTaskLogsList(newParams);
};

// 页面按钮权限（按钮权限既可以使用 hooks，也可以直接使用 v-auth 指令，指令适合直接绑定在按钮上，hooks 适合根据按钮权限显示不同的内容）
const { BUTTONS } = useAuthButtons();

// 自定义渲染表头（使用tsx语法）
/* const headerRender = (scope: HeaderRenderScope<TaskBody>) => {
  return (
    <el-button type="primary" onClick={() => ElMessage.success("我是通过 tsx 语法渲染的表头")}>
      {scope.column.label}
    </el-button>
  );
}; */

// 表格配置项
const columns = reactive<ColumnProps<TaskBody>[]>([
  { type: "selection", fixed: "left", width: 70 },
  {
    prop: "id",
    label: "任务ID"
    /* search: { el: "input", tooltip: "我是搜索提示" },
    render: scope => {
      return (
        <el-button type="primary" link onClick={() => ElMessage.success("我是通过 tsx 语法渲染的内容")}>
          {scope.row.name}
        </el-button>
      );
    } */
  },
  { prop: "taskName", label: "任务名称", width: 120, search: { el: "input" } },
  { prop: "jobAction", label: "执行动作" },
  {
    prop: "status",
    label: "执行状态",
    enum: taskLogStatus,
    search: { el: "tree-select", props: { filterable: true } },
    fieldNames: { label: "label", value: "value" },
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
              {scope.row.status == 0 ? "异常" : "正常"}
            </el-tag>
          )}
        </>
      );
    }
  },
  { prop: "creatorTime", label: "创建时间", width: 180 },
  { prop: "description", label: "结果描述", width: 280 }
]);

// 表格拖拽排序
const sortTable = ({ newIndex, oldIndex }: { newIndex?: number; oldIndex?: number }) => {
  console.log(newIndex, oldIndex);
  console.log(proTable.value?.tableData);
  ElMessage.success("修改列表排序成功");
};

// 批量删除用户信息
const batchDelete = async (id: string[]) => {
  console.log(id);
  await useHandleData(deleteUser, { id }, "删除所选用户信息");
  proTable.value?.clearSelection();
  proTable.value?.getTableList();
};
</script>
