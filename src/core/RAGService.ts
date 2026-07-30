import { LLMService } from './LLMService';

export interface RAGDocument {
    id: string;
    content: string;
    meta?: any;
    embedding?: number[];
}

export class RAGService {
    private documents: RAGDocument[] = [];
    private llm?: LLMService;

    constructor(llm?: LLMService) {
        this.llm = llm;
        // Load seed data
        this.documents = [
            {
                id: "rag1",
                content: "member_age:30, vegetarian; before_cal:1800 -> after_cal:2000; reason:low morning energy; trainer:T-Ravi; effect:improved adherence",
                meta: { tag: "calorie_increase", goal: "maintain" }
            },
            {
                id: "rag2",
                content: "member_age:25, non-veg; before_meal:complex biryani -> after_meal:grilled chicken+salad; reason:reduce meal prep friction; trainer:Tina",
                meta: { tag: "simplify_meals", goal: "adherence" }
            },
            {
                id: "rag3",
                content: "member_age:34, veg; protein increased from 100g->130g to preserve lean mass during deficit; reason:trainer advised; outcome:maintained strength",
                meta: { tag: "protein_up", goal: "fat_loss" }
            },
            {
                id: "rag4",
                content: "member_age:28, veg; swapped lunch rice->roti to control carbs post workout; reason:better energy; trainer:Ajay",
                meta: { tag: "meal_swap", goal: "energy" }
            },
            {
                id: "rag5",
                content: "member_age:40, diabetic; suggested route to dietitian before aggressive changes; trainer:Anita",
                meta: { tag: "medical_flag" }
            }
        ];
    }

    /**
     * Add a document to RAG database and compute vector embedding
     */
    async addDocument(doc: RAGDocument): Promise<void> {
        if (this.llm && !doc.embedding) {
            try {
                doc.embedding = await this.llm.getEmbedding(doc.content);
            } catch (err) {
                console.error("Failed to generate embedding for doc:", doc.id, err);
            }
        }
        this.documents.push(doc);
    }

    /**
     * Calculate cosine similarity between two vector arrays
     */
    private cosineSimilarity(vecA: number[], vecB: number[]): number {
        if (!vecA.length || !vecB.length || vecA.length !== vecB.length) return 0;
        let dotProduct = 0;
        let normA = 0;
        let normB = 0;

        for (let i = 0; i < vecA.length; i++) {
            dotProduct += vecA[i] * vecB[i];
            normA += vecA[i] * vecA[i];
            normB += vecB[i] * vecB[i];
        }

        if (normA === 0 || normB === 0) return 0;
        return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
    }

    /**
     * Perform Vector RAG Search using Gemini embeddings + Cosine Similarity
     */
    async search(query: string, topK: number = 3): Promise<string[]> {
        if (!query.trim()) return [];

        // Attempt Vector Search if LLMService is available
        if (this.llm) {
            try {
                const queryVector = await this.llm.getEmbedding(query);

                if (queryVector.length > 0) {
                    // Embed documents lazily if not already embedded
                    for (const doc of this.documents) {
                        if (!doc.embedding) {
                            doc.embedding = await this.llm.getEmbedding(doc.content);
                        }
                    }

                    // Score documents by cosine similarity
                    const scoredDocs = this.documents.map(doc => ({
                        doc,
                        score: doc.embedding ? this.cosineSimilarity(queryVector, doc.embedding) : 0
                    }));

                    // Sort descending by similarity score
                    scoredDocs.sort((a, b) => b.score - a.score);

                    return scoredDocs.slice(0, topK).map(item => item.doc.content);
                }
            } catch (err) {
                console.error("Vector search failed, falling back to keyword search:", err);
            }
        }

        // Fallback: Keyword search
        const keywords = query.toLowerCase().split(' ');
        const results = this.documents.filter(doc => {
            return keywords.some(k => doc.content.toLowerCase().includes(k));
        });
        return results.slice(0, topK).map(r => r.content);
    }
}
