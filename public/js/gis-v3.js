var COLORS = [["red", "#ff0000"], ["orange", "#ff8800"], ["green","#008000"], ["blue", "#000080"], ["purple", "#800080"]];
var options = {};
var lineCounter_ = 0;
var shapeCounter_ = 0;
var markerCounter_ = 0;
var colorIndex_ = 0;
var featureTable_;
var _gisCurMode = "";
var _gisCurListener = "";
var _gisMap;
var gisOverlays = [];
var _gisMarkers = [];
var _input;

function setMap( map, input, gisMarkers ) {
	if( map ) _gisMap = map;
	if( input ) _input = input;
	if( gisMarkers ) _gisMarkers = gisMarkers;
}
function select(buttonId) {
	document.getElementById("hand_b").className="unselected";
	document.getElementById("shape_b").className="unselected";
	document.getElementById("line_b").className="unselected";
	document.getElementById("placemark_b").className="unselected";
	document.getElementById(buttonId).className="selected";
	_gisCurMode = buttonId;
}

function stopEditing() {
	select("hand_b");
	if( _gisCurListener ) google.maps.event.removeListener(_gisCurListener);
}

function getColor(named) {
	return COLORS[(colorIndex_++) % COLORS.length][named ? 0 : 1];
}

function getIcon(color) {
	/*
	 google.maps.MarkerImage
	var icon = new GIcon();
	icon.image = "http://google.com/mapfiles/ms/micons/" + color + ".png";
	icon.iconSize = new GSize(32, 32);
	icon.iconAnchor = new GPoint(15, 32);
	return icon;
	*/
}

function startShape() {
	select("shape_b");
	var color = getColor(false);
	var polygon = new GPolygon([], color, 2, 0.7, color, 0.2);
	gisOverlays[ gisOverlays.length ] = polygon;
	startDrawing(polygon, "Shape " + (++shapeCounter_), function() {
		var cell = this;
		var area = polygon.getArea();
		cell.innerHTML = (Math.round(area / 10000) / 100) + "km<sup>2</sup>";
	}, color);
}

function startLine() {
	select("line_b");
	var color = getColor(false);
	var line = new google.maps.Polyline({ strokeColor:color });
	startDrawing(line, "Line " + (++lineCounter_), color);
}

function startDrawing(poly, name, onUpdate, color) {
	ovr = poly;
	//_gisMap.addOverlay(poly);
	poly.setMap( _gisMap );
	poly.enableDrawing(options);
	poly.enableEditing({onEvent: "mouseover"});
	poly.disableEditing({onEvent: "mouseout"});
	GEvent.addListener(poly, "endline", function() {
		select("hand_b");
		//alert( "here" );
		//alert( ovr.getKml(function(a){alert(a);} ) );
		GEvent.addListener(poly, "click", function(latlng, index) {
			if (typeof index == "number") {
				poly.deleteVertex(index);
			} else {
				var newColor = getColor(false);
				poly.setStrokeStyle({color: newColor, weight: 4});
			}
		});
	});
}

function gisPlaceMarker() {
	select("placemark_b");
	_gisCurListener = google.maps.event.addListener(_gisMap, "click", function(overlay, latlng) {
		if( overlay && overlay.latLng ) {
			
			var color = getColor(true);
			var marker = new google.maps.Marker({ map:_gisMap, position:overlay.latLng, icon: getIcon(color), draggable: true });
			_gisMarkers[ _gisMarkers.length ] = marker;
			gisUpdateInput();

			google.maps.event.addListener(marker, "dragend", function() {
				gisUpdateInput();
			});
			google.maps.event.addListener(marker, "click", function() {
				if( marker && marker.getPosition() ) {
					var iDel = -1;
					for( var i = 0; i < _gisMarkers.length; i++ ) {
						if( _gisMarkers[i] == marker ) {
							iDel = i;
							break;
						}
					}
					if( iDel > -1 ) {
						_gisMarkers.splice( iDel, 1 );
					}
					if( _gisCurMode == "placemark_b" ) marker.setMap( null );
					gisUpdateInput();
				}
			});
		}
	});
}

function gisGetMarkers() {
	var s = ""
	if( _gisMarkers && _gisMarkers.length > 0 ) {
		s = "MARKERS"
		for( var i = 0; i < _gisMarkers.length; i++ ) {
			s += "##" + _gisMarkers[i].getPosition().lat() + "#" + _gisMarkers[i].getPosition().lng();
		}
	}
	return s;
}

function gisUpdateInput() {
	if( _input && _gisMap ) {
		var txt = "";
		var s = "";
		
		txt = "CENTER#" + _gisMap.getCenter().lat() + "|" + _gisMap.getCenter().lng();
		
		s = gisGetMarkers();
		if( s ) txt += "\n" + s;
		
		_input.text( txt );
	}
}
