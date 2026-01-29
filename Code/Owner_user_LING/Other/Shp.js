/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var geometry = 
    /* color: #d63000 */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[118.67725574674748, 31.59864351969337],
          [118.67725574674748, 30.988427952225827],
          [119.09198963346623, 30.988427952225827],
          [119.09198963346623, 31.59864351969337]]], null, false);
/***** End of imports. If edited, may not auto-convert in the playground. *****/

// 选择Landsat 8影像
var startDate = '2022-01-01';
var endDate = '2023-12-01';
// 创建图像集合
var collection = ee.ImageCollection("LANDSAT/LC08/C02/T1_L2")
  .filterBounds(geometry) // 设定感兴趣区域的边界
  .filterDate(startDate, endDate) // 设定时间范围
  .filter(ee.Filter.lt('CLOUD_COVER',5))//筛选少于5%云量数据
  .mean(); // 取均值影像，以减少云量
  print(collection)
// 应用云掩膜函数筛选图像集合
var water = collection.normalizedDifference(['SR_B3', 'SR_B5'])
.gt(0) // 设定阈值，将大于阈值的像素设置为1，表示水体
.selfMask(); // 自动掩膜，去除非水体部分

// 可视化结果
Map.addLayer(water, {palette: 'blue'}, 'Water');
var zoom=8;
// 设置地图显示范围
Map.centerObject(geometry, zoom);
// 导出矢量
Export.table.toDrive({
  collection: water,
  description: 'water',
  fileFormat: 'SHP'
});