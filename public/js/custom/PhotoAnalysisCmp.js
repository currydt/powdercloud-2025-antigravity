Ext.namespace("pc.custom");
pc.custom.PhotoAnalysisCmp = Ext.extend(Ext.Panel, {
    defaults: {
        anchor: '0'
    },
    plain: true,
    border: false,
    width   : '100%',
    bodyStyle: 'padding: 5px',
    cmpTitle: 'Oblique ',
    image_type : 'ow',
    iframeInit: false,
    initComponent: function () {
        this.imgContainer = new Ext.Container({id:'photo_overlay_container', hidden: true});
        Ext.applyIf(this, {
            items: [
		this.imgContainer 
	    ]
	});
        pc.custom.PhotoAnalysisCmp.superclass.initComponent.call(this);
    },
    processSVG: function(records){
	this.records = records;
	var terrain = null;
	var isValid = true;
	// verify all records use same terrain
        Ext.each(this.records, function(record){
	    if(terrain == null){
		terrain = record.get('terrain');
	    }	else if(terrain != record.get('terrain')){
		// not all records use same terrain, can't draw
		isValid = false;
		Ext.Msg.show({
		    title:'Error',
		    msg: 'The selected observations use different locations. Please ensure all selected observations belong to the same location by using the location filter.',
		    buttons: Ext.Msg.OK,
		    icon: Ext.MessageBox.ERROR
		});
	    }	
	}, this);
	if(isValid){
	    this.resetSVG();
	    this.drawSVG();    
	}	
    },
    drawSVG: function(){
	if(this.records && this.records[0]){
	    var terrain = Ext.StoreMgr.lookup('locationWithBlankRecord').getAt(Ext.StoreMgr.lookup('locationWithBlankRecord').find('key',this.records[0].get('terrain')));
	    if(terrain && terrain.data.photos && terrain.data.photos.getCount() > 0){
		Ext.getCmp('photo_overlay_container').show();
		Ext.getCmp('photo_overlay_container').update('');
		terrain.data.photos.each(function(photo){
		    // hardcoded to only use oblique winter photos
		    if(photo.data.image_type == 'ow'){
			this.imgContainer.setWidth(800);
			this.imgContainer.setHeight(800);
			$("#photo_overlay_container").css('background','transparent url('+photo.data.url_medium+') no-repeat 0 0');
			Ext.getCmp('photo_overlay_container').doLayout();
		    }
		}, this);	    
		$('#photo_overlay_container').svg('destroy');
		$('#photo_overlay_container').svg();
		var svg = $('#photo_overlay_container').svg('get');
		Ext.each(this.records, function(record){
		    if(!Ext.isEmpty(record.get('photo_overlay'))){
			svg.add(record.get('photo_overlay'));    
		    }
		    
		}, this);
	    }
	}
    },
    resetSVG: function(){
	$('#photo_overlay_container').svg('destroy');
	this.imgContainer.setWidth(800);
	this.imgContainer.setHeight(20);
	$("#photo_overlay_container").css('background','none');
	Ext.getCmp('photo_overlay_container').hide();
    }
});
Ext.reg('photoanalysiscmp', pc.custom.PhotoAnalysisCmp);
