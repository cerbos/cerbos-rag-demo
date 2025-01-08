import { Chroma } from "@langchain/community/vectorstores/chroma";
import { VectorStore } from "../vector-store.server";
import { Embeddings } from "@langchain/core/embeddings";
import { Document } from "@langchain/core/documents";

export class ChromaDB implements VectorStore {
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
