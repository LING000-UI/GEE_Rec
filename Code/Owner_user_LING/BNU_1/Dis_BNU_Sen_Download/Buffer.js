// // 定义四个角点的坐标
// var point1 = [94.12857296399292, 42.320587213667764]; // 左上角
// var point2 = [98.44092463500237, 41.46755800536722]; // 右上角
// var point3 = [97.23577223131565, 38.10068981801465]; // 右下角
// var point4 = [92.9099228533849,38.9160101026168]; // 左下角

// // 创建一个多边形，坐标数组需要闭合，即起点和终点坐标相同
// var rectangle = ee.Geometry.Polygon([
//   [point1, point2, point3, point4, point1]
// ]);


// // // 定义一个矢量矩形，这里以一个示例矩形为例
// // var rectangle = ee.Geometry.Rectangle([102.3911, 22.9075, 105.4111, 18.9275]);

// print(typeof(rectangle));
// print(rectangle);

// // 将矩形均匀向外扩张10km
// var bufferedRectangle = rectangle.buffer(10000); // 注意：buffer的单位是米


// // 将原矩形和扩张后的矩形添加到地图上进行可视化
// Map.addLayer(rectangle, {color: 'blue'}, '原始矩形');
// Map.addLayer(bufferedRectangle, {color: 'red'}, '扩张后的矩形');

// // 设置地图视图
// Map.centerObject(rectangle, 7);



var roic = ee.FeatureCollection("projects/ee-glj320104/assets/BNU_1/BNU_1_4326_Union");
print(roic.size());
print(roic.first());

var roi = roic.first().geometry();
var roi_buffer = roi.buffer(10000);

// print(roi);
// print(roi_buffer);

Map.centerObject(roi,5);
Map.addLayer(roi,{},"yuan");
Map.addLayer(roi_buffer,{color:'red'},"扩张后");

