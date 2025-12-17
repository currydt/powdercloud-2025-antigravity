var powdercloudGISInstances = [];
var powdercloudGISOverlayOwners = [];

GMap2.prototype.inInitial;

GMap2.prototype.inChanged;
GMap2.prototype.lCenterLat = 50.139836;
GMap2.prototype.lCenterLng = -122.956924;
GMap2.prototype.markerBounds = new GLatLngBounds();
GMap2.prototype.iZoom = 4;
GMap2.prototype.sCurrentMode;

GMap2.prototype.aMarkers = [];
GMap2.prototype.aLines = [];
GMap2.prototype.aPolygons = [];
// Drawing variables
GMap2.prototype.lisMarker = null; // the event listner for marker placement
GMap2.prototype.lisDbClick = null; 
GMap2.prototype.ovrCurrent; // the current overlay for poly/line drawing
// Variables used internally in this class
GMap2.prototype.COLORS = [
    ["red", "#ff0000"],
    ["orange", "#ff8800"],
    ["green", "#008000"],
    ["blue", "#000080"],
    ["purple", "#800080"]
];
GMap2.prototype.colorIndex_ = 0;

GMap2.prototype.getColor = function(named) {
    return this.COLORS[(this.colorIndex_++) % this.COLORS.length][named ? 0 : 1];
};
GMap2.prototype.singleClick = function(overlay, latlng) {
        if (overlay && this.gmap.lisMarker == null) {
            Ext.each(this.gmap.aMarkers, function(item, index){
                    if(item == overlay){
			this.showOverlayDetails(overlay);
			//this.gmap.openInfoWindowHtml(overlay.getLatLng(),overlay.pcDescription);
                    }
            }, this);
            Ext.each(this.gmap.aLines, function(item, index){
                    if(item == overlay){
			this.showOverlayDetails(overlay);
                        //this.gmap.openInfoWindowHtml(overlay.getVertex(0),overlay.pcDescription);
                    }
            }, this);
            Ext.each(this.gmap.aPolygons, function(item, index){
                    if(item == overlay){
			this.showOverlayDetails(overlay);
                        //this.gmap.openInfoWindowHtml(overlay.getVertex(0),overlay.pcDescription);
                    }
            }, this);
        }
};
//http://code.google.com/p/google-maps-icons/wiki/EventsIcons
GMap2.prototype.getIcon = function(value) {
    var icon = new GIcon();
    icon.image = MapIcons(value);
    icon.iconSize = new GSize(32, 32);
    icon.iconAnchor = new GPoint(15, 32);
    return icon;
};
GMap2.prototype.addMarker = function(gLatLng, bAllowEdit, icon, description) {
	var color = this.getColor(true);
	var marker = new GMarker(gLatLng, {
	    icon: this.getIcon(icon),
	    draggable: bAllowEdit
	});
	marker.pcDescription = description;
	marker.imageType = icon;
	powdercloudGISOverlayOwners[marker] = this;
	this.aMarkers.push(marker);
	return marker;
}
GMap2.prototype.setInitialData = function(record) {
    if (this && this.inInital) {
        var json = Ext.decode(this.inInital);
        
        this.lCenterLat = Number(json.properties.center[0]);
        this.lCenterLng = Number(json.properties.center[1]);
        this.iZoom = Number(json.properties.zoom);
        Ext.each(json.features, function(item){
                switch(item.geometry.type){
                        case "Point":
                                var marker = this.addMarker(new GLatLng(Number(item.geometry.coordinates[0]),
                                                           Number(item.geometry.coordinates[1])),
                                                this.inChanged,
                                                item.properties.icon,
                                                item.properties.description)
				marker.record = record;
                                break;
                        case "LineString":
                                var aLatLngs = [];
                                Ext.each(item.geometry.coordinates, function(point){
                                        aLatLngs.push( new GLatLng(Number(point[0]), Number(point[1])) );
                                }, this);
                                var line = new GPolyline(aLatLngs, item.properties.color);
                                line.pcDescription = item.properties.description
                                this.aLines.push(line);
                                powdercloudGISOverlayOwners[line] = this;
				line.record = record;
                                break;
                        case "Polygon":
                                var aLatLngs = [];
                                Ext.each(item.geometry.coordinates, function(point){
                                        aLatLngs.push( new GLatLng(Number(point[0]), Number(point[1])) );
                                }, this);
                                var poly = new GPolygon(aLatLngs, item.properties.color, 2, 0.7, item.properties.color, 0.2);
                                poly.pcDescription = item.properties.description
                                this.aPolygons.push(poly);
                                powdercloudGISOverlayOwners[poly] = this;
				poly.record = record;
                                break;
                }
        }, this);
    }
};
// Update map with center/zoom/overlay data
GMap2.prototype.initialiseMapWithInitialData = function() {
    if (this) {
	if (this.aMarkers && this.aMarkers.length > 0) {
	    for (var i = 0; i < this.aMarkers.length; i++) {
		this.markerBounds.extend(this.aMarkers[i].getLatLng());
		this.addOverlay(this.aMarkers[i]);
	    }
	}
	if (this.aLines && this.aLines.length > 0) {
	    for (var i = 0; i < this.aLines.length; i++) {
		for (var j = 0; j < this.aLines[i].getVertexCount(); j++) {
		    this.markerBounds.extend(this.aLines[i].getVertex(j));
		}
		this.addOverlay(this.aLines[i]);
	    }
	}
	if (this.aPolygons && this.aPolygons.length > 0) {
	    for (var i = 0; i < this.aPolygons.length; i++) {
		for (var j = 0; j < this.aPolygons[i].getVertexCount(); j++) {
		    this.markerBounds.extend(this.aPolygons[i].getVertex(j));
		}
		this.addOverlay(this.aPolygons[i]);
	    }
	}
    }
};
Ext.namespace('Ext.ux');

/**
 *
 * @class GMapPanel
 * @extends Ext.Panel
 */
Ext.ux.GMapPanel = Ext.extend(Ext.Panel, {
    initComponent: function() {


	var defConfig = {
	    plain: true,
	    zoomLevel: 3,
	    yaw: 180,
	    pitch: 0,
	    zoom: 0,
	    gmapType: 'map',
	    border: false
	}

	Ext.applyIf(this, defConfig);

	Ext.ux.GMapPanel.superclass.initComponent.call(this);

    },
    afterRender: function() {

	var wh = this.ownerCt.getSize();
	Ext.applyIf(this, wh);

	Ext.ux.GMapPanel.superclass.afterRender.call(this);

	if (this.gmapType === 'map') {
	    this.gmap = new GMap2(this.body.dom);
	}

	if (this.gmapType === 'panorama') {
	    this.gmap = new GStreetviewPanorama(this.body.dom);
	}

	if (typeof this.addControl === 'object' && this.gmapType === 'map') {
	    this.gmap.addControl(this.addControl);
	}
	powdercloudGISInstances.push(this.gmap);
	this.gmap.lisDbClick = GEvent.bind(this.gmap, "click", this, this.gmap.singleClick);        
	if (typeof this.setCenter === 'object') {
	    if (typeof this.setCenter.geoCodeAddr === 'string') {
		this.geoCodeLookup(this.setCenter.geoCodeAddr);
	    } else {
		if (this.gmapType === 'map') {
		    var point = new GLatLng(this.setCenter.lat, this.setCenter['long']);
		    this.gmap.setCenter(point, this.zoomLevel);
		}
		if (typeof this.setCenter.marker === 'object' && typeof point === 'object') {
		    this.addMarker(point, this.setCenter.marker, this.setCenter.marker.clear);
		}
	    }
	    if (this.gmapType === 'panorama') {
		this.gmap.setLocationAndPOV(new GLatLng(this.setCenter.lat, this.setCenter['long']), {
		    yaw: this.yaw,
		    pitch: this.pitch,
		    zoom: this.zoom
		});
	    }
	}


	this.gmap.addControl(new GLargeMapControl3D());
	this.gmap.addControl(new GMapTypeControl());
	this.gmap.addControl(new GScaleControl());
	this.gmap.addMapType(G_PHYSICAL_MAP);
	this.gmap.addMapType(G_SATELLITE_3D_MAP);
	this.gmap.setMapType(G_HYBRID_MAP);
	//this.gmap.enableScrollWheelZoom();
	this.gmap.clearOverlays();
	if (this.lCenterLat && this.lCenterLng) {
	    this.setCenter(new GLatLng(this.lCenterLat, this.lCenterLng));
	}
	if (this.iZoom) {
	    this.setZoom(this.iZoom);
	}



    },
    onResize: function(w, h) {

	if (typeof this.gmap == 'object') {
	    this.gmap.checkResize();
	}

	Ext.ux.GMapPanel.superclass.onResize.call(this, w, h);

    },
    setSize: function(width, height, animate) {

	if (typeof this.gmap == 'object') {
	    this.gmap.checkResize();
	}

	Ext.ux.GMapPanel.superclass.setSize.call(this, width, height, animate);

    },
    getMap: function() {

	return this.gmap;

    },
    addMapData: function(data, record) {
	this.gmap.inInital = data;

	this.gmap.setInitialData(record);
	this.gmap.initialiseMapWithInitialData();
	this.gmap.setCenter(this.gmap.markerBounds.getCenter(), this.gmap.getBoundsZoomLevel(this.gmap.markerBounds));

    },
    clearOverlays: function() {
	try{
	    this.gmap.aMarkers = [];
	    this.gmap.aLines = [];
	    this.gmap.aPolygons = [];
	    
	    this.gmap.markerBounds = new GLatLngBounds();
	    this.gmap.clearOverlays();
	} catch(err){
	    
	}
    },
    refreshView: function() {
	this.gmap.setCenter(this.gmap.markerBounds.getCenter(), this.gmap.getBoundsZoomLevel(this.gmap.markerBounds));
    },
    showOverlayDetails: function(overlay) {
        if (this.overlayDetailsDialog === undefined) {
            this.overlayDetailsDialog = new Ext.Window({
                width: 600,
                autoHeight: true,
                closeAction: 'hide',
                modal: true,
                mapOverlay: null,
                title: 'Details',
                defaults: {
                    plain: true,
                    border: false,
                    width: '100%',
                    bodyStyle: 'padding: 5px'
                },
                items: [
                new Ext.FormPanel({
                    autoHeight: true,
		    id:'mapMarkerForm',
                    defaults: {
                        width: 160,
                        anchor: '0'
                    },
                    items: [{
                        xtype: 'fieldset',
                        collapsible: false,
                        collapsed: false,
                        width: '75%',
                        title: 'Details',
			defaults:{
				xtype: 'displayfield'
			},
                        items: this.overlayDetailFields
                    },{
                        xtype: 'fieldset',
                        collapsible: false,
                        collapsed: false,
			id:'mapMarkerDescription',
                        width: '75%',
                        title: 'Marker Details',
			defaults:{
				xtype: 'displayfield'
			},
                        items: [{
                            name: 'pcDescription',
			    fieldLabel: 'Overlay description'
                        }]
                    }]
                })],
                buttons: [
                {
                    text: 'Cancel',
                    scope: this,
                    handler: function() {
                        this.overlayDetailsDialog.hide();
                    }
                }]
            });
        }
        this.overlayDetailsDialog.mapOverlay = overlay;
	if(overlay.record){
		Ext.getCmp('mapMarkerForm').getForm().setValues(Ext.apply(overlay.record.data, {pcDescription: overlay.pcDescription}));
	}
        if (overlay.pcDescription !== undefined) {
            Ext.getCmp('mapMarkerDescription').show();
        } else {
            Ext.getCmp('mapMarkerDescription').hide();
        }
        this.overlayDetailsDialog.show();
    }
});

Ext.reg('gmappanel', Ext.ux.GMapPanel);