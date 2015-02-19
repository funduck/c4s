/*
 Simple class for accessing filesystem with DataStorage.py on server side
 it can read file and write file
 */
function FileSystemAccess(){
    return {
        success : "fsa:success",
        error : "fsa:error",

        request : function(data, callback) {
            // private function for any request to server
            //console.log("FileSystemAccess request:" + JSON.stringify(data));
            $.post(JSON.stringify(data), function(response) {
                //console.log("FileSystemAccess response:" + JSON.stringify(response));
                callback(response);
            }, "json").fail(function() {
                console.error("FileSystemAccess http request failed!");
            });
        },
        read : function(filename, callback_ok, callback_err) {
            if (!(filename.length > 0)) {
                console.log("FileSystemAccess: filename is incorrect: '" + filename + "'");
                this.on_read_err(filename);
            }
            var request = {
                request : "read",
                filename : filename
            };
            return this.request(request, function(resp) {
                if (resp.result == 'OK') {
                    callback_ok(resp.data);
                } else {
                    console.log("ERROR read " + filename + " failed " + resp.data);
                    callback_err(resp.data);
                }
            });

        },
        write : function(file, filename, callback_ok, callback_err) {
            // public
            // save _file to file with name _filename
            if (!(filename.length > 0)) {
                console.log("FileSystemAccess: filename is incorrect: '" + filename + "'");
                this.on_read_err(filename);
            }
            var request = {
                request : "write",
                filename : filename,
                data : file
            };
            return this.request(request, function(resp) {
                if (resp.result == 'OK') {
                    callback_ok(resp.data);
                } else {
                    console.log("ERROR write " + filename + " failed " + resp.data);
                    callback_err(resp.data);
                }
            });
        }
    };
};