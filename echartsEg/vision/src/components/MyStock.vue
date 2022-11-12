<template>
    <div class='com-container'>
        <div class='com-chart' ref='stock_ref'></div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            chartInstance:null,
            allData:null,
            timeId:null,
            currentIndex:0,
            titleFontSize:0
        }
    },
    created(){
        this.$socket.registerCallBack('stockData',this.getData)
    },
    mounted(){
        this.initEchart()
        this.$socket.send({
            action:'getData',
            socketType:'stockData',
            chartName:'stock',
            value:''
        })
        //this.getData()
        window.addEventListener('resize',this.screenAdapter)
        this.screenAdapter()
    },
    destroyed(){
        window.removeEventListener('resize',this.screenAdapter)
        clearInterval(this.timeId)
        this.$socket.unRegisterCallBack('stockData')
    },
    methods:{
        initEchart(){
            this.chartInstance = this.$echarts.init(this.$refs.stock_ref,'chalk')
            const initOption = {
                title: {
                    text: '▎ 库存销售量',
                    left: 20,
                    top: 20
                }
            }
            this.chartInstance.setOption(initOption)
            this.chartInstance.on('mouseover',()=>{
                clearInterval(this.timeId)
            })
            this.chartInstance.on('mouseout',()=>{
                this.startInterval()
            })
        },
        //async getData(){
            getData(ret){
            // const {data:ret} =await this.$http.get('stock')
            this.allData = ret
            console.log(this.allData);
            this.updateChart()   
            this.startInterval()         
        },
        updateChart(){
            // 处理图表需要的数据
            // 5个圆环对应的圆心点
            const centerPointers = [
                ['18%', '40%'],
                ['50%', '40%'],
                ['82%', '40%'],
                ['34%', '75%'],
                ['66%', '75%']
            ]
            // 增加5个圆环的渐变颜色范围
            const colorArrs = [
                ['#4FF778', '#0BA82C'],
                ['#E5DD45', '#E8B11C'],
                ['#E8821C', '#E55445'],
                ['#5052EE', '#AB6EE5'],
                ['#23E5E5', '#2E72BF']
            ]
            const start = this.currentIndex * 5
            const end = (this.currentIndex + 1) * 5
            const showData = this.allData.slice(start,end)
            const seriesArr = showData.map((item,index)=>{
                return{
                        //type:'pie',
                        center:centerPointers[index],
                        label:{
                            show:true,
                            position:'center',
                            color:colorArrs[index][0]
                        },
                        //鼠标移入动画的移除
                        hoverAnimation:false,
                        //指示线的移除
                        labelLine:{
                            show:false
                        },
                    data:[
                        {
                            value:item.sales,
                            name:item.name + '\n\n' + item.sales,
                            itemStyle:{
                                color:new this.$echarts.graphic.LinearGradient(0,1,0,0,[
                                    {
                                        offset:0,
                                        color:colorArrs[index][0]
                                    },
                                    {
                                        offset:1,
                                        color:colorArrs[index][1]
                                    }
                                ])
                            }
                        },{
                            value:item.stock,
                            itemStyle:{
                                color:'#333843'
                            }
                        }
                    ]
                }
            })
            const updateOption = {
                series:seriesArr
            } 
            this.chartInstance.setOption(updateOption)
        },
        screenAdapter(){
            this.titleFontSize = this.$refs.stock_ref.offsetWidth / 100 * 3.6
            const innerRadius = this.titleFontSize * 2.8
            const outterRadius = innerRadius * 1.125
            const adapterOption = {
                title:{
                    textStyle:{
                        fontSize:this.titleFontSize
                    }
                },
                series:[
                    {
                        type:'pie',
                        radius:[outterRadius,innerRadius],
                        label:{
                            fontSize:this.titleFontSize / 2
                        }
                    },
                    {
                        type:'pie',
                        radius:[outterRadius,innerRadius],
                        label:{
                            fontSize:this.titleFontSize / 2
                        }
                    },
                    {
                        type:'pie',
                        radius:[outterRadius,innerRadius],
                        label:{
                            fontSize:this.titleFontSize / 2
                        }
                    },
                    {
                        type:'pie',
                        radius:[outterRadius,innerRadius],
                        label:{
                            fontSize:this.titleFontSize / 2
                        }
                    },
                    {
                        type:'pie',
                        radius:[outterRadius,innerRadius],
                        label:{
                            fontSize:this.titleFontSize / 2
                        }
                    },
                ]
            }
            this.chartInstance.setOption(adapterOption)
            this.chartInstance.resize()
        },
        startInterval(){
            if(this.timeId){
                clearInterval(this.timeId)
            }
            this.timeId = setInterval(()=>{
                this.currentIndex++
                if(this.currentIndex > 1){
                    this.currentIndex = 0
                }
                this.updateChart()
            },3000)
        }
    }
}
</script>

<style>

</style>