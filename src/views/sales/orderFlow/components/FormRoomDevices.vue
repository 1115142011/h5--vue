<template>
  <div class="outer_box" v-loading="loading" data-mu-loading-text="请求中请稍后.." lock-scroll>
    <lease-title></lease-title>
    <mu-paper :z-depth="1" class="v_block main_tabs_box">
      <!-- tabs卡 -->
      <mu-paper :z-depth="1" class="tabs_wrap">
        <mu-tabs
          :value.sync="mainTabs"
          inverse
          class="v_ellipsis"
          color="#448AFF"
          text-color="#797979"
          full-width
          indicator-color="#448AFF"
        >
          <mu-tab v-for="(item,index) in room" :key="index">{{item.roomName}}</mu-tab>
        </mu-tabs>
      </mu-paper>

      <div class="tabs_content">
        <!-- 物资 -->
        <div class="materials_box">
          <div
            class="materials_item"
            :class="{green:item.amount>=1,blue:materialActive===index}"
            @click="setMaterial(index,item)"
            v-for="(item,index) in materialData"
            :key="index"
          >
            <span class="text">{{item.category}}</span>
            <span class="badge">{{item.amount}}</span>
          </div>
          <div class="v_footerHint" v-if="materialData.length===0&&!loading">该区域暂无物资信息~</div>
        </div>
        <!-- 数字键盘 -->
        <div class="number_keyboard">
          <div class="space_box" v-for="(item,index) in keyboard" :key="index">
            <div class="key_item" :class="{blue:keysActive===index}" @click="keyClick(index)">
              <mu-ripple color="#cccccc" :opacity="0.5">{{item}}</mu-ripple>
            </div>
          </div>
        </div>
      </div>
    </mu-paper>

    <!-- 底部按钮 -->
    <mu-paper class="form_footer_btn" :z-depth="4">
      <mu-button color="#fdd835" textColor="#333333" @click="changeStep('next')">下一步</mu-button>
    </mu-paper>
  </div>
</template>
<script>
import { getRoomAsset, updateRoomAsset } from '@/api/salesApi';
import LeaseTitle from './LeaseTitle';
export default {
  components: { LeaseTitle },
  data () {
    return {
      loading: false,
      mainTabs: 0,
      keysActive: undefined, // 数字键盘点击项
      materialActive: undefined, // 物资清单选中项
      keyboard: ['无', 1, 2, 3, 4, 5, 6, 7, 8],
      materialData: [],
      room: [],
      submitFlag: false // 是否提交过
    };
  },
  computed: {
    roomMsg () {
      return this.$store.state.sales.roomParams;
    }
  },
  created () {
    this.getAsset(this.roomMsg.room_id);
  },
  methods: {
    // 获取房间资产
    getAsset (roomid) {
      this.loading = true;
      getRoomAsset(roomid).then(res => {
        this.loading = false;
        this.room = res.data;
        this.materialData = this.room[this.mainTabs].items;
      });
    },
    // 更新房间资产
    updateMyList (param) {
      this.loading = true;
      updateRoomAsset(param).then(res => {
        this.loading = false;
      });
    },
    // 数字键盘点击
    keyClick (index) {
      this.keysActive = index;
      if (this.materialActive !== undefined) {
        this.materialData[this.materialActive].amount = index;
      }
    },
    // 按钮点击
    changeStep (direction) {
      if (direction === 'next') {
        if (!this.submitFlag) {
          let param = this.room[this.mainTabs];
          this.updateMyList(param);
        }
        this.$emit('addStep');
      }
    },
    // 设置物资选项
    setMaterial (index, item) {
      this.materialActive = index;
      this.keysActive = item.amount;
    }
  },
  watch: {
    mainTabs: function (newVal, oldVal) {
      this.submitFlag = true;
      let param = this.room[oldVal];
      this.updateMyList(param);
      this.materialData = this.room[newVal].items || [];
      this.keysActive = undefined; // 数字键盘点击项
      this.materialActive = undefined; // 物资清单选中项
    }
  }
};
</script>
<style lang="less" scoped>
.outer_box{
  width: 100%;
  height: 100%;
}
.main_tabs_box {
  .tabs_wrap {
    padding: 10px 2px 0;
  }
  .tabs_content {
    // 物资清单
    .materials_box {
      height: 210px;
      overflow-x: hidden;
      overflow-y: auto;
      padding: 20px;
      display: flex;
      flex-wrap: wrap;
      position: relative;
      .materials_item {
        padding: 8px 10px;
        border: solid 1px #cccccc;
        border-radius: 5px;
        margin-right: 10px;
        margin-top: 5px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #797979;
        .text {
          font-size: 14px;
          line-height: 14px;
        }
        .badge {
          font-size: 12px;
          margin-left: 5px;
          padding: 0 3px;
          border-radius: 50%;
          line-height: 13px;
          background: #cccccc;
          color: #ffffff;
        }
      }
      .green {
        color: #67cd4d;
        border-color: #67cd4d;
        .badge {
          background: #67cd4d;
        }
      }
      .blue {
        color: #ffffff;
        background: #448aff;
        border-color: #448aff;
        .badge {
          background: #ffffff;
          color: #448aff;
        }
      }
    }
    // 数字键盘
    .number_keyboard {
      padding: 5px;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      border-top: solid 1px #cccccc;
      .space_box {
        width: 33.33%;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 5px 3px 5px 0;
        overflow: hidden;
        .key_item {
          width: 83px;
          height: 36px;
          border: solid 1px #cccccc;
          display: flex;
          font-size: 13px;
          justify-content: center;
          align-items: center;
          border-radius: 5px;
          color: #448aff;
          position: relative;
          &.blue {
            background: #448aff;
            color: #ffffff;
          }
        }
      }
    }
  }
}
/deep/.mu-tabs {
  background: #ffffff;
}
</style>
