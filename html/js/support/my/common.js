/* 
 * filling template with data, while logging errors
 */
function _template(_tmpl, _args){
	if (_args == null || _tmpl == null) return null;
	var ret = null;
	try{
		ret =  _.template($(_tmpl).html())(_args);
	}catch(e){
		console.log('INFO _template( "'+_tmpl+'" = {'+$(_tmpl).html()+'} '+JSON.stringify(_args)+') exception: '+e);
		return null;
	} 
	return ret;
};

function clone(obj) {
    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        var copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        var copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        var copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
};

function log(text){
	if(!logging_silent){
		console.log(text);
	}
};

function Sequence(_v){
    return {
        value : _v,
        nextval : function() {
                  this.value++;
                  return this.value;
                  }
        };
};

function round(x){
    if (x % 1 >= 0.5) return x - x % 1 + 1;
    return x - x % 1;
};

function abs(x){
    if (x < 0)
        return -x;
    return x;
};
