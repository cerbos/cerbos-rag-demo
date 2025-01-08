import { Document } from "@langchain/core/documents";
import { VectorStore } from "../vector-store.server";
import { PineconeStore } from "@langchain/pinecone";
import {
  Index,
  Pinecone as PineconeClient,
  RecordMetadata,
} from "@pinecone-database/pinecone";
import { Embeddings } from "@langchain/core/embeddings";

export class Pinecone implements VectorStore {
  private store: PineconeStore | undefined;
  private client: PineconeClient;
  private indexName: string;
  private index: Index<RecordMetadata> | undefined;
  private embeddings: Embeddings;

  constructor({
    embeddings,
    index,
    apiKey,
  }: {
    embeddings: Embeddings;
    index: string;
    apiKey: string;
  }) {
    this.embeddings = embeddings;
    this.client = new PineconeClient({
      apiKey,
    });
    this.indexName = index;
  }

  async init() {
    try {
      const indexModel = await this.client.describeIndex(this.indexName);
      console.log(indexModel);
    } catch (e) {
      await this.client.createIndex({
        name: this.indexName,
        dimension: 1024, // Replace with your model dimensions
        metric: "cosine", // Replace with your model metric
        spec: {
          serverless: {
            cloud: "aws",
            region: "us-east-1",
          },
        },
      });
    }

    this.index = this.client.Index(this.indexName);
    this.store = await PineconeStore.fromExistingIndex(this.embeddings, {
      pineconeIndex: this.index,
      maxConcurrency: 5,
    });
  }
  async addDocuments(documents: Document[], { ids }: { ids: string[] }) {
    if (!this.store) {
      return Promise.reject(new Error("Store not initialized"));
    }
    await this.store.addDocuments(documents, { ids });
  }

  async reset() {
    if (!this.index) {
      throw new Error("Store not initialized");
    }
    try {
      await this.index?.deleteAll();
      console.log("Store deletion complete");
    } catch (e) {
      console.log("Store deletion failed");
    }
    console.log("Store reset");
  }
  getStore() {
    if (!this.store) {
      throw new Error("Store not initialized");
    }
    return this.store;
  }
}
