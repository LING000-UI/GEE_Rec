/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var table = ee.FeatureCollection("projects/ee-glj320104/assets/ChinaALL");
/***** End of imports. If edited, may not auto-convert in the playground. *****/

var roi = table;
Map.addLayer(roi,{},"roi");

var dataset = ee.ImageCollection('ECMWF/ERA5_LAND/MONTHLY_AGGR')
                .filterDate("2022-10-01","2022-10-31")
                .first()
                .select("total_precipitation_sum","evaporation_from_bare_soil_sum")
                .clip(roi);
print(dataset);

// evaporation_from_bare_soil_sum
// total_precipitation_sum

var visualization = {
  bands: ["total_precipitation_sum"],
  // min: 250,
  // max: 320,
  palette: [
    '000080', '0000d9', '4000ff', '8000ff', '0080ff', '00ffff',
    '00ff80', '80ff00', 'daff00', 'ffff00', 'fff500', 'ffda00',
    'ffb000', 'ffa400', 'ff4f00', 'ff2500', 'ff0a00', 'ff00ff',
  ]
};

Map.setCenter(120, 35, 3);
Map.addLayer(
    dataset, visualization, 'Air temperature [K] at 2m height', true, 0.8);
    

// 在区域内进行随机取样
var sampledPoints = dataset.sample({
  region: roi,
  scale: 10000,
  numPixels: 500,
  seed: 0,
  geometries: true
});

// 打印抽样点的属性
print(sampledPoints);

// 可视化抽样点
Map.addLayer(sampledPoints, {}, 'Sampled Points');

// 导出矢量点
Export.table.toDrive({
  collection:sampledPoints,
  description: "Jiangshui_Zhengfa",
  fileNamePrefix: "Jiangshui_Zhengfa",
  folder:'sampleShp',
  fileFormat: "SHP"
});


