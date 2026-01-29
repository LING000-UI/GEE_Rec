

/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var Sen = ee.ImageCollection("COPERNICUS/S2_SR"),
    nj = 
    /* color: #98ff00 */
    /* shown: false */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[118.2444902655106, 32.62551807230179],
          [118.2444902655106, 31.147028012001684],
          [119.49418508972936, 31.147028012001684],
          [119.49418508972936, 32.62551807230179]]], null, false),
    njp = ee.FeatureCollection("projects/ee-glj320104/assets/GPP_ROI/nj");
/***** End of imports. If edited, may not auto-convert in the playground. *****/
njp = njp.geometry();


// 8月分的影像
var img8 = ee.ImageCollection(Sen)
    .filterBounds(njp)
    .filterDate('2022-08-01','2022-09-01')
    .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE',15))
    .sort('CLOUDY_PIXEL_PERCENTAGE')
    .mosaic()
    .clip(njp);

// print(img8);
// img8 = img8.mosaic().clip(njp);


// 12月份的影像
var img12 = ee.ImageCollection(Sen)
    .filterBounds(njp)
    .filterDate('2022-12-01','2023-01-01')
    .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE',15))
    .sort('CLOUDY_PIXEL_PERCENTAGE')
    .mosaic()
    .clip(njp);

// 顺序月份图像
var imgn = ee.ImageCollection(Sen)
    .filterBounds(njp)
    .filterDate('2022-05-25','2022-05-30')
    // .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE',50))
    // .sort('CLOUDY_PIXEL_PERCENTAGE')
    .mosaic()
    .clip(njp);



// 加载真彩色影像

img8 = img8
    .select('B4','B3','B2','B8','B11')
    .rename('red','green','blue','nir','swir');


img12 = img12
    .select('B4','B3','B2','B8','B11')
    .rename('red','green','blue','nir','swir');

imgn = imgn
    .select('B4','B3','B2','B8','B11')
    .rename('red','green','blue','nir','swir');

Map.centerObject(njp,9);

Map.addLayer(imgn,{bands:['red','green','blue']},'imgn');
Map.addLayer(img8,{bands:['red','green','blue']},"img8_true", 0);
Map.addLayer(img12,{bands:['red','green','blue']},"img12_true", 0);


// 计算8/12月份NDVI,同时为结果值重命名
var ndvi8 = img8
    .normalizedDifference(['nir','red']).rename('ndvi8');

var ndvi12 = img12
    .normalizedDifference(['nir','red']).rename('ndvi12');

var ndvin = imgn
    .normalizedDifference(['nir','red']).rename('ndvin');

// ????建筑和非建筑的分类????


// 显示NDVI和真彩色
var pal = ['1666ff','7296ff','72ffa5','fffb4f','ffb453','ff0e00'];  // 蓝到红



Map.addLayer(ndvi8, {palette:pal}, "ndvi8", 0);
Map.addLayer(ndvi12, {palette:pal}, "ndvi12", 0);


// 植被类型分类
// 创建一个值为1的起始图像（阈值上限）
var type = ee.Image(0).clip(njp);

// C1值为ndvi8
// C2值为内层计算公式
var C2 = (ndvi8.subtract(ndvi12)).divide(ndvi8);

// 根据8/12月份的NDVI数据进行植被分类,都按照C2来计算

var type = type.where(ndvi8.lt(0.2),1);
type = type.where(ndvi8.gte(0.2).and(ndvi8.lte(0.5)),2);
type = type.where(ndvi8.gte(0.5).and(ndvi8.lte(1))
    .and(C2.gt(0.35)),3);
type = type.where(ndvi8.gte(0.5).and(ndvi8.lte(1))
    .and(C2.gt(0.2).and(C2.lt(0.35))),4);
type = type.where(ndvi8.gte(0.5).and(ndvi8.lte(1))
    .and(C2.lt(0.2)),5);

// 加载植被分类图像
Map.addLayer(type,{palette:pal},'type',0);


// 精度验证,验证植被类型


// 计算NIRV,同时为结果值重命名,可以直接重命名
var nirv = ndvin
    .multiply(imgn.select('nir'))
    .multiply(0.0001)
    .rename('nirv');


// 加载NIRV数据
Map.addLayer(nirv,{palette:pal},'NIRV',0);

// 计算GPP
var gpp = ee.Image(1).clip(njp);

gpp = gpp.where(type.eq(1).or(type.eq(0)),0);
gpp = gpp.where(type.eq(2),nirv.multiply(68.13).subtract(1.62));
gpp = gpp.where(type.eq(3),nirv.multiply(64.07).subtract(2.20));
gpp = gpp.where(type.eq(4),nirv.multiply(59.49).subtract(2.93));
gpp = gpp.where(type.eq(5),nirv.multiply(44.50).subtract(2.60));

// njp = njp.geometry();
// gpp = gpp.clip(njp);
Map.addLayer(gpp,{palette:pal},'gpp',0);

// mndwi的计算
// var waterpalette = ['green','white','blue']
// var mndwi = img8.normalizedDifference(['green','swir']);
// Map.addLayer(mndwi,{palette:waterpalette,min:-0.5,
//   max:1,},'mndwi');

// Export.image.toDrive({
// image:gpp, //分类结果
// description:'sen_gpp12', //文件名
// //folder: //云盘中的文件夹
// scale: 10, //分辨率
// //region: roi, //区域
// maxPixels:34e10 //此处值设置大一些，防止溢出
// });

// Export.image.toDrive({
// image:nirv, //分类结果
// description:'sen_nirv12', //文件名
// //folder: //云盘中的文件夹
// scale: 10, //分辨率
// //region: roi, //区域
// maxPixels:34e10 //此处值设置大一些，防止溢出
// });

// 计算每个像元值总和，以GPP为列

// 使用.reduceRegion()计算像元点的数值总和
var sumgpp1 = gpp.reduceRegion({
  reducer: ee.Reducer.sum(),
  geometry: njp,
  scale: 10,             
  bestEffort: true,      
  maxPixels:1e10,        
  tileScale:1.5          
});

print(sumgpp1);

var sumgpp2 = gpp.reduceRegion({
  reducer: ee.Reducer.sum(),
  geometry: njp,
  scale: 10,             
  bestEffort: true,      
  maxPixels:1e10,        
  tileScale:2          
});

print(sumgpp2);

var sumgpp3 = gpp.reduceRegion({
  reducer: ee.Reducer.sum(),
  geometry: njp,
  scale: 10,             
  bestEffort: true,      
  maxPixels:1e10,        
  tileScale:2.5          
});

print(sumgpp3);

var sumgpp4 = gpp.reduceRegion({
  reducer: ee.Reducer.sum(),
  geometry: njp,
  scale: 10,             
  bestEffort: true,      
  maxPixels:1e10,        
  tileScale:3          
});

print(sumgpp4);





































// 打印结果,将字典转换成数值
// var value = sumgpp.get('constant');

// print(value);
// print(typeof value);

// var value2 = ee.Number(value);

// print(value2);
// print(typeof value2);

// var num1 = value2.multiply(30).divide(10000000000);
// print(num1);

// var value3 = ee.Number.parse(value);

// print(value3);
// print(typeof value3);

// var num2 = value3.multiply(30).divide(10000000000);
// print(num2);


// print(value.multiply(30).divide(10000000000));