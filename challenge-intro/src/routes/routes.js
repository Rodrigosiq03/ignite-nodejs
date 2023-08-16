import { Database } from "../database.js"
import { randomUUID } from 'node:crypto'
import { buildRoutePath } from "../utils/build-route-path.js"
import { getTimeDateNow } from "../utils/get-time-date-now.js"

const database = new Database

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { search } = req.query

      const tasks = database.select('tasks', search ? {
        name: search
      } : null)
      return res.end(JSON.stringify(tasks))
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.body

      const createdAt = getTimeDateNow()

      const task = {
        id: randomUUID(),
        title: title,
        description: description,
        createdAt: createdAt,
        updatedAt: createdAt,
        completedAt: null
      }
  
      database.insert('tasks', task)
  
      return res.writeHead(201).end(JSON.stringify(
        {
          task: {
            title: title,
            description: description,
            createdAt: createdAt,
            updatedAt: createdAt,
            completedAt: null
          },
          message: 'Task created successfully!' 
        }
      ))
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params

      database.delete('tasks', id)

      return res.writeHead(200).end(JSON.stringify(
        {
          id: id,
          message: 'Task deleted successfully'
        }
      ))
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params
      const { title, description } = req.body

      const updatedAt = getTimeDateNow()

      database.update('tasks', id, { title, description })

      return res.writeHead(200).end(JSON.stringify(
        {
          task: {
            id: id,
            title: title,
            description: description,
            updatedAt: updatedAt
          },
          message: 'Task updated successfully'
        }
      ))
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params

      const updatedAt = getTimeDateNow()

      const completedAt = updatedAt

      database.update('tasks', id, { completedAt })

      return res.writeHead(200).end(JSON.stringify(
        {
          task: {
            id: id,
            completedAt: completedAt,
            updatedAt: updatedAt
          },
          message: 'Task updated successfully'
        }
      ))
    }
  }
]