// Mock Data

const baseMockData = {
    password: 'pwdMock11*',
    firstName: 'First Name',
    lastName: 'Last Name',
    receiveEmails: true //All props have values in the expected format
}

module.exports = { 
    mockPasswordChange: { //The updates that will be made to the data
        currentPassword: 'pwdMock11*',
        newPassword: 'pwdMock11*New',
        confirmNewPassword: 'pwdMock11*New'
    },
    usersPasswordPatchMockData: {
        email: 'usersPasswordPatchMockData@mock.com', //Email is different from others used on other test to avoid database conflicts
        ...baseMockData
    },
    usersPasswordPatchMockDataSecond: {
        email: 'usersPasswordPatchMockDataSecond@mock.com', //Email is different from others used on other test to avoid database conflicts
        ...baseMockData
    },
    usersPasswordPatchMockDataSuccess: {
        email: 'usersPasswordPatchMockDataSuccess@mock.com', //Email is different from others used on other test to avoid database conflicts
        ...baseMockData
    },
    usersPasswordPatchMockDataNotFound: {
        email: 'usersPasswordPatchMockDataNotFound@mock.com', //Email is different from others used on other test to avoid database conflicts
        ...baseMockData
    },
    usersPasswordPatchMockDataWrongPassword: {
        email: 'usersPasswordPatchMockDataWrongPassword@mock.com', //Email is different from others used on other test to avoid database conflicts
        ...baseMockData
    },
    usersPasswordPatchPendingMockData: {
        email: 'usersPasswordPatchPendingMockData@mock.com', //Email is different from others used on other test to avoid database conflicts
        ...baseMockData
    },
    usersPasswordPatchLockFailPwdMockData: {
        email: 'usersPasswordPatchLockFailPwdMockData@mock.com', //Email is different from others used on other test to avoid database conflicts
        ...baseMockData
    },
    usersPasswordPatchNotEnbMockData: {
        email: 'usersPasswordPatchNotEblMockData', //Email is different from others used on other test to avoid database conflicts
        ...baseMockData
    },
}
