// @ts-check

const User = require('../model/user.model.js')

/** @type {ControllerParams} */
const getUser = (req, res) => {
    const { _id } = req.params

    User.findById(_id)
        .select({
            _id: 1,
            username: 1,
            __v: 1
        })
        .exec()
        .then(user => {
            if (!user) return res.status(404).json({ error: 'User not found' })

            res.status(200).json(user)
        })
        .catch(_err => res.status(404).json({ error: "Couldn't find a user" }))
}

/** @type {ControllerParams} */
const getUsers = (req, res) => {
    User.find()
        .select({
            _id: 1,
            username: 1,
            __v: 1
        })
        .exec()
        .then(users => res.status(200).json(users))
        .catch(err => res.status(404).json({ error: err?.message }))
}

/** @type {ControllerParams} */
const postUser = (req, res) => {
    let body = "";

    req.on('data', chunk => body += chunk.toString());

    req.on('end', () => {
        const formData = new URLSearchParams(body)
        const username = formData.get('username')?.trim()
        const newUser = new User({ username })

        newUser.save()
            .then(user => res.status(201).json(user))
            .catch(err => res.status(400).json({ error: err?.message }))
    })
}

module.exports = {
    getUser,
    getUsers,
    postUser
}

/**
 * @typedef {function(import('express').Request, import('express').Response): any} ControllerParams
 * Type of function params
 */