/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var esri_lulc_ts = ee.ImageCollection("projects/sat-io/open-datasets/landcover/ESRI_Global-LULC_10m_TS"),
    table = ee.FeatureCollection("projects/ee-glj320104/assets/GPP_ROI/nj");
/***** End of imports. If edited, may not auto-convert in the playground. *****/
var roi = table;

// var esri_lulc_ts= ee.ImageCollection("projects/sat-io/open-datasets/landcover/ESRI_Global-LULC_10m_TS");
 
// Define a dictionary which will be used to make legend and visualize image on map
var dict = {
  "names": [
    "Water",
    "Trees",
    "Flooded Vegetation",
    "Crops",
    "Built Area",
    "Bare Ground",
    "Snow/Ice",
    "Clouds",
    "Rangeland"
  ],
  "colors": [
    "#1A5BAB",
    "#358221",
    "#87D19E",
    "#FFDB5C",
    "#ED022A",
    "#EDE9E4",
    "#F2FAFF",
    "#C8C8C8",
    "#C6AD8D"
  ]};
  
  function remapper(image){
    var remapped = image.remap([1,2,4,5,7,8,9,10,11],[1,2,3,4,5,6,7,8,9]);
    return remapped;
  }
 
// This is palette has '#000000' for value 3 and 6.
var palette = [
    "#1A5BAB",
    "#358221",
    "#000000",
    "#87D19E",
    "#FFDB5C",
    "#000000",
    "#ED022A",
    "#EDE9E4",
    "#F2FAFF",
    "#C8C8C8",
    "#C6AD8D",
  ];
 
// Create a panel to hold the legend widget
var legend = ui.Panel({
  style: {
    position: 'bottom-left',
    padding: '8px 15px'
  }
});
 
// Function to generate the legend
function addCategoricalLegend(panel, dict, title) {
  
  // Create and add the legend title.
  var legendTitle = ui.Label({
    value: title,
    style: {
      fontWeight: 'bold',
      fontSize: '18px',
      margin: '0 0 4px 0',
      padding: '0'
    }
  });
  panel.add(legendTitle);
  
  var loading = ui.Label('Loading legend...', {margin: '2px 0 4px 0'});
  panel.add(loading);
  
  // Creates and styles 1 row of the legend.
  var makeRow = function(color, name) {
    // Create the label that is actually the colored box.
    var colorBox = ui.Label({
      style: {
        backgroundColor: color,
        // Use padding to give the box height and width.
        padding: '8px',
        margin: '0 0 4px 0'
      }
    });
  
    // Create the label filled with the description text.
    var description = ui.Label({
      value: name,
      style: {margin: '0 0 4px 6px'}
    });
  
    return ui.Panel({
      widgets: [colorBox, description],
      layout: ui.Panel.Layout.Flow('horizontal')
    });
  };
  
  // Get the list of palette colors and class names from the image.
  var palette = dict['colors'];
  var names = dict['names'];
  loading.style().set('shown', false);
  
  for (var i = 0; i < names.length; i++) {
    panel.add(makeRow(palette[i], names[i]));
  }
  
  Map.add(panel);
  
}
 
 
/*
  // Display map and legend ///
*/
 
// Add the legend to the map
addCategoricalLegend(legend, dict, '10m ESRI Land Cover');
 
// Add image to the map
// 2015-2016 nodata
// Map.addLayer(ee.ImageCollection(esri_lulc_ts.filterDate('2015-01-01','2015-12-31').mosaic()).map(remapper), {min:1, max:9, palette:dict['colors']}, '2015 LULC 10m');
// Map.addLayer(ee.ImageCollection(esri_lulc_ts.filterDate('2016-01-01','2016-12-31').mosaic()).map(remapper), {min:1, max:9, palette:dict['colors']}, '2016 LULC 10m');
var LUCC2017 = ee.ImageCollection(esri_lulc_ts.filterDate('2017-01-01','2017-12-31').mosaic()).map(remapper).first().clip(roi);
var LUCC2018 = ee.ImageCollection(esri_lulc_ts.filterDate('2018-01-01','2018-12-31').mosaic()).map(remapper).first().clip(roi);
var LUCC2019 = ee.ImageCollection(esri_lulc_ts.filterDate('2019-01-01','2019-12-31').mosaic()).map(remapper).first().clip(roi);
var LUCC2020 = ee.ImageCollection(esri_lulc_ts.filterDate('2020-01-01','2020-12-31').mosaic()).map(remapper).first().clip(roi);
var LUCC2021 = ee.ImageCollection(esri_lulc_ts.filterDate('2021-01-01','2021-12-31').mosaic()).map(remapper).first().clip(roi);
var LUCC2022 = ee.ImageCollection(esri_lulc_ts.filterDate('2022-01-01','2022-12-31').mosaic()).map(remapper).first().clip(roi);

Map.addLayer(LUCC2017, {min:1, max:9, palette:dict['colors']}, '2017 LULC 10m',0);
Map.addLayer(LUCC2018, {min:1, max:9, palette:dict['colors']}, '2018 LULC 10m',0);
Map.addLayer(LUCC2019, {min:1, max:9, palette:dict['colors']}, '2019 LULC 10m',0);
Map.addLayer(LUCC2020, {min:1, max:9, palette:dict['colors']}, '2020 LULC 10m',0);
Map.addLayer(LUCC2021, {min:1, max:9, palette:dict['colors']}, '2021 LULC 10m',0);
Map.addLayer(LUCC2022, {min:1, max:9, palette:dict['colors']}, '2022 LULC 10m',0);

// // define the type list
// var type_val = ee.List.sequence(1, 9);



var tra_dict = ee.Dictionary({});





// create a type layer
var type_tra = ee.Image(0).clip(roi);

for(var i=1 ;i<=9 ;i++){
  for(var j=1 ;j<=9 ;j++){
    var type = i*10+j;
    
    type_tra = type_tra.where(LUCC2017.eq(i).and(LUCC2022.eq(j)),type);
    
    var value = type_tra.updateMask(type_tra.eq(type)).reduceRegion({
      reducer: ee.Reducer.sum(),
      geometry: roi,
      scale: 10,             
      bestEffort: true,      
      maxPixels:34e10,       
      tileScale:2            
    }).get("constant");
    
    tra_dict = tra_dict.set(i+"_"+j,value);
  }
}

// print(type_tra);

Map.addLayer(type_tra,{palette:[]},"type_tra");

// 将字典转换为特征对象
var feature_tra = ee.Feature(null, tra_dict);

// 创建包含特征的特征集合
var featureCollection_tra = ee.FeatureCollection([feature_tra]);

// 导出特征集合作为CSV文件到Google Drive
Export.table.toDrive({
  collection: featureCollection_tra,
  description: 'tra_nj_2017_2022',       //所有各类型植被占比
  fileFormat: 'CSV'
});


Export.image.toDrive({
image:type_tra,
description:'type_tra_nj',
scale: 10,
region: roi,
maxPixels:34e10
});





// 建设用地转移路径分布
var type_bud = ee.Image(1).clip(roi);

for(var i=5 ;i<=5 ;i++){
  for(var j=1 ;j<=9 ;j++){
    var type = i*10+j;
    
    type_bud = type_bud.where(LUCC2022.eq(i).and(LUCC2017.eq(j)),type);
  }
}



var pal = [
  'FFFFFF',
  'FF0000', // 红色
  '00FF00', // 绿色
  '0000FF', // 蓝色
  'FFFF00', // 黄色
  'FF00FF', // 品红色
  '00FFFF', // 青色
  'FFA500', // 橙色
  '800080', // 紫色
  '008000'  // 深绿色
];

Map.addLayer(type_bud,{palette:pal},"type_bud");

Export.image.toDrive({
image:type_bud,
description:'type_bud_nj',
scale: 10,
region: roi,
maxPixels:34e10
});

