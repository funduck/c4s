function test_smq() { 
    var smq = DuckMessageQueue({id : "dmq"});
    /*{
        messages : [],
        buffer : null,
        running : false,
        clients : [],
        register : function(client, callback, message){
            this.clients.push({client : client, callback : callback, message : message});
        },
        put : function(message){
            var self = this;
            if (this.running) {
                this.messages.push(message);
                setTimeout(function(){
                    self.processMessages();
                },0);
                console.log("put OK");
            }else{
                console.log("put ERR");
            }
        },
        processMessages : function(message){
            m = this.messages.pop();
            while (m != null) {                
                console.log('processing: ' + JSON.stringify(m));
                var clients = aoj_select(this.clients, {message : m.message});
                for (c in clients) {
                    var client = clients[c].client;
                    var callback = clients[c].callback;
                    client[callback](m.data);
                }                
                m = this.messages.pop();
            }
            console.log('processing: done');
        },
        start : function(){
            var self = this;
            this.running = true;
            console.log('start');
        },
        stop : function() {
            console.log('stop');
            this.running = false;
        }
    };*/
    
    smq.start();
    
    var c1 = new DuckMessageQueueClient({id : "c1"});
    
    c1.event_in = ["test"];
    c1.processMessage = function(event, data) {
        console.log("callback called: " + event + " " + data);
    };
    
    c1.connectTo(smq);
    
    c1.sendMessage("test", "test1 message");
    
};