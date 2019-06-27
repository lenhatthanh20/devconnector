const Validator = require("validator");
const isEmptyCheck = require("./isEmpty");

module.exports = function validateLoginInput(data) {
  let errors = {};

  data.email = isEmptyCheck(data.email) ? "" : data.email;

  data.password = isEmptyCheck(data.password) ? "" : data.password;

  if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }

  return {
    errors,
    isValid: isEmptyCheck(errors)
  };
};
