import { Router } from "express";
import UserModel from '../dao/models/user.model.js'

const sessionrouter = Router()

sessionrouter.post('/signup', async (req, res) => {
    const user = req.body
    await UserModel.create(user)

    res.redirect('/login')
})

sessionrouter.post('/login', async (req, res) => {
    const { email, password } = req.body
    const user = await UserModel.findOne({ email, password })
    if(!user) return res.redirect('/login')

    req.session.user = user

    res.redirect('/profile')
})

sessionrouter.get('/logout', async(req, res) => {
    req.session.destroy(err => {
        if(err) return res.send('Logout error')

        res.redirect('/')
    })
})

export default sessionrouter