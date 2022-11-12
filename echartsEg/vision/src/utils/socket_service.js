// export default class SocketService {
//   /**
//    * 单例
//    */
//   static instance = null
//   static get Instance() {
//     if (!this.instance) {
//       this.instance = new SocketService()
//     }
//     return this.instance
//   }

//   // 和服务端连接的socket对象
//   ws = null

//   // 存储回调函数
//   callBackMapping = {}

//   // 标识是否连接成功
//   connected = false

//   // 记录重试的次数
//   sendRetryCount = 0

//   // 重新连接尝试的次数
//   connectRetryCount = 0

//   //  定义连接服务器的方法
//   connect() {
//     // 连接服务器
//     if (!window.WebSocket) {
//       return console.log('您的浏览器不支持WebSocket')
//     }
//     this.ws = new WebSocket('ws://localhost:9998')

//     // 连接成功的事件
//     this.ws.onopen = () => {
//       console.log('连接服务端成功了')
//       this.connected = true
//       // 重置重新连接的次数
//       this.connectRetryCount = 0
//     }
//     // 1.连接服务端失败
//     // 2.当连接成功之后, 服务器关闭的情况
//     this.ws.onclose = () => {
//       console.log('连接服务端失败')
//       this.connected = false
//       this.connectRetryCount++
//       setTimeout(() => {
//         this.connect()
//       }, 500 * this.connectRetryCount)
//     }
//     // 得到服务端发送过来的数据
//     this.ws.onmessage = msg => {
//       console.log('从服务端获取到了数据')
//       // 真正服务端发送过来的原始数据时在msg中的data字段
//       // console.log(msg.data)
//       const recvData = JSON.parse(msg.data)
//       const socketType = recvData.socketType
//       // 判断回调函数是否存在
//       if (this.callBackMapping[socketType]) {
//         const action = recvData.action
//         if (action === 'getData') {
//           const realData = JSON.parse(recvData.data)
//           this.callBackMapping[socketType].call(this, realData)
//         } else if (action === 'fullScreen') {
//           this.callBackMapping[socketType].call(this, recvData)
//         } else if (action === 'themeChange') {
//           this.callBackMapping[socketType].call(this, recvData)
//         }
//       }
//     }
//   }

//   // 回调函数的注册
//   registerCallBack (socketType, callBack) {
//     this.callBackMapping[socketType] = callBack
//   }

//   // 取消某一个回调函数
//   unRegisterCallBack (socketType) {
//     this.callBackMapping[socketType] = null
//   }

//   // 发送数据的方法
//   send (data) {
//     // 判断此时此刻有没有连接成功
//     if (this.connected) {
//       this.sendRetryCount = 0
//       this.ws.send(JSON.stringify(data))
//     } else {
//       this.sendRetryCount++
//       setTimeout(() => {
//         this.send(data)
//       }, this.sendRetryCount * 500)
//     }
//   }
// }
export default class SocketService{
  //单例
  static instance = null
  static get Instance(){
    if(!this.instance){
      this.instance = new SocketService()
    }
    return this.instance
  }

  //和服务端连接的socket对象
  ws=null
  
  // 业务类型和回调函数的对于关系
  callBackMapping={}
  //用于标识是否连接成功
  connected = false
  //记录重试次数
  sendRetryCount = 0
  //重新连接尝试的次数
  connectRetryCount = 0

//定义连接服务器的方法
  connect(){
    //连接服务器
    if(!window.WebSocket){
      return console.log("您的游览器不支持！");
    }
    this.ws = new WebSocket('ws://localhost:9998')
    // 监听连接成功
    this.ws.onopen = ()=>{
      console.log('WebSocket连接成功');
      this.connected = true
      this.connectRetryCount = 0
    }
    // 1.服务器连接不成功 2.服务器关闭了连接
    this.ws.onclose = ()=>{
      console.log('服务器关闭了连接');
      this.connect = false
      setTimeout(()=>{
        this.connect()
      },this.connectRetryCount * 500)
    }
    this.ws.onmessage = msg=>{
      console.log('WebSocket接收到数据');
      //真正服务器发送过来的原始数据实在msg中的data字段
      console.log(msg.data);
      const recvData = typeof msg.data ==='string'? JSON.parse(msg.data) : msg.data
      const socketType = recvData.socketType
      //判断回调函数是否存在
      if(this.callBackMapping[socketType]){
        const action = recvData.action
        if(action === 'getData'){
          const realData = JSON.parse(recvData.data)
          this.callBackMapping[socketType].call(this,realData)
        }else if(action === 'fullScreen'){
          this.callBackMapping[socketType].call(this,recvData)
        }else if(action ==='themeChange'){
          this.callBackMapping[socketType].call(this,recvData)
        }
      }
    }
  }
  /**
    * socketType
    * trendData sellerData mapData rankData hotData stockData
    * fullScreen
    * themeChange
    * callBack
    * 回调函数
    */
   // 回调函数的注册
   registerCallBack(socketType,callBack){
    this.callBackMapping[socketType] = callBack
   }
   //取消某一个回调函数
   unRegisterCallBack(socketType){
    this.callBackMapping[socketType] = null
   }
   send(data){
    //判断此时此刻有没有连接成功
      if(this.connected){
        this.sendRetryCount = 0
          this.ws.send(JSON.stringify(data))
      }else{
        setTimeout(()=>{
          this.sendRetryCount++;
          this.send(data)
        },this.sendRetryCount * 200)
      }
   }

}
