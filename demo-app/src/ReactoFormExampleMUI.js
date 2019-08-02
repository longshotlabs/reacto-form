import React, { useRef } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { Form } from "reacto-form";
import validator from "./formValidator";

TextField.isFormInput = true;

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

export default function ReactoFormExample() {
  const classes = useStyles();
  const formRef = useRef(null);

  return (
    <div className={classes.root}>
      <Form
        logErrorsOnSubmit
        onSubmit={mySubmissionFunction}
        ref={formRef}
        validator={validator}
      >
        <TextField
          name="firstName"
          label="First name"
          fullWidth
        />
        <TextField
          name="lastName"
          label="Last name"
          fullWidth
        />
        <Button
          className={classes.button}
          color="primary"
          onClick={() => formRef.current && formRef.current.submit()}
          variant="contained"
        >
          Submit
        </Button>
      </Form>
    </div>
  );
}
