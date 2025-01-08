import { VectorStore as LangChainVectorStore } from "@langchain/core/vectorstores";
import { Document } from "@langchain/core/documents";
import { embeddings } from "./embedding.server";
import { ChromaDB } from "./stores/chroma.server";
import { MongoAtlas } from "./stores/mongo-atlas.server";

export interface VectorStore {
  init(): Promise<void>;
  addDocuments: (
    documents: Document[],
    { ids }: { ids: string[] }
  ) => Promise<void>;
  reset(): Promise<void>;
  getStore(): LangChainVectorStore;
}

function createVectorStore(): VectorStore {
  const storeType = process.env.VECTOR_STORE || "chroma";

  switch (storeType) {
    case "chroma":
      return new ChromaDB({
        embeddings,
        collectionName: process.env.CHROMA_COLLECTION_NAME || "expense_dev",
        url: process.env.CHROMA_ENDPOINT || "http://localhost:5666",
      });
    case "mongo":
      return new MongoAtlas({
        embeddings,
        uri: process.env.MONGODB_ATLAS_URI || "",
        dbName: process.env.MONGODB_ATLAS_DB_NAME || "",
        collectionName:
          process.env.MONGODB_ATLAS_COLLECTION_NAME || "expense_dev",
      });
    default:
      throw new Error(`Unknown vector store type: ${storeType}`);
  }
}

export const vectorStore = createVectorStore();
vectorStore.init();
