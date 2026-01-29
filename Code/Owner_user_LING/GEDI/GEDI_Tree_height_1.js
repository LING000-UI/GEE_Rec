


/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var table = ee.FeatureCollection("projects/ee-glj320104/assets/zhuchengqu/NJ_gulou");
/***** End of imports. If edited, may not auto-convert in the playground. *****/
/* 
 * 1. 不使用"ESA/WorldCover/v100"的Tree覆盖类型计算NDVI进行树木的划分（为了去除建筑物的影响）
 * 2. 添加植被指数、纹理特征以及其他特征要素
 * 3. 更改研究时间
 * 
*/




/* >>boundary */
/* Sentinel-1 数据输入 (选择极化模式，雷达成像模式，轨道运行模式)*/
/* 定义研究区 */
var boundary = table;

/* 重投影统一空间分辨率为10m */
var _scale = 10;
var _EPSG = 'EPSG:4326';

/* 定义开始时间和结束时间 */
var startDate = "2021-07-01";
var endDate = "2021-09-01";

/* 定义冬季开始时间和结束时间 */
var startDate_w = "2021-12-01";
var endDate_w = "2022-02-01";

/* 定义云量掩膜系数 */
var cloud_score = 45;

// ////////////////////////////////////////////////////////////////////////////////////////////////
var S1_PRS = ee.ImageCollection('COPERNICUS/S1_GRD')
    .filterDate(startDate, endDate)
    .filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VV'))
    .filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VH'))
    .filter(ee.Filter.eq('instrumentMode', 'IW'))
    .filter(ee.Filter.eq('orbitProperties_pass', 'ASCENDING'))
    .filterBounds(boundary);

/* S1_PRS_pc 将包含了图像集合中每个像素在25%、50%和75%位置的百分位数值 */
var S1_PRS_pc = S1_PRS.reduce(ee.Reducer.percentile([25,50,75]));
print('S1_PRS_pc',S1_PRS_pc);


/* 将原始的百分位数值转换为线性单位（反射率），使其可以进行平均或其他线性操作 */
var S1_PRS_pc = ee.Image(10).pow(S1_PRS_pc.divide(10));
print('S1_PRS_pc_liner',S1_PRS_pc);


/* 选择线性化后“中值”的极化方式并裁剪 */
var S1_PRS_pc_Feats = S1_PRS_pc.select(['VH_p50','VV_p50']).clip(boundary);

// 重投影至 WGS 84 ，并将空间分辨率调整为10m(_scale)                
var S1_PRS_pc_Feats = S1_PRS_pc_Feats.reproject({crs: _EPSG ,scale: _scale}); 

/* 输出当前影像的投影坐标系 */
print('Projection, crs, and crs_transform:', S1_PRS_pc_Feats.projection());  

/* 计算 Sentinel-1 数据的四分位数的范围，相当于就是去除极端数据的，对每个像元进行计算中间50%的范围 */
// Calculate IQR for the VV polarization
var PRS_VV_iqr = S1_PRS_pc_Feats
	.addBands((S1_PRS_pc.select('VV_p75')
	.subtract(S1_PRS_pc.select('VV_p25')))
	.rename('VV_iqr'));

// Calculate IQR for the VH polarization
var PRS_VH_iqr = S1_PRS_pc_Feats
	.addBands((S1_PRS_pc.select('VH_p75')
	.subtract(S1_PRS_pc.select('VH_p25')))
	.rename('VH_iqr'));

// 输出中值范围
print('Post-rainy Season VV IQR', PRS_VV_iqr);
print('Post-rainy Season VV IQR', PRS_VH_iqr);


/* 加载 Sentinel-2 数据 */
// ////////////////////////////////////////////////////////////////////////////////////////////////

var s2 = ee.ImageCollection('COPERNICUS/S2_SR');

/* 定义阈值去云处理函数 */
/* 云量缩放函数 */
var _cloudScore = function(img) { 
    var rescale = function(img, exp, thresholds) { 
      return img.expression(exp, {img: img}) 
          .subtract(thresholds[0]).divide(thresholds[1] - thresholds[0]); 
    }; 
    var score = ee.Image.constant(1.0); 
    score = score.min(rescale(img, 'img.blue', [0.1, 0.3])); 
    score = score.min(rescale(img, 'img.red + img.green + img.blue', [0.2, 0.8])); 
    score = score.min(rescale(img, 'img.nir + img.swir1 + img.swir2', [0.3, 0.8])); 
    var ndsi = img.normalizedDifference(['green', 'swir1']); 
    return score.min(rescale(ndsi, 'img', [0.8, 0.6])); 
  }; 

/* 云量掩膜函数 最后缩放10000 */
function Threshold_de_cloud(img,thread){
    var img_scale = img.divide(10000);
    var preBands = ["B2","B3","B4","B8","B11","B12"]; 
    var newBands = ['blue','green','red','nir','swir1','swir2']; 
    var score = _cloudScore(img_scale.select(preBands, newBands)); 
    score = score.multiply(100).byte().rename('cloud'); 
    return img.addBands(score).updateMask(score.lte(thread)).divide(10000);
}

/* 筛选 Sentinel-2 数据 阈值去云 中值median镶嵌 */
var composite_Thre = s2.filterDate(startDate, endDate)
                  .map(function(image) { 
                    return Threshold_de_cloud(image, cloud_score); 
                  })
                  .select('B2', 'B3', 'B4','B5','B6','B7','B8','B8A' ,'B11','B12'); 

// 重投影至 WGS 84 ，并将空间分辨率调整为10m(_scale)                
var S2_composite_1 = composite_Thre.median().reproject({crs: _EPSG, scale: _scale}).clip(boundary);



// ////////////////////////////////////////////////////////////////////////////////////////////////
/* QA波段去云函数 */
// Create a function to mask clouds using the Sentinel-2 QA band.
function maskS2clouds(image) {
    var qa = image.select('QA10');
  
    // Bits 10 and 11 are clouds and cirrus, respectively.
    var cloudBitMask = ee.Number(2).pow(10).int();
    var cirrusBitMask = ee.Number(2).pow(11).int();
  
    // Both flags should be set to zero, indicating clear conditions.
    var mask = qa.bitwiseAnd(cloudBitMask).eq(0).and(
               qa.bitwiseAnd(cirrusBitMask).eq(0));
  
    // Return the masked and scaled data.
    return image.updateMask(mask).divide(10000);
  }
  
// Filter clouds from Sentinel-2 for a given period.
var composite_QA = s2.filterDate(startDate, endDate)
                  // Pre-filter to get less cloudy granules.
                  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))
                  .map(maskS2clouds)
                  .select('B2', 'B3', 'B4','B5','B6','B7','B8','B8A','B11', 'B12'); 
  
// Reproject to WGS 84 UTM zone 35s                  
var S2_composite_2 = composite_QA.median().reproject({crs: _EPSG, scale: _scale}).clip(boundary);

// 将两种去云方式镶嵌
var S2_composite = S2_composite_1.unmask(S2_composite_2);

// 检查输出 Sentinel-2 数据                
print('Projection, crs, and crs_transform:', S2_composite.projection());

// 显示 假彩色影像
Map.addLayer(S2_composite, {bands: ['B11', 'B8', 'B3'], min: 0, max: 0.3},"S2_flase");
Map.addLayer(S2_composite, {bands: ['B4', 'B3', 'B2'], min: 0, max: 0.3},"S2_true");





// ////////////////////////////////////////////////////////////////////////////////////////////////
/* 准备冬季的Sentinl-2 影像 */
var composite_Thre_w = s2.filterDate(startDate_w, endDate_w)
                  .map(function(image) { 
                    return Threshold_de_cloud(image, cloud_score); 
                  })
                  .select('B2', 'B3', 'B4','B5','B6','B7','B8','B8A' ,'B11','B12'); 

// 重投影至 WGS 84 ，并将空间分辨率调整为10m(_scale)                
var S2_composite_1_w = composite_Thre_w.median().reproject({crs: _EPSG, scale: _scale}).clip(boundary);


var composite_QA_w = s2.filterDate(startDate_w, endDate_w)
                  // Pre-filter to get less cloudy granules.
                  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))
                  .map(maskS2clouds)
                  .select('B2', 'B3', 'B4','B5','B6','B7','B8','B8A','B11', 'B12'); 
  
// Reproject to WGS 84 UTM zone 35s                  
var S2_composite_2_w = composite_QA_w.median().reproject({crs: _EPSG, scale: _scale}).clip(boundary);

// 将两种去云方式镶嵌
var S2_composite_w = S2_composite_1_w.unmask(S2_composite_2_w);

// 检查输出 Sentinel-2 数据                
print('Projection, crs, and crs_transform:', S2_composite_w.projection());

// 显示 假彩色影像
Map.addLayer(S2_composite_w, {bands: ['B11', 'B8', 'B3'], min: 0, max: 0.3},"S2_flase_w");
Map.addLayer(S2_composite_w, {bands: ['B4', 'B3', 'B2'], min: 0, max: 0.3},"S2_true_w");
















// ////////////////////////////////////////////////////////////////////////////////////////////////
/* 加载地形数据SRTM */
var SRTM = ee.Image("USGS/SRTMGL1_003");
// 裁剪图像
var elevation = SRTM.clip(boundary);


// 重投影DEM                
var elevation = elevation.reproject({crs: _EPSG,scale: _scale}); 
// 输出DEM投影信息
print('Projection, crs, and crs_transform:', elevation.projection()); 


// 计算坡度、坡向信息
var slope = ee.Terrain.slope(SRTM).clip(boundary);
var aspect = ee.Terrain.aspect(SRTM).clip(boundary);

// 重投影坡度               
var slope = slope.reproject({crs: _EPSG,scale: _scale});
var aspect = aspect.reproject({crs: _EPSG,scale: _scale}); 

// 输出slope投影信息
print('Projection, crs, and crs_transform:', slope.projection()); 
print('Projection, crs, and crs_transform:', aspect.projection()); 






// ////////////////////////////////////////////////////////////////////////////////////////////////
/* 计算纹理特征 */
/* 对融合后的影像进行数据类型转换 toInt32 */
var S2_composite_int16 = S2_composite.multiply(10000).toInt16();
var glcm_B = S2_composite_int16.glcmTexture();





// ////////////////////////////////////////////////////////////////////////////////////////////////
/* 把NDVI计算函数单独出来 */
function NDVI_cal(img){
  var NDVI = img.normalizedDifference(["B8","B4"]).rename("NDVI");
  return NDVI;
}



// ////////////////////////////////////////////////////////////////////////////////////////////////
/* 计算遥感植被指数 */
function exponents(img){
  var NDVI = img.normalizedDifference(["B8","B4"]).rename("NDVI");
  var NDVIre1 = img.normalizedDifference(["B8","B5"]).rename("NDVIre1");
  var NDVIre2 = img.normalizedDifference(["B8","B6"]).rename("NDVIre2");
  var NDVIre3 = img.normalizedDifference(["B8","B7"]).rename("NDVIre3");
  var NDVIre4 = img.normalizedDifference(["B8","B8A"]).rename("NDVIre4");
  
  var NDre1 = img.normalizedDifference(["B8","B5"]).rename("NDre1");
  var NDre2 = img.normalizedDifference(["B8","B6"]).rename("NDre2");
  var NDre3 = img.normalizedDifference(["B8","B7"]).rename("NDre3");
  var NDre4 = img.normalizedDifference(["B8","B8A"]).rename("NDre4");
  
  
  var NDWI = img.normalizedDifference(['B3','B8']).rename("NDWI");
  var MNDWIre1 = img.normalizedDifference(['B3','B11']).rename("MNDWIre1");
  var MNDWIre2 = img.normalizedDifference(['B3','B12']).rename("MNDWIre2");
  
  
  var LSWIre1 = img.normalizedDifference(['B8','B11']).rename("LSWIre1");
  var LSWIre2 = img.normalizedDifference(['B8','B12']).rename("LSWIre2");
  
  
  var Clre1 = img.select("B8").divide(img.select("B5")).subtract(1).rename("Clre1");
  var Clre2 = img.select("B8").divide(img.select("B6")).subtract(1).rename("Clre2");
  var Clre3 = img.select("B8").divide(img.select("B7")).subtract(1).rename("Clre3");
  var Clre4 = img.select("B8").divide(img.select("B8A")).subtract(1).rename("Clre4");
  
  
  var RVI = img.select("B8").divide(img.select("B4")).rename("RVI");
  var DVI = img.select("B8").subtract(img.select("B4")).rename("DVI");
  var GI = img.select("B3").divide(img.select("B4")).rename("GI");
  
  
  var son = img.select("B8").subtract(img.select("B4"));
  var mon = img.select("B4").multiply(6.0).subtract(img.select("B2").multiply(7.5)).add(img.select("B8")).add(1); 
  var EVI = son.divide(mon).multiply(2.5).rename("EVI");
  
  var final_img = img.addBands(NDVI).addBands(NDVIre1).addBands(NDVIre2).addBands(NDVIre3).addBands(NDVIre4)
                     .addBands(NDre1).addBands(NDre2).addBands(NDre3).addBands(NDre4)
                     .addBands(NDWI).addBands(MNDWIre1).addBands(MNDWIre2)
                     .addBands(LSWIre1).addBands(LSWIre2)
                     .addBands(Clre1).addBands(Clre2).addBands(Clre3).addBands(Clre4)
                     .addBands(RVI).addBands(DVI).addBands(GI)
                     .addBands(EVI);
  
  return final_img;
  
}


// ////////////////////////////////////////////////////////////////////////////////////////////////
/* 计算物候特征 */
var NDVI_s = NDVI_cal(S2_composite);
var NDVI_w = NDVI_cal(S2_composite_w);

function psw(img){
  var Psw = (NDVI_s.subtract(NDVI_w)).divide(NDVI_s);
  var final_img = img.addBands(Psw.rename("Psw"));
  
  return final_img;
}













// ////////////////////////////////////////////////////////////////////////////////////////////////
/* 依据夏季NDVI阈值进行植被区域的提取 */

// 只选择tree覆盖的范围进行反演
var forest_mask = NDVI_s.updateMask(
  NDVI_s.gte(0.45) // Only keep pixels where class equals 2
).select('NDVI').rename("Map");

// 展示tree范围,树的掩膜
var visualization = {bands: ['Map'],palette:['green']};
Map.addLayer(forest_mask, visualization, "Trees");










// ////////////////////////////////////////////////////////////////////////////////////////////////
/* 融合预测的变量 */
var mergedCollection = psw(exponents(S2_composite))
                          .addBands(NDVI_s
                          .addBands(PRS_VV_iqr
                          .addBands(PRS_VH_iqr
                          .addBands(elevation
                          .addBands(slope
                          .addBands(aspect
                          .addBands(glcm_B
                          .addBands(forest_mask))))))));

// 对融合影像集进行boundary的裁剪
var clippedmergedCollection = mergedCollection.clipToCollection(boundary);
print('clippedmergedCollection: ', clippedmergedCollection);


/* 输出合成图像的所有波段列表 */
var bandsList = mergedCollection.bandNames();
print('bandsList',bandsList);




// 定义进入分类器的波段
// var bands = ['B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8','B8A', 'B11', 'B12', 'VV_iqr', 'VH_iqr', 'elevation', 'slope', 'Map'];

var bands = bandsList;








// ////////////////////////////////////////////////////////////////////////////////////////////////
/* 加载GEDI数据 */
// 定义掩膜函数
var qualityMask = function(im) {
    return im.updateMask(im.select('quality_flag').eq(1))
        .updateMask(im.select('degrade_flag').eq(0));
  };
  
// 导入GEDI数据
var dataset = ee.ImageCollection('LARSE/GEDI/GEDI02_A_002_MONTHLY')
                .map(qualityMask)
                .select('rh98').filterBounds(boundary);

// 可视化参数
var gediVis = {
min: 1,
max: 60,
palette: 'darkred,red,orange,green,darkgreen',
};
// 可视GEDI数据
Map.centerObject(boundary, 13);
Map.addLayer(dataset, gediVis, 'rh98');

// 输出GEDI投影以及空间分辨率，镶嵌所在研究区范围内的数据
var projection = dataset.first().projection().aside(print);
var scale = projection.nominalScale().aside(print);
var mosaic = dataset.mosaic().setDefaultProjection({crs:_EPSG, scale:scale}); 

// 检测mosaic坐标系
print("img:mosaic,prj",mosaic.projection());

// ////////////////////////////////////////////////////////////////////////////////////////////////
/* 根据GEDI影像脚印采样成点 */
var points = mosaic.sample({
    region: boundary,
    scale: _scale,
    numPixels: 500000, 
    projection: _EPSG,
    geometries: true});

// 检测样本点及其信息
print("Sample points size",points.size());
print("Sample points size_10",points.limit(10));
Map.addLayer(points,{},"Sample points");

// 添加随机列（命名为随机），并指定种子值以提高重复性
var datawithColumn = points.randomColumn('random', 27);

// 70%训练集, 30%验证集，根据随机种子进行过滤
var split = 0.7; 
var trainingData = datawithColumn.filter(ee.Filter.lt('random', split));
// print('training data', trainingData);

var validationData = datawithColumn.filter(ee.Filter.gte('random', split));
print('validation data', validationData);


// ////////////////////////////////////////////////////////////////////////////////////////////////
/* 使用RF分类器进行回归建模 */
// 收集训练数据
/* 将图像（按给定比例）中与一个或多个区域相交的每个像素转换为特征，并以特征集合的形式返回。
每个输出特征都将包含输入图像的每个波段的一个属性，以及从输入特征复制的任何指定属性。
 */
var training = clippedmergedCollection.select(bands).sampleRegions({
    collection: trainingData,
    properties: ['rh98'],
    scale: _scale  
    });

print("training",training);

// 训练一个随机的回归RF
// 训练模型
var classifier = ee.Classifier.smileRandomForest(150)
    .setOutputMode('REGRESSION')
    .train({
        features: training, 
        classProperty: "rh98",
        inputProperties: bands
    });

// 使用训练好的模型对影像进行分类
var regression = clippedmergedCollection.select(bands).classify(classifier, 'predicted').clip(boundary);

// 加载调色板
var palettes = require('users/gena/packages:palettes');
print("palettes",palettes);
// 选择并定义调色板
var palette = palettes.colorbrewer.YlGn[5];

// ////////////////////////////////////////////////////////////////////////////////////////////////

// 展示输入的影像和分类的图像
  // 获取图像的最大值和最小值
  var regressionMin = (regression.reduceRegion({
    reducer: ee.Reducer.min(),
    scale: 30, 
    crs: _EPSG,
    geometry: boundary,
    bestEffort: true,
    tileScale: 5
  }));
  var regressionMax = (regression.reduceRegion({
    reducer: ee.Reducer.max(),
    scale: 30, 
    crs: _EPSG,
    geometry: boundary,
    bestEffort: true,
    tileScale: 5
  }));

// 添加至地图
var viz = {palette: palette, 
           min: regressionMin.getNumber('predicted').getInfo(), 
           max: regressionMax.getNumber('predicted').getInfo()};

Map.addLayer(regression, viz, 'Regression');


// ////////////////////////////////////////////////////////////////////////////////////////////////
/* 为图例项目创建面板。 */
var legend = ui.Panel({
    style: {
      position: 'bottom-left',
      padding: '8px 15px'
    }
  });
  
// 创建并添加图例标题
var legendTitle = ui.Label({
value: 'TC Height',
style: {
    fontWeight: 'bold',
    fontSize: '18px',
    margin: '0 0 4px 0',
    padding: '0'
}
});

legend.add(legendTitle);

// 创建图例图像
var lon = ee.Image.pixelLonLat().select('latitude');
var gradient = lon.multiply((viz.max-viz.min)/100.0).add(viz.min);
var legendImage = gradient.visualize(viz);

// 在图例顶部创建文本
var panel = ui.Panel({
    widgets: [
    ui.Label(viz['max'])
    ],
    });

legend.add(panel);


// 从图像创建缩略图
var thumbnail = ui.Thumbnail({
    image: legendImage,
    params: {bbox:'0,0,10,100', dimensions:'10x200'},
    style: {padding: '1px', position: 'bottom-center'}
    });

// 将缩略图添加到图例中
legend.add(thumbnail);
 
// 在图例顶部创建文本
var panel = ui.Panel({
widgets: [
ui.Label(viz['min'])
],
});

legend.add(panel);
Map.add(legend);

// // Zoom to the regression on the map
// Map.centerObject(boundary, 11);

// 检查模型性能
// 获取模型细节
var classifier_details = classifier.explain();

// 用重要度值解释分类器
var variable_importance = ee.Feature(null, ee.Dictionary(classifier_details).get('importance'));

var chart =
  ui.Chart.feature.byProperty(variable_importance)
  .setChartType('ColumnChart')
  .setOptions({
  title: 'Random Forest Variable Importance',
  legend: {position: 'none'},
  hAxis: {title: 'Bands'},
  vAxis: {title: 'Importance'}
});

// 绘制图表
print("Variable importance:", chart);

// 创建模型评估统计
// 在与训练数据相同的位置获取预测回归点
var predictedTraining = regression.sampleRegions({collection:trainingData, geometries: true});

// 将观测到的属性（agb_GEDI）和预测的属性（回归）分开
var sampleTraining = predictedTraining.select(['rh98', 'predicted']);

// 创建图表并输出
var chartTraining = ui.Chart.feature.byFeature(sampleTraining, 'rh98', 'predicted')
.setChartType('ScatterChart').setOptions({
title: 'Predicted vs Observed - Training data ',
hAxis: {'title': 'observed'},
vAxis: {'title': 'predicted'},
pointSize: 3,
trendlines: { 0: {showR2: true, visibleInLegend: true} ,
1: {showR2: true, visibleInLegend: true}}});
print(chartTraining);

// 计算RMSE均方根误差
// 获取观测值和预测值数组 
var observationTraining = ee.Array(sampleTraining.aggregate_array('rh98'));

var predictionTraining = ee.Array(sampleTraining.aggregate_array('predicted'));

// 计算残差
var residualsTraining = observationTraining.subtract(predictionTraining);

// 用方程计算均方根误差并打印结果
var rmseTraining = residualsTraining.pow(2).reduce('mean', [0]).sqrt();
print('Training RMSE', rmseTraining);

// ////////////////////////////////////////////////////////////////////////////////////////////////
// 进行验证
// 在与验证数据相同的位置获取预测回归点
var predictedValidation = regression.sampleRegions({collection:validationData, geometries: true});

// 分离观测（rh98）和预测（回归）属性
var sampleValidation = predictedValidation.select(['rh98', 'predicted']);

// 创建图表并输出
var chartValidation = ui.Chart.feature.byFeature(sampleValidation, 'predicted', 'rh98')
.setChartType('ScatterChart').setOptions({
title: 'Predicted vs Observed - Validation data',
hAxis: {'title': 'predicted'},
vAxis: {'title': 'observed'},
pointSize: 3,
trendlines: { 0: {showR2: true, visibleInLegend: true} ,
1: {showR2: true, visibleInLegend: true}}});
print(chartValidation);

// 计算 RMSE
// 获取观测值和预测值数组 
var observationValidation = ee.Array(sampleValidation.aggregate_array('rh98'));

var predictionValidation = ee.Array(sampleValidation.aggregate_array('predicted'));

// 计算残差
var residualsValidation = observationValidation.subtract(predictionValidation);

// 用方程计算 RMSE 并打印出来
var rmseValidation = residualsValidation.pow(2).reduce('mean', [0]).sqrt();
print('Validation RMSE', rmseValidation);


// ////////////////////////////////////////////////////////////////////////////////////////////////
// // 导出图像，指定比例和区域
// Export.image.toDrive({
//   image: regression,
//   description: 'Muf_TCH_GEDI_2021',
//   scale: 20,
//   crs: 'EPSG:32735', // EPSG:32735 (WGS 84 UTM Zone 35S)
//   maxPixels: 6756353855,
//   region: boundary
// });