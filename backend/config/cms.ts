const localPort = (port: string | undefined) => `http://localhost:${(port || "0000")}`;

const ADMIN = 'admin';
const GUEST = 'guest';

export const cms = {
    navbar: {
        title: "Family Apps",
        subtitle: "Private applications to be used and shared with my family.",
    },
    home: {
        title: "Family Apps Launcher",
        subtitle: `
            Private applications are built to maintain privacy and security across commonly used applications and software tools. 
            These applications can allow for personalization and customization beyond what is possible in commercial products. 
            Privatizing application usage gives us the ability to own our data and use it for a variety of personal reasons. 
            Beyond that, many applications carry a financial burden. With private apps we can circumvent these costs.
        `,
        launcherText: "Select an app to launch",
        footerText: "© Copyright 2024. All Rights Reserved.",
    },
    blog: {
        title: "Writings & Words",
        subtitle: "Family Apps Blog",
        footerText: "© Copyright 2024. All Rights Reserved.",
    },
    openfitness: {
        title: "OpenFitness",
        subtitle: "Fitness Tracker. Private. Locally. ",
        topics: [
            "Weight",
            "Food",
            "Exercise",
            "Profile",
            "Sleep",
            "Steps",
            "Ai",
            // "Planning",
            // "Settings"
        ]
    },
    ai_chat: {
        title: "Chat",
        subtitle: "Ask me anything. I'll do my best to answer.",
        available_models: [
            {
                name: 'PrivateGPT',
                value: 'PrivateGPT',
                description: 'Chat with Documents privately and locally. PrivateGPT is a production-ready AI project that allows you to ask questions about your documents using the power of Large Language Models (LLMs), even in scenarios without an Internet connection. 100% private, no data leaves your execution environment at any point. Selecting this model as default model is required when chatting with ingested documents.',
                notes: 'Really good!'
            },
            {
                name: 'Code Llama',
                value: 'codellama:latest',
                description: 'Code Llama is a model for generating and discussing code, built on top of Llama 2. It’s designed to make workflows faster and efficient for developers and make it easier for people to learn how to code. It can generate both code and natural language about code. Code Llama supports many of the most popular programming languages used today, including Python, C++, Java, PHP, Typescript (Javascript), C#, Bash and more.',
                notes: 'BEST for coding.'
            },
            {
                name: 'Code Llama',
                value: 'codellama:7b-instruct',
                description: '*Note* Model will be used for Open Interpreter. Will be integrated later. Code Llama is a model for generating and discussing code, built on top of Llama 2. It’s designed to make workflows faster and efficient for developers and make it easier for people to learn how to code. It can generate both code and natural language about code. Code Llama supports many of the most popular programming languages used today, including Python, C++, Java, PHP, Typescript (Javascript), C#, Bash and more.',
                notes: 'BEST for automated coding.'
            },
            {
                name: 'Dolphin-Mistral',
                value: 'dolphin-mistral:latest',
                description: 'An uncensored, fine-tuned model based on the Mixtral mixture of experts model that excels at coding tasks. Created by Eric Hartford.',
                notes: 'Experimental.'
            },
            {
                name: 'gemma:latest',
                value: 'gemma:latest',
                description: 'Gemma is a family of lightweight, state-of-the-art open models built by Google DeepMind. Updated to version 1.1',
                notes: 'Google'
            },
            {
                name: 'dolphin-mistral:latest',
                value: 'dolphin-mistral:latest',
                description: 'The Dolphin model by Eric Hartford, based on Mistral version 0.2 released in March 2024. This model is uncensored, available for both commercial and non-commercial use, and excels at coding.',
                notes: 'Uncensored'
            },
            {
                name: 'Llama 2',
                value: 'llama2:latest',
                description: 'Llama 2 is released by Meta Platforms, Inc. This model is trained on 2 trillion tokens, and by default supports a context length of 4096. Llama 2 Chat models are fine-tuned on over 1 million human annotations, and are made for chat.',
                notes: 'BEST general purpose chat model.'
            },
            {
                name: 'Llama 2 Online',
                value: 'Llama 2 Online',
                description: 'Modified to use information from the internet. Llama 2 is released by Meta Platforms, Inc. This model is trained on 2 trillion tokens, and by default supports a context length of 4096. Llama 2 Chat models are fine-tuned on over 1 million human annotations, and are made for chat.',
                notes: 'Free but includes monthly requests cap.'
            },
            {
                name: 'Llama 2 Functions',
                value: 'Llama 2 Functions',
                description: '*In Development* Modified to use functions. Whats for lunch today? What are the open gym times today? These are a few examples of what function calling is capable of doing. Llama 2 is released by Meta Platforms, Inc. This model is trained on 2 trillion tokens, and by default supports a context length of 4096. Llama 2 Chat models are fine-tuned on over 1 million human annotations, and are made for chat.',
                notes: 'In development.'
            },
            {
                name: 'LlaVa',
                value: 'llava:latest',
                description: 'LLaVA is a multimodal model that combines a vision encoder and Vicuna for general-purpose visual and language understanding, achieving impressive chat capabilities mimicking spirits of the multimodal GPT-4. Chat will default to this model when sending images in chat.',
                notes: 'May get removed in favor of newer version.'
            },
            {
                name: 'LlaVa',
                value: 'llava:7b-v1.6',
                description: 'Newest version of LLaVA is a multimodal model that combines a vision encoder and Vicuna for general-purpose visual and language understanding, achieving impressive chat capabilities mimicking spirits of the multimodal GPT-4. Chat will default to this model when sending images in chat.',
                notes: 'Defaults to this model for computer vision.'
            },
            {
                name: 'Mistral',
                value: 'mistral:latest',
                description: 'Mistral is a 7.3B parameter model, distributed with the Apache license. It is available in both instruct (instruction following) and text completion.'
            },
            {
                name: 'SQLCoder',
                value: 'sqlcoder:latest',
                description: 'SQLCoder is a 15B parameter model that is fine-tuned on a base StarCoder model. It slightly outperforms gpt-3.5-turbo for natural language to SQL generation tasks on the sql-eval framework, and outperforms popular open-source models. It also significantly outperforms text-davinci-003, a model that’s more than 10 times its size.'
            },
            {
                name: 'Wizard Math',
                value: 'wizard-math:latest',
                description: 'WizardMath was released by WizardLM. It is trained on the GSM8k dataset, and targeted at math questions. It is available in 7B, 13B, and 70B parameter sizes.',
                notes: 'Good for math.'
            },
        ],
    },

    netlifyBadges: {
        "familyApps": `[![Netlify Status](https://api.netlify.com/api/v1/badges/1edf639c-503b-483c-ae7c-8518dcb9db10/deploy-status)](https://app.netlify.com/sites/familyapps2/deploys)`,
        "homeServer": `Deployed on Render`,
        "openFitness": `[![Netlify Status](https://api.netlify.com/api/v1/badges/17584298-1ea6-4693-88ca-dcc04f60f1be/deploy-status)](https://app.netlify.com/sites/openfitness/deploys)`,
        "aiChat": `[![Netlify Status](https://api.netlify.com/api/v1/badges/e66cd036-f62c-4452-9344-4441af1cd6f4/deploy-status)](https://app.netlify.com/sites/woodwardchat/deploys)`,
        "smartCamera": `[![Netlify Status](https://api.netlify.com/api/v1/badges/b5eb9323-f7ec-483d-a349-f0b257f5e550/deploy-status)](https://app.netlify.com/sites/smarticamera/deploys)`
    },
    apps: [
        {
            "name": "FamilyApps",
            "icon": "😃",
            "link": "/",
            "url": Bun.env.FAMILYAPPS_HOSTNAME,
            "dev_url": localPort("3000"),
            "repo": "https://github.com/loveliiivelaugh/FamilyApps",
            "disabled": false,
            "roles": [GUEST, ADMIN],
            "category": [
                "Essentials"
            ],
            "tags": [
                "essentials",
                "fitness"
            ]
        },
        {
            "name": "Fitness",
            "icon": "🏋️‍♀️",
            "link": "/",
            "url": Bun.env.OPENFITNESS_HOSTNAME,
            "dev_url": localPort("3001"),
            "repo": "https://github.com/loveliiivelaugh/openfitness",
            "disabled": false,
            "roles": [ADMIN, GUEST],
            "category": [
                "Essentials"
            ],
            "tags": [
                "essentials",
                "fitness"
            ]
        },
        {
            "name": "AI",
            "icon": "🤖",
            "link": "/",
            "disabled": false,
            "roles": [ADMIN, GUEST],
            "url": Bun.env.AICHAT_HOSTNAME,
            "dev_url": localPort("3002"),
            "repo": "https://github.com/loveliiivelaugh/aichat",
            "category": [
                "Essentials"
            ],
            "tags": [
                "essentials",
                "ai"
            ]
        },
        {
            "name": "camera",
            "icon": "😃",
            "link": "/camera",
            "disabled": false,
            "roles": [ADMIN, GUEST],
            "url": Bun.env.SMARTCAMERA_HOSTNAME,
            "dev_url": localPort("3003"),
            "repo": "https://github.com/loveliiivelaugh/smartcamera",
            "category": [
                "Essentials"
            ],
            "tags": [
                "essentials",
                "ai"
            ]
        },

        // TODO: Hide/Disable following apps for production
        { 
            "name": "Photos", 
            "icon": "📷",
            // "link": "/photos",
            "disabled": false,
            "roles": [ADMIN],
            // "url": Bun.env.SMARTCAMERA_HOSTNAME,
            // "dev_url": localPort("3003"),
            // "repo": "https://github.com/loveliiivelaugh/smartcamera",
            "category": [
                "Essentials"
            ],
            "tags": [
                "essentials",
                "photos"
            ]
        },
        // {
        //     // App to provide UI for CrewAI
        //     "name": "ChatBones",
        //     "icon": "💬",
        //     "link": "/chat-bones",
        //     "disabled": true,
        // "roles": [ADMIN],
        //     "url": null,
        //     "dev_url": null,
        //     "category": [
        //         "Essentials"
        //     ],
        //     "tags": [
        //         "essentials",
        //         "ai"
        //     ]
        // },
        {
            "name": "eReader",
            "icon": "📚",
            // "link": "/eReader",
            "disabled": false,
            "roles": [ADMIN],
            "url": null,
            "dev_url": null,
            "category": [
                "Essentials"
            ],
            "tags": [
                "essentials",
                "ai",
                "eReader",
                "books"
            ]
        },
        // {
        //     "name": "Storage",
        //     "icon": "😎",
        //     "link": "/storage",
        //     "disabled": true,
        // "roles": [ADMIN],
        //     "url": null,
        //     "dev_url": null,
        //     "category": [
        //         "Essentials"
        //     ],
        //     "tags": [
        //         "essentials",
        //         "storage"
        //     ]
        // },
        {
            "name": "Admin Dashboard",
            "icon": "😇",
            "link": "/admin",
            "disabled": false,
            "roles": [ADMIN],
            "url": null,
            "dev_url": null,
            "category": [
                "Essentials"
            ],
            "tags": [
                "essentials",
                "admin"
            ]
        }
    ],
    dockerApps: [
        { name: "Github", roles: [ADMIN], icon: "❤️", disabled: true },  // disable for production
        { name: "OpenWebUI", roles: [ADMIN], icon: "😎", "url": localPort("3000"), disabled: true },
        { name: "Notion", roles: [ADMIN], icon: "📝", disabled: true },
        { name: "Wordpress Site", roles: [ADMIN], icon: "📄", "url": localPort("8000"), disabled: true },
        { name: "Wordpress Admin", roles: [ADMIN], icon: "📄", "url": (localPort("8000") + "/wp-admin"), disabled: true },
        { name: "PHP Admin", roles: [ADMIN], icon: "📄", "url": localPort("8080"), disabled: true },
        { name: "PGAdmin", roles: [ADMIN], icon: "📄", "url": localPort("5050"), disabled: true },
        { name: "Keycloak", roles: [ADMIN], icon: "📄", "url": localPort("8180"), disabled: true },
        { name: "Perplexity", roles: [ADMIN], icon: "📄", "url": localPort("0000"), disabled: true },
        { name: "Private GPT", roles: [ADMIN], icon: "📄", "url": localPort("0000"), disabled: true },
        { name: "Docs", roles: [ADMIN, GUEST], icon: "📄" },
        { name: "Changelog", roles: [ADMIN, GUEST], icon: "📄" },
        { name: "Noah", roles: [ADMIN], icon: "😎" },
    ]
}
