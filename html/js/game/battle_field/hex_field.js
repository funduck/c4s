/*
 * Hex field
 * rows
 *  __    __
 * /-1\__/-1\
 * \__/-1\__/
 * /0 \__/0 \
 * \__/0 \__/
 * /1 \__/1 \
 * \__/1 \__/
 *    \__/
 */
function HexField(sizeX, sizeY){
    var hf = clone(TemplateField);
    hf.sizeX = sizeX;
    hf.sizeY = sizeY;
    hf.init(sizeX*sizeY);
    hf.neighbors = function(cell_id){
        var n = [];
        if (cell_id % hf.sizeX > 0) n.push(cell_id - 1); // left
        if (cell_id % hf.sizeX < hf.sizeX - 1) n.push(cell_id + 1); // right

        // for downs
        if (cell_id < hf.sizeX*(hf.sizeY - 1)) {
            n.push(cell_id + hf.sizeX); // down
            if ((cell_id % hf.sizeX) % 2 == 1) {
                if (cell_id % hf.sizeX > 0) n.push(cell_id - 1 + hf.sizeX); // left
                if (cell_id % hf.sizeX < hf.sizeX - 1) n.push(cell_id + 1 + hf.sizeX); // right
            }
        }
        // for ups
        if (cell_id > hf.sizeX - 1) {
            n.push(cell_id - hf.sizeX); // up
            if ((cell_id % hf.sizeX) % 2 == 0) {
                if (cell_id % hf.sizeX > 0) n.push(cell_id - 1 - hf.sizeX); // left
                if (cell_id % hf.sizeX < hf.sizeX - 1) n.push(cell_id + 1 - hf.sizeX); // right
            }
        }
        //console.log("neighbours ",n);
        return n;
    };
    hf.distance = function(cell1, cell2){
        var d = abs((cell2 % hf.sizeX) - (cell1 % hf.sizeX));
        d += abs(round(cell2/hf.sizeX) - round(cell1/hf.sizeX));
        return d;
    };
    return hf;
};

testHexField = function(){
    console.log("HexField testing");
    var hf = HexField(3,3);
    console.log(hf);
    var way = hf.shortest_way(2,3,null);
    console.log("shortest way ", way);
};

var SQRT3 = 1.732050807568877;

// helper function, builds hex cell
var hex = function(size, color, centerX, centerY){
    var d4 = size/4;
    var d2 = size/2;
    var y = d4*SQRT3; // sqrt(3)*d4
    return new fabric.Polyline([
        { x: -d4, y: -y },
        { x: d4, y: -y },
        { x: d2, y: 0 },
        { x: d4, y: y },
        { x: -d4, y: y },
        { x: -d2, y: 0 },
        { x: -d4, y: -y }
    ], {
        stroke: color,
        left: centerX - d2,
        top: centerY - d2,
        fill : null
    });
};

var hex4cell = function(size, color, cell_id, sizeX){
    var x = size*(0.5 + (cell_id % sizeX)*0.75);
    var y = size*SQRT3*(0.25 + 0.5*floor(cell_id/sizeX) + 0.25*((cell_id % sizeX) % 2));
    return hex(size, color, x, y);
};

HexFieldModel = Backbone.Model.extend({
    hf : undefined,
    cell_from : undefined,
    search_way : false,
    init : function(sizeX, sizeY){
        this.hf = HexField(sizeX, sizeY);
    },
    click_cell : function(cell_id){
        //console.log("clicked cell: ", cell_id);
        if (!this.search_way) {
            // start search way mode
            this.search_way = true;
            // mark cell
            this.hf.mark(cell_id, "active");
            // remember start
            this.cell_from = cell_id;
        } else {
            this.search_way = false;
            console.log("shortest way: ",this.hf.shortest_way(this.cell_from,cell_id,null));
        }
    }
});

HexFieldView = Backbone.View.extend({
    cell_diameter : 50,
    cell_color : 'black',
    hex_field : undefined,
    // builds an array of hex fields
    render : function() {
        if (this.hex_field == undefined) {
            var tmp = [];
            for (var i = 0; i < this.model.hf.marks.length; i++)
                tmp.push(hex4cell(this.cell_diameter, this.cell_color, i, this.model.hf.sizeX));
            this.hex_field = tmp;
        }
        return this.hex_field;
    },
    mouse_click : function(x,y){
        var point = new fabric.Point(x,y);
        //console.log("View: mouse click: ", point);
        var model = this.model;
        this.hex_field.forEach(function(hex, cell_id, fields){
            if (hex.containsPoint(point)){
                console.log("cell: ",cell_id);
                model.click_cell(cell_id);
            }
        });
    }
});