<template>
  <div class="card">
    <div class="title">保洁标准须知</div>
    <div class="detail">
      <div class="content-title center">《像素公寓保洁员行为公约》</div>

      <div class="survey">为践行像素公寓“以服务构建信任，为信任创造价值”的公司愿景，特约定此公约，望各位同仁遵照执行！</div>
      <div class="line">
        <span class="chapter">1、</span>
        <div class="content">上岗前注意仪容仪表，保持衣物整洁，注意个人卫生。</div>
      </div>
      <div class="line">
        <span class="chapter">2、</span>
        <div class="content">进门前注意上门礼仪,轻敲门三声并自报身份，缓缓打开房门，遇到客户主动打招呼，结束时主动告别</div>
      </div>
      <div class="line">
        <span class="chapter">3、</span>
        <div class="content">与客户沟通过程中，多使用敬语，不得同客户争吵。</div>
      </div>
      <div class="line">
        <span class="chapter">4、</span>
        <div class="content">客户寻求帮助或提出意见，认真倾听，主动帮助客户并向公司汇报，超出服务范围的应该礼貌回绝。</div>
      </div>
      <div class="line">
        <span class="chapter">5、</span>
        <div class="content">保洁过程中严禁使用客户个人物品，按照公司保洁标准执行保洁任务。</div>
      </div>
      <div class="line">
        <span class="chapter">6、</span>
        <div class="content">工作过程中注意安全，合理安排工作计划，确保按照客户约定时间完成保洁任务。</div>
      </div>
      <div class="line last-line">感谢您的付出，祝您生活愉快</div>
      <div class="line last-line">———像素公寓</div>
    </div>

    <mu-button color="warning" class="button" textColor="#000" @click="$emit('continue')">我知道了</mu-button>
  </div>
</template>

<script>
export default {};
</script>

<style lang="less" scoped>
.card {
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0px 2px 2px 0px rgba(16, 16, 16, 0.3);
  .title {
    padding: 10px 16px 8px;
    font-size: 20px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  }
  .detail {
    font-size: 14px;
    padding: 0 16px 10px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.2);
    line-height: 22px;
    .line {
      display: flex;
    }
    .survey {
      text-indent: 2em;
    }
    .last-line {
      justify-content: flex-end;
    }
  }
  .button {
    float: right;
    margin: 10px 20px;
  }
}
</style>
