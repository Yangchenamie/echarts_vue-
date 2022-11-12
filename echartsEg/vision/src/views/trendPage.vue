<!--
针对于 /trendpage 这条路径而显示出来的
在这个组件中, 通过子组件注册的方式, 要显示出Trend.vue这个组件
-->
<template>
  <div class="com-page">
    <trend></trend>
  </div>
</template>

<script>
import trend from '@/components/MyTrend.vue'
export default {
    data(){

    },
    components:{
        trend
    }
}
</script>

<style>

</style>