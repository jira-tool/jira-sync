
import { delay, lastValueFrom, of } from 'rxjs';
import { Search, UPDATE_FEILD_TYPE } from './api/search';
// import { Results } from './api/search';

const FEILD_TYPE_INDEX  = ['summary', 'status', 'assignee', 'updated'];

(async () => {
    const maxResults = 10;
    const startAt = 0;
    const fields = FEILD_TYPE_INDEX;
    const jql = 'project = todo AND status = "To Do"';

    let results = Search.Get(jql, startAt, maxResults, fields);
    results.subscribe((tickets) => {
        if (!tickets) {
            console.error('Error fetching results');
            return;
        }

        for(let ticket of tickets.issues) {
            console.log('ticket:', ticket.key, ticket.fields.summary, ticket.fields.updated);
        }

        // console.log('results:', tickets);
    }
    );
})();
