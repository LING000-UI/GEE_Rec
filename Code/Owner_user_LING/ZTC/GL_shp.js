// 初始化 Google Earth Engine
var greenland = ee.FeatureCollection('USDOS/LSIB_SIMPLE/2017')
  .filter(ee.Filter.eq('country_na', 'Greenland'));

// 可视化格陵兰岛边界
Map.centerObject(greenland, 4);
Map.addLayer(greenland, {color: 'red'}, 'Greenland Boundary');

// 导出格陵兰岛边界为 GeoJSON 文件
Export.table.toDrive({
  collection: greenland,
  description: 'Greenland_Boundary',
  fileFormat: 'shp'
});
