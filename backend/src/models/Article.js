import mongoose from "mongoose";

const ReferenceSchema = new mongoose.Schema({
    title: String,
    url: String,
    source: String
}, { _id: false });

const ArticleSchema = new mongoose.Schema(
    {
        // Core scraped data
        title: {
            type: String,
            required: true,
            trim: true
        },

        slug: {
            type: String,
            required: true,
            unique: true,
            index: true
        },

        author: {
            type: String,
            default: "Unknown"
        },

        publishedAt: {
            type: Date
        },

        tags: {
            type: [String],
            default: []
        },

        originalContent: {
            type: String,
            required: true
        },

        // AI-generated version (Phase-2)
        aiContent: {
            type: String,
            default: null
        },

        references: {
            type: [ReferenceSchema],
            default: []
        },

        // metadata
        isUpdatedByAI: {
            type: Boolean,
            default: false,
            index: true
        },

        sourceUrl: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model("Article", ArticleSchema);
