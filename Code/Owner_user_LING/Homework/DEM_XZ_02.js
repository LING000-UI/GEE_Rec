/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var image = ee.Image("projects/ee-glj320104/assets/Home_work/xzDEM"),
    table = ee.FeatureCollection("projects/ee-glj320104/assets/Home_work/njxz_roi"),
    image2 = ee.Image("projects/ee-glj320104/assets/Home_work/xzRGB");
/***** End of imports. If edited, may not auto-convert in the playground. *****/
var roi = table;
var dem_xz = image.clip(roi);
var viz = {min:0,max:16};
var rgb_xz = image2.clip(roi);

Map.centerObject(roi,15);
Map.addLayer(dem_xz,viz,"DEM",0);
Map.addLayer(rgb_xz,{},"RGB");
print(dem_xz);

var temp = ee.Image(10.5).clip(roi);


//// !!!插补缺失值
// dem_xz = dem_xz.where(dem_xz.eq(null),10.5);
// Map.addLayer(dem_xz,{min:0,max:16},"DEM_m");

// 融合
// var dem_xz_b =temp.blend(dem_xz);
// print(dem_xz_b);
// print(dem_xz_b.bandNames());
// Map.addLayer(dem_xz_b,{min:0,max:16},"DEM_b");


// unmask插补缺失值
var dem_xz_f = dem_xz.unmask(10.5).clip(roi);
Map.addLayer(dem_xz_f,viz,"DEM_f",0);

// 获取影像的分辨率
var projection = dem_xz_f.projection();
var resolution = projection.nominalScale();
print('影像分辨率:', resolution);

// export
Export.image.toDrive({
                    image:dem_xz_f, 
                    description:'DEM_F', 
                    scale:1, //分辨率
                    region:roi, //区域
                    maxPixels:1e13 //此处值设置大一些，防止溢出
                    });
                    
                    
                    
// --------------------------------------------显示contour--------------------------------------------
//加载数据

//设置等高线间距0-4000米，间隔100米一个线
var lines = ee.List.sequence(9.5, 500, 2000);

//高斯滤波计算每一个高度的等高线，输出一个影像列表
var contourlines = lines.map(function(line) {
  var mycontour = dem_xz_f
    .convolve(ee.Kernel.gaussian(5, 3))
    .subtract(ee.Image.constant(line)).zeroCrossing() 
    .multiply(ee.Image.constant(line)).toFloat();
    
  return mycontour.mask(mycontour);
});


// 转换为ImageCollection
var contour_collection = ee.ImageCollection(contourlines);
print(contour_collection);

var first_contour = contour_collection.first();
Map.addLayer(first_contour,{palette:'red'},"F1",0);

//将等高线列表转换成影像集合，再转换成影像
var all_contour = contour_collection.mosaic();
//可视化
Map.addLayer(all_contour, {min: 0, max: 5000, palette:['#2bd666', '#31d6a8', '#9156a3', '#d6462b']}, 'contours',0);




// // 栅格转矢量函数
// function Tovector(img){
//   var max_pool = img.multiply(10).toInt().reduceToVectors({
//           reducer: ee.Reducer.countEvery(), 
//           geometry: roi, 
//           scale: 1,
//           maxPixels: 1e13});
//   return max_pool;
// }


// 计算面积函数
function cal_area(f0) {
    var areakm = f0.area(1);
    var count_temp = f0.get('count');
    return f0.set({area:areakm,index:count_temp});
  } // add the properties:area, to eliminate the small polygon


// ==============================================================
// // 栅格转矢量函数&&计算面积函数
// var fun = function(img){
//   var geo = img.multiply(10).toInt().reduceToVectors({
//         reducer: ee.Reducer.countEvery(), 
//         geometry: roi, 
//         scale: 1,
//         maxPixels: 1e13}); //FeatureCollection (11 elements, 3 columns)
        
//   var addArea = geo.map(function(f0) {
//     var areakm = f0.area(1000).divide(1000 * 1000);
//     var count_temp = f0.get('count');
//     return f0.set({area:areakm,index:count_temp});
//     }); // add the properties:area, to eliminate the small polygon
    
//   // //select the largest
//   // var final = addArea.sort("area",false);
//   // return final;
  
//   return addArea;
// }; 
// ==============================================================


 var max_pool = first_contour.multiply(10).toInt().reduceToVectors({
          reducer: ee.Reducer.countEvery(), 
          geometry: roi, 
          geometryType:'polygon',
          scale: 1,
          maxPixels: 1e13});

print('max_pool',max_pool);

Map.addLayer(max_pool,{},"max_pools",0);

var max_pool_area = max_pool.map(cal_area).sort("area",false);

print('max_pool_area',max_pool_area);


// 筛选出面积小于500，大于20
// 定义面积的过滤条件
var areaFilter = ee.Filter.and(
  ee.Filter.lessThan('area', 1600),
  ee.Filter.greaterThan('area', 100)
);

// 进行筛选
var pool_n = max_pool_area.filter(areaFilter);

// var pool_n = max_pool_area.filter(ee.Filter.lte('area',500)
//                           .and(ee.Filter.lte('area',20)));
                     
print(pool_n);     
print("pool_n",pool_n.size());
Map.addLayer(pool_n,{palette:"green"},'pool_n');


// 把9.74以下的dem提取出来
var loop = dem_xz.updateMask(dem_xz.lte(9.74));
Map.addLayer(loop,viz,"loop");

// 创建9.74的dem
var std_dem = ee.Image(9.74).clip(loop.geometry());

// 计算面积
var rain_pool = std_dem.subtract(loop);
var Area = rain_pool.reduceRegion({
    reducer: ee.Reducer.sum(),
    geometry: roi,
    scale: 1,             // 这里填写影像分辨率
    bestEffort: true,      // 如果多边形在给定比例下包含太多像素，则计算并使用更大的比例，这将使操作成功。
    maxPixels:1e13,        // 此处值设置大一些，防止reducer没法计算所有像元
    tileScale:2           // 缩放系数
  });

print("Area",Area);