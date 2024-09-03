import express from 'express'
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import pg from 'pg'
import cors from 'cors'

dotenv.config()

const app = express()
app.use(express.json())

app.use(
    cors({
        origin: ['http://localhost:5173', 'https://resnder-test.onrender.com'], // Add your frontend URLs here
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    })
)

const { Pool } = pg
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
})

app.get('/', (req, res) => {
    res.send('TEsting testing')
})

app.post('/register', async (req, res) => {
    console.log('in register route', { req, res })

    const { username, password } = req.body
    const hashedPassword = await bcrypt.hash(password, 10)

    try {
        const result = await pool.query(
            'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id',
            [username, hashedPassword]
        )
        res.status(201).json({
            message: 'User created',
            userId: result.rows[0].id,
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Error creating user' })
    }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
