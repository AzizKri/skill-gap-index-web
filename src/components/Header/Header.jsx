import React from "react";
import { AiOutlineHome } from "react-icons/ai";
import './header.css';

function Header() {
    return(
        <div className="header">
            <ul className="header-list">
                <li className="nav-item-icon">
                    <a href="/">
                        <AiOutlineHome size={28} />
                    </a>
                </li>
                <li className="nav-item">
                    <a href="/upload">
                        Upload
                    </a>
                </li>
                <li className="nav-item">
                    <a href="/compare">
                        Compare
                    </a>
                </li>
            </ul>
        </div>
    )
}

export default Header