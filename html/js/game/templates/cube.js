TemplateCube = {
    value : "value on d6 cube"
};

function test_cube(val) {
    var c = clone(TemplateCube);
    c.value = val;
    return c;  
};
