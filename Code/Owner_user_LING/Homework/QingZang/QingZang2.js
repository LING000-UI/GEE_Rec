/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var table = ee.FeatureCollection("projects/ee-glj320104/assets/Home_work/Changjiangyuan");
/***** End of imports. If edited, may not auto-convert in the playground. *****/

var roi = table;

// 设置时间范围
var startDate = '2018-07-01';
var endDate = '2018-08-31';

// 加载MOD11A1数据集
var dataset1 = ee.ImageCollection('MODIS/061/MOD11A1')
                .filterDate(startDate, endDate)  // 筛选时间范围
                .filterBounds(roi);        // 筛选地理范围

// 输出筛选后的数据集
print('Filtered MOD11A1 Dataset:', dataset1.size());


// 加载MOD11A1数据集
var dataset2 = ee.ImageCollection('MODIS/061/MYD11A1')
                .filterDate(startDate, endDate)  // 筛选时间范围
                .filterBounds(roi);        // 筛选地理范围

// 输出筛选后的数据集
print('Filtered MYD11A1 Dataset:', dataset2.size());



Map.centerObject(roi, 7);
Map.addLayer(roi,{},"ROI");


// （可选）显示数据集中的第一张图像的地表温度
var tempLayer1 = dataset1.first().select('LST_Day_1km').clip(roi);
Map.addLayer(tempLayer1, {min: 13000, max: 16500, palette: ['blue', 'green', 'red']}, 'Land Surface Temperature1');
var tempLayer2 = dataset2.first().select('LST_Day_1km').clip(roi);
Map.addLayer(tempLayer2, {min: 13000, max: 16500, palette: ['blue', 'green', 'red']}, 'Land Surface Temperature2');





