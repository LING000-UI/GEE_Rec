
var s2 = ee.ImageCollection("COPERNICUS/S2"), 
    point = /* color: #98ff00 */ee.Geometry.Point([116.20553071765003, 39.404020061278715]); 


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


/** 
* 
* remove cloud by Score bands 
* 
* */ 
function rmCloudByScore(image, thread) { 
  var preBands = ["B2","B3","B4","B8","B11","B12"]; 
  var newBands = ['blue','green','red','nir','swir1','swir2']; 
  var score = _cloudScore(image.select(preBands, newBands)); 
  score = score.multiply(100).byte().rename('cloud'); 
  return image.addBands(score) 
              .updateMask(score.lte(thread)); 
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

function main() { 
  var startDate = "2019-4-4"; 
  var endDate = "2019-4-8"; 
  Map.centerObject(point, 8); 
  var s2Imgs = s2.filterDate(startDate, endDate) 
                 .filterBounds(point) 
                 .map(scaleImage) 
                 .map(function(image) { 
                    return rmCloudByScore(image, 40); 
                 }); 
  Map.addLayer(s2Imgs.first(), {min:0, max:0.3, bands:["B4", "B3", "B2"]}, "cloud"); 
} 

main(); 