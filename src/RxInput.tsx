import React, {ChangeEvent, useEffect, useState} from 'react';
import * as Rx from 'rxjs';
import {debounceTime, distinctUntilChanged, filter, map, retry, switchMap} from "rxjs/operators";
import {ajax} from "rxjs/internal-compatibility";

const RxInput : React.FC = () => {
    let sbj = new Rx.Subject();
    const [result, setResult] = useState([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
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

        return () => {
            sbj.unsubscribe();
        }
    }, [sbj]);

    const handleChange = (e : ChangeEvent<HTMLInputElement>) => {
        sbj.next(e.target.value)
    };

    return(
        <div>
            <input id={"search-input"} onChange={(e) => handleChange(e)} />
            <div>
                {
                    result && result.map((item : any) => {
                        return(
                            <div>
                                <a href={item.link} key={item.question_id}>{item.title}</a>
                            </div>
                        )
                    })
                }
            </div>
            {
                error && <div>{error}</div>
            }
        </div>
    )
};

export default RxInput