import SimpleSchema from "simpl-schema";

const formSchema = new SimpleSchema({
  firstName: {
    type: String,
    min: 4
  },
  lastName: {
    type: String,
    min: 2
  },
  isMarried: {
    type: Boolean,
    optional: true
  }
});

const validator = formSchema.getFormValidator();

export default validator;
