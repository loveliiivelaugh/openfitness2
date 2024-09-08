import { Hono } from 'hono';
import { Context } from 'hono';

import { octokit } from '../../config/github.config';


const githubRoutes = new Hono();

githubRoutes.get('/', async (c: Context) => {

    const trackedRepos = [ "openfitness2" ];
    const owner = "loveliiivelaugh";
    
    try {

        // Compare: https://docs.github.com/en/rest/reference/users#get-the-authenticated-user
        const { data } = await octokit.rest.users.getAuthenticated();

        const commitsData = await Promise.all(
            trackedRepos
                .map((repo) => octokit.rest.repos
                    .listCommits({ owner, repo })
                )
                .map(async (repo) => {
                    const { data } = await repo;
                    return data;
                })
        );

        const [openfitness2] = commitsData;
        const commits = { openfitness2 };

        const commitsGroupedByDateAndProject = Object
            .keys(commits)
            .map((projectName) => ({
                projectName,
                commitsByDate: commits[projectName as keyof typeof commits]
                    .reduce((acc: { [key: string]: any[] }, current: any) => {
                        const date = current?.commit?.author?.date 
                            ? new Date(current.commit.author.date as string)
                                .toLocaleDateString()
                            : null;

                        if (!acc[date as keyof typeof acc]) acc[date as string] = [];

                        acc[date as keyof typeof acc].push(current);
                        
                        return acc;

                    }, {})
            }));

        const response = { 
            user: data,
            commits, 
            commitsGroupedByDateAndProject
        };

        return c.json(response);

    } catch (error: any) {

        return c.json(error);
    }
});

export { githubRoutes };