var powdercloudGISInstances = [];
var powdercloudGISOverlayOwners = [];

// GIS object
var powdercloudGIS = function( varName, mapID, intialDataID, changedDataID ) {

	/**************** VARIABLES */
	// DOM element IDs
	this.varName = varName;
	this.idMap = mapID;
	this.idInitial = intialDataID;
	this.idChanged = changedDataID;
	
	// DOM element objects (jQuery)
	this.dvMap;
	this.inInitial;
	this.inChanged;
	
	// Google Map instance, and current data
	this.gmap;
	this.lCenterLat = 50.139836;
	this.lCenterLng = -122.956924;
	this.iZoom = 4;
	this.sCurrentMode;
	this.aMarkers = [];
	this.aLines = [];
	this.aPolygons = [];
	
	// Drawing variables
	this.lisMarker; // the event listner for marker placement
	this.ovrCurrent; // the current overlay for poly/line drawing
	
	// Variables used internally in this class
	this.COLORS = [["red", "#ff0000"], ["orange", "#ff8800"], ["green","#008000"], ["blue", "#000080"], ["purple", "#800080"]];
	this.colorIndex_ = 0;

	
	/**************** METHODS */
	
	// Select which drawing toolbar item should be active
	this.select = function( buttonId ) {
		if( this.varName && this.inChanged ) {
			document.getElementById( this.varName + "_hand_b" ).className="hand_b";
			document.getElementById( this.varName + "_shape_b" ).className="shape_b";
			document.getElementById( this.varName + "_line_b" ).className="line_b";
			document.getElementById( this.varName + "_placemark_b" ).className="placemark_b";
			if( buttonId.indexOf( "_hand_b" ) > -1 ) document.getElementById( buttonId ).className="hand_b_selected";
			else if( buttonId.indexOf( "_shape_b" ) > -1 ) document.getElementById( buttonId ).className="shape_b_selected";
			else if( buttonId.indexOf( "_line_b" ) > -1 ) document.getElementById( buttonId ).className="line_b_selected";
			else if( buttonId.indexOf( "_placemark_b" ) > -1 ) document.getElementById( buttonId ).className="placemark_b_selected";
			//this.sCurrentMode = buttonId;
		}
	};
	
	// Finish drawing (hand tool selected)
	this.stopEditing = function() {
		if( this.gmap && this.varName ) {
			this.select( this.varName + "_hand_b" );
			if( this.lisMarker ) GEvent.removeListener( this.lisMarker );
			if( this.ovrCurrent ) {
				// cancel any marker/poly being drawn at the moment
				this.ovrCurrent.disableEditing();
				this.ovrCurrent.enableEditing();
			}
		}
	};
	
	// DEPRECATED
	this.getColor = function(named) {
		return this.COLORS[(this.colorIndex_++) % this.COLORS.length][named ? 0 : 1];
	};
	
	// DEPRECATED
	this.getIcon = function(color) {
		var icon = new GIcon();
		icon.image = "http://www.google.com/mapfiles/ms/micons/" + color + ".png";
		icon.iconSize = new GSize(32, 32);
		icon.iconAnchor = new GPoint(15, 32);
		return icon;
	};
	
	// Start drawing polygon
	this.startShape = function() {
		if( this.gmap ) {
			this.stopEditing();
			this.select( this.varName + "_shape_b");
			var color = this.getColor(false);
			this.ovrCurrent = new GPolygon( [], color, 2, 0.7, color, 0.2 );
			this.aPolygons[ this.aPolygons.length ] = this.ovrCurrent;
			
			this.gmap.addOverlay( this.ovrCurrent );
			powdercloudGISOverlayOwners[ this.ovrCurrent ] = this;
			this.ovrCurrent.enableDrawing( {} );
			this.ovrCurrent.enableEditing( {onEvent: "mouseover"} );
			this.ovrCurrent.disableEditing( {onEvent: "mouseout"} );
			this.updateInput();
			
			GEvent.addListener( this.ovrCurrent, "endline", function() {
				if( powdercloudGISInstances[ this ] ) {
					var gis1 = powdercloudGISInstances[ this ];
					gis1.addPolygonEditEvents( gis1.ovrCurrent );
					/*
					GEvent.bind( gis1.ovrCurrent, "lineupdated", "", function() {
						powdercloudGISUpdateInputAll();
					});

					GEvent.addListener( gis1.ovrCurrent, "click", function( latlng, index ) {
						if( powdercloudGISInstances[ this ] ) {
							var gis2 = powdercloudGISOverlayOwners[ this ];
							var iDel = -1;
							if( typeof index == "number" ) gis2.ovrCurrent.deleteVertex( index );
							else {
								var arr = gis2.aPolygons;
								for( var i = 0; i < gis2.aPolygons.length; i++ ) {
									if( gis2.aPolygons[i] == this ) {
										iDel = i;
										break;
									}
								}
								if( iDel > -1 ) gis2.aPolygons.splice( iDel, 1 );
								gis2.gmap.removeOverlay( this );
							}
							gis2.updateInput();
						}
					});
					*/
			
					gis1.updateInput();
					gis1.startShape();
				}
			});
		}
	};
	this.addPolygonEditEvents = function( poly ) {
		if( poly ) {
			GEvent.bind( poly, "lineupdated", "", function() {
				powdercloudGISUpdateInputAll();
			});

			GEvent.addListener( poly, "click", function( latlng, index ) {
				if( powdercloudGISInstances[ this ] ) {
					var gis2 = powdercloudGISOverlayOwners[ this ];
					var iDel = -1;
					if( typeof index == "number" ) gis2.ovrCurrent.deleteVertex( index );
					else {
						var arr = gis2.aPolygons;
						for( var i = 0; i < gis2.aPolygons.length; i++ ) {
							if( gis2.aPolygons[i] == this ) {
								iDel = i;
								break;
							}
						}
						if( iDel > -1 ) gis2.aPolygons.splice( iDel, 1 );
						gis2.gmap.removeOverlay( this );
					}
					gis2.updateInput();
				}
			});
		}
	}
	
	// Start drawing polyline
	this.startLine = function() {
		if( this.gmap ) {
			this.stopEditing();
			this.select( this.varName + "_line_b");
			var color = this.getColor(false);
			this.ovrCurrent = new GPolyline( [], color );
			this.aLines[ this.aLines.length ] = this.ovrCurrent;
			
			this.gmap.addOverlay( this.ovrCurrent );
			powdercloudGISOverlayOwners[ this.ovrCurrent ] = this;
			this.ovrCurrent.enableDrawing( {} );
			this.ovrCurrent.enableEditing( {onEvent: "mouseover"} );
			this.ovrCurrent.disableEditing( {onEvent: "mouseout"} );
			this.updateInput();
			
			GEvent.addListener( this.ovrCurrent, "endline", function() {
				if( powdercloudGISOverlayOwners[ this ] ) {
					var gis1 = powdercloudGISOverlayOwners[ this ];
					gis1.addLineEditEvents( this );
					/*
					GEvent.bind( gis1.ovrCurrent, "lineupdated", "", function() {
						powdercloudGISUpdateInputAll();
					});

					GEvent.addListener( gis1.ovrCurrent, "click", function( latlng, index ) {
						if( powdercloudGISOverlayOwners[ this ] ) {
							var gis2 = powdercloudGISOverlayOwners[ this ];
							var iDel = -1;
							if( typeof index == "number" ) this.deleteVertex( index );
							else {
								var arr = gis2.aLines;
								for( var i = 0; i < gis2.aLines.length; i++ ) {
									if( gis2.aLines[i] == this ) {
										iDel = i;
										break;
									}
								}
								if( iDel > -1 ) gis2.aLines.splice( iDel, 1 );
								gis2.gmap.removeOverlay( this );
							}
							gis2.updateInput();
						}
					});
					*/
			
					gis1.updateInput();
					gis1.startLine();
				}
			});
		}
	};

	this.addLineEditEvents = function( line ) {
		if( line ) {
			GEvent.bind( line, "lineupdated", "", function() {
				powdercloudGISUpdateInputAll();
			});

			GEvent.addListener( line, "click", function( latlng, index ) {
				if( powdercloudGISOverlayOwners[ this ] ) {
					var gis2 = powdercloudGISOverlayOwners[ this ];
					var iDel = -1;
					if( typeof index == "number" ) this.deleteVertex( index );
					else {
						var arr = gis2.aLines;
						for( var i = 0; i < gis2.aLines.length; i++ ) {
							if( gis2.aLines[i] == this ) {
								iDel = i;
								break;
							}
						}
						if( iDel > -1 ) gis2.aLines.splice( iDel, 1 );
						gis2.gmap.removeOverlay( this );
					}
					gis2.updateInput();
				}
			});
		}
	}
	
	// Place a marker (no drawing involved)
	this.placeMarker = function() {
		if( this.gmap ) {
			this.stopEditing();
			this.select( this.varName + "_placemark_b");
			this.lisMarker = GEvent.addListener( this.gmap, "click", function( overlay, latlng ) {
				if( latlng ) {
					if( powdercloudGISInstances[ this ] ) {
						var gis = powdercloudGISInstances[ this ];
						var marker = gis.addMarker( latlng, true );
						gis.gmap.addOverlay( marker );
						gis.updateInput();
					}
				}
			});
		}
	};
	
	this.addMarker = function( gLatLng, bAllowEdit ) {
		var color = this.getColor( true );
		var marker = new GMarker( gLatLng, {icon: this.getIcon(color), draggable: bAllowEdit} );
		powdercloudGISOverlayOwners[ marker ] = this;
		this.aMarkers[ this.aMarkers.length ] = marker;
		
		if( bAllowEdit ) {
			GEvent.addListener( marker, "dragend", function() {
				if( powdercloudGISInstances[ this ] ) {
					var gis = powdercloudGISInstances[ this ];
					gis.updateInput();
				}
			});
			GEvent.addListener( marker, "click", function() {
				if( marker ) {
					if( powdercloudGISInstances[ this ] ) {
						var gis = powdercloudGISInstances[ this ];
						var iDel = -1;
						for( var i = 0; i < gis.aMarkers.length; i++ ) {
							if( gis.aMarkers[i] == marker ) {
								iDel = i;
								break;
							}
						}
						if( iDel > -1 ) gis.aMarkers.splice( iDel, 1 );
						gis.gmap.removeOverlay( marker );
						gis.updateInput();
					}
				}
			});
		}
		return marker;
	}
	
	this.markersToString = function() {
		var s = ""
		if( this.aMarkers.length > 0 ) {
			s = "MARKERS"
			for( var i = 0; i < this.aMarkers.length; i++ ) {
				s += "##" + this.aMarkers[i].getLatLng().lat() + "|" + this.aMarkers[i].getLatLng().lng();
			}
		}
		return s;
	};
	this.linesToString = function() {
		var s = ""
		if( this.aLines.length > 0 ) {
			for( var i = 0; i < this.aLines.length; i++ ) {
				// Skip lines with only one point (usually a Maps drawing bug)
				if( this.aLines[i].getVertexCount() > 1 ) {
					if( s == "" ) s = "LINES";
					s += "##";
					for( var j = 0; j < this.aLines[i].getVertexCount(); j++) {
						s += "__" + this.aLines[i].getVertex(j).lat() + "|" + this.aLines[i].getVertex(j).lng();
					}
				}
			}
		}
		return s;
	};
	this.polygonsToString = function() {
		var s = ""
		if( this.aPolygons.length > 0 ) {
			for( var i = 0; i < this.aPolygons.length; i++ ) {
				// Skip polys with only one point (usually a Maps drawing bug)
				if( this.aPolygons[i].getVertexCount() > 1 ) {
					if( s == "" ) s = "POLYGONS";
					s += "##";
					for( var j = 0; j < this.aPolygons[i].getVertexCount(); j++) {
						s += "__" + this.aPolygons[i].getVertex(j).lat() + "|" + this.aPolygons[i].getVertex(j).lng();
					}
				}
			}
		}
		return s;
	};
	
	this.updateInput = function() {
		if( this.gmap && this.inChanged ) {
			var txt = "";
			var s = "";
			
			txt += "CENTER##" + this.gmap.getCenter().lat() + "|" + this.gmap.getCenter().lng() + "^^";
			txt += "ZOOM##" + this.gmap.getBoundsZoomLevel( this.gmap.getBounds() ) + "^^";
			
			s = this.markersToString();
			if( s ) txt += s + "^^";
			s = this.linesToString();
			if( s ) txt += s + "^^";
			s = this.polygonsToString();
			if( s ) txt += s + "^^";
			
			this.inChanged.val( txt );
		}
	};
	
	this.setInitialData = function() {
		if( this.gmap && this.inInital && this.inInital.val() && this.inInital.val() != "" ) {
			var arrLines = this.inInital.val().split( "^^" );//TODO use ^^ as separator
			for( var i = 0; i < arrLines.length; i++ ) {
				if( arrLines[i] && arrLines[i] != "" ) {
					var sLine = arrLines[i].replace( "\r", "" );

					if( sLine.indexOf( "CENTER" ) == 0 ) {
						var aParts = sLine.split( "##" );
						if( aParts && aParts.length == 2 ) {
							var aCoords = aParts[1].split( "|" );
							if( aCoords && aCoords.length == 2 ) {
								this.lCenterLat = Number( aCoords[0] );
								this.lCenterLng = Number( aCoords[1] );
							}
						}
					}
					else if( sLine.indexOf( "ZOOM" ) == 0 ) {
						var aParts = sLine.split( "##" );
						if( aParts && aParts.length == 2 ) {
							this.iZoom = Number( aParts[1] );
						}
					}
					else if( sLine.indexOf( "MARKERS" ) == 0 ) {
						var aParts = sLine.split( "##" );
						if( aParts && aParts.length > 1 ) {
							for( var j = 1; j < aParts.length; j++ ) {
								var aCoords = aParts[j].split( "|" );
								if( aCoords && aCoords.length == 2 ) {
									if( !isNaN( aCoords[0] ) && !isNaN( aCoords[1] ) ) {
										if( this.inChanged ) this.addMarker( new GLatLng( Number( aCoords[0] ), Number( aCoords[1] ) ), true );
										else this.addMarker( new GLatLng( Number( aCoords[0] ), Number( aCoords[1] ) ), false );
									}
								}
							}
						}
					}
					else if( sLine.indexOf( "LINES" ) == 0 ) {
						var aLatLngs = [];
						var aParts = sLine.split( "##" );
						if( aParts && aParts.length > 1 ) {
							for( var j = 1; j < aParts.length; j++ ) {
								if( aParts[j] && aParts[j] != "" ) {
									var aPoints = aParts[j].split( "__" );
									if( aPoints && aPoints.length > 1 ) {
										for( var k = 0; k < aPoints.length; k++ ) {
											if( aPoints[k] && aPoints[k] != "" ) {
												var aCoords = aPoints[k].split( "|" );
												if( aCoords && aCoords.length == 2 ) {
													if( !isNaN( aCoords[0] ) && !isNaN( aCoords[1] ) ) {
														aLatLngs[ aLatLngs.length ] = new GLatLng( Number( aCoords[0] ), Number( aCoords[1] ) );
													}
												}
											}
										}
									}
								}
							}
						}
						
						if( aLatLngs.length > 0 ) {
							var line = new GPolyline( aLatLngs );
							this.aLines[ this.aLines.length ] = line;
							powdercloudGISOverlayOwners[ line ] = this;
							if( this.inChanged ) {
								this.addLineEditEvents( line );
								line.enableEditing( {onEvent: "mouseover"} );
								line.disableEditing( {onEvent: "mouseout"} );
							}
						}
					}
					else if( sLine.indexOf( "POLYGONS" ) == 0 ) {
						var aLatLngs = [];
						var aParts = sLine.split( "##" );
						if( aParts && aParts.length > 1 ) {
							for( var j = 1; j < aParts.length; j++ ) {
								if( aParts[j] && aParts[j] != "" ) {
									var aPoints = aParts[j].split( "__" );
									if( aPoints && aPoints.length > 1 ) {
										for( var k = 0; k < aPoints.length; k++ ) {
											if( aPoints[k] && aPoints[k] != "" ) {
												var aCoords = aPoints[k].split( "|" );
												if( aCoords && aCoords.length == 2 ) {
													if( !isNaN( aCoords[0] ) && !isNaN( aCoords[1] ) ) {
														aLatLngs[ aLatLngs.length ] = new GLatLng( Number( aCoords[0] ), Number( aCoords[1] ) );
													}
												}
											}
										}
									}
								}
							}
						}
						
						if( aLatLngs.length > 0 ) {
							var poly = new GPolygon( aLatLngs );
							this.aPolygons[ this.aPolygons.length ] = poly;
							powdercloudGISOverlayOwners[ poly ] = this;
							if( this.inChanged ) {
								this.addPolygonEditEvents( poly );
								poly.enableEditing( {onEvent: "mouseover"} );
								poly.disableEditing( {onEvent: "mouseout"} );
							}
						}
					}
					else {
						//console.log( "Skipping Line " + i + ":" + sLine );
					}
					}
			}
		}
	};
	
	// Update map with center/zoom/overlay data
	this.initialiseMapWithInitialData = function() {
		if( this.gmap ) {
			if( this.lCenterLat && this.lCenterLng ) {
				this.gmap.setCenter( new GLatLng( this.lCenterLat, this.lCenterLng ) );
			}
			if( this.iZoom ) {
				this.gmap.setZoom( this.iZoom );
			}
			if( this.aMarkers && this.aMarkers.length > 0 ) {
				for( var i = 0; i < this.aMarkers.length; i++ ) {
					this.gmap.addOverlay( this.aMarkers[i] );
				}
			}
			if( this.aLines && this.aLines.length > 0 ) {
				for( var i = 0; i < this.aLines.length; i++ ) {
					this.gmap.addOverlay( this.aLines[i] );
				}
			}
			if( this.aPolygons && this.aPolygons.length > 0 ) {
				for( var i = 0; i < this.aPolygons.length; i++ ) {
					this.gmap.addOverlay( this.aPolygons[i] );
				}
			}
		}
	};
	
	// Add the standard drawing toolbar (hand/marker/line/poly)
	this.addEditToolbar = function() {
		if( this.gmap && this.dvMap && this.varName ) {
			this.dvMap.parent().prepend( "<div class=\"dvGISToolbar\"><div class=\"hand_b\" id=\"" + this.varName + "_hand_b\" onclick=\"" + this.varName + ".stopEditing();\"></div><div class=\"placemark_b\" id=\"" + this.varName + "_placemark_b\" onclick=\"" + this.varName + ".placeMarker();\"></div><div class=\"line_b\" id=\"" + this.varName + "_line_b\" onclick=\"" + this.varName + ".startLine()\"></div><div class=\"shape_b\" id=\"" + this.varName + "_shape_b\" onclick=\"" + this.varName + ".startShape()\"></div><br class=\"brC\" /></div>" );
		}
	}
	
	// Resets the map size (to deal with DIVs shown/hidden) and reset all initial map data
	this.reset = function() {
		if( this.gmap ) {
			this.gmap.checkResize();
			this.initialiseMapWithInitialData();
			this.select( this.varName + "_hand_b" );
		}
	}
	
	/**************** CONSTRUCTOR */
	
	if( $ ) {
		if( GMap2 ) {
			if( this.varName ) {
				if( this.idMap && $( "#" + this.idMap ).length == 1 ) {
					this.dvMap = $("#" + this.idMap );
				}
				if( this.idInitial && $( "#" + this.idInitial ).length == 1 ) {
					this.inInital = $("#" + this.idInitial );
				}
				if( this.idChanged && $( "#" + this.idChanged ).length == 1 ) {
					this.inChanged = $("#" + this.idChanged );
				}

				if( this.dvMap ) {
					this.gmap = new GMap2( document.getElementById( this.idMap ) );

					// keep track of instances
					powdercloudGISInstances[ this.gmap ] = this;
					
					// set up initial map properties
					this.gmap.addControl(new GLargeMapControl3D());
					this.gmap.addControl(new GMapTypeControl());
					this.gmap.addControl(new GScaleControl());
					this.gmap.addControl(new GNavLabelControl(), new GControlPosition( G_ANCHOR_TOP_LEFT, new GSize(75,7) ) );
					this.gmap.addMapType(G_SATELLITE_3D_MAP);
					this.gmap.addMapType(G_PHYSICAL_MAP);
					this.gmap.enableScrollWheelZoom();
					this.gmap.clearOverlays();
					this.setInitialData();
					this.initialiseMapWithInitialData();

					if( this.inChanged ) {
						this.addEditToolbar();

						GEvent.addListener( this.gmap, "moveend", function() {
							if( powdercloudGISInstances[ this ] ) powdercloudGISInstances[ this ].updateInput();
						});
						GEvent.addListener( this.gmap, "zoomend", function() {
							if( powdercloudGISInstances[ this ] ) powdercloudGISInstances[ this ].updateInput();
						});
					}
				
				}
			}
			else alert( "GIS Mapping has not been initialised correctly, so map can not be displayed correctly." );
		}
		else alert( "Google Maps API (v2) not initialised correctly, so map can not be displayed correctly." );
	}
	else alert( "jQuery JavaScript library not initialised correctly, so map errors are likely." );
}

// For each editable GIS instance, call its udateInput() method.
function powdercloudGISUpdateInputAll() {
	for( var key in powdercloudGISInstances ) {
		if( powdercloudGISInstances[ key ]) {
			powdercloudGISInstances[key].updateInput();
		}
	}
}
