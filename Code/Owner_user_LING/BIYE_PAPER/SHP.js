// 定义目标区域（示例：河南省中部，请替换为实际坐标）
var geometry = ee.Geometry.Rectangle([112.5, 34.0, 114.5, 35.5]);

// 定义时间范围（示例：2023年夏季）
var startDate = '2023-06-01';
var endDate = '2023-06-10';

/******************** 数据获取与处理 ********************/
// Sentinel-2 SR数据（10米分辨率）
var s2 = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
  .filterBounds(geometry)
  .filterDate(startDate, endDate)
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))
  .first()
  .clip(geometry);

// Landsat-8 SR数据（30米分辨率）
var l8 = ee.ImageCollection('LANDSAT/LC08/C02/T1_L2')
  .filterBounds(geometry)
  .filterDate(startDate, endDate)
  .sort('CLOUD_COVER')
  .first()
  .clip(geometry);

// MODIS数据（500米分辨率）
var modis = ee.ImageCollection('MODIS/061/MOD09GA')
  .filterBounds(geometry)
  .filterDate(startDate, endDate)
  .first()
  .clip(geometry);

/******************** 可视化参数 ********************/
// Sentinel-2真彩色显示
var s2Vis = {bands: ['B4', 'B3', 'B2'], min: 0, max: 3000, gamma: 1.2};

// Landsat-8真彩色显示
var l8Vis = {bands: ['SR_B4', 'SR_B3', 'SR_B2'], min: 0, max: 30000, gamma: 1.3};

// MODIS真彩色显示
var modisVis = {bands: ['sur_refl_b01', 'sur_refl_b04', 'sur_refl_b03'], min: 0, max: 3000, gamma: 1.2};

/******************** 地图显示 ********************/
Map.centerObject(geometry, 8);
Map.addLayer(s2, s2Vis, 'Sentinel-2');
Map.addLayer(l8, l8Vis, 'Landsat-8');
Map.addLayer(modis, modisVis, 'MODIS');

/******************** 数据导出 ********************/
// 导出Sentinel-2
Export.image.toDrive({
  image: s2.select(['B2','B3','B4','B8']), // 导出蓝、绿、红、近红外波段
  description: 'Sentinel2_Export',
  fileNamePrefix: 'S2_Export',
  region: geometry,
  scale: 10,
  maxPixels: 1e13
});

// 导出Landsat-8
Export.image.toDrive({
  image: l8.select(['SR_B2','SR_B3','SR_B4','SR_B5']), // 蓝、绿、红、近红外
  description: 'Landsat8_Export',
  fileNamePrefix: 'L8_Export',
  region: geometry,
  scale: 30,
  maxPixels: 1e13
});

// 导出MODIS
Export.image.toDrive({
  image: modis.select(['sur_refl_b01','sur_refl_b04','sur_refl_b03']),
  description: 'MODIS_Export',
  fileNamePrefix: 'MODIS_Export',
  region: geometry,
  scale: 500,
  maxPixels: 1e13
});

print('Export tasks configured. Run tasks from Tasks tab.');