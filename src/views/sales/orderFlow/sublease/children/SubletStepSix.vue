<template>
  <div class="outer_box">
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
          <mu-tab v-for="(item,index) in room" :key="index">{{item.name}}</mu-tab>
        </mu-tabs>
      </mu-paper>

      <div class="tabs_content">
        <!-- 物资 -->
        <div class="materials_box">
          <div
            class="materials_item"
            :class="{green:item.mumber>=1,blue:materialActive===index}"
            @click="setMaterial(index,item)"
            v-for="(item,index) in materialData"
            :key="index"
          >
            <span class="text">{{item.name}}</span>
            <span class="badge">{{item.mumber}}</span>
          </div>
          <div class="v_footerHint" v-if="!materialData||materialData.length==0">该区域暂无物资信息~</div>
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
    <mu-paper class="btn" :z-depth="4">
      <mu-button color="#fdd835" textColor="#333333" @click="changeStep('prev')" class="leftBtn">上一步</mu-button>
      <mu-button color="#fdd835" textColor="#333333" @click="changeStep('next')">下一步</mu-button>
    </mu-paper>
  </div>
</template>
<script>
export default {
  data () {
    return {
      mainTabs: 0,
      keysActive: undefined, // 数字键盘点击项
      materialActive: undefined, // 物资清单选中项
      keyboard: ['无', 1, 2, 3, 4, 5, 6, 7, 8],
      materialData: [
        {
          name: '床',
          mumber: 0
        },
        {
          name: '衣柜',
          mumber: 1
        },
        {
          name: '书桌',
          mumber: 3
        },
        {
          name: '椅子',
          mumber: 2
        },
        {
          name: '落地灯',
          mumber: 4
        },
        {
          name: '挂钩',
          mumber: 5
        },
        {
          name: '穿衣镜',
          mumber: 0
        }
      ],
      room: [
        {
          name: '公共区域',
          list: [
            {
              name: '床',
              mumber: 0
            },
            {
              name: '衣柜',
              mumber: 1
            },
            {
              name: '书桌',
              mumber: 3
            },
            {
              name: '椅子',
              mumber: 2
            },
            {
              name: '落地灯',
              mumber: 4
            },
            {
              name: '挂钩',
              mumber: 5
            },
            {
              name: '穿衣镜',
              mumber: 0
            }
          ]
        },
        {
          name: '房间A',
          list: [
            {
              name: '空调',
              mumber: 1
            },
            {
              name: '餐桌',
              mumber: 0
            },
            {
              name: '椅子',
              mumber: 1
            },
            {
              name: '沙发',
              mumber: 1
            },
            {
              name: '电视',
              mumber: 1
            },
            {
              name: '电冰箱',
              mumber: 0
            },
            {
              name: '洗衣机',
              mumber: 1
            },
            {
              name: '燃气灶',
              mumber: 1
            },
            {
              name: '电磁炉',
              mumber: 1
            },
            {
              name: '热水器',
              mumber: 0
            },
            {
              name: '路由器',
              mumber: 1
            },
            {
              name: '微波炉',
              mumber: 1
            },
            {
              name: '智能门锁',
              mumber: 0
            }
          ]
        },
        {
          name: '房间B',
          list: [
            {
              name: '沙发',
              mumber: 1
            },
            {
              name: '电视',
              mumber: 1
            },
            {
              name: '电冰箱',
              mumber: 0
            },
            {
              name: '洗衣机',
              mumber: 1
            },
            {
              name: '燃气灶',
              mumber: 1
            },
            {
              name: '电磁炉',
              mumber: 1
            },
            {
              name: '热水器',
              mumber: 0
            },
            {
              name: '路由器',
              mumber: 1
            },
            {
              name: '微波炉',
              mumber: 1
            },
            {
              name: '智能门锁',
              mumber: 0
            }
          ]
        },
        {
          name: '房间C'
        }
      ]
    };
  },
  methods: {
    // 数字键盘点击
    keyClick (index) {
      this.keysActive = index;
      if (this.materialActive !== undefined) {
        this.materialData[this.materialActive].mumber = index;
      }
    },
    // 按钮点击
    changeStep (direction) {
      if (direction === 'next') {
        this.$emit('addStep');
      } else {
        this.$emit('minusStep');
      }
    },
    // 设置物资选项
    setMaterial (index, item) {
      this.materialActive = index;
      this.keysActive = item.mumber;
    }
  },
  watch: {
    mainTabs: function (newVal, oldVal) {
      this.materialData = this.room[newVal].list || [];
      this.keysActive = undefined; // 数字键盘点击项
      this.materialActive = undefined; // 物资清单选中项
    }
  }
};
</script>
<style lang="less" scoped>
.main_tabs_box {
  .tabs_wrap {
    padding: 10px 10px 0;
  }
  .tabs_content {
    // 物资清单
    .materials_box {
      padding: 20px;
      display: flex;
      flex-wrap: wrap;
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
      padding: 20px;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      border-top: solid 1px #cccccc;
      .space_box {
        width: 33.33%;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 8px 5px 8px 0;
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
.btn {
  width: 100%;
  padding: 10px;
  text-align: right;
  left: 0;
  position: fixed;
  bottom: 0;
  & .leftBtn {
    margin-right: 10px;
  }
}
</style>
