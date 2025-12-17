Ext.namespace("pc.custom");

pc.custom.LookupCmp = Ext.extend(Ext.form.ComboBox, {
    valueField:'key',
    displayField:'code',
    lookup_code: null,
    editable: false,
    triggerAction: 'all',
    mode: 'local',
    selectOnFocus:true,
    width: 200,    
    initComponent: function () {
        var data = null;
        var store;
        if(this.lookup_code !== null){
            data = $.jStorage.get(this.lookup_code);
            if(data !== null){
                data = Ext.decode(data);
                store = new Ext.data.JsonStore({
		    fields: [
			{name: 'key'},
                        {name: 'name'},
			{name: 'code'},
		    ],
		    root: 'rows',
                    data: data,
		    baseParams : {
			lookup_code: 'featuretype'
		    }
		});
            }   else {
                store = new Ext.data.JsonStore({
		    fields: [
			{name: 'key'},
                        {name: 'name'},
			{name: 'code'},
		    ],
		    autoLoad: true,
		    root: 'rows',
		    baseParams : {
			lookup_code: this.lookup_code
		    },
		    proxy: new Ext.data.ScriptTagProxy({
			url: '/json/lookup_query_all/'
		    }),
                    listeners:{
                        load:{
                            scope: this,
                            fn:function(store, records, options){
                                $.jStorage.set(this.lookup_code, Ext.encode(records));
                            }
                        }
                    }
		});
            }
        }          
        Ext.applyIf(this, {
            store: store
	});
        pc.custom.LookupCmp.superclass.initComponent.call(this);
    }
});
Ext.reg('lookupCmp', pc.custom.LookupCmp);