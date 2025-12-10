import Fastify from 'fastify';
import mercurius from 'mercurius';

/* ========================================================================
   GraphQL Schema Definition
   ========================================================================
   The GraphQL schema describes all available types, queries, and mutations.
   Mercurius accepts schemas defined as plain SDL (Schema Definition Language)
   strings. No code-first tooling is required by default.
   ======================================================================== */

const schema = `
  type User {
    id: ID!
    name: String!
    email: String!
  }

  type Message {
    message: String!
    timestamp: String!
  }

  type Query {
    hello: String!
    users: [User!]!
    user(id: ID!): User
  }

  type Mutation {
    sendMessage(message: String!): Message!
  }
`;

/* ========================================================================
   Sample In-Memory Data
   ========================================================================
   Temporary in-memory data store acting as a mock database.
   In a real application this would be replaced with actual DB logic.
   ======================================================================== */

const USERS = [
  { id: '1', name: 'Alice', email: 'alice@example.com' },
  { id: '2', name: 'Bob', email: 'bob@example.com' },
  { id: '3', name: 'Carol', email: 'carol@example.com' },
];

/* ========================================================================
   GraphQL Resolver Implementations
   ========================================================================
   Resolvers define how fields in the schema are executed. Mercurius maps
   GraphQL operations to these resolver functions automatically.
   ======================================================================== */

const resolvers = {
  Query: {
    hello: () => 'Hello from Mercurius!',
    users: () => USERS,
    user: (_: any, { id }: { id: string }) => USERS.find(u => u.id === id),
  },

  Mutation: {
    sendMessage: (_: any, { message }: { message: string }) => ({
      message,
      timestamp: new Date().toISOString(),
    }),
  },
};

/* ========================================================================
   Fastify Server Initialization
   ========================================================================
   Fastify is a high-performance HTTP framework for Node.js. Mercurius
   integrates seamlessly with Fastify, automatically registering:

     • POST /graphql    → GraphQL endpoint
     • GET  /graphiql   → Embedded GraphiQL IDE (if enabled)
   ======================================================================== */

const app = Fastify();

// Register Mercurius plugin (GraphQL engine for Fastify)
app.register(mercurius, {
  schema,
  resolvers,
  graphiql: true, // Enables the built-in GraphiQL IDE at /graphiql
});

/* ========================================================================
   Custom Root Route (Landing Page)
   ========================================================================
   Fastify does NOT automatically serve a root URL. Any unspecified route
   results in a 404:  { "message": "Route GET:/ not found", ... }

   This custom handler provides a simple HTML landing page using TailwindCSS
   served from CDN, similar to GraphQL Yoga's default landing UI.
   ======================================================================== */

app.get('/', async (_req, reply) => {
  reply.type('text/html').send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Fastify + Mercurius GraphQL Server</title>
      <script src="https://cdn.tailwindcss.com"></script>
    </head>

    <body class="bg-gray-100 h-screen flex items-center justify-center">
      <div class="bg-white shadow-lg rounded-xl p-10 text-center max-w-md">
        <h1 class="text-3xl font-semibold mb-4 text-gray-800">
          GraphQL Server is running
        </h1>

        <p class="text-gray-600 mb-8">
          Click the button below to open the GraphiQL IDE.
        </p>

        <a href="/graphiql"
           class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white
                  rounded-lg text-lg transition">
          Open GraphiQL
        </a>
      </div>
    </body>
    </html>
  `);
});

/* ========================================================================
   Server Startup
   ========================================================================
   Fastify’s listen() callback returns the actual bound address of the server.

   NOTES:

   • http://localhost:8080/  
       Friendly developer URL. Always safe & readable.

   • address (Fastify callback argument)
       Often resolves to an IPv6 address such as:
         http://[::1]:8080/
       [::1] is simply IPv6 loopback (equivalent to 127.0.0.1).

   • Both forms are valid — behavior differs by OS and environment.
   • Render.com and cloud hosts replace this with their assigned public URL.
     → We set host = '0.0.0.0' only when process.env.PORT exists
       to make the server accessible externally on Render.
   ======================================================================== */

// Determine the port to listen on:
// - Use the environment variable PORT if provided (e.g., by Render.com)
// - Otherwise fallback to 8080 for local development
const PORT = Number(process.env.PORT) || 8080;

// Detect if running on Render (or any environment that provides PORT)
const IS_RENDER = Boolean(process.env.PORT);

// Prepare Fastify listen options
// Using 'any' here to bypass TypeScript strict type check for optional host
const listenOptions: any = { port: PORT };

// Only explicitly set host when running on Render
// '0.0.0.0' allows the server to accept external connections
// Locally, Fastify will default to localhost (::1 / 127.0.0.1)
if (IS_RENDER) {
  listenOptions.host = '0.0.0.0';
}

// Start the Fastify server
app.listen(listenOptions, (err, address) => {
  if (err) throw err;

  // Developer-friendly localhost version
  console.log('🚀 Server running (friendly URL): http://localhost:8080/graphiql');

  // Raw Fastify-bound address (commonly IPv6 loopback)
  console.log(`🚀 Server running (Fastify address): ${address}/graphiql`);
});
