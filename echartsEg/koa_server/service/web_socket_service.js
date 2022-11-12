const path = require('path')
const fileUtils = require('../utils/file_utils')
const WebSocket = require('ws')
const { join } = require('path')
// 创建出WebSocket实例对象
const wss = new WebSocket.Server({
    port:9998
})
//服务端开启了监听
module.exports.listen = function(){
    //对客户端的连接事件进行监听
    //client：代表的是客户端的连接socket对象
    wss.on("connection",client =>{
        console.log("有客户端连接...");
        //msg:由客户发送给服务端的数据
        client.on("message",async msg =>{
            let payload = JSON.parse(msg)
            if(payload.action==='getData'){
                let filePath = '../data/' + payload.chartName +'.json' //../data/seller.json
                filePath = path.join(__dirname,filePath)
                const ret = await fileUtils.getFileJsonDate(filePath)
                payload.data = ret
                client.send(JSON.stringify(payload))
            }else{
                wss.clients.forEach(client => {
                    console.log("*****************************************")
                    client.send(msg)
                    
                });
            }
            // console.log("客户端发送数据过来了");
            // //由服务器端往客户端发送数据
            // client.send('hello socket')
        })
    })
}