"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Model {
    constructor(data) {
        this.data = data;
    }
    getData() {
        return this.data;
    }
    setData(newData) {
        this.data = newData;
    }
}
exports.default = Model;
