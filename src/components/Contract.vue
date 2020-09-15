<template>
  <section class="v_page">
      <!-- 顶部导航条 -->
    <mu-appbar class="v_topNav" color="#fdd835" textColor="#000">
      <mu-button icon slot="left" @click="goBack">
        <mu-icon value="arrow_back"></mu-icon>
      </mu-button>电子合同
    </mu-appbar>
    <div class="v_mainContainer skipRem">
       <iframe id="ifr" :src="url" width="100%" height="1000" frameborder="0"></iframe>
    </div>

  </section>
</template>
<script>
export default {
  data () {
    return {
      url: ''
    };
  },
  created () {
    this.url = this.$route.params.url;
  },
  methods: {
    goBack () {
      this.$router.go(-1);
    }
  }
};
</script>
