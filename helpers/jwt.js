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
            {url:/\/api\/v1\/products(.*)/ , methods: ['GET',"POST","PUT", 'OPTIONS']},
            {url:/\/api\/v1\/registrationRequest(.*)/ , methods: ['GET',"POST","PUT", 'OPTIONS']},
            {url:/\/api\/v1\/licenceInfo(.*)/ , methods: ['GET',"POST","PUT", 'OPTIONS']},
            {url:/\/public\/productsImages/ , methods: ['GET', 'OPTIONS']},
            {url: /\/api\/v1\/orders(.*)/,methods: ['GET', 'OPTIONS', 'POST']},
            {url:/\/api\/v1\/categories(.*)/ , methods: ['GET',"POST", 'OPTIONS']},
            {url:/\/api\/v1\/users(.*)/ , methods: ['GET', 'OPTIONS']},
            
            // {url:/\/api\/v1\/users(.*)/ , methods: ['GET', 'OPTIONS']},

            `${api}/users/login`,
            `${api}/users/register`,
            `${api}/registrationRequest/pharmacy`,
            `${api}/licenceInfo/licence`

            
        ]
    })


}

async function isRevoked(req, payload, done){
    if(!payload.isAdmin){
        done(null, true);    
    }
    done();
    // else if (!payload.isPharmacy ){
    //     done(null, true);
    // }
    // if(!payload.isPharmacy){
    //     done(null, true)
    // }
   
}

module.exports = authJwt