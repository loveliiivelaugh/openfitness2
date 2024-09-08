import { Box } from "@mui/material";
import { QueryWrapper } from "../pages/Fitness/api";
import MarkdownWrapper from "../MarkdownWrapper/MarkdownWrapper";


interface NotionPageProps { 
    path: string // to wherever the notion page data is
};

const NotionPage = (props: NotionPageProps) => (
    <QueryWrapper {...props}>
        {({ data }) => (
            <Box>
                <MarkdownWrapper>
                    {data?.markdown}
                </MarkdownWrapper>
            </Box>
        )}
    </QueryWrapper>
);

export default NotionPage