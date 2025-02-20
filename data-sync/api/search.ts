import { JIRA_BASE_URL, JIRA_API_ENDPOINT } from '../config/config';
import { Get } from './http_common';

export const UPDATE_FEILD_TYPE  = ['updated'];

export type SearchReults = {
    issues: [{
        key: string,
        id: string,
        changelog: {
            histories: {
                id: string,
                created: string,
                items: {
                    field: string,
                    fieldtype: string,
                    from: string,
                    fromString: string,
                    to: string,
                    toString: string
                }[]
        }[]},
        fields: {
            summary: string,
            status: {
                name: string,
                statusCategory: {
                    key: string,
                    name: string
                }
            },
            updated: string,
            assignee: {
                name: string
            }
        }
    }];
}

export const Search = {
    Get: (
        jql: string,
        startAt: number = 0,
        maxResults: number = 50,
        fields: string[] = ['summary', 'status', 'updated', 'assignee'],
        expand: string[] = ['changelog']
    ) => {
        const url = `${JIRA_BASE_URL}${JIRA_API_ENDPOINT}/?jql=${jql}&startAt=${startAt}&maxResults=${maxResults}&fields=${fields.join(',')}&expand=${expand.join(',')}`;
        const response = Get<SearchReults>(url);
        return response;
    }
}
