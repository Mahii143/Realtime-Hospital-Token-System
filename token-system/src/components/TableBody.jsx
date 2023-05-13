import React, { useEffect, useState } from 'react';

const TableBody = ({token, setLastToken}) => {
    const curr = token;
    const [data, setData] = useState([]);
    useEffect(() => {
        const endpoint = 'http://localhost:3001/get-patients';
        fetch(endpoint)
            .then(response => response.json())
            .then(json => setData(json));
    }, [data.length]);
    if (data.length > 0) {
        return (
            <>
                {
                    data.map((record, index) => {
                        setLastToken(record.pid);
                        return <div className={parseInt(record.pid)===curr?"row curr":"row data"} key={index}>
                            <div className="row-data">{record.pid}</div>
                            <div className="row-data">{record.name}</div>
                            <div className="row-data">{record.phone}</div>
                            <div className="row-data">{record.token}</div>
                        </div>
                    })
                }
            </>
        )
    } else {
        return (
            <></>
        );
    }
}

export default TableBody