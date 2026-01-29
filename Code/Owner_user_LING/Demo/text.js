

/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var Sen = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED"),
    roi = ee.FeatureCollection("projects/ee-glj320104/assets/Provincial/YunNan");
/***** End of imports. If edited, may not auto-convert in the playground. *****/
// 
var test = Sen.filterDate("2022-10-01","2022-12-01")
              .filterBounds(roi)
              .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE',15));
              
              
print(test.size());

var img = test.first();
print(img);

var img2 = img.select("B4").rename("red");
print(img2);

Map.addLayer()
