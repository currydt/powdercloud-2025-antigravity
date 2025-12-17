Ext.namespace("pc.custom");

pc.custom.DateTimeCmp = Ext.extend(Ext.form.CompositeField, {
    height: 30,
    width: 350
    , dateFormat: null
    , timeFormat: null
    , dateCfg: {}
    , timeCfg: {}
    , btnCfg: {}
    , btnNowText: 'Set now'
    , btnClearText: 'Clear',

    
    // internal
    dateValue: null, // Holds the actual date  
    dateField: null,
    timeField: null,
    btnField: null,
    initComponent: function () {
        this.items = this.items || [];
        
        this.timeField = new Ext.form.TimeField(Ext.apply({
            width: 100,
            height: 30,
            cls: 'left margin-left',
            format: 'H:i',
            submitValue: false,
            listeners:
             {
                scope: this,
                change: this.onChange
             }
        }, this.timeCfg));
        this.dateField = new Ext.form.DateField(Ext.apply({
            width: 115,
            timeField: this.timeField,
            submitValue: false,
            height: 30,
            cls: 'left',
            
            format: 'Y-m-d',
            getValue: function () {
                var value = null,
                        date = this.parseDate(Ext.form.DateField.superclass.getValue.call(this)) || "",
                        time = this.timeField.getValue();
                if (date) {
                    if (time) {
                        value = Date.parseDate(date.format('Y-m-d') + ' ' + time, 'Y-m-d H:i');
                    }
                    else {
                        value = this.parseDate(Ext.form.DateField.superclass.getValue.call(this)) || "";
                    }
                }
                return value;
            },
            formatDate : function(date){
                return Ext.isDate(date) ? date.dateFormat('Y-m-d') : date;
            },
            getSubmitValue: function () {
                var value = this.getValue();
                return value ? value.format('Y-m-d H:i') : null;
            },
            getRawValue: function(){
                return this.getSubmitValue();
            },
            setValue: function (value) {
                if (Ext.isString(value)) {
                    value = Date.parseDate(value, 'Y-m-d H:i');
                }
                Ext.form.DateField.superclass.setValue.call(this, this.formatDate(this.parseDate(value)));
                this.timeField.setValue(value);
            },
            parseDate : function(value) {
                if(!value || Ext.isDate(value)){
                    return value;
                }
        
                var v = this.safeParse(value, 'Y-m-d H:i'),
                    af = this.altFormats,
                    afa = this.altFormatsArray;
        
                if (!v && af) {
                    afa = afa || af.split("|");
        
                    for (var i = 0, len = afa.length; i < len && !v; i++) {
                        v = this.safeParse(value, afa[i]);
                    }
                }
                return v;
            },
            listeners:
            {
                scope: this,
                change: this.onChange
            }
        }, this.dateCfg));
        this.items.push(this.dateField);
        this.items.push(this.timeField);
        this.placeholderField = new Ext.form.Hidden({
            name: this.name,
            timeField: this.timeField,
            dateField: this.dateField,
            setValue: function (value) {
                this.dateField.setValue(value);
                Ext.form.Hidden.superclass.setValue.call(this, value);
            }
        });
        this.items.push(this.placeholderField);
        
        if (this.btnNowText) {
            this.btnField = new Ext.Button(Ext.apply({
                    cls: 'left margin-left',
                    tooltip: this.btnNowText,
                    iconCls: 'now-time-icon',
                    autoWidth: false,
                    scope: this,
                    handler: this.onBtnClick
            }, this.timeCfg));
            //this.items.push(this.btnField);
        }
        delete this.name;
        pc.custom.DateTimeCmp.superclass.initComponent.call(this);
    },
    updateBtn: function () {
        if (!this.btnField) {
            return;
        }
        if (this.dateField.getSubmitValue() === null) {
            //this.btnField.setText(this.btnNowText);
            this.btnField.setTooltip(this.btnNowText);
            this.btnField.setIcon(this.btnNowIcon);
        }
        else {
            //this.btnField.setText(this.btnClearText);
            this.btnField.setTooltip(this.btnClearText);
            this.btnField.setIcon(this.btnClearIcon);
        }
    },
    onBtnClick: function (btn, e) {
        if (this.dateField.getSubmitValue() === null) {
            this.placeholderField.setValue(new Date());
        }
        else {
            this.placeholderField.setValue(null);
        }
    },
    onChange: function (field, newValue, oldValue, options) {
        this.placeholderField.setValue(this.dateField.getSubmitValue());
        this.updateBtn();
    }

    /*,
    hasActiveError: function () {
        var hasErrorsBoolean = false;
        if (this.dateField.getActiveErrors() !== null && this.dateField.getActiveErrors().length > 0) {
            hasErrorsBoolean = true;
        }
        if (this.timeField.getActiveErrors() !== null && this.timeField.getActiveErrors().length > 0) {
            hasErrorsBoolean = true;
        }
        return hasErrorsBoolean;
    },
    clearErrors: function () {
        if (this.dateField.getActiveErrors() !== null && this.dateField.getActiveErrors().length > 0) {
            this.dateField.setActiveErrors(null);
            this.dateField.doComponentLayout();
        }
        if (this.timeField.getActiveErrors() !== null && this.timeField.getActiveErrors().length > 0) {
            this.timeField.setActiveErrors(null);
            this.timeField.doComponentLayout();
        }
    }*/
});
Ext.reg('datetimeCmp', pc.custom.DateTimeCmp);