import express from 'express';
import mysql from 'mysql';
import cors from 'cors';
import bcrypt from 'bcryptjs';

const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "crud"
});

db.connect((err) => {
    if (err) {
        console.error('Error conectando a la base de datos:', err);
        return;
    }
    console.log('Conectado a la base de datos');
});

app.get('/', (req, res) => {
    const sql = "SELECT * FROM empleados";
    db.query(sql, (err, data) => {
        if (err) {
            return res.json({ Error: "Error" });
        }
        return res.json(data);
    });
});

app.post('/create', (req, res) => {
    const sql = "INSERT INTO empleados(nombre, salario, cargo, bono) VALUES (?)";
    const values = [
        req.body.nombre,
        req.body.salario,
        req.body.cargo,
        req.body.bono
    ];
    db.query(sql, [values], (err, data) => {
        if (err) {
            return res.json({ Error: "Error" });
        }
        return res.json(data);
    });
});

app.put('/update/:id', (req, res) => {
    const sql = "update empleados set nombre= ?, salario= ?, cargo= ?, bono= ? where id =?";
    const values = [
        req.body.nombre,
        req.body.salario,
        req.body.cargo,
        req.body.bono
    ];
    const id = req.params.id;
    db.query(sql, [...values, id], (err, data) => {
        if (err) {
            return res.json({ Error: "Error" });
        }
        return res.json(data);
    });
});

app.delete('/delete/:id', (req, res) => {
    const sql = "delete from empleados where id =?";
    const id = req.params.id;
    db.query(sql, [id], (err, data) => {
        if (err) {
            return res.json({ Error: "Error" });
        }
        return res.json(data);
    });
});

app.get('/getrecord/:id', (req, res) => {
    const id = req.params.id;
    const sql = "select * from empleados where id=?"
    db.query(sql, [id], (err, data) => {
        if (err) {
            return res.json({ Error: "Error" });
        }
        return res.json(data);
    });
});
// Ruta de login
app.post('/login', (req, res) => {
    const { usuario, contrasena } = req.body;

    if (!usuario || !contrasena) {
        return res.status(400).send('Usuario y contraseña son requeridos');
    }

    const sql = 'SELECT * FROM usuarios WHERE usuario = ?';
    db.query(sql, [usuario], (err, results) => {
        if (err) {
            console.error('Error en la consulta:', err);
            return res.status(500).send('Error en el servidor');
        }

        if (results.length === 0) {
            console.log('Usuario no encontrado');
            return res.status(401).send('Usuario no encontrado');
        }

        const user = results[0];
        console.log('Usuario encontrado:', user);

        // Verificar la contraseña
        if (contrasena !== user.contrasena) {
            console.log('Contraseña incorrecta');
            return res.status(401).send('Contraseña incorrecta');
        }

        console.log('Login exitoso');
        res.status(200).send('Login exitoso');
    });
});


app.listen(3030, () => {
    console.log("Funciona");
});
