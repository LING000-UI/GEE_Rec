
/*************************************************************
*set study area
*************************************************************/
var region = ee.FeatureCollection("FAO/GAUL/2015/level0")
                .filter(ee.Filter.eq('ADM0_NAME','Ukraine'))
                .union().geometry();
                
var roi = region;
Map.addLayer(roi, {'color':'grey'}, 'studyArea');
Map.centerObject(roi);

/************************************************************
*compute the coordinates ot the bounds of study area
*************************************************************/
var bounds = roi.bounds();
var coords = ee.List(bounds.coordinates().get(0));
var xmin = ee.List(coords.get(0)).get(0);
var ymin = ee.List(coords.get(0)).get(1);
var xmax = ee.List(coords.get(2)).get(0);
var ymax = ee.List(coords.get(2)).get(1);
print("xmin,ymin, xmax, ymax",xmin,ymin, xmax, ymax);

/************************************************************
*Define the parameters of hexagon
*************************************************************/
var radius_hex = ee.Number(0.5); 
var sqrt_3 = ee.Number(3).sqrt();
var r_half = radius_hex.divide(2);
var r_half_sqrt_3 = r_half.multiply(sqrt_3);
var step_x = radius_hex.multiply(3);
var step_y = radius_hex.multiply(sqrt_3);
print('radius_hex, r_half, r_half_sqrt_3',radius_hex,r_half,r_half_sqrt_3);

var xx1 = ee.List.sequence(xmin, ee.Number(xmax).add(radius_hex),step_x);
var yy1 = ee.List.sequence(ymin, ee.Number(ymax).add(radius_hex),step_y);

var xx2 = ee.List.sequence(ee.Number(xmin).subtract(radius_hex.multiply(1.5)),ee.Number(xmax).add(radius_hex),step_x);
var yy2 = ee.List.sequence(ee.Number(ymin).add(r_half_sqrt_3), ee.Number(ymax).add(radius_hex), step_y);

print('xx1,yy1,xx2,yy2',xx1,xx2,yy1,yy2);

var cell1 = xx1.map(function(x){
  return yy1.map(function(y){
    var tmpFea = hex(x,y,radius_hex,r_half,r_half_sqrt_3);
    return ee.Feature(tmpFea);
  });
}).flatten();
// print(cell1)
var cell1 = ee.FeatureCollection(cell1)//.flatten();
// Map.addLayer(cell1,{'color':'red'},'cell1');

var cell2 = xx2.map(function(x){
  return yy2.map(function(y){
    var tmpFea = hex(x,y,radius_hex,r_half,r_half_sqrt_3);
    return ee.Feature(tmpFea);
  });
}).flatten();
var cell2 = ee.FeatureCollection(cell2)//.flatten();

var hexGrid = ee.FeatureCollection([cell1,cell2]).flatten().filterBounds(roi);
Map.addLayer(hexGrid,{'color':'D2691E'},'hexGrid'); // DC320C E6DB72 D2691E

Map.addLayer(hexGrid.style({color:'FF0000',fillColor:'00000000' }),null,"hexGrid") 
Map.centerObject(roi)

function hex(x,y,radius_hex,r_half,r_half_sqrt_3){   
  var point1_x = ee.Number(x).subtract(radius_hex);
  var point2_x = ee.Number(x).subtract(r_half);
  var point3_x = ee.Number(x).add(r_half);
  var point4_x = ee.Number(x).add(radius_hex);
  
  // y coordinates
  var point1_y = ee.Number(y).add(r_half_sqrt_3);
  var point2_y = ee.Number(y);
  var point3_y = ee.Number(y).subtract(r_half_sqrt_3);

  var plg_test = 
    /* color: #d63000 */
    /* locked: true */
    ee.Geometry.Polygon(
        [[[point1_x, point2_y],
          [point2_x, point3_y],
          [point3_x, point3_y],
          [point4_x, point2_y],
          [point3_x, point1_y],
          [point2_x, point1_y]]]);
  return ee.Feature(plg_test);
}