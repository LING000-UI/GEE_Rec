/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var table = ee.FeatureCollection("projects/ee-glj320104/assets/GPP_ROI/nj"),
    jia = ee.Image("projects/ee-glj320104/assets/jialilue/LuoJia1-01_LR201811232280_20181123142539_HDR_0015_gec"),
    urban = 
    /* color: #d63000 */
    /* shown: false */
    ee.Feature(
        ee.Geometry.MultiPolygon(
            [[[[118.79008493457253, 31.968259365510015],
               [118.79025659594949, 31.960977703010435],
               [118.79712305102761, 31.961123341919535],
               [118.79695138965066, 31.96505550515489],
               [118.80519113574441, 31.96505550515489],
               [118.80501947436746, 31.967968110097704]]],
             [[[118.88162441008083, 32.11018798665281],
               [118.88162441008083, 32.09833696339479],
               [118.88892001860134, 32.0981915425159],
               [118.88900584928982, 32.102335946837805],
               [118.89303989164821, 32.10262677516732],
               [118.89303989164821, 32.105825825667004],
               [118.88934917204372, 32.105898530057786],
               [118.88900584928982, 32.10996988355299]]],
             [[[118.79490766937604, 32.25184234544405],
               [118.795079330753, 32.248212876488665],
               [118.79971418793073, 32.248358058032096],
               [118.79902754242292, 32.24008233964779],
               [118.80932722504011, 32.239937144875775],
               [118.80915556366315, 32.244147699043744],
               [118.81756697113386, 32.24429288708566],
               [118.81688032562604, 32.246906232153584],
               [118.80932722504011, 32.247486965290115],
               [118.8086405795323, 32.25126164015958]]],
             [[[118.7921610873448, 32.271729259360924],
               [118.79284773285261, 32.26534269629991],
               [118.8005724948155, 32.265197541915626],
               [118.80040083343854, 32.27187440329737]]],
             [[[118.83232984955183, 32.2865327447851],
               [118.83181486542097, 32.288419289925635],
               [118.82014189178815, 32.288419289925635],
               [118.8199702304112, 32.285952261460885],
               [118.82374678070417, 32.286387624302414],
               [118.82426176483503, 32.28203390183106],
               [118.83044157440534, 32.28203390183106],
               [118.83044157440534, 32.28508152950733]]],
             [[[118.86617714371803, 31.742906603092557],
               [118.86514717545631, 31.739110946103853],
               [118.86137062516335, 31.738818966046633],
               [118.86137062516335, 31.73297917163218],
               [118.86652046647194, 31.731519165510278],
               [118.86652046647194, 31.72772304192596],
               [118.87441688981178, 31.728307071061234],
               [118.87441688981178, 31.73210317071979],
               [118.88299995865944, 31.732395171944184],
               [118.88299995865944, 31.737943020352795],
               [118.87613350358131, 31.739110946103853],
               [118.87338692155006, 31.742906603092557]]],
             [[[118.84180122819069, 31.73035114404829],
               [118.84180122819069, 31.72451081588981],
               [118.85004097428444, 31.72480284103931],
               [118.84901100602272, 31.73093515661974]]]]),
        {
          "class": 1,
          "system:index": "0"
        }),
    no_urban = 
    /* color: #06d31c */
    /* shown: false */
    ee.Feature(
        ee.Geometry.MultiPolygon(
            [[[[118.53846544462003, 32.079255309182734],
               [118.53297228055753, 32.06820035467759],
               [118.54533189969816, 32.06616376990304],
               [118.55048174100675, 32.069945962672406],
               [118.56696123319425, 32.068491291657374],
               [118.5645579739169, 32.07838259821547]]],
             [[[118.6913502486669, 32.06641357153393],
               [118.68242385706533, 32.05593901924207],
               [118.68688705286611, 32.05011930529173],
               [118.69066360315908, 32.050410299779884],
               [118.69856002649892, 32.054775106063346],
               [118.70370986780752, 32.059139704137884]]],
             [[[118.8451588424169, 32.07746874206262],
               [118.8396656783544, 32.06670451419802],
               [118.86575820765127, 32.063504093988165],
               [118.86541488489736, 32.07659601403939]]],
             [[[118.78700399138808, 32.19722009261796],
               [118.78640317656874, 32.19504111969828],
               [118.79232549407362, 32.19525901933817],
               [118.7935271237123, 32.1973653556241]]],
             [[[118.5960680046765, 31.96449852830178],
               [118.59246311576048, 31.97440106818139],
               [118.58499584586302, 31.97352735763106],
               [118.58439503104368, 31.965663588434165]]],
             [[[118.79786245626616, 32.19666357240651],
               [118.79494421285796, 32.19012645714657],
               [118.81056539816069, 32.18896425416442],
               [118.80764715475249, 32.196227779331416]]],
             [[[118.92693738634415, 31.495226710876977],
               [118.92779569322892, 31.479856298120406],
               [118.95371656114884, 31.5045941044529]]],
             [[[118.76363853331397, 31.930208858693383],
               [118.76432517882178, 31.922341380869078],
               [118.77496818419287, 31.925838120781087],
               [118.77016166563818, 31.93283120171335]]]]),
        {
          "class": 2,
          "system:index": "0"
        });
/***** End of imports. If edited, may not auto-convert in the playground. *****/
var roi = table;

// VIIRS夜间灯光
var VIIRS = ee.ImageCollection("NOAA/VIIRS/DNB/MONTHLY_V1/VCMSLCFG")
               .filterBounds(roi)
               .filterDate('2022-01-01','2022-12-31')
               .mean()
               .clip(roi)
               .select("avg_rad");


Map.addLayer(VIIRS,{max:400,min:0},'VIIRS',0);

// 定义样本
var NDVI = ee.ImageCollection("MODIS/061/MOD13Q1")
            .filterBounds(roi)
            .filterDate('2022-01-01','2022-12-31') 
            .max()
            .clip(roi)
            .select('NDVI');
            


Map.addLayer(NDVI,{},"NDVI",0);


var LST = ee.ImageCollection("JAXA/GCOM-C/L3/LAND/LST/V3")
               .filterBounds(roi)
               .filterDate('2022-01-01','2022-12-31')
               .mean()
               .clip(roi)
               .select("LST_AVE");

Map.addLayer(LST,{palette:['blue','green','red']},'LST',0);


// 计算平局值
var VIIRS_mean = VIIRS.reduceRegion({
  reducer: ee.Reducer.mean(),
  geometry: roi,
  scale: 463.83,        
  bestEffort: true,      
  maxPixels:1e10,        
  tileScale:4           
}).get('avg_rad');

print(VIIRS_mean);

var NDVI_mean = NDVI.reduceRegion({
  reducer: ee.Reducer.mean(),
  geometry: roi,
  scale: 10,        
  bestEffort: true,      
  maxPixels:1e10,        
  tileScale:4           
}).get('NDVI');

print(NDVI_mean);

var LST_mean = LST.reduceRegion({
  reducer: ee.Reducer.mean(),
  geometry: roi,
  scale: 4638.3,        
  bestEffort: true,      
  maxPixels:1e10,        
  tileScale:4           
}).get('LST_AVE');

print(LST_mean);

// 计算标准差


var VIIRS_std = VIIRS.reduceRegion({
  reducer: ee.Reducer.stdDev(),
  geometry: roi,
  scale: 463.83,        
  bestEffort: true,      
  maxPixels:1e10,        
  tileScale:4           
}).get('avg_rad');

print(VIIRS_std);

var NDVI_std = NDVI.reduceRegion({
  reducer: ee.Reducer.stdDev(),
  geometry: roi,
  scale: 10,        
  bestEffort: true,      
  maxPixels:1e10,        
  tileScale:4           
}).get('NDVI');

print(NDVI_std);

var LST_std = LST.reduceRegion({
  reducer: ee.Reducer.stdDev(),
  geometry: roi,
  scale: 4638.3,        
  bestEffort: true,      
  maxPixels:1e10,        
  tileScale:4           
}).get('LST_AVE');

print(LST_std);

// 计算T

// var VIIRS_T = VIIRS_mean * VIIRS_mean + VIIRS_std / 2;
// var NDVI_T = NDVI_mean * NDVI_mean - NDVI_std / 2;
// var LST_T = LST_mean + LST_std / 2;




var VIIRS_T = 8.149 * 8.149 + 12.689 / 2;
var NDVI_T = 6583.840 * 6583.840 - 1627.337 / 2;
var LST_T = 14584.009 + 34.259 / 2;


print(VIIRS_T);
print(NDVI_T);
print(LST_T);

// 样本标准
var brochure = ee.Image(0).clip(roi);


brochure = brochure.where(VIIRS.gt(VIIRS_T).and(NDVI.lt(NDVI_T)).and(LST.gt(LST_T)),1);
brochure = brochure.where(VIIRS.lt(VIIRS_T).and(NDVI.gt(NDVI_T)).and(LST.lt(LST_T)),0);



// print(brochure);
Map.addLayer(brochure,{},'brochure',0);

// 根据样本进行分类
var sen_img = ee.ImageCollection("COPERNICUS/S2_SR")
                .filterBounds(roi)
                .filterDate("2022-01-01","2022-12-31")
                .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE',10))
                .sort('CLOUDY_PIXEL_PERCENTAGE')
                .median()
                .clip(roi);

var bands = ['B1','B2','B3','B4','B5','B6','B7','B8','B8A','B9','B11','B12'];
var sen_img = sen_img.select(bands);
Map.addLayer(sen_img, {bands: ['B4', 'B3','B2'],min: 0, max: 10000,gamma:3,opacity:1},'sen_img');

var polyon = ee.FeatureCollection([urban,no_urban]);


var points = sen_img.sampleRegions({
  collection:polyon,
  properties:['class'],
  scale:30,
  tileScale:4
});

print(points.size());

var split = function(data,number){
  var tr = data.randomColumn('random', 555) ;
  var train = ee.FeatureCollection([]);
  var test = ee.FeatureCollection([]);
  for(var i =1;i<=2;i++){
    var cate = tr.filter(ee.Filter.eq("class",i)).limit(number,"random");
    var cate_tr = cate.limit(number*0.8,"random",false);
    var cate_test = cate.limit(number*0.2,"random",true);
    train = train.merge(cate_tr);
    test = test.merge(cate_test);
  }
  return [train,test];
};

var train_test = split(points, 4000);

var train = train_test[0];
var test = train_test[1];

print("train",train.size());
print("test",test.size());

var figure_histogram = function(points){
  var histogram = ui.Chart.feature.histogram({
    features:points,
    property:'class',
    minBucketWidth:1,
    maxBuckets:3,
  }).setOptions({
    legend: {'position': 'none' },
    title: 'counts of different categories',
    hAxis: {'title': 'categories'},
    vAxis: {'title': 'counts'},
  });
  print(histogram);
  return histogram;
};


// 训练数据
figure_histogram(train);

// 验证数据
figure_histogram(test);

// 用默认的参数训练SVM模型
var trained = ee.Classifier.libsvm().train(train,'class',bands);

// 对图像进行分类
var classified = sen_img.classify(trained);
Map.addLayer(classified, {min: 1, max: 2, palette: ['black', 'white']}, 'classified');

// 验证模型
var validated = test.classify(trained);
var testAccuracy = validated.errorMatrix('class', 'classification');
var accuracy = testAccuracy.accuracy();
var userAccuracy = testAccuracy.consumersAccuracy();
var producersAccuracy = testAccuracy.producersAccuracy();
var kappa = testAccuracy.kappa();
print('Validation error matrix: ', testAccuracy);
print('Validation overall accuracy: ', accuracy);
print('User acc: ', userAccuracy);
print('Prod acc: ', producersAccuracy);
print('Kappa: ', kappa);






// -----------------------------------------------------------------------------------------------------------------------
// ESRI城市范围
var esri_lulc_ts= ee.ImageCollection("projects/sat-io/open-datasets/landcover/ESRI_Global-LULC_10m_TS");
var ESRI_ROI_landcover = esri_lulc_ts.filterDate('2022-01-01','2022-12-31').mosaic().clip(roi);
var ESRI = ESRI_ROI_landcover.updateMask(ESRI_ROI_landcover.eq(7));
Map.addLayer(ESRI,{palette:'red'},"ESRI");


// 伽利略夜间灯光
var jiaImage = jia.clip(roi);
var JIA = jiaImage.updateMask(jiaImage.gte(20000));
// Map.addLayer(JIA,{palette:'cyan'},"JIA");
