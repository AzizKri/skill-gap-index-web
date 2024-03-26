import React from "react";
import './compare.css';
import Keyword from "../Keyword/Keyword";

function Compare() {
    return(
        <div className="content" >
            <div className="content-location">
                Home / Compare
            </div>
            <p className="title">Compare (DEMO)</p>
            <div className="compare_card">
                <div className="compare_section">
                    <p className="compare_section_title">Job Market</p>
                    <div className="compare_job_keywords">
                        <Keyword kw="Python" repititions="21" percent="0.8" />
                        <Keyword kw="OOP" repititions="16" percent="0.75" />
                        <Keyword kw="C++" repititions="15" percent="0.64" />
                        <Keyword kw="Java" repititions="5" percent="0.18" />
                    </div>
                </div>
                <div className="compare_section">
                    <p className="compare_section_title">University</p>
                    <div className="compare_uni_keywords">
                        <Keyword kw="Java" repititions="34" percent="0.7" />
                        <Keyword kw="OOP" repititions="32" percent="0.68" />
                        <Keyword kw="Python" repititions="12" percent="0.34" />
                        <Keyword kw="C++" repititions="2" percent="0.04" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Compare