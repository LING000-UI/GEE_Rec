// 定义区域和可视化参数
var region = ee.Geometry.Rectangle([-107, 38, -105, 40]);
var esaVisParams = {bands: ["Map"], min: 10, max: 3000};
var dwVisParams = {min: 0, max: 8, palette: ['#419BDF', '#397D49', '#88B053', '#7A87C6', '#E49635', '#DFC35A', '#C4281B', '#A59B8F', '#B39FE1']};

// 加载ESA和Dynamic World数据
var esa = ee.ImageCollection("ESA/WorldCover/v100").first().clip(region);
var dw = ee.ImageCollection('GOOGLE/DYNAMICWORLD/V1').filterDate("2021-01-01", "2022-01-01").filterBounds(region).first().clip(region);

// 创建地图并添加图层
var leftMap = ui.Map();
var rightMap = ui.Map();
var esaVisParams = {
    bands: ['Map'],  // 确保这里使用的波段名称与ESA数据集中的对应
    min: 10,
    max: 100,
    palette: [
        '466b9f', 'd1def8', 'dec5c5', 'd99282', 'eb0000',
        'ffb265', 'fff2cf', '003800', '009678', '00ff00'
    ]  // 这是示例调色板，具体颜色和顺序需要根据数据类型调整
};
// 使用调整后的参数重新加载和显示图层
leftMap.addLayer(esa, esaVisParams, 'ESA Land Cover');
rightMap.addLayer(dw.select('label'), dwVisParams, 'Dynamic World Land Cover'); // 确保只选择一个波段用于显示

// 创建分割面板
var linker = ui.Map.Linker([leftMap, rightMap]);
var splitPanel = ui.SplitPanel({
  firstPanel: leftMap,
  secondPanel: rightMap,
  orientation: 'horizontal',
  wipe: true
});
ui.root.clear();
ui.root.add(splitPanel);

// 为每个地图设置中心和缩放级别
leftMap.setCenter(-106.7349, 39.3322, 10);
rightMap.setCenter(-106.7349, 39.3322, 10);

// 添加图例
function addLegend(map, title, position) {
  var legend = ui.Panel({
    style: {
      position: position,
      padding: '8px 15px'
    }
  });
  
  var legendTitle = ui.Label({
    value: title,
    style: {
      fontWeight: 'bold',
      fontSize: '16px',
      margin: '0 0 4px 0',
      padding: '0'
    }
  });
  legend.add(legendTitle);
  
  map.add(legend);
}

addLegend(leftMap, 'ESA Land Cover', 'bottom-left');
addLegend(rightMap, 'Dynamic World Land Cover', 'bottom-right');
