// 导入夜间灯光数据集
var dataset = ee.ImageCollection('NOAA/DMSP-OLS/NIGHTTIME_LIGHTS');

// 设置时间范围
var filteredDataset = dataset.filterDate('2022-01-01', '2022-12-31');

// 添加夜间灯光数据图层到地图
Map.addLayer(filteredDataset, {}, 'Nighttime Lights');

// 设置地图显示范围和缩放级别
Map.centerObject(filteredDataset, 6);