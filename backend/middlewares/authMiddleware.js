const jwt = require("jsonwebtoken");
require("dotenv").config();

const segredoJWT = process.env.JWT_SECRET;

function autenticarToken(req, res, next){
    const althHeader = req.headers["autorization"];
    const token = althHeader && althHeader.split(" ")[1];

    if(!token) {
    return res.status(401).json({mensagem: "token não fornecido"});
    }
    jwt.verify(token, segredoJWT, (err,usuario)=>{
        if(err){
            return res.status(403).json({mensagem: "Token inválido ou inexistente"})
        }
        req.usuario = usuario;
        next()
    });
}

module.expert = autenticarToken;