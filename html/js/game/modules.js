function ModuleHelp(){
    return json_concat(DuckClient(), {
        id : "ModuleHelp",
        event_in : ["help", "print", "print:json"],

        modules : [],
        include : function (module) {
            this.modules.push(module);
        },
        processMessage : function (event, data) {
            switch (event) {
                case "help" : this.printHelp(data); break;
                case "print" :
                    if (data.data)
                        console.info(data.data);
                    else
                        console.info(data);
                    break;
                case "print:json" : console.info(JSON.stringify(data.data)); break;
                default : console.warning(this.id + ": we are not supposed to receive this message"); return;
            }
        },
        printHelp : function (module_id) {
            if (!module_id)
                console.log("HELP knows about modules: " + aoj_extract(this.modules, "id") + ". type 'help module_name' to get special info.");
            else {
                console.log(aoj_select(this.modules, {id: module_id}));
                aoj_select(this.modules, {id: module_id})[0].printHelp();
            }
        }
    });
};

function ModuleTest () {
    return json_concat(DuckClient(), {
        id: "ModuleTest",
        event_in: ["test", "test:restart"],

        tests: [],
        index: 0,
        buffer: null,
        add: function (test) {
            this.tests.push(test);
        },
        processMessage: function (event, data) {
            switch (event) {
                case "test" :
                    this.run(data);
                    break;
                case "test:restart" :
                    this.restart();
                    break;
                default :
                    console.warning(this.id + ": we are not supposed to receive this message");
                    return;
            }
        },
        run: function (data) {
            //console.log("ModuleTest running " + this.index + " test");
            //console.log(this.tests[this.index]);
            this.tests[this.index](data);
            this.index++;
        },
        restart: function () {
            this.index = 0;
        },
        printHelp: function (module_id) {
            console.log("ModuleTest " + this.id + ": to run test module, use " + this.event_in + " and number of test");
        }
    });
};

/*
This module contains all objects, and provides access to them 
in order to not to use objects, but their IDs in communication between modules,
it also enables console input of commands

load|save - commands for all database

get - returns one object 
ls  - array of IDs

return is {data : <object>}
*/

function ModuleObjectStorage () {
    return json_concat(DuckClient(), {
        id: "ModuleObjectStorage",
        event_in: ["os:load", "os:save", "os:get", "os:insert", "os:remove", "os:ls"],

        io: FileSystemAccess(),
        objects: TAFFY(), // small JS database

        processMessage: function (event, data) {
            switch (event) {
                case "os:load" :
                    this.load();
                    if (data.callback)
                        this.sendMessage(data.callback, "OK");
                    break;
                case "os:save" :
                    this.save();
                    if (data.callback)
                        this.sendMessage(data.callback, "OK");
                    break;
                case "os:insert" :             // data == object == record
                    this.objects.insert(data.data);
                    if (data.callback)
                        this.sendMessage(data.callback, "OK");
                    break;
                case "os:get" :               // data == {callback, filter == {<name>:<value>}}
                    this.sendMessage(data.callback, {data: this.objects(data.filter).first()});
                    break;
                case "os:remove" :            // data == filter == {<name>:<value>}
                    this.objects(data.filter).remove();
                    if (data.callback)
                        this.sendMessage(data.callback, "OK");
                    break;
                case "os:ls" :                // data == {callback, filter == {<name>:<value>}}
                    this.sendMessage(data.callback, {data: this.objects(data.filter).select("id")});
                    break;
                default :
                    console.warning(this.id + ": we are not supposed to receive this message");
                    return;
            }
        },
        load: function () {
            var self = this;
            var filename = "data_storage/" + this.id + ".txt";
            this.io.read(filename, function (data) {
                // on succesfull read init database
                self.objects = TAFFY(data);
                console.info("ModuleObjectStorage '" + self.id + "': loaded " + self.objects().count() + " records");
            }, function () {
                console.error("ModuleObjectStorage '" + self.id + "': didn't load");
            });
        },
        save: function () {
            var self = this;
            var filename = "data_storage/" + this.id + ".txt";
            this.io.write(this.objects().get(), filename,
                function () {
                    console.info("ModuleObjectStorage '" + self.id + "': saved");
                },
                function () {
                    console.error("ModuleObjectStorage '" + self.id + "': failed to save");
                });
        },
        printHelp: function () {
            console.log("ModuleObjectStorage " + this.id + ": commands are " + this.event_in);
        }
    });
};

/*
 * This module computes effect of action performed by a character and a response of target if one responds.
 */
function ModuleEstimate(){
        return json_concat(DuckClient(), {
	id : "ModuleEstimate",
	actor : null,
	action : null,
	cube_action : null,
	target : null,
	reaction : null,
	cube_reaction : null,
	effect : null,
	
	event_in : ["es:calc:effect", "es:who:acts", "es:which:action", "es:cube:action", "es:who:target", "es:which:reaction", "es:cube:reaction", "es:clear"],
	
	processMessage : function (event, data) {
		switch (event) {			
		    // data === {data:object} in all these calls
			case "es:who:acts" :
			 console.info("ModuleEstimate " + this.id + ": actor set: '" + data.data.id + "'");
			 this.actor = data.data; 
			 if (data.callback)
		    		this.sendMessage(data.callback, "OK");break; 
			case "es:which:action" :
             console.info("ModuleEstimate " + this.id + ": action set: '" + data.data.id + "'");
             this.action = data.data; 
             if (data.callback)
		    		this.sendMessage(data.callback, "OK");break;
			case "es:cube:action" :
             console.info("ModuleEstimate " + this.id + ": cube for action set");
             this.cube_action = data.data; 
             if (data.callback)
		    		this.sendMessage(data.callback, "OK");break;
			case "es:who:target" :
             console.info("ModuleEstimate " + this.id + ": target set: '" + data.data.id + "'");
             this.target = data.data; 
             if (data.callback)
		    		this.sendMessage(data.callback, "OK");break;
			case "es:which:reaction" :
             console.info("ModuleEstimate " + this.id + ": reaction set: '" + data.data.id + "'");
             this.reaction = data.data; 
             if (data.callback)
		    		this.sendMessage(data.callback, "OK");break;
			case "es:cube:reaction" :
             console.info("ModuleEstimate " + this.id + ": cube for reaction set");
             this.cube_reaction = data.data; 
             if (data.callback)
		    		this.sendMessage(data.callback, "OK");break;
			case "es:calc:effect" : // data = {callback}
			 this.calc_effect(data.callback); break;
			case "es:clear" : 
             this.clear(); 
             if (data.callback)
		    		this.sendMessage(data.callback, "OK");break;
			default : console.warning(this.id + ": we are not supposed to receive this message"); return;
		}		
	},	
	clear : function() {
        this.actor = null;
        this.action = null;
        this.target = null;
        this.reaction = null;
        this.cube_action = null;
        this.cube_reaction = null;
        console.info("ModuleEstimate " + this.id + ": clear OK");
	},
	calc_effect : function (callback) {
		if (this.check_conditions())
			this.calculate();
		else {
			console.error("ModuleEstimate " + this.id + ": check conditions: ERROR");
			return;
		}
		if (this.effect != null) {
			console.info("ModuleEstimate " + this.id + ": calculate effect: OK");
			console.info("ModuleEstimate " + this.id + ": " + JSON.stringify(this.effect));
			this.sendMessage(callback, {data : this.effect});
		} else {
			console.info("ModuleEstimate " + this.id + ": no effect calculated");
		}
	},
	check_conditions : function () {
		// TODO
		return true;
	},
	calculate : function () {
		// TODO
		this.effect = this.actor + " " + this.action + " " + this.target + " and reaction: " + this.reaction; 
	},
	printHelp : function () {
		console.log("ModuleEstimate " + this.id + ": commands are " + this.event_in);
	}
});
};

/*
 * This module knows how to apply effect computed in ModuelEstimate
 */
function ModuleApplyEffect () {
    return json_concat(DuckClient(), {
        id: "ModuleApplyEffect",
        event_in: ["ae:effect", "ae:target", "ae:modificator", "ae:apply", "ae:clear"],

        target: null,
        effect: null,

        processMessage: function (event, data) {
            switch (event) {
                case "ae:effect" :  // data === {who, effect}
                    console.info("ModuleApplyEffect " + this.id + ": target set: '" + data.data.who.id + "' effect set");
                    this.target = data.data.who;
                    this.effect = data.data.effect;
                    if (data.callback)
                        this.sendMessage(data.callback, "OK");
                    break;
                case "ae:target" :  // data === {data:object}
                    console.info("ModuleApplyEffect" + this.id + ": target set: '" + data.data.id + "'");
                    this.target = data.data;
                    if (data.callback)
                        this.sendMessage(data.callback, "OK");
                    break;
                case "ae:modificator" :  // data === {data:object}
                    console.info("ModuleApplyEffect" + this.id + ": effect set");
                    this.effect = data.data;
                    if (data.callback)
                        this.sendMessage(data.callback, "OK");
                    break;
                case "ae:apply" :  // data === {callback}
                    this.apply();
                    if (data.callback)
                        this.sendMessage(data.callback, "OK");
                    break;
                case "ae:clear" :
                    this.clear();
                    if (data.callback)
                        this.sendMessage(data.callback, "OK");
                    break;
                default :
                    console.warning(this.id + ": we are not supposed to receive this message");
                    return;
            }
        },
        clear: function () {
            this.target = null;
            this.effect = null;
            console.log(this.id + ": discard effect: OK");
        },
        apply: function () {
            //TODO
        },
        printHelp: function () {
            console.log("ModuleApplyEffect " + this.id + ": commands are " + this.event_in);
        }
    });
};

