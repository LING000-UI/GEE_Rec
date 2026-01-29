// 定义输入数据
var data = [
  ['Category A', 'Category X', 100],
  ['Category A', 'Category Y', 200],
  ['Category B', 'Category X', 150],
  ['Category B', 'Category Y', 250]
];

// 创建桑基图数据表
var dataTable = data.map(function(row) {
  return {
    'source': row[0],
    'target': row[1],
    'value': row[2]
  };
});

// 创建桑基图可视化对象
var sankeyChart = ui.Chart(dataTable)
  .sankey({
    'sourceColumn': 'source',
    'targetColumn': 'target',
    'valueColumn': 'value'
  });

// 显示桑基图
print(sankeyChart);