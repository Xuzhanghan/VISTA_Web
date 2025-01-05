<template>
  <div class="r-container">
    <div class="overlay"></div>
    <!-- Header: 欢迎信息 -->
    <div class="header">
      <h1>欢迎使用VISTA</h1>
    </div>

    <div class="main-content">
      <!--填写配置信息-->
      <div class="left-sidebar">
        <div class="config-form">
          <h3>请填写测试配置信息</h3>
          <div>
            <el-form :model="configInfo" label-width="100px" class="config-info">
              <el-form-item required="required" label="软件名称">
                <el-input v-model="configInfo.app_name" style="width: 200px" placeholder="请输入待测app的名称" clearable/>
              </el-form-item>
              <el-form-item required="required" label="软件包">
                <el-input v-model="configInfo.app_package" style="width: 200px" placeholder="请输入待测软件包" clearable/>
              </el-form-item>
              <el-form-item required="required" label="活动信息">
                <el-input v-model="configInfo.app_launch_activity" style="width: 200px" placeholder="请输入活动信息" clearable/>
              </el-form-item>
              <el-form-item required="required" label="场景名称">
                <el-input v-model="configInfo.scenario_name" style="width: 200px" placeholder="请输入场景名称" clearable/>
              </el-form-item>
              <el-form-item required="required" label="场景描述">
                <el-input v-model="configInfo.scenario_description" style="width: 200px" placeholder="请输入场景描述" clearable/>
              </el-form-item>
              <el-form-item label="场景补充信息">
                <el-input clearable type="textarea" style="width: 200px" :autosize="{ minRows:6, maxRows: 7 }" v-model="scenario_extra_info" placeholder="【选填】请以key:value形式输入并用逗号隔开,"/>
              </el-form-item>
              <el-form-item class="config-button">
                <el-button style="width: 90px" type="primary" @click="onSubmitConfig">确认提交</el-button>
                <el-button style="width: 90px" type="info" @click="onCancelConfig">重新配置</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
      <!-- Right Sidebar: 测试返回信息 -->
      <div class="right-sidebar">
        <div class="test-steps">
          <div class="test-head">
            <h3>点击执行测试</h3>
            <div>
              <el-button class="test-button" type="success" @click="step">逐步测试</el-button>
              <el-button class="test-button" type="success" @click="autoTest">一键测试</el-button>
            </div>
          </div>
          <el-table class="test-data-table" :data="testData" style="width: 90%" max-height="600px">
            <el-table-column fixed type="index"/>
            <el-table-column fixed :width="160" label="截图">
              <template #default="scope">
                <el-image class="table-cover" :src="scope.row.screenshot"/>
              </template>
            </el-table-column>
            <el-table-column fixed :width="160" label="处理后图片">
              <template #default="scope">
                <el-image class="table-cover" :src="scope.row.screenshot_withbbox"/>
              </template>
            </el-table-column>
            <el-table-column label="目标" :width="180" prop="next_actions.intent"></el-table-column>
            <el-table-column label="操作类型" :width="180" prop="next_actions['action-type']"></el-table-column>
            <el-table-column label="Widget ID" :width="120" prop="next_actions['target-widget-id']"></el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref} from "vue";
import {ElForm, ElButton, ElFormItem, ElMessage} from "element-plus";
import {InitializeConfigInfo, StepInfo} from "@/api/test.js";
const testData = ref([
]);
const configInfo=ref({
  app_name:"",
  app_package:"",
  app_launch_activity:"",
  scenario_name:"",
  scenario_description:"",
})
const scenario_extra_info = ref("");  // 示例输入
const result = ref({});  // 用来存储转化后的对象

// 使用箭头函数将 scenario_extra_info 转换成对象
const convertToObj = (input) => input.split(",").reduce((acc, item) => {
  const [key, value] = item.split(":");
  if (key && value !== undefined) {
    acc[key] = value;  // 若存在相同的键，会覆盖之前的值
  }
  return acc;
}, {});



const onSubmitConfig=()=>{
  console.log(configInfo.value)
  console.log(scenario_extra_info.value)
  result.value = convertToObj(scenario_extra_info.value);
  console.log(result.value)
  const info={
    app_name: configInfo.value.app_name,
    app_package: configInfo.value.app_package,
    app_launch_activity: configInfo.value.app_launch_activity,
    scenario_name: configInfo.value.scenario_name,
    scenario_description: configInfo.value.scenario_description,
    scenario_extra_info:result.value
  }
  console.log(info)
  InitializeConfigInfo({
    app_name: configInfo.value.app_name,
    app_package: configInfo.value.app_package,
    app_launch_activity: configInfo.value.app_launch_activity,
    scenario_name: configInfo.value.scenario_name,
    scenario_description: configInfo.value.scenario_description,
    scenario_extra_info:result.value
  }).then(res=>{
    ElMessage({
      message:'初始化成功，请开始测试！',
      type:'success',
      center:true
    })
  }).catch(()=>{
    ElMessage({
      message: "初始化失败，请检查参数！",
      type: 'error',
      center: true,
    })
  })
}
const onCancelConfig=()=>{
  configInfo.value= {
    app_name:"",
    app_package:"",
    app_launch_activity:"",
    scenario_name:"",
    scenario_description:"",
    }
  scenario_extra_info.value=""
  testData.value=[]
  console.log(configInfo.value)
  console.log(scenario_extra_info.value)
}
const step=()=>{
  ElMessage(
      {
        message:'测试进行中',
        type:'warning',
        center:true
      }
  )
  StepInfo().then(res=>{
    if(res.status===201){
      ElMessage({
        message:'测试结束！',
        type:'success',
        center:true
      })
      console.log(res)
      testData.value.push(res.data)
    }else if(res.status===202){
      ElMessage({
        message:'测试失败！请重新测试！',
        type:'warning',
        center:true
      })
      console.log(res)
      testData.value.push(res.data)
    }else if(res.status===200){
      console.log(res)
      testData.value.push(res.data)
    }
  }).catch(()=>{
    ElMessage({
      message:'初始化存在问题，请重新尝试！',
      type:'error',
      center:true
    })
    const newData = {
      next_actions: {
        "action-type": "touch",
        intent: "copy translated text",
        "target-widget-id": 19,
      },
      screenshot: "http://clyra-project.oss-cn-nanjing.aliyuncs.com/b.png",
      screenshot_withbbox: "http://clyra-project.oss-cn-nanjing.aliyuncs.com/b.png"
    };

    // 向 tableData 中添加新数据
    //testData.value.push(newData);
  })
}
const status = ref(200);

const checkStatus = async () => {
  status.value=200
  try {
    while (status.value === 200) {
      const res = await StepInfo(); // 等待异步操作完成

      if (res.status === 201) {
        status.value = res.status;
        ElMessage({
          message: '测试结束！',
          type: 'success',
          center: true
        });
        console.log(res)
        testData.value.push(res.data)
      } else if (res.status === 202) {
        status.value = res.status;
        ElMessage({
          message: '测试失败！请重新测试！',
          type: 'warning',
          center: true
        });
        console.log(res)
        testData.value.push(res.data)
      } else if (res.status === 200) {
        status.value = res.status;
        console.log(res);
        testData.value.push(res.data);
      }
    }
  } catch (error) {
    status.value = 500;
    console.log(status.value);
    ElMessage.error("初始化错误！");
  }
};


const autoTest=()=>{
  ElMessage({
    message:'自动化测试开始',
    type:'warning',
    center:true
  })
  // 启动异步检查
  checkStatus();
}
</script>

<style>
.el-table th {
  white-space: nowrap; /* 禁止换行 */
}
.r-container {
  width: 100%;
  height: 100vh;

}
.header {
  height: 10%;
  z-index: 3;
  text-align: center;
  padding-bottom: 5px;
  padding-top: 20px;
  border-bottom: 2px solid #F7F8FC; /* 添加横线 */
}
.main-content {
  display: flex;
  justify-content: space-between;
  height: 90%;
}
.left-sidebar {
  width: 25%;
  z-index: 4;
  background-color: #F7F8FC;
  height: 100%;
}
/* 全局调整字体大小 */
.el-table td {
  font-size: 16px; /* 你可以根据需要调整字体大小 */
}

.config-form h3{
  padding: 20px;
}
.config-form .el-form-item {
  display: flex;
  justify-content: flex-end; /* 使标签右对齐 */
}
.config-form .el-form-item__label {
  text-align: right !important;
  width: 150px;
  margin-right: 10px;
}
.config-info{
  padding: 20px;
}
.config-button{
  margin-top: 30px;
  margin-left: 10px;
}
.right-sidebar {
  width: 80%;
  padding-left: 130px;
  z-index: 4;
  justify-content: center;
}
.test-steps{
  width: 950px;
}
.test-steps h3{
  padding: 20px;
  z-index: 6;
  color: #4D4D4D;
}
.test-head{
  display: flex;
  align-content: center;
}
.test-button{
  margin-top: 18px;;
}
.test-data-table{
  margin-left: 30px;
}
</style>

