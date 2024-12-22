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
        <el-button type="danger" :icon="Delete" plain :disabled="!scope.isSelected" @click="batchDelete(scope.selectedListIds)">
          批量删除
        </el-button>
      </template>
      <!-- usernameHeader -->
      <template #usernameHeader="scope">
        <el-button type="primary" @click="ElMessage.success('我是通过作用域插槽渲染的表头')">
          {{ scope.column.label }}
        </el-button>
      </template>
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑', scope.row)">编辑</el-button>
        <el-button type="primary" link :icon="Delete" @click="deleteDictData(scope.row)">删除</el-button>
      </template>
    </ProTable>
    <DictDetailDrawer ref="dictDetailDrawerRef"></DictDetailDrawer>
  </div>
</template>

<script setup lang="tsx" name="dictDetail">
import { onMounted, reactive, ref, onActivated } from "vue";
import ProTable from "@/components/ProTable/index.vue";
import { DictDataBody, getDictDataList, addDictData, editDictData } from "@/api/modules/dict";
import { CirclePlus, Delete, EditPen } from "@element-plus/icons-vue";
import { ProTableInstance, ColumnProps /* , HeaderRenderScope */ } from "@/components/ProTable/interface";
import { ElMessage } from "element-plus";
import { useAuthButtons } from "@/hooks/useAuthButtons";
// import { useRoute } from "vue-router";
import { getUserStatus, changeUserStatus } from "@/api/modules/user";
import { useHandleData } from "@/hooks/useHandleData";
import DictDetailDrawer from "./dictDetailDrawer.vue";
// const route = useRoute();
// ProTable 实例
const proTable = ref<ProTableInstance>();
const getTableList = (params: any) => {
  let newParams = JSON.parse(JSON.stringify(params));
  newParams.dictCode = history.state.dictCode;
  return getDictDataList(newParams);
};

const dictDetailDrawerRef = ref<InstanceType<typeof DictDetailDrawer> | null>(null);
const openDrawer = (title: string, row: Partial<DictDataBody> = {}) => {
  console.log(row);
  console.log(title);
  const params = {
    title,
    isView: false, //用于是否显示确认按钮，常用于查看
    row: { ...row },
    api: title === "新增" ? addDictData : title === "编辑" ? editDictData : undefined,
    getTableList: proTable.value?.getTableList
  };
  dictDetailDrawerRef.value?.parentParams(params);
};
const deleteDictData = (row: DictDataBody) => {
  console.log(row);
};
const batchDelete = (ids: string[] | number[]) => {
  console.log(ids);
};
// 页面按钮权限（按钮权限既可以使用 hooks，也可以直接使用 v-auth 指令，指令适合直接绑定在按钮上，hooks 适合根据按钮权限显示不同的内容）
const { BUTTONS } = useAuthButtons();
// dataCallback 是对于返回的表格数据做处理，如果你后台返回的数据不是 list && total 这些字段，可以在这里进行处理成这些字段
// 或者直接去 hooks/useTable.ts 文件中把字段改为你后端对应的就行
const dataCallback = (data: any) => {
  return {
    list: data.list,
    total: data.total
  };
};

// 表格拖拽排序
const sortTable = ({ newIndex, oldIndex }: { newIndex?: number; oldIndex?: number }) => {
  console.log(newIndex, oldIndex);
  console.log(proTable.value?.tableData);
  ElMessage.success("修改列表排序成功");
};
// 如果表格需要初始化请求参数，直接定义传给 ProTable (之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)
const initParam = reactive({ dictCode: history.state.dictCode });
// 表格配置项
const columns = reactive<ColumnProps<DictDataBody>[]>([
  { type: "selection", fixed: "left", width: 70 },
  {
    prop: "label",
    label: "字典标签",
    search: { el: "input" }
  },
  { prop: "value", label: "字典值", search: { el: "input" } },
  { prop: "sort", label: "排序" },
  {
    prop: "status",
    label: "状态",
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
  { prop: "operation", label: "操作", fixed: "right", width: 180 }
]);
// 切换用户状态
const changeStatus = async (row: any) => {
  await useHandleData(changeUserStatus, { id: row.id, status: row.status == 1 ? 0 : 1 }, `切换【${row.name}】状态`);
  proTable.value?.getTableList();
};
onActivated(() => {
  // 利用history 获取命名路由state获取参数 且在keepalive中刷新数据
  if (history.state.dictCode) {
    initParam.dictCode = history.state.dictCode;
    // 修改tags 失败 待做
    /* route.meta.title = `【${history.state.title}】字典数据`;
    route.meta.activeMenu = `【${history.state.title}】字典数据`; */
  }
});
onMounted(() => {
  // console.log(history.state.dictCode);
});
</script>
