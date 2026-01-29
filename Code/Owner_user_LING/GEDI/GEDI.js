


/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var gf = ee.ImageCollection("projects/sat-io/open-datasets/GLAD/GEDI_V27"),
    gbf = ee.ImageCollection("projects/sat-io/open-datasets/GLAD/GEDI_V25_Boreal");
/***** End of imports. If edited, may not auto-convert in the playground. *****/
print("gf",gf);
Map.addLayer(gf,{min:0,max:40,palette: '440154,414387,2a788e,23a884,7ad151,fde725'},'gf',0);

print("gbf",gbf);
Map.addLayer(gbf,{min:0,max:40,palette: '440154,414387,2a788e,23a884,7ad151,fde725'},'gbf',0);

var gf_mosc = gf.mosaic();
var gbf_mosc = gbf.mosaic();



var gf_msk = gf_mosc.updateMask(gf_mosc.gt(0));
var gbf_msk = gbf_mosc.updateMask(gbf_mosc.gt(0));

var mosaicImage = ee.ImageCollection([gf_msk, gbf_msk]).mosaic();



/*esri land cover*/
var esri_lulc10 = ee.ImageCollection("projects/sat-io/open-datasets/landcover/ESRI_Global-LULC_10m_TS");
 
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
Map.addLayer(ee.ImageCollection(esri_lulc10.filterDate('2019-01-01','2019-12-31').mosaic()).map(remapper), {min:1, max:9, palette:dict['colors']}, '2017 LULC 10m');
Map.addLayer(mosaicImage,{min:0,max:40,palette: '440154,414387,2a788e,23a884,7ad151,fde725'},'mosaicImage');