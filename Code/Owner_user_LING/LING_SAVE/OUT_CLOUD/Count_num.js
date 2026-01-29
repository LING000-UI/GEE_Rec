
/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var nj = ee.FeatureCollection("projects/ee-glj320104/assets/GPP_ROI/nj"),
    Sen = ee.ImageCollection("COPERNICUS/S2_SR");
/***** End of imports. If edited, may not auto-convert in the playground. *****/
var geometry = nj

// 8月分的影像
var img1 = ee.ImageCollection(Sen)
    .filterBounds(nj)
    .filterDate('2022-01-01','2022-02-01')
    .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE',15))
    .sort('CLOUDY_PIXEL_PERCENTAGE')
    .mosaic()
    .clip(nj);
    
var img2 = ee.ImageCollection(Sen)
    .filterBounds(nj)
    .filterDate('2022-05-01','2022-06-01')
    .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE',15))
    .sort('CLOUDY_PIXEL_PERCENTAGE')
    .mosaic()
    .clip(nj);


var img3 = ee.ImageCollection(Sen)
    .filterBounds(nj)
    .filterDate('2022-06-01','2022-07-01')
    .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE',500))
    .sort('CLOUDY_PIXEL_PERCENTAGE')
    .mosaic()
    .clip(nj);


Map.addLayer(img1,{},'img1');
Map.addLayer(img2,{},'img2');
Map.addLayer(img3,{},'img3');

// //面积比例
// // Map.addLayer(ee.Image(1).updateMask(l8_image.select(0).mask()),"","掩膜")
// var allArea = ee.Image.pixelArea().reduceRegion({
//     reducer: ee.Reducer.sum(),
//     geometry: geometry,
//     scale: 10,
//     maxPixels: 10e15,
// }).get("area");
// print("allArea m2", allArea)


// var mask = ee.Image.pixelArea().updateMask(img1.neq(NaN));

// Map.addLayer(mask,{},'mask');

// var realArea = ee.Image.pixelArea().updateMask(img1.neq(NaN)).reduceRegion({
//     reducer: ee.Reducer.sum(),
//     geometry: geometry,
//     scale: 10,
//     maxPixels: 10e15,
// }).get("area");
// print("realArea m2", realArea)
// // print("面积比例", ee.Number(realArea).divide(allArea))




//--------------------------------------------------------------------------------------------------

// 使用 reduceRegion() 函数统计像元个数
var count = img1.select('B2').reduceRegion({
  reducer: ee.Reducer.count(),
  geometry: nj,
  scale: 10,  // 分辨率（米/像素）
  bestEffort: true,      // 如果多边形在给定比例下包含太多像素，则计算并使用更大的比例，这将使操作成功。
  maxPixels:34e10,        // 此处值设置大一些，防止reducer没法计算所有像元
  tileScale:2           // 缩放系数
});

// 打印结果
print('像元个数img1:', count);


// 使用 reduceRegion() 函数统计像元个数
var count = img2.select('B2').reduceRegion({
  reducer: ee.Reducer.count(),
  geometry: nj,
  scale: 10,  // 分辨率（米/像素）
  bestEffort: true,      // 如果多边形在给定比例下包含太多像素，则计算并使用更大的比例，这将使操作成功。
  maxPixels:34e10,        // 此处值设置大一些，防止reducer没法计算所有像元
  tileScale:2           // 缩放系数
}).get('B2');

print(typeof(ee.Number(count)));

// 打印结果
print('像元个数img2:', count);

// 使用 reduceRegion() 函数统计像元个数
var count = img3.select('B2').reduceRegion({
  reducer: ee.Reducer.count(),
  geometry: nj,
  scale: 10,  // 分辨率（米/像素）
  bestEffort: true,      // 如果多边形在给定比例下包含太多像素，则计算并使用更大的比例，这将使操作成功。
  maxPixels:34e10,        // 此处值设置大一些，防止reducer没法计算所有像元
  tileScale:2           // 缩放系数
});

// 打印结果
print('像元个数img3:', count);