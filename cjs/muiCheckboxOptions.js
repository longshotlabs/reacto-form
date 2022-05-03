"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = {
  nullValue: false,
  onChangeGetValue: function onChangeGetValue(event) {
    return event.target.checked || false;
  },
  propNames: {
    errors: false,
    hasBeenValidated: false,
    isReadOnly: "disabled",
    onChanging: false,
    onSubmit: false,
    value: "checked"
  }
};
exports.default = _default;