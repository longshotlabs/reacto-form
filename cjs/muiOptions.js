"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = {
  nullValue: "",
  onChangeGetValue: function onChangeGetValue(event) {
    return event.target.value;
  },
  onChangingGetValue: function onChangingGetValue(event) {
    return event.target.value;
  },
  propNames: {
    errors: false,
    hasBeenValidated: false,
    isReadOnly: "disabled",
    onChange: "onBlur",
    onChanging: "onChange",
    onSubmit: false
  }
};
exports.default = _default;