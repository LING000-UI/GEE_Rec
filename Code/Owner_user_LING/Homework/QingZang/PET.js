
var geometry = ee.Geometry.Point([116.5, 35.8]);
 
var aPoint = geometry;
//影像筛选
var era5hourly = ee.ImageCollection("ECMWF/ERA5_LAND/HOURLY")
                    .filter(ee.Filter.date('2000-01-01', '2020-12-31'));
//添加色彩度
var classColors = ['FFFFFF','E6E6E6','BEBEBE','969696',
                   'C4706E','C8B396','FFC775','FFFF54',
           '91FF99','00FF00','40C738']
 
var TOTAL_MONTHLY_PET = "potential_evaporation";
 
var metersToMillimiters = function( image ){
  return ee.Image( 
        image.select([TOTAL_MONTHLY_PET])
         .multiply(1000)
       .multiply(-1) // 将m转化为mm
    ).copyProperties( image, ["system:time_start","system:time_end"] );
};
 

var getImagery = function(){
  return era5hourly.filter(ee.Filter.eq("hour", 0 ) )
                   .map( metersToMillimiters ); 
};
 
 
var NO_DATA = 0;

var reduce = function (imageCollection){
  imageCollection = ee.ImageCollection( imageCollection);
  return  imageCollection.sum();
};
 
//添加波段并返回成为字典
var addConstantBand = function( image, value, name ){
  var valueBand =  ee.Image(ee.Number(value) ).rename(name).uint16();
  image = image.addBands( valueBand );
  return( image.set(name, ee.Number(value) ) );
};
 
var reduceAndSetYearBand = function(yearImagery, reducer, bandName, year) {
  var reducedImage = ee.Image(reduce(ee.ImageCollection(yearImagery), reducer)).select(bandName);
  reducedImage = addConstantBand(reducedImage, year, "year");
  return reducedImage.set(
    'system:time_start',
    ee.Date.fromYMD(year, 12, 31).millis()
  );
};
 
//进行年度分析
var yearlyAggregation = function( year, collection, bandName, reducer ){
 
  year = ee.Number(year).toInt16();
  var yearImagery = ee.ImageCollection( collection ).filterDate( ee.String(year).cat("-01-01"), ee.String(year.add(1)).cat("-01-01")); // aggregation has to be done over 365 days
 
  return ee.Algorithms.If(
    ee.Number(ee.ImageCollection(yearImagery).size()).toInt().gt(0),
    reduceAndSetYearBand(yearImagery, reducer, bandName, year),
    ee.Image(NO_DATA).rename([bandName])
  );
};
 
//获取每一年的影像
var getBandValuesReducedPerYear = function( bandName, startYear, endYear, imageCollection, reducer, useMask) {
  var listOfYears = ee.List.sequence(startYear, endYear );
  return ee.ImageCollection.fromImages(
      listOfYears.map( 
          function(year){
            var img = ee.Image(yearlyAggregation(year, imageCollection, bandName, reducer, useMask ));
            if (useMask) {
              img = img.updateMask(useMask);
            }
            return img;
          }
      )
  );
};
 
var yearlyPrec_ECMWF = getBandValuesReducedPerYear(TOTAL_MONTHLY_PET, 2000, 2020, getImagery(), "sum" ).select(TOTAL_MONTHLY_PET);
 
Map.addLayer(yearlyPrec_ECMWF, {min: 0, max: 10000, palette: classColors});