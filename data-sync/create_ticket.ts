import { JIRA_BASE_URL, JIRA_USERNAME, JIRA_API_TOKEN } from './config/config';

const JIRA_API_ENDPOINT = '/rest/api/3/issue';

async function createJiraTicket(projectKey: string, summary: string, description: string, issueType: string) {
    const url = `${JIRA_BASE_URL}${JIRA_API_ENDPOINT}`;
    const encodedCredentials = Buffer.from(`${JIRA_USERNAME}:${JIRA_API_TOKEN}`).toString('base64');

    const payload = {
        fields: {
            project: {
                key: projectKey
            },
            summary: summary,
            issuetype: {
                name: issueType
            }
        }
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${encodedCredentials}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const data = await response.json();
            console.error('Error creating JIRA ticket:', response.status, response.statusText);
            return null;
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error('Error creating JIRA ticket:', error);
        return null;
    }
}

(async () => {
    const projectKey = 'TODO';
    const summary = 'Issue';
    const description = 'This is a sample issue created via API';
    const issueType = 'Task';

    const ticket = await createJiraTicket(projectKey, summary, description, issueType);

    if (ticket) {
        console.log('JIRA Ticket Created:', ticket);
    } else {
        console.log('Failed to create JIRA ticket.');
    }
})();