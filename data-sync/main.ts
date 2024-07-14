import pl from 'nodejs-polars';

const fooSeries = pl.Series("foo", [1, 2, 3, 4, 5]);

console.log(fooSeries);

const df = pl.DataFrame([fooSeries]);

df.writeParquet("foo.parquet");
