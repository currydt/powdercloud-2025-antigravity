Ext.namespace("pc.custom");
pc.custom.PhotoEditorCmp = Ext.extend(Ext.FormPanel, {
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
        this.imgContainer = new Ext.Container({id:'photo_overlay_container'});
	this.imgEditor = new Ext.Container({id:'photo_overlay_editor', height: 850, html: '<iframe id="modalIframeId" width="100%" height="100%" marginWidth="0" marginHeight="0" frameBorder="0" scrolling="auto" title="Dialog Title">Your browser does not suppr</iframe>'});
        Ext.applyIf(this, {
            items:[{
                xtype:'fieldset',
                collapsible: true,
                collapsed: true,
                width: '75%',
                title:this.cmpTitle+'Photo Overlay',
                items:[
                    this.imgContainer,
		    this.imgEditor,
                {
		    xtype: 'buttongroup',
		    columns: 3,
		    border: false,
		    items: [{
			id: 'photoEditor',
			itemId: 'photoEditor',
			width: 40,
			text: 'Edit',
			scope: this,
			handler: function(button, event){
			    Ext.getCmp('photo_overlay_editor').show();
			    Ext.getCmp('photo_overlay_container').hide();
			    Ext.getCmp('photo_overlay_container').hide();
			    Ext.getCmp('photoEditor').hide();
			    Ext.getCmp('photoEditorCancel').show();
			    Ext.getCmp('photoEditorDone').show();
			    if(!this.iframeInit){
				Ext.MessageBox.show({
				    msg: 'Loading...',
				    progressText: 'Loading...',
				    closable: false,
				    modal: true,
				    width:300,
				    wait:true
				});
				$("#modalIframeId").attr("src","/static/svg_editor/index.html");//?dimensions=800,800&bkgd_url="+this.imgURL
				this.iframeInit = true;
			    }  else {
				document.getElementById('modalIframeId').contentWindow.setSVG();
			    }
			}    
                    },{
			id: 'photoEditorDone',
			hidden: true,
			itemId: 'photoEditorDone',
			width: 40,
			text: 'Done',
			scope: this,
			handler: function(button, event){
			    this.record.data.photo_overlay = operationTerrainUtil.savePhoto();
			    this.drawSVG();
			    
			    Ext.getCmp('photo_overlay_editor').hide();
			    Ext.getCmp('photo_overlay_container').show();
			    Ext.getCmp('photoEditor').show();
			    Ext.getCmp('photoEditorCancel').hide();
			    Ext.getCmp('photoEditorDone').hide();
			}
		    },{
			id: 'photoEditorCancel',
			itemId: 'photoEditorCancel',
			width: 40,
			hidden: true,
			text: 'Cancel',
			scope: this,
			handler: function(button, event){
			    Ext.getCmp('photo_overlay_editor').hide();
			    Ext.getCmp('photo_overlay_container').show();
			    Ext.getCmp('photoEditor').show();
			    Ext.getCmp('photoEditorCancel').hide();
			    Ext.getCmp('photoEditorDone').hide();
			}
		    }]
		}]
            }]
	});
        pc.custom.PhotoEditorCmp.superclass.initComponent.call(this);
    },
    setRecord: function(record){
        this.record = record;
    },
    getSVG: function(){
	if(this.record){
	    return this.record.data.photo_overlay;
	}
	return '';
    },
    regLocationCombo: function(combo){
        combo.on('select', this.onLocationComboSelect, this);
    },
    iframeLoadingIsDone: function(){
	Ext.MessageBox.hide();
    },
    drawSVG: function(){
	if(this.record && this.record.data.photo_overlay){
	    $('#photo_overlay_container').svg('destroy');
	    $('#photo_overlay_container').svg();
	    var svg = $('#photo_overlay_container').svg('get');
	    svg.add(this.record.data.photo_overlay);
	}
    },
    resetSVG: function(){
	$('#photo_overlay_container').svg('destroy');
	this.imgContainer.setWidth(800);
	this.imgContainer.setHeight(20);
	$("#photo_overlay_container").css('background','none');
	Ext.getCmp('photo_overlay_editor').hide();
	Ext.getCmp('photo_overlay_container').show();
	Ext.getCmp('photoEditor').show();
	Ext.getCmp('photoEditorCancel').hide();
	Ext.getCmp('photoEditorDone').hide();
    },
    onLocationComboSelect: function(cmp, record, index){
        if(record != null){
	    var isPhotoPresent = false;
	    //this.resetSVG();
	    if(record.data.photos){
		record.data.photos.each(function(photo){
		    if(photo.data.image_type == this.image_type){
			Ext.getCmp('photoEditor').show();
			Ext.getCmp('photo_overlay_editor').hide();
			isPhotoPresent = true;
			this.imgContainer.setWidth(800);
			this.imgContainer.setHeight(800);
			Ext.getCmp('photo_overlay_container').update('');
			$("#photo_overlay_container").css('background','transparent url('+photo.data.url_medium+') no-repeat 0 0');
			Ext.getCmp('photo_overlay_container').doLayout();
			this.drawSVG();
			this.imgURL = photo.data.url_medium
		    }
		}, this);
	    }

	    if(!isPhotoPresent){
		Ext.getCmp('photo_overlay_container').update('The location chosen for this observation does not have a oblique photo overlay.');
		Ext.getCmp('photo_overlay_container').doLayout();
		Ext.getCmp('photoEditor').hide();
	    }
        }
    }
});
Ext.reg('photoeditorcmp', pc.custom.PhotoEditorCmp);
