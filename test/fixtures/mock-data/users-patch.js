// Mock Data

module.exports = {
    usersPatchMockData: {
        email: 'usersPatchMockData@mock.com', //Email is different from others used on other test to avoid database conflicts
        password: 'pwdMock11*',
        firstName: 'First Name',
        lastName: 'Last Name',
        receiveEmails: true //All props have values in the expected format
    },
    usersPatchMockDataSecond: {
        email: 'usersPatchMockDataSecond@mock.com', //Email is different from others used on other test to avoid database conflicts
        password: 'pwdMock11*',
        firstName: 'First Name',
        lastName: 'Last Name',
        receiveEmails: true //All props have values in the expected format
    },
    usersPatchMockDataSuccess: {
        email: 'usersPatchMockDataSuccess@mock.com', //Email is different from others used on other test to avoid database conflicts
        password: 'pwdMock11*',
        firstName: 'First Name',
        lastName: 'Last Name',
        receiveEmails: true //All props have values in the expected format
    },
    usersPatchMockDataNotFound: {
        email: 'usersPatchMockDataNotFound@mock.com', //Email is different from others used on other test to avoid database conflicts
        password: 'pwdMock11*',
        firstName: 'First Name',
        lastName: 'Last Name',
        receiveEmails: true //All props have values in the expected format
    },
    usersPatchPendingMockData: {
        email: 'usersPatchPendingMockData@mock.com', //Email is different from others used on other test to avoid database conflicts
        password: 'pwdMock11*',
        firstName: 'First Name',
        lastName: 'Last Name',
        receiveEmails: true //All props have values in the expected format
    },
    usersPatchLockFailPwdMockData: {
        email: 'usersPatchLockFailPwdMockData@mock.com', //Email is different from others used on other test to avoid database conflicts
        password: 'pwdMock11*',
        firstName: 'First Name',
        lastName: 'Last Name',
        receiveEmails: true //All props have values in the expected format
    },
    usersPatchNotEnbMockData: {
        email: 'usersPatchNotEblMockData', //Email is different from others used on other test to avoid database conflicts
        password: 'pwdMock11*',
        firstName: 'First Name',
        lastName: 'Last Name',
        receiveEmails: true //All props have values in the expected format
    },
    usersPatchMockDataUpdates: { //The updates that will be made to the data
        firstName: 'Updated First Name',
        lastName: 'Updated Last Name',
        receiveEmails: false //All props have values in the expected format
    }
}
