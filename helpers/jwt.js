const expressJwt = require("express-jwt");

function authJwt (){
    const secret = process.env.SECRET
    const api = process.env.API_URL
    return expressJwt({
        secret,
        algorithms: ['HS256'],
        isRevoked: isRevoked
    }).unless({
        path: [
            {url:/\/api\/v1\/products(.*)/ , methods: ['GET', 'OPTIONS']},
            {url:/\/public\/productsImages/ , methods: ['GET', 'OPTIONS']},
            {url:/\/api\/v1\/categories(.*)/ , methods: ['GET', 'OPTIONS']},
            // {url:/\/api\/v1\/users(.*)/ , methods: ['GET', 'OPTIONS']},
            
            `${api}/users/login`,
            `${api}/users/register`
        ]
    })

}

async function isRevoked(req, payload, done){
    if(!payload.isAdmin ){
        done(null, true);
    }
    // if(!payload.isPharmacy){
    //     done(null, true)
    // }
    done();

}

module.exports = authJwt