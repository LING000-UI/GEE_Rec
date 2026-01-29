/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var naip = ee.ImageCollection("USDA/NAIP/DOQQ");
/***** End of imports. If edited, may not auto-convert in the playground. *****/
// NAIP
// Get NAIP images for the study period and region of interest.
var naipImage_summer = naip
    // .filterBounds(pt)
    .filterDate('2022-07-01', '2022-8-01')
    .first();


var naipImage_winter = naip
    // .filterBounds(pt)
    .filterDate('2022-11-01', '2022-11-30')
    .first();


print(naipImage_summer);
print(naipImage_winter);

// Display the NAIP mosaic as a color-IR composite.
Map.addLayer(naipImage_summer, {
    bands: ['R', 'G', 'B']
}, 'NAIP_summer');


Map.addLayer(naipImage_winter, {
    bands: ['R', 'G', 'B']
}, 'NAIP_winter');












// // Get the NAIP resolution from the first image in the mosaic.
// var naipScale = naipImage.select('N')
//     .projection().nominalScale();

// print('NAIP NIR scale:', naipScale);