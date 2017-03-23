/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_wolfy87_eventemitter__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_wolfy87_eventemitter___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_wolfy87_eventemitter__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_osc__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_osc___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_osc__);
// TUIO Protocoll support for javascript
// tries to interpret incomming osc messages as tuio messages.
// http://www.tuio.org/?specification
//
// requires
//     osc.js
//         https://github.com/colinbdclark/osc.js
//     EventEmitter
//         https://github.com/Olical/EventEmitter
//
// base usage of osc.js inspired by
// https://github.com/colinbdclark/osc.js-examples/blob/master/browser/web/socket-synth.js
//
// MIT License
// written by Stefan Krüger (github@s-light.eu)
//

// TUIO Event Names
//
// defined as:
// 'tuio' + profileName + eventType
//
// Possible default Event Names
// tuio2DcurAdd
// tuio2DcurSet
// tuio2DcurDel
// tuio2DobjAdd
// tuio2DobjSet
// tuio2DobjDel
// tuio2DblbAdd
// tuio2DblbSet
// tuio2DblbDel
//
// tuio25DcurAdd
// tuio25DcurSet
// tuio25DcurDel
// tuio25DobjAdd
// tuio25DobjSet
// tuio25DobjDel
// tuio25DblbAdd
// tuio25DblbSet
// tuio25DblbDel
//
// tuio3DcurAdd
// tuio3DcurSet
// tuio3DcurDel
// tuio3DobjAdd
// tuio3DobjSet
// tuio3DobjDel
// tuio3DblbAdd
// tuio3DblbSet
// tuio3DblbDel
//
//
// RegEx for event names:
// /tuio(?:2|25|3)D(?:cur|obj|blb)(?:Add|Set|Del)/
//
// Tests for Not Matching Regex
// tuio3DxxxAdd
// tuio3DcurPet
// tuio1DcurDel


// http://www.tuio.org/?specification
//
// 2D Interactive Surface
//
//     /tuio/2Dobj set s i x y a X Y A m r
//     /tuio/2Dcur set s x y X Y m
//     /tuio/2Dblb set s x y a w h f X Y A m r
//
// 2.5D Interactive Surface
//
//     /tuio/25Dobj set s i x y z a X Y Z A m r
//     /tuio/25Dcur set s x y z X Y Z m
//     /tuio/25Dblb set s x y z a w h f X Y Z A m r
//
// 3D Interactive Surface
//
//     /tuio/3Dobj set s i x y z a b c X Y Z A B C m r
//     /tuio/3Dcur set s x y z X Y Z m
//     /tuio/3Dblb set s x y z a b c w h d v X Y Z A B C m r
//
// custom profile
//
//     /tuio/_[formatString]
//
//
//  alligned overview
//      2D obj:  i x y   a             X Y   A     m r
//      2D cur:    x y                 X Y         m
//      2D blb:    x y   a     w h   f X Y   A     m r
//     25D obj:  i x y z a             X Y Z A     m r
//     25D cur:    x y z               X Y Z       m
//     25D blb:    x y z a     w h   f X Y Z A     m r
//      3D obj:  i x y z a b c         X Y Z A B C m r
//      3D cur:    x y z               X Y Z       m
//      3D blb:    x y z a b c w h d v X Y Z A B C m r
//
// semantic types of set messages
//     s          Session ID (temporary object ID)                         int32
//     i          Class ID (e.g. marker ID)                                int32
//     x, y, z    Position                                                 float32, range 0...1
//     a, b, c    Angle                                                    float32, range 0..2PI
//     w, h, d    Dimension                                                float32, range 0..1
//     f, v       Area, Volume                                             float32, range 0..1
//     X, Y ,Z    Velocity vector (motion speed & direction)               float32
//     A, B, C    Rotation velocity vector (rotation speed & direction)    float32
//     m          Motion acceleration                                      float32
//     r          Rotation acceleration                                    float32
//     P          Free parameter                                           type defined by OSC message header
//


// import osc from 'test';
// import osc from './osc-browser';


const TUIOEventRegEx = /tuio(?:2|25|3)D(?:cur|obj|blb)(?:Add|Set|Del)/;
/* harmony export (immutable) */ __webpack_exports__["b"] = TUIOEventRegEx;



class TUIOProfile {
    constructor({profileName, parserCallback}) {
        // this._profileName = profileName;
        // this._parserCallback = parserCallback;
        this.profileName = profileName;
        this.parserCallback = parserCallback;

        this.sessionIDs = new Map();
    }

    // 15.2.2.3 Getters and setters
    // http://exploringjs.com/es6/ch_classes.html#_inside-the-body-of-a-class-definition
    // get parserCallback() {
    //     return this._parserCallback;
    // }
    // set parserCallback(value) {
    //     this._parserCallback = value;
    // }
    //
    // get profileName() {
    //     return this._profileName;
    // }
    // set profileName(value) {
    //     this._profileName = value;
    // }

}
/* unused harmony export TUIOProfile */


// http://exploringjs.com/es6/ch_modules.html#_named-exports-several-per-module
// currently not supported by browsers?!
// import osc from 'osc-browser';
class TUIOReceiver extends __WEBPACK_IMPORTED_MODULE_0_wolfy87_eventemitter___default.a {
    constructor({ url="ws://localhost:3334"}) {
        // call construct for EventEmitter
        super();

        // init own things
        this.url = url;

        this.oscPort = new __WEBPACK_IMPORTED_MODULE_1_osc___default.a.WebSocketPort({
            url: this.url
        });

        // register listeners
        this.listen();

        // this.oscPort.socket.onmessage = function (e) {
        //     console.log("message", e);
        // };

        this.inputBuffer = this.createInputBuffer();

        this.eventTypes = [
            'Add',
            'Set',
            'Del',
        ];

        this.tuioProfiles = new Map();

        this.buildinProfiles = new Map();
        // 2D Interactive Surface
        this.buildinProfiles.set('2Dobj', TUIOReceiver.profileSetValuesParser2Dobj);
        this.buildinProfiles.set('2Dcur', TUIOReceiver.profileSetValuesParser2Dcur);
        this.buildinProfiles.set('2Dblb', TUIOReceiver.profileSetValuesParser2Dblb);
        // 2.5D Interactive Surface
        this.buildinProfiles.set('25Dobj', TUIOReceiver.profileSetValuesParser25Dobj);
        this.buildinProfiles.set('25Dcur', TUIOReceiver.profileSetValuesParser25Dcur);
        this.buildinProfiles.set('25Dblb', TUIOReceiver.profileSetValuesParser25Dblb);
        // 3D Interactive Surface
        this.buildinProfiles.set('3Dobj', TUIOReceiver.profileSetValuesParser3Dobj);
        this.buildinProfiles.set('3Dcur', TUIOReceiver.profileSetValuesParser3Dcur);
        this.buildinProfiles.set('3Dblb', TUIOReceiver.profileSetValuesParser3Dblb);
        // console.log("this.buildinProfiles", this.buildinProfiles);


        for (const [profileName, parserCallback] of this.buildinProfiles) {
            // console.log("profileName", profileName, "parserCallback", parserCallback);
            this.addTuioProfile({profileName, parserCallback});
        }
        // console.log("this.tuioProfiles", this.tuioProfiles);

    }

    // static staticMethod() {
    //     return 'classy';
    // }

    addTuioProfile({profileName, parserCallback}) {
        let success = false;
        if (profileName !== undefined) {
            // console.log(`profileName ${profileName}`);

            // only add new profile if profile does not exist!
            if (this.tuioProfiles.get(profileName) === undefined) {
                const newProfile = new TUIOProfile({profileName, parserCallback});
                // console.log("newProfile", newProfile);
                this.tuioProfiles.set(profileName, newProfile);

                let profileEvents = [];
                for (const eventType of this.eventTypes) {
                    // generate event names
                    profileEvents.push("tuio" + profileName + eventType);
                }
                // predefine Events so that you can use regex listeners
                // https://github.com/Olical/EventEmitter/blob/master/docs/guide.md#using-regular-expressions
                this.defineEvents(profileEvents);

                success = true;
            }
        }
        return success;
    }

    listen() {
        // this.oscPort.on("open", this.play.bind(this));
        // this.oscPort.on("open", function (msg) {
        //     console.log("open", msg);
        // });
        this.oscPort.on("message", this.handleMessage.bind(this));
        // this.oscPort.on("message", function (msg) {
        //     console.log("message", msg);
        // });
        // this.oscPort.on("close", function (msg) {
        //     console.log("close", msg);
        // });
        // this.oscPort.on("close", this.pause.bind(this));
    }

    handleMessage(oscMessage) {

        // implement statemaschine:
        // states:
        //  source  (optional)
        //  alive
        //  set (optional)
        //  ...
        //  set - set messages comming in for every sessionID that is mentioned in 'alive'
        //  fseq (global for sorce)
        // message type is found in first tuioMessage parameter. (tuioMessage[0])
        // if we get the fseq message we know the Bundle is finished.
        // so we can clear process it and clear the 'incomming buffer'
        // than we can process the content.

        // if we have an incomming buffer for every profile and objecttype its ok
        // if we get mixed up out of order packages..
        // eventually this is contra productive..
        // if we only have one input we can handle all incomming bundles with this.
        // this makes more sens because we only now that all messages belong together
        // if the they come in order and are finalized with a fseq message.
        // --> only one input!

        // ATTENTION!!!
        // DOES THIS REALLY WORK ?!?
        // can the handleMessage handler get called out of order ?!
        // --> is it an async call!!???
        // It is not clear how to test :-(
        // some more research needed!!

        // debug info
        // const dbid = Math.random();

        const address = oscMessage.address;
        // check for tuio message
        if (address.startsWith("/tuio/")) {
        // if (false) {
            // its a tuio message.
            const tuioMessage = oscMessage.args;

            // console.log("address", address, "tuioMessage", tuioMessage);
            // console.log(address, tuioMessage[0], tuioMessage[1]);
            const profile = address.slice(
                address.indexOf('/tuio/') + '/tuio/'.length
            );

            // if inputBuffer is clean set profile
            if (this.inputBuffer.profile === null) {
                this.inputBuffer.profile = profile;
            }

            // check if profile is correct
            // (that means we are still in the same bundle)
            if (this.inputBuffer.profile == profile) {
                // get message type
                const [messageType, ...messageParams] = tuioMessage;
                // console.log("messageType", messageType, "messageParams", messageParams);
                // console.log( dbid, "type", messageType);
                switch (messageType) {
                    case 'source': {
                        this.inputBuffer.source = messageParams[0];
                    } break;
                    case 'alive': {
                        this.inputBuffer.alive = messageParams;
                    } break;
                    case 'set': {
                        const [sessionID, ...values] = messageParams;
                        this.inputBuffer.sets.set(sessionID, values);
                    } break;
                    case 'fseq': {
                        this.inputBuffer.fseq = messageParams[0];

                        // full bundle received
                        this.inputBufferLast = this.inputBuffer;

                        // please process it!
                        this.processBundle(this.inputBufferLast);

                        // clean inputBuffer
                        this.inputBuffer = this.createInputBuffer();
                    } break;
                    default:
                        console.log(`unknown messageType ${messageType}.`);
                }
            } else {
                // someting went wrong!
                // order of received messages (bundle) not correct!!!
                // resetting inputBuffer
                console.log("received message bundle corrupt!!", this.inputBuffer);
                // console.log( dbid, "received message bundle corrupt!!", this.inputBuffer);
                // clean inputBuffer
                this.inputBuffer = this.createInputBuffer();
                // console.log(
                //     "?? ",
                //     "this.inputBuffer.profile", this.inputBuffer.profile,
                //     "profile", profile,
                //     "this.inputBuffer.profile == profile", this.inputBuffer.profile == profile
                // );
                // console.log(
                //     "?? ",
                //     "address", address,
                //     "tuioMessage", tuioMessage,
                //     "inputBuffer",  this.inputBuffer
                // );
            }

        } // end check for tuio message
    }

    processBundle(bundle) {
        // console.log("bundle", bundle);
        const profile = bundle.profile;
        // console.log("profile", profile);

        // // check for custom profile
        // if (!profile.startsWith("_")) {
        //     // find profile and object type
        //     // split profile in dimmension and type
        //     const re = /(\d+D)(\D{3})/i;
        //     // console.log("address.match(re)", address.match(re));
        //     // http://exploringjs.com/es6/ch_destructuring.html#_destructuring-returned-arrays
        //     const [, profileDimensions, objectType] = profile.match(re) || [];
        // }

        const tuioProfile = this.tuioProfiles.get(profile);
        if (tuioProfile) {
            // tuioProfile holds a Map with key==sessionID and value==object values
            // console.log("tuioProfile", tuioProfile);
            // console.log("bundle.alive", bundle.alive);

            // now we can check if we have 'new', 'known', 'removed' sessionIDs.
            // if new sessionID add it
            // if known sessionID update information
            // if removed sessionID delete from list

            // find new ones
            let newSessionIDs = [];
            for (const sessionID of bundle.alive) {
                if (tuioProfile.sessionIDs.get(sessionID) === undefined) {
                    newSessionIDs.push(sessionID);
                    tuioProfile.sessionIDs.set(sessionID, null);
                }
            }
            // if (newSessionIDs.length > 0) {
            //     console.log("newSessionIDs", newSessionIDs);
            // }

            // find removed ones
            let delSessionIDs = [];
            for (const [sessionID] of tuioProfile.sessionIDs) {
                if (!bundle.alive.includes(sessionID)) {
                    delSessionIDs.push(sessionID);
                    // tuioProfile.sessionIDs.delete(sessionID);
                    // actual deletetion is done after sending the event.
                }
            }
            // if (delSessionIDs.length > 0) {
            //     console.log("delSessionIDs", delSessionIDs);
            // }

            // set new values
            let setSessionIDs = [];
            for (const [sessionID, values] of bundle.sets) {
                // console.log("sessionID", sessionID, "values", values);
                // if (tuioProfile.get(sessionID)) {
                    // if we have no parserCallback we fallback to the original array.
                    let parsedValues = values;
                    if (tuioProfile.parserCallback) {
                        parsedValues = tuioProfile.parserCallback(
                            tuioProfile.profileName,
                            values
                        );
                        // console.log("parsedValues", parsedValues);
                    }
                    tuioProfile.sessionIDs.set(sessionID, parsedValues);
                    setSessionIDs.push(sessionID);
                // }
            }
            // if (setSessionIDs.length > 0) {
            //     console.log("setSessionIDs", setSessionIDs);
            // }


            // now we have a updated all things and can generate the events.

            // emit all 'Add' events
            for (const sessionID of newSessionIDs) {
                const values = tuioProfile.sessionIDs.get(sessionID);
                this.emitTuioEvent({
                    source: bundle.source,
                    eventType: 'Add',
                    profileName: tuioProfile.profileName,
                    sessionID: sessionID,
                    values: values
                });
            }

            // emit all 'Set' events
            for (const sessionID of setSessionIDs) {
                const values = tuioProfile.sessionIDs.get(sessionID);
                this.emitTuioEvent({
                    source: bundle.source,
                    eventType: 'Set',
                    profileName: tuioProfile.profileName,
                    sessionID: sessionID,
                    values: values
                });
            }

            // emit all 'Del' events
            for (const sessionID of delSessionIDs) {
                // get the last possible values
                const values = tuioProfile.sessionIDs.get(sessionID);
                // now we can safely delete the entry.
                tuioProfile.sessionIDs.delete(sessionID);
                this.emitTuioEvent({
                    source: bundle.source,
                    eventType: 'Del',
                    profileName: tuioProfile.profileName,
                    sessionID: sessionID,
                    values: values
                });
            }

            // console.log(
            //     "event handling done. ",
            //     "tuioProfile.sessionIDs", tuioProfile.sessionIDs
            // );

        } else {
            console.log(
                `profile ${profile} not found.` +
                `For Custom Profiles use _[formatString] ` +
                `and be sure to give a working parserCallback.`
            );
        }
    }

    emitTuioEvent({
        source,
        eventType,
        profileName,
        sessionID,
        values
    }) {
        const eventName = "tuio" + profileName + eventType;
        let eventObject = {
            origin: this,
            source: source,
            eventType: eventType,
            profileName: profileName,
            sessionID: sessionID,
            values: values
        };
        // https://github.com/Olical/EventEmitter/blob/master/docs/api.md#emit
        this.emit(eventName, eventObject);
        // console.log("eventName", eventName, "eventObject", eventObject);
    }

    open(){
        this.oscPort.open();
    }
    close(){
        this.oscPort.close();
    }

    // ******************************************
    // default profile parser

    static profileSetValuesParser2Dobj(profileName, values) {
        // 2D
        // obj: set s i x y a X Y A m r
        // TODO
        // console.log(
        //     "profileSetValuesParser2Dobj   ",
        //     "profileName", profileName,
        //     "values", values
        // );
        let result2Dobj = {
            i: values[0],
            x: values[1],
            y: values[2],
            a: values[3],
            X: values[4],
            Y: values[5],
            A: values[6],
            m: values[7],
            r: values[8],
        };
        return result2Dobj;
    }

    static profileSetValuesParser2Dcur(profileName, values) {
        // 2D
        // cur: set s x y X Y m
        let result2Dcur = {
            x: values[0],
            y: values[1],
            X: values[2],
            Y: values[3],
            m: values[4],
        };
        return result2Dcur;
    }

    static profileSetValuesParser2Dblb(profileName, values) {
        // 2D
        // blb: set s x y a w h f X Y A m r
        let result2Dobj = {
            x: values[0],
            y: values[1],
            a: values[2],
            w: values[3],
            h: values[4],
            f: values[5],
            X: values[6],
            Y: values[7],
            A: values[8],
            m: values[9],
            r: values[10],
        };
        return result2Dobj;
    }

    // handleProfile25D(profileName, values) {
    //     // 25D
    //     // obj: set s i x y z a X Y Z A m r
    //     // cur: set s x y z X Y Z m
    //     // blb: set s x y z a w h f X Y Z A m r
    //     // TODO
    // }
    //
    // handleProfile3D(profileName, values) {
    //     // 3D
    //     // obj: set s i x y z a b c X Y Z A B C m r
    //     // cur: set s x y z X Y Z m
    //     // blb: set s x y z a b c w h d v X Y Z A B C m r
    //     // TODO
    // }

    // ******************************************
    // Internal Helper

    createInputBuffer() {
        return {
            profile: null,
            source: null,
            alive: [],
            sets: new Map(),
            fseq: null
        };
    }


}
/* harmony export (immutable) */ __webpack_exports__["a"] = TUIOReceiver;



/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;/*!
 * EventEmitter v5.1.0 - git.io/ee
 * Unlicense - http://unlicense.org/
 * Oliver Caldwell - http://oli.me.uk/
 * @preserve
 */

;(function (exports) {
    'use strict';

    /**
     * Class for managing events.
     * Can be extended to provide event functionality in other classes.
     *
     * @class EventEmitter Manages event registering and emitting.
     */
    function EventEmitter() {}

    // Shortcuts to improve speed and size
    var proto = EventEmitter.prototype;
    var originalGlobalValue = exports.EventEmitter;

    /**
     * Finds the index of the listener for the event in its storage array.
     *
     * @param {Function[]} listeners Array of listeners to search through.
     * @param {Function} listener Method to look for.
     * @return {Number} Index of the specified listener, -1 if not found
     * @api private
     */
    function indexOfListener(listeners, listener) {
        var i = listeners.length;
        while (i--) {
            if (listeners[i].listener === listener) {
                return i;
            }
        }

        return -1;
    }

    /**
     * Alias a method while keeping the context correct, to allow for overwriting of target method.
     *
     * @param {String} name The name of the target method.
     * @return {Function} The aliased method
     * @api private
     */
    function alias(name) {
        return function aliasClosure() {
            return this[name].apply(this, arguments);
        };
    }

    /**
     * Returns the listener array for the specified event.
     * Will initialise the event object and listener arrays if required.
     * Will return an object if you use a regex search. The object contains keys for each matched event. So /ba[rz]/ might return an object containing bar and baz. But only if you have either defined them with defineEvent or added some listeners to them.
     * Each property in the object response is an array of listener functions.
     *
     * @param {String|RegExp} evt Name of the event to return the listeners from.
     * @return {Function[]|Object} All listener functions for the event.
     */
    proto.getListeners = function getListeners(evt) {
        var events = this._getEvents();
        var response;
        var key;

        // Return a concatenated array of all matching events if
        // the selector is a regular expression.
        if (evt instanceof RegExp) {
            response = {};
            for (key in events) {
                if (events.hasOwnProperty(key) && evt.test(key)) {
                    response[key] = events[key];
                }
            }
        }
        else {
            response = events[evt] || (events[evt] = []);
        }

        return response;
    };

    /**
     * Takes a list of listener objects and flattens it into a list of listener functions.
     *
     * @param {Object[]} listeners Raw listener objects.
     * @return {Function[]} Just the listener functions.
     */
    proto.flattenListeners = function flattenListeners(listeners) {
        var flatListeners = [];
        var i;

        for (i = 0; i < listeners.length; i += 1) {
            flatListeners.push(listeners[i].listener);
        }

        return flatListeners;
    };

    /**
     * Fetches the requested listeners via getListeners but will always return the results inside an object. This is mainly for internal use but others may find it useful.
     *
     * @param {String|RegExp} evt Name of the event to return the listeners from.
     * @return {Object} All listener functions for an event in an object.
     */
    proto.getListenersAsObject = function getListenersAsObject(evt) {
        var listeners = this.getListeners(evt);
        var response;

        if (listeners instanceof Array) {
            response = {};
            response[evt] = listeners;
        }

        return response || listeners;
    };

    function isValidListener (listener) {
        if (typeof listener === 'function' || listener instanceof RegExp) {
            return true
        } else if (listener && typeof listener === 'object') {
            return isValidListener(listener.listener)
        } else {
            return false
        }
    }

    /**
     * Adds a listener function to the specified event.
     * The listener will not be added if it is a duplicate.
     * If the listener returns true then it will be removed after it is called.
     * If you pass a regular expression as the event name then the listener will be added to all events that match it.
     *
     * @param {String|RegExp} evt Name of the event to attach the listener to.
     * @param {Function} listener Method to be called when the event is emitted. If the function returns true then it will be removed after calling.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.addListener = function addListener(evt, listener) {
        if (!isValidListener(listener)) {
            throw new TypeError('listener must be a function');
        }

        var listeners = this.getListenersAsObject(evt);
        var listenerIsWrapped = typeof listener === 'object';
        var key;

        for (key in listeners) {
            if (listeners.hasOwnProperty(key) && indexOfListener(listeners[key], listener) === -1) {
                listeners[key].push(listenerIsWrapped ? listener : {
                    listener: listener,
                    once: false
                });
            }
        }

        return this;
    };

    /**
     * Alias of addListener
     */
    proto.on = alias('addListener');

    /**
     * Semi-alias of addListener. It will add a listener that will be
     * automatically removed after its first execution.
     *
     * @param {String|RegExp} evt Name of the event to attach the listener to.
     * @param {Function} listener Method to be called when the event is emitted. If the function returns true then it will be removed after calling.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.addOnceListener = function addOnceListener(evt, listener) {
        return this.addListener(evt, {
            listener: listener,
            once: true
        });
    };

    /**
     * Alias of addOnceListener.
     */
    proto.once = alias('addOnceListener');

    /**
     * Defines an event name. This is required if you want to use a regex to add a listener to multiple events at once. If you don't do this then how do you expect it to know what event to add to? Should it just add to every possible match for a regex? No. That is scary and bad.
     * You need to tell it what event names should be matched by a regex.
     *
     * @param {String} evt Name of the event to create.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.defineEvent = function defineEvent(evt) {
        this.getListeners(evt);
        return this;
    };

    /**
     * Uses defineEvent to define multiple events.
     *
     * @param {String[]} evts An array of event names to define.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.defineEvents = function defineEvents(evts) {
        for (var i = 0; i < evts.length; i += 1) {
            this.defineEvent(evts[i]);
        }
        return this;
    };

    /**
     * Removes a listener function from the specified event.
     * When passed a regular expression as the event name, it will remove the listener from all events that match it.
     *
     * @param {String|RegExp} evt Name of the event to remove the listener from.
     * @param {Function} listener Method to remove from the event.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.removeListener = function removeListener(evt, listener) {
        var listeners = this.getListenersAsObject(evt);
        var index;
        var key;

        for (key in listeners) {
            if (listeners.hasOwnProperty(key)) {
                index = indexOfListener(listeners[key], listener);

                if (index !== -1) {
                    listeners[key].splice(index, 1);
                }
            }
        }

        return this;
    };

    /**
     * Alias of removeListener
     */
    proto.off = alias('removeListener');

    /**
     * Adds listeners in bulk using the manipulateListeners method.
     * If you pass an object as the second argument you can add to multiple events at once. The object should contain key value pairs of events and listeners or listener arrays. You can also pass it an event name and an array of listeners to be added.
     * You can also pass it a regular expression to add the array of listeners to all events that match it.
     * Yeah, this function does quite a bit. That's probably a bad thing.
     *
     * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to add to multiple events at once.
     * @param {Function[]} [listeners] An optional array of listener functions to add.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.addListeners = function addListeners(evt, listeners) {
        // Pass through to manipulateListeners
        return this.manipulateListeners(false, evt, listeners);
    };

    /**
     * Removes listeners in bulk using the manipulateListeners method.
     * If you pass an object as the second argument you can remove from multiple events at once. The object should contain key value pairs of events and listeners or listener arrays.
     * You can also pass it an event name and an array of listeners to be removed.
     * You can also pass it a regular expression to remove the listeners from all events that match it.
     *
     * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to remove from multiple events at once.
     * @param {Function[]} [listeners] An optional array of listener functions to remove.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.removeListeners = function removeListeners(evt, listeners) {
        // Pass through to manipulateListeners
        return this.manipulateListeners(true, evt, listeners);
    };

    /**
     * Edits listeners in bulk. The addListeners and removeListeners methods both use this to do their job. You should really use those instead, this is a little lower level.
     * The first argument will determine if the listeners are removed (true) or added (false).
     * If you pass an object as the second argument you can add/remove from multiple events at once. The object should contain key value pairs of events and listeners or listener arrays.
     * You can also pass it an event name and an array of listeners to be added/removed.
     * You can also pass it a regular expression to manipulate the listeners of all events that match it.
     *
     * @param {Boolean} remove True if you want to remove listeners, false if you want to add.
     * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to add/remove from multiple events at once.
     * @param {Function[]} [listeners] An optional array of listener functions to add/remove.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.manipulateListeners = function manipulateListeners(remove, evt, listeners) {
        var i;
        var value;
        var single = remove ? this.removeListener : this.addListener;
        var multiple = remove ? this.removeListeners : this.addListeners;

        // If evt is an object then pass each of its properties to this method
        if (typeof evt === 'object' && !(evt instanceof RegExp)) {
            for (i in evt) {
                if (evt.hasOwnProperty(i) && (value = evt[i])) {
                    // Pass the single listener straight through to the singular method
                    if (typeof value === 'function') {
                        single.call(this, i, value);
                    }
                    else {
                        // Otherwise pass back to the multiple function
                        multiple.call(this, i, value);
                    }
                }
            }
        }
        else {
            // So evt must be a string
            // And listeners must be an array of listeners
            // Loop over it and pass each one to the multiple method
            i = listeners.length;
            while (i--) {
                single.call(this, evt, listeners[i]);
            }
        }

        return this;
    };

    /**
     * Removes all listeners from a specified event.
     * If you do not specify an event then all listeners will be removed.
     * That means every event will be emptied.
     * You can also pass a regex to remove all events that match it.
     *
     * @param {String|RegExp} [evt] Optional name of the event to remove all listeners for. Will remove from every event if not passed.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.removeEvent = function removeEvent(evt) {
        var type = typeof evt;
        var events = this._getEvents();
        var key;

        // Remove different things depending on the state of evt
        if (type === 'string') {
            // Remove all listeners for the specified event
            delete events[evt];
        }
        else if (evt instanceof RegExp) {
            // Remove all events matching the regex.
            for (key in events) {
                if (events.hasOwnProperty(key) && evt.test(key)) {
                    delete events[key];
                }
            }
        }
        else {
            // Remove all listeners in all events
            delete this._events;
        }

        return this;
    };

    /**
     * Alias of removeEvent.
     *
     * Added to mirror the node API.
     */
    proto.removeAllListeners = alias('removeEvent');

    /**
     * Emits an event of your choice.
     * When emitted, every listener attached to that event will be executed.
     * If you pass the optional argument array then those arguments will be passed to every listener upon execution.
     * Because it uses `apply`, your array of arguments will be passed as if you wrote them out separately.
     * So they will not arrive within the array on the other side, they will be separate.
     * You can also pass a regular expression to emit to all events that match it.
     *
     * @param {String|RegExp} evt Name of the event to emit and execute listeners for.
     * @param {Array} [args] Optional array of arguments to be passed to each listener.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.emitEvent = function emitEvent(evt, args) {
        var listenersMap = this.getListenersAsObject(evt);
        var listeners;
        var listener;
        var i;
        var key;
        var response;

        for (key in listenersMap) {
            if (listenersMap.hasOwnProperty(key)) {
                listeners = listenersMap[key].slice(0);

                for (i = 0; i < listeners.length; i++) {
                    // If the listener returns true then it shall be removed from the event
                    // The function is executed either with a basic call or an apply if there is an args array
                    listener = listeners[i];

                    if (listener.once === true) {
                        this.removeListener(evt, listener.listener);
                    }

                    response = listener.listener.apply(this, args || []);

                    if (response === this._getOnceReturnValue()) {
                        this.removeListener(evt, listener.listener);
                    }
                }
            }
        }

        return this;
    };

    /**
     * Alias of emitEvent
     */
    proto.trigger = alias('emitEvent');

    /**
     * Subtly different from emitEvent in that it will pass its arguments on to the listeners, as opposed to taking a single array of arguments to pass on.
     * As with emitEvent, you can pass a regex in place of the event name to emit to all events that match it.
     *
     * @param {String|RegExp} evt Name of the event to emit and execute listeners for.
     * @param {...*} Optional additional arguments to be passed to each listener.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.emit = function emit(evt) {
        var args = Array.prototype.slice.call(arguments, 1);
        return this.emitEvent(evt, args);
    };

    /**
     * Sets the current value to check against when executing listeners. If a
     * listeners return value matches the one set here then it will be removed
     * after execution. This value defaults to true.
     *
     * @param {*} value The new value to check for when executing listeners.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.setOnceReturnValue = function setOnceReturnValue(value) {
        this._onceReturnValue = value;
        return this;
    };

    /**
     * Fetches the current value to check against when executing listeners. If
     * the listeners return value matches this one then it should be removed
     * automatically. It will return true by default.
     *
     * @return {*|Boolean} The current value to check for or the default, true.
     * @api private
     */
    proto._getOnceReturnValue = function _getOnceReturnValue() {
        if (this.hasOwnProperty('_onceReturnValue')) {
            return this._onceReturnValue;
        }
        else {
            return true;
        }
    };

    /**
     * Fetches the events object and creates one if required.
     *
     * @return {Object} The events storage object.
     * @api private
     */
    proto._getEvents = function _getEvents() {
        return this._events || (this._events = {});
    };

    /**
     * Reverts the global {@link EventEmitter} to its previous value and returns a reference to this version.
     *
     * @return {Function} Non conflicting EventEmitter class.
     */
    EventEmitter.noConflict = function noConflict() {
        exports.EventEmitter = originalGlobalValue;
        return EventEmitter;
    };

    // Expose the class either via AMD, CommonJS or the global object
    if (true) {
        !(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
            return EventEmitter;
        }.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    }
    else if (typeof module === 'object' && module.exports){
        module.exports = EventEmitter;
    }
    else {
        exports.EventEmitter = EventEmitter;
    }
}(this || {}));


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__tuio__ = __webpack_require__(0);


// ./node_modules/webpack/bin/webpack.js --progress




// import osc from 'test';
// import osc from '../node_modules/osc/dist/osc-browser.js';
// import osc from './osc-browser';


class TUIOTestApp {

    constructor() {
        console.log("construct TUIOTestApp.");

        this._initTUIO();

    }

    _initTUIO() {
        console.log("init TUIO things.");

        const tuioSource = "ws://" + document.location.hostname + ":3334";
        console.log("setup for tuioSource", tuioSource);

        this.tuioInput = new __WEBPACK_IMPORTED_MODULE_0__tuio__["a" /* TUIOReceiver */]({ url: tuioSource });

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
        this.tuioInput.addListener(__WEBPACK_IMPORTED_MODULE_0__tuio__["b" /* TUIOEventRegEx */], (event) => {
            console.log("tuio event:", event);
        });

    }

}
/* harmony export (immutable) */ __webpack_exports__["default"] = TUIOTestApp;



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


/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = osc;

/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map