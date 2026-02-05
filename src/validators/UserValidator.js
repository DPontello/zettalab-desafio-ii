const yup = require("yup");

const schema = yup.object({
  name: yup.string().trim().required(),
  email: yup.string().trim().email().required(),
  password: yup.string().min(6).required()
});

module.exports = schema;
