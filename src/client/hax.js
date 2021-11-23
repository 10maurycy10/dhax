console.log("loading hax code")

window.hax = {
    showId: false
};

// returns true if the command is a command
function hax_command(command) {
    if (command == ".showid") {
        hax.showId = !hax.showId;
        return true;
    }
    return false;
}
