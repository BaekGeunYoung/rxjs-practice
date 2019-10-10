this is a simple RxJS code for practicing async request, using Stack Exchange API.

following is the core code bundle of this repository

```javascript
sbj.pipe(filter((value, index) => value !== ''))
            .pipe(debounceTime(1000))
            .pipe(distinctUntilChanged())
            .pipe(switchMap((value:any, index : number) =>{
                return ajax.get(`https://api.stackexchange.com/2.2/search?order=desc&sort=activity&intitle=${value}&site=stackoverflow`)
                    .pipe(map(r => r.response.items))
                    .pipe(retry(3))
                }
            ))
            .subscribe(
                (value: any) => {
                    setResult(value);
                },
                (err : any) => setError('error!'),
        );
```

we can handle the data stream of any observable by using some great operators, chained by pipe() function.

By using Reactive X, we can take following advantages :
1. We can cancel unwanted HTTP Request easily.
2. We can retry Ajax as many as we can simply by using retry(count : number) operator.
3. This way of dealing with complex ajax goes very well with the paradigm of functional programming.

We can achieve very simple and sophisticated FC by using various Rx operator including those above.