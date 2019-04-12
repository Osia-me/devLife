const validator = require('validator');
const isEmpty   = require('./isEmpty');

module.exports = function validateLogin(data) {
  let errors = {};
  data.text = !isEmpty(data.text) ? data.text : '';

  if(!validator.isLength(data.text, {min: 10, max: 500})){
    errors.text = 'Post must be between 10 and 500 characters';
  }

  if(validator.isEmpty(data.text)){
    errors.text = 'Text field is required';
  }

  return{
    errors,
    isValid: isEmpty(errors)
  };

};
