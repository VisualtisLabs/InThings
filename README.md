## InThings

Inthings is a Internet Of Things Management Cloud Platform which can be installed in a NodeJS server.

Its main goal is to be able to group any user's IoT sensor management into it for simplify its configuration and data use for new customized applications.

## Features

At the moment, InThings can be used for sign up sensors of three main types:

- **Reactive:** server will keep listining for real time data received from an external service pushing to it, at this moment Relayr Wunderbar is the only one sensors board in this type.
- **Passive:** you or your software will have to push data into a custom URL for updating sensor values.
- **Catch:** each catch sensor will have a custom URL InThings will request values to. The response must have a pure clean format (response will be the value) or JSON format.

A sensor can have defined React settings which will be used to know what to do with a value is received. This settings will add Twitter DM, Email notification and HTTP GET request notifications and Time settings for defining when it could be sent.

HTTP requests are the most interesting ones sice they can be used for create custom applications using client server functions.

## HOW-TO install

InThings can be installed in your Node server just downloading or cloning this repo on a folder and running: 

```
npm install && bower install
```

After this you can use 

```
grunt serve 
```

And start debugging and testing your server in port 9000.

If you have any problem with this show yeoman angular-fullstack run settings. InThings has been created using this.


## Acknowledgements

Thanks to NodeJS, AngularJS and JavaScript open source communities as they have been developed great modules and packages used in this project, and thanks for Relayr and other companies helping to make IoT world easiest as possible. We love you all!