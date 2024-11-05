Requirements

- Docker
- [Ollama](https://ollama.com/)
- Node

Setup

- Grab the embedding model: `ollama pull mxbai-embed-large`
- Grab the LLM: `ollama pull llama3.1`
- Install the dependancies `npm i`

Startup - in parallel

- `docker compose up`
- `npm run dev` - this will tell you which port the application is running on, typically [http://localhost:5173/](http://localhost:5173/)

The application is broken into a number of sections which demonstrate the data store, the embedding process, the vector store and then a full RAG chatbot.
