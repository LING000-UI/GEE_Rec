var SenC = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED");

// 左下、右上
var roi = ee.Geometry.Rectangle([92.909923, 38.100690, 98.440925, 42.320587], 'EPSG:4326', false);

Map.centerObject(roi,7);

var BNU_C = SenC.filterDate("2022-10-13","2022-10-31")
              .filterBounds(roi)
              .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE',5));
              
              

// var function



print(BNU_C);

var BNU_CM = BNU_C.mosaic();
Map.addLayer(BNU_CM,{min:0,max:3000,bands:["B4","B3","B2"]},"Mosaic",0);

var BNU_CM_C = BNU_CM.clip(roi);
Map.addLayer(BNU_CM_C,{min:0,max:3000,bands:["B4","B3","B2"]},"Clip");

Map.addLayer(roi,{},"26",0);




Export.image.toDrive({
  image:BNU_CM_C.select("B3"),  //分类结果
  description:"Sen_test",       //文件名
  folder: 'BNU_1',
  crs: 'EPSG:32649',
  scale:80,                     //分辨率
  region:roi,                   //区域
  maxPixels:1e13                //此处值设置大一些，防止溢出
});




