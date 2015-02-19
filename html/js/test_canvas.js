$(function(){



    var canvas = new fabric.Canvas('game_canvas');

    /*fabric.Image.fromURL('pics/Byd_elfom_bleat.jpeg', function(img){
        // img is image  
        console.log(img);
        img.scaleX = canvas.width/(3*img.width);
        img.scaleY = canvas.height/(3*img.height);
        if (img.scaleX < img.scaleY)
            img.scaleY = img.scaleX;
        else
            img.scaleX = img.scaleY;
        canvas.add(img);
    });*/

    var field = new HexFieldModel({id : "field"});
    field.init(5,5);

    var view = new HexFieldView({model : field});

    var hexes = view.render();
    for (var h in hexes){
        hexes[h].selectable = false;
        canvas.add(hexes[h]);
    }


    canvas.on({'mouse:up' : function(e){
        view.mouse_click(e.e.clientX, e.e.clientY);
    }
    });
    canvas.selection = false;
    canvas.allowTouchScrolling = false;

});