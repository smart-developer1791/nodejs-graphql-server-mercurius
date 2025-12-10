# Node.js Fastify + Mercurius GraphQL Server

![Node.js](https://img.shields.io/badge/node-%3E%3D22-green)
![Fastify](https://img.shields.io/badge/fastify-5.6-blue)
![GraphiQL](https://img.shields.io/badge/graphiql-embedded-yellow)
![Mercurius](https://img.shields.io/badge/mercurius-16.6-brightgreen)
![Render](https://img.shields.io/badge/render-deployed-brightgreen)

A minimal **Node.js GraphQL server** using:

- **Fastify** as HTTP framework  
- **Mercurius** as the GraphQL engine  
- Built-in **GraphiQL UI**  
- Custom **landing page** served at `/`  

---

## Run Locally

1. Install dependencies:

```
npm install
```

2. Run the server:

```
npm run dev
```

3. Open GraphiQL:

[http://localhost:8080/graphiql](http://localhost:8080/graphiql)

---

## Endpoints

| Path        | Method | Description               |
|-------------|--------|---------------------------|
| `/graphql`  | POST   | Main GraphQL endpoint     |
| `/graphiql` | GET    | Embedded GraphiQL UI      |
| `/`         | GET    | Custom landing page       |

> **Note:** Mercurius does not serve a default landing page automatically —  
> we provide our own `/public/index.html`.

---

## GraphQL Queries (Examples)

### 1. Hello query

```
{
  hello
}
```

### 2. Get all users

```
{
  users {
    id
    name
    email
  }
}
```

### 3. Get a single user by ID

```
{
  user(id: "2") {
    id
    name
    email
  }
}
```

---

## GraphQL Mutation

### Send a message

```
mutation {
  sendMessage(message: "Hello world!") {
    message
    timestamp
  }
}
```

---

## Curl Examples

### Query Hello

``` 
curl -X POST http://localhost:8080/graphql \
  -H "Content-Type: application/json" \
  -d "{\"query\":\"{ hello }\"}"
```

### Query All Users

``` 
curl -X POST http://localhost:8080/graphql \
  -H "Content-Type: application/json" \
  -d "{\"query\":\"{ users { id name email } }\"}"
```

### Query Single User

``` 
curl -X POST http://localhost:8080/graphql \
  -H "Content-Type: application/json" \
  -d "{\"query\":\"{ user(id: \\\"2\\\") { id name email } }\"}"
```

### Mutation: Send Message

``` 
curl -X POST http://localhost:8080/graphql \
  -H "Content-Type: application/json" \
  -d "{\"query\":\"mutation { sendMessage(message: \\\"Hello from curl\\\") { message timestamp } }\"}"
```

---

## Features

- **GraphQL Queries**: `hello`, `users`, `user(id: ID)`  
- **GraphQL Mutation**: `sendMessage(message: String)`  
- **Interactive GraphiQL UI** at `/graphiql`  
- Custom **landing page** served at `/`  
- Runs on **Fastify 5** with **Mercurius 16**  
- Fully deployable on **Render.com**

---

## GraphiQL UI

Mercurius includes a built-in **GraphiQL IDE**, available at `/graphiql`.

---

## Technology Stack

- **Node.js >=22** – JavaScript runtime  
- **Fastify 5.6.2** – Ultra-fast HTTP server  
- **Mercurius 16.6.0** – GraphQL engine for Fastify  
- **GraphiQL** – Embedded interactive IDE  
- **TypeScript 5.9** – Strict typing & tooling  
- **Render.com** – Zero-config cloud deployment  

---

## Deploy in 10 seconds

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)
