/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var table = 
    /* color: #d63000 */
    /* shown: false */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[115.70555697034925, 40.473061131378806],
          [115.70555697034925, 39.365085983882885],
          [117.11180697034925, 39.365085983882885],
          [117.11180697034925, 40.473061131378806]]], null, false);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
// var l4b = ee.Image('LARSE/GEDI/GEDI04_B_002');
 
// Map.addLayer(
//     l4b.select('MU'),
//     {min: 10, max: 250, palette: '440154,414387,2a788e,23a884,7ad151,fde725'},
//     'Mean Biomass');
// Map.addLayer(
//     l4b.select('SE'),
//     {min: 10, max: 50, palette: '000004,3b0f6f,8c2981,dd4a69,fe9f6d,fcfdbf'},
//     'Standard Error');

var roi = table;

var qualityMask = function(im) {
  return im.updateMask(im.select('quality_flag').eq(1))
      .updateMask(im.select('degrade_flag').eq(0));
};

var dataset = ee.ImageCollection('LARSE/GEDI/GEDI02_A_002_MONTHLY')
                  .map(qualityMask)
                  .select('rh100');

var sar = dataset.mosaic().clip(roi);

var gediVis = {
  min: 1,
  max: 60,
  palette: 'darkred,red,orange,green,darkgreen',
};


Map.centerObject(roi,10);
Map.addLayer(sar, gediVis, 'rh100');