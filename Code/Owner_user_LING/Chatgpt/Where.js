// 创建一个经纬度点
var lon = 40.299, lat = 96.163; // 经纬度坐标
var point = ee.Geometry.Point(lat, lon);

print(point);

var BNUcoll = ee.ImageCollection('COPERNICUS/S2_SR')
  .filterBounds(point)
  .filterDate('2022-10-01', '2022-10-31')
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE',12))
  .sort('CLOUDY_PIXEL_PERCENTAGE')
  .first();

print(BNUcoll);

Map.addLayer(BNUcoll,{bands:['B4','B3','B2']},'ineed',0);

Export.image.toDrive({
  image:BNUcoll.select('B2'), //分类结果
  description:'part_Sen_B2', //文件名
  //folder: //云盘中的文件夹
  scale: 10, //分辨率
  //region: roi, //区域
  maxPixels:1e13 //此处值设置大一些，防止溢出
});