var path = require('path');

module.exports = {
    devtool: "source-map",
    entry: './src/index.js',
    // resolve: {
    //     alias: {
    //         osc$: "osc/dist/osc-browser.js"
    //     }
    // },
    // module: {
    //     noParse: /osc/,
    // },
    externals: {
        osc: 'osc'
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    }
};
