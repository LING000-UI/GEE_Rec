/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var geometry = 
    /* color: #d63000 */
    /* shown: false */
    ee.Geometry.Point([116.3876938468465, 39.920598123463265]),
    geometry2 = 
    /* color: #0b4a8b */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[116.47998566312245, 40.64301361600517],
          [116.47998566312245, 40.251109632562354],
          [117.10620636624745, 40.251109632562354],
          [117.10620636624745, 40.64301361600517]]], null, false);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
// 定义北京地区的范围
var beijing = geometry;
var sum_start_date = '2022-08-01';
var sum_end_date = '2022-08-31';


var win_start_date = '2022-12-01';
var win_end_date = '2022-12-31';


// // 加载哨兵2号影像集合
// var s2Collection = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
//   .filterBounds(beijing)
//   .filterDate(sum_start_date,sum_end_date)
//   .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 10)); // 过滤云量小于10%的影像

// // 选择一个云量最少的影像
// var s2Image1 = s2Collection.sort('CLOUDY_PIXEL_PERCENTAGE').first();

// // 定义真彩色可视化参数
// var visParams = {
//   bands: ['B4', 'B3', 'B2'],
//   min: 0,
//   max: 3000,
//   gamma: 1.4
// };

// // 在地图上添加哨兵2号真彩色影像
// Map.centerObject(beijing, 10);
// Map.addLayer(s2Image1, visParams, 'Sentinel-2 True Color summer');





// // 加载哨兵2号影像集合
// var s2Collection = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
//   .filterBounds(beijing)
//   .filterDate(win_start_date,win_end_date)
//   .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 10)); // 过滤云量小于10%的影像

// // 选择一个云量最少的影像
// var s2Image2 = s2Collection.sort('CLOUDY_PIXEL_PERCENTAGE').first();

// // 定义真彩色可视化参数
// var visParams = {
//   bands: ['B4', 'B3', 'B2'],
//   min: 0,
//   max: 3000,
//   gamma: 1.4
// };

// // 在地图上添加哨兵2号真彩色影像
// Map.centerObject(beijing, 10);
// Map.addLayer(s2Image2, visParams, 'Sentinel-2 True Color winter');










// // 加载Landsat 9影像集合
// var landsatCollection = ee.ImageCollection('LANDSAT/LC08/C02/T1_L2')
//   .filterBounds(beijing)
//   .filterDate(sum_start_date,sum_end_date)
//   .filter(ee.Filter.lt('CLOUD_COVER', 10)); // 过滤云量小于10%的影像

// // 选择一个云量最少的影像
// var landsatImage1 = landsatCollection.sort('CLOUD_COVER').first();

// // 定义真彩色可视化参数
// var visParamsLandsat = {
//   bands: ['SR_B4', 'SR_B3', 'SR_B2'],
//   min: 0,
//   max: 40000,
//   gamma: 1.4
// };

// // 在地图上添加Landsat 9真彩色影像
// Map.addLayer(landsatImage1, visParamsLandsat, 'Landsat 8 True Color summer');






// // 加载Landsat 9影像集合
// var landsatCollection = ee.ImageCollection('LANDSAT/LC08/C02/T1_L2')
//   .filterBounds(beijing)
//   .filterDate(win_start_date,win_end_date)
//   .filter(ee.Filter.lt('CLOUD_COVER', 25)); // 过滤云量小于10%的影像

// // 选择一个云量最少的影像
// var landsatImage2 = landsatCollection.sort('CLOUD_COVER').first();

// // 定义真彩色可视化参数
// var visParamsLandsat = {
//   bands: ['SR_B4', 'SR_B3', 'SR_B2'],
//   min: 0,
//   max: 40000,
//   gamma: 1.4
// };

// // 在地图上添加Landsat 9真彩色影像
// Map.addLayer(landsatImage2, visParamsLandsat, 'Landsat 8 True Color winter');






/*
*/
// 定义北京地区的范围
// 加载MODIS MOD09A1影像集合
var modisCollection = ee.ImageCollection('MODIS/061/MOD09A1')
  .filterBounds(beijing)
  .filterDate(sum_start_date,sum_end_date);

// 定义云掩膜函数
function maskClouds(image) {
  var qa = image.select('QA');
  // 按位移操作提取云掩膜（这里使用的是MOD09A1的QA位）
  var cloudMask = qa.bitwiseAnd(1 << 10).eq(0);
  return image.updateMask(cloudMask);
}

// 应用云掩膜
var maskedModisCollection = modisCollection.map(maskClouds);

// 选择一个云量最少的影像（可以选择合成影像来减少云量影响）
var modisImage1 = maskedModisCollection.first();

// 定义真彩色可视化参数
var visParams = {
  bands: ['sur_refl_b01', 'sur_refl_b04', 'sur_refl_b03'],
  min: 0,
  max: 4000,
  gamma: 1.4
};

// 在地图上添加MODIS真彩色影像
Map.centerObject(beijing, 8);
Map.addLayer(modisImage1, visParams, 'MODIS True Color sum');





// 加载MODIS MOD09A1影像集合
var modisCollection = ee.ImageCollection('MODIS/061/MOD09A1')
  .filterBounds(beijing)
  .filterDate(win_start_date,win_end_date);

// 定义云掩膜函数
function maskClouds(image) {
  var qa = image.select('QA');
  // 按位移操作提取云掩膜（这里使用的是MOD09A1的QA位）
  var cloudMask = qa.bitwiseAnd(1 << 10).eq(0);
  return image.updateMask(cloudMask);
}

// 应用云掩膜
var maskedModisCollection = modisCollection.map(maskClouds);

// 选择一个云量最少的影像（可以选择合成影像来减少云量影响）
var modisImage2 = maskedModisCollection.first();

// 定义真彩色可视化参数
var visParams = {
  bands: ['sur_refl_b01', 'sur_refl_b04', 'sur_refl_b03'],
  min: 0,
  max: 4000,
  gamma: 1.4
};

// 在地图上添加MODIS真彩色影像
Map.centerObject(beijing, 8);
Map.addLayer(modisImage2, visParams, 'MODIS True Color win');









/*
*/














// Export.image.toDrive({
//   image:s2Image1.select("B2","B3","B4","B5","B6","B7","B8","B8A","B11","B12").clip(geometry2), //分类结果
//   description:'sen2_sum2', //文件名
//   scale:10, //分辨率
//   region: geometry2,
//   crs:"EPSG:32649",
//   maxPixels:1e13 //此处值设置大一些，防止溢出
// });


// Export.image.toDrive({
//   image:s2Image2.select("B2","B3","B4","B5","B6","B7","B8","B8A","B11","B12").clip(geometry2), //分类结果
//   description:'sen2_win2', //文件名
//   scale:10, //分辨率
//   region: geometry2,
//   crs:"EPSG:32649",
//   maxPixels:1e13 //此处值设置大一些，防止溢出
// });




// Export.image.toDrive({
//   image:landsatImage1.select("SR_B1","SR_B2","SR_B3","SR_B4","SR_B5","SR_B6","SR_B7").clip(geometry2), //分类结果
//   description:'lan8_sum2', //文件名
//   scale:30, //分辨率
//   region: geometry2,
//   crs:"EPSG:32649",
//   maxPixels:1e13 //此处值设置大一些，防止溢出
// });

// Export.image.toDrive({
//   image:landsatImage2.select("SR_B1","SR_B2","SR_B3","SR_B4","SR_B5","SR_B6","SR_B7").clip(geometry2), //分类结果
//   description:'lan8_win2', //文件名
//   scale:30, //分辨率
//   region: geometry2,
//   crs:"EPSG:32649",
//   maxPixels:1e13 //此处值设置大一些，防止溢出
// });




Export.image.toDrive({
  image:modisImage1.select("sur_refl_b02","sur_refl_b03","sur_refl_b04","sur_refl_b01","sur_refl_b05","sur_refl_b06","sur_refl_b07").clip(geometry2), //分类结果
  description:'MOD_sum3', //文件名
  scale:500, //分辨率
  region: geometry2,
  crs:"EPSG:32649",
  maxPixels:1e13 //此处值设置大一些，防止溢出
});

Export.image.toDrive({
  image:modisImage2.select("sur_refl_b02","sur_refl_b03","sur_refl_b04","sur_refl_b01","sur_refl_b05","sur_refl_b06","sur_refl_b07").clip(geometry2), //分类结果
  description:'MOD_win3', //文件名
  scale:500, //分辨率
  region: geometry2,
  crs:"EPSG:32649",
  maxPixels:1e13 //此处值设置大一些，防止溢出
});