var Converter = require("csvtojson").Converter;
var converter = new Converter({
	delimiter: ";",
	ignoreEmpty: true,
	noheader: true,
	headers: ["bookingDate", "chargedDate", "type", "reference", "description", "valueEur"]
});

module.exports = converter;