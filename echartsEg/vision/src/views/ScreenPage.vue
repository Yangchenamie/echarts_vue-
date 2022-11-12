<template>
  <div class="screen-container" :style="containerStyle">
    <header class="screen-header">
      <div>
        <img src="../../public/static/img/header_border_dark.png" alt="" />
      </div>
      <span class="logo">
        <img src="/static/img/logo_dark.png" alt="" />
      </span>
      <span class="title">电商平台实时监控系统</span>
      <div class="title-right">
        <img
          src="/static/img/qiehuan_dark.png"
          class="qiehuan"
          >
        <span class="datetime">2049-01-01 00:00:00</span>
      </div>
    </header>
    <div class="screen-body">
      <section class="screen-left">
        <div id="left-top" :class="[fullScreenStatus.trend ? 'fullscreen' :'']">
          <!-- 销量趋势图表 -->
          <Trend :ref="trend"></Trend>
          <!-- icon-compress-alt -->
          <div class="resize">
            <span :class="['iconfont',fullScreenStatus.trend ? 'icon-compress-alt' :'icon-expand-alt']" @click="changeSize('trend')"></span>
          </div>
        </div>
        <div id="left-bottom" :class="[fullScreenStatus.seller ? 'fullscreen' :'']">
          <!-- 商家销售金额图表 -->
          <Seller :ref="seller"></Seller>
          <div class="resize">
            <span :class="['iconfont',fullScreenStatus.seller ? 'icon-compress-alt' :'icon-expand-alt']" @click="changeSize('seller')"></span>
          </div>
        </div>
      </section>
      <section class="screen-middle">
        <div id="middle-top"  :class="[fullScreenStatus.map ? 'fullscreen' :'']">
          <!-- 商家分布图表 -->
          <Map :ref="map"></Map>
          <div class="resize">
            <span :class="['iconfont',fullScreenStatus.map ? 'icon-compress-alt' :'icon-expand-alt']" @click="changeSize('map')"></span>
          </div>
        </div>
        <div id="middle-bottom" :class="[fullScreenStatus.rank ? 'fullscreen' :'']">
          <!-- 地区销量排行图表 -->
          <Rank ref="rank"></Rank>
          <div class="resize">
            <span :class="['iconfont',fullScreenStatus.rank ? 'icon-compress-alt' :'icon-expand-alt']" @click="changeSize('rank')"></span>
          </div>
        </div>
      </section>
      <section class="screen-right">
        <div id="right-top" :class="[fullScreenStatus.hot ? 'fullscreen' :'']">
          <!-- 热销商品占比图表 -->
          <Hot :ref="hot"></Hot>
          <div class="resize">
            <span :class="['iconfont',fullScreenStatus.hot ? 'icon-compress-alt' :'icon-expand-alt']" @click="changeSize('hot')"></span>
          </div>
        </div>
        <div id="right-bottom" :class="[fullScreenStatus.stock ? 'fullscreen' :'']">
          <!-- 库存销量分析图表 -->
          <Stock :ref="stock"></Stock>
          <div class="resize">
            <span :class="['iconfont',fullScreenStatus.stock ? 'icon-compress-alt' :'icon-expand-alt']" @click="changeSize('stock')"></span>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import Hot from "@/components/MyHot.vue";
import Map from "@/components/MyMap.vue";
import Rank from "@/components/MyRank.vue";
import Seller from "@/components/MySeller.vue";
import Stock from "@/components/MyStock.vue";
import Trend from "@/components/MyTrend.vue";

export default {
  data() {
    return {
      fullScreenStatus: {
        hot: false,
        map: false,
        rank: false,
        seller: false,
        stock: false,
        trend: false,
      },
    };
  },
  created(){
    this.$socket.registerCallBack('fullScreen',this.recvData)
  },
  destroyed(){
    this.$socket.unRegisterCallBack('fullScreen')
  },
  methods: {
    changeSize(chartName){
      // 先得到目标状态
      const targetValue = !this.fullScreenStatus[chartName]
      // 将所有的图表设置为非全屏
      //this.fullScreenStatus[chartName] = targetValue
      // this.$nextTick(()=>{
      //   this.$refs[chartName].screenAdapter()
      // })
      this.$socket.send({
        action:'fullScreen',
        socketType:'fullScreen',
        chartName:chartName,
        value:targetValue
      })
    },
    recvData (data){
      const chartName = data.chartName
      const targetValue = data.value
      this.fullScreenStatus[chartName] = targetValue
      this.$nextTick(()=>{
        this.$refs[chartName].screenAdapter()
      })
    }
  },
  components: {
    Hot,
    Map,
    Rank,
    Seller,
    Stock,
    Trend,
  },
};
</script>
<style lang="less" scoped>
// 全屏状态样式的定义
.fullscreen {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
  margin: 0 !important;
  z-index: 100;
}
.screen-container {
  width: 100%;
  height: 100%;
  padding: 0 20px;
  background-color: #161522;
  color: #fff;
  box-sizing: border-box;
}
.screen-header {
  width: 100%;
  height: 64px;
  font-size: 20px;
  position: relative;
  > div {
    img {
      width: 100%;
    }
  }
  .title {
    position: absolute;
    left: 50%;
    top: 50%;
    font-size: 20px;
    transform: translate(-50%, -50%);
  }
  .title-right {
    display: flex;
    align-items: center;
    position: absolute;
    right: 0px;
    top: 50%;
    transform: translateY(-80%);
  }
  .qiehuan {
    width: 28px;
    height: 21px;
    cursor: pointer;
  }
  .datetime {
    font-size: 15px;
    margin-left: 10px;
  }
  .logo {
    position: absolute;
    left: 0px;
    top: 50%;
    transform: translateY(-80%);
    img {
      height: 35px;
      width: 128px;
    }
  }
}
.screen-body {
  width: 100%;
  height: 100%;
  display: flex;
  margin-top: 10px;
  .screen-left {
    height: 100%;
    width: 27.6%;
    #left-top {
      position: relative;
      height: 53%;
    }
    #left-bottom {
      position: relative;
      height: 31%;
      margin-top: 25px;
    }
  }
  .screen-middle {
    height: 100%;
    width: 41.5%;
    margin-left: 1.6%;
    margin-right: 1.6%;
    #middle-top {
      position: relative;
      width: 100%;
      height: 56%;
    }
    #middle-bottom {
      position: relative;
      margin-top: 25px;
      width: 100%;
      height: 28%;
    }
  }
  .screen-right {
    height: 100%;
    width: 27.6%;
    #right-top {
      position: relative;
      height: 46%;
    }
    #right-bottom {
      position: relative;
      height: 38%;
      margin-top: 25px;
    }
  }
}
.resize {
  position: absolute;
  top: 20px;
  right: 20px;
  cursor: pointer;
}
</style>