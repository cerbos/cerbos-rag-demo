# Cerbos RAG Demo

## Requirements

- Docker
- [Ollama](https://ollama.com/)

## Setup

- Grab the embedding model: `ollama pull mxbai-embed-large`
- Grab the LLM: `ollama pull llama3.1`

## Startup

```bash
docker compose -f docker-compose.chroma.yaml up
```

In the console, the `app` logs will tell you port the application is running on, typically [http://localhost:3000/](http://localhost:3000/)

The application is broken into a number of sections which demonstrate the data store, the embedding process, the vector store and then a full RAG chatbot.

## Supported Vector Stores

- Chroma
- (WIP) Mongo Atlas
- (WIP) Pinecone
