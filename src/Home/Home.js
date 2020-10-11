import { firestore } from 'firebase';
import React, { useEffect, useState } from 'react'
import "./Home.scss"
import { fstore } from "../services/firebase";

export default function Home() {

    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [sender, setSender] = useState(null);
    const [recipient, setRecipient] = useState(null);
    const [amount, setAmount] = useState(null);

    useEffect(() => {
        PopulateCustomers();
    }, [])

    const PopulateCustomers = () => {
        fstore.collection("Customers").orderBy("name").get().then(res => {
            let list = [];
            res.docs.forEach(u => {
                list.push({ ...u.data(), id: u.id })
            })
            setUsers(list)
        })
    }


    const transfer = async () => {

        setLoading(true)
        if (!recipient) {
            alert("Select a valid Recipient from the list")
            setLoading(false)
            return;
        }

        if (!amount || amount < 1 || amount > 50000) {
            alert("Enter a valid amount between 1 and 50,000")
            setLoading(false)
            return;
        }

        let s = await fstore.collection("Customers").doc(sender.id).get();
        if (s.get('balance') < amount) {
            alert("Insufficient Fund\n" + s.get('name') + "'s Available Balance: " + s.get('balance'))
            setLoading(false)
            return;
        }

        try {

            await fstore.collection('Customers').doc(sender.id).update({ balance: firestore.FieldValue.increment(-parseFloat(amount)) })
            await fstore.collection('Customers').doc(recipient.id).update({ balance: firestore.FieldValue.increment(parseFloat(amount)) })
            await fstore.collection('Transactions').add({
                sender: {
                    id: sender.id,
                    name: sender.name
                },
                recipient: {
                    id: recipient.id,
                    name: recipient.name
                },
                amount: amount,
                timestamp: firestore.Timestamp.now()
            })
            setLoading(false)
            alert("Fund transferred successfully")
            PopulateCustomers();

        } catch (error) {
            console.log(error)
            alert("Error occured\n", error.message)
            setLoading(false)
        }


    }

    return (
        <div className="container container2 text-center w-50 p-3 pt-4 mt-4">
            <h1 className="display-5">Quick Transfer</h1>
            <div className="w-75 mx-auto my-4">
                <div className="input-group mb-3">
                    <div className="input-group-prepend">
                        <span className="input-group-text">From account</span>
                    </div>
                    <select className="custom-select" onChange={(e) => setSender(users.find(u => u.id === e.target.value))}>
                        <option defaultValue value={""}>Select the sender</option>
                        {
                            users.map(u => {
                                if (u.id !== recipient?.id)
                                    return (
                                        <option value={u.id} key={u.id}>{u.name}</option>
                                    )
                                else
                                    return null
                            })
                        }
                    </select>
                </div>

                <div className="input-group mb-3">
                    <div className="input-group-prepend">
                        <span className="input-group-text">To account</span>
                    </div>
                    <select className="custom-select" onChange={(e) => setRecipient(users.find(u => u.id === e.target.value))}>
                        <option defaultValue value={""}>Select the recipient</option>
                        {
                            users.map(u => {
                                if (u.id !== sender?.id)
                                    return (
                                        <option value={u.id} key={u.id}>{u.name}</option>
                                    )
                                else
                                    return null
                            })
                        }
                    </select>
                </div>

                <div className="input-group mb-3">
                    <div className="input-group-prepend">
                        <span className="input-group-text">Amount</span>
                    </div>
                    <input type='number' min="1" max={50000} value={amount || ""} onChange={e => setAmount(e.target.value)}
                        placeholder={"Enter a amount between 1 and 50,000"} className="form-control" />
                </div>

                <a className="btn btn-success" href="#" role="button" disabled={loading}
                    onClick={() => transfer()}>
                    {
                        !loading
                            ?
                            "Transfer"
                            :
                            <span>
                                <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                        Loading...
                        </span>
                    }
                </a>
            </div>

        </div>
    )
}
