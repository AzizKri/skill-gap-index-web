import React, { useState } from "react";
import { ColorRing } from 'react-loader-spinner';
import { AiOutlineFile } from "react-icons/ai";
import pdfToText from 'react-pdftotext';
import './upload.css';

function Upload() {
    const [university, setUniversity] = useState("0");
    const [file, setFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState(0);

    const onClick = async (e) => {
        e.preventDefault();
        await upload();
    }

    const upload = async (e) => {
        setUploadStatus(1)
        let fileContent

        if (file.type === "application/pdf") {
            await pdfToText(file)
                .then(text => { fileContent = text })
                .catch((e) => {
                    console.log(`Error ${e}`)
                    setUploadStatus(3)
                })
        } else {
            console.log("Not pdf")
            fileContent = file
        }
        
        const fileName = file.name.split(".")
        fileName.pop()

        const requestOptions = {
            method: 'PUT',
            headers: {
                "Authorization": "Bearer " + process.env.REACT_APP_AUTH_TOKEN,
                "file-name": `${university}/${fileName.join("")}`,
                "file-ext": file.type,
                "file-last-mod": file.lastModified
            },
            body: fileContent
        };

        await fetch(`https://sgi-upload.uaeu.club/`, requestOptions)
            .then(() => {
                setUploadStatus(2)
            }).catch((e) => {
                console.log(`Error ${e}`)
                setUploadStatus(3)
            })
    }

    return (
        <div className="content" >
            <div className="content-location">
                Home / Upload
            </div>
            <p className="title">Upload</p>
            <div className="upload_card">
                <form className="upload_card_form" onSubmit={onClick}>
                    <div className="upload_card_form_select">
                        <label htmlFor="university">Select a university: </label>
                        <select onChange={(e) => { setUniversity(e.target.value) }}>
                            <option value="0">Select</option>
                            <option value="UAEU">United Arab Emirates University</option>
                        </select>
                    </div>
                    <br />
                    <div className="upload_card_form_upload">
                        <label htmlFor="file">Upload file: </label>
                        <label className="upload_card_form_upload_input" >
                            <input type="file" id="file" name="upload" onChange={(e) => { setFile(e.target.files[0]) }} />
                            Select
                        </label>
                    </div>
                    <br />
                    {file ?
                        <div>
                            <div className="upload_card_form_files">
                                <AiOutlineFile size={18} />
                                <span>{file.name}</span>
                            </div>
                            <br />
                        </div> :
                        null}
                    <input className="upload_card_form_submit" type="submit" disabled={(university === "0" || file == null || (uploadStatus !== 0 && uploadStatus !== 3)) ? true : false} />
                </form>
                {(uploadStatus === 1) ? <ColorRing height="64" width="64" colors={[]} /> :
                    (uploadStatus === 2) ? <h3>Uploaded!</h3> :
                        (uploadStatus === 3) ? <h3 style={{ color: "#c37670" }}>Upload failed</h3> :
                            null}
            </div>
        </div>
    );
}

export default Upload;
