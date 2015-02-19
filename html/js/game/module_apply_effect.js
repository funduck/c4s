function MAE () {
    return json_concat(ModuleApplyEffect(), {
        // this function applies strings like "+16", "*1.1"
        apply_value: function (target, value) {
            var v = parseFloat(value.substr(1));
            switch (value.charAt(0)) {
                case "+" :
                    target += v;
                    break;
                case "-" :
                    target -= v;
                    break;
                case "*" :
                    target *= v;
                    break;
            }
            return target;
        },
        // this function applies modificator
        apply: function () {
            console.log("MAE: apply modificator");
            // modificator
            var params = json_attrs(this.effect.modificator);
            for (i in params) {
                var p = params[i];
                if (this.target.params[p]) {
                    var h = p + ": " + this.target.params[p];
                    this.target.params[p] = this.apply_value(this.target.params[p], this.effect.modificator[p]);

                    // TODO here we should apply changes in parameters to characteristics of target

                    console.log(h + " >>> " + this.target.params[p]);
                    continue;
                }
                if (this.target.chars[p]) {
                    var h = p + ": " + this.target.chars[p];
                    this.target.chars[p] = this.apply_value(this.target.chars[p], this.effect.modificator[p]);
                    console.log(h + " >>> " + this.target.chars[p]);
                    continue;
                }
                console.warn("MAE " + this.id + ": target: '" + this.target.id + "' doesn't have attribute : '" + this.effect.modificator[p] + "'");
            }
            console.info("MAE " + this.id + ": target: '" + this.target.id + "', modificator apply OK");
            // and finally just add bonuses
            this.target.bonuses = this.target.bonuses.concat(this.effect.bonuses);
        }
    });
};
