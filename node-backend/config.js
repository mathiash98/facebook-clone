module.exports = {
    db: {
        mariadb: {
            host: '127.0.0.1',
            user: 'root',
            password: '',
            database: 'facebook-clone'
        },
        mongodb: {
            uri: 'mongodb://localhost:27017',
            dbName: 'facebook-clone'
        }
    },
    jwt: {
        secret: 'asasd??@£5nsfnasdf nm90iiojJH90iA^*#"xzAas!(JKIPOUN8#9+0p9JAIODHASDNCaijmlz"#¤'
    },
    port: {
        development: 8888
    }
};