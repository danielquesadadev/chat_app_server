/* path: api/login */
const { Router } =  require('express');
const { createUser, login, renewToken } = require('../controllers/auth');
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validar-campos');
const { validateJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.post('/new' , [
    check('name', 'El nombre es obligatorio.').not().isEmpty(),
    check('email', 'El email es obligatorio.').isEmail(),
    check('password', 'La contraseña es obligatoria.').not().isEmpty(),
    validateFields
]  ,createUser);

router.post('/' , [
    check('email', 'El email es obligatorio.').isEmail(),
    check('password', 'La contraseña es obligatoria.').not().isEmpty(),
    validateFields
]  , login);

router.get('/renew', validateJWT, renewToken);

module.exports =  router;