// aoj = array of jsons

// return an array of this particular field, for example
// from [{id:1, text:a, ...}, {id:2, text:b, ...}] field "text"
// it returns [a, b]
function aoj_extract(array, field) {
    var res = [];
    for (var i in array) {
        res.push(array[i][field]);
    }
    return res;
}

// returns subarray where field.value == value 
function aoj_select(array, filter) {
    var res = [];
    for (var i in array) {
        if (json_filter(array[i], filter))
            res.push(array[i]);
    }
    return res;
}

// returns true if filter matches
// it compares properties in json with same in filter, for all in filter
function json_filter(json, filter) {
    var filter_names = json_attrs(filter);
    try { 
        for (var a in filter_names) {
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
    for (var n in names) {
        j[names[n]] = j1[names[n]];
    }
    names = json_attrs(j2); 
    for (var n in names) {
        j[names[n]] = j2[names[n]];
    }
    return j;
}
