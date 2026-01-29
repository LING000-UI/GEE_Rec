/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var table = ee.FeatureCollection("projects/ee-glj320104/assets/Home_work/njxz_roi"),
    image2 = ee.Image("projects/ee-glj320104/assets/Home_work/xzRGB"),
    image = ee.Image("projects/ee-glj320104/assets/Home_work/xzDEM_F");
/***** End of imports. If edited, may not auto-convert in the playground. *****/
var roi = table;
var dem_xz = image.clip(roi);
var viz = {min:0,max:16};
var rgb_xz = image2.clip(roi);

Map.centerObject(roi,15);
Map.addLayer(dem_xz,viz,"DEM",0);
Map.addLayer(rgb_xz,{},"RGB",0);
print(dem_xz);

// 统计完整面积
var full_area = dem_xz.reduceRegion({
                reducer: ee.Reducer.count(),
                geometry: roi,
                scale: 1,             // 这里填写影像分辨率
                bestEffort: true,      // 如果多边形在给定比例下包含太多像素，则计算并使用更大的比例，这将使操作成功。
                maxPixels:1e13,        // 此处值设置大一些，防止reducer没法计算所有像元
                tileScale:2           // 缩放系数
              }).get("b1");

print("full_area",full_area);


// 计算降水体积
var volumetric = 1093518*0.6;
print("计算降水体积",volumetric);

// // 使用for循环计算等于体积

// for(var i=0;i<=17;i=i+0.01){
//   var std = ee.Image(i);
//   var diff = std.subtract(dem_xz);
//   diff = diff.updateMask(diff.gte(0));
  
//   var fill_area = diff.reduceRegion({
//                 reducer: ee.Reducer.sum(),
//                 geometry: roi,
//                 scale: 1,             // 这里填写影像分辨率
//                 bestEffort: true,      // 如果多边形在给定比例下包含太多像素，则计算并使用更大的比例，这将使操作成功。
//                 maxPixels:1e13,        // 此处值设置大一些，防止reducer没法计算所有像元
//                 tileScale:2           // 缩放系数
//               }).get("b1");
              
//   if((fill_area>=656108)&&(fill_area<=656112)){
//     print("被淹没高程",i); 
//     break;
//   }
// }

// 回归
var std = ee.Image(11.33163186);
var diff = std.subtract(dem_xz);
diff = diff.updateMask(diff.gte(0));

// var zero = ee.Image(0);
// diff = zero.subtract(diff);

var palettes = require('users/gena/packages:palettes');
var palette_misc = palettes.misc.jet[7];
Map.addLayer(diff, {min:0, max:16, palette: palette_misc},"diff");


var fill_area = diff.reduceRegion({
              reducer: ee.Reducer.sum(),
              geometry: roi,
              scale: 1,             // 这里填写影像分辨率
              bestEffort: true,      // 如果多边形在给定比例下包含太多像素，则计算并使用更大的比例，这将使操作成功。
              maxPixels:1e13,        // 此处值设置大一些，防止reducer没法计算所有像元
              tileScale:2           // 缩放系数
            }).get("constant");

print(fill_area);
// print("fill_area",fill_area);


// // unmask插补非植被
// var veg_class_all = veg_class.unmask(3).clip(roi);
// Map.addLayer(veg_class_all,{min:0,max:3,palette:['d9ff92','ffe4b1','00d530','silver']},"veg_class_all");

// print(veg_class_all.bandNames());

// var veg_class_all = veg_class_all.rename('B1');

// export
Export.image.toDrive({
  image:diff, //分类结果
  description:'diff', //文件名
  scale:1, //分辨率
  region:roi, //区域
  maxPixels:1e13 //此处值设置大一些，防止溢出
});