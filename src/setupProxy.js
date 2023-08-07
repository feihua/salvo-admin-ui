const {createProxyMiddleware} = require('http-proxy-middleware')//引入http-proxy-middleware，react脚手架已经安装

module.exports = function (app) {
    app.use(
        createProxyMiddleware('/salvo/interview/api', { //遇见/api1前缀的请求，就会触发该代理配置
            target: 'http://127.0.0.1:8100', //请求转发给谁-本地调试
            // target: 'http://139.159.180.129:81/salvo/interview', //请求转发给谁-远程调试
            changeOrigin: true,//控制服务器收到的请求头中Host的值
            pathRewrite: {'^/salvo/interview': ''} //重写请求路径，下面有示例解释
        }),
        createProxyMiddleware('/api2', {
            target: 'http://175.178.110.17',
            changeOrigin: true,
            // pathRewrite:{'^/api2':''}
        }),
    )
}
