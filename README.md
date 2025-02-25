# Platform Leaflet Components

基于 Leaflet 的地图组件库，提供了多个可复用的地图组件。

## 安装

```bash
npm install my-leaflet-components
```

## 使用方法

### 1. 初始化

首先需要初始化平台并提供认证信息：

```javascript
import { PlatformLeaflet, Components } from 'my-leaflet-components';
import 'my-leaflet-components/dist/style.css';  // 引入样式

// 初始化平台
PlatformLeaflet.getInstance().init({
    token: 'your-token-here',
    passkey: 'your-passkey-here',
    debug: true  // 开启调试模式
});
```

### 2. 使用组件

初始化完成后，可以通过 `Components` 对象创建各种组件：

```javascript
// 创建3D图层
const layer = Components.ThreeDLayer({
    height: 150,
    color: '#ff3388'
});
layer.addTo(map);

// 创建位置控制器
const centerControl = Components.ChangeCenterControl({
    target: 'custom-container',
    zoom: 12
});
centerControl.addTo(map);

// 创建视频播放器
const videoPlayer = Components.VideoPlayerControl({
    url: 'https://example.com/video.mp4',
    width: 800,
    height: 450
});
videoPlayer.addTo('video-container');
```

## 组件说明

### ThreeDLayer

3D 图层组件，用于在地图上显示 3D 效果。

```javascript
const layer = Components.ThreeDLayer({
    height: 150,    // 3D 效果的高度
    color: '#ff3388' // 颜色
});
```

### ChangeCenterControl

地图中心点控制器，允许用户输入经纬度来改变地图中心。

```javascript
const control = Components.ChangeCenterControl({
    target: 'container-id',  // 可选，指定挂载的容器
    zoom: 12,               // 缩放级别
    animateDuration: 1.5    // 动画持续时间（秒）
});
```

### VideoPlayerControl

视频播放器组件，可以在页面任意位置显示视频。

```javascript
const player = Components.VideoPlayerControl({
    target: 'container-id',  // 可选，指定挂载的容器
    url: 'video-url',       // 视频地址
    width: 800,            // 播放器宽度
    height: 450            // 播放器高度
});
```

## 配置选项

### 初始化配置

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| token | string | 是 | 认证令牌 |
| passkey | string | 是 | 通行密钥 |
| apiUrl | string | 否 | API 地址，默认为 https://api.default.com |
| debug | boolean | 否 | 是否开启调试模式，默认为 false |

## 注意事项

1. 使用任何组件前必须先调用 `PlatformLeaflet.getInstance().init()` 进行初始化
2. 所有组件都需要通过 `Components` 对象创建
3. 确保提供正确的认证信息，否则组件将无法使用

## 示例

完整的示例代码可以在 `example` 目录中找到。

## License

MIT
