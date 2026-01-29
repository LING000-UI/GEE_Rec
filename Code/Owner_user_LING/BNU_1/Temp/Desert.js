/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var BNU = ee.FeatureCollection("projects/ee-glj320104/assets/BNU_1/2022-10");
/***** End of imports. If edited, may not auto-convert in the playground. *****/
// 定义矢量面范围
var geometry = ee.Geometry.Polygon([
  [
    [73, 32],
    [127, 32],
    [127, 55],
    [73, 55],
    [73, 32]
  ]
]);




// 加载一个要素集（这里以全球行政区划为例）
var featureCollection = BNU;

print(BNU.size());

// 过滤与指定区域相交的要素
var intersectingFeatures = featureCollection.filterBounds(geometry);

// 查看相交要素的个数
var intersectingCount = intersectingFeatures.size();

// 打印相交要素的个数
print('相交要素的个数:', intersectingCount);

// 自定义样式：黑色边框，内部透明
var styleParams = {
  color: '000000', // 边框颜色
  fillColor: '00000000', // 填充透明
  width: 2 // 边框宽度
};





// 在地图上添加矢量面和相交要素
Map.addLayer(geometry, {color: 'red'}, '指定区域');
Map.addLayer(intersectingFeatures.style(styleParams), {color: 'blue'}, '相交要素');

// 缩放地图到矢量面
Map.centerObject(geometry);

print(intersectingFeatures);





// 定义一个函数来获取属性名为'id'的值
var getId = function(feature) {
  return ee.Feature(null, {id: feature.get('id')});
};

// 获取要素集中所有'id'属性的值
var ids = intersectingFeatures.map(getId);

// 打印所有'id'属性的值
ids.aggregate_array('id').evaluate(function(idList) {
  print('所有id属性的值:', idList);
});




