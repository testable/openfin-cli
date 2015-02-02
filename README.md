# OpenFin Runtime cli tool

[![Build Status](https://travis-ci.org/openfin/openfin-cli.svg?branch=master)](https://travis-ci.org/openfin/openfin-cli)

The OpenFin Cli tool will allow you to launch the OpenFin runtime given a url or a configuration file, it will also allow you to create configuration files by giving only name and url.

## Dependencies

You will need [Node.js](http://nodejs.org/) to use the tool and creating configs will work cross platform, but launching the OpenFin runtime is restricted to Windows at the moment.

## Install

```sh
$ npm install -g openfin-cli
```


## Usage

```sh
$ npm install --global openfin-cli
$ openfin --help
```

##Examples

####Launching an application

```sh
$ openfin --launch --url http://www.openfin.co
```

Shorthand
```sh
$ openfin -l -u http://www.openfin.co
```

####Creating a config file

```sh
$ openfin --config myconfig.json --name myAppName --url http://www.openfin.co
```

Shorthand
```sh
$ openfin  -c myconfig.json -n myAppName -u http://www.openfin.co
```

####Launching a given config file

```sh
$ openfin --launch --config myconfig.json
```

Shorthand
```sh
$ openfin -l -c myconfig.json
```

## License

MIT


[npm-url]: https://npmjs.org/package/openfin-cli
[npm-image]: https://badge.fury.io/js/openfin-cli.svg
[travis-url]: https://travis-ci.org/rdepena/openfin-cli
[travis-image]: https://travis-ci.org/rdepena/openfin-cli.svg?branch=master
[daviddm-url]: https://david-dm.org/rdepena/openfin-cli.svg?theme=shields.io
[daviddm-image]: https://david-dm.org/rdepena/openfin-cli
