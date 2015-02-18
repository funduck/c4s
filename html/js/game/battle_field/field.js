TemplateFieldObject = {
    cells   : [], // occupied cell numbers
    heights : [], // heights
    object  : null// real object
};

TemplateField = {
    sizeX : 0,
    sizeY : 0,
    objects : [],
    what_in : function(cell_id){
        var objects = [];
        this.objects.forEach(function(object, i, array){
            object.cells.forEach(function(cell,j,arr){
                if (cell == cell_id) objects.push(object);
            });
        });
        return objects;
    },
    /*
    * returns [] of neighbors indices
    */
    neighbors : function(cell_id){},
    /*
     * some metrics
     */
    distance : function(cell1, cell2){},
    /*
     * finds shortest way from cell to cell, way will contain only those cells, that do not natch <filter>, 
     * so <filter> is what shouldn't be in the way
     */
    shortest_way : function(cell_from, cell_to, filter){
        var hist = FixedDeepStack(10);        
        var self = this;
        // create MinPQ
        var pq = MinPQ(
            // comparator
            function(a,b){                
                if (a.distance > b.distance) return 1;
                if (a.distance < b.distance) return -1;
                return 0;
            }
        );

        pq.insert({distance : this.distance(cell_from, cell_to), cells : [cell_from]});

        var count = 1;
        do {
            // take shortest way
            var way = pq.delMin();
            console.log("delMin: ",way);
            // check if we came where we wanted to
            if (way.distance == 0) return way;
            
            // add to the way all neighbors of last point
            var neighbors = this.neighbors(way.cells[way.cells.length - 1]);
            
            for (var c in neighbors){                
                var n = neighbors[c];
                
                // this history contains several last points, so we wont walk circles
                //if (hist.contains(n)) continue;
                
                // this filter allows to add conditions for cells that CAN'T be in the way
                if (filter != null) {                
                    var objects = this.what_in(n); // objects over this cell
                    for (var o in objects)
                        if (json_filter(objects[o], filter)) continue;
                }
                     
                // remember last point
                hist.put(n);
                var w = clone(way);
                w.cells.push(n);
                w.distance = this.distance(n, cell_to);
                // add new way
                pq.insert(w);
            }
            count++;
        } while(count < this.sizeX*this.sizeY);        
        console.warn("TemplateField.shortest_way: there is no way!");
        return null;
    }
};

/*
 * Hex field
 * rows     __    __
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
        console.log("neighbours ",n);
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
}