/*
 * This module knows how exactly character is organized
 * 
 * ls: - returns array of IDs
 * get: - returns array of objects 
 */

var ModuleCharacter = DuckMessageQueueClient.extend({
    
    id : "ModuleCharacter",
    event_in : ["ch:set", "ch:ls:actions", "ch:get:action", ],
    event_out : "module:" + this.id,
    
    character : null,

    initialize : function () {
        this.event_out = "module:" + this.id;
    },
    
    processMessage : function (event, data) {
        switch (event) {
            case "ch:set" : // data == {data, callback} 
                console.log("ModuleCharacter " + this.id + ": set character " + data.data.id);
                this.character = data.data;
                if (data.callback)
		    		this.sendMessage(data.callback, "OK");break;
                break;
            case "ch:ls:actions" : // data == {callback, filter = {<name>:<value>}}
                this.sendMessage(data.callback, {data : aoj_extract(aoj_select(this.character.avacts, data.filter), "id")}); break;  
            case "ch:get:action" : // data == {callback, filter = {<name>:<value>}}
                this.sendMessage(data.callback, {data : aoj_select(this.character.avacts, data.filter)[0]}); break; 
            default : 
                console.warning(this.id + ": we are not supposed to receive this message"); return;
        }
    },
    printHelp : function () {
        console.log("ModuleCharacter " + this.id + ": commands are " + this.event_in);
    }
    
});
