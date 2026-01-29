function Part_one(img){
  var i = 2;
  img = img.multiply(i);
  i = i++;
  return(img);
}




// 创建一个空的影像集
var imageCollection = ee.ImageCollection([]);

// 循环生成影像并添加到影像集中
for (var i = 1; i <= 3; i++) {
  var image = ee.Image(i).rename('value');
  imageCollection = imageCollection.merge(ee.ImageCollection([image]));
}

// 打印影像集
print(imageCollection);


var secondImage = ee.Image(imageCollection.map(Part_one).toList(imageCollection.size()).get(1));


Map.addLayer(secondImage);