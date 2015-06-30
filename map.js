var poly=[];
var map;
var ctaLayer=[];

function initialize() {
	var mapOptions = {
		zoom: 10,
		center: new google.maps.LatLng(34.0204989, -118.4117325),

		panControl: false,
		zoomControl: true,
		zoomControlOptions: {
			style: google.maps.ZoomControlStyle.SMALL
		},

		styles: [{"stylers":[{"saturation":-100},{"gamma":1}]},{"elementType":"labels.text.stroke","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"geometry","stylers":[{"visibility":"simplified"}]},{"featureType":"water","stylers":[{"visibility":"on"},{"saturation":50},{"gamma":0},{"hue":"#50a5d1"}]},{"featureType":"administrative.neighborhood","elementType":"labels.text.fill","stylers":[{"color":"#333333"}]},{"featureType":"road.local","elementType":"labels.text","stylers":[{"weight":0.5},{"color":"#333333"}]},{"featureType":"transit","elementType":"labels","stylers":[{"visibility":"off"}]}]
	}

	map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
	ctaLayer[0] = new google.maps.KmlLayer({
		url: 'http://dev.kevinyae.com/council_districts.kml',
		preserveViewport: true
	});
	ctaLayer[0].setMap(map);


	var drawingManager = new google.maps.drawing.DrawingManager({
		drawingMode: google.maps.drawing.OverlayType.null,
		drawingControl: false,
		polylineOptions: {
			editable: true,
			strokeColor: '#FF9F00'
		}
	});
	drawingManager.setMap(map);




	//When user draws a polyline
	google.maps.event.addDomListener(drawingManager, 'polylinecomplete', 
		function(drawnpolyline) {
			//Check if line only has one point, if not, push to poly array.
			if(drawnpolyline.getPath().getArray().length != 1) {
				poly.push(drawnpolyline);
			} else {
				drawnpolyline.setMap(null); //remove single dots
			}
			// google.maps.geometry.poly.containsLocation(e, bermudatriangle)

		});




google.maps.event.addDomListener(savebutton, 'click', function() {
        document.getElementById("savedata").value = "";
        temp =[];


        for (var i = 0; i < poly.length; i++) {
            temp[i] = poly[i].getPath().getArray()        
        }
        document.getElementById("savedata").value += JSON.stringify(temp);

      });



	$("#loadbutton").click(function () {
		inputArray = JSON.parse(document.getElementById("savedata").value)

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



	$("#btn-toggle-districts").click(function () {
		toggleKML(0, "#btn-toggle-districts");
		toggleButton("#btn-toggle-districts", "Show KML", "Hide KML");
	});




	$("#btn-toggle-drawing").click(function () {
		if (toggleButton("#btn-toggle-drawing", "Stop Drawing", "New Line", "btn-danger", "btn-success")) {
			drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYLINE);
		} else {
			drawingManager.setDrawingMode(google.maps.drawing.OverlayType.null);
		}			

	});








			//Limit to levle 20 zoom because of bugs
			google.maps.event.addListener(map, 'zoom_changed', function () {
				if (map.getZoom() > 19) map.setZoom(19);
			});


// 			google.maps.event.addListenerOnce(map, 'idle', function(){
//     $("#map-cover").fadeOut("easeInExpo");
// });
}











function toggleKML(i, id) {
	if(ctaLayer[i].getMap()==null) {
		ctaLayer[i].setMap(map);
	}
	else {
		ctaLayer[i].setMap(null);
	}
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



