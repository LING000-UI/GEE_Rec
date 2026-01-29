

var roi = table.geometry()

//切割实验区函数
function gridSplitMN(roi, n, m) {
  var coordinateList = roi.bounds().coordinates().flatten();
  var xmin = coordinateList.get(0).getInfo();
  var ymin = coordinateList.get(1).getInfo();
  var xmax = coordinateList.get(4).getInfo();
  var ymax = coordinateList.get(5).getInfo();
  // Get dx & dy.
  var dx = (xmax-xmin)/n;
  var dy = (ymax-ymin)/m;
  // Generate all the rects.
  var gridList=ee.List([]);
  var fid = 0;
  for(var i=0;i<n;i++)
  {
    for(var j=0;j<m;j++)
    { 
      if(i==n-1)
      {
        if(j == m-1)
        { 
          var coords=[xmin+i*dx,ymin+j*dy,xmax,ymax];
        }
        else {
          var coords=[xmin+i*dx,ymin+j*dy,xmax,ymin+(j+1)*dy]
        }
      }
      else if (j==m-1)
      {
        var coords=[xmin+i*dx,ymin+j*dy,xmin+(i+1)*dx,ymax]
      }
      else
      {
        var coords=[xmin+i*dx,ymin+j*dy,xmin+(i+1)*dx,ymin+(j+1)*dy]
      }
      var rect = ee.Feature(ee.Algorithms.GeometryConstructors.Rectangle(ee.List(coords)));
      
      // Filter.
      if(rect.intersects(roi).getInfo()) {
        var intersect = rect.intersection(roi);
        intersect = intersect.set('grid_id', fid);
        fid++;
        gridList=gridList.add(intersect);
      }
    }
  }
  // Return.返回要素集
  return ee.FeatureCollection(gridList);
}


// 定位缩放
Map.centerObject(table, 9);

//设置显示样式：color代表边界颜色；fillcolor代表填充颜色（白）
var styling={color:'red',fillColor:'00000000'};

// 加载总区域
Map.addLayer(table.style(styling),{},"Roi_Boundary");


// // 加载区块
// Map.addLayer(roi,{},'roi_Boundary');

// print(roi);


// // 分割系数
// var x = 4;
// var y = 4;

// // 测试：使用for循环将区块展示出来：(失败)
// for(var i = 0; i <= x*y - 1; i++){
//     roi = gridSplitMN(roi, x, y).filterMetadata('grid_id', 'equals', i).first().geometry();
//     Map.addLayer(roi,{},'roi_Boundary');
// }


// 直接for循环遍历要素集

// // 将研究区分为4*4=16个格子，选择第11个格子做研究区（其实是第10块，从索引0开始）
// roi = gridSplitMN(roi, 4, 4).filterMetadata('grid_id', 'equals', 11).first().geometry();

// 分割系数
var x = 4;
var y = 4;

// 分割成x*y个区块要素集
var roi_colletion = gridSplitMN(roi, x, y);

// 循环遍历要素集
for(var k = 0; k <= x*y - 1; k++){
    var roi = roi_colletion.filterMetadata('grid_id', 'equals', k).first().geometry();
    // 加载区块
    Map.addLayer(roi,{},'roi_Boundary');




    // -------------------------------------------------------计算2022年所有影像的NDVI--------------------------------------------------------


    // 定义感兴趣区域
    var areaOfInterest = roi; // 根据您的需求替换为适当的几何图形或边界
    // var water = WATER;
    // Map.centerObject(areaOfInterest,9);

    // 加载Sentinel-2影像集并筛选时间范围（2022年全年）
    var imageCollection = ee.ImageCollection('COPERNICUS/S2_SR')
    .filterBounds(areaOfInterest)
    .filterDate('2022-01-01', '2022-12-31');

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
        var secli = image.select('B8','NDVI','NIRv').rename('nir','NDVI','NIRv');
        return secli;
    }

    // 将计算NDVI函数应用于影像集中的所有影像
    var ndviCollection = imageCollection.map(calculateNDVI);
    var nirvCollection = ndviCollection.map(calculateNIRv);
    var SecCollection = nirvCollection.map(secl);
    print('第一次预处理后的年影像集',SecCollection);

    // 调色板
    var pal = ['1ea0ff','f7ff86','aeff45','45ff0a','73dadf','75ed9a','fe82ff','ffb251','ffd6b3','c69e60','d8fff6','ecfffa'];
    // var pal = ['blue','green','cyan','yellow','pink','red'];


    // 检查NIRv
    Map.addLayer(SecCollection.mosaic().clip(areaOfInterest),{bands:'NIRv',palette:pal},'SecCollection',0);
    // 输出正常

    // --------------------------------------------将预处理后的Collection中的影像按照日期放入每个月的影像集中------------------------------------
    // 直接在循环中处理,处理好的Image再导出来

    // 循环外创建一个集合，将最大合成影像添加进这个集合中
    var max_list = ee.List([]);

    for(var i=2022;i<=2022;i++){
    
    for(var j=1;j<=12;j++){
        
        var data_collection = SecCollection                    // 将各个年份和月份的影像放到暂时的影像集中
        .filter(ee.Filter.calendarRange(i, i, 'year'))    // 这连两个过滤器可以互换位置
        .filter(ee.Filter.calendarRange(j,  j,'month'))
        .map(function(img)  // 此方法给影像增加了一个year的字段
        {
        return img.set('year', img.date().get('year'),'month',img.date().get('month'));
        }
        )
        // print('第'+j+'个月的影像集',data_collection);
        //  使用最大合成法得到每个月一幅最大的NDVI和NIRV影像    // 给最大合成影像创个月份属性
        var max_image = data_collection.max().set('month',j);

        max_list = max_list.add(max_image);   // 需要返回赋值add（）是有返回值的，并不会直接修改原始list的元素

    }
    }

    print('存放12个月max影像的list',max_list);        // 成功
    // 创建一个影像集，使用ee.ImageCollection方法将list赋值给它
    var max_collection = ee.ImageCollection.fromImages(max_list);
    print('存放12个月max影像的collection',max_collection);  // 成功，得到了2022年12个月的三波段影像

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
    
    var esri_collection = max_collection.map(addesri);
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

    var ndvi8 = max_collection.filter(ee.Filter.eq('month',8)).first().select('NDVI');
    var ndvi12 = max_collection.filter(ee.Filter.eq('month',12)).first().select('NDVI');

    print('8月份影像的ndvi波段',ndvi8);
    print('12月份影像的ndvi波段',ndvi12);

    Map.addLayer(ndvi8.clip(areaOfInterest),{bands:'NDVI',palette:pal},'img8_of_ndvi',0);
    Map.addLayer(ndvi12.clip(areaOfInterest),{bands:'NDVI',palette:pal},'img12_of_ndvi',0);

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
    
      return image.addBands(gpp.rename('GPP'));
    }

    var gpp_collection = type_collection.map(gppcalculate);

    print('计算gpp波段后的最大合成影像集',gpp_collection);

    // -----------------------------------------------------------------裁剪函数--------------------------------------------------------------
    function clipROI(image) {
    // return image.clip(areaOfInterest).clip(water);  // 先裁剪出南京市行政区
    // return image.clip(water);                       // 裁剪出的是水体
    return image.clip(areaOfInterest);                 // 不切割，整块区域计算
    // return image.clip(areaOfInterest).clip(image.clip(water).geometry());  // 先先裁剪出南京市行政区，然后在裁剪（裁剪出的水体的geometry）ERROR用于图像剪切的几何体必须是有边界的。
    }

    var cut_collection = gpp_collection.map(clipROI);
    print('裁剪后的影像集',cut_collection);




    // 监视一个月的最大的GPP影像（第一个月）
    var view_gpp = cut_collection.first().select('GPP');

    Map.addLayer(view_gpp,{palette:pal},'gpp');

    //------------------------------------------------------需要计算12个月份叠加起来的一个图层值-----------------------------------------------
    var pal2 = ['0500ff','4359ff','4ba3ff','72ebff','95ffdd','69e343','f0ff7e','ffd586','ff8568','ff0000'];

    var sum_gpp_of_pix = ee.Image(0).clip(areaOfInterest);

    for(var j=1;j<=12;j++){
    var image = cut_collection                    
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
    description:'year_gpp_gz'+ k, //文件名
    scale: 10,                      //分辨率
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

    var sum_collection = cut_collection.map(sumcalculate);

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







    // //----------------------------------------------------------------------
    // // Too many concurrent aggregations.并发聚合过多。需要设置更大一点的分包系数

    // 直接输出属性表格
    // Export.table.toDrive({
    //   collection: conf_gpp_collection,
    //   description: 'conf_gpp_collection_XN',
    //   fileFormat: 'CSV'
    // });
    // //----------------------------------------------------------------------







    // 需要计算每个月的NIRv图像的min(),max(),mean(),出图

    function nirv_cor_cal(img){
    var nirv = img.select('NIRv');

    // 制作掩膜

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


      // // 直接输出属性表格
      // Export.table.toDrive({
      // collection: nirv_cor_collection,
      // description: 'gz_csv'+ k,
      // fileFormat: 'CSV'
      // }); 
}