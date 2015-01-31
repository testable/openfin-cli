'use strict';
var configBuilder = require('openfin-config-builder'),
    openfinLauncher = require('openfin-launcher'),
    path = require('path'),
    fs = require('fs');

function isEmpty(flags) {
    for (var key in flags) {
        if (flags.hasOwnProperty(key)) {
            return false;
        }
    }
    return true;
}
module.exports = function(str, flags) {
    var name = flags.n || flags.name,
        url = flags.u || flags.url,
        config = flags.c || flags.config || 'config.json',
        launch = flags.l || flags.launch,
        startup_app = {},
        configAction;

    if (isEmpty(flags)) {
        console.log('please see options: openfin --help');
        return;
    }
    // console.log('name is:', name || 'you did not specify a name, falling back to defaults');
    // console.log('url is:', url || 'you did not specify a url, falling back to defaults');
    // console.log('config file location is:', path.resolve(config));

    fs.exists(config, function(exists) {
        if (exists) {
            configAction = configBuilder.update;
        } else {
            configAction = configBuilder.create;
        }
        if (config) {
            if (name) {
                startup_app.name = name;
            }
            if (url) {
                startup_app.url = url;
            }
        }

        //we take the specified action.
        configAction({
            startup_app: startup_app
        }, config).then(function() {
            console.log('created config file:', path.resolve(config));
            if (launch) {
                openfinLauncher.launchOpenFin({
                    configPath: path.resolve(config)
                }).fail(function(err) {
                    console.log('launch failed', err);
                });
            }
        }).fail(function(err) {
            console.log(err);
        });
    });

};
