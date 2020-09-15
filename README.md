# 像素公寓服务端

#### 介绍

项目采用 vue 全家桶 + muse-ui 开发

1. vue v2.5.13
2. muse-ui v3.0.2
3. vuex v3.0.1

之所以采用 2.5.13 版本 vue 是因为 muse-ui 已长时间无人维护了，vue 2.5.13 以上的版本优化了事件执行机制，muse-ui 在日期控件 和水波纹效果上
会出现 触发事件的顺序错误的 bug

#### 主要功能

1. 找房服务
2. 签约系统服务
3. 保洁系统服务
4. 维修系统服务

#### 主要技术点

1. 定位打卡
2. 图片懒加载/上传/压缩
3. vue mixins
4. 基于 swiper 图片预览插件封装
5. ios/android 下 input 表现处理
6. h5 适配方案
7. 动态路由加载
