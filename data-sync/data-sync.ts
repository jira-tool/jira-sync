
import { Search } from './api/search';
import fs from 'fs';
import path from 'path';
import { delay, firstValueFrom, lastValueFrom, of } from 'rxjs';
import { PROJECT_NAME } from './config/settings';

const FEILD_TYPE_INDEX  = ['summary', 'status', 'assignee', 'updated'];

(async () => {
    const maxResults = 10;
    let startAt = 0;
    const fields = ['*all'];
    const jql = 'project = todo AND status = "To Do"';

    // jqlで指定した条件に一致するチケットを取得。maxResultsを超える場合は、複数回に分けて取得する
    let isLoop = true;
    
    while (isLoop) {
        let results = await firstValueFrom(Search.Get(jql, startAt, maxResults, fields));
        if (!results) {
            console.error('Error fetching results');
            return;
        }
        if (!results.issues) {
            console.log('No tickets found');
            return;
        }

        if (results.issues.length < maxResults) {
            console.log('All tickets fetched');
            return;
        }

        for(let ticket of results.issues) {
            // チケットごとにファイルに書き込む
            const filePath = path.join(__dirname, `data/${PROJECT_NAME}/${ticket.key}.json`);
            if (!fs.existsSync(path.dirname(filePath))) {
                fs.mkdirSync(path.dirname(filePath), { recursive: true });
            }
            fs.writeFileSync(filePath, JSON.stringify(ticket, null, 2));
            
            console.log('ticket:', ticket.key, ticket.fields.summary, ticket.fields.updated);
        }
        startAt += maxResults;
        console.log('startAt:', startAt);
        await lastValueFrom(of(null).pipe(delay(2000))); // 1秒待機
    }
})();
