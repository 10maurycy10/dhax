console.log("loading hax code")

hax = {
    update_config: update_config,
    config: null,
    modules: {},
    callbacks: {}
};

let toggle = (owner,name) => (args,callback) => {
    owner = owner ?? hax.cmod
    hax.modules[owner][name] = !hax.modules[owner][name];
    callback(`${name} is ${hax.modules[owner][name]}`);
}

let value = (owner,name) => (args,callback) => {
    owner = owner ?? hax.cmod
    if (args.length > 0) {
        hax.modules[owner][name] = args[0];
    } else {
        callback(`${name} is ${hax.modules[owner][name]}`);
    }
}

commands = {}

function register_command(name,desc,fn) {
    commands[name] = {"desc": desc, "fn": fn, "module": hax.cmod}
}

function register_module(name) {
	hax.modules[name] = {}
	hax.cmod = name
}

function register_callback(eventname,fn) {
    hax.callbacks[eventname].push(fn)
}

function callback(eventname) {
    hax.callbacks[eventname] = []
}

// returns true if the event should be proccesed
function call_callbacks(eventname,data) {
    for (fn of hax.callbacks[eventname]) {
        if (!fn(data)) {
            return false
        }
    }
    return true
}

function get_mod_data(mod) {
	return hax.modules[mod]
}

callback("config_update")
function update_config(conf) {
    hax.config = conf
    call_callbacks("config_update",conf)
}

// returns true if the command is a command
function hax_command(command,callback) {
    if (!command.startsWith(".")) {
        return false;
    }
    
    if (command.split(' ')[0]) {
        pred = command.split(' ')[0];
        pred = pred.slice(1);
        
        
        if (commands[pred]) {
            if (commands[pred]["fn"]) {
                commands[pred]["fn"](command.split(' ').splice(1),callback)
            }
        } else {
            callback("that is not a valid command!")
            callback("if you ment to post that in chat do:")
            callback(`.say ${command}`)
        }
    }
    
    return true;
}

register_module("shared")

callback("render_player_name")
callback("gamestart")
callback("player_join")
callback("player_update")
callback("player_leave")
