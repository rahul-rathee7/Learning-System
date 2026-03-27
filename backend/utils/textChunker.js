/**
 * Split text into chunks for better AI processing
 * @param {string} text - Full text to chunk
 * @param {number} chunkSize - Target size per chunk (in words)
 * @param {number} overlap - Number of words to overlap between chunks
 * @returns {Array<{content: string, chunkIndex: number, pageNumber: number}>}
 */
export const chunkText = (text, chunkSize = 500, overlap = 50) => {
    if (!text || !text.trim()) return [];

    // Clean text (preserve structure, avoid destroying whitespace)
    const cleanedText = text
        .replace(/\r\n/g, '\n')
        .replace(/\n{3,}/g, '\n\n')
        .trim();

    // Split into paragraphs
    const paragraphs = cleanedText
        .split(/\n+/)
        .filter(p => p.trim().length > 0);

    const chunks = [];
    let currentChunk = [];
    let currentWordCount = 0;
    let chunkIndex = 0;

    for (const paragraph of paragraphs) {
        const words = paragraph.trim().split(/\s+/);
        const wordCount = words.length;

        // If paragraph itself is too large → split directly
        if (wordCount > chunkSize) {
            // Flush existing chunk
            if (currentChunk.length) {
                chunks.push({
                    content: currentChunk.join('\n\n'),
                    chunkIndex: chunkIndex++,
                    pageNumber: 0
                });
                currentChunk = [];
                currentWordCount = 0;
            }

            // Split large paragraph by words
            for (let i = 0; i < words.length; i += (chunkSize - overlap)) {
                const slice = words.slice(i, i + chunkSize);
                chunks.push({
                    content: slice.join(' '),
                    chunkIndex: chunkIndex++,
                    pageNumber: 0
                });
            }

            continue;
        }

        // If adding paragraph exceeds limit → save current chunk
        if (currentWordCount + wordCount > chunkSize && currentChunk.length) {
            chunks.push({
                content: currentChunk.join('\n\n'),
                chunkIndex: chunkIndex++,
                pageNumber: 0
            });

            // Add overlap from previous chunk
            const prevWords = currentChunk.join(' ').split(/\s+/);
            const overlapWords = prevWords.slice(-overlap).join(' ');

            currentChunk = [overlapWords, paragraph.trim()];
            currentWordCount =
                overlapWords.split(/\s+/).length + wordCount;
        } else {
            currentChunk.push(paragraph.trim());
            currentWordCount += wordCount;
        }
    }

    // Push final chunk
    if (currentChunk.length) {
        chunks.push({
            content: currentChunk.join('\n\n'),
            chunkIndex: chunkIndex++,
            pageNumber: 0
        });
    }

    // Fallback: if paragraph logic failed
    if (!chunks.length && cleanedText.length) {
        const words = cleanedText.split(/\s+/);
        for (let i = 0; i < words.length; i += (chunkSize - overlap)) {
            const slice = words.slice(i, i + chunkSize);
            chunks.push({
                content: slice.join(' '),
                chunkIndex: chunkIndex++,
                pageNumber: 0
            });
        }
    }

    return chunks;
};

/**
 * Find relevant chunks based on keyword matching
 * @param {Array<Object>} chunks - Array of chunks
 * @param {string} query - Search query
 * @param {number} maxChunks - Maximum chunks to return
 * @returns {Array<Object>}
 */
export const findRelevantChunks = (chunks, query, maxChunks = 3) => {
    if (!chunks || !chunks.length || !query) return [];

    // Common stop words
    const stopWords = new Set([
        'the','is','at','which','on','a','an','and','or','but',
        'in','with','to','for','of','as','by','this','that','it'
    ]);

    // Clean query words
    const queryWords = query
        .toLowerCase()
        .split(/\s+/)
        .filter(w => w.length > 2 && !stopWords.has(w));

    // If no meaningful words → return first chunks
    if (!queryWords.length) {
        return chunks.slice(0, maxChunks).map(chunk => ({
            content: chunk.content,
            chunkIndex: chunk.chunkIndex,
            pageNumber: chunk.pageNumber,
            _id: chunk._id
        }));
    }

    const scoredChunks = chunks.map((chunk, index) => {
        const content = chunk.content.toLowerCase();
        const wordCount = content.split(/\s+/).length;

        let score = 0;

        for (const word of queryWords) {
            const exactMatches =
                (content.match(new RegExp(`\\b${word}\\b`, 'g')) || []).length;

            const partialMatches =
                (content.match(new RegExp(word, 'g')) || []).length;

            score += exactMatches * 3;
            score += Math.max(0, partialMatches - exactMatches) * 1.5;
        }

        // Bonus if multiple query words found
        const uniqueMatches = queryWords.filter(word =>
            content.includes(word)
        ).length;

        if (uniqueMatches > 1) {
            score += uniqueMatches * 2;
        }
        const normalizedScore = score / Math.sqrt(wordCount);
        const positionBonus = 1 - (index / chunks.length) * 0.1;

        return {
            content: chunk.content,
            chunkIndex: chunk.chunkIndex,
            pageNumber: chunk.pageNumber,
            _id: chunk._id,
            score: normalizedScore * positionBonus,
            rawScore: score,
            matchedWords: uniqueMatches
        };
    });

    return scoredChunks
        .filter(chunk => chunk.score > 0)
        .sort((a, b) => {
            if (b.score !== a.score) return b.score - a.score;
            if (b.matchedWords !== a.matchedWords)
                return b.matchedWords - a.matchedWords;
            return a.chunkIndex - b.chunkIndex;
        })
        .slice(0, maxChunks);
};