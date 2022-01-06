register_module("autoaim")

loading = true
arrow_direction = "arrowLeft"
aim_delay = 0
self = null
players_input = null
time_loading = 0
aim_cycles = 0
aim_time = 0
dbg = (x) => {}
//dbg = console.log


aimconfig = {
    ARROWING_ANGULAR_SPEED: 2.9,
    SERVER_TICKS_MS: 16,
    MIN_AIM_CYCLES: 16,
    MIN_AIM_TIME: 10,
}

function update_input() {
    let input = createInput();

    if (players_input)
        for (x in players_input)
            input[x] = players_input[x];
    
    input.space = loading;

    if (arrow_direction) input[arrow_direction] = true;
    
    send({input: true, data: input});
}

function update_aim(target_x, target_y, has_target) {

    if (aim_delay) {return;}
    if (!self) {return;}
    aim_time++

    dbg("aim updating")
    
    let target = Math.atan2(self.y-target_y,self.x-target_x);
    
    let error = (((target - self.angle) + Math.PI*2) % (Math.PI*2)) - Math.PI;
    
    if (error > 0)
        arrow_direction = "arrowRight";
    else
        arrow_direction = "arrowLeft";
    
    update_input();
        
    // dont attemt good aim if ping not known
    if (ping === null) return;
        
    let seconds_round_trip = (ping * 2 + aimconfig.SERVER_TICKS_MS) / 1000;
    
    let angle_per_trip = aimconfig.ARROWING_ANGULAR_SPEED * seconds_round_trip;
    
    dbg(error,angle_per_trip)
    
    if (Math.abs(error) < (angle_per_trip*3)) {
        
        dbg("attempting early relese!")
        
        let time_to_hold_input_ms = Math.abs(error / aimconfig.ARROWING_ANGULAR_SPEED * 1000);
            
        dbg("releasing key in ",time_to_hold_input_ms,"ms, blocking aim")
        
        aim_delay = true;
        
        setTimeout(() => {
            
            arrow_direction = null;
            dbg("released key", aim_cycles, aim_time)
            update_input();
            aim_delay = false;
            if (aim_cycles > aimconfig.MIN_AIM_CYCLES && aim_time > aimconfig.MIN_AIM_TIME) { 
                aim_cycles = 0;
                aim_time = 0
                loading = false;
                update_input();
                time_loading = 0;
            } else {
                aim_cycles++;
                loading = true;
                update_input();
            }
        },time_to_hold_input_ms);
    } else dbg("no good aim")
}

// block all user inputs
register_callback("send_input",(d) =>{
    players_input = d.data;
    update_input()
    return false
})

function update_info() {
    self = players[selfId]
}

register_callback("packet_rx",(obj) => {
    if (obj.d) {
        cplayers = {}
        for (const id of Object.keys(players)) {
            cplayers[id] = Object.create(players[id]);
        }
        for (const pack of obj.d.p) {
            cplayers[pack.id].Snap(pack.data);
        }
    
    
        if (!players) {
            dbg("no players!")
            return true;
        }
        if (!self) {
            dbg("dont know self!")
            return true;
        }
    
        let target_x = 0;
        let target_y = 0;
        let target_d = Number.MAX_VALUE;
        let has_target = false;
        for (var id of Object.keys(cplayers)) {
            if (id!=selfId) {
                let tgt = cplayers[id];
                let dx = Math.abs(tgt.x - self.x);
                let dy = Math.abs(tgt.y - self.y);
                let d  = Math.sqrt(dx*dx+dy*dy);
                if (d < target_d) {
                    target_d = d;
                    target_x = tgt.x;
                    target_y = tgt.y;
                    has_target = true;
                }
            }
        }
        
        //dbg(has_target, target_x, target_y)
        if (has_target) {
            update_aim(target_x,target_y,has_target)
        }
    }
    
    return true;
})
     
setInterval(() => update_info(), 100)
