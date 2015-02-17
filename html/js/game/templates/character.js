TemplateCharacter = {
	id : "template_character",
    type : "character",
    params : "parameters",
    chars  : "characteristics",
    avacts : "available actions",
    bonuses : "currently active bonuses"
};

function full_template_character(id) {
    var c = clone(TemplateCharacter);
    c.params = clone(TemplateParameters);
    c.chars = clone(TemplateCharacteristics);
    c.id = id;
    
    console.log("full_template_character: " + JSON.stringify(c));
    
    return c;
}

function test_character(id) {
    var c = clone(TemplateCharacter);
    c.params = clone(TemplateParameters);
    for (i in c.params) {
        c.params[i] = 1;
    }
    c.chars = clone(TemplateCharacteristics);
    c.chars.bh = BH(c.params);
    c.chars.ma = MA(c.params);
    c.chars.ra = RA(c.params);
    c.chars.mb = MB(c.params);
    c.chars.rb = RB(c.params);
    
    c.avacts = [clone(SimpleMeleeAttack), clone(SimpleMeleeBlock)];
    c.id = id;
    
    c.bonuses = [];
    
    console.log("test_character: " + JSON.stringify(c));
    
    return c;
}