import React, { useEffect, useRef, useState, useContext } from 'react';
import { DataContext } from '../../DataContext';
import { validateImageType, handleImage } from '../../logic/helperMethods';
import { createPost } from '../../logic/api';
import './CreatePostCard.css';
import Svgs from '../../Assets/icons/Svgs';

const CreatePostCard = ({ username }) => {

    const [postImages, setPostImages] = useState([]);
    const [title, setTitle] = useState("");
    const [error, setError] = useState("");
    const chooseImagesRef = useRef();
    const { userUsername, setUserUsername, profileImageName } = useContext(DataContext);

    const publishPost = async() => {
        try{

            let extName = profileImageName ? profileImageName.split('.') : "error";
            extName = extName !== "error" ? extName[extName.length - 1] : "error";

            if(extName !== "jpg" && extName !== "png" || extName === "error") {
                const askUser = window.confirm("There is error in your profile photo format\ncreate post without your image ?");
                if(askUser === false)
                    return setError("Error in your profile image");
            }

            if(!postImages || postImages.length <= 0) return setError("no images selected :(");

            for (let i = 0; i < postImages.length; i++) {
                if(!validateImageType(postImages[i])) return setError("This is not valid image");
                if(postImages[i].size <= 0) return setError("No image found");
                if(postImages[i].size > 550000){
                    postImages[i] = await handleImage(postImages[i], 0.50);
                    if(postImages[i].size > 550000) return setError(`Error optimising your image number: ${i + 1} , please reduce it size`);
                }
            };

            if(title && title.length > 350) return setError("Title is too long");

            if(username !== userUsername) setUserUsername(username);

            const res = await createPost(username, profileImageName ,postImages, title);

            if(!res || !res?.ok || res.ok === false) return setError(res?.dt ? res.dt : "Error creating post");

            setPostImages([]);
            setTitle("")
            setError("");

        } catch(err){
            setError(err.message);
        }
    };

    const generateURL = (image) => {
        if(image){
            const url = URL.createObjectURL(image);
            if(url)
                return url;
        }
    };

    return (
        <div className='CreatePostCard'>

            <div className='CreatePostHeader'>       

                <h2>Add your images</h2>

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
                {postImages.length > 0 ? (<ul>
                    {postImages.map((image) => (
                        <li>
                            <img src={generateURL(image)} alt='' 
                            onClick={() => {
                                setPostImages(
                                    postImages.filter(
                                        i => i !== image
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
                        const files = e.target.files;
                        if(files && postImages && files[0])
                            setPostImages([...postImages, files[0]]);
                    }
                }}/>

        </div>
    )
};

export default CreatePostCard;
