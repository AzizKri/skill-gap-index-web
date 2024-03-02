import React, { useState } from "react";
import { ColorRing } from 'react-loader-spinner';
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
        const requestOptions = {
            method: 'PUT',
            headers: {
                "Authorization": "Bearer " + process.env.REACT_APP_AUTH_TOKEN,
                "file-name": `${university}/${Date.now() + '_' + file.name}`
            },
            body: file
        };
        await fetch(`https://sgi-upload.uaeu.club/`, requestOptions)
        .catch((e) => {
            console.log(`Error ${e}`)
        })
        setUploadStatus(2)
    }

    return (
        <div className="upload" >
            <div className="upload_card">
                <form className="upload_card_form" onSubmit={onClick}>
                    <label htmlFor="university">Select a university: </label>
                    <select onChange={(e) => {setUniversity(e.target.value)}}>
                        <option value="0">Select</option>
                        <option value="UAEU">United Arab Emirates University</option>
                    </select>
                    <br />
                    <label htmlFor="file">Upload file: </label>
                    <input type="file" id="file" name="upload" onChange={(e) => {setFile(e.target.files[0])}}/>
                    <br />
                    <input type="submit" disabled={(university === "0" || file == null || uploadStatus !== 0)? true : false} />
                </form>
                {(uploadStatus === 1)? <ColorRing height="64" width="64" colors={[]} /> :
                (uploadStatus === 2)? <h3>Uploaded!</h3> :
                null}
            </div>
        </div>
    );
}

export default Upload;
