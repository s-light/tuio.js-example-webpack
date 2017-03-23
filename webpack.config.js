var path = require('path');

module.exports = {
    devtool: "source-map",
    entry: './src/index.js',
    // resolve: {
    //     alias: {
    //         // oscbrowser$: "osc/dist/osc-browser.js",
    //         // test: "node_modules/osc/dist/osc-browser.js"
    //         test$: "osc/dist/osc-browser.js"
    //     }
    // },
    // module: {
    //     noParse: /osc-browser/,
    //     // noParse: [
    //     //     // 'node_modules/osc/dist/osc-browser.js',
    //     //     '/src/osc-browser.js',
    //     // ],
    // },
    externals: {
        osc: 'osc'
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    }
};
