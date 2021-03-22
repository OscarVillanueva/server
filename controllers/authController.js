const User = require("../models/User")
const bcryptjs = require("bcryptjs")
const {validationResult } = require("express-validator")
const jwt = require("jsonwebtoken")
const authController = require("../controllers/authController")

// Loggear
exports.authenticateUser = async (req, res) => {
    // Revisar si hay errores
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() })
    }

    // Extrer el email y password
    const { email, password } = req.body

    try {
        // Revisar que se un usuario registrado
        let user = await User.findOne({ email })

        if(!user) return res.status(400).json({msg: "Usuario o contraseña incorrectos"})

        // Revisar su password
        const correctPasswd = await bcryptjs.compare(password, user.password)
        if(!correctPasswd) return res.status(400).json({msg: "Usuario o contraseña incorrectos"})

        // Si todo es correcto creamos el JWT
        const payload = {
            user: {
                id: user.id
            }
        }

        // firmar el JWT
        jwt.sign(payload, process.env.SECRET, {
            expiresIn: "24h" // 1 hora
        }, (error, token) => {
            if(error) throw error

            // Mensaje de confirmación
            res.send({ token })
        })


    } catch (error) {
        console.log(error);
    }
}

// Obtiene que usuario esta authenticado
exports.currentUser = async (req, res) => {

    try {

        const user = await User.findById(req.user.id).select("-password")
        res.json({ user })

    } catch (error) {
        console.log(error);
        res.status(500).json({msg: "Hubo un error"})
    }

}