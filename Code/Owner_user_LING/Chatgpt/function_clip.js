/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var nj = ee.FeatureCollection("projects/ee-glj320104/assets/nj"),
    njw = ee.FeatureCollection("projects/ee-glj320104/assets/njwater");
/***** End of imports. If edited, may not auto-convert in the playground. *****/
var imageCollection = ee.ImageCollection('COPERNICUS/S2_SR')
  .filterBounds(nj)
  .filterDate('2022-01-01', '2022-12-31');
  
var img = imageCollection.mosaic();

var clipw = img.clip(njw);
var clip = img.clip(nj);

print(clipw);

print(nj.size());
print(njw.size());


Map.centerObject(nj,9);
Map.addLayer(clipw,{bands:['B4','B3','B2']},'clipw',0);
Map.addLayer(clip,{bands:['B4','B3','B2']},'clip',0);
