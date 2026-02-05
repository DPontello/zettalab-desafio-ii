const yup = require("yup");

const allowedStatus = ["PENDING", "COMPLETED"];

const schema = yup.object({
  title: yup.string().trim().required(),
  description: yup.string().trim().required(),
  status: yup.string().oneOf(allowedStatus).notRequired()
});

const updateSchema = yup.object({
  title: yup.string().trim().notRequired(),
  description: yup.string().trim().notRequired(),
  status: yup.string().oneOf(allowedStatus).notRequired()
});

module.exports = { schema, updateSchema, allowedStatus };
