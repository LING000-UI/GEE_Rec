/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var roi = ee.FeatureCollection("projects/ee-glj320104/assets/GPP_ROI/nj");
/***** End of imports. If edited, may not auto-convert in the playground. *****/
var img = ee.ImageCollection('COPERNICUS/S2_SR')
    .filterBounds(roi)
    .filterDate('2022-01-01','2022-02-01')
    .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE',10))
    .sort('CLOUDY_PIXEL_PERCENTAGE')
    .mosaic()
    .clip(roi);
    
    
Map.addLayer(img,{},'1');
Map.centerObject(roi,8);

var img2 = ee.ImageCollection('COPERNICUS/S2_SR')
    .filterBounds(roi)
    .filterDate('2022-05-01','2022-06-01')
    .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE',100))
    .sort('CLOUDY_PIXEL_PERCENTAGE')
    .mosaic()
    .clip(roi);


Map.addLayer(img2,{},'1');






var mask = img2.blend(img);

print(mask);


Map.addLayer(mask,{},'1?');