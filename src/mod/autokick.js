(()=>{

register_module("autokick")

let data = get_mod_data("autokick")

data.banned_names = Object.create(null)

register_command("ban","autokick a player by name",(a,c) => data.banned_names[a[0]] = true)

register_command("unban","stop autokicking a player by name",(a,c) => data.banned_names[a[0]] = false)

register_callback("player_update",(d) =>{
    if (d.data.name) {
        if (data.banned_names[d.data.name]) {
            kick(d.id)
        }
    }
    return true;
})

function kick(id) {
    sdata = get_mod_data("shared");
    adev = players[selfId].dev
    if (sdata.devkey) {
        let oldname = players[selfId].name;
        
        if (!adev)
            send({chat: sdata.devkey})
        
        if (sdata.fakename !== null)
            send({chat: `/name ${sdata.fakename}`})

        send({chat: `/kick ${id}`})
        
        if (sdata.fakename !== null)
            send({chat: `/name ${oldname}`})
            
        if (!adev)
            send({chat: sdata.devkey})
    }

}

})()
