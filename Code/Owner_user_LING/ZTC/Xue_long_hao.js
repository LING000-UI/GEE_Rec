/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var geometry = 
    /* color: #0b4a8b */
    /* displayProperties: [
      {
        "type": "rectangle"
      },
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.MultiPolygon(
        [[[[168.8415441430525, -64.36458167706826],
           [168.8415441430525, -71.75052182187349],
           [189.4079503930525, -71.75052182187349],
           [189.4079503930525, -64.36458167706826]]],
         [[[174.3786535180525, -71.96943038109323],
           [174.3786535180525, -71.99661483995078],
           [177.7184972680525, -71.99661483995078],
           [177.7184972680525, -71.96943038109323]]]], null, false);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
// 创建一个点
var point = ee.Geometry.Point([179.46, -68.10]);

Map.addLayer(point);


var img= ee.ImageCollection("LANDSAT/LC08/C02/T1_TOA")
            .filterDate("2013-12-15","2014-01-15")
            .mosaic();
          
            
            
print(img);


Map.addLayer(img)