
function PowdercloudSvgPieRose(width, height, _numSectors, _sectorFillUnselected, _sectorFillSelected) {
    
    this.canvasWidth = 0;
    this.canvasHeight = 0;
    this.canvasOffset = 3;
    
    this.numSectors = 8; // default
    
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
    this.sectorFillUnselected = "#FFFFFF"; // default
    this.sectorFillSelected = "#000000"; // default
    this.sectorFillOpacity = 1;
    
    this.sectors = [];
    
    if (width) {
        this.canvasWidth = width;
    }
    if (height) {
        this.canvasHeight = height;
    }
    if (_numSectors) {
        this.numSectors = _numSectors;
    }
    if (_sectorFillUnselected) {
        this.sectorFillUnselected = _sectorFillUnselected;
    }
    if (_sectorFillSelected) {
        this.sectorFillSelected = _sectorFillSelected;
    }
}

/******* Draw Chart - Start **************/

/**
 * selectedSectors is an Array of ints, example: [0, 3]. 
 */
PowdercloudSvgPieRose.prototype.drawChart = function(svg, selectedSectors) {
    
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

    // Draw sectors
    this.drawSectors(svg, selectedSectors);
}

PowdercloudSvgPieRose.prototype.drawSectors = function(svg, selectedSectors) {
    
    this.sectors = []; // initialize
    
    var data = [];
    for(var i = 0; i < this.numSectors; i++) {
        data[i] = 1; // add sectors are equal size
    }
    
    var cx = this.center_x;
    var cy = this.center_y;
    var r = this.center_y - this.top_y;
    
    // Add up the data values so we know how big the pie is
    var total = 0;
    for(var i = 0; i < data.length; i++) total += data[i];
    
    // Now figure out how big each slice of pie is.  Angles in radians.
    var angles = [];
    for(var i = 0; i < data.length; i++) {
        angles[i] = data[i]/total*Math.PI*2;
    }

    // Loop through each slice of pie.
    //startangle = 0;
    startangle = 0 - (angles[0] / 2); // Start offset
    for(var i = 0; i < data.length; i++) {
        
        // Pre-fill sector
        var isSectorSelected = false;
        if (selectedSectors != undefined && selectedSectors != null && selectedSectors.length > 0) {
            for(var j = 0; j < selectedSectors.length; j++) {
                var selectedSectorIndex = selectedSectors[j];
                if (selectedSectorIndex == i) {
                    isSectorSelected = true;
                    break;
                }
            }
        }
        var fill = this.sectorFillUnselected;
        if (isSectorSelected) {
            fill = this.sectorFillSelected;
        }
        
        // This is where the wedge ends
        var endangle = startangle + angles[i];

        // Compute the two points where our wedge intersects the circle
        // These formulas are chosen so that an angle of 0 is at 12 o'clock
        // and positive angles increase clockwise.
        var x1 = cx + r * Math.sin(startangle);
        var y1 = cy - r * Math.cos(startangle);
        var x2 = cx + r * Math.sin(endangle);
        var y2 = cy - r * Math.cos(endangle);
        
        // This is a flag for angles larger than than a half circle
        var big = 0;
        if (endangle - startangle > Math.PI) big = 1;
        
        // draw path
        var path = svg.createPath(); 
        var sector = svg.path(path.move(cx, cy).line(x1, y1).arc(r, r, 0, big, 1, x2, y2).close(),{'onclick': 'sector_click(evt)', 'fill': fill, 'fill-opacity': this.sectorFillOpacity, 'stroke': this.lineStrokeColor, 'stroke-width': this.lineStrokeWidth});		
        this.sectors.push(sector);
        
        // The next wedge begins where this one ends
        startangle = endangle;
    }
    
    // Add script
    svg.script("function sector_click(evt) {\n  var sector = evt.target;\n  var currentFill = sector.getAttribute(\"fill\");\n  if (currentFill == \"" + this.sectorFillUnselected + "\"){\n    sector.setAttribute(\"fill\",  \"" + this.sectorFillSelected + "\");\n  }else{\n     sector.setAttribute(\"fill\", \"" + this.sectorFillUnselected + "\");\n}}", "text/ecmascript"); 
}
/******* Draw Chart - End **************/

/******* Helper Functions - Start *********/
/**
 * @param svg The svg object.
 * @param data An array of data selected sectors (int value 0 - 7).
 */
PowdercloudSvgPieRose.prototype.getSelectedSectors = function() {
    var selectedSectors = [];
    
    if (this.sectors != null) {
        for(var i = 0; i < this.sectors.length; i++) {
            var s = this.sectors[i];
            var currentFill = s.getAttribute("fill");
            if (currentFill == this.sectorFillSelected) {
                selectedSectors.push(i);
            }
        }
    }
    
    return selectedSectors;
}
/******* Helper Functions - End *********/