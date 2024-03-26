import React from "react";
import './keyword.css';

function Keyword({ kw, repititions, percent }) {

    return(
        <div className="keyword" style={{
            backgroundColor: (percent > 0.7) ? "#f3ffe9" :
            (percent > 0.4) ? "#fffce9" : "#ffece9"
            }} >
            <p className="keyword_word">{kw}</p>
            <div className="keyword_bar">
                <div className="keyword_bar_highlight" style={{
                    width: `${percent * 100}%`
                    }} />
                <p className="keyword_bar_repititions">{repititions}</p>
            </div>
        </div>
    )
}

export default Keyword