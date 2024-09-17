import { 
    Box, Container,
    Grid, List, ListItem, ListItemText, Typography 
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";

import FormContainer from '../Fitness/layout/forms/FormContainer';
import { NotionPage } from "../../NotionPage";
import { paths, QueryWrapper } from "../Fitness/api";


const Styled = {
    ChangelogContainer: styled(Box)(() => ({
        display: "flex", 
        width: "100vw", 
        justifyContent: "space-around"
    })),
    ReportingContainer: styled(Grid)(() => ({
        textAlign: "center", 
        border: "2px solid #333", 
        padding: "16px",
        borderRadius: "32px", 
        // margin: "0 58%"
    }))
};

const DocsView = () => {
    const { type } = useParams();

    const title = {
        "documentation": "Documentation",
        "roadmap": "Roadmap"
    }[type as "documentation" | "roadmap"] || "";

    return (
        <Container maxWidth="lg">
            <Grid container sx={{ mt: 18, p: 2 }}>
                    {/* Header */}
                <Grid item xs={12} sx={{ textAlign: "center" }}>
                    <Typography variant="h4">
                        {title}
                    </Typography>
                </Grid>
                    {/* Content */}
                <Grid item sm={12}>
                    <NotionPage path={paths.openfitness + `/notion/${type}`} />
                </Grid>
            </Grid>
        </Container>
    );
};

const ChangelogView = () => (
    <Styled.ChangelogContainer>
        <Container maxWidth="md">
            <Grid container sx={{ mt: 16, p: 2 }}>
                <Grid item xs={12} sx={{ textAlign: "center" }}>
                    <Typography variant="h4">
                        Changelog
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <List sx={{ width: "100%" }}>
                        <QueryWrapper 
                            path={paths.github} 
                            errorContent={(error) => (
                                <>
                                    Something went wrong!
                                    {console.error("handleError", error)}
                                </>
                            )}
                        >
                            {({ data }) => data?.commits?.openfitness2.map((entry: any) => (
                                <ListItem key={entry.node_id}>
                                    <ListItemText 
                                        primary={entry.commit.message} 
                                        secondary={moment(entry.commit.committer.date).fromNow()}
                                    />
                                </ListItem>
                            ))}
                        </QueryWrapper>
                    </List>
                </Grid>
            </Grid>
        </Container>
    </Styled.ChangelogContainer>
);

const ReportingView = () => {
    const navigate = useNavigate();
    const { type } = useParams();

    const title = {
        "bug": "Bug Report",
        "feature": "Feature Request"
    }[type as "bug" | "feature"] || "";

    return (
        <Styled.ReportingContainer>
            <Grid item sm={12}>
                <Typography variant="h4" component="p">
                    {title}
                </Typography>
            </Grid>
            <Grid item sm={12}>
                <QueryWrapper path={paths.database + "/schema"}>
                    {({ data }) => data && (
                        <FormContainer 
                            schema={data.find(({ table }: { table: string }) => (table === type))}
                            handleRefreshQueries={() => {}}
                            noDefaults
                            handleCancelClick={() => navigate("/")}
                        />
                    )}
                </QueryWrapper>
            </Grid>
        </Styled.ReportingContainer>
    );
};

const views = {
    "documentation": (<DocsView />),
    "roadmap": (<DocsView />),
    "changelog": (<ChangelogView />),
    "feature": (<ReportingView />),
    "bug": (<ReportingView />),
};

const DocsPage = () => {
    const { type } = useParams();
    return (views[type as keyof typeof views])
};

export default DocsPage
