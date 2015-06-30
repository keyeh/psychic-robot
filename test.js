$(function() {
	$.koolSwap({
		swapBox : '#main',
		outDuration : 550,
		inDuration : 600,
		outerWidth: true,
						outEasing : '',
				inEasing : '',
				direction: ''
	});

	readyFunctions(); // Load the readyFunctions on page $(document).ready()
	
	$(document)
	.on('click', 'header nav a.active', function(e) {
		e.preventDefault();
		if (e.originalEvent !== undefined) {
			e.stopImmediatePropagation();
		  }
	})
	.on({
		ksSwapCallback: function() {
			readyFunctions();
		}
	})
});


function readyFunctions() {
	// Initialize google map if current page has one.
	if (document.getElementById("map-canvas")) {
		initialize();
	}

	// Collapse mobile nav bar if open
	$(".navbar-collapse").collapse('hide');


	$('#tabContent').koolSwap({
		swapTriggerBox : '.tabs',
		bouncingBoxes : '.description, footer',
		bouncingBoxHandling: 'slide',
		direction: 'left-to-right',
		moveSwapBoxClasses : true,
		positionType: 'absolute',
		outEasing : 'easeInOutCirc',
		inEasing : 'easeOutBack',
		outerWidth: true
	});
}


function is_touch_device() { // check if the plugin's running on a touch device
	var el = document.createElement('div');
	el.setAttribute('ongesturestart', 'return;');
	return typeof el.ongesturestart === "function";
};

