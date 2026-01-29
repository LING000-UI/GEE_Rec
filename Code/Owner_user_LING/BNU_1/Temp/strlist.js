var stringList = ee.List(["good", "well", "better", "best"]);

stringList.evaluate(function(clientList) {
  for (var i = 0; i < clientList.length; i++) {
    var item = clientList[i];
    print(item);
    print("it is " + item + " band");
  }
});