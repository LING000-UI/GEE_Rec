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
              .updateMask(score.lte(thread)); 
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
// dataset
var BNU = ee.FeatureCollection("projects/ee-glj320104/assets/BNU_1/BNU_1_4326_index");
var Sen = ee.ImageCollection("COPERNICUS/S2_SR");

// Map.centerObject(BNU,5);

var pixel_thresholds = 10;
// var per_thresholds = 45;



// date time 

var start_date = "2022-09-01";
var end_date = "2022-12-01";


var BNU_fec = ee.FeatureCollection([]);

var BNU_list = BNU.toList(BNU.size());
for (var i=0; i<BNU_list.length().getInfo();i++){
  var fea = ee.Feature(BNU_list.get(i));
  BNU_fec = BNU_fec.merge(ee.FeatureCollection([fea.set("ID",i)]));
}
print(BNU_fec);


// Map.addLayer(BNU_fec);

// var start = 46;
// var end = 47;

var start = 0;
var end = 55;

for (var i=start; i<end; i++){
  
  var fea = BNU_fec.filter(ee.Filter.eq('ID',i)).first();

  // 缓冲区
  var geo = fea.geometry().buffer(10000);
  
  var Sen_c1 = Sen.filterDate(start_date,end_date)
                .filterBounds(geo)
                .sort('CLOUDY_PIXEL_PERCENTAGE')
                // .map(scaleImage)
                .map(sele_band)
                // .map(resample);



  // var Sen_c2 = Sen.filterDate("2022-10-01","2022-10-31")
  //               .filterBounds(geo)
  //               .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE',pixel_thresholds))
  //               .sort('CLOUDY_PIXEL_PERCENTAGE')
  //               .map(sele_band)
  //               .map(resample);
                       
                       
                       
/*  var Sen_c3 = Sen.filterDate("2022-10-01","2022-10-31")
                .filterBounds(geo)
                .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE',pixel_thresholds))
                .sort('CLOUDY_PIXEL_PERCENTAGE')
                .map(scaleImage)
                .map(function(image) {return rmCloudByScore(image, per_thresholds);})
                .map(sele_band)
                // .map(resample);*/
                    
                    
                    
  var Sen_c4 = Sen.filterDate(start_date,end_date)
                .filterBounds(geo)
                .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE',pixel_thresholds))
                .sort('CLOUDY_PIXEL_PERCENTAGE')
                .map(maskS2clouds)
                // .map(scaleImage)
                .map(sele_band)
                // .map(resample);
    
  
  
  
  // var img_01 = Sen_c3.mosaic().clip(geo);
  var img_02 = Sen_c4.median().clip(geo);
  var img_03 = Sen_c1.median().clip(geo);
  var img_04 = img_02.unmask(img_03);
  
  
  
  
  Map.addLayer(img_04,{min:1500,max:5500,bands:["B4","B3","B2"]},"Index"+i,1);
  
  
  print(img_04);
  
  
  var img_04_prj = img_04.select("B4").reproject('EPSG:32649', null, 80);
  
  
  // Map.addLayer(img_04_prjm,{min:0,max:0.5},"Index"+i,1);
  
  
  Export.image.toDrive({
        image:img_04_prj, //分类结果
        description:"Sen2_SR_B4_PRJ_BB_Index_" + i + "_V2_02_03", //文件名
        scale:80, //分辨率
        maxPixels:1e13, //此处值设置大一些，防止溢出
        crs:'EPSG:32649'
  });
}





/*
/////////////////////////////////////////////
// Funciton Main================================================================================================================================
/////////////////////////////////////////////
*/













// print(BNU.first());

// // print(typeof(BNU.first().geometry()));
// var geo = BNU.first().geometry();
// print(BNU.first().geometry());

// var img = Sen.filterBounds(geo)
//             .filterDate("2022-10-01","2022-10-31")
//             .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE',30))
//             .sort('CLOUDY_PIXEL_PERCENTAGE')
//             .mosaic()
//             .clip(geo);
            
// print(img);

// Map.addLayer(img,{min:0,max:3000,bands:["B4","B3","B2"]},"test");













