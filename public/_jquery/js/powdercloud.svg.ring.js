
function PowdercloudSvgRing(width, height, _numRings, _ringFillUnselected, _ringFillSelected) {
    
    this.canvasWidth = 0;
    this.canvasHeight = 0;
    this.canvasOffset = 3;
    
    this.numRings = 3; // default
    
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
    this.ringFillUnselected = "#FFFFFF"; // default
    this.ringFillSelected = "#000000"; // default
    this.ringFillOpacity = 1;
    
    this.rings = [];
    
    if (width) {
        this.canvasWidth = width;
    }
    if (height) {
        this.canvasHeight = height;
    }
    if (_numRings) {
        this.numRings = _numRings;
    }
    if (_ringFillUnselected) {
        this.ringFillUnselected = _ringFillUnselected;
    }
    if (_ringFillSelected) {
        this.ringFillSelected = _ringFillSelected;
    }
}

/******* Draw Chart - Start **************/

/**
 * selectedRings is an Array of ints, example: [0, 4, 7]. 
 */
PowdercloudSvgRing.prototype.drawChart = function(svg, selectedRings) {
    
    if (svg == null) {
	    return;
    }
    	
    // Delete everything in the current document.
    svg.clear();
	
    // Set Model
    this.top_y = 0 + this.canvasOffset;
    this.bottom_y = this.canvasHeight - this.canvasOffset;
    this.left_x = 0 + this.canvasOffset;
    this.right_x = this.canvasWidth - this.canvasOffset;
    this.center_x = this.canvasWidth/2;
    this.center_y = this.canvasHeight/2;
	
    // Draw rings
    this.drawRings(svg, selectedRings);
}

PowdercloudSvgRing.prototype.drawRings = function(svg, selectedRings) {
    
    this.rings = []; // initialize
    
    var radius_max = (this.bottom_y - this.top_y)/2;
    var circleInterval = radius_max/this.numRings;
    for (var i = this.numRings; i >= 1; i--) {
        
        // Pre-fill ring
        var isRingSelected = false;
        if (selectedRings != undefined && selectedRings != null && selectedRings.length > 0) {
            for(var j = 0; j < selectedRings.length; j++) {
                var selectedRingIndex = selectedRings[j];
                if (selectedRingIndex == (i - 1)) {
                    isRingSelected = true;
                    break;
                }
            }
        }
        var fill = this.ringFillUnselected;
        if (isRingSelected) {
            fill = this.ringFillSelected;
        }
        
        // Draw ring
        var ring = svg.circle(this.center_x, this.center_y, circleInterval * i, {'onclick': 'ring_click(evt)', 'stroke': this.lineStrokeColor, 'stroke-width': this.lineStrokeWidth, 'stroke-opacity': this.lineStrokeOpacity, 'stroke-dasharray': this.lineStrokeDashArray, 'fill': fill, 'fill-opacity': this.ringFillOpacity});
        this.rings.push(ring);
    }
    
    // Add script
    svg.script("function ring_click(evt) {\n  var ring = evt.target;\n  var currentFill = ring.getAttribute(\"fill\");\n  if (currentFill == \"" + this.ringFillUnselected + "\"){\n    ring.setAttribute(\"fill\",  \"" + this.ringFillSelected + "\");\n  }else{\n     ring.setAttribute(\"fill\", \"" + this.ringFillUnselected + "\");\n}}", "text/ecmascript"); 
}
/******* Draw Chart - End **************/

/******* Helper Functions - Start *********/
/**
 * @param svg The svg object.
 * @param data An array of data selected rings (int value 0 - 1).
 */
PowdercloudSvgRing.prototype.getSelectedRings = function() {
    var selectedRings = [];
    
    if (this.rings != null) {
        for(var i = 0; i < this.rings.length; i++) {
            var r = this.rings[i];
            var currentFill = r.getAttribute("fill");
            if (currentFill == this.ringFillSelected) {
                selectedRings.push(i);
            }
        }
    }
    
    return selectedRings;
}
/******* Helper Functions - End *********/