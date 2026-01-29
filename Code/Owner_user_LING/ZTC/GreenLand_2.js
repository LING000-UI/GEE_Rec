/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var geometry = 
    /* color: #d63000 */
    /* shown: false */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[-50.50318729937589, 69.36226407817965],
          [-50.50318729937589, 68.99223704369233],
          [-49.09968388140714, 68.99223704369233],
          [-49.09968388140714, 69.36226407817965]]], null, false);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
// 创建一个要素集，包含多个点
var points = ee.FeatureCollection([
  // ee.Feature(ee.Geometry.Point([-45.11, 69.11]), {ID: '0'}),
  // ee.Feature(ee.Geometry.Point([-42.26, 69.36]), {ID: '1'}),
  // ee.Feature(ee.Geometry.Point([-39, 70]), {ID: '2'}),
  // ee.Feature(ee.Geometry.Point([-42, 70.9]), {ID: '3'}),
  ee.Feature(ee.Geometry.Point([-45, 71.7]), {ID: '4'}),
  // ee.Feature(ee.Geometry.Point([-48.78, 71.56]), {ID: '5'}),
  // ee.Feature(ee.Geometry.Point([-45, 70.23]), {ID: '6'}),
  // ee.Feature(ee.Geometry.Point([-48.3833, 69.8333]), {ID: '7'}),
  ]);
  

var edge = 5000;
var std_time = '2023-07-01';
var end_time = '2023-07-31';



/*// 定义一个函数，为每个点创建方形缓冲区
function createSquareBuffer(feature) {
  // 以每个点为中心，创建10000米的缓冲区
  var bufferDistance = 10000; // 缓冲区边长的一半，即半径
  return feature.buffer(bufferDistance).bounds(); // 创建缓冲区并获取外接矩形
}

// 使用map函数应用createSquareBuffer到要素集中的每个要素
var squareBuffers = points.map(createSquareBuffer);
*/



// 将方形缓冲区添加到地图上 
Map.addLayer(points, {color: 'black'}, 'points',0);
Map.centerObject(points,10);







var start_index = ee.Number.parse(points.reduceColumns(ee.Reducer.min(), ["ID"]).get("min"));
var end_index = ee.Number.parse(points.reduceColumns(ee.Reducer.max(), ["ID"]).get("max"));



// 使用evaluate方法获取这些值
start_index.evaluate(function(start) {
  end_index.evaluate(function(end) {
    for (var i = start; i <= end; i++) {

        var fea = points.filter(ee.Filter.eq('ID', ee.Number(i).format())).first();
        var geo = fea.geometry().buffer(edge).bounds();
        
        
        
        
        // 加载ArcticDEM图像集
        // var arcticDEM = ee.ImageCollection('UMN/PGC/ArcticDEM/V3/2m')
        //                   .filterBounds(squareBuffers)
        //                   .select('elevation');

        // 加载哨兵2号影像集
        var sentinel2 = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
                          // ee.ImageCollection("COPERNICUS/S1_GRD")
                          .filterBounds(geo)
                          .filterDate(std_time, end_time)
                          .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE',25))
                          .sort('CLOUDY_PIXEL_PERCENTAGE')
                          .select(['B4', 'B3', 'B2']);
        
        
        
        var sen = sentinel2.mosaic().clip(geo);
        // var dem = arcticDEM.mosaic().clip(squareBuffers);
        
        
        // print(dem);
        print(sen);


        Map.addLayer(sen,{min:9000,max:11000,bands:["B4","B3","B2"]},"sen" + "_" + std_time +"_Index" + i);
        // Map.addLayer(dem, {}, 'Elevation'+i);




        Export.image.toDrive({
                              image:sen, //分类结果
                              description:"sen" + "_" + std_time +"_Index" + i, //文件名
                              scale:10, //分辨率
                              region:geo, //区域
                              crs: 'EPSG:4326',
                              maxPixels:1e13 //此处值设置大一些，防止溢出
                            });
        
        
        // Export.image.toDrive({
        //                       image:dem, //分类结果
        //                       description:'DEM' + std_time + i, //文件名
        //                       scale:2, //分辨率
        //                       region:fea.geometry(), //区域
        //                       crs: 'EPSG:4326',
        //                       maxPixels:1e13 //此处值设置大一些，防止溢出
        //                     });


    }
  });
});












// ====================================================

// // 加载ArcticDEM图像集
// var arcticDEM = ee.ImageCollection('UMN/PGC/ArcticDEM/V3/2m')
//                   .filterBounds(geometry)
//                   .select('elevation');

// var dem = arcticDEM.mosaic().clip(geometry);
 
// var elevationVis = {
//   min: -50.0,
//   max: 1000.0,
//   palette: ['0d13d8', '60e1ff', 'ffffff'],
// };
 
// Map.addLayer(dem,elevationVis, 'Elevation');
 