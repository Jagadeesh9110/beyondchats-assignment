import { callGemini } from "../config/gemini.js";

// Rewrites an article using Gemini based on external reference articles.

export const articleRewriteService = async ({
    originalContent,
    references
}) => {
    if (!originalContent || !references || references.length === 0) {
        throw new Error("Invalid input for article rewrite");
    }

    const referenceText = references
        .map(
            (ref, i) => `
Reference Article ${i + 1}:
Title: ${ref.title}
Content:
${ref.content}
`
        )
        .join("\n");

    const prompt = `
You are a senior technical content editor and SEO-focused blog writer.

Your role:
You specialize in rewriting technical blog articles to improve clarity, structure, depth, and readability while strictly preserving factual correctness.

---

TASK

You are given:
1) One original blog article written by BeyondChats.
2) Two high-quality reference articles from external authoritative websites that rank higher on Google.

Your task is to rewrite the original article so that:
- The content quality, structure, and formatting are comparable to the reference articles.
- The rewritten article remains faithful to the original article’s meaning and intent.
- The tone is professional, educational, and suitable for a technical audience.

---

CONSTRAINTS (VERY IMPORTANT)

You MUST:
- NOT copy sentences or phrases from the reference articles.
- NOT introduce new claims, statistics, or facts that are not present in the original article.
- NOT hallucinate information.
- Use the reference articles ONLY to guide structure, depth, and formatting style.
- Preserve the topic focus of the original article.

---

WRITING GUIDELINES

- Use clear section headings and subheadings.
- Improve paragraph flow and logical progression.
- Add bullet points or lists only when they improve readability.
- Avoid marketing fluff.
- Keep the article concise but informative.
- Write in Markdown format.

---

CITATION REQUIREMENT

At the END of the article, add a section titled:

## References

Under this section, list the reference articles as bullet points in the following format:

- **Title** – URL

Do NOT add citations inline. Only include them in the References section.

---

INPUT DATA

Original Article:
${originalContent}

${referenceText}

---

OUTPUT FORMAT

Return ONLY the rewritten article in Markdown.
Do NOT include explanations, reasoning steps, or commentary.
`;

    const rewrittenContent = await callGemini(prompt);

    return {
        aiContent: rewrittenContent,
        references: references.map(ref => ({
            title: ref.title,
            url: ref.url
        }))
    };
};
