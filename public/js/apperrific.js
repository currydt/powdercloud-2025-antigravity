/* (c) Copyright Apperrific Ltd. (pending transfer) 2010. ALL RIGHTS RESERVED. */
function pagSelect( el, curPage, numPages, sSort, sSortVal, sSortDesc, sSortDescVal, sPrefix ) {
	if( el && curPage && curPage > 0 && numPages && numPages > 1 ) {
		if( !$( el ).html().indexOf( "form" ) > -1 ) {
			$( el ).html( "Page <form class=\"frmPag\" method=\"get\">" + ( sSortVal && sSortVal != "" ? "<input type=\"hidden\" name=\"" + sSort + "\" value=\"" + sSortVal + "\" />" : "" ) + ( sSortDescVal && sSortDescVal.toLowerCase() == "true" ? "<input type=\"hidden\" name=\"" + sSortDesc + "\" value=\"" + sSortDescVal + "\" />" : "" ) + "<input id=\"inPagePageNo\" name=\"" + sPrefix + "page\" type=\"text\" /></form> of " + numPages );
		}
		$( "#inPagePageNo" ).focus();
	}
}
function pagKeyEvt( event, el, curPage, numPages ) {
	if( !event ) event =window.event;
	if( event && el && curPage && curPage > 0 && numPages && numPages > 0 ) {
		if( event.keyCode == 27 ) {
			$( el ).html( "Page <strong>" + curPage + "</strong> of " + numPages );
		}
	}
}

function hide( el ) {
	if( el && el != "" && $( "#" + el ).length > 0 ) {
		$( "#" + el ).fadeOut();
	}
}

function jQUITabURLs( event, ui ) {
	var url = $.data( ui.tab, 'href.tabs' );
	if( url ) { location.href = url; return false; }
	return true;
}

function initAppDateTime( sDateFormat ) {
	$('.inAppDate').datepicker( { dateFormat: sDateFormat } );
	$('.inAppTimeNow').each( function( idx, el ) {
		$( el ).parent().append( " <a href=\"javascript:doAppTimeNow( '" + $( el ).attr( "id" ) + "', '" + sDateFormat + "' );\">Now</a>" );
	});
}
function doAppTimeNow( sElTimeID, sDateFormat ) {
	if( sElTimeID && sElTimeID != "" && sElTimeID.substr( -1 ) == "1" ) {
		var dt = new Date()
		var sElDateID = sElTimeID.substring( 0, sElTimeID.length - 1 ) + "0";
		if( $( "#" + sElDateID ).length > 0 && $( "#" + sElTimeID ).length > 0 ) {
			$( "#" + sElDateID ).val( $.datepicker.formatDate( sDateFormat, dt ) );
			$( "#" + sElTimeID ).val( zeroPadInt2( dt.getHours(), 2 ) + ":" + zeroPadInt2( dt.getMinutes(), 2 ) );
		}
	}
}
function checkDate( el ) {
	if( el && el.value != "" && el.id && el.id.substr( -1 ) == "0" ) {
		var elID = el.id.substring( 0, el.id.length - 1 );
		if( $( "#" + elID + "1" ) ) $( "#" + elID + "1" ).focus().select();
	}
}
function checkTime( el ) {
	if( el ) {
		if( el.value != "" ) {
			if( el.value.replace( /[0-9:]/g, "" ).length > 0 ) el.value = "00:00";
			else {
				if( el.value.length > 5 ) el.value = "00:00";
				else if( el.value.length == 5 ) {
					if( el.value.indexOf( ":" ) < 0 ) el.value = "00:00";
				}
				else if( el.value.length == 4 ) {
					if( el.value.indexOf( ":" ) > -1 ) el.value = "0" + el.value;
					else el.value = el.value.substr( 0, 2 ) + ":" + el.value.substr( 2, 2 );
				}
				else if( el.value.length == 3 ) el.value = "0" + el.value.substr( 0, 1 ) + ":" + el.value.substr( 1, 2 );
				else el.value = "00:00";
			}
		}
	}
}
function zeroPadInt2( num ) {
	var sRet = "" + num;
	var sZeros = "";
	for( var i=0; i < ( 2 - sRet.length ); i++ ) {
		sZeros += "0";
	}
	return sZeros + sRet;
}

function twoDecimalNum( num ) {
	var pm = num < 0 ? "-" : "";
	var roundedNum = Math.abs( Math.round( num * 100 ) );
	var sRet = roundedNum.toString();
  	if( roundedNum < 10 ) sRet = "0.0" + sRet;
  	else if( roundedNum < 100 ) sRet = "0." + sRet;
	else sRet = sRet.substring( 0, ( sRet.length - 2 ) ) + "." + sRet.substring( ( sRet.length - 2 ), sRet.length );
	return pm + sRet;
}

function parseURIArgs( arrExcludedArgs ) {
    var args = [];
	if( window.location.href.indexOf( '?' ) > -1 ) {
		var arr1 = window.location.href.slice( window.location.href.indexOf( '?' ) + 1 ).split('&');
		for( var i = 0; i < arr1.length; i++ ) {
			var arr2 = arr1[i].split( '=' );
			if( arr2 && arr2.length == 2 ) {
				var bOK = true;
				if( arrExcludedArgs && arrExcludedArgs.length > 0 ) {
					for( var j = 0; j < arrExcludedArgs.length; j++ ) if( arrExcludedArgs[j] == arr2[0] ) bOK = false;
				}
				if( bOK ) {
					if( args[ arr2[0] ] && args[ arr2[0] ].length > 0 ) args[ arr2[0] ][ args[ arr2[0] ].length ] = arr2[1];
					else args[ arr2[0] ] = new Array( arr2[1] );
				}
			}
		}
	}
    return args;
}

function genURLFromURIArgs( hArgs, sAdditionalArgs ) {
	sURL = window.location.protocol + "//" + window.location.host + window.location.pathname;
	var sArgs = "";
	if( hArgs ) {
		for( var key in hArgs ) {
			if( hArgs.hasOwnProperty( key ) ) {
				var arrArgs = hArgs[ key ];
				if( arrArgs && arrArgs.length > 0 ) {
					for( var i = 0; i < arrArgs.length; i++ ) {
						if( sArgs != "" ) sArgs += "&";
						sArgs += key + "=" + arrArgs[i];
					}
				}
			}
		}
	}

	if( sAdditionalArgs && sAdditionalArgs != "" ) {
		if( sArgs != "" ) sArgs += "&";
		sArgs += sAdditionalArgs;
	}

	sURL += "?" + sArgs;
	return sURL;
}

function parseDate( sDate ) {
	// Parse a YYYY-MM-DD string. Date.parse() isn't reliable across all browsers.
	var aParts = sDate.match( /(\d+)/g );
	if( aParts && aParts.length == 3 ) {
		return new Date( aParts[0], aParts[1] -1, aParts[2] ); // month is 0-indexed
	}
	else return null;
}
