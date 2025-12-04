import { DatabaseManager } from '../db/DatabaseManager';

export interface RAGDocument {
    id: string;
    content: string;
    meta: any;
}

export class RAGService {
    private documents: RAGDocument[] = [];

    constructor() {
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

    async search(query: string): Promise<string[]> {
        // Simple keyword search for this demo
        // In production, use vector embeddings (Pinecone/Milvus)
        const keywords = query.toLowerCase().split(' ');
        const results = this.documents.filter(doc => {
            return keywords.some(k => doc.content.toLowerCase().includes(k));
        });
        return results.map(r => r.content);
    }
}
