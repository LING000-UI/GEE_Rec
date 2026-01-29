var region = ee.Geometry.Polygon([[[-97.7237319946289, 25.425601933964312],
                                    [-97.46932983398438, 25.428702591345065],
                                    [-97.46143341064453, 25.578369229079655],
                                    [-97.72956848144531, 25.57589179857278]]]);
Map.addLayer(region);                                    
Map.setCenter(-97.46143341064453, 25.578369229079655, 11);

// outCloud
var cloudMask = function(image) {
  var bqa = image.select('BQA')
  .eq([61440,59424,57344,56320,53248,39936,36896,36864,61440, 59424, 57344, 31744, 28672, 28590, 26656, 24576,20516]).reduce('max');
  return image.updateMask(bqa.not());
};

// calculate NDVI
var NDVI = function(img) { 
  var ndvi = img.normalizedDifference(['B5','B4']);
  return ndvi;};   

// add Landsat
var l8 = ee.ImageCollection('LANDSAT/LC8_L1T_TOA').filterDate('2016-01-01', '2016-12-31')
            .select('B5', 'B4', 'BQA').map(cloudMask);

// synthesize
var ndvi = l8.map(NDVI).median().clip(region);
Map.addLayer(ndvi,{min:-1,max:1},'ndvi');

var input = ndvi.add(127.5).multiply(127.5).toUint16();
Map.addLayer(input, {min:16291,max:16300}, 'GLCM input');

print(input.reduceRegion(ee.Reducer.stdDev(), region, 30).get('nd'));

var glcm = input.glcmTexture();
print(glcm);
print(glcm.bandNames());
Map.addLayer(glcm.select('nd_savg'),{min:32582,max:32591}, 'GLCM output (SAVG)');
Map.addLayer(glcm.select('nd_var'),{min:0,max:20}, 'GLCM output (VAR)');