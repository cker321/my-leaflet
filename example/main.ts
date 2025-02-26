import { PlatformLeaflet, Components } from '../src/lib/index';
import L from 'leaflet';

// 初始化地图
const map = L.map('map').setView([39.9042, 116.4074], 13);

// 添加底图
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// 初始化平台
PlatformLeaflet.getInstance().init({
    token: 'your-token',
    passkey: 'your-passkey',
    apiUrl: 'https://api.example.com'
});

// 创建一些示例图层
const layers = new Map();

function createLayer(color: string, position: [number, number]) {
    return L.circle(position, {
        color: color,
        fillColor: color,
        fillOpacity: 0.5,
        radius: 500
    });
}

// 创建初始图层
const layer1 = createLayer('#ff0000', [39.9042, 116.4074]);
const layer2 = createLayer('#0000ff', [39.9142, 116.4174]);

layers.set('layer1', layer1);
layers.set('layer2', layer2);

layer1.addTo(map);
layer2.addTo(map);

// 创建图例
const legend = Components.LegendControl({
    position: 'topright',
    title: '图例',
    showOpacity: true
});

// 添加图例项
legend.setItems([
    {
        id: 'item1',
        label: '红色圆',
        layerId: 'layer1',
        color: '#ff0000'
    },
    {
        id: 'item2',
        label: '蓝色圆',
        layerId: 'layer2',
        color: '#0000ff'
    }
]);

// 添加图例到地图
legend.addTo(map);

// 控制面板功能
const opacityInput = document.getElementById('layer-opacity') as HTMLInputElement;
const colorInput = document.getElementById('layer-color') as HTMLInputElement;
const addLayerButton = document.getElementById('add-layer') as HTMLButtonElement;

// 更新透明度
opacityInput.addEventListener('input', (e) => {
    const opacity = parseFloat((e.target as HTMLInputElement).value);
    layers.forEach(layer => {
        layer.setStyle({ fillOpacity: opacity });
    });
});

// 更新颜色
colorInput.addEventListener('input', (e) => {
    const color = (e.target as HTMLInputElement).value;
    const selectedLayer = layers.get('layer1');
    if (selectedLayer) {
        selectedLayer.setStyle({ 
            color: color,
            fillColor: color 
        });
    }
});

// 添加新图层
let layerCount = 3;
addLayerButton.addEventListener('click', () => {
    const layerId = `layer${layerCount}`;
    const color = `#${Math.floor(Math.random()*16777215).toString(16)}`;
    const position: [number, number] = [
        39.9042 + (Math.random() - 0.5) * 0.02,
        116.4074 + (Math.random() - 0.5) * 0.02
    ];
    
    const newLayer = createLayer(color, position);
    layers.set(layerId, newLayer);
    newLayer.addTo(map);
    
    legend.addItem({
        id: `item${layerCount}`,
        label: `图层 ${layerCount}`,
        layerId: layerId,
        color: color
    });
    
    layerCount++;
});
