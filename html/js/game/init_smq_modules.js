function init_smq_modules() {

    SMQ = DuckMQ();
    SMQ.start();

    os = ModuleObjectStorage();
    os.id = "os";
    os.connectTo(SMQ);

    es = MES();
    es.id = "es";
    es.connectTo(SMQ);

    ae = MAE();
    ae.id = "ae";
    ae.connectTo(SMQ);

    ch = ModuleCharacter();
    ch.id = "ch";
    ch.connectTo(SMQ);

    mt = ModuleTest();
    mt.id = "mt";
    mt.connectTo(SMQ);

    help = ModuleHelp();
    help.connectTo(SMQ);

    help.include(os);
    help.include(es);
    help.include(ae);
    help.include(ch);
    help.include(mt);

    cin = new ConsoleInput();

    cin.commands_dictionary = ae.event_in.concat(es.event_in.concat(os.event_in.concat(help.event_in.concat(ch.event_in.concat(mt.event_in)))));
    cin.commands_dictionary.sort();

    cin_view = new ConsoleInputView({model : cin});
    cin_view.render();

    $("#body").append(cin_view.el);
    cin.connectTo(SMQ);
    
    //cin.sendMessage("os:load");
}