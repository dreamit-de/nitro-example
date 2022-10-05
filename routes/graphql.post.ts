import {
  buildSchema,
  GraphQLError,
} from 'graphql'

import { 
  GraphQLServer, 
  JsonLogger 
} from '@dreamit/graphql-server'

interface User {
  userId: string
  userName: string
}

interface LogoutResult {
  result: string
}

const userOne: User = {userId: '1', userName:'UserOne'}
const userTwo: User = {userId: '2', userName:'UserTwo'}

const userSchema = buildSchema(`
  schema {
    query: Query
    mutation: Mutation
  }
  
  type Query {
    returnError: User 
    users: [User]
    user(id: String!): User
  }
  
  type Mutation {
    login(userName: String, password: String): LoginData
    logout: LogoutResult
  }
  
  type User {
    userId: String
    userName: String
  }
  
  type LoginData {
    jwt: String
  }
  
  type LogoutResult {
    result: String
  }
`)

const userSchemaResolvers= {
  returnError(): User {
      throw new GraphQLError('Something went wrong!', {})
  },
  users(): User[] {
      return [userOne, userTwo]
  },
  user(input: { id: string }): User {
      switch (input.id) {
      case '1': {
          return userOne
      }
      case '2': {
          return userTwo
      }
      default: {
          throw new GraphQLError(`User for userid=${input.id} was not found`, {})
      }
      }
  },
  logout(): LogoutResult {
      return {result: 'Goodbye!'}
  }
}

const graphqlServer = new GraphQLServer(
  {
      schema: userSchema,
      rootValue: userSchemaResolvers,
      logger: new JsonLogger('nitroServer', 'user-service'),
  }
)

export default eventHandler(async event  => {
  const body = await useBody(event)
  const {req, res} = event
  await graphqlServer.handleRequest( {
    headers: req.headers,
    url: req.url,
    body: body,
    method: req.method
  }, res)
})
