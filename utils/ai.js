// Lightweight rule-based "AI" helpers.
// No external API key required. Swap these out later for a real LLM/NLP API
// (OpenAI, Gemini, HuggingFace, etc.) without changing the routes that call them.

const STOPWORDS = new Set(['the','a','an','and','or','but','is','are','was','were','be','been',
    'to','of','in','on','for','with','as','by','at','this','that','it','from','has','have',
    'had','will','would','can','could','should','not','i','we','you','they','he','she']);

const POSITIVE_WORDS = ['good','great','excellent','amazing','love','best','happy','wonderful',
    'awesome','fantastic','helpful','improve','success','positive','beautiful','easy'];

const NEGATIVE_WORDS = ['bad','worst','terrible','hate','poor','difficult','fail','failure',
    'negative','sad','angry','problem','issue','broken','ugly','disappointing'];

// --- Auto-tagging: pick the most frequent meaningful words as tags ---
function generateTags(content, max = 5) {
    const words = content.toLowerCase().match(/[a-z]{3,}/g) || [];
    const freq = {};
    for (const w of words) {
        if (STOPWORDS.has(w)) continue;
        freq[w] = (freq[w] || 0) + 1;
    }
    return Object.entries(freq)
        .sort((a, b) => b[1] - a[1])
        .slice(0, max)
        .map(([word]) => word);
}

// --- Sentiment analysis: word-count scoring ---
function analyzeSentiment(text) {
    const words = text.toLowerCase().match(/[a-z]+/g) || [];
    let score = 0;
    for (const w of words) {
        if (POSITIVE_WORDS.includes(w)) score++;
        if (NEGATIVE_WORDS.includes(w)) score--;
    }
    if (score > 0) return 'positive';
    if (score < 0) return 'negative';
    return 'neutral';
}

// --- Plagiarism detection: Jaccard similarity of word sets against existing blogs ---
function jaccardSimilarity(textA, textB) {
    const setA = new Set(textA.toLowerCase().match(/[a-z]{3,}/g) || []);
    const setB = new Set(textB.toLowerCase().match(/[a-z]{3,}/g) || []);
    if (setA.size === 0 || setB.size === 0) return 0;
    let intersection = 0;
    for (const w of setA) if (setB.has(w)) intersection++;
    const union = new Set([...setA, ...setB]).size;
    return Math.round((intersection / union) * 100);
}

function checkPlagiarism(newContent, existingBlogs) {
    let highest = 0;
    for (const blog of existingBlogs) {
        const score = jaccardSimilarity(newContent, blog.content);
        if (score > highest) highest = score;
    }
    return highest; // percentage 0-100
}

// --- Simple extractive summary: first 2 sentences ---
function generateSummary(content, sentenceCount = 2) {
    const sentences = content.match(/[^.!?]+[.!?]+/g) || [content];
    return sentences.slice(0, sentenceCount).join(' ').trim();
}

module.exports = { generateTags, analyzeSentiment, checkPlagiarism, generateSummary };
