// Mock Data

module.exports = {
    signinMockData: {
        email: 'signin@mock.com', //Email is different from others used on other test to avoid database conflicts
        password: 'pwdMock11*',
        firstName: 'First Name',
        lastName: 'Last Name',
        receiveEmails: true //All props have values in the expected format
    },
    signinPendingMockData: {
        email: 'signinpending@mock.com', //Email is different from others used on other test to avoid database conflicts
        password: 'pwdMock11*',
        firstName: 'First Name',
        lastName: 'Last Name',
        receiveEmails: true //All props have values in the expected format
    },
    signinLockFailPwdMockData: {
        email: 'signinulockfailpwd@mock.com', //Email is different from others used on other test to avoid database conflicts
        password: 'pwdMock11*',
        firstName: 'First Name',
        lastName: 'Last Name',
        receiveEmails: true //All props have values in the expected format
    },
    signinNotEnbMockData: {
        email: 'signinnotenb@mock.com', //Email is different from others used on other test to avoid database conflicts
        password: 'pwdMock11*',
        firstName: 'First Name',
        lastName: 'Last Name',
        receiveEmails: true //All props have values in the expected format
    }
}