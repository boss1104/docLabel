export const APP_NAME = 'doclabel';
export const FIRST_NAME_MAX_LENGTH = 30;
export const LAST_NAME_MAX_LENGTH = 150;
export const USER_NAME_MAX_LENGTH = 150;
export const NOT_VALID_CHARS = '$#&\\/| ';

export default {
  'user-register.register.register': 'Create an account',

  'user-register.first_name.required': 'Please enter your first name!',
  'user-register.first_name.length': `First name must be ${FIRST_NAME_MAX_LENGTH} characters long or fewer`,
  'user-register.first_name.placeholder': 'First name',

  'user-register.last_name.required': 'Please enter your last name!',
  'user-register.last_name.length': `Last name must be ${LAST_NAME_MAX_LENGTH} characters long or fewer`,
  'user-register.last_name.placeholder': 'Last name',

  'user-register.username.required': 'Please enter your user name!',
  'user-register.username.length': `User name must be between 3 and ${USER_NAME_MAX_LENGTH} characters long`,
  'user-register.username.wrong-format': 'Special characters and space are forbidden',
  'user-register.username.placeholder': 'Username',

  'user-register.email.required': 'Please enter your email!',
  'user-register.email.wrong-format': 'The email address is in the wrong format!',
  'user-register.email.placeholder': 'Email',

  'user-register.password.required': 'Please enter your password!',
  'user-register.password.placeholder': 'Password',
  'user-register.password.twice': 'The passwords entered twice do not match!',

  'user-register.strength.msg':
    "Please enter at least 6 characters and don't use passwords that are easy to guess.",
  'user-register.strength.strong': 'Strength: strong',
  'user-register.strength.medium': 'Strength: medium',
  'user-register.strength.short': 'Strength: too short',

  'user-register.confirm-password.required': 'Please confirm your password!',
  'user-register.confirm-password.placeholder': 'Confirm password',

  'user-register.register.sign-in': 'Already have an account?',
  'user-register.consent.content': `I accept receiving emails from ${APP_NAME}`,

  'user-register.birth.required': 'Please select your birth day!',
  'user-register.check-age': 'Check age',
};
