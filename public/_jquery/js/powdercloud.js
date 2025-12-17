// (c) Copyright PowderCloud Software Inc. 2010. ALL RIGHTS RESERVED.

var iOpStdTypeOGRS = 1;
var iOpStdTypeSWAG = 2;
var iOpStdType = iOpStdTypeOGRS;

function lstr( str ) {
	if( typeof( PC_STR ) != "undefined" && PC_STR ) {
		if( typeof( PC_STR[ str ] ) != "undefined" && PC_STR[ str ] ) return PC_STR[ str ];
		else return str;
	}
	else return str;
}

// Styling
function formRowFocus( sID ) {
	if( $( sID ) ) {
		$( sID ).focus( function() {
			if( !$(this).parent().hasClass( "error" ) ) {
				$(this).parent().css("background-color","#eeeeee");
			}
		} );
	}
}
function formRowBlur( sID ) {
	if( $( sID ) ) {
		$( sID ).blur( function() {
			if( !$(this).parent().hasClass( "error" ) ) {
				$(this).parent().css("background-color","#f9f9f9");
			}
			else {
				$(this).parent().css("background-color","#ffcccc");
			}
		} );
	}
}

// Validation & auto-correct
function frmSubmit( frm ) {
	if( frm && $( frm ).children( ".error" ).length > 0 ) {
		flashErr( lstr( "Val.Generic.OustandingFormErrors" ) );
		return false;
	}
	else return true;
}
function registerObsCheckers() {
	// TODO attach an ID to all <ul> with class of errorlist


	// TODO - remove this when testing is finished.
	// To disable client-side validation, uncomment this return line..
	//return;

	// Generic field validation
	$('.iColorPicker').change( function() { valHTMLHexColor( $(this) ); } );

	// Specifc field validation
	$('.inAirTemp').change( function() { valAirTemp( $(this) ); } );
	$('.inAspectNum').change( function() { valAspectNum( $(this) ); } );
	$('.inAavalDepthMeasureI').change( function() { valAvalDepthI( $(this) ); } );
	$('.inAavalDepthMeasureM').change( function() { valAvalDepthM( $(this) ); } );
	$('.inAavalPathRunMeasureI').change( function() { valAvalPathRunI( $(this) ); } );
	$('.inAavalPathRunMeasureM').change( function() { valAvalPathRunM( $(this) ); } );
	$('.inAvalSurfaceI').change( function() { valAvalSurfaceI( $(this) ); } );
	$('.inAvalSurfaceM').change( function() { valAvalSurfaceM( $(this) ); } );
	$('.inBarometric').change( function() { valBarometric( $(this) ); } );
	$('.inDensity').change( function() { valDensity( $(this) ); } );
	$('.inElevationI').change( function() { valElevationI( $(this) ); } );
	$('.inElevationM').change( function() { valElevationM( $(this) ); } );
	$('.inElevationValleyFogI').change( function() { valElevationValleyFogI( $(this) ); } );
	$('.inElevationValleyFogM').change( function() { valElevationValleyFogM( $(this) ); } );
	$('.inGrainSize').change( function() { valGrainSize( $(this) ); } );
	$('.inHits').change( function() { valHits( $(this) ); } );
	$('.inIncline').change( function() { valIncline( $(this) ); } );
	$('.inLayer').change( function() { valLayer( $(this) ); } );
	$('.inMass').change( function() { valMass( $(this) ); } );
	$('.inMultiNum').change( function() { valMultiNum( $(this) ); } );
	$('.inPenFootI').change( function() { valPenFootI( $(this) ); } );
	$('.inPenFootM').change( function() { valPenFootM( $(this) ); } );
	$('.inPenRam').change( function() { valPenRam( $(this) ); } );
	$('.inPercent').change( function() { valPercent( $(this) ); } );
	$('.inPrecipIntensityI').change( function() { valPrecipIntensityI( $(this) ); } );
	$('.inPrecipIntensityM').change( function() { valPrecipIntensityM( $(this) ); } );
	$('.inRelativeHumidity').change( function() { valRelativeHumidity( $(this) ); } );
	$('.inSampTubeInsLen').change( function() { valSampTubeInsLen( $(this) ); } );
	$('.inShortText').change( function() { valShortText( $(this) ); } );
	$('.inSizeOf').change( function() { valSizeOf( $(this) ); } );
	$('.inSnowFallDepth').change( function() { valSnowFallDepth( $(this) ); } );
	$('.inSnowProThickness').change( function() { valSnowProThickness( $(this) ); } );
	$('.inSnowTemp').change( function() { valSnowTemp( $(this) ); } );
	$('.inStabilityRatio').change( function() { valStabilityRatio( $(this) ); } );
	$('.inThermoTemp').change( function() { valThermoTemp( $(this) ); } );
	$('.inWaterEquivI').change( function() { valWaterEquivI( $(this) ); } );
	$('.inWaterEquivM').change( function() { valWaterEquivM( $(this) ); } );
	$('.inWindDirNum').change( function() { valWindDirNum( $(this) ); } );
	$('.inWindSpeed').change( function() { valWindSpeed( $(this) ); } );

	// Handle field changes
	$('.inTwinLUPMaj').change( function() { handleTwinLUPMajorChange( $(this) ); } );
}
// Generic field validation
function valHTMLHexColor( el ) {
	if( el ) {
		if( el.val() != "" && !isHTMLHexColorCode( el.val() ) ) appendError( el, lstr( "Val.PersistentFailurePlaneColor.Invalid" ) );
		else removeError( el );
	}
}
// Specific field validation
function valAirTemp( el ) {
	if( el ) {
		if( el.val() != "" ) {
			if( isNaN( el.val() ) ) appendError( el, lstr( "Val.AirTemp.NaN" ) );
			else if( !isNumberWith0Or5Remainder( el.val() ) ) appendError( el, lstr( "Val.AirTemp.InvalidRemainder" ) );
			else removeError( el );
		}
		else removeError( el );
	}
}
function valAspectNum( el ) {
	if( el ) {
		if( el.val() != "" ) {
			if( isInteger( el.val() ) ) {
				if( el.val() < 0 ) appendError( el, lstr( "Val.AspectNum.TooLow" ) );
				else if( el.val() > 360 ) appendError( el, lstr( "Val.AspectNum.TooHigh" ) );
				else removeError( el );
			}
			else appendError( el, lstr( "Val.AspectNum.NaN" ) );
		}
		else removeError( el );
	}
}
function valAvalDepthI( el ) {
	if( el ) {
		if( el.val() != "" ) {
			if( !isPosInteger( el.val() ) ) appendError( el, lstr( "Val.AvalancheDepthMeasurement.NaN.I" ) );
			else removeError( el );
		}
		else removeError( el );
	}
}
function valAvalDepthM( el ) {
	if( el ) {
		if( el.val() != "" ) {
			if( !isPosInteger( el.val() ) ) appendError( el, lstr( "Val.AvalancheDepthMeasurement.NaN.M" ) );
			else if( !isMultipleOf( el.val(), 25 ) ) appendError( el, lstr( "Val.AvalancheDepthMeasurement.NaN.M" ) );
			else removeError( el );
		}
		else removeError( el );
	}
}
function valAvalPathRunI( el ) {
	if( el ) {
		if( el.val() != "" ) {
			if( !isPosInteger( el.val() ) ) appendError( el, lstr( "Val.AvalanchePathRunMeasurement.NaN" ) );
			else if( el.val() > 1000 && !isMultipleOf( el.val(), 300 ) ) appendError( el, lstr( "Val.AvalanchePathRunMeasurement.InvalidMultiple300.I" ) );
			else if( !isMultipleOf( el.val(), 100 ) ) appendError( el, lstr( "Val.AvalanchePathRunMeasurement.InvalidMultiple100.I" ) );
			else removeError( el );
		}
		else removeError( el );
	}
}
function valAvalPathRunM( el ) {
	if( el ) {
		if( el.val() != "" ) {
			if( !isPosInteger( el.val() ) ) appendError( el, lstr( "Val.AvalanchePathRunMeasurement.NaN" ) );
			else if( el.val() > 300 && !isMultipleOf( el.val(), 100 ) ) appendError( el, lstr( "Val.AvalanchePathRunMeasurement.InvalidMultiple100.M" ) );
			else if( !isMultipleOf( el.val(), 25 ) ) appendError( el, lstr( "Val.AvalanchePathRunMeasurement.InvalidMultiple25.M" ) );
			else removeError( el );
		}
		else removeError( el );
	}
}
function valAvalSurfaceI( el ) {
	if( el ) {
		if( el.val() != "" ) {
			if( !isPosInteger( el.val() ) ) appendError( el, lstr( "Val.AvalancheWidthMeasurement.NaN.I" ) );
			else removeError( el );
		}
		else removeError( el );
	}
}
function valAvalSurfaceM( el ) {
	if( el ) {
		if( el.val() != "" ) {
			if( !isPosInteger( el.val() ) ) appendError( el, lstr( "Val.AvalancheWidthMeasurement.NaN.M" ) );
			else if( !isMultipleOf( el.val(), 10 ) ) appendError( el, lstr( "Val.AvalancheWidthMeasurement.NaN.M" ) );
			else removeError( el );
		}
		else removeError( el );
	}
}
function valBarometric( el ) {
	if( el ) {
		if( el.val() != "" ) {
			if( isNaN( el.val() ) || el.val() <= 0 ) appendError( el, lstr( "Val.BarometricPressure.NaN" ) );
			else if( !hasMaxRemainderDigitsOf( el.val(), 2 ) ) appendError( el, lstr( "Val.BarometricPressure.InvalidRemainder" ) );
			else removeError( el );
		}
		else removeError( el );
	}
}
function valDensity( el ) {
	if( el ) {
		if( el.val() != "" ) {
			if( !isInteger( el.val() ) || el.val() < 0 ) appendError( el, lstr( "Val.Density.NaN" ) );
			else removeError( el );
		}
		else removeError( el );
	}
}
function valElevationI( el ) {
	if( el ) {
		if( el.val() != "" ) {
			if( !isInteger( el.val() ) ) appendError( el, lstr( "Val.Elevation.NaN" ) );
			else if( el.val() < 0 ) appendError( el, lstr( "Val.Elevation.TooLow.I" ) );
			else if( el.val() > 30000 ) appendError( el, lstr( "Val.Elevation.TooHigh.I" ) );
			else removeError( el );
		}
		else removeError( el );
	}
}
function valElevationM( el ) {
	if( el ) {
		if( el.val() != "" ) {
			if( !isInteger( el.val() ) ) appendError( el, lstr( "Val.Elevation.NaN" ) );
			else if( el.val() < 0 ) appendError( el, lstr( "Val.Elevation.TooLow.M" ) );
			else if( el.val() > 9000 ) appendError( el, lstr( "Val.Elevation.TooHigh.M" ) );
			else removeError( el );
		}
		else removeError( el );
	}
}
function valElevationValleyFogI( el ) {
	if( el ) {
		if( el.val() != "" ) {
			if( !isInteger( el.val() ) ) appendError( el, lstr( "Val.ElevationValleyFog.NaN" ) );
			else if( el.val() < 0 ) appendError( el, lstr( "Val.ElevationValleyFog.TooLow.I" ) );
			else if( el.val() > 30000 ) appendError( el, lstr( "Val.Elevation.TooHigh.I" ) );
			else if( !isMultipleOf( el.val(), 100 ) ) appendError( el, lstr( "Val.ElevationValleyFog.BadRounding.I" ) );
			else removeError( el );
		}
		else removeError( el );
	}
}
function valElevationValleyFogM( el ) {
	if( el ) {
		if( el.val() != "" ) {
			if( !isInteger( el.val() ) ) appendError( el, lstr( "Val.ElevationValleyFog.NaN" ) );
			else if( el.val() < 0 ) appendError( el, lstr( "Val.ElevationValleyFog.TooLow.M" ) );
			else if( el.val() > 9000 ) appendError( el, lstr( "Val.Elevation.TooHigh.M" ) );
			else if( !isMultipleOf( el.val(), 50 ) ) appendError( el, lstr( "Val.ElevationValleyFog.BadRounding.M" ) );
			else removeError( el );
		}
		else removeError( el );
	}
}
function valGrainSize( el ) {
	if( el ) {
		if( el.val() != "" ) {
			if( isNaN( el.val() ) || el.val() <= 0 ) appendError( el, lstr( "Val.GrainSize.NaN" ) );
			else {
				if( el.val() > 0.5 && !isNumberWith0Or5Remainder( el.val() ) ) appendError( el, lstr( "Val.GrainSize.BadRemainderHigh" ) );
				else if( el.val() <= 0.5 && el.val() != 0.1 && el.val() != 0.3 &&  el.val() != 0.5 ) appendError( el, lstr( "Val.GrainSize.BadRemainderLow" ) );
				else removeError( el );
			}
		}
		else removeError( el );
	}
}
function valHits( el ) {
	if( el ) {
		if( el.val() != "" ) {
			if( !isPosIntegerOrZero( el.val() ) ) appendError( el, lstr( "Val.Hits.NaN" ) );
			else if( el.val() > 30 ) appendError( el, lstr( "Val.Hits.TooHigh" ) );
			else removeError( el );
		}
		else removeError( el );
	}
}
function valIncline( el ) {
	if( el ) {
		if( el.val() != "" ) {
			if( !isPosIntegerOrZero( el.val() ) ) appendError( el, lstr( "Val.Incline.NaN" ) );
			else if( el.val() > 90 ) appendError( el, lstr( "Val.Incline.TooHigh" ) );
			else removeError( el );
		}
		else removeError( el );
	}
}
function valLayer( el ) {
	if( el ) {
		if( el.val() != "" ) {
			if( !isPosIntegerOrZero( el.val() ) ) appendError( el, lstr( "Val.Layer.NaN" ) );
			else removeError( el );
		}
		else removeError( el );
	}
}
function valMass( el ) {
	if( el ) {
		if( el.val() != "" ) {
			if( isNaN( el.val() ) || el.val() <= 0 ) appendError( el, lstr( "Val.Mass.NaN" ) );
			else removeError( el );
		}
		else removeError( el );
	}
}
function valMultiNum( el ) {
	if( el ) {
		if( el.val() != "" ) {
			if( !isPosIntegerOrZero( el.val() ) ) appendError( el, lstr( "Val.MultipleNum.NaN" ) );
			else if( el.val() < 2 ) appendError( el, lstr( "Val.MultipleNum.TooLow" ) );
			else removeError( el );
		}
		else removeError( el );
	}
}
function valPenFootI( el ) {
	if( el ) {
		if( el.val() != "" ) {
			if( !isPosIntegerOrZero( el.val() ) ) appendError( el, lstr( "Val.PenFoot.NaN" ) );
			//else if( el.val() != 0 && el.val() != 1 && el.val() != 2 && isMultipleOf( el.val(), 2 ) ) appendError( el, lstr( "Val.PenFoot.BadRounding.I" ) );
			else if( el.val() > 2 && !isMultipleOf( el.val(), 2 ) ) appendError( el, lstr( "Val.PenFoot.BadRounding.I" ) );
			else removeError( el );
		}
		else removeError( el );
	}
}
function valPenFootM( el ) {
	if( el ) {
		if( el.val() != "" ) {
			if( !isPosIntegerOrZero( el.val() ) ) appendError( el, lstr( "Val.PenFoot.NaN" ) );
			else if( el.val() > 5 && !isMultipleOf( el.val(), 5 ) ) appendError( el, lstr( "Val.PenFoot.BadRounding.M" ) );
			else removeError( el );
		}
		else removeError( el );
	}
}
function valPenRam( el ) {
	if( el ) {
		if( el.val() != "" ) {
			if( !isPosInteger( el.val() ) ) appendError( el, lstr( "Val.PenRam.NaN" ) );
			else removeError( el );
		}
		else removeError( el );
	}
}
function valPercent( el ) {
	if( el ) {
		if( el.val() != "" ) {
			if( !isPosIntegerOrZero( el.val() ) ) appendError( el, lstr( "Val.Percent.NaN" ) );
			else if( el.val() > 100 ) appendError( el, lstr( "Val.Percent.TooHigh" ) );
			else removeError( el );
		}
		else removeError( el );
	}
}
function valPrecipIntensityI( el ) {
	if( el ) {
		if( el.val() != "" ) {
			if( isNaN( el.val() ) || el.val() <= 0 ) appendError( el, lstr( "Val.PrecipitationIntensity.NaN" ) );
			else if( !hasMaxRemainderDigitsOf( el.val(), 2 ) ) appendError( el, lstr( "Val.PrecipitationIntensity.BadPrecision.I" ) );
			else removeError( el );
		}
		else removeError( el );
	}
}
function valPrecipIntensityM( el ) {
	if( el ) {
		if( el.val() != "" ) {
			if( isNaN( el.val() ) || el.val() <= 0 ) appendError( el, lstr( "Val.PrecipitationIntensity.NaN" ) );
			else if( !hasMaxRemainderDigitsOf( el.val(), 1 ) ) appendError( el, lstr( "Val.PrecipitationIntensity.BadPrecision.M" ) );
			else removeError( el );
		}
		else removeError( el );
	}
}
function valRelativeHumidity( el ) {
	if( el ) {
		if( el.val() != "" ) {
			if( !isPosIntegerOrZero( el.val() ) ) appendError( el, lstr( "Val.RelativeHumidity.NaN" ) );
			else if( el.val() > 100 ) appendError( el, lstr( "Val.RelativeHumidity.TooHigh" ) );
			else removeError( el );
		}
		else removeError( el );
	}
}
function valSampTubeInsLen( el ) {
	if( el ) {
		if( el.val() != "" ) {
			if( isNaN( el.val() ) || el.val() <= 0 ) appendError( el, lstr( "Val.SamplingTupeInsertionLength.NaN" ) );
			else if( !hasMaxRemainderDigitsOf( el.val(), 1 ) ) appendError( el, lstr( "Val.SnowProfileThickness.BadPrecision" ) );
			else removeError( el );
		}
		else removeError( el );
	}
}
function valShortText( el ) {
	if( el ) {
		if( el.val() != "" ) {
			if( el.val().length > 128 ) appendError( el, lstr( "Val.ShortString.TooLong" ) );
			else if( !hasMaxRemainderDigitsOf( el.val(), 1 ) ) appendError( el, lstr( "Val.SnowProfileThickness.BadPrecision" ) );
			else removeError( el );
		}
		else removeError( el );
	}
}
function valSizeOf( el ) {
	if( el ) {
		if( el.val() != "" ) {
			if( isNaN( el.val() ) || el.val() <= 0 ) appendError( el, lstr( "Val.SizeOf.NaN" ) );
			else if( !hasMaxRemainderDigitsOf( el.val(), 1 ) ) appendError( el, lstr( "Val.SizeOf.BadPrecision" ) );
			else removeError( el );
		}
		else removeError( el );
	}
}
function valSnowFallDepth( el ) {
	if( el ) {
		if( el.val() != "" ) {
			if( isNaN( el.val() ) || el.val() < 0 ) appendError( el, lstr( "Val.SnowFallDepth.NaN" ) );
			else if( el.val() != 0 && el.val() != 0.1 && el.val() != 0.5 && !isPosInteger( el.val() ) ) appendError( el, lstr( "Val.SnowFallDepth.NaN" ) );
			else removeError( el );
		}
		else removeError( el );
	}
}
function valSnowProThickness( el ) {
	if( el ) {
		if( el.val() != "" ) {
			if( !isPosIntegerOrZero( el.val() ) ) appendError( el, lstr( "Val.SnowProfileThickness.NaN" ) );
			else if( el.val() > 6000 ) appendError( el, lstr( "Val.SnowProfileThickness.TooHigh" ) );
			else removeError( el );
		}
		else removeError( el );
	}
}
function valSnowTemp( el ) {
	if( el ) {
		if( el.val() != "" ) {
			if( isNaN( el.val() ) ) appendError( el, lstr( "Val.SnowTemperature.NaN" ) );
			else if( !hasMaxRemainderDigitsOf( el.val(), 1 ) ) appendError( el, lstr( "Val.SnowTemperature.BadPrecision" ) );
			else {
				var remain = remainder( el.val() );
				if( remain && remain.length > 0 && remain != 1 && remain != 2 && remain != 3 && remain != 9 ) appendError( el, lstr( "Val.SnowTemperature.BadRounding" ) );
				else removeError( el );
			}
		}
		else removeError( el );
	}
}
function valStabilityRatio( el ) {
	if( el ) {
		if( el.val() != "" ) {
			if( isNaN( el.val() ) || el.val() < 0 ) appendError( el, lstr( "Val.StabilityRatio.NaN" ) );
			else if( el.val() > 1000 ) appendError( el, lstr( "Val.StabilityRatio.TooHigh" ) );
			else if( !hasMaxRemainderDigitsOf( el.val(), 3 ) ) appendError( el, lstr( "Val.StabilityRatio.BadPrecision" ) );
			else removeError( el );
		}
		else removeError( el );
	}
}
function valThermoTemp( el ) {
	if( el ) {
		if( el.val() != "" ) {
			if( !isInteger( el.val() ) ) appendError( el, lstr( "Val.ThermographTemperature.NaN" ) );
			else removeError( el );
		}
		else removeError( el );
	}
}
function valWaterEquivI( el ) {
	if( el ) {
		if( el.val() != "" ) {
			if( isNaN( el.val() ) ) appendError( el, lstr( "Val.WaterEquivalent.NaN" ) );
			else if( !hasMaxRemainderDigitsOf( el.val(), 2 ) ) appendError( el, lstr( "Val.WaterEquivalent.BadPrecision.I" ) );
			else removeError( el );
		}
		else removeError( el );
	}
}
function valWaterEquivM( el ) {
	if( el ) {
		if( el.val() != "" ) {
			if( isNaN( el.val() ) ) appendError( el, lstr( "Val.WaterEquivalent.NaN" ) );
			else if( !hasMaxRemainderDigitsOf( el.val(), 1 ) ) appendError( el, lstr( "Val.WaterEquivalent.BadPrecision.M" ) );
			else removeError( el );
		}
		else removeError( el );
	}
}
function valWindDirNum( el ) {
	if( el ) {
		if( el.val() != "" ) {
			if( !isPosIntegerOrZero( el.val() ) ) appendError( el, lstr( "Val.WindDirNum.NaN" ) );
			else if( el.val() > 360 ) appendError( el, lstr( "Val.WindDirNum.TooHigh" ) );
			else if( !isMultipleOf( el.val(), 10 ) ) appendError( el, lstr( "Val.WindDirNum.BadPrecision" ) );
			else removeError( el );
		}
		else removeError( el );
	}
}
function valWindSpeed( el ) {
	if( el ) {
		if( el.val() != "" ) {
			if( isNaN( el.val() ) || el.val() < 0 ) appendError( el, lstr( "Val.WindSpeedNum.NaN" ) );
			else if( el.val() > 1000 ) appendError( el, lstr( "Val.WindSpeedNum.TooHigh" ) );
			else if( !hasMaxRemainderDigitsOf( el.val(), 1 ) ) appendError( el, lstr( "Val.WindSpeedNum.BadPrecision" ) );
			else removeError( el );
		}
		else removeError( el );
	}
}

// TODO
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


// Validation utils
function isHTMLHexColorCode( s ) {
	if( s && s != "" ) {
		var re6 = new RegExp( "^#[0-9a-fA-F]{6}$" );
		var re3 = new RegExp( "^#[0-9a-fA-F]{3}$" );

		if( s.match( re6 ) ) return true;
		else {
			if( s.match( re3 ) ) return true;
			else return false;
		}
	}
	else return false;
}
function isInteger( i ) {
	if( parseInt(i) != i - 0 ) return false;
	else return true;
}
function isMultipleOf( num, multiple ) {
	if( !isNaN( num ) && !isNaN( multiple ) ) {
		if( num % multiple == 0 ) return true;
		else return false;
	}
	else return false;
}
function isPosInteger( i ) {
	if( parseInt(i) != i - 0 ) return false;
	else if( parseInt(i) <= 0 ) return false;
	else return true;
}
function isPosIntegerOrZero( i ) {
	if( parseInt(i) != i - 0 ) return false;
	else if( parseInt(i) < 0 ) return false;
	else return true;
}
function isNumberWith0Or5Remainder( num ) {
	if( num ) {
		arrParts = num.split( "." )
		if( arrParts ) {
			if( arrParts.length == 1 ) return true;
			else if( arrParts.length == 2 ) {
				if( arrParts[1] && arrParts[1].length > 1 ) return false
				else if( arrParts[1] == "0" || arrParts[1] == "5" ) return true
			}
		}
		else return false;
	}
	else return false;
}
function hasMaxRemainderDigitsOf( num, max_remain ) {
	if( num ) {
		arrParts = num.split( "." );
		if( arrParts.length <= 1 ) return true;
		else if( arrParts.length == 2 ) {
			if( arrParts[1].length <= max_remain ) return true;
			else return false;
		}
		else return false;
	}
	else return false;
}
function remainder( num ) {
	if( num ) {
		arrParts = num.split( "." );
		if( arrParts.length <= 1 ) return null;
		else if( arrParts.length == 2 ) {
			if( arrParts[1].length > 0 ) return arrParts[1];
			else return null;
		}
		else return null;
	}
	else return null;
}

function handleTwinLUPMajorChange( el ) {
	if( el ) {
		if( dLUPLookups && lups ) {
			var val = el.val();
			var sID = el.attr( "id" );
			if( sID && sID != "" ) {
				elMinor = $( "#" + sID + "_minor" );
				if( elMinor ) {
					if( sID.length > 3 && sID.indexOf( "id_" ) == 0 ) sID = sID.substring( 3 );

					if( dLUPLookups[ sID ] ) {
						var opts = elMinor.get(0).options;
						if( opts ) {
							if( opts.length > 0 ) {
								while( opts.length > 0 ) {
									opts[0] = null;
								}
							}

							if( val ) {
								for( var i = 0; i < lups.length; i++ ) {
									if( lups[i].key == dLUPLookups[ sID ] ) {
										for( var j = 0; j < lups[i].children.length; j++ ) {
											lupChild = lups[i].children[j];
											if( lupChild.key == val ) {
												for( var k = 0; k < lupChild.children.length; k++ ) {
													var lupChildChild = lupChild.children[k];
													opts[opts.length] = new Option( lupChildChild.value, lupChildChild.key );
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
}

// DOM utils
function appendError( el, errMsg ) {
	removeError( el, errMsg );
	if( el && errMsg ) {
		if( el.parent() ) {
			if( !el.parent().hasClass( "error" ) ) el.parent().addClass( "error" );
			if( el.parent().children( ".errorlist" ).length ) el.parent().children( ".errorlist" )[0].append( "<li>" + errMsg + "</li>" );
			else el.parent().append( "<span><ul class=\"errorlist\"><li>" + errMsg + "</li></ul></span>" );
		}
	}
}
function removeError( el, errMsg ) {
	if( el ) {
		if( el.parent().hasClass( "error" ) ) el.parent().removeClass( "error" );
		el.parent().children( "span" ).remove();
	}
}



function flashErr( txt ) {
	if( txt && txt != "" ) {
		$( "#spFlashWarn" ).html( txt );
		$( "#dvFlashWarn" ).fadeIn();
	}
}

function showLoading() {
	$("#dvContent").html( "<div class='dvLoading'><img src='/static/img/spinner-large.gif' /><br />" + lstr( "GLOBAL.Status.Loading" ) + "</div>" );
}
var PC_sectionDivToggle = function( event, ui ) {
	var url = $.data( ui.tab, 'load.tabs' );
	if( url ) {
		window.location = url;
		return false;
	}
	else {
		return true;
	}
}
