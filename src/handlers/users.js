const appParameters = require('../config/parameters')

const usersGet = (req, res, next) => {
    try {


        //Under constructiob
        res.status(200).json({
            status: 'NA',
            message: 'Under construction'
        })

    }
    catch (error) {
        console.error(error)
        next({ error: error, message: appParameters.messages.msgErrSendToClient })
    }
}

module.exports = {
    usersGet
}