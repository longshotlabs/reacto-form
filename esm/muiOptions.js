export default {
  nullValue: "",
  onChangeGetValue: event => event.target.value,
  onChangingGetValue: event => event.target.value,
  propNames: {
    errors: false,
    hasBeenValidated: false,
    isReadOnly: "disabled",
    onChange: "onBlur",
    onChanging: "onChange",
    onSubmit: false
  }
};