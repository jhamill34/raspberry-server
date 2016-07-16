module.exports = {
    "development" : {
        "users_location" : "./test_users.txt",
        "secret" : "123456"
    },
    "production" : {
        "users_location" : "./users.txt",
        "secret" : process.env.HOME_SECRET
    }
}
