var runRecord,imageContainer;


function loadRecord(record){
    imageContainer.update('');
    runRecord = record;
    drawPhotos();
}
function drawPhotos(){
    var html = '';
    runRecord.data.photos.each(function(photo){
        html += '<img src="'+photo.data.url_medium+'"/><br>';
    }, this);
    imageContainer.update(html);
    Ext.get('title').update('Run Gallery for '+runRecord.data.name_nick);
}

Ext.onReady(function(){
    Ext.QuickTips.init();
    imageContainer = new Ext.Container();
    new Ext.Panel({
       renderTo: 'table-loc' ,
       border: false,
       items:[
            imageContainer
       ]
    });

    if(self.opener || !self.opener.runGallery) {
        self.opener.runGallery.load();
    }



});
