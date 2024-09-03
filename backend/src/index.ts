import express from 'express'
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import pg from 'pg'

dotenv.config()

const app = express()
app.use(express.json())

const { Pool } = pg
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
})

app.post('/register', async (req, res) => {
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

app.post('/login', async (req, res) => {
    const { username, password } = req.body

    try {
        const result = await pool.query(
            'SELECT * FROM users WHERE username = $1',
            [username]
        )
        const user = result.rows[0]

        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign(
                { userId: user.id },
                process.env.JWT_SECRET!,
                { expiresIn: '1h' }
            )
            res.json({ message: 'Login successful', token })
        } else {
            res.status(401).json({ message: 'Invalid credentials' })
        }
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Error during login' })
    }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
