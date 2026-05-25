import { pipeline } from "@xenova/transformers";

const extractor = await pipeline(
    "feature-extraction",
    "Xenova/all-MiniLM-L6-v2"
);

export const generateEmbedding = async (data) => {
    const output = await extractor(data);
    const embedding = output.tolist();
    const flatEmbedding = embedding.flat(2);
    return flatEmbedding;
}