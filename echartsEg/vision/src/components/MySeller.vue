<template>
    <div class="com-container">
        <!-- 这里的ref是为了init函数获取到 com-chart 这个dom元素-->
        <div class="com-chart" ref="seller_ref"></div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            chartInstance:null,//echarts 实例对象
            allData:[],//服务器获取的所有数据
            currentPage: 1,
            totalPage: 0,
            timeId: null // 定时器标识
        }
    },
    created(){
        this.$socket.registerCallBack('sellerData',this.getData)
    },
    mounted(){
        // 由于初始化echarts实例对象需要使用到dom元素,因此必须要放到mounted中, 而不是created
        this.initEcharts(),
        //this.getData(),
        this.$socket.send({
            action:'getData',
            socketType:'sellerData',
            chartName:'seller',
            value:''
        })
        window.addEventListener('resize',this.screenAdapter)
        this.screenAdapter()
    },
    destroyed(){
        clearInterval(this.timeId)
        window.removeEventListener('resize',this.screenAdapter)
        this.$socket.unRegisterCallBack('sellerData')
    },
    methods:{
        initEcharts(){
            //初始化echarts实例对象
            this.chartInstance = this.$echarts.init(this.$refs.seller_ref,'chalk')
            this.chartInstance.on('mouseover',()=>{
                clearInterval(this.timeId)
            })
            this.chartInstance.on('mouseout',()=>{
                this.startInterval()
            })
            const initOptions = {
                title:{
                    text:'▎ 商家销量排行',
                    left:20,
                    top:20,
                    textStyle:{
                        textStyle:{
                            "color":"#fff"
                        },
                    }
                },
                grid:{
                    top:'20%',
                    left:'3%',
                    right:'6%',
                    bottom:'3%',
                    containLabel:true
                },
                xAxis:{
                    type:'value',
                },
                yAxis:{
                    type:'category'
                },
                series:[
                    {
                        type:'bar',
                        label:{
                            show:true,
                            position:'right',
                            textStyle:{
                                color:'#fff'
                            }
                        },
                        itemStyle:{
                            color:new this.$echarts.graphic.LinearGradient(0,0,1,0,[
                                {
                                    offset:0,
                                    color:'#5052ee',
                                },
                                {
                                    offset:1,
                                    color:'#AB6EE5',
                                }
                            ]),
                        }
                    }
                ],
                tooltip:{
                    trigger:'axis',
                    axisPointer:{
                        type:'line',
                        z:0,
                        lineStyle:{
                            color:'#2D3443'
                        }
                    }
                }
            }
            this.chartInstance.setOption(initOptions)
        },
        //async getData(){
        getData(ret){
            //const {data:ret } = await this.$http.get('seller')
            //console.log(res);
            this.allData = ret;
            this.allData.sort((a,b)=>{
                return a.value - b.value
            })
            //计算总页数
            this.totalPage = this.allData.length % 5 ===0 ? this.allData.length / 5 : (this.allData.length / 5) +1
            this.updateCharts()
            this.startInterval();//开启动画效果
        },
        updateCharts(){
            const start = (this.currentPage - 1) * 5
            const end = this.currentPage * 5;
            const showData = this.allData.slice(start,end)
            const sellerNames = showData.map((item)=>{
                return item.name
            })
            const sellerValues = showData.map((item)=>{
                return item.value
            })
            const dataOption = {
                yAxis:{
                    data:sellerNames
                },
                series:[
                    {
                        data:sellerValues
                    }
                ]
            }
            this.chartInstance.setOption(dataOption)
        },
        //分辨率适配  对窗口大小变化的事件进行监听
        startInterval(){
            if(this.timeId){
                clearInterval(this.timeId)
            }
            this.timeId = setInterval(()=>{
                    this.currentPage++;
                    if(this.currentPage > this.totalPage){
                        this.currentPage = 1
                    }
                    this.updateCharts()
                },3000)
        },
        screenAdapter(){
            // console.log(this.$refs.seller_ref.offsetWidth);
            const titleFontSize = this.$refs.seller_ref.offsetWidth / 100 * 3.6
            const adapterOption = {
                title:{
                    textStyle:{
                        fontSize:titleFontSize
                    }
                },
                series:[
                    {
                        barWidth:titleFontSize,
                        itemStyle:{
                            barBorderRadius:[0,titleFontSize / 2,titleFontSize / 2,0],
                        }
                    }
                ]
            }
            this.chartInstance.setOption(adapterOption)
            // 手动的调用图表对象的resize 才能产生效果
            this.chartInstance.resize()
        }
    }
}
</script>

<style>

</style>