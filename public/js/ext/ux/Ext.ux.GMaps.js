var powdercloudGISInstances = [];
var powdercloudGISOverlayOwners = [];

GMap2.prototype.inInitial;
GMap2.prototype.isDeleteMode = true;

GMap2.prototype.inChanged;
GMap2.prototype.lCenterLat = 50.139836;
GMap2.prototype.lCenterLng = -122.956924;
GMap2.prototype.markerBounds = new GLatLngBounds();
GMap2.prototype.iZoom = 4;
GMap2.prototype.sCurrentMode;

GMap2.prototype.aBackgroundMarkers = [];
GMap2.prototype.aBackgroundLines = [];
GMap2.prototype.aBackgroundPolygons = [];

GMap2.prototype.aForegroundMarkers = [];
GMap2.prototype.aForegroundLines = [];
GMap2.prototype.aForegroundPolygons = [];

GMap2.prototype.aMarkers = GMap2.aForegroundMarkers;
GMap2.prototype.aLines = GMap2.aForegroundLines;
GMap2.prototype.aPolygons = GMap2.aForegroundPolygons;
// Drawing variables
GMap2.prototype.lisMarker = null; // the event listner for marker placement
GMap2.prototype.lisDbClick = null;
GMap2.prototype.ovrCurrent; // the current overlay for poly/line drawing
// Variables used internally in this class
GMap2.prototype.color = '#ff0000';
GMap2.prototype.defaultPoint = 'normal';

GMap2.prototype.getColor = function() {
    return this.color;
};
GMap2.prototype.doubleClick = function(overlay, latlng) {
    if (overlay && this.gmap.lisMarker === null) {
        Ext.each(this.gmap.aMarkers, function(item, index) {
            if (item === overlay) {
                this.showMakerEditForm(overlay);
            }
        }, this);
        Ext.each(this.gmap.aLines, function(item, index) {
            if (item === overlay) {
                this.showMakerEditForm(overlay);
            }
        }, this);
        Ext.each(this.gmap.aPolygons, function(item, index) {
            if (item === overlay) {
                this.showMakerEditForm(overlay);
            }
        }, this);
    }
};
GMap2.prototype.stopEditing = function(map) {
    if (this.lisMarker) {
        GEvent.removeListener(this.lisMarker);
        this.lisMarker = null;
    }
    if (this.ovrCurrent) {
        // cancel any marker/poly being drawn at the moment
        this.ovrCurrent.disableEditing();
        this.ovrCurrent.enableEditing();
    }
};
GMap2.prototype.startLine = function() {
    if (this) {
        this.stopEditing();
        var color = this.getColor(false);
        this.ovrCurrent = new GPolyline([], color);
        this.aLines[this.aLines.length] = this.ovrCurrent;

        this.addOverlay(this.ovrCurrent);
        powdercloudGISOverlayOwners[this.ovrCurrent] = this;
        this.ovrCurrent.enableDrawing({});
        this.ovrCurrent.enableEditing({
            onEvent: "mouseover"
        });
        this.ovrCurrent.disableEditing({
            onEvent: "mouseout"
        });
        //this.updateInput();

        GEvent.addListener(this.ovrCurrent, "endline", function() {
            if (powdercloudGISOverlayOwners[this]) {
                var gis1 = powdercloudGISOverlayOwners[this];
                gis1.addLineEditEvents(this);
                //gis1.updateInput();
                gis1.startLine();
            }
        });
    }
};
GMap2.prototype.startShape = function() {
    if (this) {
        this.stopEditing();
        var color = this.getColor(false);
        this.ovrCurrent = new GPolygon([], color, 2, 0.7, color, 0.2);
        this.aPolygons[this.aPolygons.length] = this.ovrCurrent;

        this.addOverlay(this.ovrCurrent);
        powdercloudGISOverlayOwners[this.ovrCurrent] = this;
        this.ovrCurrent.enableDrawing({});
        this.ovrCurrent.enableEditing({
            onEvent: "mouseover"
        });
        this.ovrCurrent.disableEditing({
            onEvent: "mouseout"
        });
        //this.updateInput();
        GEvent.addListener(this.ovrCurrent, "endline", function() {
            if (powdercloudGISInstances[this]) {
                var gis1 = powdercloudGISInstances[this];
                gis1.addPolygonEditEvents(gis1.ovrCurrent);
                //gis1.updateInput();
                gis1.startShape();
            }
        });
    }
};
GMap2.prototype.placeMarker = function(icon) {
    if (this) {
        this.stopEditing();
        if (icon === undefined) icon = "normal";
        this.lisMarker = GEvent.bind(this, "click", this, function(overlay, latlng) {
            if (latlng) {
                var marker = this.addMarker(latlng, true, icon);
                this.addOverlay(marker);
            }
        });
    }
};
GMap2.prototype.addLineEditEvents = function(line) {
    if (line) {
        GEvent.bind(line, "lineupdated", "", function() {
            //powdercloudGISUpdateInputAll();
        });
/*
        GEvent.addListener(line, "click", function(latlng, index) {
            if (powdercloudGISOverlayOwners[this]) {
                var gis2 = powdercloudGISOverlayOwners[this];
                var iDel = -1;
                if (typeof index === "number") this.deleteVertex(index);
                else {
                    var arr = gis2.aLines;
                    for (var i = 0; i < gis2.aLines.length; i++) {
                        if (gis2.aLines[i] === this) {
                            iDel = i;
                            break;
                        }
                    }
                    if (iDel > -1) gis2.aLines.splice(iDel, 1);
                    gis2.gmap.removeOverlay(this);
                }
                gis2.updateInput();
            }
        });
        */
    }
}
GMap2.prototype.addPolygonEditEvents = function(poly) {
    if (poly) {
        GEvent.bind(poly, "lineupdated", "", function() {
            //powdercloudGISUpdateInputAll();
        });
/*
        GEvent.addListener(poly, "click", function(latlng, index) {
            if (powdercloudGISInstances[this]) {
                var gis2 = powdercloudGISOverlayOwners[this];
                var iDel = -1;
                if (typeof index === "number") gis2.ovrCurrent.deleteVertex(index);
                else {
                    var arr = gis2.aPolygons;
                    for (var i = 0; i < gis2.aPolygons.length; i++) {
                        if (gis2.aPolygons[i] === this) {
                            iDel = i;
                            break;
                        }
                    }
                    if (iDel > -1) gis2.aPolygons.splice(iDel, 1);
                    gis2.gmap.removeOverlay(this);
                }
                gis2.updateInput();
            }
        });
        */
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
    this.aMarkers[this.aMarkers.length] = marker;

    if (bAllowEdit) {
        GEvent.addListener(marker, "dragend", function() {
            if (powdercloudGISInstances[this]) {
                var gis = powdercloudGISInstances[this];
                gis.updateInput();
            }
        });
        //GEvent.addListener(marker, "click", function() {
        //    if (marker) {
        //        if (powdercloudGISInstances[this]) {
        //            var gis = powdercloudGISInstances[this];
        //            var iDel = -1;
        //            for (var i = 0; i < gis.aMarkers.length; i++) {
        //                if (gis.aMarkers[i] === marker) {
        //                    iDel = i;
        //                    break;
        //                }
        //            }
        //            if (iDel > -1) gis.aMarkers.splice(iDel, 1);
        //            gis.gmap.removeOverlay(marker);
        //            gis.updateInput();
        //        }
        //    }
        //});
    }
    return marker;
}
GMap2.prototype.setInitialData = function() {
    if (this && this.inInital) {
        var json = Ext.decode(this.inInital);

        this.lCenterLat = Number(json.properties.center[0]);
        this.lCenterLng = Number(json.properties.center[1]);
        this.iZoom = Number(json.properties.zoom);
        Ext.each(json.features, function(item) {
            switch (item.geometry.type) {
            case "Point":
                var marker = this.addMarker(new GLatLng(Number(item.geometry.coordinates[0]), Number(item.geometry.coordinates[1])), this.inChanged, item.properties.icon, item.properties.description)
                this.addOverlay(marker);
                break;
            case "LineString":
                var aLatLngs = [];
                Ext.each(item.geometry.coordinates, function(point) {
                    aLatLngs.push(new GLatLng(Number(point[0]), Number(point[1])));
                }, this);
                var line = new GPolyline(aLatLngs, item.properties.color);
                line.pcDescription = item.properties.description;
                this.aLines[this.aLines.length] = line;
                powdercloudGISOverlayOwners[line] = this;
                this.addOverlay(line);
                if (this.inChanged) {
                    this.addLineEditEvents(line);
                    line.enableEditing({
                        onEvent: "mouseover"
                    });
                    line.disableEditing({
                        onEvent: "mouseout"
                    });
                }
                break;
            case "Polygon":
                var aLatLngs = [];
                Ext.each(item.geometry.coordinates, function(point) {
                    aLatLngs.push(new GLatLng(Number(point[0]), Number(point[1])));
                }, this);
                var poly = new GPolygon(aLatLngs, item.properties.color, 2, 0.7, item.properties.color, 0.2);
                poly.pcDescription = item.properties.description
                this.aPolygons[this.aPolygons.length] = poly;
                powdercloudGISOverlayOwners[poly] = this;
                this.addOverlay(poly);
                if (this.inChanged) {
                    this.addPolygonEditEvents(poly);
                    poly.enableEditing({
                        onEvent: "mouseover"
                    });
                    poly.disableEditing({
                        onEvent: "mouseout"
                    });
                }
                break;
            }
        }, this);
    }
};
// Update map with center/zoom/overlay data
GMap2.prototype.initialiseMapWithInitialData = function() {
    if (this) {
        if (this.lCenterLat && this.lCenterLng) {
            this.setCenter(new GLatLng(this.lCenterLat, this.lCenterLng));
        }
        if (this.iZoom) {
            this.setZoom(this.iZoom);
        }
        /*
        if (this.aMarkers && this.aMarkers.length > 0) {
            var i;
            for (i = 0; i < this.aMarkers.length; i++) {
                this.markerBounds.extend(this.aMarkers[i].getLatLng());
                this.addOverlay(this.aMarkers[i]);
            }
        }
        */
        if (this.aLines && this.aLines.length > 0) {
            var i;
            for (i = 0; i < this.aLines.length; i++) {
                var j;
                for (j = 0; j < this.aLines[i].getVertexCount(); j++) {
                    this.markerBounds.extend(this.aLines[i].getVertex(j));
                }
                //this.addOverlay(this.aLines[i]);
            }
        }
        if (this.aPolygons && this.aPolygons.length > 0) {
            var i;
            for (i = 0; i < this.aPolygons.length; i++) {
                var j;
                for (j = 0; j < this.aPolygons[i].getVertexCount(); j++) {
                    this.markerBounds.extend(this.aPolygons[i].getVertex(j));
                }
                //this.addOverlay(this.aPolygons[i]);
            }
        }
    }
};
GMap2.prototype.getOverlayData = function() {
    if (this) {
        var jsonFeatures = [];
        var jsonItem = {};
        if (this.aMarkers.length > 0) {
            var i;
            for (i = 0; i < this.aMarkers.length; i++) {
                jsonItem = {
                    type: 'Feature',
                    geometry: {
                        type: 'Point',
                        coordinates: [this.aMarkers[i].getLatLng().lat(), this.aMarkers[i].getLatLng().lng()]
                    },
                    properties: {
                        icon: this.aMarkers[i].imageType
                    }
                };
                if (this.aMarkers[i].pcDescription) {
                    jsonItem.properties.description = this.aMarkers[i].pcDescription;
                }
                jsonFeatures.push(jsonItem);
            }
        }
        if (this.aLines.length > 0) {
            var i;
            for (i = 0; i < this.aLines.length; i++) {
                jsonItem = {
                    type: 'Feature',
                    geometry: {
                        type: 'LineString',
                        coordinates: []
                    },
                    properties: {
                        color: this.aLines[i].color
                    }
                };
                var j;
                var hasVertex = false;
                for (j = 0; j < this.aLines[i].getVertexCount(); j++) {
                    jsonItem.geometry.coordinates.push([this.aLines[i].getVertex(j).lat(), this.aLines[i].getVertex(j).lng()]);
                    hasVertex = true;
                }
                if (this.aLines[i].pcDescription) {
                    jsonItem.properties.description = this.aLines[i].pcDescription;
                }
                if(hasVertex){
                    jsonFeatures.push(jsonItem);
                }
            }
        }
        if (this.aPolygons.length > 0) {
           var i;
            for (i = 0; i < this.aPolygons.length; i++) {
                jsonItem = {
                    type: 'Feature',
                    geometry: {
                        type: 'Polygon',
                        coordinates: []
                    },
                    properties: {
                        color: this.aPolygons[i].color
                    }
                };
                var j;
                var hasVertex = false;
                for (j = 0; j < this.aPolygons[i].getVertexCount(); j++) {
                    jsonItem.geometry.coordinates.push([this.aPolygons[i].getVertex(j).lat(), this.aPolygons[i].getVertex(j).lng()]);
                    hasVertex = true;
                }
                if (this.aPolygons[i].pcDescription) {
                    jsonItem.properties.description = this.aPolygons[i].pcDescription;
                }
                if(hasVertex){
                    jsonFeatures.push(jsonItem);
                }
            }
        }

        var json = {
            type: "FeatureCollection",
            features: jsonFeatures,
            properties: {
                zoom: this.getBoundsZoomLevel(this.getBounds()),
                center: [this.getCenter().lat(), this.getCenter().lng()]
            }
        };
        return Ext.encode(json);
    }
};

Ext.namespace('Ext.ux');

/**
 *
 * @class GMapPanel
 * @extends Ext.Panel
 */
Ext.ux.GMapPanel = Ext.extend(Ext.Panel, {
    tbar: [{
        text: 'Hand',
        iconCls: 'map-hand',
        scope: this,
        handler: function() {
            powdercloudGISInstances[0].stopEditing();
        }
    }, '-',
    {
        text: 'Point',
        iconCls: 'map-point',
        scope: this,
        handler: function() {
            powdercloudGISInstances[0].placeMarker(this.defaultPoint);
        }
    }, {
        text: 'Line',
        iconCls: 'map-line',
        scope: this,
        handler: function() {
            powdercloudGISInstances[0].startLine();
        }
    }, {
        text: 'Path',
        iconCls: 'map-shape',
        scope: this,
        handler: function() {
            powdercloudGISInstances[0].startShape();
        }
    }, {
        text: 'Placemark',
        iconCls: 'map-mark',
        menu: new Ext.menu.Menu({
            items: [{
                text: 'Avalanche',
                menu: new Ext.menu.Menu({
                    items: [{
                        text: 'Size 1',
                        scope: this,
                        handler: function() {
                            powdercloudGISInstances[0].placeMarker('avalanche1');
                        }
                    }, {
                        text: 'Size 2',
                        scope: this,
                        handler: function() {
                            powdercloudGISInstances[0].placeMarker('avalanche2');
                        }
                    }, {
                        text: 'Size 3',
                        scope: this,
                        handler: function() {
                            powdercloudGISInstances[0].placeMarker('avalanche3');
                        }
                    }, {
                        text: 'Size 4',
                        scope: this,
                        handler: function() {
                            powdercloudGISInstances[0].placeMarker('avalanche4');
                        }
                    }, {
                        text: 'Detonation',
                        scope: this,
                        handler: function() {
                            powdercloudGISInstances[0].placeMarker('detonation');
                        }
                    }, {
                        text: 'Explosion',
                        scope: this,
                        handler: function() {
                            powdercloudGISInstances[0].placeMarker('explosion');
                        }
                    }]
                })
            }, {
                text: 'Weather',
                menu: new Ext.menu.Menu({
                    items: [{
                        text: 'Study plot',
                        scope: this,
                        handler: function() {
                            powdercloudGISInstances[0].placeMarker('study-plot');
                        }
                    }, {
                        text: 'Field weather',
                        scope: this,
                        handler: function() {
                            powdercloudGISInstances[0].placeMarker('field-weather');
                        }
                    }]
                })
            }, {
                text: 'Sighting',
                menu: new Ext.menu.Menu({
                    items: [{
                        text: 'Animal',
                        scope: this,
                        handler: function() {
                            powdercloudGISInstances[0].placeMarker('animal');
                        }
                    }]
                })
            },{
                text: 'Features',
                menu: new Ext.menu.Menu({
                    items: [{
                        text: 'Region',
                        scope: this,
                        handler: function() {
                            powdercloudGISInstances[0].placeMarker('feature-region');
                        }
                    },{
                        text: 'Forecast Zone',
                        scope: this,
                        handler: function() {
                            powdercloudGISInstances[0].placeMarker('feature-forzone');
                        }
                    },{
                        text: 'Operating Zone',
                        scope: this,
                        handler: function() {
                            powdercloudGISInstances[0].placeMarker('feature-opzone');
                        }
                    },{
                        text: 'Drainage',
                        scope: this,
                        handler: function() {
                            powdercloudGISInstances[0].placeMarker('feature-drainage');
                        }
                    },{
                        text: 'Weather Station',
                        scope: this,
                        handler: function() {
                            powdercloudGISInstances[0].placeMarker('feature-station');
                        }
                    },{
                        text: 'Route',
                        scope: this,
                        handler: function() {
                            powdercloudGISInstances[0].placeMarker('feature-route');
                        }
                    },{
                        text: 'Run',
                        scope: this,
                        handler: function() {
                            powdercloudGISInstances[0].placeMarker('feature-run');
                        }
                    },{
                        text: 'Road',
                        scope: this,
                        handler: function() {
                            powdercloudGISInstances[0].placeMarker('feature-road');
                        }
                    },{
                        text: 'Path',
                        scope: this,
                        handler: function() {
                            powdercloudGISInstances[0].placeMarker('feature-path');
                        }
                    }]
                })
            }]
        })
    }],
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

        if(this.defaultColor){
                this.gmap.color =this.defaultColor;
        }
        if(this.defaultPoint){
                this.gmap.defaultPoint =this.defaultPoint;

        }

        this.gmap.lisDbClick = GEvent.bind(this.gmap, "click", this, this.gmap.doubleClick);

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
        this.gmap.setInitialData();
        this.gmap.initialiseMapWithInitialData();


        var dt = new Ext.util.DelayedTask();
        dt.delay(300, function() {
            this.addMarkers(this.markers);
        }, this);

    },
    onResize: function(w, h) {

        if (typeof this.gmap === 'object') {
            this.gmap.checkResize();
        }

        Ext.ux.GMapPanel.superclass.onResize.call(this, w, h);

    },
    setSize: function(width, height, animate) {

        if (typeof this.gmap === 'object') {
            this.gmap.checkResize();
        }

        Ext.ux.GMapPanel.superclass.setSize.call(this, width, height, animate);

    },
    getMap: function() {

        return this.gmap;

    },
    getMapData: function() {

        return this.gmap.getOverlayData();

    },
    setMapData: function(backgroundData, foregroundData) {
        this.clearOverlays();
        if (backgroundData != null) {
            this.setBackgroundData(backgroundData);
        }
        this.setForegroundData(foregroundData);
        //this.gmap.setCenter(this.gmap.markerBounds.getCenter(), this.gmap.getBoundsZoomLevel(this.gmap.markerBounds));
    },
    clearOverlays: function() {
        this.gmap.aBackgroundMarkers = [];
        this.gmap.aBackgroundLines = [];
        this.gmap.aBackgroundPolygons = [];

        this.gmap.aForegroundMarkers = [];
        this.gmap.aForegroundLines = [];
        this.gmap.aForegroundPolygons = [];

        this.gmap.aMarkers = this.gmap.aForegroundMarkers;
        this.gmap.aLines = this.gmap.aForegroundLines;
        this.gmap.aPolygons = this.gmap.aForegroundPolygons;

        this.gmap.markerBounds = new GLatLngBounds();

        this.gmap.clearOverlays();
    },
    setBackgroundData: function(value) {
        this.gmap.inInital = value;

        this.gmap.aMarkers = this.gmap.aBackgroundMarkers;
        this.gmap.aLines = this.gmap.aBackgroundLines;
        this.gmap.aPolygons = this.gmap.aBackgroundPolygons;
        this.gmap.inChanged = false;
        this.gmap.setInitialData();
        this.gmap.initialiseMapWithInitialData();
    },
    setForegroundData: function(value) {
        this.gmap.inInital = value;

        this.gmap.aMarkers = this.gmap.aForegroundMarkers;
        this.gmap.aLines = this.gmap.aForegroundLines;
        this.gmap.aPolygons = this.gmap.aForegroundPolygons;

        if (value != null && value.length > 0) {
            this.gmap.inChanged = true;
            this.gmap.setInitialData();
            this.gmap.initialiseMapWithInitialData();
        }

    },
    addMarkers: function(markers) {

        if (Ext.isArray(markers)) {
            var i;
            for (i = 0; i < markers.length; i++) {
                var mkr_point = new GLatLng(markers[i].lat, markers[i]['long']);
                this.addMarker(mkr_point, markers[i].marker, false, markers[i].setCenter);
            }
        }

    },
    showMakerEditForm: function(overlay) {
        if (this.markerEditForm === undefined) {
            this.markerEditForm = new Ext.Window({
                width: 600,
                autoHeight: true,
                closeAction: 'hide',
                modal: true,
                mapOverlay: null,
                title: 'Overlay description',
                defaults: {
                    plain: true,
                    border: false,
                    width: '100%',
                    bodyStyle: 'padding: 5px'
                },
                items: [
                new Ext.FormPanel({
                    autoHeight: true,
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
                        items: [{
                            xtype: 'textarea',
                            id: 'mapMarkerDescription',
                            fieldLabel: 'Description',
                            //maskRe: /^([ _a-zA-Z0-9\^\$\.\+\?\=\:\\\/\(\)\[\]\&\-])+$/,
                            width: 400,
                            height: 75,
                            name: 'description'
                        }, {
                            fieldLabel: 'Color',
                            id: 'mapMarkerColor',
                            xtype: 'colorpalette',
                            hideLabel : true,
                            name: 'color',
                            listeners: {
                                select: {
                                    scope: this,
                                    fn: function(cp, color) {
                                        // polygon
                                        if(this.markerEditForm.mapOverlay instanceof GPolygon){
                                                this.markerEditForm.mapOverlay.setFillStyle({
                                                        color: '#'+color,
                                                        weight: 2,
                                                        opacity: 0.7
                                                });
                                        }

                                        this.markerEditForm.mapOverlay.setStrokeStyle({
                                            color: '#'+color,
                                            weight: 2,
                                            opacity: 0.7
                                        });
                                        // line
                                    }
                                }
                            }
                        }]
                    }]
                })],
                buttonAlign: 'left',
                buttons: [{
                    text: 'Delete',
                    scope: this,
                    handler: function() {
                        Ext.each(this.gmap.aMarkers, function(item, index) {
                            if (item === this.markerEditForm.mapOverlay) {
                                this.gmap.removeOverlay(this.markerEditForm.mapOverlay);
                                this.gmap.aMarkers.splice(index, 1);
                            }
                        }, this);
                        Ext.each(this.gmap.aLines, function(item, index) {
                            if (item === overlay) {
                                this.gmap.removeOverlay(this.markerEditForm.mapOverlay);
                                this.gmap.aLines.splice(index, 1);
                            }
                        }, this);
                        Ext.each(this.gmap.aPolygons, function(item, index) {
                            if (item === this.markerEditForm.mapOverlay) {
                                this.gmap.removeOverlay(this.markerEditForm.mapOverlay);
                                this.gmap.aPolygons.splice(index, 1);
                            }
                        }, this);
                        this.markerEditForm.hide();
                    }
                }, '->',
                {
                    text: 'Cancel',
                    scope: this,
                    handler: function() {
                        this.markerEditForm.hide();
                    }
                }, {
                    text: 'Save',
                    scope: this,
                    handler: function() {
                        this.markerEditForm.mapOverlay.pcDescription = Ext.getCmp('mapMarkerDescription').getValue();
                        this.markerEditForm.hide();
                    }
                }]
            });
        }
        this.markerEditForm.mapOverlay = overlay;

        if(overlay instanceof GPolygon ||
           overlay instanceof GPolyline ){
                Ext.getCmp('mapMarkerColor').show();
        }       else {
                Ext.getCmp('mapMarkerColor').hide();
        }


        if (overlay.pcDescription !== undefined) {
            Ext.getCmp('mapMarkerDescription').setValue(overlay.pcDescription);
        } else {
            Ext.getCmp('mapMarkerDescription').setValue(null);
        }
        this.markerEditForm.show();
    }
});

Ext.reg('gmappanel', Ext.ux.GMapPanel);
