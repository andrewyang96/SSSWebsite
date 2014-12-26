var express = require('express');
var router = express.Router();
var fs = require('fs');

/* Useful functions */

/**
 * Splices JSON into an array of JSONs.
 * @param {Object} obj JSON Object to be processed.
 * @param {Number} chunkSize The size of each chunk.
 * @return {Array} An array of chunks, each of size chunkSize.
 */
var spliceJSON = function (obj, chunkSize) {
	
	var result = [];
	var keys = Object.keys(obj);
	while (keys.length > 0) {
		var chunk = getValues(obj, keys.splice(0,chunkSize));
		result.push(chunk);
	}
	return result;
};

/**
 * Gets the values of an array of keys.
 * @param  {Object} obj JSON Object to be processed.
 * @param  {Array} keys The keys. Ensure that they exist in obj.
 * @return {Object} JSON Object whose keys are in the keys param.
 */
var getValues = function (obj, keys) {
	var result = {};
	for (key in keys) {
		result[keys[key]] = obj[keys[key]];
	}
	return result;
};

/**
 * Converts string to convenient href value.
 * @param  {String} str Any string.
 * @return {[type]} A value suitable for href attribute of <a> tag.
 */
var toHref = function (str) {
	return "/" + str.replace(" ", "").toLowerCase();
};

/* GET home page. */
router.get('/', function(req, res) {
	fs.readFile("./data/departments.json", function (err, data) {
		if (err) throw err;

		var departments = spliceJSON(JSON.parse(data), 3);

		fs.readFile("./data/navbar.json", function (err, data) {
			if (err) throw err;

			var navbar = JSON.parse(data);

			fs.readFile("./data/gallery.json", function (err, data) {
				if (err) throw err;

				var gallery = JSON.parse(data);

				res.render('index', {
					departments : departments,
					navbar : navbar,
					gallery : gallery,
					title : "Student Space Systems at the University of Illinois at Urbana-Champaign"
				});
			});

			
		})
		
	});
});

module.exports = router;
