function create_test_characters() {
	// create test characters
    var c1 = test_character("A");
    c1.bonuses = [{all : +1, time : 1}];
    var c2 = test_character("B");
    c2.bonuses = [{all : -1, time : 1}];
    aos.objects.insert(c1);
    aos.objects.insert(c2);
}

function test_attack_and_defence(who, attack, target, defence, cube_attack, cube_defence) {
    console.info("test_attack_and_defence " + who + " " + attack + " " + target + " " + defence + " " + cube_attack + " " + cube_defence);    
    // actor
    mt.add(function(data){
        startTime = (new Date()).getTime();
	    cin.sendMessage("os:get", {callback: "test", filter : {id : who}});
	});
    mt.add(function(data){        
        cin.sendMessage("es:who:acts", {callback: "test", data : data.data});
    });
    mt.add(function(data){
        cin.sendMessage("os:get", {callback: "test", filter : {id : who}});
    });
    mt.add(function(data){
        cin.sendMessage("ch:set", {callback: "test",data : data.data});
    });        
    mt.add(function(data){
        cin.sendMessage("ch:ls:actions", {callback : "print:json", filter : {id:attack}});
        cin.sendMessage("ch:get:action", {callback : "test", filter : {id:attack}});
    });
    mt.add(function(data){        
        cin.sendMessage("es:which:action", {callback : "test", data : data.data});
    });
        
    
    // target
    mt.add(function(data){        
       cin.sendMessage("os:get", {callback: "test", filter : {id : target}});
    });
    mt.add(function(data){        
        cin.sendMessage("es:who:target", {callback: "test", data : data.data});
    });
    mt.add(function(data){
        cin.sendMessage("os:get", {callback: "test", filter : {id : target}});
    });
    mt.add(function(data){
        cin.sendMessage("ch:set", {callback: "test",data : data.data});
    });        
    mt.add(function(data){
        cin.sendMessage("ch:ls:actions", {callback : "print:json", filter : {id : defence}});
        cin.sendMessage("ch:get:action", {callback : "test", filter : {id : defence}});
    });
    mt.add(function(data){        
        //console.log(JSON.stringify(data));
        cin.sendMessage("es:which:reaction", {callback : "test", data : data.data});
    });
    
    mt.add(function(data){
        cin.sendMessage("es:cube:action", {callback : "test", data : test_cube(cube_attack)});
    });
    mt.add(function(data){
        cin.sendMessage("es:cube:reaction", {callback : "test", data : test_cube(cube_defence)});
    });
    
    mt.add(function(data){
        cin.sendMessage("es:calc:effect", {callback:"test"});
    });
    mt.add(function(data){
        cin.sendMessage("ae:effect", {callback:"test", data : data.data});
    });
    mt.add(function(data){
        cin.sendMessage("ae:apply",{callback: "test"});        
    });
    mt.add(function(data){
        console.log("test took " + ((new Date()).getTime() - startTime) + " msec" );
    });
    //mt.run(0);

};