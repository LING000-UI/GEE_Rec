// 步骤 1: 加载你的 shp 文件（已上传到 Assets）
var roi = ee.FeatureCollection("projects/ee-glj320104/assets/Chian_2_4326_hb"); // 替换为你实际的路径

// 步骤 2: 设置时间范围
var startDate = '2023-01-01';
var endDate = '2023-12-31';

// 步骤 3: 加载并筛选 Sentinel-2 图像
var s2 = ee.ImageCollection('COPERNICUS/S2_SR') // 使用 Level-2A 的地表反射率产品
  .select(['B4', 'B3', 'B2']) // 使用中值合成减少云影响
  .filterDate(startDate, endDate)
  .filterBounds(roi)
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 10)) // 筛选云量小于10%
  .median();
  
  
  
// 重采样影像
var s2 = s2.reproject({
  crs: 'EPSG:4326', // 指定投影
  scale: 2000 // 指定新的分辨率
});
  

// 步骤 4: 裁剪到 ROI
var clipped = s2.clip(roi);

// 步骤 5: 可视化参数（真彩色）
var visParams = {
  bands: ['B4', 'B3', 'B2'], // 红绿蓝
  min: 0,
  max: 3000,
  gamma: 1.2,
};

// 步骤 6: 在地图上显示
Map.centerObject(roi, 10); // 缩放等级可根据需要调整
Map.addLayer(clipped, visParams, 'Sentinel-2 True Color');

// 步骤 7: 导出图像到 Google Drive
Export.image.toDrive({
  image: clipped.select(['B4', 'B3', 'B2']),
  description: 'Sentinel2_TrueColor',
  folder: 'GEE_Exports',
  scale: 2000,
  region: roi.geometry(),
  crs: 'EPSG:4326',
  maxPixels: 1e13
});
