<template>
    <div class='com-container'>
        <div class='com-chart' ref='hot_ref'></div>
        <span class="iconfont arr_left" @click="toLeft" :style="comStyle">&#xe6ef;</span>
        <span class="iconfont arr_right" @click="toRight" :style="comStyle">&#xe6ed;</span>
        <span class="cat_name" :style="comStyle">{{ catTitle }}</span>
    </div>
</template>

<script>
export default {
    data(){
        return{
            chartInstance:null,
            allData:null,
            currentIndex:0,
            titleFontSize:0
        }
    },
    created(){
        this.$socket.registerCallBack('hotData',this.getData)
    },
    mounted(){
        this.initEchart()
        //this.getData()
        this.$socket.send({
            action:'getData',
            socketType:'hotData',
            chartName:'hot',
            value:''
        })
        window.addEventListener('resize',this.screenAdapter)
        this.screenAdapter()
    },
    destroyed(){
        window.removeEventListener('resize',this.screenAdapter)
        this.$socket.unRegisterCallBack('hotData')
    },
    computed:{
        catTitle(){
            if(!this.allData){
                return ''
            }else{
                return this.allData[this.currentIndex].name
            }
        },
        comStyle(){
            return{
                fontSize:this.titleFontSize + 'px'                 
            }
        }
    },
    methods:{
        initEchart(){
            this.chartInstance = this.$echarts.init(this.$refs.hot_ref,'chalk')
            const initOption = {
                title: {
                    text: '▎ 热销商品销售金额占比统计',
                    left: 20,
                    top: 20
                },
                legend:{
                    top:'15%',
                    icon:'circle'
                },
                series:[
                    {
                        type:'pie',//饼图
                        label:{ // 隐藏文字
                            show:false
                        },
                        labelLine:{// 隐藏线
                            show:false
                        },
                        emphasis:{
                            label:{
                                show:true// 高亮显示文字
                            }
                        }
                    }
                ],
                //显示 tooltip ,并控制显示内容
                tooltip:{
                    trigger:'item',
                    formatter:arg =>{
                        let tipArray = []
                        console.log(arg);
                        arg.data.children.forEach(function(item){
                            let childStr = `${item.name}:${parseInt((item.value / arg.value) * 100) + '%'}`
                            tipArray.push(childStr)
                        })
                        return tipArray.join('<br/>')
                    }
                    }
                }
            this.chartInstance.setOption(initOption)
        },
        //async getData(){
        getData(ret){
            //const {data:ret}= await this.$http.get('hot')
            console.log(ret);
            this.allData = ret
            this.updatechart()
        },
        updatechart(){
            const seriesData = this.allData[this.currentIndex].children.map(item=>{
                return{
                    value:item.value,
                    name:item.name,
                    children:item.children
                }
            })
            const legendData = this.allData[this.currentIndex].children.map(item=>{
                return{
                    name:item.name
                }
            })
            console.log(legendData);
            //console.log(seriesData);
            const updateOption ={
                legend:{
                    data:legendData
                },
                series:[
                    {
                        data:seriesData
                    }
                ]
            }
            this.chartInstance.setOption(updateOption)
        },
        screenAdapter(){
            this.titleFontSize = this.$refs.hot_ref.offsetWidth / 100 * 3.6
            const adapterOption ={
                title:{
                    textStyle:{
                        fontSize:this.titleFontSize
                    }
                },
                series:[
                    {
                        radius:this.titleFontSize * 4.5,
                        center:['50%','60%']
                    }
                ],
                legend:{
                    itemWidth:this.titleFontSize,
                    itemHeight:this.titleFontSize,
                    itemGap:this.titleFontSize / 2,
                    textStyle:{
                        fontSize:this.titleFontSize / 2
                    }
                }
            }
            this.chartInstance.setOption(adapterOption)
            this.chartInstance.resize()
        },
        toLeft(){
            this.currentIndex--;
            if(this.currentIndex < 0){
                this.currentIndex = this.allData.length - 1
            }
            this.updatechart()
        },
        toRight(){
            this.currentIndex++;
            if(this.currentIndex > this.allData.length - 1){
                this.currentIndex = 0
            }
            this.updatechart()
        }
    }
}
</script>

<style>
.arr_left {
    position: absolute;
    left: 10%;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    transform: rotate(0deg);
    transform: rotate(0deg) !important;
    color: white;
}
.arr_right {
    position: absolute;
    right: 10%;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    transform: rotate(0deg) !important;
    color: white;
}
.cat_name {
    position: absolute;
    left: 80%;
    bottom: 20px;
    font-weight: bold;
    color: white;
}
</style>