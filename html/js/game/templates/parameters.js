TemplateParameters = {
  str : "strength",
  agt : "agility",
  hlt : "health",
  sta : "stamina",
  rct : "reaction",
  att : "attention",
  sns : "sense",
  itn : "intuition",
  chr : "charisma",
  cnn : "cunning",
  wpr : "willpower"
};

TemplateCharacteristics = {
  bh : "battle health",
  ma : "melee attack",
  ra : "ranged attack",
  mb : "melee block",
  rb : "ranged block"
};

/*
 * Index of parameter formula
 */
function IDX(param_value) {
    var idx = 0;
    try {
        idx = (param_value - param_value%4)/4 + 1;
    } catch (e) {
        console.error("can't calculate index of a value! may be it's not a number");
        idx = null;
    }
    return idx;
};

/*
 * Formulas for calculation of characteristics
 */
function BH(params) {
    return IDX(params.str)*2 + IDX(params.hlt)*4;
};
function MA(params) {
    return IDX(params.str)*2 + IDX(params.agt)*4;
};
function RA(params) {
    return IDX(params.agt)*2 + IDX(params.rct);
};
function MB(params) {
    return IDX(params.agt)*2 + IDX(params.rct)*2;
};
function RB(params) {
    return IDX(params.agt) + IDX(params.rct);
};