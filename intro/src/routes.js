import { Database } from "./database.js"
import { randomUUID } from 'node:crypto'
import { buildRoutePath } from "./utils/build-route-path.js"

const database = new Database

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/users'),
    handler: (req, res) => {
      const { search } = req.query

      const users = database.select('users', search ? {
        name: search
      } : null)
      return res.end(JSON.stringify(users))
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/users'),
    handler: (req, res) => {
      const { name, ra } = req.body

      const user = {
        id: randomUUID(),
        name: name,
        ra: ra
      }
  
      database.insert('users', user)
  
      return res.writeHead(201).end(JSON.stringify(
        {
          user: {
            name: name,
            ra: ra
          },
          message: 'User created successfully!' 
        }
      ))
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/users/:id'),
    handler: (req, res) => {
      const { id } = req.params

      database.delete('users', id)

      return res.writeHead(200).end(JSON.stringify(
        {
          id: id,
          message: 'User deleted successfully'
        }
      ))
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/users/:id'),
    handler: (req, res) => {
      const { id } = req.params
      const { name, ra } = req.body

      database.update('users', id, { name, ra })

      return res.writeHead(200).end(JSON.stringify(
        {
          user: {
            id: id,
            name: name,
            ra: ra
          },
          message: 'User updated successfully'
        }
      ))
    }
  }
]