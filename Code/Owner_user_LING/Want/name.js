/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var ROI = ee.FeatureCollection("projects/ee-glj320104/assets/GPP_ROI/sz"),
    ROI1 = ee.FeatureCollection("projects/ee-glj320104/assets/GPP_ROI/sz1"),
    ROI2 = ee.FeatureCollection("users/LING/GPP_ROI_NAME/SuZhou"),
    Sen = ee.ImageCollection("COPERNICUS/S2_SR");
/***** End of imports. If edited, may not auto-convert in the playground. *****/
// print(ROI);
// var cau = ROI.first();
// print(cau);
// // ***可以获取属性***
// var cau1 = ROI.first().get('name');
// print(cau1);
// var cau2 = ROI.get('name');
// print(cau2);


// print(ROI1);
// var pro = ROI1.first();
// print(pro);
// // ***可以获取属性***中文-----只修改了文件名,未修改属性
// var pro1 = ROI1.first().get('name');
// print(pro1);
// var pro2 = ROI1.get('name');
// print(pro2);

// // 修改json文件的name属性,成功
// print(ROI2);
// var cal = ROI2.first();
// print(cal);
// // ***可以获取属性***英文-----修改了属性
// var cal1 = ROI2.first().get('name');
// print(cal1);

// // *********使用ee转换，使用.cat()连接*********
// cal1 = ee.String(cal1);
// print(cal1);
// print(typeof cal1);

// var cont = cal1.cat('OKK');

// print(cont);
// print(typeof cal1.cat('OKK'));




// var nam = 'SuZhou';

// Export.image.toDrive({
//   image:Sen.first(), //分类结果
//   description: nam + 'TRUE', //文件名
//   scale:10, //分辨率
//   maxPixels:1e13 //此处值设置大一些，防止溢出
// });

var ol = 'me';

var cal1 = ROI2.first().get('na'+ol);
print(cal1);

ROI = ROI.first().set('nna' + ol,'dick');