var shp = ee.FeatureCollection("projects/ee-glj320104/assets/Provincial/YunNan");

// Define an area to perform interpolation over.
var yunnan = shp

Map.addLayer(ee.Image().paint(yunnan, 0, 2), {}, 'yunnanborder');


var NO2 = ee.ImageCollection('COPERNICUS/S5P/OFFL/L3_NO2').select('tropospheric_NO2_column_number_density').filterDate('2019-01-06','2019-01-08').mean().rename('NO2');

// Sample the methane composite to generate a FeatureCollection.
var samples = NO2.addBands(ee.Image.pixelLonLat())
  .sample({region: yunnan, numPixels: 1500,
    scale:1000, projection: 'EPSG:4326'})
  .map(function(sample) {
    var lat = sample.get('latitude');
    var lon = sample.get('longitude');
    var NO2 = sample.get('NO2');
    return ee.Feature(ee.Geometry.Point([lon, lat]), {NO2: NO2});
  });
  
Map.addLayer(samples);


  // get mean
var mean_value = samples.reduceColumns({
reducer: 'mean',
selectors: ['NO2']
});

// get stdev
var sd_value = samples.reduceColumns({
reducer: 'stdDev',
selectors: ['NO2']
});

print(mean_value,sd_value)

// Do the interpolation, valid to 70 kilometers.
var interpolated = samples.inverseDistance({
  range: 7e4,
  propertyName: 'NO2',
  mean: mean_value.get('mean'),
  stdDev: sd_value.get('stdDev'),
  gamma: 0.3});

  
var band_viz = {
  min: 0,
  max: 0.0002,
  palette: ['black', 'blue', 'purple', 'cyan', 'green', 'yellow', 'red']
};

Map.centerObject(yunnan, 7);
Map.addLayer(NO2, band_viz, 'NO2');
Map.addLayer(interpolated, band_viz, 'NO2 Interpolated');


  Export.image.toDrive({
      image: interpolated.clip(yunnan),
      description: 'IDW-test',
      crs: 'EPSG:4326',
      scale: 10000,
      region: yunnan,
      maxPixels: 1e13,
      folder: 'IDW'
    })


