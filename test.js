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

	// Initialize google map if current page has one.
	if (document.getElementById("request-map-canvas")) {
		initializeRequestMap();
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
	$("#request-state0-next").click(function () {
		//Input checking here
		//Form processing here




		//Map fix centering and resizing
		var currCenter = map.getCenter();
		console.log(map.getCenter());
		stateChange(1, function() {
			google.maps.event.trigger(map, 'resize');
			map.setCenter(currCenter);
		});
	});

	$("#request-state-back").click(function () {
			if (currentState) {
				stateChange(currentState-1);
			};
		});

	$("#request-submit").click(function () {
		//Input checking here
		//Form processing here
		//DB Connection here
		shakeForm();
		// alert("Not implemented yet");
	});

	function stateChange(i, callback) {
		console.log("[REQUESTS] Changing to:" +i+ " from currentState:"+currentState);

		$("#request-states-container").fadeOut(function() {
			$(".request-state"+currentState).addClass("hide");
			$(".request-state"+i).removeClass("hide");
			currentState=i;
		}).fadeIn(function() {
    		if(callback && typeof callback == "function") {
			    callback();
			}
  		});
	};




	function shakeForm() {
	   var l = 10;  
	   for( var i = 0; i < 6; i++ )   
	     $( ".request-form-shake" ).animate({
	     	'margin-left': "+=" + ( l = -l ) + 'px',
	     	'margin-right': "-=" + ( l = +l ) + 'px'
	     }, 50);
	 }


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