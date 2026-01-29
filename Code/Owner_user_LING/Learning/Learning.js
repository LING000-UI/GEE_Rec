

/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var polygon = 
    /* color: #d63000 */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[-123.03550164284765, 38.23683326932058],
          [-123.03550164284765, 37.24645620850824],
          [-121.64023797097265, 37.24645620850824],
          [-121.64023797097265, 38.23683326932058]]], null, false);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
// Use curly brackets {} to make a dictionary of key:value pairs.
// 创建了一个字典对象
var object ={
  foo: 'bar',
  baz: 13,
  stuff: ['this', 'that', 'the other thing']
};
print('Dictionary:', object);
// Access dictionary items using Square brackets.用中括号访问元素
print('Print foo:', object['foo']);
print('Print foo:', object.foo);
print(object['foo']==(object.foo));   // true
// Access dictionary items using dot notation.用点来访问元素
print('Print stuff:', object.stuff); 

var image = ee.Image('CGIAR/SRTM90_V4');
//Zoom to a location.放大到目标地点，参数9的意思是缩放等级，越大意味着放大（zoom in）的越厉害。1级就是最大的全球尺度 

// Map.setCenter(-112.8598, 36.2841, 9);

Map.addLayer(image, {min: 0, max: 3000}, 'custom visualization');

Map.addLayer(image, {min: 0, max: 3000, palette: ['blue', 'green', 'red']},  'custom palette'); 


// 计算坡度：
// Load the SRTM image.
var srtm = ee.Image('CGIAR/SRTM90_V4');
// 计算坡度的方法
var slope = ee.Terrain.slope(srtm);
// 展示结果
// Map.setCenter(-112.8598, 36.2841, 9); 
Map.addLayer(slope, {min: 0, max :60}, 'slope');

//**计算三角函数：**

// Get the aspect (in degrees).
var aspect = ee.Terrain.aspect(srtm);
// Convert to radians, compute the sin of the aspect.转化成弧度再计算
var sinImage = aspect.divide(180).multiply(Math.PI).sin();
// 展示结果
Map.addLayer(sinImage, {min: -1, max: 1}, 'sin');

//计算平均高程：

// Compute the mean elevation in the polygon.
var meanDict = srtm.reduceRegion({
  reducer: ee.Reducer.mean(),
  geometry: polygon,
  scale: 90
});
// Get the mean from the dictionary and print it.
var mean = meanDict.get('elevation');
print('Mean elevation', mean);

// 查看影像的默认分辨率
var scale = srtm.projection().nominalScale();

print(scale);