import React from 'react'
import { NavLink } from 'react-router-dom'

export default function Header() {
    return (
        <div>
            <nav className="navbar navbar-expand-md navbar-dark bg-dark">
            <NavLink className="navbar-brand" to="/">Banking Portal</NavLink>
                <button className="navbar-toggler d-lg-none" type="button" data-toggle="collapse" data-target="#collapsibleNavId" aria-controls="collapsibleNavId"
                    aria-expanded="false" aria-label="Toggle navigation"></button>
                <div className="collapse navbar-collapse" id="collapsibleNavId">
                    <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
                        <li className="nav-item active">
                            <NavLink className="nav-link" to="/"> Home <span className="sr-only">(current)</span></NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/viewAll">View All Customers</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/transactions">View Transactions</NavLink>
                        </li>
                    </ul>

                </div>
            </nav>
        </div>
    )
}
