export function getTimeDateNow() {
  const timestamp = Date.now()
  const dateNow = new Date(timestamp)

  const dateCreatedAt = `${dateNow.getDate()}/${dateNow.getMonth() + 1}/${dateNow.getFullYear()} : ${dateNow.getHours()}:${dateNow.getMinutes()}:${dateNow.getSeconds()}`

  return dateCreatedAt
}