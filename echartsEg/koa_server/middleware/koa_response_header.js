//设置响应头中间件
module.exports = async (ctx,next) =>{
    const contentType = 'application/json; charset=utf-8'
    ctx.set('Content-Type',contentType);
    //同源跨域问题
    ctx.set('Access-Control-Allow-Origin','*');
    ctx.set('Access-Allow-Methods','POTIONS,GET,PUT,POST,DELETE')
    // ctx.response.body = '{"success":true}'
    await next()
}