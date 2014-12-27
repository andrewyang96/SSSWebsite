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
 * @return {String} A value suitable for href attribute of <a> tag.
 */
var toHref = function (str) {
	return "/" + str.replace(" ", "").toLowerCase();
};

/**
 * Returns an array of navbar objects.
 * @param {String} path Optional argument.
 * @return {Array} Navbar array to pass to EJS.
 *                 Returns JS object with "navbar" and "title" keys if "path" argument is in validpaths.json.
 *                 Returns null if "path" argument is not in validpaths.json.
 */
var getNavbar = function (path) {
	if (path) {
		var validPaths = JSON.parse(fs.readFileSync("./data/validpaths.json", "UTF-8"));

		if (Object.keys(validPaths).indexOf(path) == -1) {
			// console.log(path + " is an invalid path");
			return null;
		} else {
			// console.log(path + " is a valid path!");
			var result = {};
			result["navbar"] = JSON.parse(fs.readFileSync(validPaths[path]["file"]));
			result["title"] = validPaths[path]["title"]
			return result;
		}

	} else {
		return [
			JSON.parse(fs.readFileSync("./data/navbar/aboutus.json")),
			JSON.parse(fs.readFileSync("./data/navbar/rocketmanifest.json")),
			JSON.parse(fs.readFileSync("./data/navbar/departments_navbar.json")),
			JSON.parse(fs.readFileSync("./data/navbar/contact.json")),
			JSON.parse(fs.readFileSync("./data/navbar/faq.json")),
			JSON.parse(fs.readFileSync("./data/navbar/media.json"))
		];
	}
	
}

/* GET home page. */
router.get('/', function (req, res) {
	fs.readFile("./data/departments.json", function (err, data) {
		if (err) throw err;

		var departments = spliceJSON(JSON.parse(data), 3);

		var navbar = getNavbar();

		fs.readFile("./data/gallery.json", function (err, data) {
			if (err) throw err;

			var gallery = JSON.parse(data);

			res.render('index', {
				departments : departments,
				navbar : navbar,
				gallery : gallery,
				toHref : toHref,
				title : "Student Space Systems at the University of Illinois at Urbana-Champaign"
			});
		});

		/*
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
					toHref : toHref,
					title : "Student Space Systems at the University of Illinois at Urbana-Champaign"
				});
			});

			
		});
		*/
		
	});
});

/* GET other pages. */
router.get('/:path?', function (req, res, next) {
	var sideNavJSON = getNavbar(req.params.path);

	if (sideNavJSON == null) {
		next(); // if req.params.path isn't valid
	}

	var sideNav = sideNavJSON["navbar"];
	var title = sideNavJSON["title"];

	var navbar = getNavbar();

	res.render('detail', {
		navbar : navbar,
		sideNav : sideNav,
		toHref : toHref,
		title : "Student Space Systems at the University of Illinois at Urbana-Champaign | " + title
	});

	/*
	fs.readFile("./data/navbar.json", function (err, data) {
		if (err) throw err;

		var navbar = JSON.parse(data);

		fs.readFile("./data/gallery.json", function (err, data) {
			if (err) throw err;

			var gallery = JSON.parse(data);

			res.render('detail', {
				navbar : navbar,
				title : "Student Space Systems at the University of Illinois at Urbana-Champaign"
			});
		});

		
	});
	*/

});


module.exports = router;
