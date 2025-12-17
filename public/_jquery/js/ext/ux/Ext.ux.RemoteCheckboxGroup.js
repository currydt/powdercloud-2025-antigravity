Ext.namespace("Ext.ux");
Ext.ux.RemoteCheckboxGroup = Ext.extend(Ext.form.CheckboxGroup, {
    baseParams: null,
    url: '',
    
    defaultItems: [
    new Ext.form.Checkbox(
    {
        xtype: 'checkbox',
        boxLabel: 'No Items',
        disabled: true
    })],
    fieldId: 'id',
    fieldName: 'name',
    fieldBoxLabel: 'boxLabel',
    fieldValue: 'inputValue',
    fieldChecked: 'checked',
    reader: null,

    //private
    initComponent: function ()
    {

        this.addEvents(
        /**
         * @event add
         * Fires when a checkbox is added to the group
         * @param {Ext.form.CheckboxGroup} this
         * @param {object} chk The checkbox that was added.
         */
        'add',
        /**
         * @event beforeadd
         * Fires before a checkbox is added to the group
         * @param {Ext.form.CheckboxGroup} this
         * @param {object} chk The checkbox to be added.
         */
        'beforeadd',
        /**
         * @event load
         * Fires when a the group has finished loading (adding) new records
         * @param {Ext.form.CheckboxGroup} this
         */
        'load',
        /**
         * @event beforeremove
         * Fires before a checkbox is removed from the group
         * @param {Ext.form.CheckboxGroup} this
         * @param {object} chk The checkbox to be removed.
         */
        'beforeremove');

        Ext.ux.RemoteCheckboxGroup.superclass.initComponent.apply(this, arguments);
    },

    onRender: function ()
    {
        Ext.ux.RemoteCheckboxGroup.superclass.onRender.apply(this, arguments);
        if (this.showMask)
        {
            this.loadmask = new Ext.LoadMask(this.ownerCt.getEl(), {
                msg: "Loading..."
            });
        }
        this.reload();
    },

    reload: function ()
    {
        if ((this.url != '') && (this.reader != null))
        {
            this.removeAll(); 
            if (this.showMask)
            {
                this.loadmask.show();
            }
           

        }
        
        Ext.Ajax.request(
        {
            url: this.url,
            params: this.baseParams,
            scope: this,
            success: function(responseObj, options) {
                var response = Ext.decode(responseObj.responseText);

                if (response.success)
                {
                    var data = this.reader.readRecords(Ext.decode(responseObj.responseText));
                    for (var i = 0; i < data.records.length; i++)
                    {
                        var record = data.records[i];
                        var item = new Ext.form.Checkbox(
                        {
                            xtype: 'checkbox',
                            listeners: {
                                'render': this.cbRenderer
                            },
                            boxLabel: record.get(this.fieldBoxLabel),
                            inputValue: record.get(this.fieldValue)
                        });

                        if (this.fieldId != '')
                        {
                            item.id = record.get(this.fieldId);
                        }

                        if (this.fieldName != '')
                        {
                            item.name = record.get(this.fieldName);
                        }

                        if (this.fieldChecked != '')
                        {
                            item.checked = record.get(this.fieldChecked);
                        }

                        if (record.get('disabled'))
                        {
                            item.disabled = true;
                        }

                        item.on('check', this.cbHandler, this.cbHandlerScope ? this.cbHandlerScope : this, {buffer: 10});
                        
                        if (this.fireEvent('beforeadd', this, item) !== false)
                        {
                            var items = this.items;
                            var columns = this.panel.items;
                            var column = columns.itemAt(items.getCount() % columns.getCount());
                            var chk = column.add(item);
                            items.add(item);
                            items[i] = chk;
                            this.doLayout();
                            
                            this.fireEvent('add', this, item);
                        }
                    }

                    this.fireEvent('load', this);
                }
                if (this.showMask)
                {
                    this.loadmask.hide();
                }
            },
            failure: function (){
                console.log("fail");
            }
        });
    },
    removeAll: function ()
    {
        for (var j = 0; j < this.columns.length; j++)
        {
           if (this.panel.items.length > 0)
            {
                var items = this.items;
                var columns = this.panel.items;
                var column = columns.itemAt(items.getCount() % columns.getCount());
                                
                column.items.each(
                
                function (i)
                {
                    if (this.fireEvent('beforeremove', this, i) !== false)
                    {
                        var items = this.items;
                        var columns = this.panel.items;
                        var column = columns.itemAt(items.getCount() % columns.getCount());
                        
                        var chk = column.remove(i);
                        items.remove(i);
                    }
                }, this);
            }
        }
    },
    getGroupValue: function ()
    {
        var valuesArray = [];
        for (var j = 0; j < this.columns; j++)
        {
            if (this.panel.getComponent(j).items.length > 0)
            {
                this.panel.getComponent(j).items.each(

                function (i)
                {
                    if (i.checked)
                    {
                        valuesArray.push(i.inputValue);
                    }
                });
            }
        }
        return valuesArray;
    }

});
Ext.reg("remotecheckboxgroup", Ext.ux.RemoteCheckboxGroup);