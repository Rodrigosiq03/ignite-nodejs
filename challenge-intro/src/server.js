import http from 'node:http'
import { json } from './middlewares/json.js'
import { routes } from './routes/routes.js'
import { extractQueryParams } from './utils/extract-query-params.js'

// query parameters : URL statefull (informações não sensiveis, servem mais para filtros, pagnação, busca)
// route parameters (Path variables) (identificação de recurso)
//Request body: envio de informações de um formulário, passam pelo protocolo (HTTP, ajuda na criptografia e segurança)

const server = http.createServer(async (req, res) => {

  const { method, url } = req

  await json(req, res)  

  const route = routes.find(route => {
    return route.method === method && route.path.test(url)
  })

  if (route) {
    const routeParams = req.url.match(route.path)

    const { query, ...params } = routeParams.groups

    req.params = params
    req.query = query ? extractQueryParams(routeParams.groups.query) : {}

    return route.handler(req, res)
  }

  return res.writeHead(404).end('Not found')
})

server.listen(3333)


