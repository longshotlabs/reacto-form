export default {
  nullValue: false,
  onChangeGetValue: (event) => event.target.checked || false,
  propNames: {
    errors: false,
    hasBeenValidated: false,
    isReadOnly: "disabled",
    onChanging: false,
    onSubmit: false,
    value: "checked",
  },
};
