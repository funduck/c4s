/*
 * modificator is json with attribute_names - names of attribute in character it affects,
 * for example {bh:-2, str:-1}
 */

TemplateModificator = {
    type : "modificator",
    id : "template"
};

function basic_modificator(param, p_val) {
    var m = clone(TemplateModificator);
    m[param] = p_val;
    return m;
}
