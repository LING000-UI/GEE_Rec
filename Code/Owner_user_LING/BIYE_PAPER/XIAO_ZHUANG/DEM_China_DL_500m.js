// 1. 加载矢量文件（可以是 Fusion Table, 资产，或手动绘制的区域）
var region = ee.FeatureCollection('projects/ee-glj320104/assets/China_2024_0650'); // 替换为你的矢量数据路径

// 2. 加载 SRTM 数据（30m分辨率）
var dem = ee.Image("USGS/SRTMGL1_003");

// 3. 将分辨率重采样到 500 米（方式为双线性插值）
var dem_500m = dem
  .resample('bilinear')
  .reproject({
    crs: 'EPSG:4326',
    scale: 500
  });

// 4. 可视化 DEM（可选）
Map.centerObject(region, 8);
Map.addLayer(dem_500m.clip(region), {min: 0, max: 3000, palette: ['blue', 'green', 'brown']}, "500m DEM");

// 5. 导出 DEM 图像到 Google Drive
Export.image.toDrive({
  image: dem_500m.clip(region),
  description: 'DEM_500m_Export',
  folder: 'GEE_exports', // Drive 中的文件夹名称
  fileNamePrefix: 'dem_500m',
  region: region.geometry(),
  scale: 500,
  crs: 'EPSG:4326',
  maxPixels: 1e13
});
