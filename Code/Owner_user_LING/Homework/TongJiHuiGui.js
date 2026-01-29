/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var table = ee.FeatureCollection("projects/ee-glj320104/assets/Provincial/YunNan");
/***** End of imports. If edited, may not auto-convert in the playground. *****/
var roi = table;
Map.centerObject(roi,6);
Map.addLayer(roi,{},"yunnan");

/*import the dataset*/
var TMP_C = ee.ImageCollection('MODIS/061/MOD11A2')
              .filter(ee.Filter.date('2012-01-01', '2022-01-01'))
              .select('LST_Day_1km');
              
var NDVI_C = ee.ImageCollection('MODIS/061/MOD13A1')
                .filter(ee.Filter.date('2012-01-01', '2022-01-01'))
                .select('NDVI');
    

    
    
/*create the yearly data*/
var TMP_yec = ee.ImageCollection([]);
var NDVI_yec = ee.ImageCollection([]);

for(var i=2012;i<2022;i++){
  var TMP_yec = TMP_yec.merge(ee.ImageCollection([
                TMP_C
                .filter(ee.Filter.calendarRange(i,i,'year'))
                .median().clip(roi).multiply(0.02).subtract(273.15)]
                ));
                
  var NDVI_yec = NDVI_yec.merge(ee.ImageCollection([
                NDVI_C
                .filter(ee.Filter.calendarRange(i,i,'year'))
                .median().clip(roi)]
                )); 
}

/*define the visual*/
var landSurfaceTemperatureVis = {
  min: 0,
  max: 16000.0,
  palette: [
    '040274', '040281', '0502a3', '0502b8', '0502ce', '0502e6',
    '0602ff', '235cb1', '307ef3', '269db1', '30c8e2', '32d3ef',
    '3be285', '3ff38f', '86e26f', '3ae237', 'b5e22e', 'd6e21f',
    'fff705', 'ffd611', 'ffb613', 'ff8b13', 'ff6e08', 'ff500d',
    'ff0000', 'de0101', 'c21301', 'a71001', '911003'
  ],
};


var ndviVis = {
  min: 0,
  max: 9000,
  palette: [
    'ffffff', 'ce7e45', 'df923d', 'f1b555', 'fcd163', '99b718', '74a901',
    '66a000', '529400', '3e8601', '207401', '056201', '004c00', '023b01',
    '012e01', '011d01', '011301'
  ],
};


var palettes = require('users/gena/packages:palettes');
var pal = palettes.kovesi.rainbow_bgyr_35_85_c72 [7];




/*check the yearly temp data*/
Map.addLayer(TMP_yec.first(),landSurfaceTemperatureVis,"TMP_yec",0);
Map.addLayer(NDVI_yec.first(),ndviVis,"NDVI_yec",0);



/*start the analysis*/
/*define the function*/

// 影像与对应索引的积函数，返回影像集
function Fun_1(img){
  var i = 1;
  img = img.multiply(i);
  i = i++;
  return img;
}

// 求影像的平方
function Fun_7(img){
  return img.multiply(img);
}


// 影像集求和函数，返回求和的一景影像
function Fun_2(img_C){
  return img_C.sum();
}


// 索引求和函数，返回一个和
function Fun_3(num){
  var sum = 0;
  for (var i = 1; i <= num; i++) {
    sum += i;
  }
  return sum;
}

// 索引求和函数，返回一个平方和
function Fun_4(num){
  var sum = 0;
  for (var i = 1; i <= num; i++) {
    sum += i*i;
  }
  return sum;
}

// 索引求和函数，返回一个和平方
function Fun_5(num){
  var value = Fun_3(num)*Fun_3(num);
  return value;
}


// 计算数字的平均数
function Fun_6(num){
  var value = Fun_3(num)/num;
  return value;
}





/*------------------           温度变化趋势分析          ------------------*/
function Qushi_ana(img_C,num){
  var P1 = Fun_2(img_C.map(Fun_1));
  var P2 = Fun_2(img_C).multiply(Fun_3(num)).divide(num);
  var P3 = Fun_4(num);
  var P4 = Fun_5(num)/num;
  
  var final = (P1.subtract(P2)).divide(P3-P4);
  
  return final;
}

var num = 10;

var TMP_Trends = Qushi_ana(TMP_yec,num).reproject({crs:"EPSG:4326",scale:500});
Map.addLayer(TMP_Trends,landSurfaceTemperatureVis,"QU",0);




/*------------------           温度变化显著性检验          ------------------*/
// Fa = 5.31
function FP1_cal(one,two,three,num){
  var sum = ee.Image(0);
  for(var i = 0;i<=num;i++){
    var temp = one.add(two.multiply(i)).subtract(three);
    sum = sum.add(temp.multiply(temp));
  }
  return sum;
}


function FP2_cal(img){
  var i = 1;
  var temp = img.subtract(belta0).subtract(TMP_Trends.multiply(i));
  var final = temp.multiply(temp);
  i++;
  return final;
}



var Mean_TMP = Fun_2(TMP_yec).divide(num);
var mean_indx = Fun_6(num);

var belta0 = Mean_TMP.subtract(TMP_Trends.multiply(mean_indx));

var FP1 = FP1_cal(belta0,TMP_Trends,mean_indx,num);
var FP2 = Fun_2(TMP_yec.map(FP2_cal));

var F = FP1.divide(FP2).multiply(8);

var F_mask = ee.Image(0).clip(roi);
F_mask = F_mask.where(F.lt(5.31),0);
F_mask = F_mask.where(F.gte(5.31),1).reproject({crs:"EPSG:4326",scale:500});
Map.addLayer(F_mask,{min:0,max:1,palette:['black','red']},"F_mask");



/*----------------         气温与NDVI变化相关性分析          ----------------*/
function R_Part_1(TMP_C,NDVI_C){
  var TMP_L = TMP_C.toList(TMP_C.size());
  var NDVI_L = NDVI_C.toList(NDVI_C.size());
  
  var part1 = ee.Image(0);
  
  for(var i=0;i<=9;i++){
    var temp1 = ee.Image(TMP_L.get(i));
    var temp2 = ee.Image(NDVI_L.get(i));
    part1 = part1.add(temp1.multiply(temp2));
  }
  
  part1 = part1.multiply(TMP_L.length());
  return part1;
}


function R_Part_3(TMP_C){
  var temp1 = Fun_2(TMP_C.map(Fun_7)).multiply(TMP_C.size());
  var temp2 = Fun_2(TMP_C).multiply(Fun_2(TMP_C));
  var temp3 = temp1.subtract(temp2);
  
  return temp3.sqrt();
}



var R_p1 = R_Part_1(TMP_yec,NDVI_yec); 
var R_p2 = Fun_2(TMP_yec).multiply(Fun_2(NDVI_yec));
var R_p3 = R_Part_3(TMP_yec);
var R_p4 = R_Part_3(NDVI_yec);


var R_tmp_ndvi = (R_p1.subtract(R_p2)).divide(R_p3.multiply(R_p4)).reproject({crs:"EPSG:4326",scale:500});
Map.addLayer(R_tmp_ndvi,{min:-1,max:1,palette:pal},"R_tmp_ndvi");



/*----------------         气温与NDVI变化相关性显著性检验          ----------------*/

function R_F(img){
  var abs = img.abs();
  var img_1 = ee.Image(1);
  var img_14 = ee.Image(14);
  
  var hou = img_14.divide(img_1.subtract(img.multiply(img))).sqrt();
  
  var final = abs.multiply(hou);
  return final;
  
}


var Rtes = R_F(R_tmp_ndvi);
Map.addLayer(Rtes,{min:-1,max:1,palette:pal},"Rtes");


// reclass 1.8595 2.3060 3.3554
// var Rtes_recla = ee.Image(0);

var Rtes_recla = Rtes.where(Rtes.gte(0).and(Rtes.lte(1.8595)),1);
Rtes_recla = Rtes.where(Rtes.gte(1.8595).and(Rtes.lte(2.3060)),2);
Rtes_recla = Rtes.where(Rtes.gte(2.3060).and(Rtes.lte(3.3554)),3);
Rtes_recla = Rtes.where(Rtes.gte(3.3554),4).reproject({crs:"EPSG:4326",scale:500});

Map.addLayer(Rtes_recla,{min:1,max:4,palette:pal},"Rtes_recla");




/*  export */
Export.image.toDrive({
  image:TMP_Trends, //分类结果
  description:"QU_TMP_Trends", //文件名
  scale:500, //分辨率
  region:roi, //区域
  maxPixels:1e13 //此处值设置大一些，防止溢出
});


Export.image.toDrive({
  image:F_mask, //分类结果
  description:"F_mask", //文件名
  scale:500, //分辨率
  region:roi, //区域
  maxPixels:1e13 //此处值设置大一些，防止溢出
});



Export.image.toDrive({
  image:R_tmp_ndvi, //分类结果
  description:"R_tmp_ndvi", //文件名
  scale:500, //分辨率
  region:roi, //区域
  maxPixels:1e13 //此处值设置大一些，防止溢出
});



Export.image.toDrive({
  image:Rtes, //分类结果
  description:"Rtes", //文件名
  scale:500, //分辨率
  region:roi, //区域
  maxPixels:1e13 //此处值设置大一些，防止溢出
});




Export.image.toDrive({
  image:Rtes_recla, //分类结果
  description:"Rtes_recla", //文件名
  scale:500, //分辨率
  region:roi, //区域
  maxPixels:1e13 //此处值设置大一些，防止溢出
});










