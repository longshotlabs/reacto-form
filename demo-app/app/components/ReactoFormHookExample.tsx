import React from "react";
import { makeStyles } from '@mui/styles';
import Button from '@mui/material/Button';
import { ErrorsBlock, Field, Input } from "reacto-form-inputs";
import useReactoForm from "reacto-form/esm/useReactoForm";
import validator from "./formValidator";

const useStyles = makeStyles(theme => ({
  button: {
    marginTop: theme.spacing(1),
  },
  errors: {
    color: theme.palette.error.main
  },
  field: {
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
  input: {
    display: "block",
    lineHeight: 2,
    marginTop: theme.spacing(0.5),
    width: "100%"
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

export default function ReactoFormHookExample() {
  const classes = useStyles();

  const {
    getErrors,
    getInputProps,
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
      <Field name="firstName" className={classes.field} errors={getErrors(["firstName"])} label="First name">
        <Input className={classes.input} {...getInputProps("firstName")} />
        <ErrorsBlock errors={getErrors(["firstName"])} className={classes.errors} />
      </Field>
      <Field name="lastName" className={classes.field} errors={getErrors(["lastName"])} label="Last name">
        <Input className={classes.input} {...getInputProps("lastName")} />
        <ErrorsBlock errors={getErrors(["lastName"])} className={classes.errors} />
      </Field>
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
