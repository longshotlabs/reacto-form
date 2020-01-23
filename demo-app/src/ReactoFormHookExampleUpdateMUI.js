import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import muiOptions from "reacto-form/esm/muiOptions";
import useReactoForm from "reacto-form/esm/useReactoForm";
import validator from "./formValidator";

const useStyles = makeStyles(theme => ({
  button: {
    marginTop: theme.spacing(1),
  },
  root: {
    marginLeft: "auto",
    marginRight: "auto",
    width: "50%",
  }
}));

export default function ReactoFormHookExampleUpdateMUI(props) {
  const {
    setUpdateFormData,
    updateFormData
  } = props;

  const classes = useStyles();

  const {
    getFirstErrorMessage,
    getInputProps,
    hasErrors,
    submitForm
  } = useReactoForm({
    logErrorsOnSubmit: true,
    onChange: (val) => { console.log("onChangeForm", val); },
    onChanging: (val) => { console.log("onChangingForm", val); },
    onSubmit(formData) {
      setUpdateFormData(formData);
    },
    validator,
    value: updateFormData,
  });

  return (
    <div className={classes.root}>
      <TextField
        label="First name"
        error={hasErrors(["firstName"])}
        fullWidth
        helperText={getFirstErrorMessage(["firstName"])}
        onKeyPress={(event) => {
          if (event.key === "Enter") submitForm();
        }}
        {...getInputProps("firstName", muiOptions)}
      />
      <TextField
        label="Last name"
        error={hasErrors(["lastName"])}
        fullWidth
        helperText={getFirstErrorMessage(["lastName"])}
        onKeyPress={(event) => {
          if (event.key === "Enter") submitForm();
        }}
        {...getInputProps("lastName", muiOptions)}
      />
      <Button
        className={classes.button}
        color="primary"
        onClick={submitForm}
        variant="contained"
      >
        Submit
      </Button>
    </div>
  );
}
