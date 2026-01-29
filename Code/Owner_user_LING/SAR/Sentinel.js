/*筛选数据*/
var imgVV = ee.ImageCollection('COPERNICUS/S1_GRD')
        .filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VV'))
        .filter(ee.Filter.eq('instrumentMode', 'IW'))
        .select('VV')
        .map(function(image) {
          /*定义一个变量，过滤无效参数*/
          /*将低于阈值的像元掩盖为无效值*/
          var edge = image.lt(-30.0);
          var maskedImage = image.mask().and(edge.not());
          return image.updateMask(maskedImage);
        });

/*将图像分为下行轨道（DESCENDING）和上行轨道（ASCENDING）两个子集*/
var desc = imgVV.filter(ee.Filter.eq('orbitProperties_pass', 'DESCENDING'));
var asc = imgVV.filter(ee.Filter.eq('orbitProperties_pass', 'ASCENDING'));


var spring = ee.Filter.date('2015-03-01', '2015-04-20');
var lateSpring = ee.Filter.date('2015-04-21', '2015-06-10');
var summer = ee.Filter.date('2015-06-11', '2015-08-31');

var descChange = ee.Image.cat(
        desc.filter(spring).mean(),
        desc.filter(lateSpring).mean(),
        desc.filter(summer).mean());

var ascChange = ee.Image.cat(
        asc.filter(spring).mean(),
        asc.filter(lateSpring).mean(),
        asc.filter(summer).mean());

print("descChange",descChange);
print("ascChange",ascChange);

Map.setCenter(5.2013, 47.3277, 12);
Map.addLayer(ascChange, {min: -25, max: 5}, 'Multi-T Mean ASC', true);
Map.addLayer(descChange, {min: -25, max: 5}, 'Multi-T Mean DESC', true);