// 加载一个点集（这里使用示例点，实际应用时应替换为你的矢量点数据集）
var points = ee.FeatureCollection([
  ee.Feature(ee.Geometry.Point([102.5, 0.5]), {label: 'Point 1'}),
  ee.Feature(ee.Geometry.Point([102.7, 0.5]), {label: 'Point 2'})
]);

// 加载一个影像数据集，例如MODIS地表温度
var dataset = ee.ImageCollection('MODIS/006/MOD11A1')
                  .filter(ee.Filter.date('2018-01-01', '2018-01-10'))
                  .select('LST_Day_1km')  // 选择地表温度波段
                  .mean();  // 求时间范围内的平均

// 将影像的值提取到点位置
var temperatures = dataset.sampleRegions({
  collection: points,
  properties: ['label'],  // 确保输出包含每个点的标识
  scale: 1000  // 与数据集的空间分辨率匹配
});

// 打印结果
print('Temperature at points:', temperatures);

// 可视化结果（可选）
Map.centerObject(points, 4);
Map.addLayer(dataset, {min: 13000, max: 16500, palette: ['blue', 'green', 'red']}, 'LST');
Map.addLayer(points, {color: 'yellow'}, 'Points');
