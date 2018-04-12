# joojee-swwd

> 税务问答项目 使用的vue框架以及vux, vue-router, vuex, axios等技术

> 项目代码比较精致  对项目控件进行了封装使用，完全发挥了插件化开发的优势，还有对全局请求管理，数据状态管理做了很好的分离和处理，其他项目可以参考借鉴


***
> 目录结构

<pre>
├── build              // 构建服务和webpack配置
├── config             // 项目不同环境的配置
├── dist               // 项目build目录
├── index.html         // 项目入口文件
├── package.json       // 项目配置文件
├── src                // 生产目录
│   ├── assets         // 静态资源
│   |   ├── font       // 字体图标
│   |   ├── imgs       // 图片和切图
│   ├── network        // 网络请求封装
│   |   ├── axios.js   // 对axios进行封装，提供了请求和响应过滤器
│   |   ├── index.js   // 环境和请求接口
│   ├── router         // 路由封装 对税企通公共头部和menu菜单进行了集成
│   ├── store          // 全局状态管理树
│   |   ├── modules    // 分类（全局、业务）
│   |   ├── index.js         
│   ├── utils          // 工具类
│   |   ├── bus.js     // 组件间通讯封装
│   |   ├── index.js   // 基础公共方法封装
│   ├── views          // 所有页面
│   ├── App.vue        // 主页面 
│   └── main.js        // Webpack 预编译入口
</pre>
