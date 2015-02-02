'use strict';
var configBuilder = require('openfin-config-builder'),
    openfinLauncher = require('openfin-launcher'),
    path = require('path'),
    fs = require('fs');

function main(str, flags) {
    var name = flags.n || flags.name,
        url = flags.u || flags.url,
        config = flags.c || flags.config || 'config.json',
        launch = flags.l || flags.launch;

    if (isEmpty(flags)) {
        console.log('please see options: openfin --help');
        return;
    }

    writeToConfig(name, url, config, function() {
        if (launch) {
            launchOpenfin(config);
        }
    });
}

//makeshift is object empty function
function isEmpty(flags) {
    for (var key in flags) {
        if (flags.hasOwnProperty(key)) {
            return false;
        }
    }
    return true;
}

//will launch download the rvm and launch openfin
function launchOpenfin(config) {
    openfinLauncher.launchOpenFin({
        configPath: path.resolve(config)
    }).fail(function(err) {
        console.log('launch failed', err);
    });
}

//write the specified config to disk.
function writeToConfig(name, url, config, callback) {
    var startup_app = {},
        configAction,
        actionMessage;

    fs.exists(config, function(exists) {
        if (exists) {
            configAction = configBuilder.update;
            actionMessage = 'using config';
        } else {
            configAction = configBuilder.create;
            actionMessage = 'successfully created config';
        }
        if (config) {
            if (name) {
                startup_app.name = name;
            }
            if (url) {
                startup_app.url = url;
            }
        }

        //create or update the config
        configAction({
            startup_app: startup_app
        }, config).fail(function(err) {
            console.log(err);
        }).done(function() {
            console.log(actionMessage, path.resolve(config));
            callback();
        });
    });
}


module.exports = main;
