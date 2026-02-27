import { useRef } from "react";
import { makeStyles } from '@mui/styles';
import Button from '@mui/material/Button';
import { Form } from "reacto-form";
import { ErrorsBlock, Field, Input } from "reacto-form-inputs";
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
        <Field name="firstName" className={classes.field} label="First name">
          <Input name="firstName"className={classes.input} />
          <ErrorsBlock names={["firstName"]} className={classes.errors} />
        </Field>
        <Field name="lastName" className={classes.field} label="Last name">
          <Input name="lastName" className={classes.input} />
          <ErrorsBlock names={["lastName"]} className={classes.errors} />
        </Field>
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
