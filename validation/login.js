const validator = require('validator');
const isEmpty   = require('./isEmpty');

module.exports = function validateLogin(data) {
  let errors = {};
  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';



  if(validator.isEmpty(data.email)){
    errors.email = 'Email is required';
  }
  if(validator.isEmpty(data.email)){
    errors.email = 'Email is required';
  }
  if(!validator.isEmail(data.email)){
    errors.email = 'Email is not correct';
  }
  if(validator.isEmpty(data.password)){
    errors.password = 'Password field is required';
  }

  return{
    errors,
    isValid: isEmpty(errors)
  };

};
