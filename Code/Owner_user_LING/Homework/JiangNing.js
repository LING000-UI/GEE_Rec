/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var table = ee.FeatureCollection("projects/ee-glj320104/assets/GPP_ROI/nj");
/***** End of imports. If edited, may not auto-convert in the playground. *****/
var roi = table;
Map.centerObject(roi,9);
var imgc = ee.ImageCollection('COPERNICUS/S2_SR')
                        .filterBounds(roi)
                        .filterDate('2022-10-01', '2022-11-01')
                        .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE',1));
                        
var img = imgc.mosaic().clip(roi).select("B4","B3","B2");
Map.addLayer(img,{min:0,max:6000,bands:["B4","B3","B2"]},"imgc_true");

Export.image.toDrive({
  image:img, //分类结果
  description:'nj_rgb', //文件名
  scale:10, //分辨率
  region:roi, //区域
  maxPixels:1e13 //此处值设置大一些，防止溢出
});