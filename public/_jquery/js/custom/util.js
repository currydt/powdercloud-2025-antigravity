var PAGING_LIMIT = 20;
function LinkUtil(params){
	var currHref = window.location.href.split('/');
	var lastNode = currHref[currHref.length-2];
	this.params = params;
	if(this.params.form){
		if(lastNode !== undefined && lastNode !== null && lastNode.length > 0){
			Ext.Ajax.request({
				url:'/json/entity_query_single/',
				params:{
				    entity: this.params.entity,
				    key: lastNode
				},
				scope: this,
				success: function(response, opts){
					var data = Ext.decode(response.responseText).data
					this.params.record.data = data;
					this.params.record.commit();
					this.params.fn(this.params.record, this.params);
				}
			});
		}
	}
}
function RunGallery(){

}
RunGallery.prototype.show = function(record){
	this.record = record;
	if( !this.gallery || this.gallery.closed ) {
		this.gallery = window.open('/run-gallery/','mywindow','scrollbars=yes,toolbar=no,location=no,menubar=no,status=no,copyhistory=no,resizable=yes,width=600,height=500,left=0,top=100,screenX=0,screenY=100');
	} else {
		this.gallery.focus();
		this.load();
	}
}
RunGallery.prototype.load = function(){
	this.gallery.loadRecord(this.record);
}
var runGallery = new RunGallery();
function SkyCondition(value){
	switch (value){
		case 0.5:
			return "Clear";
			break;
		case 1.5:
			return "Few Clouds";
			break;
		case 2.5:
			return "Partially Cloudy";
			break;
		case 3.5:
			return "Cloudy";
			break;
		case 4.5:
			return "Overcast";
			break;
		case 5.5:
			return "A surface based layer";
			break;
	}
}
function WindSpeed(value){
	switch (value){
		case 0.5:
			return "Calm";
			break;
		case 1.5:
			return "Light";
			break;
		case 2.5:
			return "Moderate";
			break;
		case 3.5:
			return "Strong";
			break;
		case 4.5:
			return "Gale";
			break;
		case 5.5:
			return "Extreme";
			break;
	}
}
function MapIcons(iconName){
	switch (iconName) {
		case 'normal':
		default:
		    return "/static/img/tool/red.png";
		    break;

		case 'animal':
		    return "/static/img/map/animals.png";
		    break;
		case 'avalanche1':
		    return "/static/img/map/avalanche1.png";
		    break;
		case 'avalanche2':
		    return "/static/img/map/avalanche2.png";
		    break;
		case 'avalanche3':
		    return "/static/img/map/avalanche3.png";
		    break;
		case 'avalanche4':
		    return "/static/img/map/avalanche4.png";
		    break;
		case 'detonation':
		    return "/static/img/map/bomb.png";
		    break;
		case 'explosion':
		    return "/static/img/map/explosion.png";
		    break;
		case 'feature-drainage':
		    return "/static/img/map/feature-drainage.png";
		    break;
		case 'feature-forzone':
		    return "/static/img/map/feature-forzone.png";
		    break;
		case 'feature-opzone':
		    return "/static/img/map/feature-opzone.png";
		    break;
		case 'feature-path':
		    return "/static/img/map/feature-path.png";
		    break;
		case 'feature-region':
		    return "/static/img/map/feature-region.png";
		    break;
		case 'feature-road':
		    return "/static/img/map/feature-road.png";
		    break;
		case 'feature-route':
		    return "/static/img/map/feature-route.png";
		    break;
		case 'feature-run':
		    return "/static/img/map/feature-run.png";
		    break;
		case 'feature-station':
		    return "/static/img/map/feature-station.png";
		    break;
		case 'field-weather':
		    return "/static/img/map/field-weather.png";
		    break;
		case 'study-plot':
		    return "/static/img/map/study-plot.png";
		    break;
	}
}

var newRecordForForm = function(record){
	var fields =  record.fields.items;
        var values = new Object();
        for(var key in fields){
            var name = fields[key].name;
            if(record.get(name)){
		values[name] = record.get(name);
	    }	else {
		values[name] = null;
	    }
        }
	return values;
}
var chartConfig = new function(){
	this.creditsText = 'powered by Powdercloud';
	this.creditsHref = 'http://www.powdercloud.com';
	this.creditsStyle = {
		cursor: 'pointer',
		color: '#3300FF',
		fontSize: '10px'
	};

}

var ServerUtils = new function () {
    this.prepareFieldsForService = function (rec) {
        this.json = rec.data;
        this.rec = rec;
        this.result = new Object();
        Ext.each(rec.fields.items, function (field) {
            if (field.type != null) {
                if( !Ext.isEmpty(this.rec.get(field.name)) ) {
                    if (field.type.type == 'date') {
                        this.result[field.name] = this.rec.data[field.name].format('Y-m-d H:i');
                    }
					else {
                        //  type = auto
                        // skip all whose data is of type Store
                        if (this.rec.data[field.name] instanceof Ext.data.Store) {
                            // skip
                        }
						else {
                            this.result[field.name] = this.rec.data[field.name];
                        }
                    }
                }
            }
        }, this);
        return this.result;
    };
};
function formFailureFunction(){
	Ext.Msg.show({
		title:'Validation errors',
		msg: 'One or more fields in the form is invalid, please review the form and try to Save again.',
		buttons: Ext.Msg.OK,
		icon: Ext.MessageBox.ERROR
	});
}
function deleteFunciton(action, options) {
	if(Ext.decode(action.responseText).status!=undefined &&
	   Ext.decode(action.responseText).status == 'false'){
	    Ext.MessageBox.alert('Error',Ext.decode(action.responseText).msg)
	}   else {
	    Ext.MessageBox.alert('Success',Ext.decode(action.responseText).msg)
	}
}
function formatDate(value){
	return value ? value.dateFormat(getDateFormat()) : '';
}
function getDateFormat(){
	return 'Y-m-d H:i';
}
function genRnd(n){
	return Math.floor ( Math.random ( ) * n + 1 ) ;
}
// ExtJS 3.2 Webkit Hidden Component Fix
Ext.override(Ext.Component, {
	onShow : function(){

		this.getVisibilityEl().removeClass('x-hide-' + this.hideMode);

		if(Ext.isWebKit) {
			this.getVisibilityEl().show();
		}
	},
	onHide : function(){

		this.getVisibilityEl().addClass('x-hide-' + this.hideMode);

		if(Ext.isWebKit) {
			this.getVisibilityEl().hide();
		}
	}
});
Ext.override(Ext.data.Store, {
	loadRecords : function(o, options, success){
		if (this.isDestroyed === true) {
		    return;
		}
		if(!o || success === false){
		    if(success !== false){
			this.fireEvent('load', this, [], options);
		    }
		    if(options.callback){
			options.callback.call(options.scope || this, [], options, false, o);
		    }
		    return;
		}
		var r = o.records, t = o.totalRecords || r.length;
		if(!options || options.add !== true){
		    if(this.pruneModifiedRecords){
			this.modified = [];
		    }
		    for(var i = 0, len = r.length; i < len; i++){
			r[i].join(this);
		    }
		    if(this.snapshot){
			this.data = this.snapshot;
			delete this.snapshot;
		    }
		    this.clearData();
		    this.data.addAll(r);
		    this.totalLength = t;
		    this.applySort();
		    this.fireEvent('datachanged', this);
		}else{
		    this.totalLength = Math.max(t, this.data.length+r.length);
		    this.add(r);
		}
		if(options && options.params && options.params.allowBlankRecord){
			if(len > 0){
				var RecordVO = this.recordType;
				var record = new RecordVO({key: null});
				Ext.iterate(record, function(key, value) {
					record.set(key, null)	;
				}, this);
				this.insert(0, record);
			}
		}
		this.fireEvent('load', this, r, options);
		if(options.callback){
		    options.callback.call(options.scope || this, r, options, true);
		}
	}
});
Ext.override(Ext.form.ComboBox, {
	initComponent: Ext.form.ComboBox.prototype.initComponent.createInterceptor(function() {
		if(this.store && typeof(this.store) !="string"){
			this.store.on('load', this.onStoreLoad, this);
		}
		if(this.store && typeof(this.store) =="string"){
			Ext.StoreMgr.lookup(this.store).on('load', this.onStoreLoad, this);
		}
	}),
	onSelect : function(record, index){
		if(this.cascadeComboId){
			var cascadeDropdown = Ext.getCmp(this.cascadeComboId);
			if(record.data.children && record.data.children.length > 0 && record.data.children[0][cascadeDropdown.valueField] !== null){
				
				if(record.data.children){
					var blankRecord = {};
					blankRecord[cascadeDropdown.valueField] = null;
					blankRecord[cascadeDropdown.displayField] = undefined;
					record.data.children.splice(0,0, blankRecord);
				}
				
			}
			cascadeDropdown.getStore().loadData(record.data.children === undefined ? [] : record.data.children);
			

			var setValue = false;
			cascadeDropdown.getStore().each(function(record) {
			    if (record.data.key == cascadeDropdown.getValue()) {
				setValue = true;
				cascadeDropdown.setValue(cascadeDropdown.getValue());
			    }
			}, this);
			if (!setValue) {
			    cascadeDropdown.setValue(null);
			}
		}
		if(this.fireEvent('beforeselect', this, record, index) !== false){
		    this.setValue(record.data[this.valueField || this.displayField]);
		    this.collapse();
		    this.fireEvent('select', this, record, index);
		}
	},
	onStoreLoad: function(cmp, records, options){
		if(this.getValue()){
			this.setValue(this.getValue());
		}
	},
	setValue : function(v){
		var text = v, r;
		if(this.valueField){
		    if(r = this.findRecord(this.valueField, v)){
			text = r.data[this.displayField];
		    }else if(Ext.isDefined(this.valueNotFoundText)){
			text = this.valueNotFoundText;
		    }
		}
		this.lastSelectionText = text;
		if(this.hiddenField){
		    this.hiddenField.value = v;
		}
		Ext.form.ComboBox.superclass.setValue.call(this, text);
		this.value = v;
		if (r && this.value != null) {
		    this.fireEvent('select', this, r, this.store.indexOf(r));
		    if(this.cascadeComboId){
			var cascadeDropdown = Ext.getCmp(this.cascadeComboId);
			if(r.data.children && r.data.children.length > 0 && r.data.children[0][cascadeDropdown.valueField] !== null){
				var blankRecord = {};
				blankRecord[cascadeDropdown.valueField] = null;
				blankRecord[cascadeDropdown.displayField] = undefined;
				r.data.children.splice(0,0, blankRecord);
				
			}
			cascadeDropdown.getStore().loadData(r.data.children === undefined ? [] : r.data.children);
			
		    }
		}
		return this;
	},
	initList: (function(){
		if(!this.tpl) {
			this.tpl = new Ext.XTemplate('<tpl for="."><div class="x-combo-list-item">{', this.displayField , ':this.blank}</div></tpl>', {
				blank: function(value){
					return (value===undefined || value === null || value === "") ? '&nbsp' : value;
				}
			});
		}
	}).createSequence(Ext.form.ComboBox.prototype.initList)
});
Ext.override(Ext.form.FormPanel, {
	//labelAlign: "top",
	//labelAlign: "right",
	//labelWidth: 200
	labelWidth: 130,
	labelPad: 15
});
Ext.override(Ext.form.Field, {
	fireKey : function(e) {
	    if(((Ext.isIE && e.type == 'keydown') || e.type == 'keypress') && e.isSpecialKey()) {
		this.fireEvent('specialkey', this, e);
	    }
	    else {
		this.fireEvent(e.type, this, e);
	    }
	},
	initEvents : function() {
	//                this.el.on(Ext.isIE ? "keydown" : "keypress", this.fireKey,  this);
	    this.el.on("focus", this.onFocus,  this);
	    this.el.on("blur", this.onBlur,  this);
	    this.el.on("keydown", this.fireKey, this);
	    this.el.on("keypress", this.fireKey, this);
	    this.el.on("keyup", this.fireKey, this);

	    // reference to original value for reset
	    this.originalValue = this.getValue();
	}
});
Ext.override(Ext.form.DisplayField, {
	getValue : function(){
		return this.value;
	},
	setValue : function(v){
		this.value = v;
		this.setRawValue(this.formatValue(v));
		return this;
	},
	formatValue : function(v){
		var renderer = this.renderer, scope = this.rendererScope || this;
		if(!renderer){
			return v;
		}
		if(typeof renderer == 'string'){
			renderer = Ext.util.Format[renderer];
		} else if(typeof renderer == 'object'){
			renderer = renderer.fn;
			scope = renderer.scope;
		}
		var args = [v];
		if(this.format){
			args.push(this.format);
		}else if(this.formatArgs){
			args = args.concat(this.formatArgs);
		}
		return renderer.apply(scope, args);
	}
});
var jqueryTabClick = function( event, ui ) {
	var url = $.data( ui.tab, 'load.tabs' );
	if( url ) {
		window.location = url;
		return false;
	}
	else {
		return true;
	}
}
Ext.form.Field.prototype.msgTarget = 'side';
Ext.form.CompositeField.prototype.msgTarget = 'under';
Ext.form.CompositeField.prototype.combineErrors  = false;
