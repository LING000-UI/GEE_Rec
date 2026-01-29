var roi = ee.FeatureCollection("projects/gee-hq1018/assets/HuaduGarde")
Map.addLayer(roi,{},"huapoGarde_polygon")

//MOD17A3HGF产品下的NPP产品,1年/幅,分辨率为500米
function ModisNPPyr(roi, startTime, endTime) 
{
    startTime = ee.Date(startTime).millis();
    endTime = ee.Date(endTime).millis();

    var dataset = ee.ImageCollection("MODIS/006/MOD17A3HGF")
        .filter(ee.Filter.date(startTime, endTime))
        .filterBounds(roi)
        .select('Npp')
        .map(function (image) 
        {
            return image.clip(roi)
        });
    return dataset
}

//MOD17A2H产品下的NPP产品,8天/幅,分辨率为500米
function ModisNPPday(roi, startTime, endTime) 
{
    startTime = ee.Date(startTime).millis();
    endTime = ee.Date(endTime).millis();

    var dataset = ee.ImageCollection("MODIS/006/MOD17A2H")
        .filter(ee.Filter.date(startTime, endTime))
        .filterBounds(roi)
        .select('PsnNet')
        .map(function (image) 
        {
            return image.clip(roi)
        });
    return dataset
}

//MODIS13Q1产品下的NDVI和EVI产品,16天/幅,分辨率为250米
function ModisNDVI(roi, startTime, endTime) 
{
    startTime = ee.Date(startTime).millis();
    endTime = ee.Date(endTime).millis();

    var Modis_250 = ee.ImageCollection('MODIS/061/MOD13Q1')
        .filterDate(startTime, endTime)
        .select("NDVI")
        // .select('EVI')
        .filterBounds(roi)
        .map(function (image) 
        {
            return image.clip(roi)
        })
    return Modis_250
}

//MOD15A2H产品下的LAI产品,8天/幅,分辨率为500米
function ModisLAI(roi, startTime, endTime) 
{
    startTime = ee.Date(startTime).millis();
    endTime = ee.Date(endTime).millis();

    var dataset = ee.ImageCollection('MODIS/061/MOD15A2H')
        .filter(ee.Filter.date(startTime, endTime))
        .filterBounds(roi)
        .select('Lai_500m')
        .map(function (image) 
        {
            return image.clip(roi)
        });
    return dataset
}

//----------------------数据批量输出函数-----------------------//  
function exportImageCollection(imgCol, scale, roi, taskName, fileName) 
{
    var indexList = imgCol.reduceColumns(ee.Reducer.toList(), ["system:index"]).get("list");
    indexList.evaluate(function (indexs) 
    {
        for (var i = 0; i < indexs.length; i++) 
        {
            var image = imgCol.filter(ee.Filter.eq("system:index", indexs[i])).first();
            image = image.toInt16(); //
            Export.image.toDrive({
                image: image,
                description: taskName + "_" + indexs[i],
                fileNamePrefix: fileName + "_" + indexs[i],
                region: roi,
                scale: scale,
                crs: "EPSG:4326",
                maxPixels: 1e13
            });
        }
    });
}

// 批量显示图像(单波段)
function BatchMap(IC, visParam, listLimt, preName) 
{
    function getICByIndex(IC, index) {
        return ee.Image(IC.toList(1, index).get(0));
    }
    for (var i = 0; i < IC.toList(listLimt).length().getInfo(); i++) {
        var image = getICByIndex(IC, ee.Number(i));
        //以时间戳为图层名  
        var imageDate = getICByIndex(IC, i).get("system:index").getInfo();
        Map.addLayer(image,
            visParam,
            preName + "_" + imageDate, false);
    }
}

//主函数
function main() 
{
     //放入你的研究区范围
    var ROI = roi;
    //显示ROI轮廓
    Map.centerObject(ROI, 5.3);
    //var empty = ee.Image().clip(ROI.geometry().bounds()).byte();
    //var shp = empty.paint({ featureCollection: ROI, width: 4 });
    //Map.addLayer(shp, { palette: '#000000' }, 'Region');
    
    //查询 NDVI(EVI)数据
    //var Modis_NDVI = ModisNDVI(ROI, "2007-09-01", "2008-03-01");
    //显示 NDVI(EVI)数据
    //var visParam_NDVI = { min: 0, max: 8000 };
    //BatchMap(Modis_NDVI, visParam_NDVI, 50, "Modis_NDVI");
    //print(Modis_NDVI, "Modis_VI_collection");
    
    //查询 LAI数据
    //var Modis_LAI = ModisLAI(ROI, "2007-09-01", "2008-03-01");
    //显示 LAI数据
    //var visParam_LAI = { min: 0, max: 70 };
    //BatchMap(Modis_LAI, visParam_LAI, 50, "Modis_LAI");
    //print(Modis_LAI, "Modis_VI_collection");

    //查询 NPP年数据 
     //var Modis_NPP = ModisNPPyr(ROI, "2017-01-01", "2017-03-01");
    //显示 NPP数据
     //var visParam_NPP = { min: 0, max: 10000 };
     //BatchMap(Modis_NPP, visParam_NPP, 100, "Modis_NPP");
     //print(Modis_NPP);
     
    //查询 NPP8天数据 
     var MODIS_8dayNPP = ModisNPPday(ROI, "2001-01-01", "2022-12-31");
    //显示 NPP数据
     var visParam_NPP = { min: 0, max: 32767 };
     BatchMap(MODIS_8dayNPP, visParam_NPP, 100, "MODIS_NPP");
     print(MODIS_8dayNPP);

    //数据导出
    //exportImageCollection(Modis_NDVI, 250, ROI, "MODIS_NDVI", "MODIS_NDVI");
    //exportImageCollection(Modis_LAI, 500, ROI, "MODIS_LAI", "MODIS_LAI");
    //exportImageCollection(Modis_NPPyr, 500, ROI, "MODIS_NPP", "MODIS_NPP");
    //exportImageCollection(MODIS_8dayNPP, 500, ROI, "MODIS_NPP", "MODIS_NPP");
   
    var indexList = MODIS_8dayNPP.reduceColumns(ee.Reducer.toList(), ["system:index"]).get("list");
    indexList.evaluate(function (indexs) 
    {
        var num = indexs.length;
        print("Numbers of images:",num);
        //var nppmeans = ee.List.repeat(999,0);
        //var nppdate = ee.List.repeat(999,0);
        //初始化列表，存储统计的值
        var data_list_npp=[] 
        
        for (var i = 0; i < indexs.length; i++) 
        {
            var image = MODIS_8dayNPP.filter(ee.Filter.eq("system:index", indexs[i])).first();
            image = image.toInt16(); //
            //print(image);
            print("Processing:",i);
          
            var NPP_mean = image.reduce(ee.Reducer.mean()).clip(ROI).reduceRegion({
                  reducer: ee.Reducer.mean(),
                  geometry: ROI,
                  scale: 500,
                    });

            //print('mean', indexs[i], NPP_mean);
            //nppdate = nppdate.add(indexs[i]);
            //nppmeans = nppmeans.add(NPP_mean);
            var imgDate = indexs[i].substring(0,4)+"-"+indexs[i].substring(5,7)+"-"+indexs[i].substring(8,10);
            
            var npp_mean = ee.Feature(null,NPP_mean);
            npp_mean = npp_mean.set("TIME",ee.Date(imgDate));
            
            data_list_npp.push(npp_mean);

        }
        
        //print(nppdate, nppmeans);
        print(data_list_npp);
        
        //把存储Feature的列表转成FeatureCollection
        var featureCollection = ee.FeatureCollection(data_list_npp);
        Export.table.toDrive({
           collection: featureCollection,
           description: '8dayMODISNPPstatistics_npp',
           fileFormat: 'CSV'
        });
        
    });
    
    print("----------Finished--------------");

}
main();




