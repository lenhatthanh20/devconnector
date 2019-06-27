const Validator = require("validator");
const isEmptyCheck = require("./isEmpty");

module.exports = function validateExperienceInput(data) {
  let errors = {};

  data.title = isEmptyCheck(data.title) ? "" : data.title;
  data.company = isEmptyCheck(data.company) ? "" : data.company;
  data.from = isEmptyCheck(data.from) ? "" : data.from;

  if (Validator.isEmpty(data.title)) {
    errors.title = "Job title field is required";
  }

  if (Validator.isEmpty(data.company)) {
    errors.company = "Company field is required";
  }

  if (Validator.isEmpty(data.from)) {
    errors.from = "From date field is required";
  }

  return {
    errors,
    isValid: isEmptyCheck(errors)
  };
};
