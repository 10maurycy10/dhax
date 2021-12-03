# module documentation

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
