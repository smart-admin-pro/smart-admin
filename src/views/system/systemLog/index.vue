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
    </ProTable>
  </div>
</template>

<script setup lang="tsx" name="systemLog">
import { ref, reactive } from "vue";
import { ElMessage /* , ElMessageBox */ } from "element-plus";
import ProTable from "@/components/ProTable/index.vue";
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import { getSysLogList, LogsBody, LogsQuery } from "@/api/system/systemLog";

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
const getTableList = (params: LogsQuery) => {
  let newParams = JSON.parse(JSON.stringify(params));
  newParams.createTime && (newParams.startTime = newParams.createTime[0]);
  newParams.createTime && (newParams.endTime = newParams.createTime[1]);
  console.log(newParams);
  delete newParams.createTime;
  return getSysLogList(newParams);
};

// 表格配置项
const columns = reactive<ColumnProps<LogsBody>[]>([
  { type: "selection", fixed: "left", width: 60 },
  { type: "sort", label: "Sort", width: 80 },
  {
    prop: "keywords",
    label: "关键字",
    search: { el: "input" },
    isShow: false
  },
  {
    prop: "createTime",
    label: "操作时间",
    width: 180,
    search: {
      el: "date-picker",
      span: 2,
      props: { type: "datetimerange", valueFormat: "YYYY-MM-DD HH:mm:ss" },
      defaultValue: []
    }
  },
  {
    width: 100,
    prop: "operator",
    label: "操作人"
  },
  {
    width: 100,
    prop: "module",
    label: "日志模块"
  },
  {
    width: 150,
    prop: "content",
    label: "日志内容"
  },
  {
    width: 150,
    prop: "ip",
    label: "IP地址"
  },
  {
    width: 180,
    prop: "region",
    label: "地区"
  },
  {
    width: 150,
    prop: "browser",
    label: "浏览器"
  },
  {
    // width: 180,
    prop: "os",
    label: "终端系统"
  },
  {
    width: 130,
    prop: "executionTime",
    label: "执行时间(ms)"
  }
]);

// 表格拖拽排序
const sortTable = ({ newIndex, oldIndex }: { newIndex?: number; oldIndex?: number }) => {
  console.log(newIndex, oldIndex);
  console.log(proTable.value?.tableData);
  ElMessage.success("修改列表排序成功");
};
</script>
