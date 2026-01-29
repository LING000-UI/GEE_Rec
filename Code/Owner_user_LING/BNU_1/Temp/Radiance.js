/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var geometry = /* color: #bf04c2 */ee.Geometry.Point([121.65292169091951, 31.811994343761707]);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
// 计算指定日期的日地距离函数
function calculateEarthSunDistance(date) {
  var janFirst = ee.Date.fromYMD(date.get('year'), 1, 1);
  var days = date.difference(janFirst, 'day');
  
  // 天文常数
  var rad = ee.Number(0.0167); // 地球轨道偏心率
  var meanAnomaly = ee.Number(0.9856).multiply(days).add(357.529);
  var trueAnomaly = meanAnomaly.add(rad.multiply(meanAnomaly.multiply(Math.PI / 180).sin()).multiply(2));
  
  // 日地距离（天文单位）
  var distance = ee.Number(1).subtract(rad.multiply(trueAnomaly.multiply(Math.PI / 180).cos()));
  return distance;
}

// 计算辐亮度的函数
function calculateRadiance(image, bandName) {
  // 获取影像的属性
  var solarIrradiance = image.getNumber('SOLAR_IRRADIANCE_' + bandName);
  var meanIncidenceZenithAngle = image.getNumber('MEAN_INCIDENCE_ZENITH_ANGLE_' + bandName);
  
  // 计算大气顶层反射率
  var reflectance = image.select(bandName).divide(10000);
  
  // 计算日地距离
  var date = ee.Date(image.get('system:time_start'));
  var earthSunDistance = calculateEarthSunDistance(date);
  
  // 计算太阳天顶角
  var solarZenithAngle = image.getNumber('MEAN_SOLAR_ZENITH_ANGLE').multiply(Math.PI / 180);
  
  // 计算辐亮度
  var radiance = reflectance.multiply(solarIrradiance).multiply(solarZenithAngle.cos()).divide(Math.PI).divide(earthSunDistance.pow(2));
  
  return radiance.rename(bandName);
}

// 并行计算辐亮度的函数
function calculateAllRadiances(image) {
  var bands = ['B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8A', 'B9', 'B11', 'B12'];
  
  var radiances = bands.map(function(bandName) {
    return calculateRadiance(image, bandName);
  });
  
  return ee.Image.cat(radiances).set('system:time_start', image.get('system:time_start'));
}





// // 定义并行计算的函数
// function calculateRadianceCollection(imageCollection) {
//   return imageCollection;
// }

// 加载影像集合
var collection = ee.ImageCollection('COPERNICUS/S2')
  .filterDate('2021-01-01', '2021-12-31')
  .filterBounds(geometry)
  .map(calculateAllRadiances);

// // 计算影像集合中所有影像的辐亮度
// var radianceCollection = calculateRadianceCollection(collection);



// 显示结果
var radianceImage = collection.first(); // 对集合取中值以减少云影响
print(radianceImage);


Map.centerObject(radianceImage, 10);
Map.addLayer(radianceImage, {bands: ['B4', 'B3', 'B2'], min: 0, max: 0.2}, 'Radiance Image');
