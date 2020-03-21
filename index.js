const express = require("express")
const connectDB = require("./config/db")
const cors = require('cors')

// Crear el servidor
const app = express()

// Conectar a la base de datos
connectDB()

// Habilitar cors
app.use(cors())

// Habilitar express.js
app.use(express.json({ extended: true }))

// Puerto de la app 
const port = process.env.PORT || 4000
const host = process.env.HOST || "0.0.0.0"

// importar nuestras rutas
app.use("/api/users",require("./routes/users"))
app.use("/api/auth", require("./routes/auth"))
app.use("/api/projects", require("./routes/projects"))
app.use("/api/tasks", require("./routes/tasks"))

// Arrancar la app
app.listen(port, host, () => {
    console.log("El servidor esta funcionando en el puerto", port);
})