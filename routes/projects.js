const express = require("express")
const router = express.Router()
const projects = require("../controllers/projectController")
const auth = require("../middleware/auth")
const { check } = require("express-validator")

// Crea un projecto
// api/projects
router.post("/", 
    auth,
    [
        check("projectName", "El nombre del proyecto").not().isEmpty()
    ],
    projects.createProject
)

// Obtener todos los projectos
router.get("/", auth, projects.fetchProjects)

// Actualizar un projecto vía ID
router.put("/:id", 
    auth,
    [
        check("projectName", "El nombre del proyecto").not().isEmpty()
    ],
    projects.updateProject
)

// Eliminar un projecto vía ID
router.delete("/:id", 
    auth,
    projects.deleteProject
)

module.exports = router