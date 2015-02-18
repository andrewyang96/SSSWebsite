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

/* GET home page. */
router.get('/', function (req, res) {
	fs.readFile("./data/departments.json", function (err, data) {
		if (err) throw err;

		var departments = spliceArray(JSON.parse(data), 3);

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
		res.render('detail', {
			navbar : navbar,
			sideNav : sideNav,
			sideNavTitle : sideNavTitle,
			currentPage : "/" + req.params.path,
			section : title,
			title : "Student Space Systems at the University of Illinois at Urbana-Champaign | " + title
		});
	}

});

router.get('/:path?/:subpath?', function (req, res, next) {
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

	res.render('subpage', {
		navbar : navbar,
		sideNav : sideNav,
		sideNavTitle : sideNavTitle,
		currentPage : "/" + req.params.path,
		section : title,
		title : "Student Space Systems at the University of Illinois at Urbana-Champaign | " + title
	});
});

router.get('/:path?/:subpath?/:subpath2?', function (req, res, next) {
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
		title : "Student Space Systems at the University of Illinois at Urbana-Champaign | " + title
	});
});


module.exports = router;
