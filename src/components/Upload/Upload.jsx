import React, { useState } from "react";
import { ColorRing } from 'react-loader-spinner';
import { AiOutlineFile } from "react-icons/ai";
import pdfToText from 'react-pdftotext';
import PizZip from "pizzip";
import { DOMParser } from "@xmldom/xmldom";
import './upload.css';

function Upload() {
    const [university, setUniversity] = useState("0");
    const [file, setFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState(0);
    // 0: open
    // 1: uploading
    // 2: complete
    // 3: error

    const onClick = async (e) => {
        e.preventDefault();
        await uploadFile();
    }

    const str2xml = (str) => {
        if (str.charCodeAt(0) === 65279) {
            // BOM sequence
            str = str.substr(1);
        }
        return new DOMParser().parseFromString(str, "text/xml");
    }

    const getParagraphsFromWord = (content) => {
        const zip = new PizZip(content);
        const xml = str2xml(zip.files["word/document.xml"].asText());
        const paragraphsXml = xml.getElementsByTagName("w:p");
        const paragraphs = [];

        for (let i = 0, len = paragraphsXml.length; i < len; i++) {
            let fullText = "";
            const textsXml = paragraphsXml[i].getElementsByTagName("w:t");
            for (let j = 0, len2 = textsXml.length; j < len2; j++) {
                const textXml = textsXml[j];
                if (textXml.childNodes) {
                    fullText += textXml.childNodes[0].nodeValue;
                }
            }
            if (fullText) {
                paragraphs.push(fullText);
            }
        }
        return paragraphs.join();
    }

    async function getTextFromPPT(arrayBuffer) {
        try {
            const zip = new PizZip(arrayBuffer);
            const text = [];

            let slideIndex = 1;
            while (true) {
                const slideFile = zip.file(`ppt/slides/slide${slideIndex}.xml`);
                if (!slideFile) break;

                const slideFileText = slideFile.asText();
                const pxml = str2xml(slideFileText);
                const paragraphsXml = pxml.getElementsByTagName("a:p");

                const paragraphs = [];

                for (let i = 0, len = paragraphsXml.length; i < len; i++) {
                    let fullText = "";
                    const textsXml = paragraphsXml[i].getElementsByTagName("a:t");
                    for (let j = 0, len2 = textsXml.length; j < len2; j++) {
                        const textXml = textsXml[j];
                        if (textXml.childNodes) {
                            fullText += textXml.childNodes[0].nodeValue;
                        }
                    }
                    if (fullText) {
                        paragraphs.push(fullText);
                    }
                }

                text.push(paragraphs.join(" "))

                slideIndex++;
            }

            const finalText = text.join(" ").trim();
            return finalText;
        } catch (err) {
            console.error('Error extracting text from PPTX:', err);
            return '';
        }
    }

    const extractText = async (file) => {
        // Check if we're uploading a valid file & extract text from it
        switch (file.type) {
            case "application/pdf":
                // PDF Files
                await pdfToText(file)
                    .then(text => { return text; })
                    .catch((e) => {
                        console.log(`Error ${e}`)
                        setUploadStatus(3)
                    })
                break;
            case "application/msword":
            case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                // Word Documents
                const WBuffer = await file.arrayBuffer();
                const WText = getParagraphsFromWord(WBuffer);
                return WText;
            case "application/vnd.ms-powerpoint":
            case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
                // PowerPoint Documents
                const PBuffer = await file.arrayBuffer();
                const PText = await getTextFromPPT(PBuffer);
                return PText;
            default:
                console.log("Not pdf")
                setUploadStatus(3)
                return null;
        }
    }

    const uploadFile = async (e) => {
        setUploadStatus(1)

        const fileName = file.name.split(".")
        fileName.pop()

        const requestOptions = {
            method: 'PUT',
            headers: {
                "Authorization": "Bearer " + process.env.REACT_APP_AUTH_TOKEN,
                "university": university,
                "file-name": `${fileName.join("")}`,
                "file-ext": file.type,
                "file-last-mod": file.lastModified
            },
            body: await extractText(file)
        };

        // test(requestOptions.body)
        if (requestOptions.body !== null) {
            await fetch(`https://sgi-upload.uaeu.club/`, requestOptions)
                .then(() => {
                    setUploadStatus(2)
                }).catch((e) => {
                    console.log(`Error ${e}`)
                    setUploadStatus(3)
                })
        } else {
            Error("No text to analyze")
        }
    }

    // const test = async (content) => {
    //     function escapeRegExp(string) {
    //         return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    //     }

    //     const file = await fetch("https://sgi-files.uaeu.club/global%2Fkeywords.txt")
    //     const text = await file.text()
    //     const kw = text.split("\n").map(element => element.trim())
    //     let found = {}
    //     kw.forEach(element => {
    //         const regex = new RegExp(escapeRegExp(element), "gi")
    //         const matches = content.match(regex)
    //         if (matches) {
    //             found[element] = matches.length
    //         };
    //     });
    // }

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
