var MES = ModuleEstimate.extend({
   
   check_conditions : function () {
        if (this.action == null) {
            console.warn("ModuleEstimate MES: action is null!");
            return false;
        }
        if (this.target == null) {
            console.warn("ModuleEstimate MES: target is null!");
            return false;
        }
        if (this.actor == null) {
            console.warn("ModuleEstimate MES: who is acting? actor is null!");
            return false;
        }
        if (this.cube_action == null) {
            console.warn("ModuleEstimate MES: you forgot to roll the dice for action!");
            return false;
        }
        if (this.reaction != null && this.cube_reaction == null) {
            console.warn("ModuleEstimate MES: you forgot to roll the dice for reaction!");
            return false;
        }
        return true;
    },    
    // this function constructs modificator that can be applied in module_apply_modificator
    // so, thay have to be considered and coded together
    calculate : function () {
        // find out, what are the conditions of attack and defence
        var conditions_attack = this.action_conditions(this.actor, this.action, this.target);        
        var conditions_defence = this.action_conditions(this.target, this.reaction, this.actor);
        
        // calc attack and defence effect
        var attack = this.action_effectiveness(this.actor, this.action, this.cube_action, conditions_attack);
        console.log("ModuleEstimate MES attack: " + attack);
        
        var defence = this.action_effectiveness(this.target, this.reaction, this.cube_reaction, conditions_defence);
        console.log("ModuleEstimate MES defence: " + defence);
        
        var effect = attack - defence;        
        if (effect > 0)
        	this.effect = {who : this.target, effect : this.get_effect(effect)};
        else
        	this.effect = {who : this.actor, effect : this.get_effect(effect)};
    },
    action_conditions : function(actor, action, target) {
        // TODO
        // this is usual situation, no special conditions
        return ["all"];
    },
    action_effectiveness : function(actor,action,cube,conditions){
        if (action == null)
            return 0;
        // here we apply bonuses if there are some in these conditions
        var bonuses = 0;       
        for (i in conditions) {
            var b = aoj_extract(actor.bonuses, conditions[i]);
            for (j in b) {
                bonuses += b[j];
            }
        }
        console.log("bonus " + bonuses);
        // apply cube and bonuses
        if (action.base_char)
            return cube.value - 3 + actor.chars[action.base_char] + bonuses;
            
        // if we dont know how to deal with this action
        console.warn("ModuleEstimate MES dunno how to calculate effectiveness of this action: " + JSON.stringify(action));
        return 0;
    },
    effect_table : test_effects, // TODO, this field should be loaded or whatever, not test.
    
    get_effect : function (value) {
    	var effect = aoj_select(this.effect_table, {value : value});
    	if (effect.length != 1) {
    	   console.warn("ModuleEstimate MES dunno, what effect will be: value: " + value);
    	   return null;
    	}
    	return aoj_extract(effect, "regular")[0]; // TODO regular is now only option
    }
    
});
