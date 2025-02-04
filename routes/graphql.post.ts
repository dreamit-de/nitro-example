import {
  buildSchema,
  GraphQLError,
} from 'graphql'

import { 
  GraphQLServer, 
  JsonLogger 
} from '@dreamit/graphql-server'
import { 
  userSchema,
  userSchemaResolvers 
} from '@dreamit/graphql-testing'

const graphqlServer = new GraphQLServer(
  {
      schema: userSchema,
      rootValue: userSchemaResolvers,
      logger: new JsonLogger('nitroServer', 'user-service'),
  }
)

export default eventHandler(async (event)  => {
  const body = await readBody(event)
  const {req, res} = event.node
  await graphqlServer.handleRequest( {
    headers: req.headers,
    url: req.url,
    body: body,
    method: req.method
  }, res)
})
