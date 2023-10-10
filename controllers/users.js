const { response } = require("express");
const User = require("../models/user");

const getUsers = async (req, res = response) => {
    
    const from = Number( req.query.from ) || 0;

    try {
        
        //const token = await generateJWT(user.id) ;
        const allUsers = await User
            .find({ _id: { $ne: req.uid }})
            .sort('-online')
            .skip(from)
            .limit(2);
        
        res.json({
            ok: true,
            users: allUsers,
            from,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador.'
        });
    }
}

module.exports = {
    getUsers
}