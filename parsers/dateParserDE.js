var dateParser = function (params){
   var fieldName = params.head;
   var dateItems = params.item.split(".");
   params.resultRow[fieldName] = new Date(dateItems[2], dateItems[1]-1, dateItems[0]);
};

module.exports = dateParser;