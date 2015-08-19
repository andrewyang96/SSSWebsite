var express = require('express');
var router = express.Router();
var fs = require('fs');

/* Useful functions */

/**
 * Splices array into an array of arrays.
 * @param {Array} arr JSON Object to be processed.
 * @param {Number} chunkSize The size of each chunk.
 * @return {Array} An array of chunks, each of length chunkSize.
 */
var spliceArray = function (arr, chunkSize) {
	var result = [];
	var i = 0;
	var chunk = [];
	do {
		chunk = arr.slice(i*chunkSize, (i+1)*chunkSize);
		i += 1;
		if (chunk.length > 0) result.push(chunk);
	} while (chunk.length > 0);
	return result;
};

var getNavbar = function () {
	return JSON.parse(fs.readFileSync("./data/navbar.json"));
};

var monthNames = [
    "January", "February", "March",
    "April", "May", "June",
    "July", "August", "September",
    "October", "November", "December"
];

/**
 * Returns the year and month of a file with its filename formatted YYYY-MM.pdf
 */
var parseNewsletterFilename = function (filename) {
	filename = filename.split(".")[0];
	var year = filename.split("-")[0];
	var month = filename.split("-")[1]; // month must be in [01,12]
	month = monthNames[month-1]; // month is undefined if not in [01,12]
	return {year: year, month: month};
};

/* GET home page. */
router.get('/', function (req, res) {
	// MUST INCLUDE THIS IF STATEMENT FIRST THING IN ALL ROUTER CALLBACKS
	if (req.query['search']) {
		var searchQuery = req.query['search'];
		var searchRedirectURL = "https://www.google.com/search?q=" + searchQuery + "+site:sss.ae.illinois.edu";
		console.log("Redirecting to " + searchRedirectURL);
		res.writeHead(301, {Location: searchRedirectURL});
		res.end();
		return;
	}

	fs.readFile("./data/departments.json", function (err, data) {
		if (err) throw err;

		var departments = JSON.parse(data);

		var navbar = getNavbar();

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
		
	});
});

/* GET other pages. */
router.get('/:path?', function (req, res, next) {
	// MUST INCLUDE THIS IF STATEMENT FIRST THING IN ALL ROUTER CALLBACKS
	if (req.query['search']) {
		var searchQuery = req.query['search'];
		var searchRedirectURL = "https://www.google.com/search?q=" + searchQuery + "+site:sss.ae.illinois.edu";
		console.log("Redirecting to " + searchRedirectURL);
		res.writeHead(301, {Location: searchRedirectURL});
		res.end();
		return;
	}

	var navbar = getNavbar();
	var sideNav = navbar[req.params.path];

	if (sideNav === undefined) {
		console.log(req.params.path + " is NOT a valid path");
		next();
	}

	var title = sideNav['title'];
	var sideNavTitle = title;

	if (req.params.path == "faq") {
		fs.readFile("./data/faq.json", function (err, data) {
			if (err) throw err;

			var faq = JSON.parse(data);
			res.render('faq', {
				navbar : navbar,
				faq : faq,
				title : "Student Space Systems at University of Illinois at Urbana-Champaign | FAQ"
			});
		});
		
	} else {
		res.render('subpage', {
			navbar : navbar,
			sideNav : sideNav,
			sideNavTitle : sideNavTitle,
			currentPage : "/" + req.params.path,
			section : title,
			ejsPath : req.params.path + ".ejs",
			title : "Student Space Systems at the University of Illinois at Urbana-Champaign | " + title
		});
	}

});

router.get('/:path?/:subpath?', function (req, res, next) {
	// MUST INCLUDE THIS IF STATEMENT FIRST THING IN ALL ROUTER CALLBACKS
	if (req.query['search']) {
		var searchQuery = req.query['search'];
		var searchRedirectURL = "https://www.google.com/search?q=" + searchQuery + "+site:sss.ae.illinois.edu";
		console.log("Redirecting to " + searchRedirectURL);
		res.writeHead(301, {Location: searchRedirectURL});
		res.end();
		return;
	}

	var navbar = getNavbar();
	var sideNav = navbar[req.params.path];

	if (sideNav === undefined) {
		console.log(req.params.path + " is NOT a valid path");
		next();
	} else {
		var subpage = sideNav['children'][req.params.subpath];
		if (subpage === undefined) {
			console.log(req.params.path + "/" + req.params.subpath + " is NOT a valid path");
			next();
		}
	}

	var title = subpage['title'];
	var sideNavTitle = sideNav['title'];

	if (req.params.subpath === "execboard") {
		fs.readFile("./data/execboard.json", function (err, data) {
			if (err) throw err;
			
			var execBoard = JSON.parse(data);
			
			res.render('subpage', {
				execBoard : execBoard,
				navbar : navbar,
				sideNav : sideNav,
				sideNavTitle : sideNavTitle,
				currentPage : "/" + req.params.path,
				section : title,
				ejsPath : req.params.path + "/" + req.params.subpath + ".ejs",
				title : "Student Space Systems at the University of Illinois at Urbana-Champaign | " + title
			});
		});
	} else if (req.params.subpath === "newsletters") {		
		fs.readdir("./public/newsletters", function (err, data) {
			if (err) throw err;

			var newsletters = [];

			data.forEach(function (item) {
				var newObj = parseNewsletterFilename(item);
				newObj.url = "/newsletters/" + item;
				newsletters.push(newObj);
			});

			newsletters.reverse();

			res.render('subpage', {
				newsletters: newsletters,
				navbar : navbar,
				sideNav : sideNav,
				sideNavTitle : sideNavTitle,
				currentPage : "/" + req.params.path,
				section : title,
				ejsPath : req.params.path + "/" + req.params.subpath + ".ejs",
				title : "Student Space Systems at the University of Illinois at Urbana-Champaign | " + title
			});
		});
	} else {
		res.render('subpage', {
			navbar : navbar,
			sideNav : sideNav,
			sideNavTitle : sideNavTitle,
			currentPage : "/" + req.params.path,
			section : title,
			ejsPath : req.params.path + "/" + req.params.subpath + ".ejs",
			title : "Student Space Systems at the University of Illinois at Urbana-Champaign | " + title
		});
	}
});

router.get('/:path?/:subpath?/:subpath2?', function (req, res, next) {
	// MUST INCLUDE THIS IF STATEMENT FIRST THING IN ALL ROUTER CALLBACKS
	if (req.query['search']) {
		var searchQuery = req.query['search'];
		var searchRedirectURL = "https://www.google.com/search?q=" + searchQuery + "+site:sss.ae.illinois.edu";
		console.log("Redirecting to " + searchRedirectURL);
		res.writeHead(301, {Location: searchRedirectURL});
		res.end();
		return;
	}

	var navbar = getNavbar();
	var sideNav = navbar[req.params.path];

	if (sideNav === undefined) {
		console.log(req.params.path + " is NOT a valid path");
		next();
	} else {
		var subpage = sideNav['children'][req.params.subpath];
		if (subpage === undefined) {
			console.log(req.params.path + "/" + req.params.subpath + " is NOT a valid path");
			next();
		} else {
			if (!(req.params.subpath2 in subpage['children'])) {
				console.log(req.params.path + "/" + req.params.subpath + "/" + req.params.subpath2 + " is NOT a valid path");
				next();
			}
		}
	}

	var title = subpage['children'][req.params.subpath2]['title'];
	var sideNavTitle = sideNav['title'];

	res.render('subpage', {
		navbar: navbar,
		sideNav : sideNav,
		sideNavTitle : sideNavTitle,
		currentPage : "/" + req.params.path,
		section : title,
		ejsPath : req.params.path + "/" + req.params.subpath + "/" + req.params.subpath2 + ".ejs",
		title : "Student Space Systems at the University of Illinois at Urbana-Champaign | " + title
	});
});


module.exports = router;
