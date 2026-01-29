// // 加载 Landsat 8 影像
// var image = ee.Image('LANDSAT/LC08/C01/T1_TOA/LC08_044034_20140318');

// Map.centerObject(image,9);

// // 选择水体掩模
// var waterMask = image.normalizedDifference(['B3', 'B5']).lt(0);
// print(waterMask);
// // 把小于0的区域掩膜掉了，水体是0，其他区域是1


// // 将水域区域赋值为 0，其余区域保持不变
// // updateMask是将非0的区域提取出来，not()是取反,add(0)无用
// var imageWithoutWater = image.updateMask(waterMask);
// print(imageWithoutWater);

// // 可视化结果
// Map.addLayer(image, {bands: ['B4', 'B3', 'B2'], max: 0.3}, 'Original image');
// Map.addLayer(waterMask, {max: 0.3}, 'waterMask image');

// Map.addLayer(imageWithoutWater, {bands: ['B4', 'B3', 'B2'], max: 0.3}, 'Image without water');

// print(waterMask);
// print(imageWithoutWater);

// 加载影像
var image = ee.Image('LANDSAT/LC08/C01/T1_TOA/LC08_044034_20140318');

// 将像元值为负值的像元赋值为0
var maskedImage = image.select('B5').updateMask(image.select('B5').gt(0));

Map.centerObject(maskedImage,6)
Map.addLayer(maskedImage);

// 打印原始影像和处理后的影像
print('Original Image:', image);
print('Masked Image:', maskedImage);