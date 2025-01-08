import { Chroma } from "@langchain/community/vectorstores/chroma";
import { Embeddings } from "@langchain/core/embeddings";
import { VectorStore as LangChainVectorStore } from "@langchain/core/vectorstores";
import { Document } from "@langchain/core/documents";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { Collection, Db, MongoClient } from "mongodb";
import { embeddings } from "./embedding.server";

interface VectorStore {
  init(): Promise<void>;
  addDocuments: (
    documents: Document[],
    { ids }: { ids: string[] }
  ) => Promise<void>;
  reset(): Promise<void>;
  getStore(): LangChainVectorStore;
}

export class ChromaStore implements VectorStore {
  private store: Chroma;

  constructor({
    embeddings,
    collectionName,
    url,
  }: {
    embeddings: Embeddings;
    collectionName: string;
    url: string;
  }) {
    // Initialize the Chroma store
    this.store = new Chroma(embeddings, {
      collectionName,
      url,
    });
  }

  async init() {
    await this.store.ensureCollection();
  }

  async addDocuments(documents: Document[], { ids }: { ids: string[] }) {
    this.store.addDocuments(documents, { ids });
  }

  async reset() {
    const ids = (await this.store.collection?.get({}))?.ids || [];
    if (ids.length > 0) {
      await this.store.delete({ ids });
    }
  }

  getStore() {
    return this.store;
  }
}

export class MongoAtlas implements VectorStore {
  private client: MongoClient; // Replace with actual MongoDB client type
  private db: Db; // Replace with actual MongoDB database type
  private collection: Collection; // Replace with actual MongoDB collection type
  private store: MongoDBAtlasVectorSearch;

  constructor({
    embeddings,
    uri,
    dbName,
    collectionName,
  }: {
    embeddings: Embeddings;
    uri: string;
    dbName: string;
    collectionName: string;
  }) {
    this.client = new MongoClient(uri);
    this.db = this.client.db(dbName);
    this.collection = this.db.collection(collectionName);
    this.store = new MongoDBAtlasVectorSearch(embeddings, {
      collection: this.collection,
      indexName: "vector_index", // The name of the Atlas search index. Defaults to "default"
      textKey: "pageContent", // The name of the collection field containing the raw content. Defaults to "text"
      embeddingKey: "embedding", // The name of the collection field containing the embedded text. Defaults to "embedding"
    });
  }

  async init(): Promise<void> {
    await this.client.connect();
    await this.db.command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    console.log("Creating search index");
    try {
      await this.collection.createSearchIndex({
        name: "vector_index",
        type: "vectorSearch",
        definition: {
          fields: [
            {
              numDimensions: 1024,
              path: "embedding",
              similarity: "cosine",
              type: "vector",
            },
            {
              type: "filter",
              path: "ownerId",
            },
            {
              type: "filter",
              path: "amount",
            },
            {
              type: "filter",
              path: "region",
            },
            {
              type: "filter",
              path: "status",
            },
            {
              type: "filter",
              path: "vendor",
            },
          ],
        },
      });
    } catch (e) {
      console.log("Search index exists");
    }
  }

  async addDocuments(documents: Document[], { ids }: { ids: string[] }) {
    this.store.addDocuments(documents, { ids });
  }

  async reset(): Promise<void> {
    await this.collection.deleteMany({});
  }

  getStore() {
    return this.store;
  }
}

function createVectorStore(): VectorStore {
  const storeType = process.env.VECTOR_STORE || "chroma";

  switch (storeType) {
    case "chroma":
      return new ChromaStore({
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
