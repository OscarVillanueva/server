const Task = require("../models/Task")
const Project = require("../models/Project")
const { validationResult } = require("express-validator")

// Crear una nueva tarea
exports.createTask = async (req, res) => {
 
    // Revisar si hay errores
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() })
    } 

    // Extraer el proyecto y comprobar si existe
    const { projectId } = req.body

    try {
        
        const project = await Project.findById( projectId )

        if(!project) return res.status(404).json({msg: "Proyecto no encontrado"})

        // Revisar si el proyecto actual pertenece al usuario autenticado
        // Verificar el creador del projecto
        if(project.owner.toString() !== req.user.id) 
            return res.status(401).json({msg: "No autorizado"})

        // Creamos la tarea
        const task = new Task(req.body)
        await task.save()
        res.json({ task })

    } catch (error) {
        console.log(error);
        res.status(500).send("Hubo un error")
    }
}

// Obtiene las tareas por projecto
exports.fetchTasks = async (req, res) => {

    // Extraer el proyecto y comprobar si existe
    const { projectId } = req.query

    try {
        
        const project = await Project.findById( projectId )

        if(!project) return res.status(404).json({msg: "Proyecto no encontrado"})

        // Revisar si el proyecto actual pertenece al usuario autenticado
        // Verificar el creador del projecto
        if(project.owner.toString() !== req.user.id) 
            return res.status(401).json({msg: "No autorizado"})

        // Obtener las tareas por proyecto
        // const tasks = await Task.find({ projectId }).sort({creationDate: -1})
        const tasks = await Task.find({ projectId })
        res.json({tasks})

    } catch (error) {
        console.log(error);
        res.status(500).send("Hubo un error")
    }

}

// Actualizar una tarea
exports.updateTask = async (req, res) => {
    // Extraer el proyecto y comprobar si existe
    const { projectId, taskName, state } = req.body

    try {

        // Si la tarea existe o no
        let isTarea = await Task.findById(req.params.id)

        if(!isTarea) return res.status(404).json({msg: "No existe esa tarea"})

        // Extraer proyecto
        const project = await Project.findById( projectId )

        // Revisar si el proyecto actual pertenece al usuario autenticado
        // Verificar el creador del projecto
        if(project.owner.toString() !== req.user.id) 
            return res.status(401).json({msg: "No autorizado"})

        // Crear un objeto con la nueva información
        const newTask = {}
        newTask.taskName = taskName        
        newTask.state = state 
        
        // Guardar la tarea
        isTarea = await Task.findOneAndUpdate({ _id: req.params.id}, newTask, { new: true })
        res.json({ task: isTarea })

    } catch (error) {
        console.log(error);
        res.status(500).send("Hubo un error")
    }
}

// Eliminar una tarea
exports.deleteTask = async (req, res) => {

    // Extraer el proyecto y comprobar si existe
    const { projectId} = req.query

    try {

        // Si la tarea existe o no
        let isTarea = await Task.findById(req.params.id)

        if(!isTarea) return res.status(404).json({msg: "No existe esa tarea"})

        // Extraer proyecto
        const project = await Project.findById( projectId )

        // Revisar si el proyecto actual pertenece al usuario autenticado
        // Verificar el creador del projecto
        if(project.owner.toString() !== req.user.id) 
            return res.status(401).json({msg: "No autorizado"})

        // Eliminar la tarea
        await Task.findByIdAndRemove({_id: req.params.id})
        res.json({ msg: "Tarea eliminada" })

    } catch (error) {
        console.log(error);
        res.status(500).send("Hubo un error")
    }
}