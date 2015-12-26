var parser = function (params){
   var fieldName = "value";
   var currency = params.head.replace("value","").toUpperCase();
   var amount = new Number(params.item.replace(",","."));
   var dateItems = params.item.split(".");
   params.resultRow[fieldName] = {amount: amount, currency: currency};
};

module.exports = parser;