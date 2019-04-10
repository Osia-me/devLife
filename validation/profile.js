const validator = require('validator');
const isEmpty   = require('./isEmpty');

module.exports = function validateProfile(data) {
  let errors = {};

  //If there is null or undefined, empty object, etc. we are setting it to empty erting
  data.username = !isEmpty(data.username) ? data.username : '';
  data.status = !isEmpty(data.status) ? data.status : '';
  data.skills = !isEmpty(data.skills) ? data.skills : '';


  //Validate it with validator dep and isEmpty method
  if(!validator.isLength(data.username, {min:2, max:40})){
    errors.username = 'Username needs to be between 2 and 40 characters';
  }
  if(validator.isEmpty(data.username)){
    errors.username = 'Profile username is required'
  }
  if(validator.isEmpty(data.status)){
    errors.status = 'Status field is required'
  }
  if(validator.isEmpty(data.skills)){
    errors.skills = 'Skills field is required'
  }
  //Check URL and because it is not requires, it could be empty
  if(!isEmpty(data.website)){
    //If it not empty and checking if it has a URL code structure
    if(!validator.isURL(data.website)){
      errors.website = ' Not valid URL!';
    }
  }

  //Check URL and because it is not requires, it could be empty
  if(!isEmpty(data.facebook)){
    //If it not empty and checking if it has a URL code structure
    if(!validator.isURL(data.facebook)){
      errors.facebook = ' Not valid URL!';
    }
  }

  //Check URL and because it is not requires, it could be empty
  if(!isEmpty(data.linkedin)){
    //If it not empty and checking if it has a URL code structure
    if(!validator.isURL(data.linkedin)){
      errors.linkedin = ' Not valid URL!';
    }
  }

  //Check URL and because it is not requires, it could be empty
  if(!isEmpty(data.twitter)){
    //If it not empty and checking if it has a URL code structure
    if(!validator.isURL(data.twitter)){
      errors.twitter = ' Not valid URL!';
    }
  }

  //Check URL and because it is not requires, it could be empty
  if(!isEmpty(data.instagram)){
    //If it not empty and checking if it has a URL code structure
    if(!validator.isURL(data.instagram)){
      errors.instagram = ' Not valid URL!';
    }
  }

  return{
    errors,
    isValid: isEmpty(errors)
  };

};
