/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var image = ee.Image("projects/ee-glj320104/assets/Home_work/Huhuamicao_Cixi"),
    table = ee.FeatureCollection("projects/ee-glj320104/assets/Home_work/Huhuamicao");
/***** End of imports. If edited, may not auto-convert in the playground. *****/
// select the CiXi
var ROI = table;
var CiXi_ROI = ROI.filter(ee.Filter.eq("XIAN_NAME","慈溪市"));
Map.addLayer(CiXi_ROI,{},"CiXi_ROI",0);
Map.centerObject(CiXi_ROI,11);
var roi = CiXi_ROI; 

var huhua_cixi = image.clip(roi);
Map.addLayer(huhua_cixi,{min: 0, max: 1, palette: ['#BDC0BA','#1B813E']},"classification");

//  calculate the area of the huhaumicao 
// create the dict
var out_dict = ee.Dictionary({});

var huahu_area = huhua_cixi.updateMask(huhua_cixi.eq(1)).reduceRegion({
    reducer: ee.Reducer.count(),
    geometry: roi,
    scale: 10,
    maxPixels: 10e15,
}).get('b1');

out_dict = out_dict.set("huhua",huahu_area);

var all_area = huhua_cixi.reduceRegion({
    reducer: ee.Reducer.count(),
    geometry: roi,
    scale: 10,
    maxPixels: 10e15,
}).get('b1');

out_dict = out_dict.set("all",all_area);


// 将字典转换为特征对象
var feature = ee.Feature(null, out_dict);

// 创建包含特征的特征集合
var featureCollection = ee.FeatureCollection([feature]);

// 导出特征集合作为CSV文件到Google Drive
Export.table.toDrive({
  collection: featureCollection,
  description: 'chart',       
  fileFormat: 'CSV'
});