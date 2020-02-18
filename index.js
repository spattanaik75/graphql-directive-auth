import {
    GraphQLServer,
    PubSub
} from 'graphql-yoga'
const fs = require('fs')
const resolvers = require("./resolver")
const typeDefs = fs.readFileSync("./schema.gql", "utf8")
const helper = require('./src/context/db').helper
const pubsub = new PubSub()
import {
    SchemaDirectiveVisitor
} from "graphql-tools";
import { isAllowedToEdit, isAuthenticated } from './src/auth/rules'

class AuthenticatedDirective extends SchemaDirectiveVisitor {
    visitFieldDefinition(field) {
        const {
            resolve = defaultFieldResolver
        } = field;
        field.resolve = async function (...args) {
            if (isAuthenticated(...args)) {
                return await resolve.apply(this, args);
            }
            throw new Error(
                `You are not Allowed to access this API. Please contact system admin`
            );

        };
    }
}


class AllowedToEditDirective extends SchemaDirectiveVisitor {
    visitFieldDefinition(field) {
        const {resolve = defaultFieldResolver} = field;
        field.resolve = async function (...args) {
            if (isAllowedToEdit(...args)) {
                return await resolve.apply(this, args);
            }
            throw new Error(
                `You are not Allowed to edit this API. put explanation here`
            );

        };
    }
}

const server = new GraphQLServer({
    typeDefs,
    resolvers,
    schemaDirectives: {
        authenticated: AuthenticatedDirective,
        allowedToEdit: AllowedToEditDirective
    },
    context: req => ({
        req: req,
        user: helper.getUser(req.request),
        pubsub
    })
});

const options = {
    port: 4000,
    endpoint: '/graphql',
    subscriptions: '/subscriptions',
    playground: '/playground',
}

server.start(options, ({
        port
    }) =>
    console.log(
        `
🚢 Server started at http://localhost:${port} 
endpoint: http://localhost:${port}/graphql
subscriptions: http://localhost:${port}/subscriptions
playground: http://localhost:${port}/playground`,
    ),
)