<template>
  <div class="contentBox">
    <mu-paper class="itemBox serve" :z-depth="1">
      <div class="title">大源复地御香山 117-1-2202</div>
      <div class="itemContainer">
        <div class="bodymsg">
          <span class="leftCircle">
            日常
            <br />维修
          </span>
          <div class="middleBox">
            <div class="serveName v_ellipsis">家电油烟机</div>
            <div class="time v_ellipsis">报修时间：2019.3.22</div>
          </div>
          <mu-icon color="#9f9f9f" value="keyboard_arrow_right" size="30"></mu-icon>
        </div>
        <div class="footer_hint">
          <span class="small_font">描述：用纸巾放到抽油烟机的抽风口，左边是抽风，右边是吹风。一炒菜打开油烟机，满屋子全是油烟。</span>
        </div>
      </div>
    </mu-paper>
    <mu-paper class="itemBox cleaning" :z-depth="1">
      <div class="title">
        <span class="statu_tag">空置</span>
        <span class="title_text v_ellipsis">大源复地御香山 117-1-2202</span>
        <mu-icon color="#ffffff" value="keyboard_arrow_right" size="30"></mu-icon>
      </div>
      <div class="itemContainer">
        <div class="bodymsg">
          <div class="left_msg">
            <div class="item">
              <span class="weight_font">发起时间：</span>
              <span>2019.12.06</span>
            </div>
            <div class="item">
              <span class="weight_font">考核剩余：</span>
              <span class="red">14小时45分</span>
            </div>
            <div class="item">
              <span class="weight_font">完成状态：</span>
              <span class="small_font">未完成</span>
            </div>
          </div>
          <mu-button color="#FDD835" textColor="#333333" class="btn">开始保洁</mu-button>
        </div>
        <div class="footer_hint">
          <span class="small">描述：用纸巾放到抽油烟机的抽风口，左边是抽风，右边是吹风。一炒菜打开油烟机，满屋子全是油烟。</span>
        </div>
      </div>
    </mu-paper>
  </div>
</template>
<script>
export default {};
</script>
<style lang="less" scoped>
.contentBox {
  .itemBox {
    margin-top: 15px;
    border-radius: 10px;
    overflow: hidden;
  }
  // 维修工单
  .serve {
    .title {
      padding: 5px 15px;
      background: #333333;
      color: #ffffff;
      font-size: 16px;
    }
    .itemContainer {
      .bodymsg {
        display: flex;
        align-items: center;
        border-bottom: solid 1px #cccccc;
        padding: 15px 15px;
        .leftCircle {
          width: 45px;
          height: 45px;
          font-size: 12px;
          line-height: 14px;
          border-radius: 23px;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #ffffff;
          background: #8080ff;
          margin-right: 10px;
        }
        .middleBox {
          flex: 3;
          .serveName {
            font-size: 14px;
            color: #333333;
            font-weight: 600;
          }
          .time {
            font-size: 12px;
            color: #797979;
          }
        }
      }
      .footer_hint {
        padding: 5px 15px;
        font-size: 12px;
        .small_font {
          display: inline-block;
          width: 120%;
          transform: scale(0.7) translateX(-20%);
        }
      }
    }
  }
  // 保洁工单
  .cleaning {
    .title {
      display: flex;
      align-items: center;
      padding: 10px 15px;
      background: #ff6d7f;
      color: #ffffff;
      font-size: 16px;
      .statu_tag {
        padding: 5px 10px;
        border-radius: 15px;
        background: rgba(51, 51, 51, 0.247);
        margin-right: 10px;
      }
      .title_text {
        flex: 2;
      }
    }
    .bodymsg {
      display: flex;
      align-items: center;
      border-bottom: solid 1px #cccccc;
      padding: 15px 15px;
      .left_msg {
        flex: 2;
        .item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          span {
            flex: 1;
          }
        }
        .weight_font {
          font-size: 14px;
          font-weight: 600;
          .small_font {
            color: #797979;
            font-size: 12px;
          }
        }
      }
      .btn {
        margin-left: 20px;
      }
    }
    .footer_hint {
      width: 100%;
      padding: 5px 15px;
      overflow: hidden;
      .small {
        display: inline-block;
        width: 120%;
        font-size: 12px;
        transform: scale(0.75) translateX(-16%);
      }
    }
  }
}
</style>
