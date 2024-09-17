import { Context } from "hono";

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

async function handleListReturn(c: Context) {
    const { notionClient } = c.var.clients;
    try {

        const homepageChildren = await notionClient.blocks.children.list({
            block_id: "2a822d5e-ac09-4df3-9981-588809928086",
            page_size: 50,
        });

        return c.json(
            homepageChildren.results
                .filter((block: { type: string }) => (block.type === "child_page"))
        );

    } catch (error) {
        console.error(error)

        return c.json({ message: "something went wrong", error })
    };
};

export const notionScripts = { buildMarkdown, extractImages, handleListReturn };