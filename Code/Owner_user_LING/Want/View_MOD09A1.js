// var areaOfInterest = table;

// var imageCollection = ee.ImageCollection("MODIS/061/MOD09A1")
//   .filterBounds(areaOfInterest)
//   .filterDate('2022-01-01', '2022-12-31');
  
// var img = imageCollection.first();
// print(img);


var table = ee.FeatureCollection("users/gis418670826/province_ALL");
 
var dataset = ee.ImageCollection('MODIS/061/MOD09GA')
                  .filter(ee.Filter.date('2018-04-01', '2018-06-01'));
                  
var state = dataset.select('state_1km');
 
Map.centerObject(table, 4)
Map.addLayer(state.first().clip(table),{},'state_1km');
 
 
var trueColor143 =
    dataset.select(['sur_refl_b01', 'sur_refl_b04', 'sur_refl_b03']);
var trueColor143Vis = {
  min: -100.0,
  max: 8000.0,
};
 
Map.addLayer(trueColor143.first().clip(table), trueColor143Vis, 'True Color (143)');
 
function maskclouds(image) {
  var qa = image.select('state_1km');
  // 去云 cloud
  var cloudBitMask = 1 << 10;
  var mask = qa.bitwiseAnd(cloudBitMask).eq(0)
  // 去云阴影 cloud shadow
  var shadowBitMask = 1 << 2;
  var shadowMask = qa.bitwiseAnd(shadowBitMask).eq(0);
  mask = mask.and(shadowMask);
  // 去云附近的像素 Pixel is adacent to cloud
  var adjacentBitMask = 1 << 13;
  var adjacentMask = qa.bitwiseAnd(adjacentBitMask).eq(0);
  mask = mask.and(adjacentMask);
  // 去雪 show
  var snowBitMask = 1 << 15;
  var snowMask = qa.bitwiseAnd(snowBitMask).eq(0);
  mask = mask.and(snowMask);
  return image.updateMask(mask);
}
 
 
var NoCloud = dataset.map(maskclouds)
                     .select(['sur_refl_b01', 'sur_refl_b04', 'sur_refl_b03']);
 
Map.centerObject(table, 4)
Map.addLayer(NoCloud.first().clip(table),trueColor143Vis,'NoCloud');