# module documentation

Modules should be in ``src/mod``.

You should also edit ``src/client/index.html`` to include the file.

## callbacks

A callback is a function called on a particular event.

A callback should return true, unless aborting event processing is desired.

You can register one with ``register_callback(eventname,fn)``

An example of a basic callback is:

```
register_callback("gamestart",(d) =>{
    console.log("Hello, World!")
    return true
})
```

Callback events may be trigered with ``call_callbacks(eventname,data)``.

You can register an event for a callback with ``callback(eventname)``.

## modules

A module is a block of js code.

They should start with a call to ``register_module``(name)

The function ``get_mod_data``(name) can be used to access/modify module's data object.

```
register_module("hello")

register_callback("gamestart",(d) =>{
    console.log("Hello, World!")
    return true
})
```

## commands

Commands can be registered w/ the ``register_command(name,desc,fn)`` function.

``fn`` is the function called when the command is executed.
The arguments are input (space demited) and a callback to send messages to the chat. (localy)

Example module:
```
register_module("hello")

register_command("hello", "displays hello world!", (a, c) => c("Hello, World!"))
```

## list of callbacks

- gamestart

called w/ no data when join game button is clicked

- render_player_name {playerid, str}

called before rendering a player name, a callback may modify ``str`` to chainge what is displayed

returning false will not stop the name from displaying

- packet_rx

called when a packet is receved form the server.

returning false will prevent packet proccesing

- player_join {id, p}

trigered when a player goins (p is player data)

if false, player not joined

- player_leave {id, p}

trigered when a player leaves

if false, player not deleted

- player_updata {id, data}

trigered when a player data updates

if false, update discarded
