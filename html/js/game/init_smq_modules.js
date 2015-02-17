function init_environment() {    
    SMQ = DuckMQ({id : "message_queue"});
    SMQ.start();
    
    aos = new ModuleObjectStorage({id : "os"});
    aos.connectTo(SMQ);

    ame = new MES({id : "es"});
    ame.connectTo(SMQ);

    amae = new MAE({id : "ae"});
    amae.connectTo(SMQ);
    
    ch = new ModuleCharacter({id : "ch"});
    ch.connectTo(SMQ);
    
    mt = new ModuleTest({id : "mt"});
    mt.connectTo(SMQ);
    
    help = new ModuleHelp();
    help.connectTo(SMQ);
    help.include(aos);
    help.include(ame);
    help.include(amae);
    help.include(ch);
    help.include(mt);
    
    cin = new ConsoleInput();
    cin.commands_dictionary = amae.event_in.concat(ame.event_in.concat(aos.event_in.concat(help.event_in.concat(ch.event_in.concat(mt.event_in)))));
    cin.commands_dictionary.sort();

    cin_view = new ConsoleInputView({model : cin});
    cin_view.render();
    
    $("#body").append(cin_view.el);
    cin.connectTo(SMQ);
    
    //cin.sendMessage("os:load");
}