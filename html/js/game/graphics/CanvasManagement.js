function CanvasManager(){
    return json_concat(
        DuckClient(),
        {
            id : "CanvasManager",
            canvas : undefined,
            queue : DuckMQ(),
            clients : [],
            event_in : ["add","render:all"],
            /*
            returns array of clients containing this point
             */
            get_client : function(x,y){
                var point = new fabric.Point(x,y);
                var clients = this.clients;
                var ret = [];
                for (var i in clients) {
                    if (clients[i].containsPoint(point)){
                        ret.push(clients[i]);
                    }
                };
                return ret;
            },
            /*
            delivers event from clicking or something else to objects, which were under cursor
             */
            deliver_event : function(message, e){
                var clients = this.get_client(e.e.clientX, e.e.clientY);
                for (var i in clients)
                    this.sendMessage(message,{callback: "",data : {for : clients[i].id, event : e}});
            },
            processMessage : function(event, data) {
                switch (event) {
                    case "add" : this.canvas.add(data.data); break;
                    case "render:all" : this.canvas.renderAll();
                }
            },
            initialize : function(canvas_id){
                var canvas = new fabric.Canvas(canvas_id);
                var self = this;
                canvas.on({
                    'mouse:up' : function(e){self.deliver_event('mouse:up',e);},
                    'mouse:down' : function(e){self.deliver_event('mouse:up',e);}
                });
                canvas.selection = false;
                canvas.allowTouchScrolling = false;

                this.canvas = canvas;
            }
        }
    );
};

function CanvasClient(){
    return json_concat(
        DuckClient(),
        {
            id : "CanvasClient",
            event_in : ["mouse:up"],
            connected : false,
            connect_to_manager : function(manager){
                if (this.connected){
                    console.warn("CanvasClient '" + this.id + "' already connected to manager");
                    return;
                }
                manager.clients.push(this);
                this.connectTo(manager.queue);
                this.connected = true;
            },
            processMessage : function(event, data) {
                //TODO
            }
        }
    );
};