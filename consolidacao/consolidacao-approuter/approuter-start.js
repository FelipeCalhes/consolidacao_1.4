const approuter = require('@sap/approuter');
var ar = approuter();
var xssec = require('@sap/xssec');
var xsenv = require('@sap/xsenv');
const jwtDecode = require('jwt-decode');
function getUserInfo(token){
    return new Promise((resolve, reject) => {
        xssec.createSecurityContext(token, xsenv.getServices({
            uaa: {
                tag: 'xsuaa'
            }
        }).uaa,
        function (error, securityContext){
            if (error){
                console.log('Erro ao criar o Secury Context');
                return;
            }
            resolve(securityContext);
        });
    })
};
ar.beforeRequestHandler.use('/comsapbuildstandardconsolidado/getuserinfo', function (req, res, next) {
   if (!req.user) {
     res.statusCode = 403;
     res.end(`Missing JWT Token`);
   } else {
     res.statusCode = 200;
     //res.end(JSON.stringify(req.user.name, null, 2));
     var decodedJWTToken = jwtDecode(req.user.token.accessToken);

     res.end(JSON.stringify(decodedJWTToken, null, 2));   
 //   getUserInfo(req.user.token.acessToken).then((securityContext) =>{
  //      res.end(JSON.stringify({
//name: req.user.name,
 //           user: req.user,
 //           securityContext: securityContext
 //       }))
 //   }
 //   )
   } 
});
ar.start();