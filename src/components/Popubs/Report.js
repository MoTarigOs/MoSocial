import React, { useContext, useEffect, useRef, useState } from 'react';
import './Report.css';
import { DataContext } from '../../DataContext';
import Svgs from '../../Assets/icons/Svgs';
import reportingAnim from '../../Assets/icons/transparentLoadingGif.gif';
import { report } from '../../logic/api';

const Report = ({ isReport, setIsReport }) => {

    const [problems, setProblems] = useState([
        {id: 1, val: "User harasses - use bad words - ignores our terms of use."},
        {id: 2, val: "Bug - website crashes - waiting for long time."},
        {id: 3, val: "User published nude picture."},
        {id: 4, val: "User Scamed me or tried to - Fake URLs."},
        {id: 5, val: "Fake User - Bot - User make posts or comments very quick."},
        {id: 6, val: "Personal prefrencies."}
    ]);
    const [runOnce, setRunOnce] = useState(false);
    const [problemDesc, setProblemDesc] = useState("");
    const [selectedProblem, setSelectedProblem] = useState("");
    const [username, setUsername] = useState("");
    const [choosenImages, setChoosenImages] = useState([]);
    const [reporting, setReporting] = useState(false);
    const [reportedSuccessfully, setReportedSuccessfully] = useState(false);
    const {
        userID, navigateTo_userID, 
        navigateTo_userUsername, reportType,
        reportOnThisId, setReportOnThisId, setReportType
    } = useContext(DataContext);
    const [error, setError] = useState("");
    const browseRef = useRef();
    const textAreaRef = useRef();

    const generateURL = (image) => {
        if(image){
            try{
                const url = URL.createObjectURL(image);
                if(url)
                    return url;
            } catch(err){
                console.log(err.message);
                return null;
            }
        } else {
            return null;
        }
    };

    const handleTextArea = (e) => {

        if(!textAreaRef.current) return;
        textAreaRef.current.style.height = "auto";
        textAreaRef.current.style.height = `${e.target.scrollHeight - 16}px`;

        setProblemDesc(e.target.value);

    };

    const submit = async() => {

        try {

            console.log("submit, myUserId: ", userID, " hisId: ", navigateTo_userID, " hisUsername: ", navigateTo_userUsername, " report_objectId: ", reportOnThisId);

            if(!userID || (!selectedProblem && !problemDesc)) return setError("Specify your problem");

            if(userID.length <= 0) return setError("Login to your account first");

            if(selectedProblem.length <= 0 && problemDesc.length <= 0) return setError("please describe your problem");

            setReporting(true);

            let user_name = navigateTo_userUsername;
            if(!navigateTo_userUsername || navigateTo_userUsername.length <= 0) user_name = username;

            const res = await report(
                reportType, selectedProblem, problemDesc, 
                navigateTo_userID, user_name, 
                reportOnThisId
            );

            if(!res || res.ok !== true) {
                setReporting(false);
                setError(res.dt);
                return;
            };

            setReportedSuccessfully(true);
            setReporting(false);

        } catch(err){
            console.log(err.message);
            setError(err.message);
            setReporting(false);
        }

    };

    const cancel = () => {
        setIsReport(false);
        setReportedSuccessfully(false);
        setReportType("");
        setReportOnThisId(false);
    };

    useEffect(() => {
        setRunOnce(true);
    }, [])

    useEffect(() => {
        
    }, [runOnce])

    useEffect(() => {
        console.log("error: ", error);
    }, [error]);

    useEffect(() => {
        if(!isReport){
            setReportOnThisId("");
            setReportType("");
            setError("");
            setProblemDesc("");
            setSelectedProblem("");
        };
    }, [isReport]);

    return (

        <div className='ReportContainer' style={{display: isReport ? "flex" : "none" }}>

            <div className='ReportWrapper'>

                {!reportedSuccessfully ? (<div className='Report'>

                    <h2>Report</h2>

                    <p>{error}</p>

                    <ul className='problemsUl'>
                        {problems.map((item) => (
                            <li key={item.id}><>
                                <li key={item.id}>
                                    <input type='radio' name='problems_group' value={item.val}
                                    onChange={(e) => {
                                        setSelectedProblem(e.target.value);
                                    }}
                                    checked={isReport === false ? false : null}/>
                                    <p style={{fontWeight: (selectedProblem === item.val) ? "600" : null}}>{item.val}</p>
                                </li>
                                {(item.val === selectedProblem && (!navigateTo_userUsername || navigateTo_userUsername.length <= 0)) 
                                && <input 
                                maxLength={30}
                                type='text' 
                                placeholder='Optional: Enter a name of the user who bothered you'
                                onChange={(e) => {
                                    setUsername(e.target.value);
                                }}/>}
                            </></li>
                        ))}
                    </ul>

                    <label>Descripe your problem</label>
                    <textarea ref={textAreaRef} placeholder='Descripe the problem'
                    onChange={(e) => handleTextArea(e)}
                    />

                    <div className='problemScreenshots'>

                        <div className='browseDiv'>
                            <label>Add some screenshots</label>
                            <button onClick={() => {browseRef.current.click()}}>Browse</button>
                        </div>

                        <input type='file' ref={browseRef} onChange={(e) => {
                            const file = e.target.files[0];
                            if(!file) return;
                            setChoosenImages([...choosenImages, file]);
                        }}/>

                        {choosenImages.length > 0 ? (<ul>
                            {choosenImages.map((i) => (
                                <li>
                                    <img src={generateURL(i)} onClick={() => {
                                        setChoosenImages(
                                            choosenImages.filter(
                                                img => img !== i
                                            )
                                        )
                                    }}/>
                                </li>
                            ))}
                        </ul>) : (
                            <div className='NoImageHolder'>
                                <Svgs type={"404_icon"}/>Browse images
                            </div>  
                        )}
                    </div>

                    <div className='buttons'>
                        <button onClick={cancel}>Cancel</button>
                        <button onClick={submit} style={{background: "orange", color: "white"}}>{reporting ? <img src={reportingAnim}/> : "Report" }</button>
                    </div>

                </div>) : (
                    <div className='Reported'>
                        <p>Thank you for the report, we will handle it as soon as possible :l</p>
                        <button onClick={cancel}>Exit</button>
                    </div>
                )}

            </div>
        
        </div>
    )
};

export default Report;
