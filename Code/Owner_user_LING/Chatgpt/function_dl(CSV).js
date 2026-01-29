// // 定义一个函数，用于获取每个图像的属性数据并导出为表格
// function exportImageProperties(image) {
//   // 获取当前图像的属性数据
//   var properties = image.toDictionary();
  
//   // 将属性数据转换为 feature
//   var feature = ee.Feature(null, properties);
  
//   // 将 feature 添加到 feature 集合中
//   var featureCollection = ee.FeatureCollection([feature]);
  
//   // 将 feature 集合导出为表格
//   Export.table.toDrive({
//     collection: featureCollection,
//     description: 'image_properties',
//     fileFormat: 'CSV'
//   });
  
//   return null;
// }

// // 加载 Landsat 8 影像集
// var collection = ee.ImageCollection('LANDSAT/LC08/C01/T1_TOA')
//   .filterBounds(ee.Geometry.Point(-122.2627, 37.8735))
//   .filterDate('2019-01-01', '2019-12-31');

// // 对影像集中的每一幅影像应用 exportImageProperties() 函数
// collection.map(exportImageProperties);




var collection = ee.ImageCollection('LANDSAT/LT05/C01/T1')
    .filterBounds(ee.Geometry.Point([-123, 43]));

print(collection);

var terribleAggregations = collection.map(function(image) {
  return image.set(image.reduceRegion({
    reducer: 'mean',
    geometry: image.geometry(),
    scale: 30,
    maxPixels: 1e9
  }));
});
 
// Error: Quota exceeded: 并发聚合过多。
// print(terribleAggregations);

Export.table.toDrive({
  collection: terribleAggregations,
  description: 'terribleAggregations',
  fileFormat: 'CSV'
});









