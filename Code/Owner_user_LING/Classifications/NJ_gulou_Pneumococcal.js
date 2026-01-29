/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var table = ee.FeatureCollection("projects/ee-glj320104/assets/zhuchengqu/NJ_gulou");
/***** End of imports. If edited, may not auto-convert in the playground. *****/
var ROI = table;
Map.centerObject(ROI,12);
// Map.addLayer(ROI,{},"NJ_gulou",0);
// Sentinel-2 L2A ImageCollection
var Sen_imgc = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED");

// Sample case
// var sample = Sen_imgc.filterBounds(ROI)
//                     .filterDate("2022-07-01","2022-09-30")
//                     .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE',10))
//                     .sort("CLOUDY_PIXEL_PERCENTAGE")
//                     .mosaic()
//                     .clip(ROI);
// show sample 
// Map.addLayer(sample,{min:0,max:3000,bands:["B4","B3","B2"]},"sample",0);


// ------------------------------------the part of outcloud------------------------------------------
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

// ******(function)calculate the NDVI
function Ndvi_cal(img){
  var NDVI = img.normalizedDifference(["B8","B4"]).rename("NDVI");
  var final_img = img.addBands(NDVI);
  return final_img;
}

// ******(function)select
function sele_band(img){
  var img_sel = img.select("B2","B3","B4","B8","B11","B12");
  return img_sel
}

// --------------------------------------------Pre--------------------------------------------
// ++++++filter the data(2022year )
var Sen_c1 = Sen_imgc.filterDate("2022-01-01","2022-12-31")
                     .filterBounds(ROI);
                     
// print("The size of the Sen_c1:",Sen_c1.size());
// ++++++out cloud,to control the cloud piexl
var cloud_thresholds = 40;

var Sen_c2 = Sen_c1.map(sele_band)
                   .map(scaleImage)
                   .map(function(image) { 
                    return rmCloudByScore(image, cloud_thresholds); 
                   })
                   .map(Ndvi_cal);

var img_8 = Sen_c2.filterDate("2022-07-01","2022-09-30")
                  .median()
                  .clip(ROI);

var img_12 = Sen_c2.filterDate("2022-12-01","2022-12-31")
                   .median()
                   .clip(ROI);
// view: min:0,max:0.2,bands:["B4","B3","B2"]
Map.addLayer(img_8,{min:0,max:0.16,bands:["B4","B3","B2"]},"img_8_true",0);
Map.addLayer(img_12,{min:0,max:0.16,bands:["B4","B3","B2"]},"img_12_true",0);

// calculate the natural phenomena of a seasonal nature
// calculate the stand of C2
var ndvi_8 = img_8.select("NDVI");
var ndvi_12 = img_12.select("NDVI");
var C2 = (ndvi_8.subtract(ndvi_12)).divide(ndvi_8);

// ++++++create a ee.Image to show the classification
var veg_typ = ee.Image(0).clip(ROI);                                                                //background

veg_typ = veg_typ.where(ndvi_8.lt(0.2),1);                                                          // BRE&BUS
veg_typ = veg_typ.where(ndvi_8.gte(0.2).and(ndvi_8.lt(0.5)),2);                                     // GRA
veg_typ = veg_typ.where(ndvi_8.gte(0.5).and(ndvi_8.lte(1)).and(C2.gt(0.35)),3);                     // DBF
veg_typ = veg_typ.where(ndvi_8.gte(0.5).and(ndvi_8.lte(1)).and(C2.gte(0.2).and(C2.lte(0.35))),4);   // MF
veg_typ = veg_typ.where(ndvi_8.gte(0.5).and(ndvi_8.lte(1)).and(C2.lt(0.35)),5);                     // EBF

// -----palette
var pal = ['000000','#d1d1d1','green','2a83e1','ffaf6a','#ff7549'];
Map.addLayer(veg_typ,{min:0,max:5,palette:pal},'veg_typ');