'use strict';
var configBuilder = require('openfin-config-builder'),
    openfinLauncher = require('openfin-launcher'),
    path = require('path'),
    fs = require('fs'),
    request = require('request'),
    meow;

function main(cli) {
    meow = cli;

    var flags = cli.flags,
        name = flags.n || flags.name,
        url = flags.u || flags.url,
        config = flags.c || flags.config || 'app.json',
        launch = flags.l || flags.launch;

    if (isEmpty(flags)) {
        console.log(cli.help);
        return;
    }

    try {
        writeToConfig(name, url, config, function(configObj) {
            if (launch) {
                launchOpenfin(config);
            }

            if (configObj) {
                fetchInstaller(flags, configObj);
            }
        });
    } catch (err) {
        onError('Failed:', err);
    }
}

function fetchInstaller(flags, configObj) {
    var installer = flags.i || flags.installer,
        hyperlink = flags.h || flags.hyperlink,
        destination = flags.d || flags.destination,
        name = flags.n || flags.name || configObj.startup_app.name || 'openfin',
        openfinInstaller = require('openfin-installer')(configObj),

        fetchOptions = {
            noExt : flags.noExt || null,
            rvmConfig : flags.rvmConfig || null,
            supportEmail : flags.supportEmail || null,
            dnl : flags.dnl || null,
            destination : flags.d || flags.destination,
            config: flags.c || null,
            name: name
        }

    if (destination) {
        openfinInstaller
            .fetchInstaller(fetchOptions)
            .then(function() {
                    console.log('Installer zip written to', destination);
                },
                function(reason) {
                    console.log(reason);
                });
    }

    if (hyperlink) {
        
        console.log('\n', openfinInstaller.generateInstallUrl(encodeURIComponent(name), fetchOptions.config,
            fetchOptions.noExt, fetchOptions.rvmConfig, fetchOptions.supportEmail, fetchOptions.dnl), '\n');
    }
}

function isURL(str) {
    return (typeof str === 'string') && str.lastIndexOf('http') >= 0;
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

function onError(message, err) {
    console.log(message, err);
    console.log(meow.help);
}

//will launch download the rvm and launch openfin
function launchOpenfin(config) {
    openfinLauncher.launchOpenFin({
        configPath: isURL(config) ? config : path.resolve(config),
        rvmGlobalCommand: 'OpenFinRVM'
    }).fail(function(err) {
        onError('launch failed', err);
    });
}

//write the specified config to disk.
function writeToConfig(name, url, config, callback) {
    if (isURL(config)) {
        request(config, function(err, response, body) {
            if (!err && response.statusCode === 200) {
                callback(JSON.parse(body));
            }
        });
        return;
    }

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
