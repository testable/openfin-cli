'use strict';
var configBuilder = require('openfin-config-builder'),
    openfinLauncher = require('openfin-launcher'),
    path = require('path'),
    fs = require('fs');

function main(str, flags) {
    var name = flags.n || flags.name,
        url = flags.u || flags.url,
        config = flags.c || flags.config || 'app.json',
        launch = flags.l || flags.launch;

    if (isEmpty(flags)) {
        console.log('please see options: openfin --help');
        return;
    }

    writeToConfig(name, url, config, function(configObj) {
        if (launch) {
            launchOpenfin(config);
        }

        fetchInstaller(flags, configObj);
    });
}

function fetchInstaller (flags, configObj){
    var installer = flags.i || flags.installer,
        hyperlink = flags.h || flags.hyperlink,
        destination = flags.d || flags.destination,
        name = flags.n || flags.name || configObj.startup_app.name || 'openfin',
        openfinInstaller = require('openfin-installer')(configObj);

    if (destination){
        openfinInstaller
            .fetchInstaller({
                destination: destination
            })
            .then(function(){
                console.log('Installer zip written to', destination);
            },
            function(reason){
                console.log(reason);
            });
    }

    if (hyperlink){
        console.log('\n',openfinInstaller.generateInstallUrl(name, installer), '\n');
    }
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
        configPath: path.resolve(config),
        rvmGlobalCommand: 'OpenFinRVM'
    }).fail(function(err) {
        console.log('launch failed', err);
    });
}

//write the specified config to disk.
function writeToConfig(name, url, config, callback) {
    var startup_app = {},
        shortcut = {},
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
                shortcut.name = name;
            }
            if (url) {
                startup_app.url = url;
            }
        }

        //create or update the config
        configAction({
            startup_app: startup_app,
            shortcut: shortcut
        }, config).fail(function(err) {
            console.log(err);
        }).done(function(configObj) {
            console.log(actionMessage, path.resolve(config));
            callback(configObj);
        });
    });
}


module.exports = main;
