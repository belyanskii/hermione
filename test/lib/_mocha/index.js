'use strict';

const EventEmitter = require('events').EventEmitter;
const Suite = require('./suite');
const Test = require('./test');

class Mocha extends EventEmitter {
    constructor(options) {
        super();

        this._suite = Suite.create(null, '');
        this.constructor._instance = this;

        this.files = [];
        sinon.spy(this, 'addFile');
        this.loadFiles = sinon.stub();
        this.fullTrace = sinon.stub();
        this.reporter = sinon.stub().callsFake((fn) => this._reporter = fn);

        this.constructorArgs = options;
    }

    static get lastInstance() {
        return this._instance;
    }

    static get Test() {
        return Test;
    }

    static get Suite() {
        return Suite;
    }

    run(cb) {
        const runner = new EventEmitter();
        if (this._reporter) {
            new this._reporter(runner); // eslint-disable-line no-new
        }
        return this.suite.run(runner).then(cb);
    }

    get suite() {
        return this._suite;
    }

    updateSuiteTree(cb) {
        this._suite = cb(this._suite);
        return this;
    }

    addFile(file) {
        this.files.push(file);
    }
}

module.exports = Mocha;
