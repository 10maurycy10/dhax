(()=>{

register_module("base")

register_command("help","shows a list of commands",help)

register_command("nodevcheck","disable checking for dev before kicking",toggle("base","force"))

register_command("showid","displays player ids",toggle("base","showid"))

register_command("setdev","allows entering a dev key",value("shared","devkey"))

register_command("setfakename","allows setting a name used for sudo",value("shared","fakename"))

register_command("sudo","run a command as dev",sudo)

register_command("antiscry","hides fake arrows",toggle("base","antiscry"))

register_command("say","type something into chat",(a,c) => send({chat: a.join(" ")}))

register_command("spam","type something into chat 100x",
 (a,c) =>{for (let i = 0; i < 100; i++) send({chat: a.join(' ')})}
)

register_command("kickall","kickall players",kick_all)

function help(args,callback) {
    for (name of Object.keys(commands)) {
        callback(`${name}: ${commands[name].desc}`)
    }
    callback("if you ment to post .help in chat do .say .help")
}



function sudo(args,callback) {
    let sdata = get_mod_data("shared")
    let data = get_mod_data("base")
    if (players[selfId].dev == true) {
        callback("you are already DEV!")
        return
    }
    if (sdata.devkey) {
        let oldname = players[selfId].name;
        
        send({chat: sdata.devkey})
        
        if (sdata.fakename !== null)
            send({chat: `/name ${sdata.fakename}`})

        // fix for commnds that check for dev
        players[selfId].dev = true
        if (!hax_command(args.join(' '),callback))
            send({chat: args.join(' ')})
        
        if (sdata.fakename !== null)
            send({chat: `/name ${oldname}`})
            
        send({chat: sdata.devkey})
        players[selfId].dev = false
    } else {
        callback("you must specify a dev key with .setdev")
    }
}

function kick_all(a,c) {
    let data = get_mod_data("base")
    if (!(players[selfId].dev || data.force)) {
        console.log(".kickall w/o dev! aborting.")
        c("you have called kickall w/o dev")
        c("this is a bad idea, run \".nodevcheck true\" to disable this warning")
        return;
    }
    for (id of Object.keys(players)) {
        if (id != selfId) {
            send({chat: `/kick ${id}`})
        }
    }
}

register_callback("render_player_name",(d) => {
    if (get_mod_data("base").showid) {
         d.str = `[${d.playerid}] ${d.str}`
         return true
     } else {
         return true
     }
})

register_callback("config_update",(d) =>{
    let data = get_mod_data("base");
    let props = {"devkey": true, "antiscry": true, "fakename": true}
    console.log(d)
    for (i of Object.keys(d.PRE_SEED)) {
        if (props[i]) {
            data[i] = d.PRE_SEED[i]
        }
    }
    return true
})

register_callback("gamestart",(d) =>{
    console.log("base!")
    return true
})

})()
