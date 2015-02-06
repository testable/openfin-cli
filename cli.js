#!/usr/bin/env node

'use strict';
var meow = require('meow'),
    openfinCli = require('./');

var cli = meow({
    help: [
        'OpenFin cli is capable of launching Application, and creating OpenFin config files.',
        'Options:',
        '-c --config <config file>',
        '-n --name <application name to be used in the config>',
        '-u --url <application url>',
        '-l --launch launch this configuration',

        '-i --installer a url to an OpenFin config file ',
        '-h --hyperlink return a url to stdout pointing to the OpenFin installer webservice',
        '-d --destination write the results of -i to disk using this path',

        '--version current version of the tool',
        'Example',
        '  openfin -l -c myconfig.json -u http://www.openfin.co'
    ].join('\n')
});
openfinCli(cli.input, cli.flags);
