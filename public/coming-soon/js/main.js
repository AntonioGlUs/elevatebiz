$(window).load(function(){
     $('.preloader').fadeOut('slow');
});


/* =Main INIT Function
-------------------------------------------------------------- */
function initializeSite() {

	"use strict";

	//OUTLINE DIMENSION AND CENTER
	(function() {
	    function centerInit(){

			var sphereContent = $('.sphere'),
				sphereHeight = sphereContent.height(),
				parentHeight = $(window).height(),
				topMargin = (parentHeight - sphereHeight) / 2;

			sphereContent.css({
				"margin-top" : topMargin+"px"
			});

			var heroContent = $('.hero'),
				heroHeight = heroContent.height(),
				heroTopMargin = (parentHeight - heroHeight) / 2;

			heroContent.css({
				"margin-top" : heroTopMargin+"px"
			});

	    }

	    $(document).ready(centerInit);
		$(window).resize(centerInit);
	})();

	// Init effect 
	$('#scene').parallax();

};
/* END ------------------------------------------------------- */

/* =Document Ready Trigger
-------------------------------------------------------------- */
$(window).load(function(){

	initializeSite();
	(function() {
		setTimeout(function(){window.scrollTo(0,0);},0);
	})();

});
/* END ------------------------------------------------------- */


/* Rotating status phrases (replaces the countdown) */
(function() {
	var phrases = ["Under Construction", "Coming Soon", "Almost Ready"];
	// ElevateBiz palette: teal, cyan, blue (color fades via CSS transition)
	var colors = ["#007a73", "#01c3cc", "#3f7fd1"];
	var i = 0;
	var el = $('#status-rotator');
	el.css('color', colors[0]);

	setInterval(function() {
		i = (i + 1) % phrases.length;
		el.css('color', colors[i]);
		// Fade with opacity (not fadeOut) so the layout doesn't jump
		el.animate({ opacity: 0 }, 400, function() {
			el.text(phrases[i]).animate({ opacity: 1 }, 400);
		});
	}, 3000);
})();