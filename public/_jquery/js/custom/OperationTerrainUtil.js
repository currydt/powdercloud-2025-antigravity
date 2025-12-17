var OperationTerrainUtil = function(observationMapOverlay, observationPhotoOverlay, observerCmp, locationCmp, mapCmp, photoCmp) {
    this.location = null;
    this.observationMapOverlay = observationMapOverlay;
    this.observationPhotoOverlay = observationPhotoOverlay;
    this.observerCmp = observerCmp;
    this.locationCmp = locationCmp;
    //this.obliquePhotoCmp = obliquePhotoCmp;
    this.mapCmp = mapCmp;
    // listeners
    this.locationCmp.getStore().on('load', function(store, records, options){
        var temp = locationCmp.getValue();
        if(locationCmp.getValue()){
            locationCmp.setValue(locationCmp.getValue());
        }
    }, this);
    this.observerCmp.getStore().on('load', function(store, records, options){
        if(this.observerCmp.getValue()){
            this.observerCmp.setValue(this.observerCmp.getValue());
        }
    }, this);
    this.locationCmp.on('select', function(cmp, record, index){
        var temp = locationCmp.getValue();
        if(this.location == null || this.location.data.key != record.data.key){
            this.location = record;
            if(this.mapCmp != null){
                this.mapCmp.setMapData(this.location.data.map_overlay, this.obs.data.map_overlay);
            }
            
            
        }
    },this);
};
OperationTerrainUtil.prototype.reset = function(){
    this.location = null;
    if(this.mapCmp != null){
        this.mapCmp.clearOverlays();
    }
};
OperationTerrainUtil.prototype.setRecord= function(record){
    this.obs = record;
};
OperationTerrainUtil.prototype.saveChanges = function(){
    if(this.observationMapOverlay != null){
        this.observationMapOverlay.setValue(this.mapCmp.getMapData());
    }
};
OperationTerrainUtil.prototype.savePhoto = function(){
    var svgData = document.getElementById('modalIframeId').contentWindow.getSVG();
    this.observationPhotoOverlay.setValue(svgData);
    return svgData;
};
OperationTerrainUtil.prototype.loadLocation = function(operationId){
    this.locationCmp.getStore().load({params: {operation: operationId}});
    //this.observerCmp.getStore().load({params: {operation: operationId}});
};