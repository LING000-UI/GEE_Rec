/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var Sen = ee.ImageCollection("COPERNICUS/S2_SR"),
    Nantong = /* color: #d63000 */ee.Geometry.Point([121.40299295474097, 32.17369834680728]),
    roi = ee.FeatureCollection("projects/ee-glj320104/assets/CITY/NanTong");
/***** End of imports. If edited, may not auto-convert in the playground. *****/
var imageCollection = Sen
                      .filterBounds(Nantong)
                      .filterDate('2022-12-01', '2022-12-31')
                      .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE',10));
                      
var img = imageCollection.mosaic().select("B4","B3","B2","B8").clip(roi);
print(img);

Map.centerObject(Nantong,9);
Map.addLayer(img,{bands:["B4","B3","B2"],min:0,max:6000},"img");


Export.image.toDrive({
  image:img, //分类结果
  description:'Nantong_12', //文件名
  scale:10, //分辨率
  region:roi,
  maxPixels:1e13 //此处值设置大一些，防止溢出
});