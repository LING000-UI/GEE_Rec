


/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var roi = 
    /* color: #d67a7a */
    /* shown: false */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[118.74872133562678, 32.06882404998605],
          [118.74872133562678, 32.019060557777856],
          [118.90115663836116, 32.019060557777856],
          [118.90115663836116, 32.06882404998605]]], null, false);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
Map.centerObject(roi,12);
var l4b = ee.Image('LARSE/GEDI/GEDI04_B_002');
/*GEDI的4级产品为全球的生物量的估计，全球一景*/
var dataset = l4b.select('MU').clip(roi);//选取平均生物量字段
print("the dataset:",dataset);
//投影                  
var dataset = dataset.reproject({crs: 'EPSG:4326', scale: 100});
// 检查投影信息                
print('Projection, crs, and crs_transform:', dataset.projection());
// 在图上显示GEDI数据
Map.addLayer(dataset,
    {min: 10, max: 250, palette: '440154,414387,2a788e,23a884,7ad151,fde725'},
    'Mean Biomass');
// 训练样本选择
var points = dataset.sample({
  region: roi,
  scale: 100,
  numPixels: 1000, 
  geometries: true});
// 打印信息
print(points.size());
print(points.limit(10));
Map.addLayer(points);




/*加载2种SAR数据*/
var dataset = ee.ImageCollection('JAXA/ALOS/PALSAR/YEARLY/SAR')
  .filter(ee.Filter.date('2018-10-30', '2020-10-30'));
var sarHh = dataset.select('HH');
var sarHv = dataset.select('HV');
var sarHh2Vis = {
  min: 0.0,
  max: 10000.0,
};
var sarHv2Vis = {
  min: 0.0,
  max: 10000.0,
};
var clipImage = function(image) {
  return image.clip(roi);
};
var HH = sarHh.map(clipImage);
var HV = sarHv.map(clipImage);
Map.addLayer(HH, sarHh2Vis, 'SAR HH (clipped)');
Map.addLayer(HV, sarHv2Vis, 'SAR HV (clipped)');
var HH = HH.first();
var HV = HV.first();
//加载Sentinel-1 SAR数据
var S1 =  ee.ImageCollection('COPERNICUS/S1_GRD')
.filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VH'))
.filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VV'))
.filter(ee.Filter.eq('instrumentMode', 'IW'))
.filterBounds(roi)
.filterDate('2018-10-30', '2020-10-30')
.select(['VV','VH']);
//对SAR数据的预处理进行转db值，应用滤波算法，其中还包括图像运算、核函数应用、均值计算、方差计算、梯度计算等等。下图显示了一张应用预处理完的PALSAR-2 HV极化方式的图像



/*加载Sentinel-2数据以及其他辅助数据（SRTM-DEM、降水量数据、森林掩模数据以及森林类型数据）*/
//加载SRTM-DEM,裁剪SRTM-DEM,投影重采样，计算坡度,投影坡度
var SRTM = ee.Image("USGS/SRTMGL1_003");
var elevation = SRTM.clip(roi);
var elevation = elevation.reproject({crs: 'EPSG:32749',scale: 30}); 
print('Projection, crs, and crs_transform:', elevation.projection());
var slope = ee.Terrain.slope(SRTM).clip(roi);
var slope = slope.reproject({crs: 'EPSG:32749',scale: 30}); 
print('Projection, crs, and crs_transform:', slope.projection());
//加载森林掩模数据
var dataset = ee.ImageCollection("ESA/WorldCover/v100").first();
var ESA_LC_2020 = dataset.clip(roi);
var forest_mask = ESA_LC_2020.updateMask(
  ESA_LC_2020.eq(10) );
var trees = {bands: ['Map'],};
Map.addLayer(forest_mask, trees, "Trees");
//加载均降水量数据，并裁剪到感兴趣区域
var dataset = ee.ImageCollection('UCSB-CHG/CHIRPS/DAILY')
  .filter(ee.Filter.date('2018-10-30', '2020-10-30'));
var precipitation = dataset.select('precipitation');
var clippedPrecipitation = precipitation.map(function(image) {
  return image.clip(roi);
});
var rainMean = clippedPrecipitation.mean();
//加载森林类型数据(常绿林、落叶林、混交林)
var dataset = ee.Image('COPERNICUS/Landcover/100m/Proba-V-C3/Global/2019')
  .select('discrete_classification');
var foresttype = dataset.clip(roi);
// Map.centerObject(roi, 10); 
Map.addLayer(foresttype, {}, 'Clipped Land Cover');
//加载Sentinel-2多光谱数据
var s2 = ee.ImageCollection("COPERNICUS/S2_SR");
var filtered = s2
  .filter(ee.Filter.date('2018-10-30', '2020-10-30'))
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE',10))
  .filter(ee.Filter.bounds(roi));
//对哨兵2的预处理包括了去云和中值合成等。下图显示了一张森林掩模图和森林类型图


/*中值合成以及参数运算*/
///哨兵1及PALSAR-2极化组合特征计算//
//1.vv+vh
var VVProductVH = combinedband.expression('VV+VH', {
    'VV' : combinedband.select('VV'),
    'VH' : combinedband.select('VH')
  }).rename('VVProductVH');
//2.vh-vv
var VHQuotientVV = combinedband.expression('VH-VV', {
    'VV' : combinedband.select('VV'),
    'VH' : combinedband.select('VH')
  }).rename('VHQuotientVV');
//3.HH/HV
var HHHV = combinedband.expression('HH/HV', {
    'HH' : combinedband.select('HH'),
    'HV' : combinedband.select('HV')
  }).rename('HH/HV');

///哨兵2植被指数计算//
//1. RVI
var rvi = combinedband.expression('NIR / RED', {
    'NIR' : combinedband.select('B8'),
    'RED' : combinedband.select('B4')
  }).rename('rvi');
//2. DVI
var dvi = combinedband.expression('NIR - RED', {
    'NIR' : combinedband.select('B8'),
    'RED' : combinedband.select('B4')
  }).rename('dvi');
//4.SAVI
var savi = combinedband.expression(
    '1.5 * (NIR - RED) /8* (NIR + RED + 0.5)', {
      'NIR': combinedband.select('B8').multiply(0.0001),
      'RED': combinedband.select('B4').multiply(0.0001),
}).rename('savi');
//5.MTCI
var mtci = combinedband.expression('(RE2 - RE1)/ (RE1 - Red)', {
    'RE2': combinedband.select('B6'),
    'RE1': combinedband.select('B5'),
     'Red': combinedband.select('B4'),
    }).rename('mtci');
//6.GNDVI
var gndvi =combinedband.expression('(RE3-Green)/(RE3+Green)', {
    'RE3': combinedband.select('B7').multiply(0.0001),
    'Green': combinedband.select('B3').multiply(0.0001),
    }).rename('gndvi');
//7.WDVI
var wdvi =combinedband.expression('NIR - 0.5*RED',{
    'NIR': combinedband.select('B8').multiply(0.0001),
    'RED': combinedband.select('B4').multiply(0.0001),
     }).rename('wdvi'); 
//8.IPVI
var ipvi=combinedband.expression('NIR/(NIR + RED )',{
    'NIR': combinedband.select('B8').multiply(0.0001),
    'RED': combinedband.select('B4').multiply(0.0001),
     }).rename('ipvi'); 
//9.NDI45
var ndi45 =combinedband.expression('(RE1-RED)/(RE1+RED)',{
    'RE1': combinedband.select('B5'),
     'RED': combinedband.select('B4'),
    }).rename('ndi45');
//10.IRECI
var ireci =combinedband.expression('(RE3-RED)/(RE1/RE2)',{
    'RE3': combinedband.select('B7'),
    'RED': combinedband.select('B4'),
    'RE1': combinedband.select('B5'),
    'RE2': combinedband.select('B6'),
}).rename('ireci'); 
//11.TSAVI
var tsavi =combinedband.expression('0.5* (NIR - 0.5*RED-0.5) / (0.5*NIR + RED -0.15 )',{
    'NIR': combinedband.select('B8').multiply(0.0001),
    'RED': combinedband.select('B4').multiply(0.0001),
}).rename('tsavi');

//12.ARVI
var arvi =combinedband.expression('(NIR-(2*RED-BLUE))/(NIR+(2*RED-BLUE))',{
    'NIR': combinedband.select('B8').multiply(0.0001),
    'RED': combinedband.select('B4').multiply(0.0001),
    'BLUE':combinedband.select('B2').multiply(0.0001),
}).rename('arvi');
//PALSAR-2纹理特征
var SS = s2bands.select('HH', 'HV').toInt32().glcmTexture().select(p2Bands);
//参数的计算包括了很多种，常用的植被指数以及纹理地形因子等等，以上只展示了部分运算。


/*调用GEE的随机森林分类器并显示重要性以及拟合精度等*/
//运行 RF 分类器
var classifier = ee.Classifier.smileRandomForest(100, null, 1, 0.5, null, 0).setOutputMode('REGRESSION')
    .train({
      features: trainingData, 
      classProperty: 'MU', 
      inputProperties: bands
    });
print(classifier);
//创建的分类器对图像进行分类
var regression = selectbands.classify(classifier, 'predicted');
print(regression);
//创建图例的结构和其他美化细节


// Create the panel for the legend items.
var legend = ui.Panel({
  style: {
    position: 'bottom-left',
    padding: '8px 15px'
  }
});

// Create and add the legend title.
var legendTitle = ui.Label({
  value: 'Legend',
  style: {
    fontWeight: 'bold',
    fontSize: '18px',
    margin: '0 0 4px 0',
    padding: '0'
  }
});
legend.add(legendTitle);

// create the legend image
var lon = ee.Image.pixelLonLat()
  .select('latitude');
var gradient = lon.multiply((viz.max - viz.min) / 100.0)
  .add(viz.min);
var legendImage = gradient.visualize(viz);

// create text on top of legend
var panel = ui.Panel({
  widgets: [
    ui.Label(viz['max'])
  ],
});

legend.add(panel);

// create thumbnail from the image
var thumbnail = ui.Thumbnail({
  image: legendImage,
  params: {
    bbox: '0,0,10,100',
    dimensions: '10x200'
  },
  style: {
    padding: '1px',
    position: 'bottom-center'
  }
});

// add the thumbnail to the legend
legend.add(thumbnail);

// create text on top of legend
var panel = ui.Panel({
  widgets: [
    ui.Label(viz['min'])
  ],
});

legend.add(panel);
Map.add(legend);

// Zoom to the regression on the map
Map.centerObject(roi, 11);
//可视化评估工具
// Get variable importance
var dict = classifier.explain();
print("Classifier information:", dict);
var variableImportance = ee.Feature(null, ee.Dictionary(dict)
  .get('importance'));
// Make chart, print it
var chart =
  ui.Chart.feature.byProperty(variableImportance)
  .setChartType('ColumnChart')
  .setOptions({
    title: 'Random Forest Variable Importance',
    legend: {
      position: 'none'
    },
    hAxis: {
      title: 'Bands'
    },
    vAxis: {
      title: 'Importance'
    }
  });
print(chart);
//直方图
var options = {
  lineWidth: 1,
  pointSize: 2,
  hAxis: {
    title: 'Redox (cm)'
  },
  vAxis: {
    title: 'Num of pixels'
  },
  title: 'Number of pixels by redox depth'
};
var regressionPixelChart = ui.Chart.image.histogram({
    image: ee.Image(regression),
    region: roi,
    scale:100
  })
  .setOptions(options);
print(regressionPixelChart);
//预测值和真实值的散点图

// Get predicted regression points in same location as training data
var predictedTraining = regression.sampleRegions({
  collection: trainingData,
  scale:100,
  geometries: true,
  projection:'EPSG:4326'
});
// Separate the observed (canopy) and predicted (regression) properties
var sampleTraining = predictedTraining.select(['MU', 'predicted']);
// Create chart, print it
var chartTraining = ui.Chart.feature.byFeature({features:sampleTraining, xProperty:'MU', yProperties:['predicted']})
  .setChartType('ScatterChart')
  .setOptions({
    title: 'Predicted vs Observed - Training data ',
    hAxis: {
      'title': 'observed'
    },
    vAxis: {
      'title': 'predicted'
    },
    pointSize: 3,
    trendlines: {
      0: {
        showR2: true,
        visibleInLegend: true
      },
      1: {
        showR2: true,
        visibleInLegend: true
      }
    }
  });
print(chartTraining);
//计算均方根误差 (RMSE)

// Get array of observation and prediction values 
var observationTraining = ee.Array(sampleTraining.aggregate_array('MU'));
var predictionTraining = ee.Array(sampleTraining.aggregate_array('predicted'));
print('observationTraining', observationTraining)
print('predictionTraining', predictionTraining)
var residualsTraining = observationTraining.subtract(predictionTraining);
print('residualsTraining', residualsTraining)
// Compute RMSE with equation, print it
var rmseTraining = residualsTraining.pow(2)
  .reduce('mean', [0])
  .sqrt();
print('Training RMSE', rmseTraining);
//验证数据执行类似的评估，以了解我们的模型在未用于训练它的数据上的表现如何
var predictedValidation = regression.sampleRegions({
  collection: validationData,
  scale:100,
  geometries: true
});
// Separate the observed (canopy) and predicted (regression) properties
var sampleValidation = predictedValidation.select(['MU', 'predicted']);
// Create chart, print it 
var chartValidation = ui.Chart.feature.byFeature(sampleValidation, 'predicted', 'MU')
  .setChartType('ScatterChart')
  .setOptions({
    title: 'Predicted vs Observed - Validation data',
    hAxis: {
      'title': 'predicted'
    },
    vAxis: {
      'title': 'observed'
    },
    pointSize: 3,
    trendlines: {
      0: {
        showR2: true,
        visibleInLegend: true
      },
      1: {
        showR2: true,
        visibleInLegend: true
      }
    }
  });
print(chartValidation);

var observationValidation = ee.Array(sampleValidation.aggregate_array('MU'));
var predictionValidation = ee.Array(sampleValidation.aggregate_array('predicted'));

var residualsValidation = observationValidation.subtract(predictionValidation);
// Compute RMSE with equation, print it
var rmseValidation = residualsValidation.pow(2)
  .reduce('mean', [0])
  .sqrt();
print('Validation RMSE', rmseValidation);
