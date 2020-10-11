import { firestore } from 'firebase';
import React, { useState, useEffect, useRef } from 'react'
import { fstore } from "../services/firebase";

export default function ViewAll() {
    const [users, setUsers] = useState([]);
    const [sender, setSender] = useState({});
    const [recipient, setRecipient] = useState(null);
    const [amount, setAmount] = useState(null);
    const selector = useRef(null);
    const [loading, setLoading] = useState(false);
    const modalCloseBtn = useRef(null);

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

    const continueAs = (sender) => {
        selector.current.selectedIndex = 0;
        setRecipient(null)
        setAmount(null)
        setSender(sender)
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
            alert("Insufficient Fund")
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
            modalCloseBtn.current.click();

        } catch (error) {
            console.log(error)
            alert("Error occured\n", error.message)
            setLoading(false)
        }


    }

    return (
        <div className="container my-2">
            <div>
                <p class="text-monospace text-muted">{users.length || 0} customer(s) found</p>
            </div>
            <ul className="list-group">
                {users.map((u, index) => {
                    return (
                        <li className="list-group-item d-flex justify-content-between" key={u.id}>
                            <div className="d-flex">
                                <div className="d-flex justify-content-center align-items-center px-3">
                                    <b>{index + 1}</b>
                                </div>
                                <div className="px-2 text-left">
                                    <div>{u.name}</div>
                                    <div><span className="text-muted">Balance:</span> {u.balance}</div>
                                </div>
                            </div>
                            <div>
                                <button className="btn btn-success" data-toggle="modal" data-target="#exampleModal" onClick={() => continueAs(u)}>Continue as {u.name}</button>
                            </div>
                        </li>
                    )
                })}
            </ul>

            {/* modal section */}
            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Transfer from <b>{sender.name}'s</b> account</h5>
                            <button type="button" className="close" data-dismiss="modal" ref={modalCloseBtn} aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="form-group">
                                    <label htmlFor="recipient-name" className="col-form-label">Recipient:</label>
                                    <select className="custom-select" ref={selector} onChange={(e) => setRecipient(users.find(u => u.id === e.target.value))}>
                                        <option defaultValue value={""}>Select the recipient</option>
                                        {
                                            users.map(u => {
                                                if (u.id !== sender.id)
                                                    return (
                                                        <option value={u.id} key={u.id}>{u.name}</option>
                                                    )
                                                else
                                                    return null;
                                            })
                                        }
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="message-text" className="col-form-label">Amount:</label>
                                    <input type='number' min="1" max={50000} value={amount || ""} onChange={e => setAmount(e.target.value)}
                                        placeholder={"Enter a amount between 1 and 50,000"} className="form-control" />
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-success" disabled={loading}
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


                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {/* modal section */}

        </div>
    )
}
