/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var esri_lulc_ts = ee.ImageCollection("projects/sat-io/open-datasets/landcover/ESRI_Global-LULC_10m_TS"),
    table = ee.FeatureCollection("projects/ee-glj320104/assets/GPP_ROI/nj");
/***** End of imports. If edited, may not auto-convert in the playground. *****/



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
addCategoricalLegend(legend, dict, '10m Global Land Cover: Impact Observatory');
 
// Add image to the map
// 2015-2016 nodata
// Map.addLayer(ee.ImageCollection(esri_lulc_ts.filterDate('2015-01-01','2015-12-31').mosaic()).map(remapper), {min:1, max:9, palette:dict['colors']}, '2015 LULC 10m');
// Map.addLayer(ee.ImageCollection(esri_lulc_ts.filterDate('2016-01-01','2016-12-31').mosaic()).map(remapper), {min:1, max:9, palette:dict['colors']}, '2016 LULC 10m');

Map.addLayer(ee.ImageCollection(esri_lulc_ts.filterDate('2017-01-01','2017-12-31').mosaic()).map(remapper), {min:1, max:9, palette:dict['colors']}, '2017 LULC 10m');
Map.addLayer(ee.ImageCollection(esri_lulc_ts.filterDate('2018-01-01','2018-12-31').mosaic()).map(remapper), {min:1, max:9, palette:dict['colors']}, '2018 LULC 10m');
Map.addLayer(ee.ImageCollection(esri_lulc_ts.filterDate('2019-01-01','2019-12-31').mosaic()).map(remapper), {min:1, max:9, palette:dict['colors']}, '2019 LULC 10m');
Map.addLayer(ee.ImageCollection(esri_lulc_ts.filterDate('2020-01-01','2020-12-31').mosaic()).map(remapper), {min:1, max:9, palette:dict['colors']}, '2020 LULC 10m');
Map.addLayer(ee.ImageCollection(esri_lulc_ts.filterDate('2021-01-01','2021-12-31').mosaic()).map(remapper), {min:1, max:9, palette:dict['colors']}, '2021 LULC 10m');
Map.addLayer(ee.ImageCollection(esri_lulc_ts.filterDate('2022-01-01','2022-12-31').mosaic()).map(remapper), {min:1, max:9, palette:dict['colors']}, '2022 LULC 10m');




Export.image.toDrive({
image:ee.ImageCollection(esri_lulc_ts.filterDate('2022-01-01','2022-12-31').mosaic()).map(remapper).first().clip(table), //分类结果
description:'nj2022', //文件名
//folder: //云盘中的文件夹
scale: 10, //分辨率
region: table, //区域
maxPixels:34e10 //此处值设置大一些，防止溢出
});


