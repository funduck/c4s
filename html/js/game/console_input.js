var ConsoleInputView = Backbone.View.extend({
	tagName : "div",
	altPressed : false,
	initialize : function() {
		var self = this;
		// regular input
		this.$el.keypress(function(event) {
			self.typeKey(event.which);
		});

		/* for TAB, UP and DOWN arrows */
		this.$el.keydown(function(event) {
			if (event.which === 9 || event.which === 38 || event.which === 40) {
				event.preventDefault();
			}
		});
		this.$el.keyup(function(event) {
			if (event.which === 9 || event.which === 38 || event.which === 40) {
				self.typeKey(event.which);
			}
		});
		/***************/

		this.listenTo(this.model, "change", this.render);
	},
	typeKey : function(key) {
		switch (key) {
			case 13 :
				this.specialKey(key);
				break;
			case 9 :
				this.specialKey(key);
				break;
			case 38 :
				this.specialKey(key);
				break;
			case 40 :
				this.specialKey(key);
				break;
			default :
				break;
		}
	},
	specialKey : function(key) {
			this.model.updateLine(this.$el.find("input").get(0).value);
			this.model.specialKey(key);
	},
	render : function() {
		//console.log("console_input render()");
		this.$el.html(_template("#console_input", this.model.toJSON()));
		var input_field = this.$el.find("input").get(0);
		// set focus to input
		input_field.focus();
		input_field.setSelectionRange(input_field.value.length, input_field.value.length);
		return this;
	}
});

/*
 it reads lines like
 "command argument1 argument2..."
 and sends to queue message {command, [argument]} by pressing ENTER

 when TAB pressed, console looks in dictionary for command
 */
var  ConsoleInput = Backbone.Model.extend(
    json_concat(
            DuckClient(),{
        id: "console_input",
        event_out: "console:input",
        input_line: "",
        history: FixedDeepStack(10),
        commands_dictionary: [],

        specialKey: function (key) {
            switch (key) {
                // ENTER
                case 13 :
                    var cmd = "";
                    var args = "";

                    if (this.input_line.indexOf(" ") > 0) {
                        cmd = this.input_line.slice(0, this.input_line.indexOf(" "));
                        args = this.input_line.substr(this.input_line.indexOf(" ") + 1);
                        /* to allow input of simple JSON objects */
                        if (args.length > 0)
                            try {
                                var json_args = JSON.parse(args);
                                console.log("console: JSON input");
                                args = json_args;
                            } catch (e) {
                                console.log("console: String input. " + e + " in '" + args + "'");
                            }
                        /******************************************/
                    } else
                        cmd = this.input_line;

                    this.history.put(this.input_line);
                    this.input_line = "";
                    this.trigger("change");
                    this.sendMessage(cmd, args);
                    break;
                //TAB
                case 9 :
                    if (this.input_line.length === 0) break;

                    var found = false;
                    var count = 0;
                    var what_found = "";
                    for (i in this.commands_dictionary) {
                        if (this.commands_dictionary[i].indexOf(this.input_line) === 0) {
                            console.log(this.commands_dictionary[i]);
                            count++;
                            if (!found) {
                                what_found = this.commands_dictionary[i] + " ";
                                found = true;
                            }
                        }
                    }
                    if (found && count === 1) {
                        this.input_line = what_found;
                        this.trigger("change");
                    }
                    break;
                // DOWN
                case 40 :
                    var hst = this.history.prev();
                    if (hst != null && hst.length > 0) {
                        this.input_line = hst;
                        this.trigger("change");
                    }
                    break;
                // UP
                case 38 :
                    var hst = this.history.next();
                    if (hst != null && hst.length > 0) {
                        this.input_line = hst;
                        this.trigger("change");
                    }
                    break;
                default :
                    console.log(key);
                    break;
            }
        },
        updateLine: function (line) {
            this.input_line = clone(line);
        },
        toJSON: function () {
            return {
                input_line: this.input_line
            };
        }
    })
);
