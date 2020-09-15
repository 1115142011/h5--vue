<template>
  <div class="locationContainer">
    <div class="card"><b>日常：</b>{{item.houseName+'—'+item.areaName}}</div>
    <div class="card">
      <div class="title">请进行定位：</div>
      <mu-button v-if="!locationBref" flat class="button" @click="locate">
        定位
        <mu-icon size="20" value="location_searching"></mu-icon>
      </mu-button>
      <div v-else flat class="button" @click="locate">
        <div class="located">
          <div class="main">{{locationBref}}</div>
          <div class="sub">{{locationDetail}}</div>
        </div>
      </div>
    </div>
    <iframe v-if="showIframe" id="geoPage" width=0 height=0 frameborder=0  style="display:none;" scrolling="no"
        src="https://apis.map.qq.com/tools/geolocation?key=65TBZ-CPFWI-UFCGN-5MLI2-EDK6Z-7XBPF&referer=myapp">
    </iframe>
    <div class="controlPanel">
      <mu-button
        color="warning"
        style="float: right"
        textColor="#000"
        @click="finishLocate"
        :disabled="!locationBref"
      >
        下一步
      </mu-button>
    </div>
  </div>
</template>

<script>
export default {
  props: ['item'],
  data () {
    return {
      locationBref: '',
      locationDetail: '',
      showIframe: false
    };
  },
  mounted () {
    window.addEventListener('message', event => {
      var loc = event.data;
      if (loc && loc.module === 'geolocation') {
        this.locationBref = loc.nation + loc.province + loc.city;
        if (loc.district) this.locationBref += loc.district;
        this.locationDetail = loc.addr;
      } else {
        // console.log('11111');
        // this.$toast.error('未获取到定位信息！');
      }
    }, false);
  },
  methods: {
    locate () {
      this.showIframe = true;
    },
    finishLocate () {
      this.$emit('finishLocate', {
        locationBref: this.locationBref,
        locationDetail: this.locationDetail
      });
    }
  }
};
</script>

<style lang="less" scoped>
.card {
  font-size: 14px;
  padding: 12px 16px;
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0px 2px 2px 0px rgba(16, 16, 16, 0.3);
  + .card {
    margin-top: 8px;
  }
  .title {
    margin: 24px 24px 8px;
    font-weight: 600;
    font-size: 16px;
  }
  .button {
    color: #3B7FFF;
    margin: 0 24px 24px;
    border: 1px solid grey;
    border-radius: 4px;
  }
  .located {
    padding: 4px 16px 8px;
    .main {
      font-size: 16px;
      line-height: 24px;
    }
    .sub {
      font-size: 12px;
      line-height: 16px;
      color:rgba(16, 16, 16, 0.5);
    }
    // flex-direction: column;
  }
}
.controlPanel {
  width: 100%;
  position: fixed;
  left: 0;
  bottom: 0;
  padding: 8px;
  background: #fff;
}
</style>
