/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var geometry = /* color: #98ff00 */ee.Geometry.Point([121.655286057885, 31.80902517936842]);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
var Lan9_DN = ee.ImageCollection("LANDSAT/LC09/C02/T1");
var Lan9_TOA = ee.ImageCollection("LANDSAT/LC09/C02/T1_TOA");
var Lan9_SR = ee.ImageCollection("LANDSAT/LC09/C02/T1_L2");


var Lan8_DN = ee.ImageCollection("LANDSAT/LC08/C02/T1");
var Lan8_TOA = ee.ImageCollection("LANDSAT/LC08/C02/T1_TOA");
var Lan8_SR = ee.ImageCollection("LANDSAT/LC08/C02/T1_L2");


// ===============================================================================================================
// 定义一个函数来掩码云
function maskClouds(image) {
  // 获取QA_PIXEL波段
  var qa = image.select('QA_PIXEL');
  // 位掩码，掩掉云和阴影
  var cloudMask = qa.bitwiseAnd(1 << 3).eq(0)
                    .and(qa.bitwiseAnd(1 << 4).eq(0));
  return image.updateMask(cloudMask);
}



// @@@应用云掩码函数
// var Lan9_Sec_01 = Lan9_DN.map(maskClouds);
// ===============================================================================================================




// ===============================================================================================================

// 定义一个函数来计算云分数并掩盖云
function getCloudMask(image) {
  var cloudScore = ee.Algorithms.Landsat.simpleCloudScore(image).select('cloud');
  var cloudMask = cloudScore.lt(30);  // 设置云分数阈值
  return cloudMask.rename('cloudMask').set('system:index', image.get('system:index'));
}

// 计算表面反射率图像集合中的云掩码
var cloudMaskedTOA = Lan9_TOA.map(function(image) {
  return image.addBands(getCloudMask(image));
});

// 定义一个函数来应用云掩码到DN值图像集合
function TOA_score(image) {
  var index = image.get('system:index');
  var correspondingTOA = cloudMaskedTOA.filter(ee.Filter.eq('system:index', index)).first();
  var cloudMask = correspondingTOA.select('cloudMask');
  return image.updateMask(cloudMask);
}

// 应用云掩码函数
// var Lan9_Sec_02 = Lan9_DN.map(TOA_score);

// ===============================================================================================================





// ===============================================================================================================
// 定义一个函数来计算云掩码
function getCloudMask(image) {
  var qa = image.select('QA_PIXEL');
  // 获取云掩码：bit 3 和 bit 5
  var cloudMask = qa.bitwiseAnd(1 << 3).eq(0).and(qa.bitwiseAnd(1 << 4).eq(0));
  return image.addBands(cloudMask.rename('cloudMask')).set('system:index', image.get('system:index'));
}
// 计算表面反射率图像集合中的云掩码
var cloudMaskedTOA = Lan9_TOA.map(function(image) {
  return getCloudMask(image);
});
// 定义一个函数来应用云掩码到DN值图像集合
function TOA_bit(image) {
  var index = image.get('system:index');
  var correspondingTOA = cloudMaskedTOA.filter(ee.Filter.eq('system:index', index)).first();
  var cloudMask = correspondingTOA.select('cloudMask');
  return image.updateMask(cloudMask);
}


// @@@应用云掩码函数
// var Lan9_Sec_03 = Lan9_DN.map(TOA_bit);
// ===============================================================================================================






// ===============================================================================================================
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
var cloudMaskedSR = Lan9_SR.map(function(image) {
  var mask = getCloudMask(image);
  return image.updateMask(mask).set('system:index', image.get('system:index'));
});


// @@@应用云掩码函数使用相同的掩码集合来掩膜原始DN值数据集
function SR_outCloud(image) {
  // 使用系统索引进行匹配
  var index = image.get('system:index');
  var correspondingSR = cloudMaskedSR.filter(ee.Filter.eq('system:index', index)).first();
  if (correspondingSR) {
    var mask = correspondingSR.select('QA_PIXEL').mask().reduce(ee.Reducer.min());
    return image.updateMask(mask);
  } else {
    return image;
  }
}

// var Lan9_Sec_04 = Lan9_DN.map(SR_outCloud);
// ===============================================================================================================







// ===============================================================================================================

// ******(function)select
function sele_band(img){
  var img_sel = img.select("B2","B3","B4");
  return img_sel;
}


// DN值转换为辐亮度
function toRadiance(image){
  var calibratedRadiance = ee.Algorithms.Landsat.calibratedRadiance(image);
  return calibratedRadiance;
}


// ===============================================================================================================


var time_th = 35;
var cloud_th_1 = 55;
var cloud_th_2 = 10;


// dataset
var BNU = ee.FeatureCollection('projects/ee-glj320104/assets/yuan');


// Map.centerObject(BNU,5);
Map.addLayer(BNU,{},"BNU_Index",0);


var start_index = ee.Number.parse(BNU.reduceColumns(ee.Reducer.min(), ["BID"]).get("min"));
var end_index = ee.Number.parse(BNU.reduceColumns(ee.Reducer.max(), ["BID"]).get("max"));







// 使用evaluate方法获取这些值
start_index.evaluate(function(start) {
  end_index.evaluate(function(end) {
    for (var i = 0; i <= 2; i++) {
      // 您的代码逻辑
      var fea = BNU.filter(ee.Filter.eq('BID', ee.Number(i).format())).first();
      // 这里继续您的代码
      // console.log(i); // 举例输出i的值
      // 缓冲区
      var geo = fea.geometry().buffer(10000);
      
      Map.addLayer(geo, {
        color: 'red', // 边界线颜色
        fillColor: 'red', // 填充颜色，如果需要填充的话
        fillOpacity: 0.5 // 填充透明度，如果需要填充的话
      },"Geo"+i,0);
      
      
      
      // 获取time属性并转换为日期格式（只保留日期部分）
      var timeString = fea.getString('time');
      var date = ee.Date(timeString.slice(0, 10));  // 仅保留'YYYY-MM-DD'部分
    
      // 设置时间范围，例如以日期为中心的前后一天
      var startDate = date.advance(-time_th, 'day');
      var endDate = date.advance(time_th, 'day');
      
      print('开始时间:',startDate,'结束时间:',endDate);
      
      
      
      
      
      
      
      // 作为第一顺位的云量掩膜影像
      var Lan9_c1 = Lan9_DN.filterBounds(geo)
                          .filterDate(startDate,endDate)
                          .map(maskClouds)
                          .map(toRadiance)
                          .map(sele_band);
      
      
      //  作为第二顺位的云量掩膜影像
      var Lan9_c2 = Lan9_DN.filterBounds(geo)
                            .filterDate(startDate,endDate)
                            // .map(toRadiance)
                            .map(TOA_score)
                            .filter(ee.Filter.lt('CLOUD_COVER_LAND',cloud_th_1))
                            .sort('CLOUD_COVER_LAND')
                            .map(sele_band);

      //  作为第三顺位的云量掩膜影像
      var Lan9_c3 = Lan9_DN.filterBounds(geo)
                            .filterDate(startDate,endDate)
                            // .map(toRadiance)
                            .map(TOA_bit)
                            .filter(ee.Filter.lt('CLOUD_COVER_LAND',cloud_th_1))
                            .sort('CLOUD_COVER_LAND')
                            .map(sele_band);

      //  作为第四顺位的云量掩膜影像
      var Lan9_c4 = Lan9_DN.filterBounds(geo)
                            .filterDate(startDate,endDate)
                            // .filter(ee.Filter.lt('CLOUD_COVER_LAND',cloud_th_1))
                            .sort('CLOUD_COVER_LAND')
                            .map(SR_outCloud)
                            .map(toRadiance)
                            .map(sele_band);



      //  作为第五顺位的云量掩膜影像
      var Lan9_c5 = Lan9_DN.filterBounds(geo)
                            .filterDate(startDate,endDate)
                            // .filter(ee.Filter.lt('CLOUD_COVER_LAND',cloud_th_2))
                            .sort('CLOUD_COVER_LAND')
                            .map(toRadiance)
                            .map(sele_band);



      // 作为兜底的升序云量影像
      var Lan9_c6 = Lan9_DN.filterBounds(geo)
                            .filterDate(startDate,endDate)
                            .sort('CLOUD_COVER_LAND')
                            .map(toRadiance)
                            .map(sele_band);




      // ----------------------------------------------------------------------------------------------------
      // 作为第一顺位的云量掩膜影像
      var Lan8_c1 = Lan8_DN.filterBounds(geo)
                          .filterDate(startDate,endDate)
                          .map(maskClouds)
                          .map(toRadiance)
                          .map(sele_band);
      
      
      //  作为第二顺位的云量掩膜影像
      var Lan8_c2 = Lan8_DN.filterBounds(geo)
                            .filterDate(startDate,endDate)
                            // .map(toRadiance)
                            .map(TOA_score)
                            .filter(ee.Filter.lt('CLOUD_COVER_LAND',cloud_th_1))
                            .sort('CLOUD_COVER_LAND')
                            .map(sele_band);

      //  作为第三顺位的云量掩膜影像
      var Lan8_c3 = Lan8_DN.filterBounds(geo)
                            .filterDate(startDate,endDate)
                            // .map(toRadiance)
                            .map(TOA_bit)
                            .filter(ee.Filter.lt('CLOUD_COVER_LAND',cloud_th_1))
                            .sort('CLOUD_COVER_LAND')
                            .map(sele_band);

      //  作为第四顺位的云量掩膜影像
      var Lan8_c4 = Lan8_DN.filterBounds(geo)
                            .filterDate(startDate,endDate)
                            .filter(ee.Filter.lt('CLOUD_COVER_LAND',cloud_th_1))
                            .sort('CLOUD_COVER_LAND')
                            .map(SR_outCloud)
                            .map(toRadiance)
                            .map(sele_band);



      //  作为第五顺位的云量掩膜影像
      var Lan8_c5 = Lan8_DN.filterBounds(geo)
                            .filterDate(startDate,endDate)
                            .filter(ee.Filter.lt('CLOUD_COVER_LAND',cloud_th_2))
                            .sort('CLOUD_COVER_LAND')
                            .map(toRadiance)
                            .map(sele_band);



      // 作为兜底的升序云量影像
      var Lan8_c6 = Lan8_DN.filterBounds(geo)
                            .filterDate(startDate,endDate)
                            .sort('CLOUD_COVER_LAND')
                            .map(toRadiance)
                            .map(sele_band);
      // ----------------------------------------------------------------------------------------------------


      /*
      */

      print(Lan9_c1.first());
      // print(Lan9_c2.first());
      // print(Lan9_c3.first());
      print(Lan9_c4.first());
      print(Lan9_c5.first());
      print(Lan9_c6.first());
      
      print(Lan8_c1.first());
      // print(Lan8_c2.first());
      // print(Lan8_c3.first());
      // print(Lan8_c4.first());
      print(Lan8_c5.first());
      print(Lan8_c6.first());
      
      
      var img9_01 = Lan9_c1.median().clip(geo);
      // var img_02 = Lan9_c2.median().clip(geo);
      // var img_03 = Lan9_c3.median().clip(geo);
      var img9_04 = Lan9_c4.median().clip(geo);
      var img9_05 = Lan9_c5.median().clip(geo);      
      var img9_06 = Lan9_c6.median().clip(geo);
      
      
      var img8_01 = Lan8_c1.median().clip(geo);
      // var img_02 = Lan8_c2.median().clip(geo);
      // var img_03 = Lan8_c3.median().clip(geo);
      // var img8_04 = Lan8_c4.median().clip(geo);
      var img8_05 = Lan8_c5.median().clip(geo);      
      var img8_06 = Lan8_c6.median().clip(geo);



      var final_img = img9_01.unmask(img8_01).unmask(img9_04).unmask(img9_05).unmask(img8_05).unmask(img9_06).unmask(img8_06);
      
      
      
      Map.addLayer(final_img,{min:0,max:100,bands:["B4","B3","B2"]},"Index"+i,1);
      var final_img_prj = final_img.select("B4").reproject('EPSG:32649', null, 80).resample('bilinear').toFloat();
      
      Export.image.toDrive({
            image:final_img_prj, //分类结果
            description:"Sen2_SR_B4_PRJ_BB_Index_" + i + "_V2022_10", //文件名
            scale:80, //分辨率
            maxPixels:1e13, //此处值设置大一些，防止溢出
            crs:'EPSG:32649'
      });
    }
  });
});
