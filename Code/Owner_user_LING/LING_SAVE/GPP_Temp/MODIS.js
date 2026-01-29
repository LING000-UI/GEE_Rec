

/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var nj = 
    /* color: #d63000 */
    /* shown: false */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[118.33514711424176, 32.628241459231944],
          [118.33514711424176, 31.209054104357577],
          [119.43605841092652, 31.209054104357577],
          [119.43605841092652, 32.628241459231944]]], null, false),
    MOD = ee.ImageCollection("MODIS/061/MOD09A1"),
    njp = ee.FeatureCollection("projects/ee-glj320104/assets/GPP_ROI/nj");
/***** End of imports. If edited, may not auto-convert in the playground. *****/
njp = njp.geometry();


// 8月的影像
var img8 = ee.ImageCollection(MOD)
    .filterBounds(njp)
    .filterDate('2022-08-01','2022-09-01')
    // .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE',100))
    // .sort('CLOUDY_PIXEL_PERCENTAGE')
    .mosaic()
    .clip(njp);


// 12月份的影像
var img12 = ee.ImageCollection(MOD)
    .filterBounds(njp)
    .filterDate('2022-11-20','2023-01-01')
    // .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE',100))
    // .sort('CLOUDY_PIXEL_PERCENTAGE')
    .mosaic()
    .clip(njp);

// 顺序月份的影像，用于计算不同月份的NDVI和NIRV
var imgn = ee.ImageCollection(MOD)
    .filterBounds(njp)
    .filterDate('2022-01-01','2022-02-01')
    // .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE',100))
    // .sort('CLOUDY_PIXEL_PERCENTAGE')
    .mosaic()
    .clip(njp);

// 加载真彩色影像

print(img8);

img8 = img8
    .select('sur_refl_b01','sur_refl_b04','sur_refl_b03','sur_refl_b02')
    .rename('red','green','blue','nir');


img12 = img12
    .select('sur_refl_b01','sur_refl_b04','sur_refl_b03','sur_refl_b02')
    .rename('red','green','blue','nir');

imgn = imgn
    .select('sur_refl_b01','sur_refl_b04','sur_refl_b03','sur_refl_b02')
    .rename('red','green','blue','nir');

Map.centerObject(njp,9);

Map.addLayer(imgn,{bands:['red','green','blue']},'imgn');
Map.addLayer(img8,{bands:['red','green','blue']},"img8_true", 0);
Map.addLayer(img12,{bands:['red','green','blue']},"img12_true", 0);


// 计算8/12月份NDVI,同时为结果值重命名
var ndvi8 = img8
    .normalizedDifference(['nir','red']).rename('ndvi8');

var ndvi12 = img12
    .normalizedDifference(['nir','red']).rename('ndvi12');

var ndvin = imgn
    .normalizedDifference(['nir','red']).rename('ndvin');
// ????建筑和非建筑的分类????


// 显示NDVI和真彩色
var pal = ['1666ff','7296ff','72ffa5','fffb4f','ffb453','ff0e00'];  // 蓝到红



Map.addLayer(ndvi8, {palette:pal}, "ndvi8", 0);
Map.addLayer(ndvi12, {palette:pal}, "ndvi12", 0);


// 植被类型分类
// 创建一个值为1的起始图像（阈值上限）
var type = ee.Image(0).clip(njp);

// C1值为ndvi8
// C2值为内层计算公式
var C2 = (ndvi8.subtract(ndvi12)).divide(ndvi8);

// 根据8/12月份的NDVI数据进行植被分类,都按照C2来计算

var type = type.where(ndvi8.lt(0.2),1);
var type = type.where(ndvi8.gte(0.2).and(ndvi8.lte(0.5)),2);
var type = type.where(ndvi8.gte(0.5).and(ndvi8.lte(1))
    .and(C2.gt(0.35)),3);
var type = type.where(ndvi8.gte(0.5).and(ndvi8.lte(1))
    .and(C2.gt(0.2).and(C2.lt(0.35))),4);
var type = type.where(ndvi8.gte(0.5).and(ndvi8.lte(1))
    .and(C2.lt(0.2)),5);

// 加载植被分类图像
Map.addLayer(type,{palette:pal},'type',0);


// 精度验证,验证植被类型


// 计算NIRV,同时为结果值重命名,可以直接重命名
var nirv = ndvin
    .multiply(imgn.select('nir'))
    .multiply(0.0001)
    .rename('nirv');


// 加载NIRV数据
Map.addLayer(nirv,{palette:pal},'NIRV',0);

// 计算GPP
var gpp = ee.Image(1).clip(njp);

var gpp = gpp.where(type.eq(1).or(type.eq(0)),0);
var gpp = gpp.where(type.eq(2),nirv.multiply(68.13).subtract(1.62));
var gpp = gpp.where(type.eq(3),nirv.multiply(64.07).subtract(2.20));
var gpp = gpp.where(type.eq(4),nirv.multiply(59.49).subtract(2.93));
var gpp = gpp.where(type.eq(5),nirv.multiply(44.50).subtract(2.60));

// njp = njp.geometry();
// gpp = gpp.clip(njp);
Map.addLayer(gpp,{palette:pal},'gpp',0);

// mndwi的计算
// var waterpalette = ['green','white','blue']
// var mndwi = img8.normalizedDifference(['green','swir']);
// Map.addLayer(mndwi,{palette:waterpalette,min:-0.5,
//   max:1,},'mndwi');


Export.image.toDrive({
image:gpp, //分类结果
description:'mod_gpp1', //文件名
//folder: //云盘中的文件夹
scale: 10, //分辨率
//region: roi, //区域
maxPixels:34e10 //此处值设置大一些，防止溢出
});

Export.image.toDrive({
image:nirv, //分类结果
description:'mod_nirv1', //文件名
//folder: //云盘中的文件夹
scale: 10, //分辨率
//region: roi, //区域
maxPixels:34e10 //此处值设置大一些，防止溢出
});
