/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var table = ee.FeatureCollection("projects/ee-glj320104/assets/GPP_ROI/nj");
/***** End of imports. If edited, may not auto-convert in the playground. *****/
// 定义感兴趣区
var geometry = table;  // 选择中国某地区

// 定义时间范围
var startDate = ee.Date('2022-10-01');
var endDate = ee.Date('2022-11-01');

// 加载影像集合
var landsat8 = ee.ImageCollection("LANDSAT/LC08/C02/T1")
                 .filterBounds(geometry)
                 .filterDate(startDate, endDate);

var landsat9 = ee.ImageCollection("LANDSAT/LC09/C02/T1")
                 .filterBounds(geometry)
                 .filterDate(startDate, endDate);

var sentinel2 = ee.ImageCollection("COPERNICUS/S2_HARMONIZED")
                 .filterBounds(geometry)
                 .filterDate(startDate, endDate);

var mod09gq = ee.ImageCollection("MODIS/006/MOD09GQ")
                 .filterBounds(geometry)
                 .filterDate(startDate, endDate);

var myd09gq = ee.ImageCollection("MODIS/006/MYD09GQ")
                 .filterBounds(geometry)
                 .filterDate(startDate, endDate);

// 计算开始日期和结束日期之间的天数差
var diffDays = endDate.difference(startDate, 'day');

// 创建日期列表
var daysList = ee.List.sequence(0, diffDays.subtract(1)).map(function(dayOffset) {
  var date = startDate.advance(dayOffset, 'day');
  var landsat8Count = landsat8.filterDate(date, date.advance(1, 'day')).size();
  var landsat9Count = landsat9.filterDate(date, date.advance(1, 'day')).size();
  var sentinel2Count = sentinel2.filterDate(date, date.advance(1, 'day')).size();
  var mod09gqCount = mod09gq.filterDate(date, date.advance(1, 'day')).size();
  var myd09gqCount = myd09gq.filterDate(date, date.advance(1, 'day')).size();
  return ee.Feature(null, {
    'date': date.format('YYYY-MM-dd'),
    'Landsat 8': landsat8Count,
    'Landsat 9': landsat9Count,
    'Sentinel-2': sentinel2Count,
    'MOD09GQ': mod09gqCount,
    'MYD09GQ': myd09gqCount
  });
});

// 将日期列表转换为特征集合
var featureCollection = ee.FeatureCollection(daysList);

// 动态生成图表标题
var title = startDate.format('YYYY年MM月').getInfo() + "到" + endDate.format('YYYY年MM月').getInfo() + "某地区影像可用性";

// 创建柱状图
var chart = ui.Chart.feature.byFeature(featureCollection, 'date')
.setSeriesNames(['Landsat 8', 'Landsat 9', 'Sentinel-2', 'MOD09GQ', 'MYD09GQ'])
.setChartType('BarChart')
.setOptions({
  title: title,
  hAxis: {
    title: '影像数量',
    titleTextStyle: {italic: false, bold: true},
    gridlines: {color: '#e9e9e9'},
    minorGridlines: {count: 0},
    viewWindow: {
      min: 0,
      max: 6  // 调整最大值以压缩X轴
    }
  },
  vAxis: {
    title: '日期',
    titleTextStyle: {italic: false, bold: true},
    slantedText: true, 
    slantedTextAngle: 45,
    gridlines: {color: '#e9e9e9'}
  },
  legend: {position: 'top', textStyle: {fontSize: 12}},
  colors: ['#1f77b4', '#1f77b4', '#2ca02c', '#ff7f0e', '#ff7f0e'],  // 使用颜色代码统一Landsat和MODIS系列颜色
  series: {
    0: {color: '#1f77b4', lineWidth: 2},  // Landsat 8: 蓝色，线条加粗
    1: {color: '#1f77b4', lineWidth: 2},  // Landsat 9: 蓝色，线条加粗
    2: {color: '#2ca02c', lineWidth: 2},  // Sentinel-2: 绿色，线条加粗
    3: {color: '#ff7f0e', lineWidth: 2},  // MOD09GQ: 橙色，线条加粗
    4: {color: '#ff7f0e', lineWidth: 2}   // MYD09GQ: 橙色，线条加粗
  },
  bar: {groupWidth: '50%'},  // 调整组宽度以增加间隔
  chartArea: {width: '85%', height: '65%'}
});

// 打印图表
print(chart);
