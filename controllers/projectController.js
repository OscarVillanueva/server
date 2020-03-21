const Project = require("../models/Project")
const { validationResult } = require("express-validator")

exports.createProject = async (req, res) => {

    // Revisar si hay errores
    // Revisar si hay errores
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() })
    } 


    try {
        
        // Crear un nuevo proyecto  
        const project = new Project(req.body)

        // Guardar el creador vía webtoken
        project.owner = req.user.id

        await project.save()
        res.json(project)

    } catch (error) {
        console.log(error);
        res.status(500).send("Hubo un error")
    }

}

// Obtiene todos los projectos del usuario actual
exports.fetchProjects = async (req, res) => {

    try {
        
        const projects = await Project.find({ owner: req.user.id }).sort({ creationDate: -1 })
        res.json({ projects })

    } catch (error) {
        console.log(error);
        res.status(500).send("Hubo un error")
    }

}

// Actualiza un proyecto
exports.updateProject = async (req, res) => {

    // Revisar si hay errores
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() })
    } 

    // Extrer la información del proyecto
    const { projectName } = req.body
    const newProject = {}

    if(projectName) 
        newProject.projectName = projectName

    try {
        
        // Revisar el id
        let project = await Project.findById(req.params.id)

        // si el proyecto existe
        if(!project) return res.status(404).json({msg: "Proyecto no econtrado"})

        // Verificar el creador del projecto
        if(project.owner.toString() !== req.user.id) 
            return res.status(401).json({msg: "No autorizado"})

        // actualizar
        project = await Project.findByIdAndUpdate(
            { _id: req.params.id }, 
            { $set: newProject }, 
            {new: true }
        )

        res.json(project)

    } catch (error) {
        console.log(error);
        res.status(500).send("Hubo un error")
    }

}

// Elimina un projecto por su ID
exports.deleteProject = async (req, res) => {

    try {
        
        // Revisar el id
        let project = await Project.findById(req.params.id)

        // si el proyecto existe
        if(!project) return res.status(404).json({msg: "Proyecto no econtrado"})

        // Verificar el creador del projecto
        if(project.owner.toString() !== req.user.id) 
            return res.status(401).json({msg: "No autorizado"})

        // Eliminar el proyecto
        await Project.findOneAndRemove({ _id: req.params.id })
        
        res.json({ msg: "Proyecto eliminado" })

    } catch (error) {
        console.log(error);
        res.status(500).send("Hubo un error")
    }
}