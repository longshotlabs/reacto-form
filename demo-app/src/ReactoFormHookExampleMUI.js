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

async function mySubmissionFunction(...args) {
  console.log("Submit", ...args);
}

export default function ReactoFormHookExampleMUI() {
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
    onSubmit: mySubmissionFunction,
    validator,
  });

  return (
    <div className={classes.root}>
      <TextField
        label="First name"
        error={hasErrors(["firstName"])}
        fullWidth
        helperText={getFirstErrorMessage(["firstName"])}
        {...getInputProps("firstName", muiOptions)}
      />
      <TextField
        label="Last name"
        error={hasErrors(["lastName"])}
        fullWidth
        helperText={getFirstErrorMessage(["lastName"])}
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
