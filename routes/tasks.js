const express = require("express")
const router = express.Router()
const taskController = require("../controllers/taskController")
const auth = require("../middleware/auth")
const { check } = require("express-validator")

// Crear una tarea
// api/tasks
router.post("/", 
    auth, 
    [
        check("taskName", "El nombre es obligatorio").not().isEmpty(),
        check("projectId", "El nombre es obligatorio").not().isEmpty(),
    ],
    taskController.createTask
)

// Obtener tareas por proyecto
router.get("/", auth,taskController.fetchTasks)

// Actualizar tarea
router.put("/:id", auth, taskController.updateTask)

// Borrar una tarea
router.delete("/:id", auth, taskController.deleteTask)


module.exports = router