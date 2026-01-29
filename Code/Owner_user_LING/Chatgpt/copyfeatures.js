/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var table = ee.FeatureCollection("projects/ee-glj320104/assets/nj");
/***** End of imports. If edited, may not auto-convert in the playground. *****/
// 创建一个影像集
var originalCollection = ee.ImageCollection('COPERNICUS/S2_SR')
  .filterBounds(table)
  .filterDate('2022-01-01', '2022-12-31');

print(originalCollection);

// 复制属性到新的影像集
var newCollection = originalCollection
  // 赋值函数
  .map(function(image) {
  return image.copyProperties(image, ['features']);
});

// 打印结果
print('新影像集', newCollection);
// 在上面的示例中，我们首先创建了一个名为 originalCollection 的影像集，然后使用 .copyProperties() 方法
// 将 originalCollection 的 'feature1' 和 'feature2' 属性复制到新的影像集 newCollection 中。
// 通过使用 .map() 方法并应用匿名函数，我们可以对 originalCollection 中的每个影像执行属性复制操作，
// 最终生成具有相同属性的新影像集。

// 请注意，.copyProperties() 方法的第一个参数是源对象，第二个参数是一个属性列表，用于指定要复制的属性。
// 在这个例子中，您可以根据实际情况自定义要复制的属性列表。

// 总结：影像集之间的赋值操作不会传递属性(features)，但您可以使用 .copyProperties() 方法来
// 复制源影像集的属性到新的影像集中，并将其应用于 GEE 中的影像集转换过程。