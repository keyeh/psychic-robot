var poly=[];
var map;




function initializeViewMap() {
	var kmlLayers=[];
	mapSetup();
	
	//Add KML Layers
	addKmlLayers(
		0,
		kmlLayers,
		new google.maps.KmlLayer({
			url: 'http://dev.kevinyae.com/council_districts.kml',
			preserveViewport: true
		})
	);


	//Start drawing manager
	var drawingManager = new google.maps.drawing.DrawingManager({
		drawingMode: google.maps.drawing.OverlayType.null,
		drawingControl: false,
		polylineOptions: {
			editable: true,
			strokeColor: '#FF9F00'
		}
	});
	drawingManager.setMap(map);
	drawingFunctions(drawingManager);



	//Districts KML show/hide button
	$("#btn-toggle-districts").click(function () {
		toggleKML(0, kmlLayers);
		toggleButton("#btn-toggle-districts", "Show KML", "Hide KML");
	});

}




//Contains functions for interacting with every map on the site.
//Also returns styles and settings used for every map.
function mapSetup () {
	//Reset button
	$("#btn-reset-map").click(function () {
		for (var i=0; i < poly.length; i++) {
			poly[i].setMap(null);
		}
		poly = [];
		$(this).removeClass("btn-default");
		$(this).addClass("btn-success");
		$(this).addClass("btn-default", 500);
		$(this).removeClass("btn-success");
	});



	//Returns styles and settings used for every map.
	map = new google.maps.Map(
		document.getElementById('view-map-canvas'),
			{
				zoom: 10,
				center: new google.maps.LatLng(34.0204989, -118.4117325),

				panControl: false,
				zoomControl: true,
				zoomControlOptions: {
					style: google.maps.ZoomControlStyle.SMALL
				},

				styles: [{"stylers":[{"saturation":-100},{"gamma":1}]},{"elementType":"labels.text.stroke","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"geometry","stylers":[{"visibility":"simplified"}]},{"featureType":"water","stylers":[{"visibility":"on"},{"saturation":50},{"gamma":0},{"hue":"#50a5d1"}]},{"featureType":"administrative.neighborhood","elementType":"labels.text.fill","stylers":[{"color":"#333333"}]},{"featureType":"road.local","elementType":"labels.text","stylers":[{"weight":0.5},{"color":"#333333"}]},{"featureType":"transit","elementType":"labels","stylers":[{"visibility":"off"}]}]
			});


	//Limit to levle 20 zoom because of bugs
	google.maps.event.addListener(map, 'zoom_changed', function () {
		if (map.getZoom() > 19) map.setZoom(19);
	});

}


function addKmlLayers(i, layersArray, kml) {
	layersArray[i] = kml;
	layersArray[i].setMap(map);

}






function toggleKML(i, e) {
	if(e[i].getMap()==null) {
		e[i].setMap(map);
	}
	else {
		e[i].setMap(null);
	}
}












// Functions for handling drawing and related buttons
function drawingFunctions (drawingManagerE) {

	//Save drawn lines to JSON
	google.maps.event.addDomListener(savebutton, 'click', function() {
	        temp =[];
	        for (var i = 0; i < poly.length; i++) {
	            temp[i] = poly[i].getPath().getArray()        
	        }
	        //Todo: Add userID and other ID info
	        dbFunctions("POST", JSON.stringify(temp));
	      });


	//Load and draw lines from JSON
		$("#loadbutton").click(function () {
			inputArray = dbFunctions("get");

			//Clear map and stored poly array
			for (var i=0; i < poly.length; i++) {
				poly[i].setMap(null);
			}
			poly.length = 0;

			var polylineCoords = [];	//Holds LatLng objects for the path.

			//Iterate through polyline
			for (var i=0; i < inputArray.length; i++) {			
				polylineCoords.length = 0;
				//Get lat long array
				for (var j = 0; j < inputArray[i].length; j++) {
					//Make LatLng obj from data in lat long array
					polylineCoords[j] = new google.maps.LatLng(inputArray[i][j].A, inputArray[i][j].F); //for some reason lat is A and long is F..?
					// console.log(inputArray[i][j].A +", " + inputArray[i][j].F);
				};
				
				//Make new polyline
				poly[i] = new google.maps.Polyline({
					path: polylineCoords,
					editable: true
				});
				//Add the polyline to map.
				poly[i].setMap(map);


			}
		});



		//Start drawing new polyline
		$("#btn-toggle-drawing-polyline").click(function () {
			if (toggleButton("#btn-toggle-drawing-polyline", "Stop Drawing", "New Line", "btn-danger", "btn-success")) {
				drawingManagerE.setDrawingMode(google.maps.drawing.OverlayType.POLYLINE);
			} else {
				drawingManagerE.setDrawingMode(google.maps.drawing.OverlayType.null);
			}			

		});


	//When user draws a polyline
	google.maps.event.addDomListener(drawingManagerE, 'polylinecomplete', 
		function(drawnpolyline) {
			//Check if line only has one point, if not, push to poly array.
			if(drawnpolyline.getPath().getArray().length != 1) {
				poly.push(drawnpolyline);
			} else {
				drawnpolyline.setMap(null); //remove single dots
			}
			// google.maps.geometry.poly.containsLocation(e, bermudatriangle)
			// If not in boudnaries, show error msg to user?
		});
}



function toggleButton (id, valActive, valDeactive, classActive, classDeactive) {
	if ($(id).val() == valDeactive) {
			//Change to active state
			$(id).fadeOut("fast", function() {
				$(id).val(valActive)
				$(id).removeClass(classDeactive)
				$(id).addClass(classActive)
				$(id).blur()
			}).fadeIn("fast");
			return 1;
		} else {
			$(id).fadeOut("fast", function() {
				$(id).val(valDeactive)
				$(id).removeClass(classActive)
				$(id).addClass(classDeactive)
				$(id).blur();
			}).fadeIn("fast");
			return (0);
		}
	}



