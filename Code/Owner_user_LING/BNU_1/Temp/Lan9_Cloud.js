/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var geometry = 
    /* color: #d63000 */
    /* shown: false */
    ee.Geometry.Point([121.64795985478224, 31.8079836795054]),
    table = ee.FeatureCollection("projects/ee-glj320104/assets/yuan");
/***** End of imports. If edited, may not auto-convert in the playground. *****/

/**/

// 使用QA波段进行去云（√😋）
// 加载Landsat 9 Collection 2 Tier 1 Raw Scenes
var landsat9 = ee.ImageCollection("LANDSAT/LC09/C02/T1").filterBounds(geometry);

// 定义一个函数来掩码云
function maskClouds(image) {
  // 获取QA_PIXEL波段
  var qa = image.select('QA_PIXEL');
  // 位掩码，掩掉云和阴影
  var cloudMask = qa.bitwiseAnd(1 << 3).eq(0)
                    .and(qa.bitwiseAnd(1 << 4).eq(0));
  return image.updateMask(cloudMask);
}

// 应用掩码函数

var landsat9org = landsat9.filterBounds(geometry).first();
var landsat9Masked = landsat9.filterBounds(geometry).map(maskClouds).first();

// 可视化
var visParams = {
  bands: ['B4', 'B3', 'B2'],
  min: 6000,
  max: 14000,
};
Map.centerObject(landsat9Masked, 8);
Map.addLayer(landsat9org, visParams, 'landsat9org');
Map.addLayer(landsat9Masked, visParams, 'Landsat 9 with Cloud Mask');





/*
// 加载Landsat 9 Collection 2 Tier 1 Raw Scenes (DN值)
var landsat9DN = ee.ImageCollection("LANDSAT/LC09/C02/T1").filterBounds(geometry);

// 加载Landsat 9 Collection 2 Tier 1 表面反射率 (TOA)
var landsat9TOA = ee.ImageCollection("LANDSAT/LC09/C02/T1_TOA").filterBounds(geometry);

// 定义一个函数来计算云分数并掩盖云
function getCloudMask(image) {
  var cloudScore = ee.Algorithms.Landsat.simpleCloudScore(image).select('cloud');
  var cloudMask = cloudScore.lt(50);  // 设置云分数阈值
  return cloudMask.rename('cloudMask').set('system:index', image.get('system:index'));
}

// 计算表面反射率图像集合中的云掩码
var cloudMaskedTOA = landsat9TOA.map(function(image) {
  return image.addBands(getCloudMask(image));
});

// 定义一个函数来应用云掩码到DN值图像集合
function applyCloudMaskToDN(image) {
  var index = image.get('system:index');
  var correspondingTOA = cloudMaskedTOA.filter(ee.Filter.eq('system:index', index)).first();
  var cloudMask = correspondingTOA.select('cloudMask');
  return image.updateMask(cloudMask);
}

// 应用云掩码函数
var landsat9MaskedDN = landsat9DN.map(applyCloudMaskToDN);

// 可视化
var visParams = {
  bands: ['B4', 'B3', 'B2'],
  min: 0,
  max: 30000,
};

print(landsat9MaskedDN.first());

Map.centerObject(landsat9DN.first(), 8);
Map.addLayer(landsat9DN.first(), visParams, 'Landsat 9 DN',0);
Map.addLayer(landsat9MaskedDN.first(), visParams, 'Landsat 9 DN with Cloud Mask');
*/








/*

// 加载Landsat 9 Collection 2 Tier 1 Raw Scenes (DN值)
var landsat9DN = ee.ImageCollection("LANDSAT/LC09/C02/T1").filterBounds(geometry)

// 加载Landsat 9 Collection 2 Tier 1 表面反射率 (TOA)
var landsat9TOA = ee.ImageCollection("LANDSAT/LC09/C02/T1_TOA").filterBounds(geometry)

// 定义一个函数来计算云掩码
function getCloudMask(image) {
  var qa = image.select('QA_PIXEL');
  // 获取云掩码：bit 3 和 bit 5
  var cloudMask = qa.bitwiseAnd(1 << 3).eq(0).and(qa.bitwiseAnd(1 << 4).eq(0));
  return image.addBands(cloudMask.rename('cloudMask')).set('system:index', image.get('system:index'));
}

// 计算表面反射率图像集合中的云掩码
var cloudMaskedTOA = landsat9TOA.map(function(image) {
  return getCloudMask(image);
});

// 定义一个函数来应用云掩码到DN值图像集合
function applyCloudMaskToDN(image) {
  var index = image.get('system:index');
  var correspondingTOA = cloudMaskedTOA.filter(ee.Filter.eq('system:index', index)).first();
  var cloudMask = correspondingTOA.select('cloudMask');
  return image.updateMask(cloudMask);
}

// 应用云掩码函数
var landsat9MaskedDN = landsat9DN.map(applyCloudMaskToDN);

// 可视化
var visParams = {
  bands: ['B4', 'B3', 'B2'],
  min: 0,
  max: 30000,
};
Map.centerObject(landsat9DN.first(), 8);
Map.addLayer(landsat9DN.first(), visParams, 'Landsat 9 DN');
Map.addLayer(landsat9MaskedDN.first(), visParams, 'Landsat 9 DN with Cloud Mask');
*/











/*
// 加载Landsat 9 Collection 2 Tier 1 地表反射率数据
var landsat9SR = ee.ImageCollection("LANDSAT/LC08/C02/T1_L2").filterBounds(geometry);

// 加载Landsat 9 Collection 2 Tier 1 原始DN值数据
var landsat9DN = ee.ImageCollection("LANDSAT/LC08/C02/T1").filterBounds(geometry);

// 定义一个函数来计算云掩码
function getCloudMask(image) {
  var qa = image.select('QA_PIXEL');
  
  // 定义云掩码
  var cloudShadowBitMask = 1 << 3;  // 阴影掩码
  var cloudsBitMask = 1 << 4;  // 云掩码
  
  // 创建云掩码
  var mask = qa.bitwiseAnd(cloudShadowBitMask).eq(0)
                .and(qa.bitwiseAnd(cloudsBitMask).eq(0));
  
  // 返回云掩码
  return mask;
}

// 应用掩码函数到地表反射率数据集以获取掩码集合
var cloudMaskedSR = landsat9SR.map(function(image) {
  var mask = getCloudMask(image);
  return image.updateMask(mask).set('system:index', image.get('system:index'));
});

// 使用相同的掩码集合来掩膜原始DN值数据集
var cloudMaskedDN = landsat9DN.map(function(image) {
  // 使用系统索引进行匹配
  var index = image.get('system:index');
  var correspondingSR = cloudMaskedSR.filter(ee.Filter.eq('system:index', index)).first();
  if (correspondingSR) {
    var mask = correspondingSR.select('QA_PIXEL').mask().reduce(ee.Reducer.min());
    return image.updateMask(mask);
  } else {
    return image;
  }
});

// 可视化参数
var visParams = {
  bands: ['B4', 'B3', 'B2'],  // 使用红、绿、蓝波段
  min: 0,
  max: 3000,
};

// 将掩膜后的DN值影像添加到地图
Map.centerObject(cloudMaskedDN.first(), 8);
Map.addLayer(landsat9DN.first(), visParams, 'Landsat 9 Original');
Map.addLayer(cloudMaskedDN.first(), visParams, 'Landsat 9 DN with Cloud Mask');*/