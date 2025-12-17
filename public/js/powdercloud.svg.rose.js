/**
 * Powdercloud Svg Rose class
 *
 * requires jquery.svg.js, found here: http://keith-wood.name/svg.html or http://plugins.jquery.com/project/svg
 * requires jquery
 * requires powdercloud.svg.js
 */

 /* Based upon JQuery SVG found here:
http://keith-wood.name/svg.html
http://keith-wood.name/svgRef.html
http://plugins.jquery.com/project/svg
*/

/**
 * Assumptions:
 * 1. parent DIV must be at least 300x300 (or else font sizes must be changed and labels positions tweaked)
 * 2. parent DIV must have equal height and width
 *
 * Data Assumptions:
 * 1. must have a type and subtype
 * 2. use the "code" for aspect and trigger values. Must match exactly to helper methods.(uppercase, etc.)
 * 3. Single/Notable Avalanches use fields: elevation, size, aspectCode, triggerCode
 * 4. Multiple Avalanches use fields: elevationRangeStart, elevationRangeEnd, aspectRangeStart, aspectRangeEnd, avSizeRangeStart, avSizeRangeEnd, triggerCode
 */

// TODO: Tooltip R&D based upon: http://www.petercollingridge.co.uk/interactive-svg-components/tooltip.
// It kinda works.  But the tooltip y-coord is off.  Also if tooltip gets cut-off at right of viewport.

var canvasWidth = 0;
var canvasHeight = 0;
var isMini = false; // This boolean is used to determine whether rose is mini, this will customize the elements to show in limited space/size (ie: disabling labels, etc.)
var hasLegend = false;
var legendWidth = 150; // Default and ideal size

// Cardinal Lines Styles
var cardinalStrokeColor = "#BBBBBB";
var cardinalStrokeWidth = 1;
var cardinalStrokeOpacity = 1;
var cardinalStrokeDashArray = "none"; // If dashed desired, see http://www.w3.org/TR/SVG/painting.html, ex: "5,5"
var isCardinalLabelsShown = true;

// Elevation Circles Styles
var elevationCircleStrokeColor = "#BBBBBB";
var elevationCircleStrokeWidth = 1;
var elevationCircleStrokeOpacity = 1;
var elevationCircleStrokeDashArray = "none"; // If dashed desired, see http://www.w3.org/TR/SVG/painting.html, ex: "5,5"
var elevationCircleFill = "none";
var elevationCircleFillOpacity = 0;
var isElevationLabelsShown = true;

// Avalanche Styles
var isDrawCornerPointsForMultipleAv = false;
var AVALANCHE_PATH_STROKE_DEFAULT = "white";
var AVALANCHE_PATH_STROKE_WIDTH_DEFAULT = 0;
var AVALANCHE_PATH_FILL_OPACITY_DEFAULT = 0.6;
var AVALANCHE_LINE_STROKE_WIDTH = 3;
var AVALANCHE_COLOUR_DEFAULT = "black";
var AVALANCHE_COLOUR_SIZE_LESS_THAN_EQUAL_1 = "blue";
var AVALANCHE_COLOUR_SIZE_LESS_THAN_EQUAL_2 = "yellow";
var AVALANCHE_COLOUR_SIZE_GREATER_THAN_2 = "red";

// Text Styles
var FONT_FAMILY_DEFAULT = "sans-serif,Helvetica,Arial";
var FONT_SIZE_DEFAULT = 12;
var TEXT_STROKE_COLOR_DEFAULT = "#BBBBBB";
var TEXT_STROKE_WIDTH_DEFAULT = 0.1;
var TEXT_STROKE_OPACITY_DEFAULT = 1;
var TEXT_ANCHOR_MIDDLE = "middle";
var TEXT_ANCHOR_START = "start";
var TEXT_ANCHOR_END = "end";

var FONT_SIZE_LEGEND_H1 = 14;
var FONT_SIZE_LEGEND_H2 = 12;
var FONT_SIZE_LEGEND_ITEM = 9;

// Model Constants
var TYPE_AVALANCHE = "Avalanche";
var SUB_TYPE_AVALANCHE_SINGLE = "Single";
var SUB_TYPE_AVALANCHE_MULTIPLE = "Multiple";
var SUB_TYPE_AVALANCHE_NOTABLE = "Notable";
var TYPE_WEATHER = "Weather";
var TYPE_SNOWPACK_TEST = "SnowpackTest";
var TYPE_SNOWPROFILE = "Snowprofile";

// Model Variables
var canvasOffset = 30;
var numElevationCircles = 4;
var elevationIntervalImperial = 3281;
var elevationInterval = (isOperationMetric)? 1000: elevationIntervalImperial;
var obsBoxWidthHeight = 12; // This width/height is used when drawing weather/snowpackText/snowprofile items

// Global Model Members [ *** set in setModel() function *** ]
var top_y;
var bottom_y;
var left_x;
var right_x;
var center_x;
var center_y;

/*
// TODO: tooltip R&D
var tooltip_bg;
var tooltip;
*/

/**
 * Create SVG Rose.
 *
 * width Width (typically same as width, except if there is a legend, then add the legendWidth to the width, best legendWidth is 150)
 * height Height (typically same as width)
 * _isMini Boolean (true/false) determines if mini.  Shows limited elevation labels, no legend shown, smaller fonts
 * _hasLegend Boolean (true/false) determines if has a legend
 * _legendWidth Best value is 150, you must increase the width by the legendWidth.
 *
 * Ex: (600, 600, false, false) // No legend
 * Ex: (750, 600, false, true) // Legend, use default size (which is 150, this is ideal)
 * Ex: (800, 600, false, true, 200) // Legend, legendWidth is 200
 * Ex: (200, 200, true) // Mini
 */
function PowdercloudSvgRose(width, height, _isMini, _hasLegend, _legendWidth) {
	if (width) {
		canvasWidth = width;
	}
	if (height) {
		canvasHeight = height;
	}
	if (_hasLegend) {
		hasLegend = _hasLegend;
	}
	if (_legendWidth) {
		legendWidth = _legendWidth;
	}
	if (_isMini) {
		isMini = _isMini;
		FONT_SIZE_DEFAULT = 9;
		hasLegend = false;
		legendWidth = 0;
	}
}

/******* Draw Chart - Start **************/
PowdercloudSvgRose.prototype.drawChart = function(svg) {
	/*
	// TODO: tooltip R&D
	tooltip_bg = svg.rect(0, 0, 55, 17, 4, 4, {'stroke': 'black', 'stroke-width': 1, 'stroke-opacity': 1, 'stroke-dasharray': "none", 'fill': "white", 'fill-opacity': 0.9, 'visibility': "hidden"});
	tooltip = svg.text(0, 0, "tooltip", {'font-size': 12, 'visibility': "hidden"});
	*/

	if (hasLegend == false) {
		legendWidth = 0;
	}

	// Set Model
	top_y = 0 + canvasOffset;
	bottom_y = canvasHeight - canvasOffset;
	left_x = 0 + canvasOffset;
	right_x = canvasWidth - canvasOffset - legendWidth;
	center_x = (canvasWidth - legendWidth)/2;
	center_y = canvasHeight/2;

	// Draw Chart
	PowdercloudSvgRose.prototype.drawCardinalLines(svg);
	PowdercloudSvgRose.prototype.drawElevationCircles(svg);

	// Draw Legend
	PowdercloudSvgRose.prototype.drawLegend(svg);
}

/* ActivityRoseSVGChartModel.java, line 414 & ActivityRoseSVGChartHelper.java, line 715 */
PowdercloudSvgRose.prototype.drawCardinalLines = function(svg) {

	PowdercloudSvg.addSvgLine(svg, center_x, top_y, center_x, bottom_y, cardinalStrokeColor, cardinalStrokeWidth, cardinalStrokeOpacity, cardinalStrokeDashArray, null); // N_S Line
	PowdercloudSvg.addSvgLine(svg, right_x, center_y, left_x, center_y, cardinalStrokeColor, cardinalStrokeWidth, cardinalStrokeOpacity, cardinalStrokeDashArray, null);// E_W Line

	var radians_45 = PowdercloudSvgRose.prototype.radians( 45 );
	var sinValue_45 = Math.sin( radians_45 );
	var hypotenuse_45 = (right_x - left_x) / 2;
	var opposite_45 = sinValue_45 * hypotenuse_45;
	var cosValue_45 = Math.cos( radians_45 );
	var adjacent_45 = cosValue_45 * hypotenuse_45;

	PowdercloudSvg.addSvgLine(svg, (center_x + adjacent_45), (center_y - opposite_45), (center_x - adjacent_45), (center_y + opposite_45), cardinalStrokeColor, cardinalStrokeWidth, cardinalStrokeOpacity, cardinalStrokeDashArray, null); // NE_SW Line
	PowdercloudSvg.addSvgLine(svg, (center_x + adjacent_45), (center_y + opposite_45), (center_x - adjacent_45), (center_y - opposite_45), cardinalStrokeColor, cardinalStrokeWidth, cardinalStrokeOpacity, cardinalStrokeDashArray, null); // SE_NW Line

	var radians_67_5 = PowdercloudSvgRose.prototype.radians( 67.5 );
	var sinValue_67_5 = Math.sin( radians_67_5 );
	var hypotenuse_67_5 = (right_x - left_x) / 2;
	var opposite_67_5 = sinValue_67_5 * hypotenuse_67_5;
	var cosValue_67_5 = Math.cos( radians_67_5 );
	var adjacent_67_5 = cosValue_67_5 * hypotenuse_67_5;

	PowdercloudSvg.addSvgLine(svg, (center_x + adjacent_67_5), (center_y - opposite_67_5), (center_x - adjacent_67_5), (center_y + opposite_67_5), cardinalStrokeColor, cardinalStrokeWidth, cardinalStrokeOpacity, cardinalStrokeDashArray, null); // NNE_SSW Line
	PowdercloudSvg.addSvgLine(svg, (center_x + adjacent_67_5), (center_y + opposite_67_5), (center_x - adjacent_67_5), (center_y - opposite_67_5), cardinalStrokeColor, cardinalStrokeWidth, cardinalStrokeOpacity, cardinalStrokeDashArray, null); // SSE_NNW Line

	var radians_22_5 = PowdercloudSvgRose.prototype.radians( 22.5 );
	var sinValue_22_5 = Math.sin( radians_22_5 );
	var hypotenuse_22_5 = (right_x - left_x) / 2;
	var opposite_22_5 = sinValue_22_5 * hypotenuse_22_5;
	var cosValue_22_5 = Math.cos( radians_22_5 );
	var adjacent_22_5 = cosValue_22_5 * hypotenuse_22_5;

	PowdercloudSvg.addSvgLine(svg, (center_x + adjacent_22_5), (center_y - opposite_22_5), (center_x - adjacent_22_5), (center_y + opposite_22_5), cardinalStrokeColor, cardinalStrokeWidth, cardinalStrokeOpacity, cardinalStrokeDashArray, null); // ENE_WSW Line
	PowdercloudSvg.addSvgLine(svg, (center_x + adjacent_22_5), (center_y + opposite_22_5), (center_x - adjacent_22_5), (center_y - opposite_22_5), cardinalStrokeColor, cardinalStrokeWidth, cardinalStrokeOpacity, cardinalStrokeDashArray, null); // ESE_WNW Line

	if (isCardinalLabelsShown) {
		PowdercloudSvg.addSvgText(svg, center_x, top_y - 10, "N", FONT_FAMILY_DEFAULT, FONT_SIZE_DEFAULT, TEXT_STROKE_COLOR_DEFAULT, TEXT_STROKE_WIDTH_DEFAULT, TEXT_STROKE_OPACITY_DEFAULT, TEXT_ANCHOR_MIDDLE);
		PowdercloudSvg.addSvgText(svg, center_x, bottom_y + 15, "S", FONT_FAMILY_DEFAULT, FONT_SIZE_DEFAULT, TEXT_STROKE_COLOR_DEFAULT, TEXT_STROKE_WIDTH_DEFAULT, TEXT_STROKE_OPACITY_DEFAULT, TEXT_ANCHOR_MIDDLE);
		PowdercloudSvg.addSvgText(svg, right_x + 10, center_y, "E", FONT_FAMILY_DEFAULT, FONT_SIZE_DEFAULT, TEXT_STROKE_COLOR_DEFAULT, TEXT_STROKE_WIDTH_DEFAULT, TEXT_STROKE_OPACITY_DEFAULT, TEXT_ANCHOR_MIDDLE);
		PowdercloudSvg.addSvgText(svg, left_x - 10, center_y, "W", FONT_FAMILY_DEFAULT, FONT_SIZE_DEFAULT, TEXT_STROKE_COLOR_DEFAULT, TEXT_STROKE_WIDTH_DEFAULT, TEXT_STROKE_OPACITY_DEFAULT, TEXT_ANCHOR_MIDDLE);
		PowdercloudSvg.addSvgText(svg, (center_x + adjacent_45 + 15), (center_y - opposite_45 - 10), "NE", FONT_FAMILY_DEFAULT, FONT_SIZE_DEFAULT, TEXT_STROKE_COLOR_DEFAULT, TEXT_STROKE_WIDTH_DEFAULT, TEXT_STROKE_OPACITY_DEFAULT, TEXT_ANCHOR_MIDDLE);
		PowdercloudSvg.addSvgText(svg, (center_x - adjacent_45 - 10), (center_y + opposite_45 + 15), "SW", FONT_FAMILY_DEFAULT, FONT_SIZE_DEFAULT, TEXT_STROKE_COLOR_DEFAULT, TEXT_STROKE_WIDTH_DEFAULT, TEXT_STROKE_OPACITY_DEFAULT, TEXT_ANCHOR_MIDDLE);
		PowdercloudSvg.addSvgText(svg, (center_x + adjacent_45 + 10), (center_y + opposite_45 + 15), "SE", FONT_FAMILY_DEFAULT, FONT_SIZE_DEFAULT, TEXT_STROKE_COLOR_DEFAULT, TEXT_STROKE_WIDTH_DEFAULT, TEXT_STROKE_OPACITY_DEFAULT, TEXT_ANCHOR_MIDDLE);
		PowdercloudSvg.addSvgText(svg, (center_x - adjacent_45 - 15), (center_y - opposite_45 - 5), "NW", FONT_FAMILY_DEFAULT, FONT_SIZE_DEFAULT, TEXT_STROKE_COLOR_DEFAULT, TEXT_STROKE_WIDTH_DEFAULT, TEXT_STROKE_OPACITY_DEFAULT, TEXT_ANCHOR_MIDDLE);
	}
}

/* ActivityRoseSVGChartModel.java, line 519 & ActivityRoseSVGChartHelper.java, line 723 */
PowdercloudSvgRose.prototype.drawElevationCircles = function(svg) {

	var radius_max = (bottom_y - top_y)/2;
	var circleInterval = radius_max/numElevationCircles;

	// Draw circles
	for (i=1;i<=numElevationCircles;i++) {
		PowdercloudSvg.addSvgCircle(svg, center_x, center_y, circleInterval * i, elevationCircleStrokeColor, elevationCircleStrokeWidth, elevationCircleStrokeOpacity, elevationCircleStrokeDashArray, elevationCircleFill, elevationCircleFillOpacity);
	}

	// Draw labels
	for (i=0;i<numElevationCircles;i++) {
		if (isElevationLabelsShown) {
			if (isMini) {
				if (i != 0 && i != (numElevationCircles-1)) {
					continue;
				}
			}
			var elevationIntervalText = "";
			if(isOperationMetric){
				elevationIntervalText = (elevationInterval * i) + " m";
				PowdercloudSvg.addSvgText(svg, left_x + circleInterval * i, center_y + 15, elevationIntervalText, FONT_FAMILY_DEFAULT, FONT_SIZE_DEFAULT, TEXT_STROKE_COLOR_DEFAULT, TEXT_STROKE_WIDTH_DEFAULT, TEXT_STROKE_OPACITY_DEFAULT, TEXT_ANCHOR_MIDDLE);
			}	else {
				elevationIntervalText =  (elevationIntervalImperial * i) + " ft";
				PowdercloudSvg.addSvgText(svg, left_x + circleInterval * i, center_y - 15, elevationIntervalText, FONT_FAMILY_DEFAULT, FONT_SIZE_DEFAULT, TEXT_STROKE_COLOR_DEFAULT, TEXT_STROKE_WIDTH_DEFAULT, TEXT_STROKE_OPACITY_DEFAULT, TEXT_ANCHOR_MIDDLE);
			}
			
			
			//PowdercloudSvg.addSvgText(svg, right_x - circleInterval * i, center_y + 15, elevationIntervalImperialText, FONT_FAMILY_DEFAULT, FONT_SIZE_DEFAULT, TEXT_STROKE_COLOR_DEFAULT, TEXT_STROKE_WIDTH_DEFAULT, TEXT_STROKE_OPACITY_DEFAULT, TEXT_ANCHOR_MIDDLE);
			//PowdercloudSvg.addSvgText(svg, right_x - circleInterval * i, center_y - 15, elevationIntervalText, FONT_FAMILY_DEFAULT, FONT_SIZE_DEFAULT, TEXT_STROKE_COLOR_DEFAULT, TEXT_STROKE_WIDTH_DEFAULT, TEXT_STROKE_OPACITY_DEFAULT, TEXT_ANCHOR_MIDDLE);
		}
	}
}

/**
 * Legend best drawn if legendWidth is 150
 */
PowdercloudSvgRose.prototype.drawLegend = function(svg) {

	var legendVerticalSpacer = 25;
	var legendHorIndent = 15;

	var tempX = right_x + canvasOffset;
	var tempY = top_y + legendVerticalSpacer;

	PowdercloudSvg.addSvgText(svg, tempX, tempY, "LEGEND", FONT_FAMILY_DEFAULT, FONT_SIZE_LEGEND_H1, TEXT_STROKE_COLOR_DEFAULT, TEXT_STROKE_WIDTH_DEFAULT, TEXT_STROKE_OPACITY_DEFAULT, TEXT_ANCHOR_START);

	tempY += legendVerticalSpacer;
	PowdercloudSvg.addSvgText(svg, (tempX + legendHorIndent), tempY, "Single Avalanche", FONT_FAMILY_DEFAULT, FONT_SIZE_LEGEND_H2, TEXT_STROKE_COLOR_DEFAULT, TEXT_STROKE_WIDTH_DEFAULT, TEXT_STROKE_OPACITY_DEFAULT, TEXT_ANCHOR_START);

	tempY += legendVerticalSpacer;
	PowdercloudSvgRose.prototype.drawAvalancheSymbol(svg, {x: (tempX + legendHorIndent + legendHorIndent), y: (tempY - 3)} , 1, SUB_TYPE_AVALANCHE_SINGLE, null, null);
	PowdercloudSvg.addSvgText(svg, (tempX + 25 + legendHorIndent + legendHorIndent), tempY, "size <= 1", FONT_FAMILY_DEFAULT, FONT_SIZE_LEGEND_ITEM, TEXT_STROKE_COLOR_DEFAULT, TEXT_STROKE_WIDTH_DEFAULT, TEXT_STROKE_OPACITY_DEFAULT, TEXT_ANCHOR_START);

	tempY += legendVerticalSpacer;
	PowdercloudSvgRose.prototype.drawAvalancheSymbol(svg, {x: (tempX + legendHorIndent + legendHorIndent), y: (tempY - 3)} , 2, SUB_TYPE_AVALANCHE_SINGLE, null, null);
	PowdercloudSvg.addSvgText(svg, (tempX + 25 + legendHorIndent + legendHorIndent), tempY, "size > 1 and <= 2", FONT_FAMILY_DEFAULT, FONT_SIZE_LEGEND_ITEM, TEXT_STROKE_COLOR_DEFAULT, TEXT_STROKE_WIDTH_DEFAULT, TEXT_STROKE_OPACITY_DEFAULT, TEXT_ANCHOR_START);

	tempY += legendVerticalSpacer;
	PowdercloudSvgRose.prototype.drawAvalancheSymbol(svg, {x: (tempX + legendHorIndent + legendHorIndent), y: (tempY - 3)} , 3, SUB_TYPE_AVALANCHE_SINGLE, null, null);
	PowdercloudSvg.addSvgText(svg, (tempX + 25 + legendHorIndent + legendHorIndent), tempY, "size > 2 and < 4", FONT_FAMILY_DEFAULT, FONT_SIZE_LEGEND_ITEM, TEXT_STROKE_COLOR_DEFAULT, TEXT_STROKE_WIDTH_DEFAULT, TEXT_STROKE_OPACITY_DEFAULT, TEXT_ANCHOR_START);

	tempY += legendVerticalSpacer;
	PowdercloudSvgRose.prototype.drawAvalancheSymbol(svg, {x: (tempX + legendHorIndent + legendHorIndent), y: (tempY - 3)} , 4, SUB_TYPE_AVALANCHE_SINGLE, null, null);
	PowdercloudSvg.addSvgText(svg, (tempX + 25 + legendHorIndent + legendHorIndent), tempY, "size >= 4", FONT_FAMILY_DEFAULT, FONT_SIZE_LEGEND_ITEM, TEXT_STROKE_COLOR_DEFAULT, TEXT_STROKE_WIDTH_DEFAULT, TEXT_STROKE_OPACITY_DEFAULT, TEXT_ANCHOR_START);

	tempY += legendVerticalSpacer;
	PowdercloudSvgRose.prototype.drawAvalancheSymbol(svg, {x: (tempX + legendHorIndent + legendHorIndent), y: (tempY - 3)} , 4, SUB_TYPE_AVALANCHE_NOTABLE, null, null);
	PowdercloudSvg.addSvgText(svg, (tempX + 25 + legendHorIndent + legendHorIndent), tempY, "notable", FONT_FAMILY_DEFAULT, FONT_SIZE_LEGEND_ITEM, TEXT_STROKE_COLOR_DEFAULT, TEXT_STROKE_WIDTH_DEFAULT, TEXT_STROKE_OPACITY_DEFAULT, TEXT_ANCHOR_START);

	tempY += legendVerticalSpacer;
	PowdercloudSvg.addSvgText(svg, (tempX + legendHorIndent), tempY, "Multiple Avalanche", FONT_FAMILY_DEFAULT, FONT_SIZE_LEGEND_H2, TEXT_STROKE_COLOR_DEFAULT, TEXT_STROKE_WIDTH_DEFAULT, TEXT_STROKE_OPACITY_DEFAULT, TEXT_ANCHOR_START);

	tempY += legendVerticalSpacer;
	PowdercloudSvg.addSvgRect(svg, (tempX + legendHorIndent + 10), tempY - 15, 20, 20, AVALANCHE_COLOUR_SIZE_LESS_THAN_EQUAL_1, 0, 0, "none", AVALANCHE_COLOUR_SIZE_LESS_THAN_EQUAL_1, AVALANCHE_PATH_FILL_OPACITY_DEFAULT);
	PowdercloudSvg.addSvgText(svg, (tempX + 25 + legendHorIndent + legendHorIndent), tempY, "size <= 1", FONT_FAMILY_DEFAULT, FONT_SIZE_LEGEND_ITEM, TEXT_STROKE_COLOR_DEFAULT, TEXT_STROKE_WIDTH_DEFAULT, TEXT_STROKE_OPACITY_DEFAULT, TEXT_ANCHOR_START);

	tempY += legendVerticalSpacer;
	PowdercloudSvg.addSvgRect(svg, (tempX + legendHorIndent + 10), tempY - 15, 20, 20, AVALANCHE_COLOUR_SIZE_LESS_THAN_EQUAL_2, 0, 0, "none", AVALANCHE_COLOUR_SIZE_LESS_THAN_EQUAL_2, AVALANCHE_PATH_FILL_OPACITY_DEFAULT);
	PowdercloudSvg.addSvgText(svg, (tempX + 25 + legendHorIndent + legendHorIndent), tempY, "size > 1 and <= 2", FONT_FAMILY_DEFAULT, FONT_SIZE_LEGEND_ITEM, TEXT_STROKE_COLOR_DEFAULT, TEXT_STROKE_WIDTH_DEFAULT, TEXT_STROKE_OPACITY_DEFAULT, TEXT_ANCHOR_START);

	tempY += legendVerticalSpacer;
	PowdercloudSvg.addSvgRect(svg, (tempX + legendHorIndent + 10), tempY - 15, 20, 20, AVALANCHE_COLOUR_SIZE_GREATER_THAN_2, 0, 0, "none", AVALANCHE_COLOUR_SIZE_GREATER_THAN_2, AVALANCHE_PATH_FILL_OPACITY_DEFAULT);
	PowdercloudSvg.addSvgText(svg, (tempX + 25 + legendHorIndent + legendHorIndent), tempY, "size > 2", FONT_FAMILY_DEFAULT, FONT_SIZE_LEGEND_ITEM, TEXT_STROKE_COLOR_DEFAULT, TEXT_STROKE_WIDTH_DEFAULT, TEXT_STROKE_OPACITY_DEFAULT, TEXT_ANCHOR_START);

	tempY += legendVerticalSpacer;
	PowdercloudSvg.addSvgText(svg, (tempX + legendHorIndent), tempY, "Weather", FONT_FAMILY_DEFAULT, FONT_SIZE_LEGEND_H2, TEXT_STROKE_COLOR_DEFAULT, TEXT_STROKE_WIDTH_DEFAULT, TEXT_STROKE_OPACITY_DEFAULT, TEXT_ANCHOR_START);

	tempY += legendVerticalSpacer;
	PowdercloudSvgRose.prototype.drawWeatherObsSymbol(svg, tempX + legendHorIndent + 15, tempY - 15);

	tempY += legendVerticalSpacer;
	PowdercloudSvg.addSvgText(svg, (tempX + legendHorIndent), tempY, "Snow Profile", FONT_FAMILY_DEFAULT, FONT_SIZE_LEGEND_H2, TEXT_STROKE_COLOR_DEFAULT, TEXT_STROKE_WIDTH_DEFAULT, TEXT_STROKE_OPACITY_DEFAULT, TEXT_ANCHOR_START);

	tempY += legendVerticalSpacer;
	PowdercloudSvgRose.prototype.drawSnowprofileObsSymbol(svg, tempX + legendHorIndent + 15, tempY - 15);

	tempY += legendVerticalSpacer;
	PowdercloudSvg.addSvgText(svg, (tempX + legendHorIndent), tempY, "Snowpack Test", FONT_FAMILY_DEFAULT, FONT_SIZE_LEGEND_H2, TEXT_STROKE_COLOR_DEFAULT, TEXT_STROKE_WIDTH_DEFAULT, TEXT_STROKE_OPACITY_DEFAULT, TEXT_ANCHOR_START);

	tempY += legendVerticalSpacer;
	PowdercloudSvgRose.prototype.drawSnowpackTestObsSymbol(svg, tempX + legendHorIndent + 15, tempY - 15);
}
/******* Draw Chart - End **************/

/******* Draw Data - Start **************/
/**
 * @param svg The svg object.
 * @param data An array of data objects.
 */
PowdercloudSvgRose.prototype.drawData = function(svg, data) {

	if (svg == null) {
		return;
	}

	// Delete everything in the current document.
	svg.clear();

	// Re-draw chart
	PowdercloudSvgRose.prototype.drawChart(svg);

	if (data != null) {

		// NOTE: we add to arrays because for the Avalanches, the order of drawing is important.
		var avalancheObs = new Array();
		var weatherObs = new Array();
		var snowpackTestObs = new Array();
		var snowprofileObs = new Array();

		for (i = 0; i < data.length; i++) {
			if (data[i] && data[i].type) {
				if (data[i].type == TYPE_AVALANCHE) {
					avalancheObs.push(data[i]);
				} else if (data[i].type == TYPE_WEATHER) {
					weatherObs.push(data[i]);
				} else if (data[i].type == TYPE_SNOWPACK_TEST) {
					snowpackTestObs.push(data[i]);
				} else if (data[i].type == TYPE_SNOWPROFILE) {
					snowprofileObs.push(data[i]);
				}
			}
		}

		PowdercloudSvgRose.prototype.drawAvalanches(svg, avalancheObs);
		PowdercloudSvgRose.prototype.drawWeatherObs(svg, weatherObs);
		PowdercloudSvgRose.prototype.drawSnowpackTestObs(svg, snowpackTestObs);
		PowdercloudSvgRose.prototype.drawSnowprofileObs(svg, snowprofileObs);
	}
}

/* ActivityRoseSVGChartHelper.java, line 549 */
PowdercloudSvgRose.prototype.drawAvalanches = function(svg, data) {
	if (data == null || data.length == 0) {
		return;
	}

	// Used for layer ordering
	var listSingleAv = new Array();
	var listNotableAv = new Array();
	var listMultipleAvSinglePoint = new Array();
	var listMultipleAvLine = new Array();
	var listMultipleAvArcLine = new Array();
	var listMultipleAvArcPath = new Array();

	for (i = 0; i < data.length; i++) {

		if (data[i].type == TYPE_AVALANCHE) {

			if( data[i].subtype == SUB_TYPE_AVALANCHE_SINGLE ) {
				listSingleAv.push(data[i]);
			}
			else if( data[i].subtype == SUB_TYPE_AVALANCHE_NOTABLE ) {
				listNotableAv.push(data[i]);
			}
			else if( data[i].subtype == SUB_TYPE_AVALANCHE_MULTIPLE ) {

				var elevationRangeStart = data[i].elevationRangeStart;
				var elevationRangeEnd = data[i].elevationRangeEnd;
				var avSizeRangeStart = data[i].avSizeRangeStart;
				var avSizeRangeEnd = data[i].avSizeRangeEnd;
				var aspectRangeStart = data[i].aspectRangeStart;
				var aspectRangeEnd = data[i].aspectRangeEnd;

				// Elevation
				if( elevationRangeStart == null || elevationRangeEnd == null ) {
					if( elevationRangeStart == null && elevationRangeEnd != null ) {
						elevationRangeStart = elevationRangeEnd;
						data[i].elevationRangeStart = elevationRangeEnd;
					}

					else if( elevationRangeStart != null && elevationRangeEnd == null ) {
						elevationRangeEnd = elevationRangeStart;
						data[i].elevationRangeEnd = elevationRangeStart;
					}
					else {
						continue;
					}
				}

				// Size (determines color)
				if( avSizeRangeStart == null || avSizeRangeEnd == null ) {
					if( avSizeRangeStart == null && avSizeRangeEnd != null ) {
						avSizeRangeStart = avSizeRangeEnd;
						data[i].avSizeRangeStart = avSizeRangeEnd;
					}
					else if( avSizeRangeStart != null && avSizeRangeEnd == null ) {
						avSizeRangeEnd = avSizeRangeStart;
						data[i].avSizeRangeEnd = avSizeRangeStart;
					}
					else {
						continue;
					}
				}

				// Aspect
				if( aspectRangeStart == null || aspectRangeEnd == null ) {
					if( aspectRangeStart == null && aspectRangeEnd != null ) {
						aspectRangeStart = aspectRangeEnd;
						data[i].aspectRangeStart = aspectRangeEnd;
					}
					else if( aspectRangeStart != null && aspectRangeEnd == null ) {
						aspectRangeEnd = aspectRangeStart;
						data[i].aspectRangeEnd = aspectRangeStart;
					}
					else {
						continue;
					}
				}

				// Determine the shape of multi-avalanche based upon data
				// Single point
				if( elevationRangeStart == elevationRangeEnd && aspectRangeStart == aspectRangeEnd ) {
					listMultipleAvSinglePoint.push(data[i]);
				}
				// Line
				else if( elevationRangeStart != elevationRangeEnd && aspectRangeStart == aspectRangeEnd ) {
					listMultipleAvLine.push(data[i]);
				}
				// Arc Line
				else if( elevationRangeStart == elevationRangeEnd && aspectRangeStart != aspectRangeEnd ) {
					listMultipleAvArcLine.push(data[i]);
				}
				// Arc Path
				else {
					listMultipleAvArcPath.push(data[i]);
				}
			}
		}
	}

	// Note: The order of these method calls determines the layer ordering on the svg
	for( i = 0; i < listMultipleAvArcPath.length; i++ ) {
		PowdercloudSvgRose.prototype.drawAvalanchMultipleArcPath(svg, listMultipleAvArcPath[i].subtype, listMultipleAvArcPath[i].triggerCode, listMultipleAvArcPath[i].aspectRangeStart, listMultipleAvArcPath[i].aspectRangeEnd, listMultipleAvArcPath[i].elevationRangeStart, listMultipleAvArcPath[i].elevationRangeEnd, listMultipleAvArcPath[i].avSizeRangeStart, listMultipleAvArcPath[i].avSizeRangeEnd);
	}

	for( i = 0; i < listMultipleAvLine.length; i++ ) {
		PowdercloudSvgRose.prototype.drawAvalanchMultipleLine(svg, listMultipleAvLine[i].subtype, listMultipleAvLine[i].triggerCode, listMultipleAvLine[i].aspectRangeStart, listMultipleAvLine[i].aspectRangeEnd, listMultipleAvLine[i].elevationRangeStart, listMultipleAvLine[i].elevationRangeEnd, listMultipleAvLine[i].avSizeRangeStart, listMultipleAvLine[i].avSizeRangeEnd);
	}

	for( i = 0; i < listMultipleAvArcLine.length; i++ ) {
		PowdercloudSvgRose.prototype.drawAvalanchMultipleArcLine(svg, listMultipleAvArcLine[i].subtype, listMultipleAvArcLine[i].triggerCode, listMultipleAvArcLine[i].aspectRangeStart, listMultipleAvArcLine[i].aspectRangeEnd, listMultipleAvArcLine[i].elevationRangeStart, listMultipleAvArcLine[i].elevationRangeEnd, listMultipleAvArcLine[i].avSizeRangeStart, listMultipleAvArcLine[i].avSizeRangeEnd);
	}

	for( i = 0; i < listNotableAv.length; i++ ) {
		PowdercloudSvgRose.prototype.drawAvalancheSingleNotable(svg, listNotableAv[i].aspectCode, listNotableAv[i].elevation, listNotableAv[i].size, listNotableAv[i].subtype, listNotableAv[i].triggerCode);
	}

	for( i = 0; i < listMultipleAvSinglePoint.length; i++ ) {
		PowdercloudSvgRose.prototype.drawAvalancheSingleNotable(svg, listMultipleAvSinglePoint[i].aspectRangeEnd, listMultipleAvSinglePoint[i].elevationRangeEnd, listMultipleAvSinglePoint[i].avSizeRangeEnd, listMultipleAvSinglePoint[i].subtype, listMultipleAvSinglePoint[i].triggerCode);
	}

	for( i = 0; i < listSingleAv.length; i++ ) {
		PowdercloudSvgRose.prototype.drawAvalancheSingleNotable(svg, listSingleAv[i].aspectCode, listSingleAv[i].elevation, listSingleAv[i].size, listSingleAv[i].subtype, listSingleAv[i].triggerCode);
	}
}

/* ActivityRoseSVGChartHelper.java, line 167 */
PowdercloudSvgRose.prototype.drawAvalancheSingleNotable = function(svg, aspectCode, elevation, size, subtype, triggerCode) {
	var avPoint = PowdercloudSvgRose.prototype.getPoint(aspectCode, elevation);
	var tooltip = aspectCode + ", " + elevation + ", " + size + ", " + triggerCode;
	PowdercloudSvgRose.prototype.drawAvalancheSymbol(svg, avPoint, size, subtype, triggerCode, tooltip);
}

/* ActivityRoseSVGChartHelper.java, line 151 */
/* Same Aspect, Different Elevation*/
PowdercloudSvgRose.prototype.drawAvalanchMultipleLine = function(svg, subtype, triggerCode, aspectRangeStart, aspectRangeEnd, elevationRangeStart, elevationRangeEnd, avSizeRangeStart, avSizeRangeEnd) {
	// Get points
	var pointStart = PowdercloudSvgRose.prototype.getPoint(aspectRangeStart, elevationRangeStart);
	var pointEnd = PowdercloudSvgRose.prototype.getPoint(aspectRangeStart, elevationRangeEnd);
	if( pointStart == null || pointEnd == null) {
		return;
	}
	var tooltip = aspectRangeStart + ", " + elevationRangeStart + " - " + elevationRangeEnd + ", " + avSizeRangeStart + ", " + triggerCode;
	PowdercloudSvg.addSvgLine(svg, pointStart.x, pointStart.y, pointEnd.x, pointEnd.y, PowdercloudSvgRose.prototype.getAvalancheSizeColor(avSizeRangeStart), AVALANCHE_LINE_STROKE_WIDTH, 1, "none", null);
}

/* ActivityRoseSVGChartHelper.java, line 25 */
/* Same Elevation, Different Aspect */
PowdercloudSvgRose.prototype.drawAvalanchMultipleArcLine = function(svg, subtype, triggerCode, aspectRangeStart, aspectRangeEnd, elevationRangeStart, elevationRangeEnd, avSizeRangeStart, avSizeRangeEnd) {
	// Get points
	var pointStartAspectStartElevation = PowdercloudSvgRose.prototype.getPoint(aspectRangeStart, elevationRangeStart);
	var pointStartAspectEndElevation = PowdercloudSvgRose.prototype.getPoint(aspectRangeStart, elevationRangeEnd);
	var pointEndAspectEndElevation = PowdercloudSvgRose.prototype.getPoint(aspectRangeEnd, elevationRangeEnd);
	var pointEndAspectStartElevation = PowdercloudSvgRose.prototype.getPoint(aspectRangeEnd, elevationRangeStart);
	if( pointStartAspectStartElevation == null || pointStartAspectEndElevation == null || pointEndAspectEndElevation == null || pointEndAspectStartElevation == null ) {
		return;
	}

	if( isDrawCornerPointsForMultipleAv ) {
		if( avSizeRangeStart != null ) {
			var tooltip1 = aspectRangeStart + ", " + elevationRangeStart + ", " + avSizeRangeStart + ", " + triggerCode;
			var tooltip2 = aspectRangeEnd + ", " + elevationRangeStart + ", " + avSizeRangeStart + ", " + triggerCode;
			PowdercloudSvgRose.prototype.drawAvalancheSymbol( svg, pointStartAspectStartElevation, avSizeRangeStart, subtype, triggerCode, tooltip1);
			PowdercloudSvgRose.prototype.drawAvalancheSymbol( svg, pointStartAspectEndElevation, avSizeRangeStart, subtype, triggerCode, tooltip2);
		}
	}

	// Determine arc
	var a = Math.abs( pointStartAspectEndElevation.x - center_x );
	var b = Math.abs( pointStartAspectEndElevation.y - center_y );
	var c = Math.sqrt( Math.pow( a, 2 ) + Math.pow( b, 2 ) );
	var arc = new Object();
	arc.xRadius = c;
	arc.yRadius = c;
	arc.xAxisRotation = 0;
	arc.largeArcFlagBinaryValue;
	arc.sweepFlagBinaryValue = true;

	// Get aspect degrees
	var startAspectDegrees = PowdercloudSvgRose.prototype.getAspectDegrees( aspectRangeStart );
	var endAspectDegrees = PowdercloudSvgRose.prototype.getAspectDegrees( aspectRangeEnd );
	if( startAspectDegrees == null || endAspectDegrees == null ) {
		return;
	}

	// Get angle between start and end aspects. Assume that arc is clockwise.
	var angle = 0;

	if( ( endAspectDegrees - startAspectDegrees ) < 0 ) {
		angle = 360 - ( Math.abs( endAspectDegrees - startAspectDegrees ) );
	}
	else {
		angle = endAspectDegrees - startAspectDegrees;
	}

	// If the angle is >= 180, the large-arc-flag is set to 0 (false)
	if( angle >= 180 ) {
		arc.largeArcFlagBinaryValue = true;
	}
	else {
		arc.largeArcFlagBinaryValue = false;
	}
	var tooltip3 = aspectRangeStart + " - " + aspectRangeEnd + ", " + elevationRangeStart + ", " + avSizeRangeStart + ", " + triggerCode;
	PowdercloudSvg.addSvgPath2Point1Arc(svg, pointStartAspectEndElevation, pointEndAspectEndElevation, arc, PowdercloudSvgRose.prototype.getAvalancheSizeColor(avSizeRangeStart), AVALANCHE_LINE_STROKE_WIDTH, "none", 0, tooltip3);
}

/* ActivityRoseSVGChartHelper.java, line 74 */
/* Different Elevation, Different Aspect */
PowdercloudSvgRose.prototype.drawAvalanchMultipleArcPath = function(svg, subtype, triggerCode, aspectRangeStart, aspectRangeEnd, elevationRangeStart, elevationRangeEnd, avSizeRangeStart, avSizeRangeEnd) {
	// Get Points
	var pointStartAspectStartElevation = PowdercloudSvgRose.prototype.getPoint(aspectRangeStart, elevationRangeStart);
	var pointStartAspectEndElevation = PowdercloudSvgRose.prototype.getPoint(aspectRangeStart, elevationRangeEnd);
	var pointEndAspectEndElevation = PowdercloudSvgRose.prototype.getPoint(aspectRangeEnd, elevationRangeEnd);
	var pointEndAspectStartElevation = PowdercloudSvgRose.prototype.getPoint(aspectRangeEnd, elevationRangeStart);
	if( pointStartAspectStartElevation == null || pointStartAspectEndElevation == null || pointEndAspectEndElevation == null || pointEndAspectStartElevation == null ) {
		return;
	}

	if( isDrawCornerPointsForMultipleAv ) {
		if( avSizeRangeStart != null ) {
			var tooltip1 = aspectRangeStart + ", " + elevationRangeStart + ", " + avSizeRangeStart + ", " + triggerCode;
			var tooltip2 = aspectRangeStart + ", " + elevationRangeEnd + ", " + avSizeRangeStart + ", " + triggerCode;
			var tooltip3 = aspectRangeEnd + ", " + elevationRangeEnd + ", " + avSizeRangeStart + ", " + triggerCode;
			var tooltip4 = aspectRangeEnd + ", " + elevationRangeStart + ", " + avSizeRangeStart + ", " + triggerCode;
			PowdercloudSvgRose.prototype.drawAvalancheSymbol( svg, pointStartAspectStartElevation, avSizeRangeStart, subtype, triggerCode, tooltip1);
			PowdercloudSvgRose.prototype.drawAvalancheSymbol( svg, pointStartAspectEndElevation, avSizeRangeStart, subtype, triggerCode, tooltip2);
			PowdercloudSvgRose.prototype.drawAvalancheSymbol( svg, pointEndAspectEndElevation, avSizeRangeStart, subtype, triggerCode, tooltip3);
			PowdercloudSvgRose.prototype.drawAvalancheSymbol( svg, pointEndAspectStartElevation, avSizeRangeStart, subtype, triggerCode, tooltip4);
		}
	}

	// Determine arc
	// Outside arc (end elevation)
	var a_outside = Math.abs( pointEndAspectEndElevation.x- center_x );
	var b_outside = Math.abs( pointEndAspectEndElevation.y - center_y );
	var c_outside = Math.sqrt( Math.pow( a_outside, 2 ) + Math.pow( b_outside, 2 ) );
	// Inside arc (start elevation)
	var a_inside = Math.abs( pointStartAspectStartElevation.x - center_x );
	var b_inside = Math.abs( pointStartAspectStartElevation.y - center_y );
	var c_inside = Math.sqrt( Math.pow( a_inside, 2 ) + Math.pow( b_inside, 2 ) );

	var outsideArc = new Object();
	outsideArc.xRadius = c_outside;
	outsideArc.yRadius = c_outside;
	outsideArc.xAxisRotation = 0;
	outsideArc.largeArcFlagBinaryValue;
	outsideArc.sweepFlagBinaryValue = true;

	var insideArc = new Object();
	insideArc.xRadius = c_inside;
	insideArc.yRadius = c_inside;
	insideArc.xAxisRotation = 0;
	insideArc.largeArcFlagBinaryValue;
	insideArc.sweepFlagBinaryValue = false;

	// Get aspect degrees
	var startAspectDegrees = PowdercloudSvgRose.prototype.getAspectDegrees( aspectRangeStart );
	var endAspectDegrees = PowdercloudSvgRose.prototype.getAspectDegrees( aspectRangeEnd );
	if( startAspectDegrees == null || endAspectDegrees == null ) {
		return;
	}

	// Get angle between start and end aspects. Assume that arc is clockwise.
	angle = 0;

	if( ( endAspectDegrees - startAspectDegrees ) < 0 ) {
		angle = 360 - ( Math.abs( endAspectDegrees - startAspectDegrees ) );
	}
	else {
		angle = endAspectDegrees - startAspectDegrees;
	}

	// If the angle is >= 180, the large-arc-flag is set to 0 (false)
	if( angle >= 180 ) {
		outsideArc.largeArcFlagBinaryValue = true;
		insideArc.largeArcFlagBinaryValue = true;
	}
	else {
		outsideArc.largeArcFlagBinaryValue = false;
		insideArc.largeArcFlagBinaryValue = false;
	}
	var tooltip5 = aspectRangeStart + " - " + aspectRangeEnd + ", " + elevationRangeStart + " - " + elevationRangeEnd + ", " + avSizeRangeStart + ", " + triggerCode;
	PowdercloudSvg.addSvgPath4Point2Arc(svg, pointStartAspectStartElevation, pointStartAspectEndElevation, pointEndAspectEndElevation, pointEndAspectStartElevation, outsideArc, insideArc, AVALANCHE_PATH_STROKE_DEFAULT, AVALANCHE_PATH_STROKE_WIDTH_DEFAULT, PowdercloudSvgRose.prototype.getAvalancheSizeColor(avSizeRangeStart), AVALANCHE_PATH_FILL_OPACITY_DEFAULT, tooltip5);
}

/* ActivityRoseSVGChartHelper.java, line 307 */
PowdercloudSvgRose.prototype.drawAvalancheSymbol = function(svg, avPoint, size, subtype, triggerCode, tooltip) {

	if (avPoint == null) {
		return;
	}

	// 1. Determine variables
	var color = PowdercloudSvgRose.prototype.getAvalancheSizeColor(size);
	var circleRadius = 1;
	var drawExclamationPoint = false;
	var exclamationPointPositionRight = true;
	var triggerCodeDistance = 0;

	if( subtype == SUB_TYPE_AVALANCHE_SINGLE || subtype == SUB_TYPE_AVALANCHE_MULTIPLE ) {
		if( size <= 1 ) {
			color = "black";
			circleRadius = 2;
			triggerCodeDistance = 4;
		}
		else if( size > 1 && size <= 2 ) {
			circleRadius = 4;
			triggerCodeDistance = 8;
		}
		else if( size > 2 && size < 4 ) {
			circleRadius = 8;
			triggerCodeDistance = 12;
		}
		else if( size >= 4 ) {
			circleRadius = 8;
			triggerCodeDistance = 12;
			drawExclamationPoint = true;
		}
	}
	else if( subtype == SUB_TYPE_AVALANCHE_NOTABLE ) {
		circleRadius = 8;
		triggerCodeDistance = 12;
		drawExclamationPoint = true;
		exclamationPointPositionRight = false;
	}
	else {
		return;
	}

	// 2. Draw circle
	PowdercloudSvg.addSvgCircle(svg, avPoint.x, avPoint.y, circleRadius, color, 0, 0, "none", color, 1, tooltip);

	// 3. Draw Trigger
	if (triggerCode != null) {
		PowdercloudSvg.addSvgText(svg, avPoint.x, avPoint.y - triggerCodeDistance, triggerCode, FONT_FAMILY_DEFAULT, FONT_SIZE_DEFAULT, TEXT_STROKE_COLOR_DEFAULT, TEXT_STROKE_WIDTH_DEFAULT, TEXT_STROKE_OPACITY_DEFAULT, TEXT_ANCHOR_MIDDLE);
	}

	// 4. Draw exclamation point
	if( drawExclamationPoint == true ) {
		exclamationPointX = avPoint.x;

		if( exclamationPointPositionRight ) {
			exclamationPointX += triggerCodeDistance;
		} else {
			exclamationPointX -= triggerCodeDistance;
		}

		PowdercloudSvg.addSvgText(svg, exclamationPointX, avPoint.y, "!", FONT_FAMILY_DEFAULT, FONT_SIZE_DEFAULT, TEXT_STROKE_COLOR_DEFAULT, TEXT_STROKE_WIDTH_DEFAULT, TEXT_STROKE_OPACITY_DEFAULT, TEXT_ANCHOR_MIDDLE);
	}
}

PowdercloudSvgRose.prototype.drawWeatherObs = function(svg, data) {

	// draw filled blue box

	if (data == null || data.length == 0) {
		return;
	}

	for (i = 0; i < data.length; i++) {

		if (data[i].type == TYPE_WEATHER) {
			var point = PowdercloudSvgRose.prototype.getPoint(data[i].aspectCode, data[i].elevation);
			var tooltip = data[i].aspectCode + ", " + data[i].elevation;
			if (point != null) {
				var tmpLeftX = point.x - (obsBoxWidthHeight/2);
				var tmpTopY = point.y - (obsBoxWidthHeight/2);
				PowdercloudSvgRose.prototype.drawWeatherObsSymbol(svg, tmpLeftX, tmpTopY);
			}
		}
	}
}

PowdercloudSvgRose.prototype.drawWeatherObsSymbol = function(svg, x, y) {
	PowdercloudSvg.addSvgRect(svg, x, y, obsBoxWidthHeight, obsBoxWidthHeight, "blue", 0, 0, "none", "blue", 1);
}

PowdercloudSvgRose.prototype.drawSnowpackTestObs = function(svg, data) {

	// draw empty bordered blue box

	if (data == null || data.length == 0) {
		return;
	}

	for (i = 0; i < data.length; i++) {

		if (data[i].type == TYPE_SNOWPACK_TEST) {
			var point = PowdercloudSvgRose.prototype.getPoint(data[i].aspectCode, data[i].elevation);
			var tooltip = data[i].aspectCode + ", " + data[i].elevation;
			if (point != null) {
				var tmpLeftX = point.x - (obsBoxWidthHeight/2);
				var tmpTopY = point.y - (obsBoxWidthHeight/2);
				PowdercloudSvgRose.prototype.drawSnowpackTestObsSymbol(svg, tmpLeftX, tmpTopY);
			}
		}
	}
}

PowdercloudSvgRose.prototype.drawSnowpackTestObsSymbol = function(svg, x, y) {
	PowdercloudSvg.addSvgRect(svg, x, y, obsBoxWidthHeight, obsBoxWidthHeight, "blue", 2, 1, "none", "white", 1);
}

PowdercloudSvgRose.prototype.drawSnowprofileObs = function(svg, data) {

	// draw empty bordered black box with three horizontal lines

	if (data == null || data.length == 0) {
		return;
	}

	for (i = 0; i < data.length; i++) {

		if (data[i].type == TYPE_SNOWPROFILE) {
			var point = PowdercloudSvgRose.prototype.getPoint(data[i].aspectCode, data[i].elevation);
			var tooltip = data[i].aspectCode + ", " + data[i].elevation;
			if (point != null) {
				var tmpLeftX = point.x - (obsBoxWidthHeight/2);
				var tmpTopY = point.y - (obsBoxWidthHeight/2);
				PowdercloudSvgRose.prototype.drawSnowprofileObsSymbol(svg, tmpLeftX, tmpTopY);
			}
		}
	}
}

PowdercloudSvgRose.prototype.drawSnowprofileObsSymbol = function(svg, x, y) {

	PowdercloudSvg.addSvgRect(svg, x, y, obsBoxWidthHeight, obsBoxWidthHeight, "black", 2, 1, "none", "white", 1);

	// Draw three horizontal lines
	var spacer = obsBoxWidthHeight/4;
	PowdercloudSvg.addSvgLine(svg, x, (y + spacer), (x + obsBoxWidthHeight), (y + spacer), "black", 1, 1, "none", null);
	PowdercloudSvg.addSvgLine(svg, x, (y + (spacer * 2)), (x + obsBoxWidthHeight), (y + (spacer * 2)), "black", 1, 1, "none", null);
	PowdercloudSvg.addSvgLine(svg, x, (y + (spacer * 3)), (x + obsBoxWidthHeight), (y + (spacer * 3)), "black", 1, 1, "none", null);
}
/******* Draw Data - End ****************/

/******* Helper Functions - Start *********/
PowdercloudSvgRose.prototype.radians = function(degrees) {
	var pi = Math.PI;
	return (degrees * (pi/180));
}

/* ActivityRoseSVGChartModel.java, line 161 */
PowdercloudSvgRose.prototype.getPoint = function(aspectCode, elevation) {

	var screenRadius = center_y - top_y;
	var screenDistanceFromEdge = (elevation * screenRadius) / (numElevationCircles * elevationInterval);
	var screenDistanceToCenter = screenRadius - screenDistanceFromEdge;
	
	var point_x;
	var point_y;

	rad = PowdercloudSvgRose.prototype.radians( PowdercloudSvgRose.prototype.getAspectDegrees(aspectCode) );
	sinValue = Math.sin( rad );
	oppositeLength = sinValue * screenDistanceToCenter;
	cosValue = Math.cos( rad );
	adjacentLength = cosValue * screenDistanceToCenter;

	switch(aspectCode)
	{
	case "N":
		point_x = center_x;
		point_y = center_y - screenDistanceToCenter;
		break;
	case "NE":
		var opp
		point_x = center_x + adjacentLength;
		point_y = center_y - oppositeLength;
		break;
	case "E":
		point_x = center_x + screenDistanceToCenter;
		point_y = center_y;
		break;
	case "SE":
		point_x = center_x - adjacentLength;
		point_y = center_y + oppositeLength;
		break;
	case "S":
		point_x = center_x;
		point_y = center_y + screenDistanceToCenter;
		break;
	case "SW":
		point_x = center_x + adjacentLength;
		point_y = center_y - oppositeLength;
		break;
	case "W":
		point_x = center_x - screenDistanceToCenter;
		point_y = center_y;
		break;
	case "NW":
		point_x = center_x - adjacentLength;
		point_y = center_y + oppositeLength;
		break;
	case "NNE":
		point_x = center_x + oppositeLength;
		point_y = center_y - adjacentLength;
		break;
	case "ENE":
		point_x = center_x + oppositeLength;
		point_y = center_y - adjacentLength;
		break;
	case "ESE":
		point_x = center_x + oppositeLength;
		point_y = center_y - adjacentLength;
		break;
	case "SSE":
		point_x = center_x + oppositeLength;
		point_y = center_y - adjacentLength;
		break;
	case "SSW":
		point_x = center_x + oppositeLength;
		point_y = center_y - adjacentLength;
		break;
	case "WSW":
		point_x = center_x + oppositeLength;
		point_y = center_y - adjacentLength;
		break;
	case "WNW":
		point_x = center_x + oppositeLength;
		point_y = center_y - adjacentLength;
		break;
	case "NNW":
		point_x = center_x + oppositeLength;
		point_y = center_y - adjacentLength;
		break;
	}

	if (point_x != null && point_y != null) {
		var point = new Object();
		point.x = point_x;
		point.y = point_y;
		return point;
	} else {
		return null;
	}
}

/* AvertChartFactory.java, line 234 */
PowdercloudSvgRose.prototype.getAspectDegrees = function(aspectCode) {

	if( aspectCode == null ) {
		return null;
	}

	var d = -1;

	switch( aspectCode ) {
		case "N" :
			d = 0;
			break;    // N
		case "NE" :
			d = 45;
			break;    // NE
		case "E" :
			d = 90;
			break;    // E
		case "SE" :
			d = 135;
			break;    // SE
		case "S" :
			d = 180;
			break;    // S
		case "SW" :
			d = 225;
			break;    // SW
		case "W" :
			d = 270;
			break;    // W
		case "NW" :
			d = 315;
			break;    // NW
		case "NNE" :
			d = 22.5;
			break;    // NNE
		case "ENE" :
			d = 67.5;
			break;    // ENE
		case "ESE" :
			d = 112.5;
			break;    // ESE
		case "SSE" :
			d = 157.5;
			break;    // SSE
		case "SSW" :
			d = 202.5;
			break;    // SSW
		case "WSW" :
			d = 247.5;
			break;    // WSW
		case "WNW" :
			d = 292.5;
			break;    // WNW
		case "NNW" :
			d = 337.5;
			break;    // NNW
		default :
			d = -1;
			break;
	}

	if( d == -1 ) {
		return null;
	}
	else {
		return d;
	}
}

/* ActivityRoseSVGChartModel.java, line 252 */
PowdercloudSvgRose.prototype.getAvalancheSizeColor = function(size) {
	if( size == null ) {
		return AVALANCHE_COLOUR_DEFAULT;
	}

	if( size <= 1 ) {
		return AVALANCHE_COLOUR_SIZE_LESS_THAN_EQUAL_1;
	}
	else if( size <= 2 ) {
		return AVALANCHE_COLOUR_SIZE_LESS_THAN_EQUAL_2;
	}
	else if( size > 2 ) {
		return AVALANCHE_COLOUR_SIZE_GREATER_THAN_2;
	}

	return AVALANCHE_COLOUR_DEFAULT;
}
/******* Helper Functions - End *********/
