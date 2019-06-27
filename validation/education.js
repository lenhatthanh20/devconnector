const Validator = require("validator");
const isEmptyCheck = require("./isEmpty");

module.exports = function validateEducationInput(data) {
  let errors = {};

  data.school = isEmptyCheck(data.school) ? "" : data.school;
  data.degree = isEmptyCheck(data.degree) ? "" : data.degree;
  data.fieldofstudy = isEmptyCheck(data.fieldofstudy) ? "" : data.fieldofstudy;
  data.from = isEmptyCheck(data.from) ? "" : data.from;

  if (Validator.isEmpty(data.school)) {
    errors.school = "School field is required";
  }

  if (Validator.isEmpty(data.degree)) {
    errors.degree = "Degree field is required";
  }

  if (Validator.isEmpty(data.fieldofstudy)) {
    errors.fieldofstudy = "Field of study field is required";
  }

  if (Validator.isEmpty(data.from)) {
    errors.from = "From date field is required";
  }

  return {
    errors,
    isValid: isEmptyCheck(errors)
  };
};
