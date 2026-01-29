// 定义南京地区的范围
var nanjing = ee.Geometry.Rectangle([118.4, 31.5, 119.2, 32.5]);

// 设置日期范围
var startDate = '2022-10-13';
var endDate = '2022-10-30';

// 加载Landsat 8实时数据集
var landsatCollection = ee.ImageCollection('LANDSAT/LC08/C02/T1_RT')
  .filterBounds(nanjing)
  .filterDate(startDate, endDate);

// 函数：为每天生成一个特征，包含影像数量
function countImagesPerDay(day) {
  var specificDay = ee.Date(day);
  var nextDay = specificDay.advance(1, 'day');
  
  var filteredDay = landsatCollection.filterDate(specificDay, nextDay);
  var count = filteredDay.size();
  
  return ee.Feature(null, {'date': specificDay.format('YYYY-MM-dd'), 'image_count': count});
}

// 生成日期序列
var numDays = ee.Date(endDate).difference(ee.Date(startDate), 'day').getInfo();
var daysList = ee.List.sequence(0, numDays).map(function(dayOffset) {
  return ee.Date(startDate).advance(dayOffset, 'day');
});

// 映射日期序列以创建数据集
var dailyCounts = ee.FeatureCollection(daysList.map(countImagesPerDay));

// 创建图表
var chart = ui.Chart.feature.byFeature(dailyCounts, 'date', 'image_count')
  .setOptions({
    title: '南京地区Landsat 8实时数据集可用性（2022年10月13日至10月30日）',
    vAxis: {title: '影像数量'},
    hAxis: {title: '日期', format: 'yy-MM-dd', slantedText: true, slantedTextAngle: 45},
    lineWidth: 2,
    pointSize: 4,
    series: {0: {color: 'blue'}}
  });

// 打印图表
print(chart);
