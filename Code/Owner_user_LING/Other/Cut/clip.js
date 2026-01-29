/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var table = ee.FeatureCollection("users/949384116/shanxi");
/***** End of imports. If edited, may not auto-convert in the playground. *****/
var roi = table.geometry()

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
  // Return.
  return ee.FeatureCollection(gridList);
  
}

roi = gridSplitMN(roi, 4, 4).filterMetadata('grid_id', 'equals', 10).first().geometry();

//设置显示样式：color代表边界颜色；fillcolor代表填充颜色
var styling={color:'red',fillColor:'00000000'}

//JX就是矢量边界
Map.addLayer(table.style(styling),{},"Roi_Boundary")

Map.centerObject(table, 7);

Map.addLayer(roi,{},'roi_Boundary');