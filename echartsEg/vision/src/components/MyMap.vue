<template>
  <div class='com-container' @dblclick="revertMap">
    <div class='com-chart' ref='map_ref'></div>
</div>
</template>

<script>
import axios from 'axios'
import { getProvinceMapInfo } from '@/utils/map_utils'
export default {
    data(){
        return{
            chartInstance:null,
            allDate:null,
        }
    },
    created(){
        this.$socket.registerCallBack('mapData',this.getData)
    },
    mounted(){
        this.initEcharts()
        //this.getData()
        this.$socket.send({
            action:'getData',
            socketType:'mapData',
            chartName:'map',
            value:''
        })
        window.addEventListener('resize',this.screenAdapter)
        this.screenAdapter()
    },
    destroyed(){
        window.removeEventListener('resize',this.screenAdapter)
        this.$socket.unRegisterCallBack('mapData')
    },
    methods:{
        async initEcharts(){
            this.chartInstance = this.$echarts.init(this.$refs.map_ref,'chalk')
            //获取中国地图的矢量数据
            //http://127.0.0.1:3355/static/map/china.json
            //由于我们现在获取的地图矢量数据并不是位于koa2的后台，所以我们不能是呀this.$http
            const {data:ret}=  await axios.get('http://localhost:3355/static/map/china.json')
            this.$echarts.registerMap('china',ret)
            const initOption ={
                geo:{
                    type:'map',
                    map:'china',
                    top:'5%',
                    bottom:'5%',
                    itemStyle:{
                        areaColor:'#2e72bf',
                        borderColor:'#333'
                    }
                },
                title: {
                    text: '▎ 商家分布',
                    left: 20,
                    top: 20
                },
                //图例
                legend:{
                    left:'5%',
                    bottom:'5%',
                    orient:'vertical'
                }
            }
            this.chartInstance.setOption(initOption)
            this.chartInstance.on('click',async arg=>{
                // arg.name 就是所点击的省份名称, 是中文
                const provinceInfo = getProvinceMapInfo(arg.name)
                const {data:ret} = await axios.get('http://localhost:3355' + provinceInfo.path)
                this.$echarts.registerMap(provinceInfo.key,ret)
                const changeOption = {
                    geo:{
                        map:provinceInfo.key
                    }
                }
                this.chartInstance.setOption(changeOption)
            })
            
        },
        //async getData(){
        getData(ret){
            //const {data:ret} = await this.$http.get('map')
            //console.log(ret);
            this.allDate = ret
            this.updateChart()
        },
        updateChart(){
            const legendArr = this.allDate.map(item=>{
                return item.name
            })
            //处理图表需要的数据
            const seriesArr = this.allDate.map(item =>{
                //return的这个对象就代表的是一个类别下的所有散点数据
                //如果想在地图上显示散点的数据。所以我们需要给散点的图标增加一个配置，coordinateSystem:'geo'
                return{
                    type:'effectScatter',
                    name:item.name,
                    data:item.children,
                    coordinateSystem:'geo',
                    //涟漪效果
                    rippleEffect:{
                        scale:5,
                        brushType:'stroke'
                    }
                }
            })
            const dataOption = {
                series:seriesArr,
                legend:{
                    data:legendArr
                }
            }
            this.chartInstance.setOption(dataOption)
        },
        screenAdapter(){
            const titleFontSize = this.$refs.map_ref.offsetWidth / 100 * 3.6
            const adapterOption = {
                title:{
                    textStyle:{
                        fontSize:titleFontSize
                    }
                },
                legend:{
                    itemWidth:titleFontSize / 2,
                    itemHeight:titleFontSize / 2,
                    itemGap:titleFontSize / 2,//图例间隔
                    textStyle:{
                        fontSize:titleFontSize / 2
                    }
                }

            }
            this.chartInstance.setOption(adapterOption)
            this.chartInstance.resize()
        },
        getScatterData(){
            
        },
        revertMap(){
            this.chartInstance.setOption({
                geo:{
                    map:'china'
                }
            })
        }
    }
}
</script>

<style>

</style>