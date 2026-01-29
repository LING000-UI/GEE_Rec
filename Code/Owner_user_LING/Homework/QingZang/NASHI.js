// 创建一个要素集，包含多个点
var points = ee.FeatureCollection([
  ee.Feature(ee.Geometry.Point([-45.11, 69.11]), {name: 'Point1'}),
  ee.Feature(ee.Geometry.Point([-42.26, 69.36]), {name: 'Point2'}),
  ee.Feature(ee.Geometry.Point([-39, 70]), {name: 'Point3'}),
  ee.Feature(ee.Geometry.Point([-42, 70.9]), {name: 'Point4'}),
  ee.Feature(ee.Geometry.Point([-45, 71.7]), {name: 'Point5'}),
  ee.Feature(ee.Geometry.Point([-48.78, 71.56]), {name: 'Point6'})
]);

// 定义一个函数，为每个点创建方形缓冲区
function createSquareBuffer(feature) {
  // 以每个点为中心，创建10000米的缓冲区
  var bufferDistance = 10000; // 缓冲区边长的一半，即半径
  return feature.buffer(bufferDistance).bounds(); // 创建缓冲区并获取外接矩形
}

// 使用map函数应用createSquareBuffer到要素集中的每个要素
var squareBuffers = points.map(createSquareBuffer);

// 将方形缓冲区添加到地图上
Map.addLayer(squareBuffers, {color: 'blue'}, 'Square Buffers');
// 将地图中心设置到要素集
Map.centerObject(squareBuffers);



// 假设你已经有了上文提到的 squareBuffers 要素集

// 加载ArcticDEM图像集
var arcticDEM = ee.ImageCollection('UMN/PGC/ArcticDEM/V3/2m').select('elevation');

// 加载哨兵2号影像集
var sentinel2 = ee.ImageCollection('COPERNICUS/S2')
                  .filterBounds(squareBuffers)
                  .filterDate('2024-05-01', '2024-05-31')
                  .select(['B4', 'B3', 'B2']);



var dem = arcticDEM.first().clip(squareBuffers);
var sen = sentinel2.first().clip(squareBuffers);



var elevationVis = {
  min: -50.0,
  max: 1000.0,
  palette: ['0d13d8', '60e1ff', 'ffffff'],
};


Map.addLayer(dem, elevationVis, 'Elevation');
Map.addLayer(sen,{min:0,max:3000,bands:["B4","B3","B2"]},"sen");
