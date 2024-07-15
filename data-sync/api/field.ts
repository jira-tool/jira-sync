import { JIRA_API_ENDPOINT, JIRA_BASE_URL } from "../config/config";
import { Get } from "./http_common";

const JIRA_API_ENDPOINT_FIELD = '/rest/api/3/field';

export type Field = {
    id: string,
    key: string,
    name: string,
    untranslatedName: string,
    custom: boolean,
    orderable: boolean,
    navigable: boolean,
    searchable: boolean,
    clauseNames: string[],
    schema: {
      type: string,
      custom: string,
      customId: number,
    },
}

export const Field = {
    Get: () => {
        const url = `${JIRA_BASE_URL}${JIRA_API_ENDPOINT_FIELD}`;
        const response = Get<Field[]>(url);
        return response;
    }
}
