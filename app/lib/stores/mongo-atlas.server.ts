import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";

import { MongoClient, Db, Collection } from "mongodb";
import { VectorStore } from "../vector-store.server";
import { Embeddings } from "@langchain/core/embeddings";
import { Document } from "@langchain/core/documents";

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
    await this.store.addDocuments(documents, { ids });
  }

  async reset(): Promise<void> {
    await this.collection.deleteMany({});
  }

  getStore() {
    return this.store;
  }
}
