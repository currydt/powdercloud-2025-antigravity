Ext.namespace("pc.custom");
pc.custom.GenericTaskForm = Ext.extend(Ext.Panel, {
    border: false,
    defaults: {
        anchor: '0'
    },
    autoHeight: true,
    storesToLoad: ['location',
                  'observerActive'],
    initComponent: function() {
        this.projectCombo = new Ext.form.ComboBox({
            fieldLabel: 'Project',
            hiddenName: 'project',
            store: 'projects',
            valueField: 'key',
            displayField: 'name',
            hidden: true,
            editable: false,
            triggerAction: 'all',
            mode: 'local',
            selectOnFocus: false,
            forceSelection: false,
            width: 200
        });
        this.mainForm = new Ext.FormPanel({
            form_url: "/json/entity_save/",
            border: false,
            params: {
                entity: 'Activity',
                form: 'pc.forms.activities.ActivityForm',
                type: 'todo__ActivityType__lookup'
            },
            waitMsgTarget: true,
            errorReader: new Ext.form.JSONErrorReader(),
            defaults: {
                width: 160
            },
            items: [{
                xtype: 'hidden',
                name: 'key'
            }, {
                xtype: 'hidden',
                name: 'operation'
            }, {
                xtype: 'hidden',
                name: 'created_date'
            }, {
                xtype: 'hidden',
                name: 'created_by'
            }, {
                xtype: 'fieldset',
                collapsible: true,
                collapsed: false,
                width: '100%',
                title: 'Operational Header',
                items: [{
                    xtype: 'displayfield',
                    fieldLabel: 'Operation',
                    name: 'operation_desc',
                    width: 200
                }, {
                    xtype: 'displayfield',
                    fieldLabel: 'Data Recorder',
                    width: 200,
                    name: 'created_by_desc'
                },
                    this.projectCombo,
                {
                    xtype: 'combo',
                    fieldLabel: 'Observer',
                    // Field.Observation.TH.observer
                    hiddenName: 'observer',
                    store: 'observerActive',
                    lastQuery: '',
                    valueField: 'key',
                    displayField: 'full_name',
                    editable: false,
                    triggerAction: 'all',
                    mode: 'local',
                    selectOnFocus: false,
                    forceSelection: false,
                    width: 200
                },
                //{
                //    xtype: 'combo',
                //    fieldLabel: 'Forecaster',
                //    // Field.Observation.TH.observer
                //    hiddenName: 'forecaster',
                //    store: 'observerActive',
                //    valueField: 'key',
                //    displayField: 'full_name',
                //    editable: false,
                //    triggerAction: 'all',
                //    mode: 'local',
                //    selectOnFocus: false,
                //    forceSelection: false,
                //    width: 200
                //},
                {
                    fieldLabel: 'Date and time',
                    // Field.Observation.TH.date_time_start
                    name: 'date_time_start',
                    xtype: 'datetimefield',
                    dateFormat: 'Y-m-d',
                    timeFormat: 'H:i',
                    width: 200
                }, {
                    xtype: 'combo',
                    fieldLabel: 'Location',
                    hiddenName: 'terrain',
                    width: 200,
                    store: 'location',
                    valueField: 'key',
                    displayField: 'name_nick',
                    editable: false,
                    triggerAction: 'all',
                    mode: 'local',
                    selectOnFocus: true
                }, {
                    fieldLabel: 'Notable',
                    // Field.Observation.TH.notable
                    name: 'notable',
                    xtype: 'checkbox',
                    width: 100
                }, {
                    fieldLabel: 'Name',
                    // Field.Observation.TH.subject
                    name: 'name',
                    xtype: 'textfield',
                    width: 600
                }]
            }, {
                xtype: 'fieldset',
                collapsible: true,
                collapsed: false,
                width: '75%',
                title: 'Details',
                items: [{
                    fieldLabel: 'Notes',
                    // Field.Observation.TH.comments_internal
                    name: 'comments_internal',
                    xtype: 'textarea',
                    width: 600
                }]
            }]
        });
        Ext.applyIf(this, {
            items: [
            this.mainForm]
        });

        this.saveButton = new Ext.Button({
            text: 'Save',
            scope: this,
            handler: function(button) {
                this.fireEvent('save');
            }
        });
        this.buttons = [
        this.saveButton,
        {
            text: 'Cancel',
            scope: this,
            handler: function(button) {
                this.fireEvent('cancel');
            }
        }];

        pc.custom.GenericTaskForm.superclass.initComponent.call(this);
    },
    saveData: function() {
        this.saveCounter = 0;
        this.saveDataComplete();
    },
    saveDataComplete: function(){
        if(this.saveCounter == 0){
            this.fireEvent('dataSaved');
        }
    },
});
Ext.reg('generictaskform', pc.custom.GenericTaskForm);
