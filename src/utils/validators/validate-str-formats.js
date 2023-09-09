//String constants
const errMsgInvalidName = 'Invalid name. First names and last names can contain only letters, numbers and special characters such as Á-ú and Ä-ü,'
const errMsgPwdDoesNotContainNumber = 'password must contain at least one number'
const errMsgPwdDoesNotContainLowerCase = 'password must contain at least one lowercase letter'
const errMsgPwdDoesNotContainUpperCase = 'password must contain at least one uppercase letter'
const errMsgPwdDoesNotContainSpecialChar = 'password must contain at least one special character'

//Regex patter for validating names. Can contain letters, numbers, Á-ú and Ä-ü special and blank spaces
module.exports.nameRegex = /^[A-Za-z0-9Á-úÄ-ü ']+$/

//Name format check (First names and last names) can contain numbers
module.exports.nameHasError = (name) => {
    let re = /^[A-Za-z0-9Á-úÄ-ü ']+$/
    if (!re.test(name)) {
        return errMsgInvalidName
    }
    return false
}

/*Regex patter for validating passwords
    passwords must contain at least:
    - One number
    - One lowercase letter
    - one uppercase letter
    - one special character
*/
module.exports.pwdRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[`!@#%$&^*()])[A-Za-z0-9`!@#%$&^*()]+$/

// password format check
module.exports.passwordHasError = (pwd) => {
    // at least one numeric value
    let re = /[0-9]/
    if (!re.test(pwd)) {
        return errMsgPwdDoesNotContainNumber
    }

    // at least one lowercase letter
    re = /[a-z]/
    if (!re.test(pwd)) {
        return errMsgPwdDoesNotContainLowerCase
    }

    // at least one uppercase letter
    re = /[A-Z]/
    if (!re.test(pwd)) {
        return errMsgPwdDoesNotContainUpperCase
    }

    // at least one special character
    re = /[`!@#%$&^*()]+/
    if (!re.test(pwd)) {
        return errMsgPwdDoesNotContainSpecialChar
    }
    return false
}