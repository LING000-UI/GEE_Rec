//显示参数设置
var imageVisParam_ESRI = {"opacity":1,"bands":["b1"],"min":1,"max":10,"palette":["8dffda","14ff31","686dff","ff9b54","ff712d","ff66b4"]};

//浏览全球土地覆盖数据
var ESRI = ee.ImageCollection("projects/sat-io/open-datasets/landcover/ESRI_Global-LULC_10m")
Map.addLayer(ESRI,imageVisParam_ESRI,"ESRI_landcover",0)

//导入研究区
var ROI  =  ee.FeatureCollection("users/kitmyfaceplease2/lezhixian").geometry()
Map.centerObject(ROI, 8)
Map.addLayer(ROI, {color: 'FF0000', fillColor: '00000000', width: 1}, "ROI")

//筛选数据             
var ESRI_ROI_landcover=ESRI
              .filterBounds(ROI)
              .mosaic()
              .clip(ROI)

//研究区土地覆盖影像
Map.addLayer(ESRI_ROI_landcover,imageVisParam_ESRI,"ESRI_ROI_landcover",0)

//下载
Export.image.toDrive({
    image:ESRI_ROI_landcover,
    description: "ESRI_ROI_landcover",
    region:ROI,
    scale:10,
    maxPixels:1e13
});

// 逻辑运算提取建成区

var build = ee.Image(0).clip(ROI);

build = build.where(ESRI_ROI_landcover.eq(7),1);

Map.addLayer(build,{palette:['black','red']},'build_area');

var ESRI_ROI_landcover = ESRI_ROI_landcover.where(build.eq(1),0);


var city = ESRI_ROI_landcover;

Map.addLayer(city,{palette:['white','blue','green','brown','yellow','red']},'city');