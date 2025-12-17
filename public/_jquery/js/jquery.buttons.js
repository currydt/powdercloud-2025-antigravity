$(function(){
    //all hover and click logic for buttons
    $(".fg-button:not(.ui-state-disabled)")
    .hover(
            function(){ 
                    $(this).addClass("ui-state-hover"); 
            },
            function(){ 
                    $(this).removeClass("ui-state-hover"); 
            }
    )
    .mousedown(function(){
                    $(this).parents('.fg-buttonset-single:first').find(".fg-button.ui-state-active").removeClass("ui-state-active");
                    if( $(this).is('.ui-state-active.fg-button-toggleable, .fg-buttonset-multi .ui-state-active') ){ $(this).removeClass("ui-state-active"); }
                    else { $(this).addClass("ui-state-active"); }	
    })
    .mouseup(function(){
            if(! $(this).is('.fg-button-toggleable, .fg-buttonset-single .fg-button,  .fg-buttonset-multi .fg-button') ){
                    $(this).removeClass("ui-state-active");
            }
    });
    
    /*
        Tabset
    */
    $(".fg-buttonset.fg-buttonset-single .fg-button").mousedown(function(){
        $(this).parents('.viewstack:first').find(".viewstack-content.active").removeClass("active");
        var tab_num = $(this).attr('id').split('_')[1];
        $(this).parents('.viewstack:first').find("#stack_"+tab_num).addClass("active");
    })
});
