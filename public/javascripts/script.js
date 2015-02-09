$(document).ready(function () {
	// INITIALIZE JMENU
	$("#navbar").jMenu();

	// METHOD TO INITIALIZE EXTENSIONS' HEIGHTS AND POSITIONS
	var setExtensions = function () {
		// debugExtensions();
		$(".navbar-extension").css({top : ($("#navbar").position().top + parseInt($("#navbar").css("margin-top"))) + "px"});
		$(".navbar-extension").height($("#navbar").outerHeight()+1); // misaligned in firefox, yet remains aligned in chrome
		$(".footer-extension").css({top : ($("#footer").position().top + parseInt($("#footer").css("margin-top"))) + "px"});
		$(".footer-extension").height($("#footer").outerHeight());
	};

	debugExtensions = function () {
		console.log("$('#navbar').position().top: " + $("#navbar").position().top);
		console.log("$('#navbar').css('margin-top'): " + $("#navbar").css("margin-top"));
		console.log("$('#navbar').height(): " + $("#navbar").height());
		console.log("$('#navbar').outerHeight(): " + $("#navbar").outerHeight());
		console.log("$('#footer').position().top: " + $("#footer").position().top);
		console.log("$('#footer').css('margin-top'): " + $("#footer").css("margin-top"));
		console.log("$('#footer').height(): " + $("#footer").height());
		console.log("$('#footer').outerHeight(): " + $("#footer").outerHeight());

		console.log("#navbar position: " + ($("#navbar").position().top + parseInt($("#navbar").css("margin-top"))));
		console.log("#navbar height: " + $("#navbar").outerHeight());
		console.log("#footer position: "  + ($("#footer").position().top + parseInt($("#footer").css("margin-top"))));
		console.log("#footer height: " + $("#footer").outerHeight());

		console.log(document.readyState);
	};

	// INITIALIZE EXTENSIONS' HEIGHTS AND POSITIONS AFTER DOM HAS LOADED PROPERLY
	document.onreadystatechange = function () {
		setExtensions();
	};

	var changeCaption = function (element) {
		//console.log(element);
		var comment = element.find('img').attr('alt');
        var title = element.find('img').attr('title');
        if(comment && title) $('.imagecaption').html('<strong class="captiontitle">'+title+'</strong><p class="captiontext">'+comment+'</p>');
	}

	// INITIALIZE BUTTON
	$("#subscribebutton").button();

	// INITIALIZE JCAROUSEL
	var carousel = $(".jcarousel").on("jcarousel:createend", function (event, carousel) {
		// Force jCarousel to update caption
		if (window.location.hash) {
			//console.log('has hash');
			var hash = window.location.hash.split('#')[1] - 1;
			//console.log(carousel._target);
			$(".jcarousel").jcarousel("scroll", hash);
			changeCaption(carousel._target);
		} else {
			//console.log('no hash');
			//console.log(carousel._first.find("img"));
			$(".jcarousel").jcarousel("scroll", 0);
			changeCaption(carousel._first);
		}
	}).jcarousel({
		transitions : true,
		center : true,
		wrap : "both"
	});

	$('.jcarousel').on('jcarousel:targetin', 'li', function (event, carousel) {
       	// console.log("Target in");
       	var image = $(this);
    	$(".imagecaption").animate({ left: "-=600px" }, 300, "swing", function () {
    		// console.log("Swing left");
    		changeCaption(image);
    	});
    });

    $('.jcarousel').on('jcarousel:targetout', 'li', function (event, carousel) {
    	// console.log("Target out");
    	$(".imagecaption").animate({ left: "+=600px"}, 300, "swing", function () {
    		// console.log("Swing right");
    	})
    })

	$(".jcarousel-prev").on("jcarouselcontrol:active", function () {
		$(this).removeClass("inactive");
	}).on("jcarouselcontrol:inactive", function () {
		$(this).addClass("inactive");
	}).jcarouselControl({
		target: "-=1",
		carousel: carousel
	});

	$(".jcarousel-next").on("jcarouselcontrol:active", function () {
		$(this).removeClass("inactive");
	}).on("jcarouselcontrol:inactive", function () {
		$(this).addClass("inactive");
	}).jcarouselControl({
		target: "+=1",
		carousel: carousel
	});

	$(".jcarousel-pagination").on("jcarouselpagination:active", "a", function () {
		$(this).addClass("active");
	}).on("jcarouselpagination:inactive", "a", function () {
		$(this).removeClass("active");
	}).jcarouselPagination({
		item: function (page) {
			return '<a href="#' + page + '">' + page + '</a>';
		},
		carousel: carousel
	});

	$(".jcarousel").jcarouselAutoscroll({
		target: "+=1",
		interval: 5000,
		create: $(".jcarousel").hover(function () {
			$(this).jcarouselAutoscroll("stop");
		}, function () {
			$(this).jcarouselAutoscroll("start");
		})
	})

	// END JCAROUSEL METHODS

	// SIDENAV AUTOSCROLL
	$(window).on('scroll', function () {
		// console.log("Offset:");
		// console.log($('.sidebar').offset());
		var scrollPos = $(document).scrollTop();
		// console.log("ScrollTop:");
		// console.log(scrollPos);
		$('.sidebar').css({
		    top : scrollPos
		});
		// console.log("scrolled to " + (scrollPos+top));
	}).scroll();
	
});