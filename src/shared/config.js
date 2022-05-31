if (global.config_instance) {
    module.exports = global.config_instance
} else {
    
    vars = {
        PORT: 5000,
        //ADDRESS: "wss://darrows-testing.herokuapp.com",
        ADDRESS: "wss://darrows.zerotixdev.repl.co",
        PRE_SEED: {},
        // the game's url, this allows faking a "orgin" header to server.
        GAMEADDRESS: "https://darrows.zerotixdev.repl.co/",
        // spoof x-forwarder-for header to bypass ip limits. this works if server is _not_ behind a reverse proxy/load balencer. (works on heroku for some reson)
        IPLIMITBYPASS: true,
    }

    for (key of Object.keys(process.env)) {
        if (vars.hasOwnProperty(key)) {
            vars[key] = JSON.parse(process.env[key])
        }
    }

    if (process.env.LOG_CONFIG) {
        console.log(vars)
    }

    global.config_instance = vars
    module.exports = vars
}
