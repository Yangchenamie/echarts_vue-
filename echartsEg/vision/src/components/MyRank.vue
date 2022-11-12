<template>
    <div class='com-container'>
        <div class='com-chart' ref='rank_ref'></div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            chartInstance:null,
            allDate:null,
            startValue:0,
            endValue:9,
            timeId:null
        }
    },
    created(){
        this.$socket.registerCallBack('rankData',this.getData)
    },
    mounted(){
        this.initEcharts()
        //this.getData()
        this.$socket.send({
            action:'getData',
            socketType:'rankData',
            chartName:'rank',
            value:''
        })
        window.addEventListener('resize',this.screenAdapter)
        this.screenAdapter()
    },
    destroyed(){
        window.removeEventListener('resize',this.screenAdapter)
        clearInterval(this.timeId)
        this.$socket.unRegisterCallBack('rankData')
    },
    methods:{
        initEcharts(){
            this.chartInstance = this.$echarts.init(this.$refs.rank_ref,'chalk')
            const initOption ={
                title: {
                    text: '▎ 地区销售排行',
                    left: 20,
                    top: 20
                },
                grid:{
                    top:'40%',
                    left:'5%',
                    bottom:'5%',
                    right:'5%',
                    containLabel:true //坐标轴大小有没有包含坐标上的文字 防止数值过大而超出视图  
                },
                tooltip:{
                    show:true
                },
                xAxis:{
                    type:'category'
                },
                yAxis:{
                    type:'value'
                },
                series:[
                    {
                        type:'bar',
                    }
                ]
            }
            this.chartInstance.setOption(initOption)
            this.chartInstance.on('mouseover',()=>{
                clearInterval(this.timeId)
            })
            this.chartInstance.on('mouseout',()=>{
                this.setInterval()
            })
        },
        //async getData(){
        getData(ret){
            //const {data:ret} = await this.$http.get('rank')
            this.allDate = ret
            this.allDate.sort((a,b)=>{
                return b.value - a.value
            })
            this.updateChart()
            this.setInterval()
        },
        updateChart(){
            const colorArr = [
                ['#0BA82C', '#4FF778'],
                ['#2E72BF', '#23E5E5'],
                ['#5052EE', '#AB6EE5']
            ]
            const provinceArr = this.allDate.map(item =>{
                return item.name
            })
            const valueArr = this.allDate.map(item =>{
                return item.value
            })
            const updateOption = {
                xAxis:{
                    data:provinceArr
                },
                dataZoom:{
                    show:false,
                    startValue:this.startValue,
                    endValue:this.endValue
                },
                series:[
                    {
                        data:valueArr,
                        itemStyle:{
                            color:  arg =>{
                                let targetColorArr = null
                                if(arg.value > 300)
                                    targetColorArr = colorArr[0]
                                else if(arg.value > 200) 
                                    targetColorArr = colorArr[1]
                                else
                                    targetColorArr =colorArr[2]
                                return new this.$echarts.graphic.LinearGradient(0,0,0,1,[
                                        {
                                        offset:0,
                                        color:targetColorArr[0]
                                        },
                                        {
                                        offset:1,
                                        color:targetColorArr[1]
                                        }
                                    ])
                            }
                        }
                    }
                ]
            }
            this.chartInstance.setOption(updateOption)
        },
        screenAdapter(){
            const titleFontSize = this.$refs.rank_ref.offsetWidth / 100 * 3.6
            const adapterOption ={
                title:{
                    textStyle:{
                        fontSize:titleFontSize
                    }
                },
                series:[
                    {
                        barWidth:titleFontSize,
                        itemStyle:{
                            barBorderRadius:[0.5 * titleFontSize,0.5 * titleFontSize,0,0]
                        }
                    }
                ]

            }
            this.chartInstance.setOption(adapterOption)
            this.chartInstance.resize()
        },
        setInterval(){
            if(this.timeId){
                clearInterval(this.timeId)
            }
            this.timeId = setInterval(()=>{
                this.startValue++;
                this.endValue++;
                if(this.endValue > this.allDate.length - 1){
                    this.startValue = 0;
                    this.endValue = 9
                }
                this.updateChart()
            },3000)
        }
    }
}
</script>

<style>

</style>