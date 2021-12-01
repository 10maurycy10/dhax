console.log("loading hax code")

window.hax = {
    showId: false,
    antiscry: false,
    devkey: null,
    fakename: null,
    update_config: update_config,
    force: false,
};

let toggle = (name) => (args,callback) => {
    hax[name] = !hax[name];
    callback(`${name} is ${hax[name]}`);
}

let value = (name) => (args,callback) => {
    if (args.length > 0) {
        hax[name] = args[0];
    } else {
        callback(`${name} is ${hax[name]}`);
    }
}

commands = {
    "help": {
        "desc": "shows a list of commands.",
        "fn": help
    },
    "nodevcheck": {
        "desc": "disables checking for dev",
        "fn": toggle("force")
    },
    "showid": {
        "desc": "displays player ids without dev.",
        "fn": toggle("showId")
    },
    "setdev": {
        "desc": "allows entering a dev key",
        "fn": value("devkey")
    },
    "setfakename": {
        "desc": "allows setting a name to use with sudo",
        "fn": value("fakename")
    },
    "sudo": {
        "desc": "do a command as dev.",
        "fn": sudo,
    },
    "antiscry": {
        "desc": "hides fake arrows",
        "fn": toggle("antiscry")
    },
    "say": {
        "desc": "type something into chat",
        "fn": (a,c) => send({chat: a.join(' ')})
    },
    "kickall": {
        "desc": "kicks ALL players",
        "fn": kick_all
    }
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
        }
    }
    
    return true;
}

function update_config(conf) {
    if (conf.PRE_SEED)
        for (i of Object.keys(conf.PRE_SEED))
            hax[i] = conf.PRE_SEED[i]
}

function help(args,callback) {
    for (name of Object.keys(commands)) {
        callback(`${name}: ${commands[name].desc}`)
    }
}

function sudo(args,callback) {
    if (hax.devkey) {
        let oldname = players[selfId].name;
        
        send({chat: hax.devkey})
        
        if (hax.fakename !== null)
            send({chat: `/name ${hax.fakename}`})

        // fix for commnds that check for dev
        players[selfId].dev = true
        if (!hax_command(args.join(' '),callback))
            send({chat: args.join(' ')})
        
        if (hax.fakename !== null)
            send({chat: `/name ${oldname}`})
            
        send({chat: hax.devkey})
    } else {
        callback("you must specify a dev key with .setdev")
    }
}

function kick_all(a,c) {
    if (!(players[selfId].dev || hax.force)) {
        console.log(".kickall w/o dev! aborting.")
        c("you have called kick all w/o dev")
        c("this is a bad idea, run \".nodevcheck true\" to disable this warning")
        return;
    }
    for (id of Object.keys(players)) {
        if (id != selfId) {
            send({chat: `/kick ${id}`})
        }
    }
}
