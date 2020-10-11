import { firestore } from 'firebase';
import React, { useState, useEffect } from 'react'
import { fstore } from "../services/firebase";

function Transactions() {

    const [trans, setTrans] = useState([]);

    useEffect(() => {
        PopulateTransactions();
    }, [])

    const PopulateTransactions = () => {
        fstore.collection("Transactions").orderBy("timestamp").get().then(res => {
            let list = [];
            res.docs.forEach(u => {
                list.push({ ...u.data(), id: u.id })
            })
            setTrans(list)
        })
    }

    return (
        <div className="container w-75 mt-3 p-3">
            <div>
                <p class="text-monospace text-muted">{trans.length || 0} transaction(s) found</p>
            </div>
            <table className="table mt-2">
                <thead className="thead-dark">
                    <tr>
                        <th scope="col">Sender</th>
                        <th scope="col">Recipient</th>
                        <th scope="col">Amount</th>
                        <th scope="col">Date and Time</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        trans.map(t => {
                            return (
                                <tr key={t.id}>
                                    <td>{t.sender.name}</td>
                                    <td>{t.recipient.name}</td>
                                    <td>{t.amount}</td>
                                    <td>{new firestore.Timestamp(t.timestamp.seconds, t.timestamp.nanoseconds).toDate().toString()}</td>
                                </tr>
                            )
                        })
                    }

                </tbody>
            </table>
        </div>

    )
}

export default Transactions
