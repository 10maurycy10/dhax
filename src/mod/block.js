(()=>{

register_module("block")

let data = get_mod_data("block")

data.block = Object.create(null)

register_command("block","dont show messages from a user",(a,c) => data.block[a.join(' ')] = true)

register_command("unblock","show messages from a user",(a,c) => data.block[a.join(' ')] = false)

register_callback("player_chat",(d) =>{
    return !data.block[d.name]
})

})()
