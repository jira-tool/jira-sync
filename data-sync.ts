
import { Search } from './api/search';
import fs from 'fs';
import path from 'path';
import { delay, firstValueFrom, lastValueFrom, of } from 'rxjs';

const FEILD_TYPE_INDEX  = ['summary', 'status', 'assignee', 'updated'];

(async () => {
    const maxResults = 10;
    let startAt = 0;
    const fields = FEILD_TYPE_INDEX;
    const jql = 'project = todo AND status = "To Do"';

    // jqlで指定した条件に一致するチケットを取得。maxResultsを超える場合は、複数回に分けて取得する
    let isLoop = true;
    let isReady = true;

    while (isLoop) {
        if (!isReady) {
            continue;
        }
        isReady = false;
        let results = await firstValueFrom(Search.Get(jql, startAt, maxResults, fields));
        if (!results) {
            console.error('Error fetching results');
            isLoop = false;
            return;
        }
        console.log(results);

        if (!results.issues) {
            console.log('No tickets found');
            isLoop = false;
            return;
        }

        if (results.issues.length < maxResults) {
            console.log('All tickets fetched');
            isLoop = false;
            return;
        }
        for(let ticket of results.issues) {
            // チケットごとにファイルに書き込む
            const filePath = path.join(__dirname, `data/${ticket.key}.json`);
            fs.writeFileSync(filePath, JSON.stringify(ticket, null, 2));
            
            console.log('ticket:', ticket.key, ticket.fields.summary, ticket.fields.updated);
        }
        isReady = true;
        startAt += maxResults;
        console.log('startAt:', startAt);
        await lastValueFrom(of(null).pipe(delay(2000))); // 1秒待機
    }
    



})();
