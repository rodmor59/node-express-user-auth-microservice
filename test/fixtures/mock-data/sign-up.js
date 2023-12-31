// Mock Data

module.exports = {
    signupMockData: {
        email: 'signup@mock.com', //Email is different from others used on other test to avoid database conflicts
        password: 'pwdMock11*',
        firstName: 'First Name',
        lastName: 'Last Name',
        receiveEmails: true //All props have values in the expected format
    },
    signupDupEmailMockData: {
        email: 'signupdupemail@mock.com',
        password: 'pwdMock12*',
        firstName: 'First Name',
        lastName: 'Last Name',
        receiveEmails: true
    }
}