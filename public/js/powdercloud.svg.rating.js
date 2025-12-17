
/**
 * categoriesArray is an array of strings, example: ["Alpine", "Treeline", "Below Treeline"]
 * daysArray is an array of ints, example: [0, 2, 3, 4, 5, 6, 7, 8]
 */
function PowdercloudSvgRating(width, height, categoriesArray, daysArray, _title, _categoryLabelWidth) {

    this.canvasWidth = 0;
    this.canvasHeight = 0;
    this.canvasOffset = 5;
	this.gutter = 5;

	this.top_y = 0;
    this.bottom_y = 0;
    this.left_x = 0;
    this.right_x = 0;
    this.center_x = 0;
    this.center_y = 0;

	this.lineStrokeColor = "#BBBBBB";
    this.lineStrokeWidth = 1;
    this.lineStrokeOpacity = 1;
    this.lineStrokeDashArray = "none"; // If dashed desired, see http://www.w3.org/TR/SVG/painting.html, ex: "5,5"
	this.fillOpacity = 0.8;

	this.FONT_FAMILY_DEFAULT = "sans-serif,Helvetica,Arial";
	this.FONT_SIZE_DEFAULT = 12;
	this.FONT_SIZE_TITLE = 16;
	this.TEXT_STROKE_COLOR_DEFAULT = "#BBBBBB";
	this.TEXT_STROKE_WIDTH_DEFAULT = 0.1;
	this.TEXT_STROKE_OPACITY_DEFAULT = 1;
	this.TEXT_ANCHOR_MIDDLE = "middle";
	this.TEXT_ANCHOR_START = "start";
	this.TEXT_ANCHOR_END = "end";

	this.yLabelWidth = 80;
	this.xLabelHeight = 20;
	this.titleHeight = 30;
	this.categories = [];
	this.days = [];
	this.title = "";

    if (width) {
        this.canvasWidth = width;
    }
    if (height) {
        this.canvasHeight = height;
    }
	if (categoriesArray) {
        this.categories = categoriesArray;
    }
	if (daysArray) {
        this.days = daysArray;
    }
	if (_title) {
        this.title = _title;
    }
    if (_categoryLabelWidth) {
        this.yLabelWidth = _categoryLabelWidth;
    }
}

/**
 * data is an Array of objects in following format:
 *     {category: 0, date: [date], ratingCode: "VP"}
 * where category is an int, this is the index of the category, 0 is at top.
 * where day is an int, this is the index of the day, 0 is the first day
 * where ratingcode is a string, acceptable values are VP,P,F,G,VG
 * if data is null, nothing if filled.
 *
 * [optional, overrides daysArray set in constructor] rangeStartDate and rangeEndDate
 */
PowdercloudSvgRating.prototype.drawChart = function(svg, data, rangeStartDate, rangeEndDate) {

	if (svg == null) {
		return;
	}

	// Delete everything in the current document.
	svg.clear();

	if (this.categories && this.days) {

	    if (rangeStartDate && rangeEndDate) {
		this.days = this.generateDaysArray(rangeStartDate, rangeEndDate);
	    }

	    this.drawYLabels(svg);
	    this.drawXLabels(svg);
	    this.drawTitle(svg, this.title);
	    this.drawStabilityGraph(svg, data, rangeStartDate, rangeEndDate);
	}
}

PowdercloudSvgRating.prototype.drawYLabels = function(svg) {

	var x = 0 + this.canvasOffset + this.yLabelWidth;
	var topY = 0 + this.canvasOffset + this.titleHeight + this.gutter;
	var bottomY = this.canvasHeight - this.canvasOffset - this.xLabelHeight - this.gutter;
	var cellHeight = (bottomY - topY)/this.categories.length;
	var y = topY + (cellHeight/2);
	for (var i = 0; i < this.categories.length; i++) {

		PowdercloudSvg.addSvgText(svg, x, y, this.categories[i] + "", this.FONT_FAMILY_DEFAULT, this.FONT_SIZE_DEFAULT, this.TEXT_STROKE_COLOR_DEFAULT, this.TEXT_STROKE_WIDTH_DEFAULT, this.TEXT_STROKE_OPACITY_DEFAULT, this.TEXT_ANCHOR_END, null);

		y += cellHeight;
	}
}

PowdercloudSvgRating.prototype.drawXLabels = function(svg) {

	var y = this.canvasHeight - this.canvasOffset;
	var rightX = this.canvasWidth - this.canvasOffset - this.gutter;
	var leftX = 0 + this.canvasOffset + this.yLabelWidth + this.gutter;
	var cellWidth = (rightX - leftX)/this.days.length;
	var x = 0 + this.canvasOffset + this.yLabelWidth + this.gutter + (cellWidth/2);
	for (var i = 0; i < this.days.length; i++) {

		PowdercloudSvg.addSvgText(svg, x, y, this.days[i] + "", this.FONT_FAMILY_DEFAULT, this.FONT_SIZE_DEFAULT, this.TEXT_STROKE_COLOR_DEFAULT, this.TEXT_STROKE_WIDTH_DEFAULT, this.TEXT_STROKE_OPACITY_DEFAULT, this.TEXT_ANCHOR_MIDDLE, null);

		x += cellWidth;
	}
}

PowdercloudSvgRating.prototype.drawTitle = function(svg, title) {

	var y = 0 + this.canvasOffset + this.titleHeight;
	var rightX = this.canvasWidth - this.canvasOffset - this.gutter;
	var leftX = 0 + this.canvasOffset + this.yLabelWidth + this.gutter;
	var middleX = leftX + (rightX - leftX)/2;

	PowdercloudSvg.addSvgText(svg, middleX, y, title + "", this.FONT_FAMILY_DEFAULT, this.FONT_SIZE_TITLE, this.TEXT_STROKE_COLOR_DEFAULT, this.TEXT_STROKE_WIDTH_DEFAULT, this.TEXT_STROKE_OPACITY_DEFAULT, this.TEXT_ANCHOR_MIDDLE, null);
}


PowdercloudSvgRating.prototype.drawStabilityGraph = function(svg, data, rangeStartDate, rangeEndDate) {

	var leftX = 0 + this.canvasOffset + this.yLabelWidth + this.gutter;
	var topY = 0 + this.canvasOffset + this.titleHeight + this.gutter;
	var rightX = this.canvasWidth - this.canvasOffset - this.gutter;
	var bottomY = this.canvasHeight - this.canvasOffset - this.xLabelHeight - this.gutter;
	var parentGrid = PowdercloudSvg.addSvgRect(svg, leftX, topY, rightX - leftX, bottomY - topY, this.lineStrokeColor, this.lineStrokeWidth, this.lineStrokeOpacity, this.lineStrokeDashArray, "none", 0, null);

	var cellWidth = (rightX - leftX)/this.days.length;
	var cellHeight = (bottomY - topY)/this.categories.length;
	var cellLeftX = leftX;
	var cellTopY = topY;
	for (var i = 0; i < this.categories.length; i++) {

		for (var j = 0; j < this.days.length; j++) {

			// Get rating fill
			var fill = "none";
			var ratingFill = this.getRatingFill(data, i, j, rangeStartDate, rangeEndDate);
			if (ratingFill != null) {
				fill = ratingFill;
			}

			var cell = PowdercloudSvg.addSvgRect(svg, cellLeftX, cellTopY, cellWidth, cellHeight, this.lineStrokeColor, this.lineStrokeWidth, this.lineStrokeOpacity, this.lineStrokeDashArray, fill, this.fillOpacity, null);

			cellLeftX += cellWidth;
		}

		cellLeftX = leftX;
		cellTopY += cellHeight;
	}
}


PowdercloudSvgRating.prototype.getRatingFill = function(data, categoriesIndex, daysIndex, rangeStartDate, rangeEndDate) {

	var ratingFill = null;

	if (data) {
		for (var k = 0; k < data.length; k++) {
			var record = data[k];
			if (record.hasOwnProperty('category') && record.hasOwnProperty('date') && record.hasOwnProperty('ratingCode')) {
				var category = record.category;
				var date = record.date;
				var ratingCode = record.ratingCode;
				if (date) {
				    var recordDayIndex = this.getDayIndex(this.days, rangeStartDate, rangeEndDate, date);
				    if (recordDayIndex) {
					if (category == categoriesIndex && recordDayIndex == daysIndex) {
						ratingFill = this.getFillColor(ratingCode);
						if (ratingFill != null) {
							break;
						}
					}
				    }
				}
			}
		}
	}

	return ratingFill;
}

PowdercloudSvgRating.prototype.getFillColor = function(ratingCode) {
	var fillColor = null;
	switch( ratingCode ) {

		// Stability Ratings
		case "VP" :
			fillColor = "#FF0000"; // VP
			break;
		case "P" :
			fillColor = "#FF9900"; // P
			break;
		case "F" :
			fillColor = "#FFFF00"; // F
			break;
		case "G" :
			fillColor = "#00FF00"; // G
			break;
		case "VG" :
			fillColor = "#009900"; // VG
			break;

		// Danger Ratings http://alt-web.com/WebColorAssist.shtml
		case "X" :
			fillColor = "#000000"; // X is black 000000, was FF0000
			break;
		case "H" :
			fillColor = "#FF0000"; // H is red  FF0000 was FF9900
			break;
		case "C" :
			fillColor = "#FF9900"; // C is orange FF9900, was FFFF00
			break;
		case "M" :
			fillColor = "#FFFF00"; // M is yellow FFFF00, was 00FF00
			break;
		case "L" :
			fillColor = "#00FF00"; // L is green 00FF00, was 009900
			break;
		case "NRI" :
			fillColor = "#C6C2C2"; // L is grey C6C2C2
			break;
		case "NRS" :
			fillColor = "#C6C2C2"; // L is grey
			break;
		case "NRC" :
			fillColor = "#C6C2C2"; // L is grey
			break;
		default :
			fillColor = "#FFFFFF"; // unrated is white FFFFFF
			break;
	}
	return fillColor;
}

/**
 * Returns number of days in a month
 * @param month (0 - 11)
 */
PowdercloudSvgRating.prototype.daysInMonth = function(month,year) {
    var m = [31,28,31,30,31,30,31,31,30,31,30,31];
    if (month != 1) return m[month];
    if (year%4 != 0) return m[1];
    if (year%100 == 0 && year%400 != 0) return m[1];
    return m[1] + 1;
}

/**
 * Creates a Days Array based upon a start and end date
 * ex: [1,2,3,4] or [29,30,31,1,2]
 */
PowdercloudSvgRating.prototype.generateDaysArray = function(rangeStartDate, rangeEndDate) {
    var daysArray = new Array();
    if (rangeStartDate && rangeEndDate) {
        var _startDate = new Date(rangeStartDate.getFullYear(), rangeStartDate.getMonth(), rangeStartDate.getDate(), 0, 0, 0, 0);
	var _endDate = new Date(rangeEndDate.getFullYear(), rangeEndDate.getMonth(), rangeEndDate.getDate(), 0, 0, 0, 0);
        var startDateTime = _startDate.getTime();
        var endDateTime = _endDate.getTime();
        var difference_ms = Math.abs(endDateTime - startDateTime);
        var ONE_DAY = 1000 * 60 * 60 * 24;
        var numDays = Math.round(difference_ms/ONE_DAY);

        var day = _startDate.getDate();
        var month = _startDate.getMonth();
        var year = _startDate.getFullYear();
        for (var i = 0; i <= numDays; i++) {
            daysArray.push(day);

            day++;
            var numDaysInMonth = this.daysInMonth(month, year);
            if (day > numDaysInMonth) {
                day = 1;
                month++;
                if (month > 11) {
                    month = 0;
                    year++;
                }
            }
        }
    }
    return daysArray;
}

/**
 * Returns the index of the date based upon the daysArray and the start/end date range.
 */
PowdercloudSvgRating.prototype.getDayIndex = function(daysArray, rangeStartDate, rangeEndDate, date) {
    var dayIndex = null;

    if (daysArray && rangeStartDate && rangeEndDate && date) {

        var day = rangeStartDate.getDate();
        var month = rangeStartDate.getMonth();
        var year = rangeStartDate.getFullYear();

        for (var j = 0; j <= daysArray.length; j++) {

            if (day == date.getDate() && month == date.getMonth() && year == date.getFullYear()) {
                return j;
            }

            day++;
            var numDaysInMonth = this.daysInMonth(month, year);
            if (day > numDaysInMonth) {
                day = 1;
                month++;
                if (month > 11) {
                    month = 0;
                    year++;
                }
            }

        }

    }

    return dayIndex;
}
