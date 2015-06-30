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
	if (document.getElementById("view-map-canvas")) {
		initializeViewMap();
	}

	// Init request page if current page has requests
	if (document.getElementById("request-states-container")) {
		requestFunctions();
	}

	// Collapse mobile nav bar if open
	$(".navbar-collapse").collapse('hide');

	//Not sure what this does...
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





//Request page state functions
var currentState;

function requestFunctions (argument) {
	currentState=0;
	console.log("[REQUESTS] New page load, resetting state to: "+currentState);
	$("#request-state0-submit").click(function () {
		//Input checking here
		//Form processing here
		stateChange(1);
	});

	$("#request-state-back").click(function () {
			if (currentState) {
				stateChange(currentState-1);
			};
		});

	function stateChange(i) {
		console.log("[REQUESTS] Changing to:" +i+ " from currentState:"+currentState);

		$("#request-states-container").fadeOut(function() {
			$(".request-state"+currentState).addClass("hide");
			$(".request-state"+i).removeClass("hide");
			currentState=i;
		}).fadeIn();
	};
}








//DB functions for map
function dbFunctions (mode, json) {
	//TODO

	if (mode == "post" || mode == "POST") {
		document.getElementById("savedata").value = json;
	};

	if (mode == "get" || mode == "GET") {
		return JSON.parse(document.getElementById("savedata").value);
	};
	
}