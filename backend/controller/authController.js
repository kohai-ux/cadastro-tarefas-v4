const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Usuario = require ("../models/usuario");
require("dotenv").config();

const segredoJWT = process.env.JWT_SECRET;

//Regristro de novo usuario
exports.register = async(req,res)=>{
    const {nome, email, senha} = req.body

    try{
        const existente = await Usuario.findOne({where: {email}});
        if(existente) {
            return res.status(400).json({mensagem: "Email já cadastrado"});
        }

        const senhaHash = await bcrypt.hash(senha, 10);
        const novoUsuario = await Usuario.create({nome, email, senha: senhaHash});
        res.status(201).json({mensagem: "Usuário registrado com sucesso."});
    } catch (erro){
        res.status(500).json({mensagem: "Erro no registro", erro: erro.message});
    }
};

exports.login = async (req,res)=>{
    const {email, senha} = req.body;

    try{
        const usuario = await Usuario.findOne({where: {email}});
        if(!usuario){
            return res.status(401).json({mensagem: "Usuario não encontrado"});
        }

        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if(!senhaValida){
            return res.status(401).json({mensagem: "Senha incorreta"});
        }

        const token = jwt.sign(
            {id:usuario.id, email: usuario.email},
            segredoJWT,
            {expiresIn:"2h"}
        );

        res.status(200).json({mensagem: "Login bem sucedido. ", token});

    } catch(erro){
        res.status(500).json({mensagem:"Erro no login.",erro: erro.messagem})
    }
}

