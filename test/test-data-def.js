//Constants for fields in test data
const tstEmail = 'test@example.com'
const tstPassword = 'pwdTst11*'
const tstFirstName = 'TestFirstName'
const tstLastName = 'TestLasttName'
const tstReceiveEmails = true
//const tstUsrStatus = 'test'
//Constants for duplicate email test data. This test case uses a unique email
const tstDupEmail = 'testdup@example.com'

//Test data object constants

module.exports.testUserData = {
    email: tstEmail,
    password: tstPassword,
    firstName: tstFirstName,
    lastName: tstLastName,
    receiveEmails: tstReceiveEmails //All props have values in the expected format
}
module.exports.testDupUserData = {
    email: tstDupEmail,
    password: tstPassword,
    firstName: tstFirstName,
    lastName: tstLastName,
    receiveEmails: tstReceiveEmails
}