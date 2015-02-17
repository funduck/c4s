/*
 Simple class for accessing filesystem with DataStorage.py on server side
 it can read file and write file
 */
var FileSystemAccess = Backbone.Model.extend({

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
});

/*
Collection of objects
*/
var SimpleCollection = Backbone.Collection.extend({
	clone : function(){
		var copy = new SimpleCollection([]);
		for(var i in this.models) copy.add(this.models[i].clone());
		return copy;
	},
	clone_list : function(){
		var copy = new SimpleCollection([]);
		for(var i in this.models) copy.add(this.models[i]);
		return copy;
	},
	toJSONshort : function () {
		j = "[";
		for (i in this.models) {
			if (i > 0) 
				j += this.models[i].id + " ";
		}
		j += "]";
		j = j.replace(" ]", "]");
		return j;
	}
});

/*
 * Client for DuckMessageQueue, it has two copies of workflow, 
 * event_in -> processMessage, the usual one, and
 * event_in_extra -> processMessageExtra, additional. 
 * It was added for convenience of use, because event_in is considered to be a public interface 
 * and event_in_extra is inner interface for SMQ to perform additional communication  
 */
var DuckMessageQueueClient = Backbone.Model.extend({
    queue : null,
    /*-------------*/
    // to OVERRIDE // 
    
    event_in : [], // specify event for receiving messages
    event_in_extra : [], // extra events, they can be used the same way as usual
        
    /* when message received, this method is invoked */
    processMessage : function(event, data) {
        return data;
    },
    processMessageExtra : function(event, data) {
        return data;
    },  
    /*-------------*/
    // private
    callback : function(data) {
        for (e in this.event_in) {
            if (this.event_in[e] === data.event) {           
                this.processMessage(data.event, data.data);
                return;
            }
        }
        for (e in this.event_in_extra) {
            if (this.event_in_extra[e] === data.event) {             
                this.processMessageExtra(data.event, data.data);
                return;
            }
        }       
    },
    
    // public
    connectTo : function(queue) {
        this.queue = queue;
        if (this.event_in.length == 0) {
            console.warn("DMQClient '" + this.id + "': listen to queue OFF");
        } else {
            for (e in this.event_in) {
                this.queue.register(this, "callback", this.event_in[e]);
            }
            for (e in this.event_in_extra) {
                this.queue.register(this, "callback", this.event_in_extra[e]);
            }
            console.log("DMQClient '" + this.id + "': listent to queue messages: '" + this.event_in + "'");
        }       
    },
    sendMessage : function (message, data) {
        if ($.isArray(message)) {
            for (m in message)
                this.queue.putMessage({message : message[m], data : {data : data, event : message[m]}});
        } else
            this.queue.putMessage({message : message, data : {data : data, event : message}});
    }
});

testSMQ = function(){
	console.log('test queue');
	
	queue = DuckMQ();

	var CL1 = DuckMessageQueueClient.extend({
		event_in : ['test_event']
	});
	
	var CL2 = DuckMessageQueueClient;
	
	client1 = new CL1({id :'1'});
	client2 = new CL2({id : '2'});
	
	client1.connectTo(queue);
	client2.connectTo(queue);
	
	client2.sendMessage('test_event', 'message from client2');		
	//client2.trigger('smth1', 'other test message from client2');
};