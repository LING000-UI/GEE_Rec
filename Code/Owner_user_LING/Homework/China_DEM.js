/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var table = ee.FeatureCollection("projects/ee-glj320104/assets/Country/China_WGS84");
/***** End of imports. If edited, may not auto-convert in the playground. *****/
// 定义中国的边界
var china = table;


// 加载SRTM DEM数据
var srtm = ee.Image("USGS/SRTMGL1_003");

// 裁剪DEM数据到中国边界
var demChina = srtm.clip(china);

// 可视化DEM
Map.centerObject(china, 4);
Map.addLayer(demChina, {min: 0, max: 6000, palette: ['0000FF', '00FF00', 'FFFF00', 'FF0000']}, 'China DEM');



// // 设置重采样方法
// var resampledImage = demChina.resample('bilinear'); // 'nearest', 'bilinear', or 'bicubic'

// // 将影像重新投影到一个新的分辨率
// var demChinars_rs = resampledImage.reproject({
//   crs: 'EPSG:4326', // 坐标参考系
//   scale: 500       // 目标分辨率
// });


// Map.addLayer(demChinars_rs, {min: 0, max: 3000, palette: ['0000FF', '00FF00', 'FFFF00', 'FF0000']}, 'China DEM RS');





// 导出数据到Google Drive
Export.image.toDrive({
  image: demChina,
  description: 'China_DEM',
  scale: 1000,
  region: china.geometry().bounds(),
  maxPixels: 1e13
});
