import React, { useEffect, useRef, useState, useContext } from 'react';
import { DataContext } from '../../DataContext';
import { validateImageType, handleImage, getBadWords } from '../../logic/helperMethods';
import { createPost, moderate, postPicsUploadFailed } from '../../logic/api';
import './CreatePostCard.css';
import Svgs from '../../Assets/icons/Svgs';
import CryptoJS from 'crypto-js';

const CreatePostCard = ({ username }) => {

    const [postImages, setPostImages] = useState([]);
    const [title, setTitle] = useState("");
    const [error, setError] = useState("");
    const chooseImagesRef = useRef();
    const { userUsername, setUserUsername, profileImageName } = useContext(DataContext);

    const publishPost = async() => {

        try{

            let extName = profileImageName ? profileImageName.split('.')[1] : "error";

            if(extName !== "jpg" && extName !== "png" || extName === "error") {
                const askUser = window.confirm("There is error in your profile photo format\ncreate post without your photo ?");
                if(askUser === false)
                    return setError("Error in your profile picture");
            }
            
            if(title && title.length > 350) return setError("Title is too long");

            const testForBadWords = getBadWords(title);

            if(testForBadWords.length > 0) {
                let er = "";
                for (let i = 0; i < testForBadWords.length; i++) {
                    if(i !== testForBadWords.length - 1){
                        er += `"${testForBadWords[i]}", `;
                    } else {
                        er += `"${testForBadWords[i]}"`;
                    }
                }
                setError("This is bad words: ", er);
                return;
            }

            if(!postImages) return setError("no images selected :(");

            const postPic1 = await validatePicture(postImages[0]);
            const postPic2 = await validatePicture(postImages[1]);
            const postPic3 = await validatePicture(postImages[2]);

            if(!postPic1) return setError("Error in one of the pictures");

            const makeArray = (pic1, pic2, pic3) => {
                let newArr = [];
                if(pic1) newArr.push(pic1);
                if(pic2) newArr.push(pic2);
                if(pic3) newArr.push(pic3);
                return newArr;
            };

            if(username !== userUsername) setUserUsername(username);

            const arrayOfPics = makeArray(postPic1, postPic2, postPic3);

            const res = await createPost(username, profileImageName, arrayOfPics, title);

            if(!res || res.ok !== true || !res.dt) return setError(res?.dt ? res.dt : "Error creating post");

            sendToModerate(res.dt.postId);

            if(!res.dt.picturesNames || res.dt.picturesNames.length <= 0) { 
                postPicsUploadFailed(res.dt.postId);
                setError("Error on pictures names please try again");
                return;
            }
   
            console.log("response before uploading pictures: ", res.dt);

            console.log("postImages", postImages, "arrayOfPics: ", arrayOfPics, "postPic1: ", postPic1, "postPic2: ", postPic2, "postPic3: ", postPic3);

            let checker = true;

            if(postPic1) {
                const uploadRes = await uploadPicture(postPic1, 0, res);
                console.log("upload pic1 response: ", uploadRes);
                if(uploadRes === false) {
                    checker = false;
                    postPicsUploadFailed(res.dt.postId); 
                }
            };

            if(checker && postPic2) {
                const uploadRes = await uploadPicture(postPic2, 1, res);
                console.log("upload pic2 response: ", uploadRes);
                if(uploadRes === false) {
                    checker = false;
                    postPicsUploadFailed(res.dt.postId); 
                }
            };

            if(checker && postPic3) {
                const uploadRes = await uploadPicture(postPic3, 2, res);
                console.log("upload pic3 response: ", uploadRes);
                if(uploadRes === false) {
                    checker = false;
                    postPicsUploadFailed(res.dt.postId); 
                }
            };

            setPostImages([]);
            setTitle("")
            setError("");

        } catch(err){
            setError(err.message);
        }
    };

    const validatePicture = async(pic) => {
        if(!pic) return null;
        if(!validateImageType(pic)) return null;
        if(pic.size <= 0) return null;
        if(pic.size > 550000){
            pic = await handleImage(pic, 0.50);
            if(pic.size > 550000) return null
        };
        return pic;
    };

    const uploadPicture = (pic, index, res) => {

        if(!pic || pic.size <= 0 || !res) return false;

        return new Promise( function(resolve, reject) {
            const reader = new FileReader();
    
            reader.onload = function() {
    
                const hash = CryptoJS.SHA1(CryptoJS.enc.Latin1.parse(reader.result));
                const xhr = new XMLHttpRequest();
                xhr.withCredentials = false;
    
                xhr.addEventListener("load", function () {
                    let msg;
                    if (xhr.status >= 200 && xhr.status < 300) {
                        msg = '2xx response from B2 API. Success.';
                        console.log(`Upload file result: ${msg}`);
                        resolve(true);
                    } else if (xhr.status >= 400 && xhr.status < 500) {
                        msg = '4xx error from B2 API. See other console log messages and requests in network tab for details.';
                    } else if (xhr.status >= 500) {
                        msg = '5xx error from B2 API. See other console log messages and requests in network tab for details.';
                    } else {
                        msg = 'Unknown error. See other console log messages and requests in network tab for details.';
                    }
                    console.log(`Upload file result: ${msg}`);
                    reject(false);
                });

                xhr.onerror = function() {
                    reject(false);
                };
    
                console.log("inside upload function: res: ", res.dt, "pic", pic);
    
                xhr.open("POST", res.dt.uploadUrl);
                xhr.setRequestHeader("Content-Type", pic.type);
                xhr.setRequestHeader("Authorization", res.dt.authToken);
                xhr.setRequestHeader("X-Bz-File-Name", res.dt.picturesNames[index].picturesNames);
                xhr.setRequestHeader("X-Bz-Content-Sha1", hash);
                const fileToSend = pic;
                xhr.send(fileToSend);
    
            };
    
            reader.readAsBinaryString(pic);
        })

    };

    const sendToModerate = async(postId) => {

        try {

            const res = await moderate(postId, "moderate post");

            if(res.ok === true) return console.log("Successfully send to moderate");

            console.log(res.dt);

        } catch(err) {
            console.log("Error send to moderate: ", err.message);
        }

    };

    const generateURL = (image) => {
        if(image){
            try{
                const url = URL.createObjectURL(image);
                if(url)
                    return url;
            } catch(err){
                console.log(err.message);
            }
        }
    };

    return (
        <div className='CreatePostCard'>

            <div className='CreatePostHeader'>       

                <h2>Add images</h2>

                <button onClick={() => {
                    chooseImagesRef.current.click();
                }}><Svgs type={"ImageIcon"}/>Browse </button>

                <button className='publishButton' onClick={() => {
                    publishPost();
                }}
                style={{
                    background: postImages.length > 0 ? null : "grey",
                    borderColor: postImages.length > 0 ? null : "transparent"
                }}
                ><Svgs type={"Upload"}/></button>

            </div>
            

            <div className='postImagesDiv'>
                {postImages && postImages.length > 0 ? (<ul>
                        {postImages.map((myImage) => (
                            <li>
                                <img src={generateURL(myImage)} alt='' 
                                    onClick={() => {
                                    setPostImages(
                                        postImages.filter(
                                            xIMG => xIMG !== myImage
                                        )
                                    );
                                    setError(null);
                                    }}/>
                            </li>
                        ))}
                </ul>) : (
                    <div className='NoImageHolder'>
                        <Svgs type={"404_icon"}/>Browse images
                    </div>   
                )}
            </div>

            <label style={{color: "red", paddingLeft: 16}}>{error}</label>

            <div className='inputDesc'>
                <label>Title</label>
                <textarea rows={2} maxLength={100} onChange={(e) => {
                    setTitle(e.target.value);
                }}/>
            </div>

            <input 
                style={{display: 'none'}}
                ref={chooseImagesRef} 
                type='file' 
                onChange={(e) => {
                    if(postImages.length > 2){
                        setError("Only 3 images are allowed in one post");
                        setTimeout(() => {
                            setError(null);
                        }, 5000);
                    } else {    
                        const file = e.target.files[0];
                        console.log("Post file: ", file);
                        if(file) {
                            setPostImages([...postImages, file]);
                        }
                    }
                }}/>

        </div>
    )
};

export default CreatePostCard;
