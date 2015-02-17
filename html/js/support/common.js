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
}

// aoj = array of jsons

// return an array of this particular field, for example
// from [{id:1, text:a, ...}, {id:2, text:b, ...}] field "text"
// it returns [a, b]
function aoj_extract(array, field) {
    var res = [];
    for (i in array) {
        res.push(array[i][field]);
    }
    return res;
}

// returns subarray where field.value == value 
function aoj_select(array, filter) {
    var res = [];
    for (i in array) {
        if (json_filter(array[i], filter))
            res.push(array[i]);
    }
    return res;
}

// returns boolean
// it compares properties in json with same in filter, for all in filter
function json_filter(json, filter) {    
    var filter_names = json_attrs(filter);
    try { 
        for (a in filter_names) {
            if (json[filter_names[a]] !== filter[filter_names[a]])
                return false;            
        }
        return true;
    } catch (e) {
        console.log(e.getMessage());
        return false;
    }
}

function json_attrs(json) {
    return Object.getOwnPropertyNames(json);
}

function json_concat(j1, j2) {
    var j = {};
    var names = json_attrs(j1); 
    for (n in names) {
        j[names[n]] = j1[names[n]];
    }
    names = json_attrs(j2); 
    for (n in names) {
        j[names[n]] = j2[names[n]];
    }
    return j;
}

function log(text){
	if(!logging_silent){
		console.log(text);
	}
}

var Sequence = function(_v){
	var value = _v;
	this.nextval = function(){
		value = value + 1;
		return value; 
	};
};

/*
 * DuckMQ is a factory for message queue system
 */
function DuckMQ(attributes) {
    return json_concat({
        messages : [], // queue of messages
        running : false,
        clients : [],  // registered clients in array of {client,callback,message}
        register : function(client, callback, message){
            this.clients.push({client : client, callback : callback, message : message});
        },
        putMessage : function(message){
            var self = this;
            if (this.running) {
                this.messages.push(message);
                setTimeout(function(){
                    self.processMessages();
                },0);
                //console.log("DMQ putMessage OK");
            }else{
                console.warn("DuckMQ is not running!");
            }
        },
        processMessages : function(message){
            m = this.messages.shift();
            while (m != null) {                
                var clients = aoj_select(this.clients, {message : m.message});
                for (c in clients) {
                    var client = clients[c].client;
                    var callback = clients[c].callback;
                    client[callback](m.data);
                }                
                m = this.messages.shift();
            }
        },
        start : function(){
            this.running = true;
            console.info('DuckMQ start');
        },
        stop : function() {
            this.running = false;
            console.info('DuckMQ stop');
        }
    }, attributes);
};