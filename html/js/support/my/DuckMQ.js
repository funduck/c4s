/*
 * DuckMQ is a factory for message queue system
 */
function DuckMQ() {
    return {
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
    };
};

function DuckClient(){
  return {
      queue : undefined,

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
              console.warn("DuckClient '" + this.id + "': listen to queue OFF");
          } else {
              for (e in this.event_in) {
                  this.queue.register(this, "callback", this.event_in[e]);
              }
              for (e in this.event_in_extra) {
                  this.queue.register(this, "callback", this.event_in_extra[e]);
              }
              console.log("DuckClient '" + this.id + "': listen to queue messages: '" + this.event_in + "'");
          }
      },
      sendMessage : function (message, data) {
          if ($.isArray(message)) {
              for (m in message)
                  this.queue.putMessage({message : message[m], data : {data : data, event : message[m]}});
          } else
              this.queue.putMessage({message : message, data : {data : data, event : message}});
      },
      printHelp : function() {
          console.log("DuckClient '" + this.id + "' accepts messages: " + this.event_in);
      }
  };
};