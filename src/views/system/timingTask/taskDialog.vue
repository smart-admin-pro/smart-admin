<template>
  <el-dialog v-model="centerDialogVisible" :title="drawerProps.title" width="800" destroy-on-close>
    <div style="height: 500px; overflow: auto">
      <el-timeline style="max-width: 600px">
        <!-- :color="activity.Color" -->
        <el-timeline-item
          v-for="(activity, index) in activities"
          :key="index"
          :type="activity.description.includes('异常') ? 'danger' : 'success'"
          size="large"
          :timestamp="activity.creatorTime"
        >
          {{ activity.description }}
        </el-timeline-item>
      </el-timeline>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="centerDialogVisible = false"> close </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup name="TaskDialog">
import { ref, defineExpose } from "vue";
import { TaskBody, getTaskLogItem, TaskLogBody } from "@/api/system/task";

const centerDialogVisible = ref(false);

interface DrawerProps {
  title: string;
  isView: boolean;
  row: Partial<TaskBody>;
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
}
const drawerProps = ref<DrawerProps>({
  isView: false,
  title: "",
  row: {}
});
const activities = ref<TaskLogBody[]>();
const parentParams = (params: DrawerProps) => {
  console.log(params);
  drawerProps.value = params;
  getTaskLogItem({ pageNum: 1, pageSize: 10 }).then(res => {
    activities.value = res.data;
  });

  centerDialogVisible.value = true;
};

defineExpose({
  parentParams
});
</script>
