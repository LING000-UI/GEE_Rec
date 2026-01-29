// 几何校正使用的是Sen L1C数据，然后以月为前后2月跨度进行筛选，且进行中值合成

/*
/////////////////////////////////////////////
// Funciton Set================================================================================================================================
/////////////////////////////////////////////
*/

// --------------------------------------random color--------------------------------------
// // 转换成列表随机加载
// var BNU_len = BNU.size();
// print("原始要素集的长度",BNU_len);
// var BNU_list = BNU.toList(BNU_len);
// print(BNU_list);

// // 随机生成颜色的函数
// function getRandomColor() {
//   var letters = '0123456789ABCDEF';
//   var color = '#';
//   for (var i = 0; i < 6; i++) {
//     color += letters[Math.floor(Math.random() * 16)];
//   }
//   return color;
// }

// // 随机加载颜色
// for (var i=0; i<BNU_list.length().getInfo();i++){
//   var index = ee.Feature(BNU_list.get(i));
//   var styleParams = {
//   color: getRandomColor(), // 随机生成颜色
//   width: 2,
//   fillColor: getRandomColor(),
//   fillOpacity: 0.5
//   };
//   Map.addLayer(index,styleParams,"Index_"+i);
// }
// -----------------------------------------random color-----------------------------------




// ---------------------------------------the part of outcloud------------------------------------------
// ******(function)use QA to outcloud
function OutCloudQA(image) { 
  var qa = image.select('QA60'); 
  var cloudBitMask = 1 << 10; 
  var cirrusBitMask = 1 << 11; 
  var mask = qa.bitwiseAnd(cloudBitMask).eq(0) 
              .and(qa.bitwiseAnd(cirrusBitMask).eq(0)); 
  return image.updateMask(mask); 
}

// ******(function)use NDSI to outcloud
var _cloudScore = function(img) { 
  var rescale = function(img, exp, thresholds) { 
    return img.expression(exp, {img: img}) 
        .subtract(thresholds[0]).divide(thresholds[1] - thresholds[0]); 
  }; 
  var score = ee.Image.constant(1.0); 
  score = score.min(rescale(img, 'img.blue', [0.1, 0.3])); 
  score = score.min(rescale(img, 'img.red + img.green + img.blue', [0.2, 0.8])); 
  score = score.min(rescale(img, 'img.nir + img.swir1 + img.swir2', [0.3, 0.8])); 
  var ndsi = img.normalizedDifference(['green', 'swir1']); 
  return score.min(rescale(ndsi, 'img', [0.8, 0.6])); 
}; 
// remove cloud by Score bands 
function rmCloudByScore(image, thread) { 
  var preBands = ["B2","B3","B4","B8","B11","B12"]; 
  var newBands = ['blue','green','red','nir','swir1','swir2']; 
  var score = _cloudScore(image.select(preBands, newBands)); 
  score = score.multiply(100).byte().rename('cloud'); 
  return image.addBands(score) 
              .updateMask(score.lte(thread)).multiply(10000); 
} 

// scale the image 
function scaleImage(image) { 
  var time_start = image.get("system:time_start");
  image = image.divide(10000); 
  image = image.set("system:time_start", time_start); 
  return image; 
}


function maskS2clouds(image) {
    var qa = image.select('QA10');
  
    // Bits 10 and 11 are clouds and cirrus, respectively.
    var cloudBitMask = ee.Number(2).pow(10).int();
    var cirrusBitMask = ee.Number(2).pow(11).int();
  
    // Both flags should be set to zero, indicating clear conditions.
    var mask = qa.bitwiseAnd(cloudBitMask).eq(0).and(
              qa.bitwiseAnd(cirrusBitMask).eq(0));
  
    // Return the masked and scaled data.
    // return image.updateMask(mask).divide(10000);
    return image.updateMask(mask);
  }



// ******(function)select
function sele_band(img){
  var img_sel = img.select("B2","B3","B4","B8","B11","B12","QA10");
  return img_sel;
}
// ----------------------------------------the part of outcloud------------------------------------------

/*
/////////////////////////////////////////////
// Funciton Set================================================================================================================================
/////////////////////////////////////////////
*/









/*
/////////////////////////////////////////////
// Funciton Main================================================================================================================================
/////////////////////////////////////////////
*/


// 设置云量阈值
// var cloud_th_1 = 10;
var cloud_th_2 = 55;
var cloud_th_3 = 10;
var per_thresholds = 45;
var MAX_CLOUD_PROBABILITY = 65;

var time_th = 45;

// dataset
var BNU = ee.FeatureCollection('projects/ee-glj320104/assets/BNU_1/2022-10');
var Sen = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED");



// Map.centerObject(BNU,5);
Map.addLayer(BNU,{},"BNU_Index",0);



var start_index = ee.Number.parse(BNU.reduceColumns(ee.Reducer.min(), ["BID"]).get("min"));
var end_index = ee.Number.parse(BNU.reduceColumns(ee.Reducer.max(), ["BID"]).get("max"));


print(start_index);
print(end_index);


// -------------------------------------------------云量集-------------------------------------------------
var s2Sr = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED");
var s2Clouds = ee.ImageCollection('COPERNICUS/S2_CLOUD_PROBABILITY');



// var region =
//     ee.Geometry.Rectangle({coords: [-76.5, 2.0, -74, 4.0], geodesic: false});
// Map.setCenter(-75, 3, 12);

function maskClouds(img) {
  var clouds = ee.Image(img.get('cloud_mask')).select('probability');
  var isNotCloud = clouds.lt(MAX_CLOUD_PROBABILITY);
  return img.updateMask(isNotCloud);
}

// The masks for the 10m bands sometimes do not exclude bad data at
// scene edges, so we apply masks from the 20m and 60m bands as well.
// Example asset that needs this operation:
// COPERNICUS/S2_CLOUD_PROBABILITY/20190301T000239_20190301T000238_T55GDP
function maskEdges(s2_img) {
  return s2_img.updateMask(
      s2_img.select('B8A').mask().updateMask(s2_img.select('B9').mask()));
}

// Filter input collections by desired data range and region.
/*var criteria = ee.Filter.and(
    ee.Filter.bounds(region), ee.Filter.date(START_DATE, END_DATE));
s2Sr = s2Sr.filter(criteria).map(maskEdges);
s2Clouds = s2Clouds.filter(criteria);*/



s2Sr = s2Sr.map(maskEdges);


// Join S2 SR with cloud probability dataset to add cloud mask.
var s2SrWithCloudMask = ee.Join.saveFirst('cloud_mask').apply({
  primary: s2Sr,
  secondary: s2Clouds,
  condition:
      ee.Filter.equals({leftField: 'system:index', rightField: 'system:index'})
});

var s2CloudMasked =
    ee.ImageCollection(s2SrWithCloudMask).map(maskClouds);



// -------------------------------------------------云量集-------------------------------------------------



















// 使用evaluate方法获取这些值
start_index.evaluate(function(start) {
  end_index.evaluate(function(end) {
    for (var i = 0; i <= 0; i++) {
      // 您的代码逻辑
      var fea = BNU.filter(ee.Filter.eq('BID', ee.Number(i).format())).first();
      // 这里继续您的代码
      // console.log(i); // 举例输出i的值
      // 缓冲区
      var geo = fea.geometry().buffer(10000);
      
      Map.addLayer(geo, {
        color: 'red', // 边界线颜色
        fillColor: 'red', // 填充颜色，如果需要填充的话
        fillOpacity: 0.5 // 填充透明度，如果需要填充的话
      },"Geo"+i,0);
      
      
      
      // 获取time属性并转换为日期格式（只保留日期部分）
      var timeString = fea.getString('time');
      var date = ee.Date(timeString.slice(0, 10));  // 仅保留'YYYY-MM-DD'部分
    
      // 设置时间范围，例如以日期为中心的前后一天
      var startDate = date.advance(-time_th, 'day');
      var endDate = date.advance(time_th, 'day');
      
      print('开始时间:',startDate,'结束时间:',endDate);
      
      
      
      
/*      // 作为第一顺位的云量掩膜影像（旧）
      var Sen_c1d = Sen.filterBounds(geo)
                      .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE',cloud_th_1))
                      .sort('CLOUDY_PIXEL_PERCENTAGE')
                      .map(maskS2clouds)
                      .map(sele_band);*/
                      
      
      
      // 作为第一顺位的云量掩膜影像
      var Sen_c1 = s2CloudMasked.filterBounds(geo)
                                .filterDate(startDate,endDate)
                                .map(sele_band);
                                
      
      
      //  作为第二顺位的云量掩膜影像
      var Sen_c2 = Sen.filterBounds(geo)
                      .filterDate(startDate,endDate)
                      .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE',cloud_th_2))
                      .sort('CLOUDY_PIXEL_PERCENTAGE')
                      .map(scaleImage)
                      .map(function(image) {return rmCloudByScore(image, per_thresholds);})
                      .map(sele_band);


      //  作为第三顺位的云量掩膜影像
      var Sen_c3 = Sen.filterBounds(geo)
                      .filterDate(startDate,endDate)
                      .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE',cloud_th_3))
                      .sort('CLOUDY_PIXEL_PERCENTAGE')
                      .map(sele_band);



      // 作为兜底的升序云量影像
      var Sen_c4 = Sen.filterBounds(geo)
                      .filterDate(startDate,endDate)
                      .sort('CLOUDY_PIXEL_PERCENTAGE')
                      .map(sele_band);


      /*
      print(Sen_c1.first());
      print(Sen_c2.first());
      print(Sen_c3.first());
      print(Sen_c4.first());
      */
      
      
      var img_01 = Sen_c1.median().clip(geo);
      var img_02 = Sen_c2.median().clip(geo);
      var img_03 = Sen_c3.median().clip(geo);
      var img_04 = Sen_c4.median().clip(geo);
      
      
      print('输出影像数据类型:', img_01.bandTypes());
      print('输出影像数据类型:', img_02.bandTypes());
      print('输出影像数据类型:', img_03.bandTypes());
      print('输出影像数据类型:', img_04.bandTypes());
      
      
      
      // // 创建影像集合
      // var final_imgC = ee.ImageCollection([img_01, img_02, img_03, img_04]);
      // // 计算中值影像
      // var final_img = final_imgC.median();
      
      
      // var final_img = Sen_c2.first();
      var final_img = img_01.unmask(img_02).unmask(img_03).unmask(img_04);
      
      
      
      Map.addLayer(final_img,{min:0,max:3000,bands:["B4","B3","B2"]},"Index"+i,0);
      
      
      var final_img_prj = final_img.select("B4").reproject('EPSG:32649', null, 80).resample('bilinear').toInt();
      
      
      Export.image.toDrive({
            image:final_img_prj, //分类结果
            description:"Sen2_H2A_SR_B4_PRJ_BB_Index_" + i + "_V2022_10", //文件名
            scale:80, //分辨率
            maxPixels:1e13, //此处值设置大一些，防止溢出
            crs:'EPSG:32649',
      });
    }
  });
});








/*
/////////////////////////////////////////////
// Funciton Main================================================================================================================================
/////////////////////////////////////////////
*/
