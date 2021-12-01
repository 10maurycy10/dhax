if (global.config_instance) {
    module.exports = global.config_instance
} else {
    
    vars = {
        PORT: 5000,
        //ADDRESS: "wss://darrows-testing.herokuapp.com",
        ADDRESS: "wss://darrows.herokuapp.com",
        PRE_SEED: {},
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
