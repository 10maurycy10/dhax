console.log("loading hax code")

window.hax = {
    showId: false,
    devkey: null,
};

commands = {
    "help": {
        "desc": "shows a list of commands.",
        "fn": help
    },
    "showid": {
        "desc": "displays player ids without dev.",
        "fn": (x,c) => {
            hax.showId = !hax.showId;
            c(`show id is ${hax.showId}`);
        }
    },
    "setdev": {
        "desc": "allows entering a dev key",
        "fn": (x,c) => {
            hax.devkey = x[0];
        }
    },
    "sudo": {
        "desc": "do a command as dev.",
        "fn": sudo,
    },
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

function help(args,callback) {
    for (name of Object.keys(commands)) {
        callback(`${name}: ${commands[name].desc}`)
    }
}

function sudo(args,callback) {
    if (hax.devkey) {
        send({chat: hax.devkey})
        send({chat: args.join(' ')})
        send({chat: hax.devkey})
    } else {
        callback("you must specify a dev key with .setdev")
    }
}
