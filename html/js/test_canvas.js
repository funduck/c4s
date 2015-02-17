$(function(){
    var canvas = new fabric.Canvas('game_canvas');
    
    fabric.Image.fromURL('pics/Byd_elfom_bleat.jpeg', function(img){
        // img is image  
        console.log(img);
        img.scaleX = canvas.width/(3*img.width);
        img.scaleY = canvas.height/(3*img.height);
        if (img.scaleX < img.scaleY)
            img.scaleY = img.scaleX;
        else
            img.scaleX = img.scaleY;
        canvas.add(img);
    });

});