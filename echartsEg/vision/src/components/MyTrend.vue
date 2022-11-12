<template>
  <div class="com-container">
    <div class="title" :style="comStyle">
        <span>{{'▎'+ showTitle}}</span>
        <span class="iconfont title-icon" @click="showChoice = !showChoice" :style="comStyle">&#xe6eb;</span>
        <div class="select-con" v-show="showChoice" :style="marginStyle">
            <div class="select-item" v-for="item in selectTypes" :key="item.key" @click="handleSelect(item.key)">
                {{item.text}}
            </div>
        </div>
    </div>
    <div class="com-chart" ref="trend_ref"></div>
  </div>
</template>

<script>
export default {
    data(){
        return{
            chartInstance:null,
            allData:null,
            choiceType:'map', // 这项数据代表目前选择的数据类型, 可选值有map seller commodity
            showChoice:false,
            titleFontSize:0
        }
    }, 
    created(){
        this.$socket.registerCallBack('trendData',this.getData)
    },
    mounted(){
        this.initChart()
        //this.getData()
        this.$socket.send({
            action:'getData',
            socketType:'trendData',
            chartName:'trend',
            value:''
        })
        window.addEventListener('resize',this.screenAdapter)
        this.screenAdapter()
    },
    destroyed(){
        window.removeEventListener('resize',this.screenAdapter)
        this.$socket.unRegisterCallBack('trendData')
    },
    computed:{
        selectTypes(){
            if(!this.allData || !this.allData.type){
                return []
            }else{ 
                return this.allData.type.filter(item =>{
                    return item.key !==this.choiceType
                })
            }
        },
        showTitle(){
            if(!this.allData){
                return ''
            }else{
                return this.allData[this.choiceType].title
            }
        },
        //标题样式
        comStyle(){
            return{
                fontSize:this.titleFontSize + 'px'
            }
        },
        marginStyle(){
            return{
                marginLeft:this.titleFontSize / 2 + 'px'
            }
        }
    },
    methods:{
        initChart(){
            this.chartInstance = this.$echarts.init(this.$refs.trend_ref,'chalk')
            const initOption = {
                grid:{
                    top:'35%',
                    left:'3%',
                    right:'4%',
                    bottom:'1%',
                    containLabel:true //x轴显示
                },
                //工具提示
                tooltip:{
                    trigger:'axis'
                },
                legend:{
                    top:'15%',
                    icon:'circle',
                    left:20
                },
                xAxis:{
                    type:'category',
                    boundaryGap:false //紧挨边缘
                },
                yAxis:{
                    type:'value'
                }
            }
            this.chartInstance.setOption(initOption)
        },
        //async getData(){
        getData(ret){
           // const { data : ret } = await this.$http.get('trend')
            this.allData = ret
            console.log(ret);
            this.updateChart()
        },
        updateChart(){
            // 半透明的颜色值
            const colorArr1 = [
                'rgba(11, 168, 44, 0.5)',
                'rgba(44, 110, 255, 0.5)',
                'rgba(22, 242, 217, 0.5)',
                'rgba(254, 33, 30, 0.5)',
                'rgba(250, 105, 0, 0.5)'
            ]
            // 全透明的颜色值
            const colorArr2 = [
                'rgba(11, 168, 44, 0)',
                'rgba(44, 110, 255, 0)',
                'rgba(22, 242, 217, 0)',
                'rgba(254, 33, 30, 0)',
                'rgba(250, 105, 0, 0)'
            ]
            // x轴的数据
            const timeArrs = this.allData.common.month
            // y轴的数据
                //map数据
            const valuesArrs = this.allData[this.choiceType].data

            const seriesArr = valuesArrs.map((item,index)=>{
                return{
                    type:'line',
                    name:item.name,
                    data:item.data,
                    stack:this.choiceType,//堆叠图效果 stack属性的值相同就够了
                    areaStyle:{
                        color:new this.$echarts.graphic.LinearGradient(0,0,0,1,[
                            {
                                offset:0,
                                color:colorArr1[index]
                            },
                            {
                                offset:1,
                                color:colorArr2[index]
                            }
                        ])
                    }
                }
            })

            const legendArr = valuesArrs.map((item)=>{
                return item.name
            })

            const dateOption ={
                xAxis:{
                    data:timeArrs
                },
                legend:{
                    data:legendArr
                },
                series:seriesArr
            }
            this.chartInstance.setOption(dateOption)
        },
        handleSelect(currentPage){
            this.choiceType = currentPage
            this.showChoice = false
            this.updateChart()
        },
        screenAdapter(){
            this.titleFontSize = this.$refs.trend_ref.offsetWidth / 100 * 3.6
            const adapterOption = {
                legend:{
                    itemWidth:this.titleFontSize,
                    itemHeight:this.titleFontSize,
                    itemFap:this.titleFontSize,
                    textStyle:{
                        fontSize:this.titleFontSize / 2
                    }
                }
            }
            this.chartInstance.setOption(adapterOption)
            this.chartInstance.resize()
        }
    }
}
</script>

<style scoped>
.title {
    position: absolute;
    left: 20px;
    top: 20px;
    z-index: 10;
    color: white;
}
.title-icon {
    margin-left: 10px;
    cursor: pointer;
}
.select-item {
    cursor: pointer;
}
.select-con{
    background-color:#222733;
}
</style>