<template>
  <div class="index_flat">
    <mu-paper class="v_block content" :z-depth="1">
      <div
        class="eachTag"
        :class="[(index+1)%3===0?'border_b':'border_r_b']"
        v-for="(item,index) in listMenu"
        :key="'item'+index"
        @click="toOtherPage(item.path)"
      >
        <div class="iconBox" :style="{background:item.iconBackground}">
          <mu-icon :value="item.icon" color="#fff"></mu-icon>
          <span class="hintMsg" v-if="item.hint>0">{{item.hint}}</span>
        </div>
        <div>{{item.text}}</div>
      </div>
    </mu-paper>
  </div>
</template>
<script>
import { queryRejectLease } from '@/api/salesApi';
import { queryProceedWork } from '@/api/cleanApi';
export default {
  data () {
    return {
      loginType: undefined,
      linkData: [
        {
          text: '房态查询',
          icon: 'home',
          iconBackground: '#f6b036',
          hint: 0,
          path: '/sales/housingList',
          type: [1, 3]
        },
        {
          text: '退租管理',
          icon: 'assignment_return',
          iconBackground: '#5ab3e7',
          hint: 0,
          path: '/sales/TroubleLeaseList',
          type: [1]
        },
        {
          text: '租约管理',
          icon: 'view_list',
          iconBackground: '#4eb75a',
          hint: 0,
          path: '/sales/leaseControl',
          type: [1]
        },
        {
          text: '租客认证',
          icon: 'perm_identity',
          iconBackground: '#5397eb',
          hint: 0,
          path: '/sales/authentication',
          type: [1]
        },
        {
          text: '房源管理',
          icon: 'create',
          iconBackground: '#FF8700',
          hint: 0,
          path: '/proprietor',
          type: [11]
        },
        {
          text: '楼盘管理',
          icon: 'domain',
          iconBackground: '#00CC99',
          hint: 0,
          path: '',
          type: [111]
        },
        {
          text: '保洁',
          icon: 'opacity',
          iconBackground: '#b8741a',
          hint: 0,
          path: '/clean',
          type: [4]
        },
        {
          text: '维修费用驳回',
          icon: 'redeem',
          iconBackground: '#FE7564',
          hint: 0,
          path: '/maintain/rejectCost',
          type: [3]
        },
        {
          text: '维修工单',
          icon: 'build',
          iconBackground: '#8080ff',
          hint: 0,
          path: '/repair',
          type: [3]
        },
        {
          text: '维修申请',
          icon: 'add_circle_outline',
          iconBackground: '#80d9ff',
          hint: 0,
          path: '/applyOne',
          type: [3, 1]
        }
      ]
    };
  },
  created () {
    this.loginType = Number(localStorage.getItem('loginType'));
    if (this.loginType === 1) {
      this.getListData();
    }
  },
  computed: {
    listMenu () {
      return this.linkData.map(item => {
        if (item.type.indexOf(this.loginType) === -1) {
          item.path = '';
          item.iconBackground = '#c3c3c3';
        }
        return item;
      });
    }
  },
  methods: {
    toOtherPage (path) {
      if (!path) return;
      if (path === '/clean') {
        this.getOngoing(path);
      } else {
        this.$store.commit('change_Action', 'push'); // 设置动画特效类型
        this.$router.push(path);
      }
    },
    // 获取驳回的退租清单
    getListData () {
      let params = {
        queryTerm: '', // 收索关键词参数
        status: 3, // 状态--tab 选中项参数 3-退租驳回
        pageSize: 10,
        pageNo: 1
      };
      queryRejectLease(params).then(res => {
        this.linkData.forEach(item => {
          if (item.text === '退租管理') {
            item.hint = res.data.itemCount || 0;
          }
        });
      });
    },
    // 查询保洁是否有正在进行中的工单
    getOngoing (path) {
      queryProceedWork().then(res => {
        if (res.data && res.data.orderId) {
          this.$router.push('/order/' + res.data.orderId);
        } else {
          this.$router.push(path);
        }
      })
        .catch(() => {
          this.$router.push(path);
        });
    }
  }
};
</script>
<style lang="less" scoped>
.index_flat {
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  .content {
    display: flex;
    flex-wrap: wrap;
    padding: 0;
    margin-bottom: 15px;
  }
  .eachTag {
    display: flex;
    width: calc(100% / 3);
    box-sizing: border-box;
    height: 120px;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .iconBox {
    width: 36px;
    height: 36px;
    margin-bottom: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 10px;
    position: relative;
    .hintMsg {
      position: absolute;
      right: -10px;
      top: -12px;
      padding: 0 5px;
      border-radius: 8px;
      background: red;
      color: #ffffff;
    }
  }
  .border_r_b {
    border-right: 1px solid #eee;
    border-bottom: 1px solid #eee;
  }
  .border_b {
    border-bottom: 1px solid #eee;
  }
}
</style>
