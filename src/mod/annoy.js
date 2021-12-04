(()=>{

register_module("annoy")

let data = get_mod_data("annoy")

data.annoy = Object.create(null)

register_command("annoy","annoy a player by name",(a,c) => data.annoy[a.join(' ')] = true)

register_command("unannoy","stop annoying a player by name",(a,c) => data.annoy[a.join(' ')] = false)

register_callback("player_chat",(d) =>{
    if (data.annoy[d.name]) {
        send({chat: d.msg})
    }
    return true;
})

})()
