Ext.namespace("pc.custom");
pc.custom.PhotoUploadCmp = Ext.extend(Ext.FormPanel, {
    form_url: "/photo/upload/",
    fileUpload: true,
    defaults: {
        anchor: '0'
    },
    plain: true,
    border: false,
    width   : '100%',
    bodyStyle: 'padding: 5px',
    cmpTitle: 'Photo Upload',
    cmpUploadMsg: 'Photo',
    image_type : 'ow',
    entity : 'Terrain',// Avalanche, Weather
    record: null,
    initComponent: function () {
        this.imgContainer = new Ext.Container();
	this.fileUploadField = new Ext.ux.form.FileUploadField({
	    anchor: '50%',
	    //id: 'photo-path',
	    emptyText: 'Select an image',
	    fieldLabel: 'Photo',
	    name: 'file'
	});
        Ext.applyIf(this, {
            items:[{
                xtype:'fieldset',
                collapsible: true,
                collapsed: true,
                width: '75%',
                title: this.cmpTitle,
                defaults: {
                    anchor: '100%',
                    allowBlank: false,
                    msgTarget: 'side'

                },
                items:[
			    {
				xtype:'container',
				html:'<p> This section allows the user to upload a photo related to the current location. Please limit your photo size to less than 2 megabytes, and keep the horizontal and vertical pixels to less than 3000 pixels. Photos exceeding these limits will not upload successfully. </p>'
			    },
			    this.imgContainer,
			    this.fileUploadField
			]
            }]
	});
        pc.custom.PhotoUploadCmp.superclass.initComponent.call(this);
    },
    setRecord: function(record){
        this.record = record;
	this.getForm().reset();
	var isFound = false;
	if(this.record.data.photos){
	    this.record.data.photos.each(function(photo){
		if(photo.data.image_type == this.image_type){
		    this.imgContainer.update('<img src="'+photo.data.url_medium+'"/><p>This photo is used as the background layer in the observations and analysis. Once uploaded and used, it should not be changed as it renders the overlays meaningless.</p>');
		    this.imgContainer.doLayout();
		    isFound = true;
		}
	    }, this);
	}
	if(!isFound){
	    this.imgContainer.update('');
	    this.imgContainer.doLayout();
	}
    },
    savePhoto: function(key){
        if(this.getForm().isValid()){
            this.getForm().submit({
                url: this.form_url+this.entity+"/"+key+"/"+this.image_type+"/",
                waitMsg: 'Uploading '+this.cmpUploadMsg+'...',
		scope: this,
                success: function(form, action) {
                    Ext.each(this.storesReload, function(store){
			if(store){
			    store.reload();
			    this.fileUploadField.reset();
			}
		    }, this);
                },
		failure: function(form,action){
		    Ext.Msg.show({
			    title:'Failed to upload photo',
			    msg: Ext.decode(action.response.responseText).errors[0],
			    buttons: Ext.Msg.OK,
			    icon: Ext.MessageBox.WARNING
		    });
		}
            });
        }   else {
            this.getForm().clearInvalid();
        }
    }
});
Ext.reg('photouploadcmp', pc.custom.PhotoUploadCmp);
