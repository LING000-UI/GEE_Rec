
// 使用s2cloudless算法去云
var s2 = ee.ImageCollection("COPERNICUS/S2"), 
    s2_cloud = ee.ImageCollection("COPERNICUS/S2_CLOUD_PROBABILITY"), 
    point = /* color: #98ff00 */ee.Geometry.Point([116.20553071765003, 39.404020061278715]); 


/** 
* 
* remove cloud by probability bands 
* 
* */ 
function rmCloudByProbability(image, thread) { 
  var prob = image.select("probability"); 
  return image.updateMask(prob.lte(thread)); 
} 


/** 
* 
* scale image 
* 
* */ 
function scaleImage(image) { 
  var time_start = image.get("system:time_start"); 
  image = image.divide(10000); 
  image = image.set("system:time_start", time_start); 
  return image; 
} 


function getMergeImages(primary, secondary) { 
  var join = ee.Join.inner(); 
  var filter = ee.Filter.equals({ 
    leftField: 'system:index', 
    rightField: 'system:index' 
  }); 
  var joinCol = join.apply(primary, secondary, filter); 
  joinCol = joinCol.map(function(image) { 
    var img1 = ee.Image(image.get("primary")); 
    var img2 = ee.Image(image.get("secondary")); 
    return img1.addBands(img2); 
  }); 
  return ee.ImageCollection(joinCol); 
} 


function main() { 
  var startDate = "2021-4-4"; 
  var endDate = "2021-4-4"; 
  Map.centerObject(point, 8); 
  var s2Imgs1 = s2.filterDate(startDate, endDate) 
                  .filterBounds(point) 
                  .map(scaleImage); 
  var s2Imgs2 = s2_cloud.filterDate(startDate, endDate) 
                        .filterBounds(point); 
  var s2Imgs = getMergeImages(s2Imgs1, s2Imgs2); 
  s2Imgs = s2Imgs.map(function(image) { 
    return rmCloudByProbability(image, 30); 
  }); 
  Map.addLayer(s2Imgs.first(), {min:0, max:0.3, bands:["B4", "B3", "B2"]}, "cloud"); 
} 

main(); 