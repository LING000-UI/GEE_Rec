


/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var bh = 
    /* color: #98ff00 */
    /* shown: false */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[120.49778640443724, 40.637962450379085],
          [120.49778640443724, 39.84337808681475],
          [121.89854324037474, 39.84337808681475],
          [121.89854324037474, 40.637962450379085]]], null, false);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
var roi = bh;
var sencol = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
               .filterDate('2022-01-01','2022-01-31')
               .filterBounds(roi)
               .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE',25))
               .sort('CLOUDY_PIXEL_PERCENTAGE');
               
var img = sencol.mosaic().clip(roi);
Map.centerObject(roi,9);
Map.addLayer(img,{min:0,max:6000,bands:['B4','B3','B2']},"img");


var qualityMask = function(im) {
  return im.updateMask(im.select('quality_flag').eq(1))
      .updateMask(im.select('degrade_flag').eq(0));
};
var gediVis = {
  min: 1,
  max: 60,
  palette: 'darkred,red,orange,green,darkgreen',
};
var dataset = ee.ImageCollection('LARSE/GEDI/GEDI02_A_002_MONTHLY')
                  .map(qualityMask)
                  .select('rh100')
                  .filterDate('2022-01-01','2022-01-31')
                  .filterBounds(roi);
                  
Map.addLayer(dataset, gediVis, 'rh98');