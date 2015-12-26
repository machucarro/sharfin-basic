var 
//File handler
	fs = require("fs"),
//Converter Class 
	parserMgr = require("csvtojson").parserMgr,
	dateParser = require("./parsers/dateParserDE.js"),
	valueParser = require("./parsers/valueParserDE.js"),
	comdirectVisaConverter = require("./converters/comdirectVisa.js"),
	btoa = require('btoa'),
//MongoDB
	mongoose = require('mongoose');

//Movement Schema
var accountEntrySchema = new mongoose.Schema({
    _id: String,
    bookingDate: Date,
    chargedDate: Date,
    type: String,
    reference: String,
    description: String,
    value: {
    	amount: Number,
    	currency: String
    }
}, {collection: "accountEntries"});

var AccountEntry = mongoose.model('AccountEntry', accountEntrySchema);
var entries = [];

//Configure the parser
parserMgr.addParser("dateParserDE",/^.*Date$/,dateParser);
parserMgr.addParser("valueParserDE",/^value.*$/,valueParser);

var savedEntries = 0;
var totalEntries = false;
var checkForClose = function(db){
	if(savedEntries == totalEntries){
		db.close();
	}
}

comdirectVisaConverter.on("record_parsed", function(visaEntry){
	/*visaEntry._id = btoa(
		visaEntry.bookingDate 
		+ visaEntry.chargedDate
		+ visaEntry.type
		+ visaEntry.reference
		+ visaEntry.description
		+ visaEntry.value.amount
		+ visaEntry.value.currency
		);*/
	var accountEntry = new AccountEntry(visaEntry);
	delete visaEntry._id;
	AccountEntry.findOneAndUpdate(visaEntry, visaEntry, {upsert: true}, function (err) {
  		if (err){
  			return console.error(err);
  		}
  		savedEntries++;
  		checkForClose(db);
	});
});

comdirectVisaConverter.on("end_parsed", function(entries){
	totalEntries = entries.length;
	console.log(totalEntries);
	checkForClose(db);
});

//Configure the Mongoose
mongoose.connect('mongodb://localhost/sharfin');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	// we're connected! Parse the file into DB
	fs.createReadStream("./comdirect_visa.csv").setEncoding("utf-8").pipe(comdirectVisaConverter);
});