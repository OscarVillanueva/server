// Rutas para crear usuarios
const express = require("express")
const router = express.Router()
const userController = require("../controllers/userController")
const { check } = require("express-validator")

// Crea un usuario
// api/users
router.post("/",
    [
        check("email", "Agrega un email válido").isEmail(),
        check("password", "El password debe ser minimo de 6 caracteres").isLength({ min:6 }),
    ],
    userController.createUser
);

module.exports = router