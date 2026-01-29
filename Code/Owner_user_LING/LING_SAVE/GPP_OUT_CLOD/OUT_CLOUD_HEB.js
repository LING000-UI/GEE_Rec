/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var ROI = ee.FeatureCollection("projects/ee-glj320104/assets/GPP_ROI/heb");
/***** End of imports. If edited, may not auto-convert in the playground. *****/
// -------------------------------------------------------计算2022年所有影像的NDVI--------------------------------------------------------
// heb:50:10
// gz:50;20
// xn:50;10
// heb:50;20

var firstl = 50;
var secondl = 20;

// 定义感兴趣区域
var areaOfInterest = ROI; // 根据您的需求替换为适当的几何图形或边界
// var water = WATER;
Map.centerObject(areaOfInterest,7);

// 加载Sentinel-2影像集并筛选时间范围（2022年全年）
var imageCollection = ee.ImageCollection('COPERNICUS/S2_SR')
  .filterBounds(areaOfInterest)
  .filterDate('2021-01-01', '2022-12-31')
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE',firstl));

// 打印结果到控制台查看原始影像集
print('原始影像集',imageCollection);

// 计算函数：定义计算NDVI的函数
function calculateNDVI(image) {
  var ndvi = image.normalizedDifference(['B8', 'B4']).rename('NDVI');
  return image.addBands(ndvi);
}

// 计算函数：定义计算NIRv的函数
function calculateNIRv(image) {
    var nirv = image.select('NDVI').multiply(image.select('B8')).multiply(0.0001).rename('NIRv');
    return image.addBands(nirv);
  }

// 选择波段函数（B8[nir],ndvi,nirv）
function secl(image){
    var secli = image.select('B4','B3','B2','B8','NDVI','NIRv','QA60').rename('red','green','blue','nir','NDVI','NIRv','QA60');
    return secli;
}

// 裁剪函数
function clipROI(image) {
  return image.clip(areaOfInterest);                 
}

// 去云函数1
function rmCloudByQA(image) { 
      var qa = image.select('QA60'); 
      var cloudBitMask = 1 << 10; 
      var cirrusBitMask = 1 << 11; 
      var mask = qa.bitwiseAnd(cloudBitMask).eq(0) 
                  .and(qa.bitwiseAnd(cirrusBitMask).eq(0)); 
      return image.updateMask(mask); 
    }


// 将计算NDVI函数应用于影像集中的所有影像
var ndviCollection = imageCollection.map(calculateNDVI);
var nirvCollection = ndviCollection.map(calculateNIRv);
var SecCollection = nirvCollection.map(secl);
var cut_collection = SecCollection.map(clipROI);
cut_collection = cut_collection.map(rmCloudByQA);
print('第一次预处理后的年影像集',cut_collection);

// 调色板
var pal = ['1ea0ff','f7ff86','aeff45','45ff0a','73dadf','75ed9a','fe82ff','ffb251','ffd6b3','c69e60','d8fff6','ecfffa'];
var pal2 = ['blue','green','yellow','red'];



// --------------------------------------------将预处理后的Collection中的影像按照日期放入每个月的影像集中------------------------------------
// 直接在循环中处理,处理好的Image再导出来

// 循环外创建一个集合，将最大合成影像添加进这个集合中
var year_list_2021 = ee.List([]);
var year_list_2022 = ee.List([]);


// 分类器，镶嵌了21年和22年最小云量的影像，存在部分缺失
for(var i=2021;i<=2022;i++){
  
  for(var j=1;j<=12;j++){
    
    var data_collection = cut_collection                    // 将各个年份和月份的影像放到暂时的影像集中
    .filter(ee.Filter.calendarRange(i, i, 'year'))    // 这连两个过滤器可以互换位置
    .filter(ee.Filter.calendarRange(j, j,'month'));
    
    data_collection = data_collection.filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE',secondl))
                                   .sort('CLOUDY_PIXEL_PERCENTAGE')
                                   .map(rmCloudByQA);
    
    
    var time_image = data_collection.mosaic().set('year' ,i).set('month',j).set('times' ,i+'_year_'+j+'_month');
    
    // var max_image = data_collection.median().set('month',j);
    if(i == 2021){
        year_list_2021 = year_list_2021.add(time_image);   // 需要返回赋值add（）是有返回值的，并不会直接修改原始list的元素
    }
    else{
        year_list_2022 = year_list_2022.add(time_image);
    }
  }
}


// 转换成ImageCollection

var cloud_collection_2021 = ee.ImageCollection.fromImages(year_list_2021);
print('2021年12个月max影像的collection',cloud_collection_2021);  

var cloud_collection_2022 = ee.ImageCollection.fromImages(year_list_2022);
print('2022年12个月max影像的collection',cloud_collection_2022); 


// 计算判定是否缺失
var std_img = imageCollection
              .filterBounds(areaOfInterest)
              .mosaic()
              .clip(areaOfInterest);


var stdpix = std_img.select('B4').reduceRegion({
    reducer: ee.Reducer.count(),
    geometry: areaOfInterest,
    scale: 10,
    maxPixels: 10e15,
}).get('B4');
print("标准red波段像元个数", stdpix)


// 容器List装混合影像
var mix_list = ee.List([]);
var mix_list2 = ee.List([]);

// 进行混合
// 对2022年的数据进行遍历，对于残缺部分混合21年的数据

for(var j=1;j<=12;j++){
    var temp_img_22 = cloud_collection_2022
                        .filter(ee.Filter.eq('month',j))
                        .first();
    
    var temp_img_21 = cloud_collection_2021
                        .filter(ee.Filter.eq('month',j))
                        .first();

    var calpix = temp_img_22.select('red').reduceRegion({
        reducer: ee.Reducer.count(),
        geometry: areaOfInterest,
        scale: 10,
        maxPixels: 10e15,
    }).get('red');


    // 一次损失，使用21年数据填补
    if(calpix < stdpix){
        var miximg = temp_img_21.blend(temp_img_22).set('lose',1);
    }
    else{
        var miximg = temp_img_22.set('lose',0)
    }
    
    mix_list = mix_list.add(miximg);
}


var mix_collection = ee.ImageCollection.fromImages(mix_list);
print('2022年12个月mix影像的collection',mix_collection); 



// 二次损失，使用前后两个月数据平均值填补


for(var j=1;j<=12;j++){
  
  var temp_mix = mix_collection
                        .filter(ee.Filter.eq('month',j))
                        .first();
  var calpix = temp_mix.select('red').reduceRegion({
                          reducer: ee.Reducer.count(),
                          geometry: areaOfInterest,
                          scale: 10,
                          maxPixels: 10e15,
                        }).get('red');
  if(calpix < stdpix){
    if(j == 1){
      
      var qian = mix_collection
                        .filter(ee.Filter.eq('month',j+1))
                        .first();
      var miximg2 = qian.blend(temp_mix).set('lose',2).set('month',j);   
    }else if (j == 12) {
      
      var qian = mix_collection
                        .filter(ee.Filter.eq('month',j-1))
                        .first();
      var miximg2 = qian.blend(temp_mix).set('lose',2).set('month',j);   
    } else {
      
      var qian = mix_collection
                        .filter(ee.Filter.eq('month',j-1))
                        .first();
      var hou = mix_collection
                        .filter(ee.Filter.eq('month',j+1))
                        .first();
      
      var sum = qian.add(hou)
      var jun = sum.divide(2);

      var miximg2 = jun.blend(temp_mix).set('lose',2).set('month',j);   
    }
  }else{
      var miximg2 = temp_mix.set.set('lose',0).set('month',j)
  }
  mix_list2 = mix_list2.add(miximg2);
}

var mix_collection2 = ee.ImageCollection.fromImages(mix_list2);
print('2022年12个月mix影像的collection',mix_collection2); 



//--------------------------------------------------------------------------预处理完成-------------------------------------------------------------







//检查每月影像(云量)

for(var j=1;j<=12;j++){
  var img = mix_collection2                    
  .filter(ee.Filter.eq('month',j))
  .first();
  
  Map.addLayer(img.clip(areaOfInterest),{bands:['red','green','blue']},'img'+j+'true_color',0);

}


//检查每月影像(NDVI)

for(var j=1;j<=12;j++){
  var img = mix_collection2                    
  .filter(ee.Filter.eq('month',j))
  .first()
  .select('NDVI');
  
  Map.addLayer(img.clip(areaOfInterest),{bands:'NDVI',palette:pal2},'img'+j+'NDVI',0);

}


//检查每月影像(NIRv)

for(var j=1;j<=12;j++){
    var img = mix_collection2                    
    .filter(ee.Filter.eq('month',j))
    .first()
    .select('NIRv');
    
    Map.addLayer(img.clip(areaOfInterest),{bands:'NIRv',palette:pal2},'img'+j+'NIRv',0);
  
  }
















































//------------------------------------------------------土地类型的分类-------------------------------------------------------------------
// 首先要分类城区和森林，需要一个图层和ESri land cover 
// ESRI显示参数设置
var imageVisParam_ESRI = {"opacity":1,"bands":["b1"],"min":1,"max":10,"palette":["8dffda","14ff31","686dff","ff9b54","ff712d","ff66b4"]};

// 导入ESri land cover 数据
var ESRI = ee.ImageCollection("projects/sat-io/open-datasets/landcover/ESRI_Global-LULC_10m");


// 筛选研究区（ROI）数据             
var ESRI_ROI_landcover = ESRI.filterBounds(areaOfInterest).mosaic().clip(areaOfInterest);
print('ESRI_ROI_landcover',ESRI_ROI_landcover);


// 加载图层
Map.addLayer(ESRI_ROI_landcover,imageVisParam_ESRI,"ESRI_ROI_landcover",0);


// 把 ESRI 的数据添加到影像集中
function addesri(image) {
    return image.addBands(ESRI_ROI_landcover.rename('TYPE_OF_LAND_COVER'));
  }
  
var esri_collection = mix_collection2.map(addesri);
print('加入了ESRI大类的初级植被类型影像集',esri_collection);





// 逻辑运算提取(BTO:bulid_area,tree,grass,crop,other)
var BTO = ee.Image(0).clip(areaOfInterest);
BTO = BTO.where(ESRI_ROI_landcover.eq(7),1);
BTO = BTO.where(ESRI_ROI_landcover.eq(2),2);
BTO = BTO.where(ESRI_ROI_landcover.eq(3),3);
BTO = BTO.where(ESRI_ROI_landcover.eq(5),4);



// 掩膜
var mask = BTO.updateMask(BTO.neq(0));


// 展示城区，红色：城区，绿色：林地,青色：草地,黄色：农作物
Map.addLayer(mask,{palette:['red','green','cyan','yellow']},'BTO',0);   



// 只提取一块，把不需要的区域掩膜掉
// 直接对这么一个值进行赋值，就是一个二值图
var CROP_m = ESRI_ROI_landcover.eq(5);
Map.addLayer(CROP_m,{},'CROP_m',0);
// 白色的耕地是有值的1，其余的区域为0黑色

// 进行一个掩膜,默认的会把1值提取出来了，把0值给掩膜掉了

var GD = ESRI_ROI_landcover.updateMask(CROP_m);
Map.addLayer(GD,{palette:'yellow'},'GD',0);

// 取反,把0给提取出来了
// var GD = ESRI_ROI_landcover.updateMask(CROP_m.not());
// Map.addLayer(GD,{palette:'yellow'},'GD');

// 指定什么值就是提取updatemask出来这个值的区域
// 把eq(0)的给提取出来了
// var GD = ESRI_ROI_landcover.updateMask(CROP_m.eq(0));
// Map.addLayer(GD,{palette:'yellow'},'GD');

// 把eq(0)的给提取出来了
// var GD = ESRI_ROI_landcover.updateMask(CROP_m.neq(1));
// Map.addLayer(GD,{palette:'yellow'},'GD');




// 新增影像名，复刻ESRI_ROI_landcover的名字（ELD）

var ELD = ESRI_ROI_landcover;




// 根据C1/C2标准，进行植被类型的分类
// 从max_collection中挑选8和12月份的image
var ndvi8 = mix_collection2.filter(ee.Filter.eq('month',8)).first().select('NDVI');
var ndvi12 = mix_collection2.filter(ee.Filter.eq('month',12)).first().select('NDVI');

print('8月份影像的ndvi波段',ndvi8);
print('12月份影像的ndvi波段',ndvi12);


// yuanshi
// var img5 = max_collection.filter(ee.Filter.eq('month',5)).first().select('','');


// 植被类型只会分类出一种，之后就是将这个分类图层add到每个月的max中
// 创建一个值是0的基底
var type = ee.Image(0).clip(areaOfInterest);

// //--------------------------------------------------------------裁剪水体---------------------------------------------------------------------
// var water = ee.Image(1).clip(water);

// --------------------------------------将type波段加入到max_collection中的每个img上(植被类型的区分)----------------------------------------------
// 标准C2计算公式
var C2 = (ndvi8.subtract(ndvi12)).divide(ndvi8);

// 注意：区域植被调整，增加建成区和非建成区常绿针叶林
// 共计12类
// 都减去1便于显示



// 森林（林地）植被类型的区分
type = type.where(ELD.eq(2).and(C2.gte(0.35)),1);                   // 落叶林
type = type.where(ELD.eq(2).and(C2.gte(0.2)).and(C2.lte(0.35)),2);  // 混交林
type = type.where(ELD.eq(2).and(C2.gte(0.05)).and(C2.lte(0.2)),3);  // 常绿林
type = type.where(ELD.eq(2).and(C2.lte(0.05)),4);                   // 针叶林


// 草地分类
type = type.where(ELD.eq(3),5);

// 淹没植被（湿地）分类
type = type.where(ELD.eq(4),6);

// 耕地（农作物）分类
type = type.where(ELD.eq(5),7);

// 灌木分类
type = type.where(ELD.eq(6),8);


// 城区（建筑Build_area）植被类型分类
type = type.where(ELD.eq(7).and(ndvi8.lt(0.2)),9);                                                         // 裸地
type = type.where(ELD.eq(7).and(ndvi8.gte(0.2).and(ndvi8.lte(0.5))),5);                                    // 草地
type = type.where(ELD.eq(7).and(ndvi8.gte(0.5).and(ndvi8.lte(1)).and(C2.gt(0.35))),1);                     // 落叶林
type = type.where(ELD.eq(7).and(ndvi8.gte(0.5).and(ndvi8.lte(1)).and(C2.gt(0.2).and(C2.lt(0.35)))),2);     // 混交林
type = type.where(ELD.eq(7).and(ndvi8.gte(0.5).and(ndvi8.lte(1)).and(C2.gt(0.05).and(C2.lt(0.2)))),3);     // 常绿林
type = type.where(ELD.eq(7).and(ndvi8.gte(0.5).and(ndvi8.lte(1)).and(C2.lt(0.05))),4);                     // 针叶林

// 裸地分类
type = type.where(ELD.eq(8),9);

// 冰/雪分类
type = type.where(ELD.eq(9),10);

// 云
type = type.where(ELD.eq(10),11);

// 最后一类区分水
type = type.where(ELD.eq(1),0);

print('type_of_veg',type);

Map.addLayer(type,{palette:pal},'type',0);


// 导出分类植被类型

Export.image.toDrive({
image:type, //分类结果
description:'type_of_heb', //文件名
scale:10, //分辨率
region:areaOfInterest, //区域
maxPixels:1e13 //此处值设置大一些，防止溢出
});








//-----------------------------------------------------添加函数(添加土地类型和植被类型)------------------------------------------------------------
// 
function addtype(image) {
  return image.addBands(type.rename('TYPE_OF_VEG'));
}

var type_collection = esri_collection.map(addtype);

print('加入了type波段后的最大合成影像集',type_collection);

// N-1
// type-0: 水体 
// type-1: 落叶林
// type-2: 混交林 
// type-3: 常绿林
// type-4: 针叶林
// type-5: 草地
// type-6: 湿地
// type-7: 耕地
// type-8: 灌木
// type-9: 裸地
// type-10: 冰/雪
// type-11: 云


//----------------------------------------------------------------精度验证-----------------------------------------------------------------------




//----------------------------------------------------------------GPP计算----------------------------------------------------------------

// gpp计算函数
function gppcalculate(image) {
  var gpp = ee.Image(0).clip(areaOfInterest);
  var VEC = image.select('TYPE_OF_VEG');
  var NIR = image.select('NIRv');

 gpp = gpp.where(VEC.eq(0).or(VEC.eq(9)).or(VEC.eq(10)).or(VEC.eq(11)),0);
  gpp = gpp.where(VEC.eq(1),NIR.multiply(64.07).subtract(2.20));
  gpp = gpp.where(VEC.eq(2),NIR.multiply(59.49).subtract(2.93));
  gpp = gpp.where(VEC.eq(3),NIR.multiply(44.50).add(2.60));
  gpp = gpp.where(VEC.eq(4),NIR.multiply(64.51).subtract(1.41));
  gpp = gpp.where(VEC.eq(5),NIR.multiply(68.13).subtract(1.62));
  gpp = gpp.where(VEC.eq(6),NIR.multiply(57.66).subtract(1.31));
  gpp = gpp.where(VEC.eq(7),NIR.multiply(55.38).subtract(1.97));     // 碳3
  gpp = gpp.where(VEC.eq(8),NIR.multiply(36.18).subtract(0.87));
  
  // gpp = gpp.where(gpp.lt(0),0);
  
  return image.addBands(gpp.rename('GPP'));
}

var gpp_collection = type_collection.map(gppcalculate);

print('计算gpp波段后的最大合成影像集',gpp_collection);


















// 监视一个月的最大的GPP影像（第一个月）
var view_gpp = gpp_collection.first().select('GPP');

Map.addLayer(view_gpp,{palette:['blue','green','yellow','orange','red']},'gpp',0);

//------------------------------------------------------需要计算12个月份叠加起来的一个图层值-----------------------------------------------
var pal2 = ['0500ff','4359ff','4ba3ff','72ebff','95ffdd','69e343','f0ff7e','ffd586','ff8568','ff0000'];

var sum_gpp_of_pix = ee.Image(0).clip(areaOfInterest);

for(var j=1;j<=12;j++){
  var image = gpp_collection                    
  .filter(ee.Filter.eq('month',j))
  .first()
  .select('GPP');
  
  var month_image = image.multiply(30);
  
  var sum_gpp_of_pix = sum_gpp_of_pix.add(month_image);  
}

print('年GPP',sum_gpp_of_pix);
Map.addLayer(sum_gpp_of_pix,{palette:pal2},'sum_gpp_of_pix',0);

// 将年GPP导出
Export.image.toDrive({
  image:sum_gpp_of_pix, 
  description:'heb_yGPP_tif', //文件名
  scale: 10,                      //分辨率
  region: areaOfInterest,
  maxPixels:10000000000000                //此处值设置大一些，防止溢出
});







//-------------------------------------------------------------------统计GPP---------------------------------------------------------------

// ---------------------------------------------------------------使用function&for---------------------------------------------------------
// gpp统计函数（Invalid JSON: ）


//！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！没有选择波段！！！！！！！！！！！！！！！！！！！！！！！！！！
function sumcalculate(image) {
  
  var sum_gpp = image.select('GPP').reduceRegion({
    reducer: ee.Reducer.sum(),
    geometry: areaOfInterest,
    scale: 10,             // 这里填写影像分辨率
    bestEffort: true,      // 如果多边形在给定比例下包含太多像素，则计算并使用更大的比例，这将使操作成功。
    maxPixels:1e10,        // 此处值设置大一些，防止reducer没法计算所有像元
    tileScale:4           // 缩放系数
  });
  
  var month_gpp = ee.Number(sum_gpp.get('GPP'));
  
  image = image.set('sum_gpp',month_gpp);
  
  var month_gpp_cal = month_gpp.multiply(30).divide(10000000000);
  
  image = image.set('sum_gpp_cal',month_gpp_cal);
  
  return image;
}

var sum_collection = gpp_collection.map(sumcalculate);

// print('计算完ROI内GPP总和的影像集',sum_collection);


//以上代码块可行（加入到影像集属性）-------------------------------------------------------------------------------------------------------

var gpp_dict = ee.Dictionary({});

for(var j=1;j<=12;j++){
  var image = sum_collection                    // for将各个年份和月份的影像放到暂时的影像集中
  .filter(ee.Filter.eq('month',j))
  .first()
  .select('GPP');
  
  var sum_gpp = image.get('sum_gpp');  
  var month = ee.String('第'+ j +'个月的总GPP为:');
  gpp_dict = gpp_dict.set(month,sum_gpp);
}

var sum_gpp_collection = sum_collection.set('month_sum_gpp',gpp_dict);
// print('计算完所有所需元素的影像集',sum_gpp_collection);



//----------------------------------------------------分部计算---------------------------------------------------


// 城市GPP贡献函数
function congf_urb_cal(img){
  var GPP = img.select('GPP');
  var LDC = img.select('TYPE_OF_LAND_COVER');

  var Urban_Mask = LDC.eq(7);
  var Urban_area = GPP.updateMask(Urban_Mask);

  var urban = Urban_area.reduceRegion({
    reducer: ee.Reducer.sum(),
    geometry: areaOfInterest,
    scale: 10,             // 这里填写影像分辨率
    bestEffort: true,      // 如果多边形在给定比例下包含太多像素，则计算并使用更大的比例，这将使操作成功。
    maxPixels:1e10,        // 此处值设置大一些，防止reducer没法计算所有像元
    tileScale:4           // 缩放系数
  });

  var urb = ee.Number(urban.get('GPP'));
  var contb_of_urb = urb.divide(img.get('sum_gpp'));
  img = img.set('gpp_of_urb',urb);
  img = img.set('contb_of_urb',contb_of_urb);
  return img;
}

var sum_gpp_collection = sum_gpp_collection.map(congf_urb_cal);
// print('urb_collection',sum_gpp_collection);

// 耕地GPP贡献函数

function congf_cro_cal(img){
  var GPP = img.select('GPP');
  var LDC = img.select('TYPE_OF_LAND_COVER');

  var Crop_Mask = LDC.eq(5);
  var Crop_area = GPP.updateMask(Crop_Mask);

  var crop = Crop_area.reduceRegion({
    reducer: ee.Reducer.sum(),
    geometry: areaOfInterest,
    scale: 10,             // 这里填写影像分辨率
    bestEffort: true,      // 如果多边形在给定比例下包含太多像素，则计算并使用更大的比例，这将使操作成功。
    maxPixels:1e10,        // 此处值设置大一些，防止reducer没法计算所有像元
    tileScale:4           // 缩放系数
  });

  var cro = ee.Number(crop.get('GPP'));
  var contb_of_cro = cro.divide(img.get('sum_gpp'));
  img = img.set('gpp_of_cro',cro);
  img = img.set('contb_of_cro',contb_of_cro);
  return img;
}

var sum_gpp_collection = sum_gpp_collection.map(congf_cro_cal);
// print('cro_collection',sum_gpp_collection);

// 非建成区森林GPP贡献函数

function congf_tre_cal(img){
  var GPP = img.select('GPP');
  var LDC = img.select('TYPE_OF_LAND_COVER');
  
  var Tree_Mask = LDC.eq(2);
  var Tree_area = GPP.updateMask(Tree_Mask);

  var tree = Tree_area.reduceRegion({
    reducer: ee.Reducer.sum(),
    geometry: areaOfInterest,
    scale: 10,             // 这里填写影像分辨率
    bestEffort: true,      // 如果多边形在给定比例下包含太多像素，则计算并使用更大的比例，这将使操作成功。
    maxPixels:1e10,        // 此处值设置大一些，防止reducer没法计算所有像元
    tileScale:4           // 缩放系数
  });
  
  var tre = ee.Number(tree.get('GPP'));
  var contb_of_tre = tre.divide(img.get('sum_gpp'));
  img = img.set('gpp_of_tre',tre);
  img = img.set('contb_of_tre',contb_of_tre);
  return img;
}

var sum_gpp_collection = sum_gpp_collection.map(congf_tre_cal);
// print('tre_collection',sum_gpp_collection);

// 非建成区草地GPP贡献函数

function congf_gra_cal(img){
  var GPP = img.select('GPP');
  var LDC = img.select('TYPE_OF_LAND_COVER');
  
  var Grass_Mask = LDC.eq(3);
  var Grass_area = GPP.updateMask(Grass_Mask);

  var grass = Grass_area.reduceRegion({
    reducer: ee.Reducer.sum(),
    geometry: areaOfInterest,
    scale: 10,             // 这里填写影像分辨率
    bestEffort: true,      // 如果多边形在给定比例下包含太多像素，则计算并使用更大的比例，这将使操作成功。
    maxPixels:1e10,        // 此处值设置大一些，防止reducer没法计算所有像元
    tileScale:4          // 缩放系数
  });

  var gra = ee.Number(grass.get('GPP'));
  var contb_of_gra = gra.divide(img.get('sum_gpp'));
  img = img.set('gpp_of_gra',gra);
  img = img.set('contb_of_gra',contb_of_gra);
  
  return img;
}

var conf_gpp_collection = sum_gpp_collection.map(congf_gra_cal);
// print('贡献影像集',conf_gpp_collection);



// 需要计算每个月的NIRv图像的min(),max(),mean(),出图

function nirv_cor_cal(img){
  var nirv = img.select('NIRv');

  // 制作掩膜
  // 大于0的计入统计
  var masked_nirv = nirv.updateMask(nirv.gt(0));

  var nirv_max = masked_nirv.reduceRegion({
    reducer:ee.Reducer.max(),
    geometry:areaOfInterest,
    scale:10,
    bestEffort:true,
    maxPixels:1e10,
    tileScale:4
  });

  img = img.set('max_of_nirv',nirv_max);

  var nirv_mean = masked_nirv.reduceRegion({
    reducer:ee.Reducer.mean(),
    geometry:areaOfInterest,
    scale:10,
    bestEffort:true,
    maxPixels:1e10,
    tileScale:4
  });

  img = img.set('mean_of_nirv',nirv_mean);

  var nirv_min = masked_nirv.reduceRegion({
    reducer:ee.Reducer.min(),
    geometry:areaOfInterest,
    scale:10,
    bestEffort:true,
    maxPixels:1e10,
    tileScale:4
  });

  img = img.set('min_of_nirv',nirv_min); 

  return img;
}


var nirv_cor_collection = conf_gpp_collection.map(nirv_cor_cal);
// print('贡献&区间影像集',nirv_cor_collection);


// 直接输出属性表格
Export.table.toDrive({
  collection: nirv_cor_collection,
  description: 'heb_csv',
  fileFormat: 'CSV'
}); 

// 导出城市森林植被分类
var urbrestcollection = ee.ImageCollection([]);
var urbrest = ee.Image(1).clip(areaOfInterest);

// var urbrest = urbrestcollection.first();

urbrest = urbrest.where(ESRI_ROI_landcover.neq(7).or(ESRI_ROI_landcover.eq(0)),0);   // non-built area :0
urbrest = urbrest.where(ESRI_ROI_landcover.eq(7).and(type.eq(5)),2);                  // Grass :2
urbrest = urbrest.where(ESRI_ROI_landcover.eq(7).and(type.eq(1)),3);
urbrest = urbrest.where(ESRI_ROI_landcover.eq(7).and(type.eq(2)),4);
urbrest = urbrest.where(ESRI_ROI_landcover.eq(7).and(type.eq(3)),5);
urbrest = urbrest.where(ESRI_ROI_landcover.eq(7).and(type.eq(4)),6);
// urbrest = urbrest.where(ESRI_ROI_landcover.eq(7).and(type.eq(6).or(type.eq(7))).or(type.eq(8)).or(type.eq(9)).or(type.eq(10)).or(type.eq(11)),1);



var pal3 = ['000000','b6b6b6','3ae348','2a83e1','ffaf6a','ffc8b3','4dffdf'];
Map.addLayer(urbrest,{palette:pal3},'urbrest');

Export.image.toDrive({
image:urbrest, //分类结果
description:'type_of_urb_heb', //文件名
scale:10, //分辨率
region:areaOfInterest, //区域
maxPixels:1e13 //此处值设置大一些，防止溢出
});


// 将urbrest作为波段添加至影像集
function addurbrest(image){
  return image.addBands(urbrest.rename('TYPE_OF_urbrest'));
}

var urbrestcollection = nirv_cor_collection.map(addurbrest);


// //*****************************************************************************************************************
// // 统计函数
// function countUrb(img){
//   var urbrest = img.select('TYPE_OF_urbrest');
  
//   // 统计城区面积个数
//   var Urban_mo = urbrest.reduceRegion({
//       reducer: ee.Reducer.count(),
//       geometry: areaOfInterest,
//       scale: 10,             // 这里填写影像分辨率
//       bestEffort: true,      // 如果多边形在给定比例下包含太多像素，则计算并使用更大的比例，这将使操作成功。
//       maxPixels:1e13,        // 此处值设置大一些，防止reducer没法计算所有像元
//       tileScale:2           // 缩放系数
//     }).get('constant');
  
//   Urban_mo = ee.Number(Urban_mo);
//   img = img.set('All',Urban_mo);
  
  
//   // 统计城区裸地占比
//   // 显示裸地
//   Map.addLayer(urbrest.updateMask(urbrest.eq(1)),{palette:'brown'},'BRE');
  
//   var Urb_BRE = urbrest.updateMask(urbrest.eq(1)).reduceRegion({
//       reducer: ee.Reducer.count(),
//       geometry: areaOfInterest,
//       scale: 10,             // 这里填写影像分辨率
//       bestEffort: true,      // 如果多边形在给定比例下包含太多像素，则计算并使用更大的比例，这将使操作成功。
//       maxPixels:1e13,        // 此处值设置大一些，防止reducer没法计算所有像元
//       tileScale:2           // 缩放系数
//     }).get('constant');
//   Urb_BRE = ee.Number(Urb_BRE);
//   img = img.set('BRE',Urb_BRE.divide(Urban_mo));
//   // print('BRE',Urb_BRE.divide(Urban_mo));
  
  
  
  
  
//   // 统计城区草地占比
//   Map.addLayer(urbrest.updateMask(urbrest.eq(2)),{palette:'green'},'Urb_Gra');
  
//   var Urb_Gra = urbrest.updateMask(urbrest.eq(2)).reduceRegion({
//       reducer: ee.Reducer.count(),
//       geometry: areaOfInterest,
//       scale: 10,             // 这里填写影像分辨率
//       bestEffort: true,      // 如果多边形在给定比例下包含太多像素，则计算并使用更大的比例，这将使操作成功。
//       maxPixels:1e13,        // 此处值设置大一些，防止reducer没法计算所有像元
//       tileScale:2           // 缩放系数
//     }).get('constant');
//   Urb_Gra = ee.Number(Urb_Gra);
//   img = img.set('Grass',Urb_Gra.divide(Urban_mo));
//   // print('Grass',Urb_Gra.divide(Urban_mo));
  
  
  
  
  
//   // 统计城区落叶林占比
//   Map.addLayer(urbrest.updateMask(urbrest.eq(3)),{palette:'red'},'Urb_DBF');
  
//   var Urb_DBF = urbrest.updateMask(urbrest.eq(3)).reduceRegion({
//       reducer: ee.Reducer.count(),
//       geometry: areaOfInterest,
//       scale: 10,             // 这里填写影像分辨率
//       bestEffort: true,      // 如果多边形在给定比例下包含太多像素，则计算并使用更大的比例，这将使操作成功。
//       maxPixels:1e13,        // 此处值设置大一些，防止reducer没法计算所有像元
//       tileScale:2           // 缩放系数
//     }).get('constant');
//   Urb_DBF = ee.Number(Urb_DBF);
//   img = img.set('DBF',Urb_DBF.divide(Urban_mo));
//   // print('DBF',Urb_DBF.divide(Urban_mo));
  
  
  
//   // 统计城区混交林占比
//   Map.addLayer(urbrest.updateMask(urbrest.eq(4)),{palette:'blue'},'Urb_MF');
  
//   var Urb_MF = urbrest.updateMask(urbrest.eq(4)).reduceRegion({
//       reducer: ee.Reducer.count(),
//       geometry: areaOfInterest,
//       scale: 10,             // 这里填写影像分辨率
//       bestEffort: true,      // 如果多边形在给定比例下包含太多像素，则计算并使用更大的比例，这将使操作成功。
//       maxPixels:1e13,        // 此处值设置大一些，防止reducer没法计算所有像元
//       tileScale:2           // 缩放系数
//     }).get('constant');
//   Urb_MF = ee.Number(Urb_MF);
//   img = img.set('MF',Urb_MF.divide(Urban_mo));
//   // print('MF',Urb_MF.divide(Urban_mo));
  
  
  
//   // 统计城区常绿林占比
//   Map.addLayer(urbrest.updateMask(urbrest.eq(5)),{palette:'yellow'},'Urb_EBF');
  
//   var Urb_EBF = urbrest.updateMask(urbrest.eq(5)).reduceRegion({
//       reducer: ee.Reducer.count(),
//       geometry: areaOfInterest,
//       scale: 10,             // 这里填写影像分辨率
//       bestEffort: true,      // 如果多边形在给定比例下包含太多像素，则计算并使用更大的比例，这将使操作成功。
//       maxPixels:1e13,        // 此处值设置大一些，防止reducer没法计算所有像元
//       tileScale:2           // 缩放系数
//     }).get('constant');
//   Urb_EBF = ee.Number(Urb_EBF);
//   img = img.set('EBF',Urb_EBF.divide(Urban_mo));
//   // print('EBF',Urb_EBF.divide(Urban_mo));
  
  
  
  
//   // 统计城区针叶林占比
//   Map.addLayer(urbrest.updateMask(urbrest.eq(6)),{palette:'pink'},'Urb_ENF');
  
//   var Urb_ENF = urbrest.updateMask(urbrest.eq(6)).reduceRegion({
//       reducer: ee.Reducer.count(),
//       geometry: areaOfInterest,
//       scale: 10,             // 这里填写影像分辨率
//       bestEffort: true,      // 如果多边形在给定比例下包含太多像素，则计算并使用更大的比例，这将使操作成功。
//       maxPixels:1e13,        // 此处值设置大一些，防止reducer没法计算所有像元
//       tileScale:2           // 缩放系数
//     }).get('constant');
//   Urb_ENF = ee.Number(Urb_ENF);
//   img = img.set('ENF',Urb_ENF.divide(Urban_mo));
//   // print('ENF',Urb_ENF.divide(Urban_mo));
  
//   return img;
// }


// // print(urbrestcollection);

// var countcollection = urbrestcollection.map(countUrb);
// //*****************************************************************************************************************

var count_dict = ee.Dictionary({});

// 统计城区面积个数
var Urban_mo = ESRI_ROI_landcover.updateMask(ESRI_ROI_landcover.eq(7)).reduceRegion({
    reducer: ee.Reducer.count(),
    geometry: areaOfInterest,
    scale: 10,             // 这里填写影像分辨率
    bestEffort: true,      // 如果多边形在给定比例下包含太多像素，则计算并使用更大的比例，这将使操作成功。
    maxPixels:1e13,        // 此处值设置大一些，防止reducer没法计算所有像元
    tileScale:2           // 缩放系数
  }).get('b1');
// .get('constant')

print(Urban_mo);

Map.addLayer(ESRI_ROI_landcover.updateMask(ESRI_ROI_landcover.eq(7)),{palette:'cyan'},'Urban');
Urban_mo = ee.Number(Urban_mo);
count_dict = count_dict.set('All',Urban_mo);


// 统计城区裸地占比
// 显示裸地
Map.addLayer(urbrest.updateMask(urbrest.eq(1)),{palette:'brown'},'BRE');

var Urb_BRE = urbrest.updateMask(urbrest.eq(1)).reduceRegion({
    reducer: ee.Reducer.count(),
    geometry: areaOfInterest,
    scale: 10,             // 这里填写影像分辨率
    bestEffort: true,      // 如果多边形在给定比例下包含太多像素，则计算并使用更大的比例，这将使操作成功。
    maxPixels:1e13,        // 此处值设置大一些，防止reducer没法计算所有像元
    tileScale:2           // 缩放系数
  }).get('constant');
Urb_BRE = ee.Number(Urb_BRE);
count_dict = count_dict.set('BRE',Urb_BRE.divide(Urban_mo));
// print('BRE',Urb_BRE.divide(Urban_mo));





// 统计城区草地占比
Map.addLayer(urbrest.updateMask(urbrest.eq(2)),{palette:'green'},'Urb_Gra');

var Urb_Gra = urbrest.updateMask(urbrest.eq(2)).reduceRegion({
    reducer: ee.Reducer.count(),
    geometry: areaOfInterest,
    scale: 10,             // 这里填写影像分辨率
    bestEffort: true,      // 如果多边形在给定比例下包含太多像素，则计算并使用更大的比例，这将使操作成功。
    maxPixels:1e13,        // 此处值设置大一些，防止reducer没法计算所有像元
    tileScale:2           // 缩放系数
  }).get('constant');
Urb_Gra = ee.Number(Urb_Gra);
count_dict = count_dict.set('Grass',Urb_Gra.divide(Urban_mo));
// print('Grass',Urb_Gra.divide(Urban_mo));





// 统计城区落叶林占比
Map.addLayer(urbrest.updateMask(urbrest.eq(3)),{palette:'red'},'Urb_DBF');

var Urb_DBF = urbrest.updateMask(urbrest.eq(3)).reduceRegion({
    reducer: ee.Reducer.count(),
    geometry: areaOfInterest,
    scale: 10,             // 这里填写影像分辨率
    bestEffort: true,      // 如果多边形在给定比例下包含太多像素，则计算并使用更大的比例，这将使操作成功。
    maxPixels:1e13,        // 此处值设置大一些，防止reducer没法计算所有像元
    tileScale:2           // 缩放系数
  }).get('constant');
Urb_DBF = ee.Number(Urb_DBF);
count_dict = count_dict.set('DBF',Urb_DBF.divide(Urban_mo));
// print('DBF',Urb_DBF.divide(Urban_mo));



// 统计城区混交林占比
Map.addLayer(urbrest.updateMask(urbrest.eq(4)),{palette:'blue'},'Urb_MF');

var Urb_MF = urbrest.updateMask(urbrest.eq(4)).reduceRegion({
    reducer: ee.Reducer.count(),
    geometry: areaOfInterest,
    scale: 10,             // 这里填写影像分辨率
    bestEffort: true,      // 如果多边形在给定比例下包含太多像素，则计算并使用更大的比例，这将使操作成功。
    maxPixels:1e13,        // 此处值设置大一些，防止reducer没法计算所有像元
    tileScale:2           // 缩放系数
  }).get('constant');
Urb_MF = ee.Number(Urb_MF);
count_dict = count_dict.set('MF',Urb_MF.divide(Urban_mo));
// print('MF',Urb_MF.divide(Urban_mo));



// 统计城区常绿林占比
Map.addLayer(urbrest.updateMask(urbrest.eq(5)),{palette:'yellow'},'Urb_EBF');

var Urb_EBF = urbrest.updateMask(urbrest.eq(5)).reduceRegion({
    reducer: ee.Reducer.count(),
    geometry: areaOfInterest,
    scale: 10,             // 这里填写影像分辨率
    bestEffort: true,      // 如果多边形在给定比例下包含太多像素，则计算并使用更大的比例，这将使操作成功。
    maxPixels:1e13,        // 此处值设置大一些，防止reducer没法计算所有像元
    tileScale:2           // 缩放系数
  }).get('constant');
Urb_EBF = ee.Number(Urb_EBF);
count_dict = count_dict.set('EBF',Urb_EBF.divide(Urban_mo));
// print('EBF',Urb_EBF.divide(Urban_mo));




// 统计城区针叶林占比
Map.addLayer(urbrest.updateMask(urbrest.eq(6)),{palette:'pink'},'Urb_ENF');

var Urb_ENF = urbrest.updateMask(urbrest.eq(6)).reduceRegion({
    reducer: ee.Reducer.count(),
    geometry: areaOfInterest,
    scale: 10,             // 这里填写影像分辨率
    bestEffort: true,      // 如果多边形在给定比例下包含太多像素，则计算并使用更大的比例，这将使操作成功。
    maxPixels:1e13,        // 此处值设置大一些，防止reducer没法计算所有像元
    tileScale:2           // 缩放系数
  }).get('constant');
Urb_ENF = ee.Number(Urb_ENF);
count_dict = count_dict.set('ENF',Urb_ENF.divide(Urban_mo));
// print('ENF',Urb_ENF.divide(Urban_mo));


var countcollection = urbrestcollection.set('count_urb_num',count_dict);

// print(countcollection);


// 将字典转换为特征对象
var feature = ee.Feature(null, count_dict);

// 创建包含特征的特征集合
var featureCollection = ee.FeatureCollection([feature]);

// 导出特征集合作为CSV文件到Google Drive
Export.table.toDrive({
  collection: featureCollection,
  description: 'dictionary_csv_heb',
  fileFormat: 'CSV'
});

//-----------------------------------------------------------------------------------------------------------------------------

var all_type_dict = ee.Dictionary({});

// 统计常绿/落叶/混交/灌木/农田/草地/湿地
var all_type = type.reduceRegion({
    reducer: ee.Reducer.count(),
    geometry: areaOfInterest,
    scale: 10,             // 这里填写影像分辨率
    bestEffort: true,      // 如果多边形在给定比例下包含太多像素，则计算并使用更大的比例，这将使操作成功。
    maxPixels:1e13,        // 此处值设置大一些，防止reducer没法计算所有像元
    tileScale:2           // 缩放系数
  }).get('constant');
all_type = ee.Number(all_type);
all_type_dict = all_type_dict.set('all_type_num',all_type);



var all_DBF = type.updateMask(type.eq(1)).reduceRegion({
    reducer: ee.Reducer.count(),
    geometry: areaOfInterest,
    scale: 10,             // 这里填写影像分辨率
    bestEffort: true,      // 如果多边形在给定比例下包含太多像素，则计算并使用更大的比例，这将使操作成功。
    maxPixels:1e13,        // 此处值设置大一些，防止reducer没法计算所有像元
    tileScale:2           // 缩放系数
  }).get('constant');
  all_DBF = ee.Number(all_DBF);
  all_type_dict = all_type_dict.set('all_DBF_num',all_DBF);
  
  
  
var all_MF = type.updateMask(type.eq(2)).reduceRegion({
    reducer: ee.Reducer.count(),
    geometry: areaOfInterest,
    scale: 10,             // 这里填写影像分辨率
    bestEffort: true,      // 如果多边形在给定比例下包含太多像素，则计算并使用更大的比例，这将使操作成功。
    maxPixels:1e13,        // 此处值设置大一些，防止reducer没法计算所有像元
    tileScale:2           // 缩放系数
  }).get('constant');
  all_MF = ee.Number(all_MF);
  all_type_dict = all_type_dict.set('all_MF_num',all_MF);
  
  

var all_EBF = type.updateMask(type.eq(3).or(type.eq(4))).reduceRegion({
    reducer: ee.Reducer.count(),
    geometry: areaOfInterest,
    scale: 10,             // 这里填写影像分辨率
    bestEffort: true,      // 如果多边形在给定比例下包含太多像素，则计算并使用更大的比例，这将使操作成功。
    maxPixels:1e13,        // 此处值设置大一些，防止reducer没法计算所有像元
    tileScale:2           // 缩放系数
  }).get('constant');
  all_EBF = ee.Number(all_EBF);
  all_type_dict = all_type_dict.set('all_EBF_num',all_EBF);
  
  

var all_BUS = type.updateMask(type.eq(8)).reduceRegion({
    reducer: ee.Reducer.count(),
    geometry: areaOfInterest,
    scale: 10,             // 这里填写影像分辨率
    bestEffort: true,      // 如果多边形在给定比例下包含太多像素，则计算并使用更大的比例，这将使操作成功。
    maxPixels:1e13,        // 此处值设置大一些，防止reducer没法计算所有像元
    tileScale:2           // 缩放系数
  }).get('constant');
  all_BUS = ee.Number(all_BUS);
  all_type_dict = all_type_dict.set('all_BUS_num',all_BUS);
  
  
  
var all_CRO = type.updateMask(type.eq(7)).reduceRegion({
    reducer: ee.Reducer.count(),
    geometry: areaOfInterest,
    scale: 10,             // 这里填写影像分辨率
    bestEffort: true,      // 如果多边形在给定比例下包含太多像素，则计算并使用更大的比例，这将使操作成功。
    maxPixels:1e13,        // 此处值设置大一些，防止reducer没法计算所有像元
    tileScale:2           // 缩放系数
  }).get('constant');
  all_CRO = ee.Number(all_CRO);
  all_type_dict = all_type_dict.set('all_CRO_num',all_CRO);
  
  
  
var all_GRA = type.updateMask(type.eq(5)).reduceRegion({
    reducer: ee.Reducer.count(),
    geometry: areaOfInterest,
    scale: 10,             // 这里填写影像分辨率
    bestEffort: true,      // 如果多边形在给定比例下包含太多像素，则计算并使用更大的比例，这将使操作成功。
    maxPixels:1e13,        // 此处值设置大一些，防止reducer没法计算所有像元
    tileScale:2           // 缩放系数
  }).get('constant');
  all_GRA = ee.Number(all_GRA);
  all_type_dict = all_type_dict.set('all_GRA_num',all_GRA);
  
  
  
var all_WET = type.updateMask(type.eq(6)).reduceRegion({
    reducer: ee.Reducer.count(),
    geometry: areaOfInterest,
    scale: 10,             // 这里填写影像分辨率
    bestEffort: true,      // 如果多边形在给定比例下包含太多像素，则计算并使用更大的比例，这将使操作成功。
    maxPixels:1e13,        // 此处值设置大一些，防止reducer没法计算所有像元
    tileScale:2           // 缩放系数
  }).get('constant');
  all_WET = ee.Number(all_WET);
  all_type_dict = all_type_dict.set('all_WET_num',all_WET);
  

all_type_dict = all_type_dict.set('all_DBF_conf',all_DBF.divide(all_type));
all_type_dict = all_type_dict.set('all_MF_conf',all_MF.divide(all_type));
all_type_dict = all_type_dict.set('all_EBF_conf',all_EBF.divide(all_type));
all_type_dict = all_type_dict.set('all_BUS_conf',all_BUS.divide(all_type));
all_type_dict = all_type_dict.set('all_CRO_conf',all_CRO.divide(all_type));
all_type_dict = all_type_dict.set('all_GRA_conf',all_GRA.divide(all_type));
all_type_dict = all_type_dict.set('all_WET_conf',all_WET.divide(all_type));

// 将字典转换为特征对象
var feature_all = ee.Feature(null, all_type_dict);

// 创建包含特征的特征集合
var featureCollection_all = ee.FeatureCollection([feature_all]);

// 导出特征集合作为CSV文件到Google Drive
Export.table.toDrive({
  collection: featureCollection_all,
  description: 'dictionary_all_csv_heb',
  fileFormat: 'CSV'
});