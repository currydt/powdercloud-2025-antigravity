function PCLocal(){
}
PCLocal.prototype.getText = function(key){
	var suffix = 'M' // default to metric
	if(!isOperationMetric){
		suffix = 'I';
	}

	if(PC_STR.hasOwnProperty(key+ '.'+suffix)){

		return PC_STR[key+ '.'+suffix];
	}	else if(PC_STR.hasOwnProperty(key)){
		return PC_STR[key];
	}	else {
		return "No Field : " + key;
	}
}
var pcLocal = new PCLocal();

//function PCLocal(){
//	}
//
//PCLocal.prototype.getText = function(key){
//
//	console.info(key);
//
//	if(PC_STR.hasOwnProperty(key)){
//			return PC_STR[key];
//		}
//	else {
//		return "No Field : " + key;
//		}
//	}
//
//var pcLocal = new PCLocal();
