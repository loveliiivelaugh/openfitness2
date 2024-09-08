
const buildMarkdown = async ({ notionPageContent }: any) => {
    const { results } = notionPageContent;

    const date = new Date(results[0]?.last_edited_time).toLocaleDateString();
    const time = new Date(results[0]?.last_edited_time).toLocaleTimeString();

    type BlockType = { text: { content: string } };
    type ContentType = { paragraph: { rich_text: BlockType[] } };

    return [
        `Last updated: ${date} @ ${time}`,
        ...results
            .map((content: ContentType) => {
                const text = content?.paragraph?.rich_text
                    .map((block: BlockType) => block?.text?.content)
                    .join('');
                return text
            })
            .filter(Boolean)
    ].join('\n\n');
};

async function extractImages({ notionPageContent }: any) {
    const { results } = notionPageContent;

    type BlockType = { image: { file: { url: string } } };
    
    return results
        .map((content: BlockType) => content?.image?.file?.url)
        .filter(Boolean);
};

export const notionScripts = { buildMarkdown, extractImages };