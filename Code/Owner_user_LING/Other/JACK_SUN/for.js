
/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var roi = 
    /* color: #d63000 */
    /* shown: false */
    ee.Geometry.Point([72.27137663867153, -69.20842796540386]);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
var sencol = ee.ImageCollection("COPERNICUS/S1_GRD")
  .filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'HH')) //筛选HH极化方式
  .filterBounds(roi) //筛选范围内影像
  .filter(ee.Filter.eq('orbitProperties_pass', 'ASCENDING'))
  .filter(ee.Filter.eq('instrumentMode', 'EW'))
  .select(['HH']);

// print(sencol);
// print(typeof sencol);

var data_collection;

for(var i=2018;i<=2022;i++){
  for(var j=1;j<=12;j++){
    var data_collection = sencol                    // 将各个年份和月份的影像放到暂时的影像集中
  .filter(ee.Filter.calendarRange(i, i, 'year'))    // 这连两个过滤器可以互换位置
  .filter(ee.Filter.calendarRange(j,  j,'month'))
  .map(function(img)  // 此方法给影像增加了一个year的字段
  {
    return img.set('year', img.date().get('year'));
  }
  )
  .filterBounds(roi); // 过滤边界

    var img = data_collection.first()
    // print(data_collection,i+"_year_"+j+"_month");
    // Map.addLayer(img,{min:-25,max:0},i+'-'+j,0);
  }
}
Map.centerObject(roi,7)

print(data_collection); 
// 在循环体内的var能够在循环体外输出结果，表示需要在循环体内创建和处理影像集
// 但是在覆盖变量却输出为空？说明不能覆盖
// 在循环体外另外创建的一个变量可以输出，说明GEE支持局部变量和全局变量的互通
// 最好多创变量

// 可以试试将循环体内的影像集调出循环体，再将其赋值给字典的值