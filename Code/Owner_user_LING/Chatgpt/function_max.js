/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var nj = ee.FeatureCollection("projects/ee-glj320104/assets/nj");
/***** End of imports. If edited, may not auto-convert in the playground. *****/
// -------------------------------------------------------计算2022年所有影像的NDVI---------------------------------------------------------------

// 定义感兴趣区域
var areaOfInterest = nj; // 根据您的需求替换为适当的几何图形或边界

// 加载Sentinel-2影像集并筛选时间范围（2022年全年）
var imageCollection = ee.ImageCollection('COPERNICUS/S2_SR')
  .filterBounds(areaOfInterest)
  .filterDate('2022-01-01', '2022-12-31');

// 打印结果到控制台查看原始影像集
print('原始影像集',imageCollection);

// 计算函数：定义计算NDVI的函数
function calculateNIRv(image) {
  var nirv = image.normalizedDifference(['B8', 'B4']).multiply('B8').rename('NIRv');
  return image.addBands(nirv);
}

// 将计算NDVI函数应用于影像集中的所有影像
var nirvCollection = imageCollection.map(calculateNIRv);

// 打印结果到控制台查看NDVI影像集
print('NDVI影像集', nirvCollection);

print(typeof nirvCollection);

// --------------------------------------------将ndviCollection中的影像按照日期放入每个月的影像集中--------------------------------------------
// 直接在循环中处理,处理Image

for(var i=2022;i<=2022;i++){
  
  for(var j=1;j<=12;j++){
    
    var data_collection = ndviCollection                    // 将各个年份和月份的影像放到暂时的影像集中
    .filter(ee.Filter.calendarRange(i, i, 'year'))    // 这连两个过滤器可以互换位置
    .filter(ee.Filter.calendarRange(j,  j,'month'))
    .map(function(img)  // 此方法给影像增加了一个year的字段
    {
      return img.set('year', img.date().get('year'),'month',img.date().get('month'));
    }
    )
    
    var ndvi = data_collection.mosaic();
    var max_ndvi = data_collection.max();
    var quick_ndvi = data_collection.qualityMosaic('NIRv');
  }
}

// ------------------------------------------------------------测试最大合成之后的NDVI总和-----------------------------------------------------------------------------------
var pal = ['blue','green','yellow','red'];
