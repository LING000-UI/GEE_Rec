/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var table = ee.FeatureCollection("projects/ee-glj320104/assets/GPP_ROI/nj");
/***** End of imports. If edited, may not auto-convert in the playground. *****/
var geometry = table;
Map.centerObject(geometry, 8);
var img = ee.ImageCollection('MODIS/006/MCD12Q1').filterDate('2020-01-01','2020-12-31').first().clip(geometry);
print(img)
var igbpLandCover = img.select('LC_Type4');
var igbpLandCoverVis = {
  min: 0.0,
  max: 9.0,
  palette: [
    '000000', '05450a', '086a10', '54a708', '78d203', '009900', 'c6b044',
    'dcd159', 'dade48', 'fbff13'
  ],
};
Map.addLayer(igbpLandCover, igbpLandCoverVis);
