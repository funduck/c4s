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