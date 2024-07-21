import pl, { Utf8 } from 'nodejs-polars';
import fs from 'fs';
import path from 'path';

const dirPath = './data/todo/';
const files = fs.readdirSync(dirPath);
const jsonFiles = files.filter((file) => {
    return path.extname(file) === '.json';
});

const fieldsFilePath = path.join('./data', 'fields.json');
const fields = JSON.parse(fs.readFileSync(fieldsFilePath, 'utf-8'));

let df = pl.DataFrame();
df = df.withColumns(pl.Series("id", [], pl.Utf8));
df = df.withColumns(pl.Series("key", [], pl.Utf8));
df = df.withColumns(pl.Series("changelog", [], pl.Utf8));
for (const field of fields) {
    // console.log(field.key);
    if (field.schema) {
        if(field.schema.type === 'string') {
            df = df.withColumns(pl.Series(field.name, [], pl.Utf8));
        }else if (field.schema.type === 'number') {
            // Decimal型でデフォルト値は0
            df = df.withColumns(pl.Series(field.name, [], pl.Utf8));
        }else if(field.schema.type === 'date') {
            df = df.withColumns(pl.Series(field.name, [], pl.Date));
        }else if(field.schema.type === 'datetime') {
            df = df.withColumns(pl.Series(field.name, [], pl.Utf8));
        }else {
            df = df.withColumns(pl.Series(field.name, [], pl.Utf8));
        }
    }
}

for (const file of jsonFiles) {
    const filePath = path.join(dirPath, file);
    const rowJson = JSON.parse(fs.readFileSync(filePath, 'utf-8')); 
    let dfRow = pl.DataFrame();
    dfRow = dfRow.withColumn(pl.Series("id", [rowJson.id], pl.Utf8));
    dfRow = dfRow.withColumn(pl.Series("key", [rowJson.key], pl.Utf8));
    const changeLogJson = JSON.stringify(rowJson.changelog);
    dfRow = dfRow.withColumn(pl.Series("changelog", [changeLogJson], pl.Utf8));
    for (const field of fields) {
        if (field.schema) {
            if(field.schema.type === 'string') {
                dfRow = dfRow.withColumn(pl.Series(field.name, [rowJson.fields[field.key]], pl.Utf8));
            }else if(field.schema.type === 'number') {
                const value = rowJson.fields[field.key] ? rowJson.fields[field.key].toString() : '0';
                dfRow = dfRow.withColumn(pl.Series(field.name, [value], pl.Utf8));
            }else if(field.schema.type === 'date') {
                dfRow = dfRow.withColumn(pl.Series(field.name, [rowJson.fields[field.key]], pl.Date));
            }else if(field.schema.type === 'datetime') {
                const value = rowJson.fields[field.key] ? rowJson.fields[field.key].toString() : '';
                dfRow = dfRow.withColumn(pl.Series(field.name, [value], pl.Utf8));
            }else {
                const fieldJson = JSON.stringify(rowJson.fields[field.key]);
                dfRow = dfRow.withColumn(pl.Series(field.name, [fieldJson], pl.Utf8));
            }
        }
    }
    df = df.vstack(dfRow);

    for(const history of rowJson.changelog.histories) {
        let dfHistoryRow = dfRow.clone();

        const changeDate = fields.find((field: { id: any; }) => field.id === 'updated');
        const changeDateName = changeDate.name;
        dfHistoryRow = dfHistoryRow.withColumn(pl.Series(changeDateName, [history.created], pl.Utf8));

        for(const item of history.items) {
            const changeField = fields.find((field: { id: any; }) => field.id === item.fieldId);
            const changeFieldName = changeField.name;
            // フィールドの値を更新する
            if (dfHistoryRow[changeFieldName]) {
                if (changeField.schema.type === 'string') {
                    dfHistoryRow = dfHistoryRow.withColumn(pl.Series(changeField.name, [item.toString], pl.Utf8));
                }else if (changeField.schema.type === 'number') {
                    dfHistoryRow = dfHistoryRow.withColumn(pl.Series(changeField.name, [item.toString], pl.Utf8));
                }else if (changeField.schema.type === 'date') {
                    dfHistoryRow = dfHistoryRow.withColumn(pl.Series(changeField.name, [item.toString], pl.Date));
                }else if (changeField.schema.type === 'datetime') {
                    dfHistoryRow = dfHistoryRow.withColumn(pl.Series(changeField.name, [item.toString], pl.Utf8));
                }else {
                    dfHistoryRow = dfHistoryRow.withColumn(pl.Series(changeField.name, [item.toString], pl.Utf8));
                }
            }
        }
        df = df.vstack(dfHistoryRow);
    }
}
console.log(df);

df.writeParquet("export/foo.parquet", { compression: 'snappy' });


// CSVファイル出力する、デリミタはタブで、ヘッダーを出力する、文字コードはUTF-8
df.writeCSV("export/foo.csv", { includeBom: true, includeHeader: true, sep: ',' });