
import { delay, lastValueFrom, of } from 'rxjs';
import { Search, UPDATE_FEILD_TYPE } from './api/search';
import fs from 'fs';
import pl from 'nodejs-polars';
// import { Results } from './api/search';

// const FEILD_TYPE_INDEX  = ['summary', 'status', 'assignee', 'updated'];
const FEILD_TYPE_INDEX  = ['*all'];

(async () => {
    const maxResults = 10;
    const startAt = 0;
    const fields = FEILD_TYPE_INDEX;
    const jql = 'project = todo AND status = "To Do"';

    let results = Search.Get(jql, startAt, maxResults, fields);
    results.subscribe((tickets) => {
        let df = pl.DataFrame();
        df = df.withColumns(pl.Series("id", [], pl.Utf8));
        df = df.withColumns(pl.Series("key", [], pl.Utf8));
        
        console.log(df);
        if (!tickets) {
            console.error('Error fetching results');
            return;
        }

        for(let ticket of tickets.issues) {
            let new_df = pl.DataFrame();
            new_df = new_df.withColumns(pl.Series("id", [ticket.id], pl.Utf8));
            new_df = new_df.withColumns(pl.Series("key", [ticket.key], pl.Utf8));
            
            df = df.vstack(new_df);
            
            // dataディレクトリにjsonファイルとして出力
            fs.writeFileSync(`./data/${ticket.id}.json`, JSON.stringify(ticket, null, 2));

            // console.log('ticket:', ticket.id, ticket.key, ticket.fields.summary, ticket.fields.updated);
            // for(const history of ticket.changelog.histories) {
            //     console.log('history:', history.id, history.created, history.items);
            //     for(const item of history.items) {
            //         if (UPDATE_FEILD_TYPE.includes(item.field)) {
            //             console.log('history:', history.id, history.created, item.field, item.fromString, item.toString);
            //         }
            //     }
            // }
        }
        console.log(df);
        df.writeParquet("tickets.parquet");
    }
    );
})();
