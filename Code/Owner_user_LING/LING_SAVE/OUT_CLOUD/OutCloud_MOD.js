
/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var roi = ee.FeatureCollection("projects/ee-glj320104/assets/GPP_ROI/nj");
/***** End of imports. If edited, may not auto-convert in the playground. *****/
// var roi = ee.FeatureCollection("users/lilei655123/shanxi");
Map.centerObject(roi,7)
var styling = {color:"red",fillColor:"00000000"};
Map.addLayer(roi.style(styling),{},"geometry")
var img_normalize = function(img){ 
  var minMax = img.reduceRegion({ 
    reducer:ee.Reducer.minMax(), 
    geometry: roi, 
    scale: 30, 
    maxPixels: 10e13, 
    tileScale: 16 }) 
var year = img.get('year') 
var normalize = ee.ImageCollection.fromImages( 
  img.bandNames().map(function(name){ 
    name = ee.String(name); 
    var band = img.select(name); 
    return band.unitScale(ee.Number(minMax.get(name.cat('_min'))), ee.Number(minMax.get(name.cat('_max')))); }) 
        ).toBands().rename(img.bandNames()); 
        return normalize;
  
}
function maskL457sr(image) {//l57去云
  // Bit 0 - Fill
  // Bit 1 - Dilated Cloud
  // Bit 2 - Unused
  // Bit 3 - Cloud
  // Bit 4 - Cloud Shadow
  var qaMask = image.select('QA_PIXEL').bitwiseAnd(parseInt('11111', 2)).eq(0);
  var saturationMask = image.select('QA_RADSAT').eq(0);

  // Apply the scaling factors to the appropriate bands.
  var opticalBands = image.select('SR_B.').multiply(0.0000275).add(-0.2);
  var thermalBand = image.select('ST_B6').multiply(0.00341802).add(149.0);

  // Replace the original bands with the scaled ones and apply the masks.
  return image.addBands(opticalBands, null, true)
      .addBands(thermalBand, null, true)
      .updateMask(qaMask)
      .updateMask(saturationMask);
}
/*function maskL8sr(image) {
  // Bit 0 - Fill
  // Bit 1 - Dilated Cloud
  // Bit 2 - Cirrus
  // Bit 3 - Cloud
  // Bit 4 - Cloud Shadow
  var qaMask = image.select('QA_PIXEL').bitwiseAnd(parseInt('11111', 2)).eq(0);
  var saturationMask = image.select('QA_RADSAT').eq(0);

  // Apply the scaling factors to the appropriate bands.
  var opticalBands = image.select('SR_B.').multiply(0.0000275).add(-0.2);
  var thermalBands = image.select('ST_B.*').multiply(0.00341802).add(149.0);

  // Replace the original bands with the scaled ones and apply the masks.
  return image.addBands(opticalBands, null, true)
      .addBands(thermalBands, null, true)
      .updateMask(qaMask)
      .updateMask(saturationMask);
}*/
var imageCollection = ee.ImageCollection('LANDSAT/LT05/C02/T1_L2').filterBounds(roi);//1111111
var monthCount = ee.List.sequence(0, 11);



// 通过图像收集，生成每月NDVI中值图像
var composites = ee.ImageCollection.fromImages(monthCount.map(function(m) {
  var startMonth = 1; // 从1月开始
  var startYear = ee.Number(2000); // 1993-1
  
  var month = ee.Date.fromYMD(startYear, startMonth, 1).advance(m,'month').get('month');
  var year = ee.Date.fromYMD(startYear, startMonth, 1).advance(m,'month').get('year')
  
  // 按年筛选，然后按月筛选
  var filtered = imageCollection.filter(ee.Filter.calendarRange({
    start: year.subtract(1), // 过去两年的平均数
    end: year,
    field: 'year'
  })).filter(ee.Filter.calendarRange({
    start: month,
    field: 'month'
  }));
  // mask for clouds and then take the median///////////////
  var composite = filtered.map(maskL457sr).median().clip(roi);
  return composite.normalizedDifference(['SR_B4', 'SR_B3']).rename('NDVI')
      .set('month', ee.Date.fromYMD(startYear, startMonth, 1).advance(m,'month'))
      .set('system:time_start', ee.Date.fromYMD(startYear, startMonth, 1).advance(m,'month').millis());
}));
print(composites);
var stackCollection = function(collection) {
  // 创建一个初始图像.
  var first = ee.Image(collection.first()).select([]);

  // Write a function that appends a band to an image.
  var appendBands = function(image, previous) {
    return ee.Image(previous).addBands(image);
  };
  return ee.Image(collection.iterate(appendBands, first));
};
var compos = stackCollection(composites);
print('插值前', compos);


// 用上个月和下个月的平均值替换被遮挡的像素 
var replacedVals = composites.map(function(image){
  var currentDate = ee.Date(image.get('system:time_start'));
  var meanImage = composites.filterDate(
                currentDate.advance(-2,'month'), currentDate.advance(2, 'month')).mean();//33333333333333333333333max min median
  // 替换所有被屏蔽的值
  return meanImage.where(image, image);
});

// 将ImageCollection堆叠成一个多波段的光栅，以便下载
var stackCollection = function(collection) {
  // 创建一个初始图像.
  var first = ee.Image(collection.first()).select([]);

  // Write a function that appends a band to an image.
  var appendBands = function(image, previous) {
    return ee.Image(previous).addBands(image);
  };
  return ee.Image(collection.iterate(appendBands, first));
};
var stacked = stackCollection(replacedVals);
print('stacked image', stacked);
var Vis = {

  min: -1,

  max: 1.0,

  palette: [

    'FFFFFF', 'CE7E45', 'DF923D', 'F1B555', 'FCD163', '99B718', '74A901',

    '66A000', '529400', '3E8601', '207401', '056201', '004C00', '023B01',

    '012E01', '011D01', '011301'

  ],

};
Map.addLayer(compos.select(6), Vis, '插值前');
// .0-11  分别代表1-12个月
Map.addLayer(stacked.select(6), Vis, 'NDVI');//555555555

Export.image.toDrive({
  image: stacked.select(0),//选择导出影像的波段////0-11  分别代表1-12个月
  description: 'NDVI',//选择导出云盘的文件夹名称
  crs: "EPSG:4326",//坐标系
  scale: 30,//空间分辨率
  region: roi,//研究区
  maxPixels: 1e13,//最大像元个数
  folder: 'NDVI'
});






