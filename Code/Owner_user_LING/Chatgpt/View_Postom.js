/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var msi = ee.ImageCollection("COPERNICUS/S2"),
    naip = ee.ImageCollection("USDA/NAIP/DOQQ"),
    tm = ee.ImageCollection("LANDSAT/LT05/C02/T1"),
    mod09 = ee.ImageCollection("MODIS/061/MOD09A1"),
    sen = ee.ImageCollection("COPERNICUS/S2_SR"),
    pol = 
    /* color: #00ffff */
    /* shown: false */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[13.031556152502288, 52.39757715502849],
          [13.031556152502288, 52.3947555203563],
          [13.036180280843963, 52.3947555203563],
          [13.036180280843963, 52.39757715502849]]], null, false);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
// //  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// //  Chapter:      F1.3 The Remote Sensing Vocabulary
// //  Checkpoint:   F13a
// //  Authors:      K. Dyson, A. P. Nicolau, D. Saah, and N. Clinton
// //  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// //////
// // Explore spatial resolution
// //////

// // Define a region of interest as a point at San Francisco airport.
// var sfoPoint = ee.Geometry.Point(-122.3774, 37.6194);

// // Center the map at that point.
// Map.centerObject(sfoPoint, 16);



// // NAIP
// // Get NAIP images for the study period and region of interest.
// var naipImage = naip
//     .filterBounds(Map.getCenter())
//     .filterDate('2012-01-01', '2016-12-31')
//     .first();

// print(naipImage);


// // Display the NAIP mosaic as a color-IR composite.
// Map.addLayer(naipImage, {
//     bands: ['R', 'G', 'B']
// }, 'NAIP');

// // Get the NAIP resolution from the first image in the mosaic.
// var naipScale = naipImage.select('N')
//     .projection().nominalScale();

// print('NAIP NIR scale:', naipScale);

// //  -----------------------------------------------------------------------
// //  CHECKPOINT 
// //  -----------------------------------------------------------------------

var imgc = sen.filterDate("2022-01-01","2022-12-31")
          .filterBounds(pol)
          .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE',15))
          .sort('CLOUDY_PIXEL_PERCENTAGE')
          .mosaic()
          .clip(pol);
          
Map.centerObject(pol);


Map.addLayer(imgc,{bands:['B4','B3','B2']},"pst");

// 定义目标分辨率
var targetResolution = 1;

// 重采样为10米分辨率
var imgc1m = imgc.resample('bicubic').reproject({
  crs: imgc.projection(),
  scale: targetResolution
});

Map.addLayer(imgc1m,{bands:['B4','B3','B2']},"pst1m");