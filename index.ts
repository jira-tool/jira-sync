import { JIRA_BASE_URL, JIRA_API_ENDPOINT, JIRA_USERNAME, JIRA_API_TOKEN } from './config';

async function get(jql: string, 
    startAt: number = 0, 
    maxResults: number = 50, 
    fields: string[] = ['summary', 'status'], 
    expand: string[] = ['changelog']) {
    const url = `${JIRA_BASE_URL}${JIRA_API_ENDPOINT}/?jql=${jql}&startAt=${startAt}&maxResults=${maxResults}&fields=${fields.join(',')}&expand=${expand.join(',')}`;
    const credentials = Buffer.from(`${JIRA_USERNAME}:${JIRA_API_TOKEN}`).toString('base64');

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Basic ${credentials}`,
                'Accept': 'application/json',
                'Accept-Encoding': 'gzip'
            },
        });

        if (!response.ok) {
            console.error('Error fetching:', response.status, response.statusText);
            return null;
        }

        const response_json = await response.json();
        return response_json;

    } catch (error) {
        console.error('Error fetching:', error);
        return null;
    }
}

(async () => {
    const maxResults = 10;
    const startAt = 0;
    const fields = ['summary', 'status', 'assignee'];
    const jql = 'project = todo AND status = "To Do"';
    const results = await get(jql, startAt, maxResults, fields);
    if (results) {
        console.log('result:', results);
    } else {
        console.log('Failed to fetch.');
    }
})();
