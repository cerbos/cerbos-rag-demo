import { Document } from "@langchain/core/documents";
import { VectorStore } from "../vector-store.server";
import { QdrantVectorStore } from "@langchain/qdrant";
import { QdrantClient } from "@qdrant/js-client-rest";

import { Embeddings } from "@langchain/core/embeddings";

export class Qdrant implements VectorStore {
  private client: QdrantClient;
  private store: QdrantVectorStore | undefined;
  private embeddings: Embeddings;
  private collectionName: string;

  constructor({
    embeddings,
    url,
    apiKey,
    collectionName,
  }: {
    embeddings: Embeddings;
    url: string;
    apiKey: string;
    collectionName: string;
  }) {
    this.embeddings = embeddings;
    this.collectionName = collectionName;
    this.client = new QdrantClient({
      url,
      apiKey,
    });
  }

  async init() {
    this.store = await QdrantVectorStore.fromExistingCollection(
      this.embeddings,
      {
        client: this.client,
        collectionName: this.collectionName,
      }
    );
    await this.store.ensureCollection();
  }
  async addDocuments(documents: Document[]) {
    if (!this.store) {
      return Promise.reject(new Error("Store not initialized"));
    }
    await this.store.addDocuments(documents);
  }

  async reset() {
    await this.store?.delete({
      filter: {},
    });
  }
  getStore() {
    if (!this.store) {
      throw new Error("Store not initialized");
    }
    return this.store;
  }
}
