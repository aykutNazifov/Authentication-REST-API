import express from 'express'

import { deleteUserById, getUserById, getUsers } from '../models/user'

export const getAllUsers = async (req: express.Request, res: express.Response) => {
    try {
        const users = await getUsers()

        return res.status(200).json(users)
    } catch (error) {
        console.log("get aal uyser err", error)
        return res.sendStatus(400)
    }
}

export const deleteUser = async (req: express.Request, res: express.Response) => {
    try {

        const { id } = req.params

        const deleteUser = await deleteUserById(id)

        return res.status(200).json(deleteUser)
    } catch (error) {
        console.log("del err", error)
        return res.sendStatus(400)

    }
}

export const updateUser = async (req: express.Request, res: express.Response) => {
    try {

        const { username } = req.body
        const { id } = req.params

        if (!username) {
            return res.status(400).json("Username is required!")
        }

        const user = await getUserById(id)

        if (!user) {
            return res.sendStatus(400)
        }

        user.username = username

        await user.save()

        return res.status(200).json(user)

    } catch (error) {
        console.log("update user err", error)
        return res.sendStatus(400)

    }
}