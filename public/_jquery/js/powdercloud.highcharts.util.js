function PowderCloudHighChartsUtil() {}

PowderCloudHighChartsUtil.prototype.generateViewableStartDateUTC = function(_startDate){
    var viewableStartDate = new Date(_startDate);
    viewableStartDate.setDate(viewableStartDate.getDate() - 1); // NOTE: use day before desired start date, or else data points/bars/etc get cut-off if it on the first date
    var viewableStartDateUTC = Date.UTC(viewableStartDate.getFullYear(), viewableStartDate.getMonth(), viewableStartDate.getDate());
    return viewableStartDateUTC;
}

PowderCloudHighChartsUtil.prototype.generateViewableEndDateUTC = function(_endDate){
    var viewableEndDate = new Date(_endDate);
    viewableEndDate.setDate(viewableEndDate.getDate() + 1); // NOTE: use day before desired start date, or else data points/bars/etc get cut-off if it on the first date
    var viewableEndDateUTC = Date.UTC(viewableEndDate.getFullYear(), viewableEndDate.getMonth(), viewableEndDate.getDate());
    return viewableEndDateUTC;
}

PowderCloudHighChartsUtil.prototype.getSeriesColorScheme = function(seriesIndex){
    var colorSchemes = ['#81ced2', '#B5CACC'];  // light blue, grey-blue
    if (seriesIndex != null && seriesIndex < colorSchemes.length) {
        return colorSchemes[seriesIndex];
    } else {
        return null;
    }
}

PowderCloudHighChartsUtil.prototype.getTextColor = function(){
    return '#999999';
}

