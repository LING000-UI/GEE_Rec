/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var table = ee.FeatureCollection("projects/ee-glj320104/assets/Home_work/Qingzanggy");
/***** End of imports. If edited, may not auto-convert in the playground. *****/
var geometry = table;
Map.centerObject(geometry,5);
var dataset = ee.ImageCollection("ECMWF/ERA5_LAND/DAILY_AGGR")
.filterDate('2022-07-01', '2022-09-01')
.filterBounds(geometry)
.select('temperature_2m');

Map.addLayer(geometry,{},'roi');

var visualization = {
  min: -10,
  max: 30,
  palette: [
    '000080', '0000d9', '4000ff', '8000ff', '0080ff', '00ffff',
    '00ff80', '80ff00', 'daff00', 'ffff00', 'fff500', 'ffda00',
    'ffb000', 'ffa400', 'ff4f00', 'ff2500', 'ff0a00', 'ff00ff',
  ]
};

//换算单位 
var subtract= function(image){ 
 var img = image.subtract(273.15);  
 return img.set('system:time_start',image.get('system:time_start'));
};
dataset = dataset.map(subtract);//mean_2m_air_temperature1 开氏度(开尔文)=-272.15 摄氏度
print(ui.Chart.image.series(dataset, geometry, ee.Reducer.mean(), 1000));
function exportImageCollection(imgCol) {
  var indexList = imgCol.reduceColumns(ee.Reducer.toList(), ["system:index"]).get("list");
  indexList.evaluate(function(indexs) {
    for (var i=0; i<indexs.length; i++) {
      var image = imgCol.filter(ee.Filter.eq("system:index", indexs[i])).first();
      image = image.clip(geometry);
      // Map.addLayer(image,visualization,'temperature_2m'+indexs[i],0);
      //tif数据下载
      Export.image.toDrive({
        image: image,
        description: 'temperature_2m'+indexs[i],
        fileNamePrefix: 'temperature_2m'+indexs[i],
        folder: 'temperature_2m',
        region: geometry,
        scale: 1000,
        crs: "EPSG:4326",
        maxPixels: 1e13
      });
    }
  });
}
exportImageCollection(dataset);
