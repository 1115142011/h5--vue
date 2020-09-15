<template>
  <section class="v_page">
    <mu-appbar class="v_topNav" title="组员详情" color="#fdd835" textColor="#000">
      <mu-button icon slot="left" @click="goBack">
        <mu-icon value="arrow_back"></mu-icon>
      </mu-button>
    </mu-appbar>
    <div class="v_mainContainer skipRem">
      <!-- 团队总数据 -->
      <mu-paper class="v_block" :z-depth="1">
        <details-title :msg="teamDataTitle" :weight="true"></details-title>
        <more-column-tabs :msgData="teamData" :weight="true"></more-column-tabs>
      </mu-paper>
      <!-- 组员数据 -->
      <mu-paper class="v_block" :z-depth="1" v-for="(item,index) in lisData" :key="index">
        <details-title :msg="item.title"></details-title>
        <more-column-tabs :msgData="item.list"></more-column-tabs>
      </mu-paper>
      <div class="noMore">已经到底了~</div>
    </div>
  </section>
</template>
<script>
import DetailsTitle from './children/DetailsTitle';
import MoreColumnTabs from './children/MoreColumnTabs';
import { getSalesPerformMsg, getSalesTeamPersonMsg } from '@/api/salesApi';
export default {
  components: { DetailsTitle, MoreColumnTabs },
  data () {
    return {
      // 测试数据
      allData: [
        {
          titleMsg: {
            name: '组员15人',
            target: '20间',
            finsh: '21%'
          },
          weight: true,
          testData: [
            {
              title: '新租',
              number: 124
            },
            {
              title: '续租',
              number: 124
            },
            {
              title: '退租',
              number: 124
            },
            {
              title: '急需清退',
              number: 124
            },
            {
              title: '已超期',
              number: 124
            },
            {
              title: '新租',
              number: 124
            }
          ]
        },
        {
          titleMsg: {
            name: '组员15人',
            target: '20间',
            finsh: '21%'
          },
          testData: [
            {
              title: '新租',
              number: 124
            },
            {
              title: '续租',
              number: 124
            },
            {
              title: '退租',
              number: 124
            },
            {
              title: '急需清退',
              number: 124
            },
            {
              title: '已超期',
              number: 124
            },
            {
              title: '新租',
              number: 124
            }
          ]
        },
        {
          titleMsg: {
            name: '组员15人',
            target: '20间',
            finsh: '21%'
          },
          testData: [
            {
              title: '新租',
              number: 124
            },
            {
              title: '续租',
              number: 124
            },
            {
              title: '退租',
              number: 124
            },
            {
              title: '急需清退',
              number: 124
            },
            {
              title: '已超期',
              number: 124
            },
            {
              title: '新租',
              number: 124
            }
          ]
        },
        {
          titleMsg: {
            name: '组员15人',
            target: '20间',
            finsh: '21%'
          },
          testData: [
            {
              title: '新租',
              number: 124
            },
            {
              title: '续租',
              number: 124
            },
            {
              title: '退租',
              number: 124
            },
            {
              title: '急需清退',
              number: 124
            },
            {
              title: '已超期',
              number: 124
            },
            {
              title: '新租',
              number: 124
            }
          ]
        },
        {
          titleMsg: {
            name: '组员15人',
            target: '20间',
            finsh: '21%'
          },
          testData: [
            {
              title: '新租',
              number: 124
            },
            {
              title: '续租',
              number: 124
            },
            {
              title: '退租',
              number: 124
            },
            {
              title: '急需清退',
              number: 124
            },
            {
              title: '已超期',
              number: 124
            },
            {
              title: '新租',
              number: 124
            }
          ]
        }
      ],
      lisData: [],
      teamData: [],
      teamDataTitle: {
        name: '',
        target: '',
        finsh: ''
      }
    };
  },
  computed: {
    userMsg () {
      return this.$store.state.sales.userData;
    }
  },
  created () {
    this.getListData(this.userMsg.group_id);
    this.getUserList(this.userMsg.group_id);
  },
  methods: {
    // 返回上一级
    goBack () {
      this.$store.commit('change_Action', 'pop');
      this.$router.go(-1);
    },
    // 获取团队总数据
    getListData (groupid) {
      getSalesPerformMsg(groupid).then(res => {
        this.teamData = this.setList(res.data);
        // 设置团队数据的标题---完成率/目标
        let current = res.data.new_rent_num + res.data.extend_rent_num;
        this.teamDataTitle.finsh = this.setProgress(
          current,
          res.data.month_goal_num
        );
        this.teamDataTitle.target = res.data.month_goal_num + '间';
      });
    },
    // 获取组员详情
    getUserList (groupid) {
      getSalesTeamPersonMsg(groupid).then(res => {
        this.lisData = this.setUserList(res.data);
        // 设置团队数据标题---总人数
        this.teamDataTitle.name = `组员：${this.lisData.length}人`;
      });
    },
    // 遍历设置团队数据结构
    setList (obj) {
      if (Object.keys(obj).length === 0) return [];
      let tempArr = [];
      for (let key in obj) {
        switch (key) {
          case 'new_rent_num':
            tempArr.push({
              title: '新租数',
              value: obj[key]
            });
            break;
          case 'extend_rent_num':
            tempArr.push({
              title: '续租',
              value: obj[key]
            });
            break;
          case 'checkout_rent_num':
            tempArr.push({
              title: '退租',
              value: obj[key]
            });
            break;
          case 'to_pay_bill_num':
            tempArr.push({
              title: '待催缴',
              value: obj[key]
            });
            break;
          case 'overdue_bill_num':
            tempArr.push({
              title: '已超期',
              value: obj[key]
            });
            break;
          case 'urgent_checkout_rent_num':
            tempArr.push({
              title: '急需清退',
              value: obj[key]
            });
            break;
          default:
            break;
        }
      }
      return tempArr;
    },
    // 遍历设置团队成员数据结构
    setUserList (arr) {
      if (!arr || arr.length === 0) return [];
      let tempArr = [];
      arr.forEach(item => {
        let current = item.new_rent_num + item.extend_rent_num;
        let obj = {
          title: {
            name: item.person_name,
            target: item.month_goal_num + '间',
            finsh: this.setProgress(current, item.month_goal_num)
          },
          list: this.setList(item)
        };
        tempArr.push(obj);
      });
      return tempArr;
    },
    // 计算完成率百分比
    setProgress (current, plan) {
      current = parseFloat(current);
      plan = parseFloat(plan);
      if (isNaN(current) || isNaN(plan)) {
        return '-';
      }
      return plan <= 0
        ? '0%'
        : Math.round((current / plan) * 10000) / 100.0 + '%';
    }
  }
};
</script>
<style lang="less" scoped>
.v_block {
  padding-bottom: 20px;
}
.noMore {
  padding: 20px;
  text-align: center;
}
</style>
