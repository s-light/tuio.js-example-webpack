

// ./node_modules/webpack/bin/webpack.js --progress


import {TUIOReceiver, TUIOEventRegEx} from './tuio';

import osc from './tuio';


export default class TUIOTestApp {

    constructor() {
        console.log("construct TUIOTestApp.");

        this._initTUIO();

    }

    _initTUIO() {
        console.log("init TUIO things.");

        const tuioSource = "ws://" + document.location.hostname + ":3334";
        console.log("setup for tuioSource", tuioSource);

        this.tuioInput = new TUIOReceiver({ url: tuioSource });

        this.tuioInput.oscPort.on("open", (msg) => {
            // console.log("osc open", msg);
            console.log("osc open");
        });

        this.tuioInput.oscPort.on("close", (msg) => {
            // console.log("osc close", msg);
            console.log("osc close");
        });

        this.tuioInput.open();


        // catch all tuio 2D|25D|3D  cur|obj|blb  Add|Set|Del events
        // console.log("TUIOEventRegEx", TUIOEventRegEx);
        this.tuioInput.addListener(TUIOEventRegEx, (event) => {
            console.log("tuio event:", event);
        });

    }

}


// https://developer.mozilla.org/en-US/docs/Web/Events/DOMContentLoaded
// The DOMContentLoaded event is fired when the initial HTML document has been
// completely loaded and parsed, without waiting for stylesheets, images,
// and subframes to finish loading.
// A very different event 'load' should be used only to detect a fully-loaded page.
// It is an incredibly popular mistake to use load where DOMContentLoaded
// would be much more appropriate, so be cautious.

let myapp = {};

window.addEventListener("load", function(event) {
    var canvas = document.getElementById('myCanvas');
    // myapp = new AnimationTestApp(canvas);
    myapp = new TUIOTestApp(canvas);
    // myapp = new MainApp(canvas);
});
