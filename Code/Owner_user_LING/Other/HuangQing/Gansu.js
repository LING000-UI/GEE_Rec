/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var Sen = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED"),
    table = ee.FeatureCollection("projects/ee-glj320104/assets/Provincial/Gannan");
/***** End of imports. If edited, may not auto-convert in the playground. *****/
var roi = table.geometry();
var yuzhi = 5;

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
Map.centerObject(table, 4);

//设置显示样式：color代表边界颜色；fillcolor代表填充颜色（白）
var styling={color:'red',fillColor:'00000000'};

// 加载总区域
Map.addLayer(table.style(styling),{},"Roi_Boundary");



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

    var ImgC1 = Sen.filterBounds(roi)
              .filterDate("2022-01-01","2022-03-01")
              .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE',yuzhi))
              .mosaic()
              .clip(roi).select("B4","B3","B2","B8");
              

    Map.addLayer(ImgC1,{min:0,max:3000,bands:["B4","B3","B2"]},"2022-01-01",0);
    
    
    // 将年GPP导出
    Export.image.toDrive({
    image:ImgC1,
    region:roi, //区域
    description:"gannan2022_01_01", //文件名
    scale: 10,                      //分辨率
    maxPixels:1e13               //此处值设置大一些，防止溢出
    });
    
    
    
}


