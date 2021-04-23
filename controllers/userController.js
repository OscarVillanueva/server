const User = require("../models/User")
const Project = require("../models/Project")
const Task = require("../models/Task")
const bcryptjs = require("bcryptjs")
const {validationResult } = require("express-validator")
const jwt = require("jsonwebtoken")

exports.createUser = async (req, res) => {

    // Revisar si hay errores
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() })
    } 

    // Extraer email y password
    const {email, password} = req.body

    // Tareas dummies
    const dummiesTasks = [ 
        {
            taskName: "Terminar el tour",
            state: false,
        }, 
        {
            taskName: "Comparir Todapp",
            state: false,
        }, 
        {   
            taskName: "Suscribirme a Todapp",
            state: true,
        } 
    ]

    try {
        // Revisar que el nuevo usuario sea unico
        let user = await User.findOne({ email })

        if(user)
            return res.status(400).json({ msg: "El usuario ya existe" })

        // Crear el nuevo usuario
        user = new User(req.body)

        // Hashear la password
        const salt = await bcryptjs.genSalt(10)
        user.password = await bcryptjs.hash(password, salt)

        // Guardar usuario
        await user.save()


        // Crear un nuevo proyecto  
        const project = new Project({ projectName: "Ejemplo" })

        // Guardar el creador vía webtoken
        project.owner = user.id

        await project.save()

        // Crear tres tareas dummys de introducción
        for await ( dummie of dummiesTasks ) {

            const task = new Task( dummie )
            task.projectId = project.id
            await task.save()

        }

        // Crear y firmar el jwt
        const payload = {
            user: {
                id: user.id
            }
        }

        // firmar el JWT
        jwt.sign(payload, process.env.SECRET, {
            expiresIn: 3600 // 1 hora
        }, (error, token) => {
            if(error) throw error

            // Mensaje de confirmación
            res.send({ token })
        })


    } catch (error) {
        console.log(error);
        res.status(400).json({ msg: "Ocurrío un error intenta más tarde" })
    }
}