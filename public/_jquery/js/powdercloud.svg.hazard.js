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
* 1. parent DIV must be at least 400x400
* 2. parent DIV must have equal height and width
*
* Data Assumptions:
* 1. trigger values range from 0 - 10 (integer values)
* 2. size values range from 0.5 - 5.5 (in steps of 0.5)
* 3. must have a min, max, expected for each trigger and size
* 4. must have a colour
*/

var canvasWidth = 0;
var canvasHeight = 0;

// Axis Styles
var axisStrokeColor = "#CCCCCC";
var axisStrokeWidth = 1;
var axisStrokeOpacity = 1;
var axisStrokeDashArray = "none"; // If dashed desired, see http://www.w3.org/TR/SVG/painting.html, ex: "5,5"

// Hazard Box Styles
var hazardBoxStrokeWidth = 3;
var hazardBoxStrokeOpacity = 1;
var hazardBoxStrokeDashArray = "none"; // If dashed desired, see http://www.w3.org/TR/SVG/painting.html, ex: "5,5"
var hazardBoxFillOpacity = 0.2;
var hazardPointSize = 4;

// Text Styles
var FONT_FAMILY_DEFAULT = "sans-serif,Helvetica,Arial";
var FONT_SIZE_DEFAULT = 9;
var TEXT_STROKE_COLOR_DEFAULT = "#BBBBBB";
var TEXT_STROKE_WIDTH_DEFAULT = 0.1;
var TEXT_STROKE_OPACITY_DEFAULT = 1;
var FONT_SIZE_LARGE = 16;
var TEXT_STROKE_WIDTH_LARGE = 0.1;
var TEXT_ANCHOR_MIDDLE = "middle";
var TEXT_ANCHOR_START = "start";
var TEXT_ANCHOR_END = "end";

// Model Variables
var borderOffset = 10; // border offset
var gridOffset = 80; // left and bottom offset of grid
var xAxisRangeChartValues = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
var xAxisRangeValues = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5];
var xAxisRangeLabels = ["", "1", "", "2", "", "3", "", "4", "", "5", ""];
var yAxisRangeChartValues = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
var yAxisRangeValues = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
var yAxisRangeLabels = ["", "Very unlikely", "", "Unlikely", "", "Possible", "", "Likely", "", "Almost certain", ""];
var xAxisTitle = "Expected Size";
var yAxisTitle = "Likelihood of Triggering";
var xAxisTitleVerOffset = 40; // Vertical offset of xAxisTitle from bottom of xAxis
var yAxisTitleHorOffset = 20; // Horizontal offset of yAxisTitle from left of canvas
var yAxisTitleVerOffset = 60; // Vertical offset of yAxisTitle from bottom of xAxis

// Global Model Members
var top_y;
var bottom_y;
var left_x;
var right_x;

// Used for animation
var drawnGroups = new Array();
var animateInterval = 1500;
var animateDuration = 2000;

function PowdercloudSvgHazard(width, height) {
	if (width) {
		canvasWidth = width;
	}
	if (height) {
		canvasHeight = height;
	}
}

/******* Draw Chart - Start **************/
PowdercloudSvgHazard.prototype.drawChart = function(svg) {

	if (svg == null) {
		return;
	}

	// Delete everything in the current document.
	svg.clear();

	// set model members
        top_y = 0 + borderOffset;
        bottom_y = canvasHeight - borderOffset - gridOffset;
        left_x = 0 + borderOffset + gridOffset;
        right_x = canvasWidth - borderOffset;

	// Draw Chart
	// X Axis Lines and Labels
        var xAxisSectionWidth = (right_x - left_x) / (xAxisRangeChartValues.length - 1);
        var tempX = left_x;
        for (i=0;i<xAxisRangeChartValues.length;i++) {
                PowdercloudSvg.addSvgLine(svg, tempX, top_y, tempX, bottom_y, axisStrokeColor, axisStrokeWidth, axisStrokeOpacity, axisStrokeDashArray);
                PowdercloudSvg.addSvgText(svg, tempX, bottom_y + 15, "" + xAxisRangeLabels[i], FONT_FAMILY_DEFAULT, FONT_SIZE_DEFAULT, TEXT_STROKE_COLOR_DEFAULT, TEXT_STROKE_WIDTH_DEFAULT, TEXT_STROKE_OPACITY_DEFAULT, TEXT_ANCHOR_MIDDLE);
                tempX += xAxisSectionWidth;
        }

        // Y Axis Lines and Labels
        var yAxisSectionHeight = (bottom_y - top_y) / (yAxisRangeChartValues.length - 1);
        var tempY = bottom_y;
        for (i=0;i<yAxisRangeChartValues.length;i++) {
                PowdercloudSvg.addSvgLine(svg, left_x, tempY, right_x, tempY, axisStrokeColor, axisStrokeWidth, axisStrokeOpacity, axisStrokeDashArray);
                PowdercloudSvg.addSvgText(svg, left_x - 5, tempY + 4, "" + yAxisRangeLabels[i], FONT_FAMILY_DEFAULT, FONT_SIZE_DEFAULT, TEXT_STROKE_COLOR_DEFAULT, TEXT_STROKE_WIDTH_DEFAULT, TEXT_STROKE_OPACITY_DEFAULT, TEXT_ANCHOR_END);
                tempY -= yAxisSectionHeight;
        }

        // X-Axis Label
        var middleX = ((right_x - left_x) / 2) + left_x;
        PowdercloudSvg.addSvgText(svg, middleX, bottom_y + xAxisTitleVerOffset, xAxisTitle, FONT_FAMILY_DEFAULT, FONT_SIZE_LARGE, TEXT_STROKE_COLOR_DEFAULT, TEXT_STROKE_WIDTH_LARGE, TEXT_STROKE_OPACITY_DEFAULT, TEXT_ANCHOR_MIDDLE);

        // Y-Axis Label
        var pathId = "yAxisLabelPath";
        var path = svg.createPath();
        svg.path( path.move(yAxisTitleHorOffset, bottom_y - yAxisTitleVerOffset).line(yAxisTitleHorOffset, top_y),{id: pathId});
        PowdercloudSvg.addSvgTextPath(svg, yAxisTitle, pathId, FONT_FAMILY_DEFAULT, FONT_SIZE_LARGE, TEXT_STROKE_COLOR_DEFAULT, TEXT_STROKE_WIDTH_LARGE, TEXT_STROKE_OPACITY_DEFAULT);
}
/******* Draw Chart - End **************/


/******* Draw Data - Start **************/
/**
 * @param svg The svg object.
 * @param data An array of data objects.
 * @param isHidden Set to true if the animate() is to be called after
 */
PowdercloudSvgHazard.prototype.drawData = function(svg, data, isHidden) {

	if (data) {

    for (i=0;i<=data.length;i++) {
		var hazard = data[i];

		if (hazard != null) {

			if (hazard.colour != null && hazard.triggerMin != null && hazard.triggerMax != null && hazard.triggerExpected != null && hazard.sizeMin != null && hazard.sizeMax != null && hazard.sizeExpected != null) {

				var topLeftPoint = this.getPoint(hazard.sizeMin, hazard.triggerMax);
				var bottomRightPoint = this.getPoint(hazard.sizeMax, hazard.triggerMin);
				var expectedPoint = this.getPoint(hazard.sizeExpected, hazard.triggerExpected);

				if (topLeftPoint != null && bottomRightPoint != null && expectedPoint != null) {

					var groupOpacity = 1;
					if (isHidden) {
							groupOpacity = 0;
						}

					var group = svg.group({'opacity': groupOpacity});

					var hazardBoxWidth = bottomRightPoint.x - topLeftPoint.x;
					var hazardBoxHeight = bottomRightPoint.y - topLeftPoint.y;

					// Draw Hazard Box
					//PowdercloudSvg.addSvgRect(svg, topLeftPoint.x, topLeftPoint.y, hazardBoxWidth, hazardBoxHeight, hazard.colour, hazardBoxStrokeWidth, hazardBoxStrokeOpacity, hazardBoxStrokeDashArray, hazard.colour, hazardBoxFillOpacity);

					// Control Points - Top to Right
					var begControlPoint1 = this.getControlPoint(true, topLeftPoint.x, expectedPoint.y, expectedPoint.x, topLeftPoint.y, bottomRightPoint.x, expectedPoint.y, expectedPoint.x, bottomRightPoint.y);
					var endControlPoint1 = this.getControlPoint(false, topLeftPoint.x, expectedPoint.y, expectedPoint.x, topLeftPoint.y, bottomRightPoint.x, expectedPoint.y, expectedPoint.x, bottomRightPoint.y);

					// Control Points - Right to Bottom
					var begControlPoint2 = this.getControlPoint(true, expectedPoint.x, topLeftPoint.y, bottomRightPoint.x, expectedPoint.y, expectedPoint.x, bottomRightPoint.y, topLeftPoint.x, expectedPoint.y);
					var endControlPoint2 = this.getControlPoint(false, expectedPoint.x, topLeftPoint.y, bottomRightPoint.x, expectedPoint.y, expectedPoint.x, bottomRightPoint.y, topLeftPoint.x, expectedPoint.y);

					// Control Points - Bottom to Left
					var begControlPoint3 = this.getControlPoint(true, bottomRightPoint.x, expectedPoint.y, expectedPoint.x, bottomRightPoint.y, topLeftPoint.x, expectedPoint.y, expectedPoint.x, topLeftPoint.y);
					var endControlPoint3 = this.getControlPoint(false, bottomRightPoint.x, expectedPoint.y, expectedPoint.x, bottomRightPoint.y, topLeftPoint.x, expectedPoint.y, expectedPoint.x, topLeftPoint.y);

					// Control Points - Left to Top
					var begControlPoint4 = this.getControlPoint(true, expectedPoint.x, bottomRightPoint.y, topLeftPoint.x, expectedPoint.y, expectedPoint.x, topLeftPoint.y, bottomRightPoint.x, expectedPoint.y);
					var endControlPoint4 = this.getControlPoint(false, expectedPoint.x, bottomRightPoint.y, topLeftPoint.x, expectedPoint.y, expectedPoint.x, topLeftPoint.y, bottomRightPoint.x, expectedPoint.y);

					// Draw Bezier Curves
					var path = svg.createPath();
					var curveSettings = {'stroke': hazard.colour, 'stroke-width': hazardBoxStrokeWidth, 'stroke-opacity': hazardBoxStrokeOpacity, 'stroke-dasharray': hazardBoxStrokeDashArray, 'fill': hazard.colour, 'fill-opacity': hazardBoxFillOpacity};
					path = svg.path(group, path.move(expectedPoint.x, topLeftPoint.y).curveC(begControlPoint1.x, begControlPoint1.y, endControlPoint1.x, endControlPoint1.y, bottomRightPoint.x, expectedPoint.y).curveC(begControlPoint2.x, begControlPoint2.y, endControlPoint2.x, endControlPoint2.y, expectedPoint.x, bottomRightPoint.y).curveC(begControlPoint3.x, begControlPoint3.y, endControlPoint3.x, endControlPoint3.y, topLeftPoint.x, expectedPoint.y).curveC(begControlPoint4.x, begControlPoint4.y, endControlPoint4.x, endControlPoint4.y, expectedPoint.x, topLeftPoint.y), curveSettings);

					// Draw Hazard Points
					var hazardPointFillOpacity = 1;
					var top = PowdercloudSvg.addSvgCircle(svg, expectedPoint.x, topLeftPoint.y, hazardPointSize, hazard.colour, 0, 0, "none", hazard.colour, hazardPointFillOpacity, null, group); // Top
					var bottom = PowdercloudSvg.addSvgCircle(svg, expectedPoint.x, bottomRightPoint.y, hazardPointSize, hazard.colour, 0, 0, "none", hazard.colour, hazardPointFillOpacity, null, group); // Bottom
					var left = PowdercloudSvg.addSvgCircle(svg, topLeftPoint.x, expectedPoint.y, hazardPointSize, hazard.colour, 0, 0, "none", hazard.colour, hazardPointFillOpacity, null, group); // Left
					var right = PowdercloudSvg.addSvgCircle(svg, bottomRightPoint.x, expectedPoint.y, hazardPointSize, hazard.colour, 0, 0, "none", hazard.colour, hazardPointFillOpacity, null, group); // Right
					var center = PowdercloudSvg.addSvgCircle(svg, expectedPoint.x, expectedPoint.y, hazardPointSize, hazard.colour, 0, 0, "none", hazard.colour, hazardPointFillOpacity, null, group); // Center

					drawnGroups.push(group);
				}
			}
		}
	}
	}
}

PowdercloudSvgHazard.prototype.getControlPoint = function(isBeginning, x0, y0, x1, y1, x2, y2, x3, y3) {

	var smooth_value = 1;

	// Assume we need to calculate the control
	// points between (x1,y1) and (x2,y2).
	// Then x0,y0 - the previous vertex,
	//      x3,y3 - the next one.

	var xc1 = (x0 + x1) / 2.0;
	var yc1 = (y0 + y1) / 2.0;
	var xc2 = (x1 + x2) / 2.0;
	var yc2 = (y1 + y2) / 2.0;
	var xc3 = (x2 + x3) / 2.0;
	var yc3 = (y2 + y3) / 2.0;

	var len1 = Math.sqrt((x1-x0) * (x1-x0) + (y1-y0) * (y1-y0));
	var len2 = Math.sqrt((x2-x1) * (x2-x1) + (y2-y1) * (y2-y1));
	var len3 = Math.sqrt((x3-x2) * (x3-x2) + (y3-y2) * (y3-y2));

	var k1 = len1 / (len1 + len2);
	var k2 = len2 / (len2 + len3);

	var xm1 = xc1 + (xc2 - xc1) * k1;
	var ym1 = yc1 + (yc2 - yc1) * k1;

	var xm2 = xc2 + (xc3 - xc2) * k2;
	var ym2 = yc2 + (yc3 - yc2) * k2;

	// Resulting control points. Here smooth_value is mentioned
	// above coefficient K whose value should be in range [0...1].
	var ctrl1_x = xm1 + (xc2 - xm1) * smooth_value + x1 - xm1;
	var ctrl1_y = ym1 + (yc2 - ym1) * smooth_value + y1 - ym1;

	var ctrl2_x = xm2 + (xc2 - xm2) * smooth_value + x2 - xm2;
	var ctrl2_y = ym2 + (yc2 - ym2) * smooth_value + y2 - ym2;


	var controlPoint = new Object();
	if (isBeginning) {
		controlPoint.x = ctrl1_x;
		controlPoint.y = ctrl1_y;
	} else {
		controlPoint.x = ctrl2_x;
	controlPoint.y = ctrl2_y;
	}
	return controlPoint;
}
/******* Draw Data - End **************/

/******* Animation - Start **************/
PowdercloudSvgHazard.prototype.animate = function(svg) {
	if (drawnGroups != null && drawnGroups.length > 0) {
		var time = animateInterval;
		for (i=0;i<drawnGroups.length;i++) {
			var group = drawnGroups[i];
			if (group != null) {
				setTimeout('PowdercloudSvgHazard.prototype.animateDrawnGroup(' + i + ')', time);
			}
			time += animateInterval;
		}
	}
}


PowdercloudSvgHazard.prototype.animateDrawnGroup = function(index) {
	var group = drawnGroups[index];
	if (group != null) {
		$(group).animate({svgOpacity: 1}, animateDuration);
	}
}
/******* Animation - End **************/


/******* Helper Functions - Start *********/
PowdercloudSvgHazard.prototype.getPoint = function(xAxisRangeValue, yAxisRangeValue) {
    if (xAxisRangeValue != null && yAxisRangeValue != null) {

            var temp_x = null;
            var xAxisSectionWidth = (right_x - left_x) / (xAxisRangeChartValues.length - 1);
            for (j=0;j<xAxisRangeValues.length;j++) {
                    if (xAxisRangeValue == xAxisRangeValues[j]) {
                            temp_x = left_x + (xAxisSectionWidth * j);
                            break;
                    }
            }

            var temp_y = null;
            var yAxisSectionHeight = (bottom_y - top_y) / (yAxisRangeChartValues.length - 1);
            for (k=0;k<yAxisRangeValues.length;k++) {
                    if (yAxisRangeValue == yAxisRangeValues[k]) {
                            temp_y = bottom_y - (yAxisSectionHeight * k);
                            break;
                    }
            }

            if (temp_x != null && temp_y != null) {
                    var point = new Object();
                    point.x = temp_x;
                    point.y = temp_y;
                    return point;
            }
    }

    return null;
}
/******* Helper Functions - End *********/
