function Controller() {
    this.projectRecord = null;

    this.projectForm = new pc.custom.ProjectForm({
        itemId: 'projectForm',
        title: 'Detail'
    });
    this.taskList = new pc.custom.TaskList({
        itemId: 'taskList'
    });
    this.taskGenericForm = new pc.custom.GenericTaskForm({
        itemId: 'genericTask'
    });
    this.activityForecastForm = new pc.custom.ActivityForecastForm({
        itemId: 'activityForecast'
    });
    this.activityEvaluationForm = new pc.custom.ActivityEvaluationForm({
        itemId: 'activityEvaluation'
    });
    this.activityRunUsageForm = new pc.custom.ActivityRunUsageForm({
        itemId: 'activityRunUsage'
    });
    this.activityRunStatusForm = new pc.custom.ActivityRunStatusForm({
        itemId: 'activityRunStatus'
    });
     this.activityRunUsageOpZoneForm = new pc.custom.ActivityRunUsageOpZoneForm({
        itemId: 'activityRunUsageOpZone'
    });
    this.activityRunStatusOpZoneForm = new pc.custom.ActivityRunStatusOpZoneForm({
        itemId: 'activityRunStatusOpZone'
    });
    this.taskContainer = new Ext.Panel({
        title: 'Activity',
        border: false,
        deferredRender: false,
        layout: 'card',
        activeItem: 0,
        items: [
            this.taskList,
            this.taskGenericForm,
            this.activityForecastForm,
            this.activityEvaluationForm,
            this.activityRunUsageForm,
            this.activityRunStatusForm,
            this.activityRunUsageOpZoneForm,
            this.activityRunStatusOpZoneForm
        ]
    });
    this.projectDetailContainer = new Ext.TabPanel({
        plain: true,
        deferredRender: false,
        autoHeight: true,
        activeTab: 0,
        width: '100%',
        defaults: {
            autoHeight: true,
            border: false
        },
        items: [
                    this.projectForm,
                    //{
                    //    xtype: 'panel',
                    //    title: 'Pricing',
                    //    html: 'The pricing structure'
                    //},
                    //{
                    //    xtype: 'panel',
                    //    title: 'Pricing',
                    //    html: 'The pricing structure.'
                    //},
                    //{
                    //    xtype: 'panel',
                    //    title: 'Reservations',
                    //    html: 'Upcoming reservation screens.'
                    //},
                    this.taskContainer,
                    //{
                    //    xtype: 'panel',
                    //    title: 'Roles',
                    //    html: 'Assigning roles to participants of the Project.'
                    //}
                    ////,
                    //{
                    //    xtype: 'panel',
                    //    title: 'Observations',
                    //    html: 'Review observations.'
                    //},
                    //{
                    //    xtype: 'panel',
                    //    title: 'Reports',
                    //    html: 'View and download reports.'
                    //}
        ]
    });
    this.projectList = new pc.custom.ProjectList();

    this.mainContainer = new Ext.Panel({
        renderTo: 'ext-loc',
        plain: true,
        width: '100%',
        border: false,
        layout: 'card',
        activeItem: 0,
        defaults: {
            plain: true,
            width: '100%'
        },
        items: [
        this.projectList, this.projectDetailContainer],
        listeners: {
            scope: this,
            render: function() {
                this.init();
            }
        }
    });


}
Controller.prototype.init = function() {
    this.projectList.on('add', this.addProject, this);
    this.projectList.on('edit', this.editProject, this);
    this.projectForm.on('save', this.saveBtnProject, this);
    this.projectForm.on('continue', this.continueBtnProject, this);
    this.projectForm.on('cancel', this.cancelProject, this);
    this.taskList.getSelectionModel().on('selectionchange', this.onSelectChange, this);
    this.taskList.on('print', this.printActivity, this);
    this.taskList.on('add_generic_task', this.addGenericTask, this);
    this.taskList.on('add_activity_forecast', this.addActivityForecast, this);
    this.taskList.on('add_activity_evaluation', this.addActivityEvaluation, this);
    this.taskList.on('add_activity_runusage', this.addActivityRunUsage, this);
    this.taskList.on('add_activity_runstatus', this.addActivityRunStatus, this);
    this.taskList.on('add_activity_runusage_opzone', this.addActivityRunUsageOpZone, this);
    this.taskList.on('add_activity_runstatus_opzone', this.addActivityRunStatusOpZone, this);
    this.taskList.on('edit', this.editTask, this);
    this.taskGenericForm.on('cancel', this.cancelTask, this);
    this.taskGenericForm.on('save', this.saveTaskLastContinue, this);
    this.activityForecastForm.on('cancel', this.cancelTask, this);
    this.activityForecastForm.on('continue', this.continueTask, this);
    this.activityForecastForm.on('dataSaved', this.saveTaskLastContinue, this);
    this.activityForecastForm.on('save', this.saveTaskLast, this);
    this.activityEvaluationForm.on('cancel', this.cancelTask, this);
    this.activityEvaluationForm.on('continue', this.continueTask, this);
    this.activityEvaluationForm.on('dataSaved', this.saveTaskLastContinue, this);
    this.activityEvaluationForm.on('save', this.saveTaskLast, this);
    this.activityRunUsageForm.on('cancel', this.cancelTask, this);
    this.activityRunUsageForm.on('continue', this.saveActivity, this);
    this.activityRunUsageForm.on('save', this.saveRuns, this);
    this.activityRunStatusForm.on('cancel', this.cancelTask, this);
    this.activityRunStatusForm.on('continue', this.saveActivity, this);
    this.activityRunStatusForm.on('save', this.saveRuns, this);
    this.activityRunUsageOpZoneForm.on('cancel', this.cancelTask, this);
    this.activityRunUsageOpZoneForm.on('continue', this.saveActivity, this);
    this.activityRunUsageOpZoneForm.on('save', this.saveRuns, this);
    this.activityRunStatusOpZoneForm.on('cancel', this.cancelTask, this);
    this.activityRunStatusOpZoneForm.on('continue', this.saveActivity, this);
    this.activityRunStatusOpZoneForm.on('save', this.saveRuns, this);

}
Controller.prototype.onSelectChange = function(selModel) {
    if(selModel.selections.length !== 0){
        var record = selModel.getSelected();
        if(record.get('type_desc') == 'runusage' || record.get('type_desc') == 'runstatus'){
            Ext.getCmp('PrintBtnRunUsage').setDisabled(false);
        }   else {
            Ext.getCmp('PrintBtnRunUsage').setDisabled(true);
        }
    }   else {
        Ext.getCmp('PrintBtnRunUsage').setDisabled(true);
    }
}
Controller.prototype.printActivity = function() {
    var record = this.taskList.getSelectionModel().getSelected();
    if(record.get('type_desc') == 'runusage' ){
        var win = window.open('/reports/run-usage/html/?kact='+record.get('key'));
    }  else {
        var win = window.open('/reports/run-status/html/?kact='+record.get('key'));
    }

}
Controller.prototype.cancelProject = function() {
    this.mainContainer.getLayout().setActiveItem(0);
    this.projectList.getStore().reload();
}
Controller.prototype.addProject = function() {
    this.editProject(new ProjectVO({
        date_time_start: new Date(),
        operation: operation.key,
        lead_party: party.key,
        operation_desc: operation.name
    }));
}
Controller.prototype.continueBtnProject = function() {
    this.saveProject('continueProjectButton');
}
Controller.prototype.saveBtnProject = function() {
    this.saveProject('saveProjectButton');
}
Controller.prototype.saveProject = function(buttonId) {
    this.saveProjectButtonId = buttonId;
    Ext.getCmp(this.saveProjectButtonId).disable();
    this.projectForm.mainForm.getForm().submit({
        url: this.projectForm.mainForm.form_url,
        scope: this,
        waitMsg: 'Saving Data...',
        params: {
            entity: 'Project',
            form: 'pc.forms.projects.ProjectForm',
            type: 'A__Lookup__lookup'
        },
        submitEmptyText: false,
        success: function(form, action) {
            var key = Ext.decode(action.response.responseText).key;
            this.projectForm.mainForm.getForm().setValues({
                key: key
            });
            if (this.saveProjectButtonId == 'continueProjectButton') {
                this.projectRecord = new ProjectVO(this.projectForm.mainForm.getForm().getValues());
                this.editProject(this.projectRecord);
                Ext.getCmp('saveProjectButton').enable();
            } else {
                this.cancelProject();
            }
        },
        failure: function(form, action) {
            Ext.getCmp(this.saveProjectButtonId).enable();
            formFailureFunction();
        }
    });
}
Controller.prototype.editProject = function(project) {
    this.projectRecord = project;
    this.projectForm.mainForm.getForm().setValues(newRecordForForm(project));
    this.mainContainer.getLayout().setActiveItem(1);
    if (this.projectRecord.data.key) {
        Ext.getCmp('saveProjectButton').show();
        Ext.getCmp('saveProjectButton').enable();
        Ext.getCmp('continueProjectButton').hide();
        // project exists on server
        Ext.each(this.projectDetailContainer.items.items, function(tab, index) {
            this.projectDetailContainer.unhideTabStripItem(index);
        }, this);
        // fetch tasks
        this.taskList.getStore().setBaseParam('project', this.projectRecord.data.key);
        this.taskList.getStore().load();
    } else {
        Ext.getCmp('continueProjectButton').show();
        Ext.getCmp('continueProjectButton').enable();
        Ext.getCmp('saveProjectButton').hide();
        Ext.each(this.projectDetailContainer.items.items, function(tab, index) {
            if (tab.itemId === undefined || tab.itemId != 'projectForm') {
                this.projectDetailContainer.hideTabStripItem(index);
            }
        }, this);
    }
}
Controller.prototype.cancelTask = function() {
    this.taskContainer.getLayout().setActiveItem('taskList');
    this.taskList.getStore().reload();
    this.currTaskForm.saveButton.enable();
}
Controller.prototype.addGenericTask = function() {
    this.addTask('todo');
}
Controller.prototype.addActivityForecast = function() {
    this.addTask('hazfore');
}
Controller.prototype.addActivityEvaluation = function() {
    this.addTask('hazeval');
}
Controller.prototype.addActivityRunUsage = function() {
    this.addTask('runusage');
}
Controller.prototype.addActivityRunStatus = function() {
    this.addTask('runstatus');
}
Controller.prototype.addActivityRunUsageOpZone = function() {
    this.addTask('runusageOpZone');
}
Controller.prototype.addActivityRunStatusOpZone = function() {
    this.addTask('runstatusOpZone');
}
Controller.prototype.addTask = function(type) {
    var record = new ActivityVO({
        created_by_desc: party.name,
        created_date: new Date(),
        date_time_start: new Date(),
        observer: party.key,
        type_desc: type,
        project: this.projectRecord.data.key,
        operation_desc: operation.name
    });
    this.editTask(record);
}
Controller.prototype.editTask = function(record) {
    this.currTaskForm = null;
    switch (record.data.type_desc) {
    case 'todo':
        this.currTaskForm = this.taskGenericForm;
        this.taskContainer.getLayout().setActiveItem('genericTask');
        break;
    case 'hazfore':
        this.currTaskForm = this.activityForecastForm;
        this.taskContainer.getLayout().setActiveItem('activityForecast');
        break;
    case 'hazeval':
        this.currTaskForm = this.activityEvaluationForm;
        this.taskContainer.getLayout().setActiveItem('activityEvaluation');
        break;
    case 'runusage':
        this.currTaskForm = this.activityRunUsageForm;
        this.taskContainer.getLayout().setActiveItem('activityRunUsage');
        break;
    case 'runstatus':
        this.currTaskForm = this.activityRunStatusForm;
        this.taskContainer.getLayout().setActiveItem('activityRunStatus');
        break;
    case 'runusageOpZone':
        this.currTaskForm = this.activityRunUsageOpZoneForm;
        this.taskContainer.getLayout().setActiveItem('activityRunUsageOpZone');
        break;
    case 'runstatusOpZone':
        this.currTaskForm = this.activityRunStatusOpZoneForm;
        this.taskContainer.getLayout().setActiveItem('activityRunStatusOpZone');
        break;
    }

    if (this.currTaskForm.storesToLoad) {
        Ext.each(this.currTaskForm.storesToLoad, function(storeName) {
            var store = Ext.StoreMgr.lookup(storeName);
            if (store.getCount() == 0) {
                Ext.StoreMgr.lookup(storeName).load();
            }
        }, this);
    }
    this.currTaskForm.mainForm.getForm().setValues(newRecordForForm(record));
    this.currTaskForm.mainForm.fireEvent('setValue');
    if (record.data.key) {
        if (this.currTaskForm.continueButton) {
            // has continue step
            this.currTaskForm.formState('update');
            this.currTaskForm.loadData();
        }   else {
            this.currTaskForm.saveButton.enable();
        }
        // activity exists on server
    } else {
        if (this.currTaskForm.continueButton) {
            // has continue step
            this.currTaskForm.formState('create');
        } else {
            // doesn't have continue step
            this.currTaskForm.saveButton.enable();
        }
    }
    this.currTaskForm.mainForm.getForm().clearInvalid();
}
Controller.prototype.continueTask = function() {
    if (this.currTaskForm) {
        if (this.currTaskForm.continueButton && this.currTaskForm.continueButton.isVisible()) {
            if(this.currTaskForm.mainForm.getForm().isValid()){
                this.currTaskForm.resetForms();
                this.currTaskForm.formState('update');
            }  else {
                formFailureFunction();
            }
        }
    }
}
Controller.prototype.saveRuns = function() {
    this.saveActivity();
    this.currTaskForm.on('dataSaved', this.saveRunsComplete, this);
    this.currTaskForm.saveData();
}
Controller.prototype.saveRunsComplete = function() {
    this.currTaskForm.removeListener('dataSaved', this.saveRunsComplete, this);
    this.cancelTask();
}
Controller.prototype.saveActivity = function() {
    this.currTaskForm.continueButton.disable();
    this.currTaskForm.mainForm.getForm().submit({
        url: this.currTaskForm.mainForm.form_url,
        scope: this,
        waitMsg: 'Saving Data...',
        params: this.currTaskForm.mainForm.params,
        submitEmptyText: false,
        success: function(form, action) {
            var key = Ext.decode(action.response.responseText).key;
            this.currTaskForm.mainForm.getForm().setValues({
                key: key
            });
            var recordServerJSON = Ext.decode(action.response.responseText).record;
            record = this.taskList.getStore().reader.extractData([recordServerJSON], true)[0];
            this.currTaskForm.continueButton.enable();
	    if(this.currTaskForm.continueButton.isVisible()){
		this.editTask(record);
	    }	else {
		// do nothing
	    }
        },
        failure: function(form, action) {
            this.currTaskForm.continueButton.enable();
            formFailureFunction();
        }
    });
}
Controller.prototype.saveTaskLast = function() {
    if (this.currTaskForm) {
        if(this.currTaskForm.mainForm.getForm().isValid()){
            this.currTaskForm.saveData();
        }
    }
}
Controller.prototype.saveTaskLastContinue = function() {
    if (this.currTaskForm) {
        if(this.currTaskForm.mainForm.getForm().isValid()){
            this.saveTaskRecord(function(form, action){
                var key = Ext.decode(action.response.responseText).key;
                this.currTaskForm.mainForm.getForm().setValues({
                    key: key
                });
                var recordServerJSON = Ext.decode(action.response.responseText).record;
                var record = this.taskList.getStore().reader.extractData([recordServerJSON], true)[0];
                this.cancelTask();
            });
        }
    }
}
Controller.prototype.saveTaskFirst = function() {
    if (this.currTaskForm) {
        if(this.currTaskForm.mainForm.getForm().isValid()){
            this.saveTaskRecord(function(form, action){
                var key = Ext.decode(action.response.responseText).key;
                this.currTaskForm.mainForm.getForm().setValues({
                    key: key
                });
                this.currTaskForm.saveData();
            });
        }
    }
}
Controller.prototype.saveTaskFirstContinue = function() {
    if (this.currTaskForm) {
        if(this.currTaskForm.mainForm.getForm().isValid()){
            this.saveTaskRecord(function(form, action){
                this.cancelTask();
            });
        }
    }
}
Controller.prototype.saveTaskRecord = function(successFn) {
    this.currTaskForm.saveButton.disable();
    this.currTaskForm.mainForm.getForm().submit({
        url: this.currTaskForm.mainForm.form_url,
        scope: this,
        waitMsg: 'Saving Data...',
        params: this.currTaskForm.mainForm.params,
        submitEmptyText: false,
        success: successFn,
        failure: function(form, action) {
            this.currTaskForm.saveButton.enable();
            formFailureFunction();
        }
    });
}
Ext.onReady(function() {
    Ext.QuickTips.init();
    var controller = new Controller();
});
