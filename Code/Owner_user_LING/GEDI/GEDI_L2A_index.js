/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var table = ee.FeatureCollection("projects/ee-glj320104/assets/GPP_ROI/nj"),
    ZTC = 
    /* color: #d63000 */
    /* locked: true */
    /* displayProperties: [
      {
        "type": "rectangle"
      },
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.MultiPolygon(
        [[[[121.28706888256106, 40.9293884958188],
           [121.28706888256106, 40.29345797899729],
           [122.26347879467043, 40.29345797899729],
           [122.26347879467043, 40.9293884958188]]],
         [[[116.74268856685877, 49.35523582649726],
           [116.74268856685877, 48.53266171838974],
           [117.94019833248377, 48.53266171838974],
           [117.94019833248377, 49.35523582649726]]]], null, false);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
var qualityMask = function(im) {
  return im.updateMask(im.select('quality_flag').eq(1))
      .updateMask(im.select('degrade_flag').eq(0));
};
var dataset = ee.ImageCollection('LARSE/GEDI/GEDI02_A_002_MONTHLY')
                  .map(qualityMask)
                  .select('rh98','rh50','rh10');

var gediVis = {
  min: 1,
  max: 60,
  palette: 'darkred,red,orange,green,darkgreen',
};

/*GEDIL2A级数据的rh98*/
Map.setCenter(118.796877 , 32.060255, 15);
Map.addLayer(dataset, {}, 'rh98&rh50&rh10');
