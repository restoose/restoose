const { omit } = require('lodash');
const { mountApp } = require('./adapter');
const { normalizeProcessVariables } = require('./util');

const CONFIG_FILE = 'astronode.config.json';
const ROUTE_FILE = 'astronode.routes.json';

global.astronode = {
    ROOT_PATH: process.cwd(),
    middlewares: {},
    controllers: {},
    plugins: {},
    models: {},
    config: {}
};

exports.runServerFunction = adapter => {
    try {
        require.resolve(astronode.MODULES_PATH);
        require(astronode.MODULES_PATH).server(adapter.app);
    } catch (e) {
        // TODO
    }

    return adapter;
};

exports.initServer = adapter => {
    return adapter.start();
};


exports.runAstronode = ({ configFile = CONFIG_FILE, routeFile = ROUTE_FILE }) => {
    configFile = `${astronode.ROOT_PATH}/${configFile}`;
    routeFile = `${astronode.ROOT_PATH}/${routeFile}`;

    const configs = require(configFile);
    const route = require(routeFile);

    const normalizedConfig = normalizeProcessVariables(configs);
    const normalizedRoute = normalizeProcessVariables(route);

    astronode.MODULES_PATH = `${astronode.ROOT_PATH}/${normalizedConfig.application.modules}`;
    astronode.config = omit(normalizedConfig, 'database', 'modules', 'middleware');

    return mountApp(normalizedConfig, normalizedRoute);
};