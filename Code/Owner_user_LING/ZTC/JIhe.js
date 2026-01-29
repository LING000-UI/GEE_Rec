/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var table = ee.FeatureCollection("projects/ee-glj320104/assets/yuan");
/***** End of imports. If edited, may not auto-convert in the playground. *****/
// 初始化Google Earth Engine
var geo = table.geometry();

var sen2 = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
                // ee.ImageCollection("COPERNICUS/S1_GRD")
                .filterBounds(geo)
                .filterDate("2020-06-05", "2020-06-30")
                // .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE',25))
                // .sort('CLOUDY_PIXEL_PERCENTAGE')
                .select(['B4', 'B3', 'B2']);
                
            
            
var img = sen2.mosaic().clip(geo);


Map.addLayer(img,{min:0,max:6000,bands:['B4','B3','B2']},"aa");



Export.image.toDrive({
  image:img.select('B4','B3','B2'), //分类结果
  description:'jihejiaozheng_rgb', //文件名
  scale:100, //分辨率
  region:geo, //区域
  maxPixels:1e13 //此处值设置大一些，防止溢出
});

