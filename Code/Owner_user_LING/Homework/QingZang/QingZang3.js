/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var table = ee.FeatureCollection("projects/ee-glj320104/assets/Home_work/Qingzanggy");
/***** End of imports. If edited, may not auto-convert in the playground. *****/
// 初始化 Earth Engine 和导入 MODIS MOD11A1 数据集
var modis = ee.ImageCollection('MODIS/006/MOD11A1');

// 设置时间范围和空间范围（青藏高原）
var startDate = ee.Date('2018-07-01');
var endDate = ee.Date('2018-08-31');
var qingzang = table;

// 筛选指定时间段和地理范围内的数据
var filtered = modis.filterDate(startDate, endDate).filterBounds(qingzang);

// 插值函数，用于在缺少数据的情况下使用前后图像进行插值
function interpolate(image) {
  var date = image.date();
  var prevImage = filtered.filterDate(date.advance(-1, 'day'), date).mean();
  var nextImage = filtered.filterDate(date, date.advance(1, 'day')).mean();
  
  // 使用 ee.ImageCollection 来创建集合并取平均
  var imageCollection = ee.ImageCollection([prevImage, nextImage]);
  return imageCollection.mean().set('system:time_start', date.millis());
}

// 计算每日平均温度
var dailyTemps = filtered.map(function(image) {
  var date = image.date();
  var dayTemp = image.select('LST_Day_1km');
  var nightTemp = image.select('LST_Night_1km');

  // 如果某天的数据缺失，使用插值
  dayTemp = ee.Algorithms.If(dayTemp.bandNames().length(), dayTemp, interpolate(image).select('LST_Day_1km'));
  nightTemp = ee.Algorithms.If(nightTemp.bandNames().length(), nightTemp, interpolate(image).select('LST_Night_1km'));

  var avgTemp = ee.Image(dayTemp).add(ee.Image(nightTemp)).divide(2).rename('Average_Temp');
  return avgTemp.set('system:time_start', date.millis());
});

// 选择特定日期并检查是否有数据
var exampleDay = dailyTemps.filterDate('2018-07-01', '2018-07-02').first();

// 可视化参数
var visParams = {
  min: 13000,
  max: 16500,
  palette: ['blue', 'green', 'red']
};

// 确保 exampleDay 是有效的图像对象
var validExampleDay = ee.Image(exampleDay);

Map.addLayer(qingzang);

// 在地图上显示
Map.addLayer(validExampleDay.clip(qingzang), visParams, 'Average Temp');
Map.setCenter(90, 35, 5);
