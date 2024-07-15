
import { Search } from './api/search';
import fs from 'fs';
import path from 'path';
import { delay, firstValueFrom, lastValueFrom, of } from 'rxjs';
import { Field } from './api/field';

const FEILD_TYPE_INDEX  = ['summary', 'status', 'assignee', 'updated'];

const filePath = path.join(__dirname, 'data/fields.json');

let results = await firstValueFrom(Field.Get());

if (!results) {
    console.error('Error fetching results');
}else{
    for (let field of results) {
        const fieldJson = JSON.stringify(field.schema);
        console.log(`${field.name}|${field.id}|${fieldJson}`);
    }
    fs.writeFileSync(filePath, JSON.stringify(results, null, 2));
    console.log(`Total fields: ${results.length}`);
}

