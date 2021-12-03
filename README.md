# dhax

A way to use a custom client with darrows.

## running

On first run you will need to run``npm install``.

To start the server run ``npm start``.

Then go to the link printed in terminal.

## configuring

Config options are spcecifyed by env vars.

For example ``PORT=8080 npm start`` will run the server on port ``8080``. 

The vars must contain valid JSON, for example ``ADDRESS='"wss://darrows.herokuapp.com"'`` is ok but ``ADDRESS='wss://darrows.herokuapp.com'`` is not.

### list of vars (sever side)

- ``PORT`` the port number to bind to.

- ``ADDRESS`` the address of the darrows server, this should start with ``wss://``

- ``PRE_SEED`` config vars to be passed to the client. example PRE_SEED='{"devkey": "sampledevkey"}'

WARNING, someone that can connect to PORT could trivaly obtain the PRE_SEED data. 
Make sure this is firewalled before adding sencitve data, such as devkeys.

## Using

Visit the printed url in a browser, and then you should be able to play darrows normaly.

Enter ``.help`` in the chat to get a list of commands you can use.

NOTE: ``.say [some text]``  is required to post a message begning with ``.`` in chat.
