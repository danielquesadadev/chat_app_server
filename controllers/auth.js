const { response } = require("express");
const  bcrypt  = require('bcryptjs');

const User = require('../models/user');
const { generateJWT } = require("../helpers/jwt");

const createUser = async ( req, res = response ) => {
    
    const {email, password} = req.body;
    
    try {
        
        const emailExists = await User.findOne({ email });
        if (emailExists) {
            return res.status(400).json({
                ok: false,
                msg: 'Ese email ya está registrado.'
            });
        }
        
        const user = new User( req.body );

        // Encrypt password
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync( password, salt );

        await user.save();

        // JWT
        const token = await generateJWT(user.id);

        res.json({
            ok: true,
            user: user,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador.'
        });
    }
    
}

const login = async ( req, res = response ) => {
    
    const {email, password} = req.body;
    
    try {
        
        const user = await User.findOne({ email });
    
        if (!user) {
            return res.status(400).json({
                ok: false,
                msg: 'Email no encontrado'
            });
        }

        const validPassword = bcrypt.compareSync(password, user.password);

        if(!validPassword){
            return res.status(400).json({
                ok: false,
                msg: 'La contraseña no es válida'
            });
        }

        const token = await generateJWT(user.id) ;

        console.log('User logged:', user);
        res.json({
            ok: true,
            user: user,
            token
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador.'
        });
    }
    
}

const renewToken = async ( req, res = response) => {

    try {
        const uid = req.uid;

        const token = await generateJWT(uid);
            
        const user = await User.findById(uid);

        res.json({
            ok: true,
            user,
            token
        });    

    } catch (error) {
        console.log('Error fetching user:', error);
        return res.status(500).json({
            ok: false,
            msg: 'Error al obtener el usuario.'
        });
    }
};

module.exports = {
    createUser,
    login,
    renewToken
}