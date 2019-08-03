import React, { useRef } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Form from "reacto-form/esm/Form";
import muiOptions from "reacto-form/esm/muiOptions";
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

export default function ReactoFormExample() {
  const classes = useStyles();
  const formRef = useRef(null);

  return (
    <div className={classes.root}>
      <Form
        inputOptions={muiOptions}
        logErrorsOnSubmit
        onChange={(formData) => { console.log("onChange", formData); }}
        onChanging={(formData) => { console.log("onChanging", formData); }}
        onSubmit={(formData) => { console.log("onSubmit", formData); }}
        ref={formRef}
        validator={validator}
      >
        <TextField
          error={formRef.current && formRef.current.hasErrors(["firstName"])}
          fullWidth
          helperText={formRef.current && formRef.current.getFirstErrorMessage(["firstName"])}
          label="First name"
          name="firstName"
        />
        <TextField
          error={formRef.current && formRef.current.hasErrors(["lastName"])}
          fullWidth
          helperText={formRef.current && formRef.current.getFirstErrorMessage(["lastName"])}
          label="Last name"
          name="lastName"
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
