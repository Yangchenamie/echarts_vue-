<!--
针对于 /stockpage 这条路径而显示出来的
在这个组件中, 通过子组件注册的方式, 要显示出Stock.vue这个组件
-->
<template>
    <div class="com-page">
        <stock></stock>
    </div>
</template>

<script>
import stock from '@/components/MyStock.vue'
export default {
    components:{
        stock
    }
}
</script>

<style>

</style>