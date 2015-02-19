TemplateFieldObject = {
    cells   : [], // occupied cell numbers
    heights : [], // heights
    object  : null// real object
};

TemplateField = {
    sizeX : 0,
    sizeY : 0,
    objects : [], // objects on the game field, there may be more than one for cell. index of "objects" is just an index
    marks : [],   // marks on the cells. index of "marks" references cell_id. so marks[cell_id] is a json of marks.
    /*
    initialize field with size = <size>; in Template we dunno anything about field realization,
    but cells have to be ordered and indexed according to the order.
     */
    init : function(size){
        this.marks = new Array(size);
        this.marks.fill({});
    },
    /*
    returns array of objects over particular cell
     */
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
    puts a property <mark> over the cell with index = <cell_id>
     */
    mark : function(cell_id, mark){
        this.marks[cell_id][mark] = true;
    },
    unmark : function(cell_id, mark){
        this.marks[cell_id][mark] = false;
    },
    /*
    to unmark all cells, for particular <mark> or all marks
     */
    unmark_all : function(mark){
        this.marks.forEach(function(cell, i, marks){
            if (mark && mark != null) cell[mark] = false;
            else cell = {};
        });
    },
    /*
    * returns array of neighbor cells indices
    */
    neighbors : function(cell_id){},
    /*
     * some metrics for cells
     */
    distance : function(cell1, cell2){},
    /*
     * finds shortest way from cell to cell, way will contain only those cells, which marks do not natch <filter>,
     * so <filter> is what shouldn't be in the way
     */
    shortest_way : function(cell_from, cell_to, filter){
        var hist = FixedDeepStack(10);
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
            //console.log("delMin: ",way);
            // check if we came where we wanted to
            if (way.distance == 0) {
                //console.log("TemplateField.shortest_way found in ",count," steps");
                return way;
            }
            
            // add to the way all neighbors of last point
            var neighbors = this.neighbors(way.cells[way.cells.length - 1]);
            
            for (var c in neighbors){                
                var neighbor_cell_id = neighbors[c];
                
                // this history contains several last points, so we wont walk in circles
                if (hist.contains(neighbor_cell_id)) continue;
                
                // this filter allows to add conditions for cells that shouldn't be in the way
                if (filter != null) {                
                    if(json_filter(this.marks[neighbor_cell_id], filter)) continue;
                }
                     
                // remember last point
                hist.put(neighbor_cell_id);

                // continue way
                var w = clone(way);
                w.cells.push(neighbor_cell_id);
                w.distance = this.distance(neighbor_cell_id, cell_to);

                // add new way to MinPQ
                pq.insert(w);
            }
            count++;
        } while(count < this.sizeX*this.sizeY);        
        console.warn("TemplateField.shortest_way: there is no way!");
        return null;
    }
};