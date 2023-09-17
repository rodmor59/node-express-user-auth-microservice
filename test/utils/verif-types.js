module.exports = {
    isValidDate: (dateString) => {
        const date = new Date(dateString)
        return !isNaN(date)
    }
} 