

/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var roi = 
    /* color: #d63000 */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[119.43322222285397, 32.642612153466445],
          [119.43322222285397, 30.80177640008054],
          [121.78429644160397, 30.80177640008054],
          [121.78429644160397, 32.642612153466445]]], null, false);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
// var imgVV = ee.ImageCollection('COPERNICUS/S1_GRD')
//         .filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VV'))
//         .filter(ee.Filter.eq('instrumentMode', 'IW'))
//         .select('VV')
//         .map(function(image) {
//           var edge = image.lt(-30.0);
//           var maskedImage = image.mask().and(edge.not());
//           return image.updateMask(maskedImage);
//         });

// var desc = imgVV.filter(ee.Filter.eq('orbitProperties_pass', 'DESCENDING'));
// var asc = imgVV.filter(ee.Filter.eq('orbitProperties_pass', 'ASCENDING'));

// var spring = ee.Filter.date('2015-03-01', '2015-04-20');
// var lateSpring = ee.Filter.date('2015-04-21', '2015-06-10');
// var summer = ee.Filter.date('2015-06-11', '2015-08-31');

// var descChange = ee.Image.cat(
//         desc.filter(spring).mean(),
//         desc.filter(lateSpring).mean(),
//         desc.filter(summer).mean());

// var ascChange = ee.Image.cat(
//         asc.filter(spring).mean(),
//         asc.filter(lateSpring).mean(),
//         asc.filter(summer).mean());

// Map.setCenter(5.2013, 47.3277, 12);
// Map.addLayer(ascChange, {min: -25, max: 5}, 'Multi-T Mean ASC', true);
// Map.addLayer(descChange, {min: -25, max: 5}, 'Multi-T Mean DESC', true);

// // var collection_S1=ee.ImageCollection('COPERNICUS/S1_GRD')
// //                     .filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VV'))
// //                     .filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VH'))
// //                     .filterDate("2022-01-01","2022-10-31")
// //                     .filterBounds(roi);
                          
                          
// // print(collection_S1);


var Sen_sarc = ee.ImageCollection("COPERNICUS/S1_GRD");

var sar_4 = Sen_sarc.filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VV'))
                    .filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VH'))
                    .filterBounds(roi)
                    .filterMetadata('instrumentMode','equals','IW')
                    .filterDate('2023-06-01', '2023-07-30');
                    
                    
print(sar_4);