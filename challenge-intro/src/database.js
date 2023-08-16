import fs from 'node:fs/promises'
import { getTimeDateNow } from './utils/get-time-date-now.js'

const databasePath = new URL('db.json', import.meta.url)

export class Database {
  #database = {}

  constructor() {
    fs.readFile(databasePath, 'utf-8').then(data => {
      this.#database = JSON.parse(data)
    })
    .catch(() => {
      this.#persist()
    })
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database))
  }

  select(table, search) {
    let data = this.#database[table] ?? []

    if (search) {
      data = data.filter(row => {
        return Object.entries(search).some(([key, value]) => {
          return row[key].toLowerCase().includes(value.toLowerCase())
        })
      })
    }

    return data
  }
  
  insert(table, data) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data)
    } else {
      this.#database[table] = [data]
    }

    this.#persist()

    return data
  }

  delete(table, id) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id)

    if (rowIndex > -1) {
      this.#database[table].splice(rowIndex, 1)
      this.#persist()
    }

  }

  update(table, id, data) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id)

    const { title, description, completedAt } = data

    if (rowIndex > -1 && title && description) {
      this.#database[table][rowIndex].title = title
      this.#database[table][rowIndex].description = description
      this.#database[table][rowIndex].updatedAt = getTimeDateNow()
      this.#persist()
    } else if (rowIndex > -1 && completedAt) {
      this.#database[table][rowIndex].completedAt = completedAt
      this.#database[table][rowIndex].updatedAt = getTimeDateNow()
      this.#persist()
    } else {
      throw new Error('Invalid data')
    }
  }

}