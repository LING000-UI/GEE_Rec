var roi = ee.FeatureCollection('projects/ee-glj320104/assets/GPP_ROI/sz').geometry(); 
Map.addLayer(roi, {'color':'grey'}, 'studyArea');
Map.centerObject(roi, 8);  
 
var image = ee.Image("NOAA/DMSP-OLS/NIGHTTIME_LIGHTS/F182012")  
              .select("stable_lights")  
              .clip(roi);  
 
 
var mask = image.gt(30).add(image.gt(60));  //大于30并且小于60的值变为1，大于60变为2，小于30变为0
mask = mask.updateMask(mask);  
mask = mask.addBands(image);  
print("mask", mask); 
 
 
var vectors = mask.reduceToVectors({  
  reducer: ee.Reducer.mean(),  
  geometry: roi,   
  scale: 1000,  
  geometryType: "polygon",   
  maxPixels: 1e13  
});  
print("vectors", vectors);  
 
 
Map.addLayer(mask.select("stable_lights"), {min:1, max:2, palette: ["red", "green"]}, "image");  
var display = ee.Image()  
                .toByte()  
                .paint({  
                  featureCollection: vectors,   
                  color: null,  
                  width: 1  
                });  
Map.addLayer(display, {palette: "blue"}, "display");