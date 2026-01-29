//加载数据
var DEM_image = ee.Image("USGS/SRTMGL1_003");

//设置等高线间距0-4000米，间隔100米一个线
var lines = ee.List.sequence(0, 4000, 100);

//高斯滤波计算每一个高度的等高线，输出一个影像列表
var contourlines = lines.map(function(line) {
  var mycontour = DEM_image
    .convolve(ee.Kernel.gaussian(5, 3))
    .subtract(ee.Image.constant(line)).zeroCrossing() 
    .multiply(ee.Image.constant(line)).toFloat();
    
  return mycontour.mask(mycontour);
});

//将等高线列表转换成影像集合，再转换成影像
contourlines = ee.ImageCollection(contourlines).mosaic();

//可视化
Map.addLayer(contourlines, {min: 0, max: 5000, palette:['#2bd666', '#31d6a8', '#9156a3', '#d6462b']}, 'contours');
