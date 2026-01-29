

/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var table = 
    /* color: #11b0d6 */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[121.02912512238677, 30.43948015046484],
          [121.02912512238677, 30.23235637056162],
          [121.38446417267974, 30.23235637056162],
          [121.38446417267974, 30.43948015046484]]], null, false),
    l8_sr = ee.ImageCollection("LANDSAT/LC08/C01/T1_SR");
/***** End of imports. If edited, may not auto-convert in the playground. *****/
var roi = table;
 
    // /* color: #d63000 */
 
    // /* displayProperties: [
    //   {
    //     "type": "rectangle"
    //   }
    // ] */
 
    // ee.Geometry.Polygon(
 
    //     [[[118.76701352910152, 37.95798438938449],
 
    //       [118.76701352910152, 37.58456192342209],
 
    //       [119.38224790410152, 37.58456192342209],
 
    //       [119.38224790410152, 37.95798438938449]]], null, false),
 

 
Map.centerObject(roi, 11);
 
Map.addLayer(roi, {color: "red"}, "roi");
 
 
 
var sDate = "2013-1-1";
 
var eDate = "2022-1-1";
 
var l8Col = l8_sr.filterDate(sDate, eDate)
 
                 .filterBounds(roi)
 
                 .map(function(image) {
 
                    var cloudShadowBitMask = 1 << 3;
 
                    var cloudsBitMask = 1 << 5;
 
                    var qa = image.select('pixel_qa');
 
                    var mask = qa.bitwiseAnd(cloudShadowBitMask).eq(0)
 
                                 .and(qa.bitwiseAnd(cloudsBitMask).eq(0));
 
                    return image.updateMask(mask);
 
                 })
 
                 .map(function(image) {
 
                   var time_start = image.get("system:time_start");
 
                    image = image.multiply(0.0001);
 
                    image = image.set("system:time_start", time_start);
 
                    return image;
 
                 })
 
                 .select(["B5","B4","B3"], ['nir','red','green']);
 
print(l8Col.limit(1));
 
print(l8Col.size());
 
 
 
 
 
var yearList = ee.List.sequence(ee.Date(sDate).get("year"), ee.Number(ee.Date(eDate).get("year")).subtract(1));
 
var yearImgList = yearList.map(function(year) {
 
  year = ee.Number(year);
 
  var _sdate = ee.Date.fromYMD(year, 1, 1);
 
  var _edate = ee.Date.fromYMD(year.add(1), 1, 1);
 
  
 
  var tempCol = l8Col.filterDate(_sdate, _edate);
 
  var img = tempCol.median().clip(roi);
 
  img = img.set("year", year);
 
  img = img.set("system:index", ee.String(year.toInt()));
 
  return img;
 
});
 
 
 
var imgCol = ee.ImageCollection.fromImages(yearImgList);
 
print("imgCol", imgCol);
 
 
 
// 使用缩略图来制作展示
 
var params = {
 
  crs: 'EPSG:3857',
 
  framesPerSecond: 2,
 
  region: roi,
 
  min: 0.0,
 
  max: 0.25,
 
  bands: ['nir','red','green'],
 
  dimensions: 1024,
 
};
 
print(ui.Thumbnail(imgCol, params));
 
print(imgCol.getVideoThumbURL(params));