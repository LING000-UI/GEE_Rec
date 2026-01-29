// 作者：知乎用户Austin (https://www.zhihu.com/people/zpzuo)
// 单位：波士顿大学
// 代码最后修改时间：2021年5月29日
// 开放一切学术交流使用，转载请注明出处
//
// 本代码是使用内置函数 .sample() 和 .reduceToImage() 在一个小块
// 示范区域内进行图像和点要素集之间无损、无偏转换的样例。数据存储
// 为点要素集的阶段进行了一次数值筛选操作，用以示范GEE逐像元处理
// 的技术路线。

// 加载感兴趣区域roi和数字高程数据
// 一块100余个像点的小区域
var roi = ee.Geometry.Polygon(
        [[[-71.65781521358379, 42.881740327133244],
          [-71.65591084518321, 42.87907123590606],
          [-71.65169977702983, 42.88032128122396],
          [-71.65436589279064, 42.88199189973334]]]);
// SRTM数字高程（DEM）数据
var image = ee.Image("USGS/SRTMGL1_003"); // 波段名为 elevation

// 利用 .sample() 和 .map() 实现栅格转点阵并且传递像元值
var points = image.addBands(ee.Image.pixelLonLat()) // 为图像加入像元经纬度两个层
  // 用 .sample() 将 ee.Image 转为 ee.FeatureCollection
  .sample({ 
    region: roi, // 以roi为采样区，不设置其它参数则采样全部像元
    geometries: true // 使生成的点阵中的每个点都置于像元中心
  }) 
  // 用 .map() 对要素集中所有的要素逐个处理
  .map(function(sample){
    var lat = sample.get('latitude'); 
    var lon = sample.get('longitude');
    var value = sample.get('elevation'); 
    // 硬定义返回的要素为矢量点，点的位置由经纬度创建，数据为上一行的value
    return ee.Feature(ee.Geometry.Point([lon, lat]), {value: value}); 
  }); 
  
// 对点阵中的每个点逐个进行数值筛选操作
// 用 .map() 对要素集中所有的要素逐个处理
var ptsComputed = points.map(function(point){
  // 获取点要素存储的原数据
  var attribute = ee.Number(point.get('value')); 
  // 数据小于等于120则重置为0
  var computedAttribute = ee.Algorithms.If(attribute.lte(120), 0, attribute); 
  // 修改点要素的数据并返回
  return point.set('value', computedAttribute); 
}); 

// 将滤波后的点阵重新转为图像，使用 .reduceToImage() 实现要素转栅格
var image2 = ptsComputed.reduceToImage({
  properties: ['value'],
  reducer: ee.Reducer.mean() // 这里随意选择一个reducer，因为不存在要素重叠所以没有区别
})
// 图像重采样，若无这一步图像将缺失投影而无法显示
.reproject(image.projection().crs(), image.projection().getInfo().transform )
// 重命名波段
.rename('computedAttribute');

// 可视化参数
var band_viz = {
  min: 90,
  max: 125,
  palette: ['0D0887', '5B02A3', '9A179B', 'CB4678',
            'EB7852', 'FBB32F', 'F0F921']};
// 在地图上显示原始图像（默认不显示）、重建后的图像、点阵
Map.setCenter(-71.6549892443107, 42.880835837605815, 17);
Map.addLayer(image, band_viz, 'DEM1', false);
Map.addLayer(image2, band_viz, 'DEM2');
Map.addLayer(points, {}, 'Samples');