const auth = (req, res, next) => {
    console.log("Authenticating User")
    next()
}
module.exports = auth