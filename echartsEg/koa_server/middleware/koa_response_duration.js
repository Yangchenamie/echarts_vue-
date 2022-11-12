//计算服务器消耗时长的中间件
module.exports = async(ctx,next) => {
    //记录开始时间
    const start = new Date()
    //让内层中间件执行完
    await next()
    //记录结束时间
    const end = new Date()
    //设置响应头X-Response-Time
    const duration = end - start
    ctx.set('X-Response-Time',duration + 'ms')
}