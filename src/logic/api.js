import axios from 'axios';
axios.defaults.withCredentials = true;
const base_url = "http://localhost:3500";
const config = null;


/* Fetch basic info about the user */
export const getUserInfo = async() => {
    try{
        const url = `${base_url}/user/get_user_info`;

        const res = await axios.get(url, { withCredentials: true, 'Access-Control-Allow-Credentials': true });

        if(!res || !res.status || res.status !== 200) return {ok: false, dt: res.data ? res.data : null};

        return {ok: true, dt: res.data};
    } catch(err){
        return {ok: false, dt: err?.response?.data ? err.response.data : null};
    }
};


/* User functions */
export const register = async(username, email, password) => {

    try{

        const url = `${base_url}/user/register`;

        const body = {
            username: username,
            email: email,
            password: password
        }

        const res = await axios.post(url, body);

        if(!res || !res?.status)
            return {ok: false, dt: null};

        if(res.status >= 400) 
            return {ok: false, dt: res.data ? res.data : "error creating your account"};

        if(res.status === 201)
            return {ok: true, dt: res.data ? res.data : "account created successfully"};

    } catch(err){
        return {ok: false, dt: err.message};
    }
};

export const Login = async(email, password) => {

    try{

        const url = `${base_url}/user/login`;

        const body = {
            email: email,
            password: password
        }

        const res = await axios.post(url, body, {withCredentials: true});

        if(!res || !res?.status)
            return {ok: false, dt: null};

        if(res.status >= 400) 
            return {ok: false, dt: res.data ? res.data : "error creating your account"};

        if(res.status === 201){
            return {ok: true, dt: res.data ? res.data : "account created successfully"};
        }

    } catch(err){
        return {ok: false, dt: err.message};
    }
};

export const logout = async() => {

    try{

        const url = `${base_url}/user/logout`;

        const res = await axios.post(url, { withCredentials: true, 'Access-Control-Allow-Credentials': true });

        console.log(res);

        if(!res || !res.status || res.status !== 201)
            return {ok: false, dt: "Error logging out please try again"};

        if(res.status === 201)
            return {ok: true, dt: res?.data ? res.data : "Log out successfully"};

    } catch(err){
        return {ok: false, dt: "something went wrong please try again later"}
    }
};

export const refreshTokens = async() => {

    try{

        const url = `${base_url}/user/refreshToken`;

        const res = await axios.post(url, null, { withCredentials: true, 'Access-Control-Allow-Credentials': true });

        if(!res || !res?.status || res.status !== 201)
            return {ok: false, dt: "login with your password"};

        return {ok: true, dt: "refreshed succesfully"};

    } catch(err) {
        return {ok: false, dt: "login with your password"};
    }

};


/* Profile page fetch functions */
export const updateProfileInfo = async(profilePicName, username, introParagraph, smallDetails, paragraph, skills, contacts) => {

    try{

        let picName = `${Date.now()}_${username}_${profilePicName}`;

        console.log("profile pic name: ", picName);

        const url = `${base_url}/profile`;

        const body = {
            username: username,
            introParagraph: introParagraph,
            smallDetails: smallDetails,
            paragraph: paragraph,
            skills: skills,
            contacts: contacts,
            picName: picName
        }

        const res = await axios.post(url, body, { withCredentials: true,  'Access-Control-Allow-Credentials': true });

        if(!res || !res?.status || res.status !== 201) return {ok: false, dt: res.data ? res.data : null};

        if(res.status === 201) return {ok: true, dt: res.data}

    } catch(err) {

        if(err?.response?.data){

            if(err.response.data === "jwt expired"){
                const refresh = await refreshTokens();
                if(!refresh?.ok)
                    return {ok: false, dt: "please login to your account"}
                return {ok: refresh.ok, dt: refresh.dt }
            }

            return {ok: false, dt: err.response.data ? err.response.data : null}
        }

        return {ok: false, dt: null};

    }
};

// export const sendProfileImage = async(image) => {

//     if(!image || Array.isArray(image)) return {ok: false, dt: "No image to upload"};

//     const url = `${base_url}/profile/upload_profile_image`;
    
//     const formData = new FormData();
//     formData.append("profile_image", image);

//     try{

//         const res = await axios.post(url, formData, { 
//                 withCredentials: true,
//                 'Access-Control-Allow-Credentials': true, 
//                 headers: { "Content-Type": "multipart/form-data" }
//             });

//         if(!res || !res?.status) return {ok: false, dt: "Error updating your image"};
        
//         if(res.status === 201)
//             return {ok: true, dt: null};

//         return {ok: false, dt: null};

//     } catch(err){
//         return {ok: false, dt: err.response?.data ? err.response.data : "Error updating your image"};
//     }
// };

export const getProfile = async(user_id) => {

    try{

        const url = `${base_url}/profile/${user_id}`;

        const res = await axios.get(url, { withCredentials: true, 'Access-Control-Allow-Credentials': true });

        if(!res || !res.status || res.status !== 200) return {ok: false, dt: res.data ? res.data : null}

        return {ok: true, dt: res.data ? res.data : null};  

    } catch(err){
        return {ok: false, dt: err?.response?.data ? err.response.data : "Error getting your profile info please login again"};
    }
};

export const getMyProfile = async() => {

    try{

        const url = `${base_url}/profile`;

        const res = await axios.get(url, { withCredentials: true, 'Access-Control-Allow-Credentials': true });

        if(!res || !res.status) return {ok: false, dt: "Check your internet & try again"}

        if(res.status === 200) return {ok: true, dt: res.data ? res.data : null}

        return {ok: false, dt: res.data ? res.data : "Error getting infos"}    

    } catch(err){
        return {ok: false, dt: err?.response?.data ? err.response.data : "Error getting your profile info please login again"};
    }
};

export const getMyProfileImage = async() => {

    try{

        const url = `${base_url}/profile/download_profile_image/1696174273503ai_generated.jpg`;


        const res = await axios({
            url, 
            method: 'GET',
            responseType: 'blob',
            withCredentials: true,
            'Access-Control-Allow-Credentials': true
        });

        // const output = fs.createWriteStream('../Assets/images/downloaded');
        // const ws = new WritableStream(output);

        // const myBlob = new Blob([res.data], {type: 'image/jpeg'});

        // const stream = myBlob.stream();

        // const piping = await stream.pipeTo(ws);

        // console.log(myBlob, piping);

        // return 

        // console.log("blob : ", myBlob);

        // const finalImage = new File([myBlob], myBlob.name, {type: 'image/jpeg'});

        // console.log("file : ", finalImage);

        // localStorage.setItem('myProfile_image', finalImage);
            
        // const getImage = localStorage.getItem('myProfile_image');

        // console.log("return image: ", getImage);

        // return getImage;

        if(res.status === 200)
            return {ok: true, dt: res.data}

        return {ok: false, dt: "Error getting infos"}    

    } catch(err){
        console.log(err);
        return {ok: false, dt: err?.response?.data ? err.response.data : "Error getting your profile info please login again"};
    }
};

export const clearNotification = async() => {

    try{

        const url = `${base_url}/profile`;

        const res = await axios.put(url, { withCredentials: true, 'Access-Control-Allow-Credentials': true });

        if(!res || !res.status || res.status !== 200) return {ok: false, dt: res.data ? res.data : null}

        return {ok: true, dt: res.data ? res.data : null};  

    } catch(err){
        return {ok: false, dt: err?.response?.data ? err.response.data : "Error getting your profile info please login again"};
    }
};


/* Post page fetch functions */
export const createPost = async(username, creator_image, images, title) => {

    try{

        const postImagesRes = await sendPostImages(images);

        if(!postImagesRes || !postImagesRes?.ok || postImagesRes.ok === false) return {ok: false, dt: postImagesRes?.dt ? postImagesRes.dt : null};

        if(postImagesRes.ok === true && !postImagesRes?.dt) return {ok: false, dt: "Error saving your post images please try again"};

        const imagesURLs = postImagesRes.dt;

        if(imagesURLs.length <= 0) return {ok: false, dt: "Error saving your images please try again"};

        const url = `${base_url}/post`;

        const body ={
            username: username,
            creator_image: creator_image,
            post_images: imagesURLs,
            desc: title
        };

        const res = await axios.post(url, body, { withCredentials: true, 'Access-Control-Allow-Credentials': true });
        
        if(!res || !res?.status || res.status !== 201) return {ok: false, dt: res?.data ? res.data : null};
        
        return {ok: true, dt: res.data ? res.data : null};

    } catch(err){
        console.log(err);
        return {ok: false, dt: err?.response?.data ? err.response.data : null}
    }
};

export const sendPostImages = async(images) => {

    if(!images || !Array.isArray(images) || images.length <= 0) return {ok: false, dt: "No images to upload"};

    const url = `${base_url}/post/upload_post_images`;
    
    const formData = new FormData();
    for (let i = 0; i < images.length; i++) {
        formData.append("post_images", images[i]);
    }

    console.log("formdata: ", formData);
    
    try{

        const res = await axios.post(url, formData, { 
                withCredentials: true,
                'Access-Control-Allow-Credentials': true, 
                headers: { "Content-Type": "multipart/form-data" }
            });

        if(!res || !res?.status) return {ok: false, dt: "Error updating your image"};
        
        if(res.status === 201) return {ok: true, dt: res.data ? res.data : null};

        return {ok: false, dt: null};

    } catch(err){
        console.log(err);
        return {ok: false, dt: err.response?.data ? err.response.data : "Error updating your image"};
    }

};

export const getPosts = async(limit, filter, contacts, filterSearchText) => {

    try{

        let contactsFilter = "";

        for (let i = 0; i < contacts.length; i++) {
            if(contacts[i].contact_id) contactsFilter += contacts[i].contact_id;
            if(i < contacts.length - 1) contactsFilter += "-";
        }

        if(!limit) limit = 10;
        if(!filter) filter = "x";
        if(!contactsFilter) contactsFilter = "x";
        if(!filterSearchText) filterSearchText = "x";

        console.log("contacts", contactsFilter);
        
        const url = `${base_url}/post/${limit}/${filter}/${contactsFilter}/${filterSearchText}`;

        const res = await axios.get(url, { withCredentials: true, 'Access-Control-Allow-Credentials': true });

        if(!res || !res?.status || res.status !== 200) return {ok: false, dt: res.data ? res.data : null};

        return {ok: true, dt: res.data};

    } catch(err){
        return {ok: false, dt: err?.response?.data ? err.response.data : null};
    }
};

export const likePost = async(post_id) => {
    try{

        const url = `${base_url}/post/like/${post_id}`;

        const res = await axios.patch(url, { withCredentials: true, 'Access-Control-Allow-Credentials': true });

        if(!res || !res?.status || res.status !== 201) return {ok: false, dt: res.data ? res.data : null};

        return {ok: true, dt: res.dt ? res.dt : null};

    } catch(err){
        return {ok: false, dt: err?.response?.data ? err.response.data : null}
    }
};

export const removeLikePost = async(post_id) => {
    try{

        const url = `${base_url}/post/like/${post_id}`;

        const res = await axios.delete(url, { withCredentials: true, 'Access-Control-Allow-Credentials': true });

        if(!res || !res?.status || res.status !== 201) return {ok: false, dt: res.data ? res.data : null};

        return {ok: true, dt: res.dt ? res.dt : null};

    } catch(err){
        return {ok: false, dt: err?.response?.data ? err.response.data : null}
    }
};

export const deletePost = async(post_id) => {
    try{

        const url = `${base_url}/post/${post_id}`;

        const res = await axios.delete(url, { withCredentials: true, 'Access-Control-Allow-Credentials': true });

        if(!res || !res?.status || res.status !== 200) return {ok: false, dt: res.data ? res.data : null};

        return {ok: true, dt: res.dt ? res.dt : null};

    } catch(err){
        return {ok: false, dt: err?.response?.data ? err.response.data : null}
    }
};

export const getPostDetails = async(post_id) => {
    try{

        const url = `${base_url}/post/single-post/${post_id}`;

        const res = await axios.get(url, { withCredentials: true, 'Access-Control-Allow-Credentials': true });

        if(!res || !res?.status || res.status !== 200) return {ok: false, dt: res.data ? res.data : null};

        return {ok: true, dt: res.data ? res.data : null};

    } catch(err){
        return {ok: false, dt: err?.response?.data ? err.response.data : null}
    }
};

export const getPostsByUserID = async(look_for_id, limit, filter) => {

    try{

        const url = `${base_url}/post/${look_for_id}/${limit}/${filter}`;

        const res = await axios.get(url, { withCredentials: true, 'Access-Control-Allow-Credentials': true });

        if(!res || !res.status || res.status !== 200) return {ok: false, dt: res.data ? res.data : null};

        return {ok: true, dt: res.data};    

    } catch(err){
        return {ok: false, dt: err?.response?.data ? err.response.data : null};
    }

};


/* Comments page fetch functions */
export const createComment = async(username, image, text, postID) => {
    try{

        const url = `${base_url}/comments/${postID}/0`;

        const body = {
            username: username,
            commenter_image: image, 
            comment_text: text
        }

        const res = await axios.post(url, body, { withCredentials: true, 'Access-Control-Allow-Credentials': true });

        if(!res || !res.status || res.status !== 201) return {ok:false, dt: res.data ? res.data : null};

        return {ok: true, dt: res.data ? res.data : null};
        
    } catch(err){
        return {ok: false, dt: err?.response?.data ? err.response.data : null};
    }
};

export const getComments = async(post_id, limit) => {

    try{

        const url = `${base_url}/comments/${post_id}/${limit}`;

        const res = await axios.get(url, { withCredentials: true, 'Access-Control-Allow-Credentials': true });

        if(!res || !res?.status || res.status !== 200) return {ok: false, dt: res.data ? res.data : null};

        return {ok: true, dt: res.data};

    } catch(err){
        return {ok: false, dt: err?.response?.data ? err.response.data : null};
    }
};

export const deleteComment = async(comment_id) => {

    try{

        const url = `${base_url}/comments/${comment_id}`;

        const res = await axios.delete(url, { withCredentials: true, 'Access-Control-Allow-Credentials': true });

        if(!res || !res.status || res.status !== 200) return {ok:false, dt: res.data ? res.data : null};

        return {ok: true, dt: res.data ? res.data : null};

    } catch(err){
        return {ok:false, dt: err.response?.data ? err.response.data : null}
    }
};

export const getLatestCommentsOnMyPosts = async(num_of_fetches) => {

    try{

        const url = `${base_url}/comments/my_posts_comments/${num_of_fetches}`;

        const res = await axios.get(url, { withCredentials: true, 'Access-Control-Allow-Credentials': true });

        if(!res || !res.status || res.status !== 200) return {ok:false, dt: res.data ? res.data : null};

        return {ok: true, dt: res.data ? res.data : null};

    } catch(err){
        return {ok: false, dt: err.response?.data ? err.response.data : null};
    }

};

export const getTopComment = async(postID) => {

    try{

        const url = `${base_url}/comments/top_comment/${postID}`;

        const res = await axios.get(url, { withCredentials: true, 'Access-Control-Allow-Credentials': true });

        if(!res || !res.status || res.status !== 200) return {ok:false, dt: res.data ? res.data : null};

        return {ok: true, dt: res.data ? res.data : null};

    } catch(err){
        return {ok: false, dt: err.response?.data ? err.response.data : null};
    }
    
};


/* Chat fetch functions */
export const getChats = async(hisID) => {

    try{

        const url = `${base_url}/chat/${hisID}`;

        const res = await axios.get(url, { withCredentials: true, 'Access-Control-Allow-Credentials': true });

        if(!res || !res.status) return {ok: false, dt: res.data ? res.data : null};

        if(res.status === 404) return {ok: true , dt: null};

        if(res.status !== 200) return {ok: false, dt: res.data ? res.data : null};

        return {ok: true, dt: res.data ? res.data : null};

    } catch(err){
        return {ok: false, dt: err.response?.data ? err.response.data : null};
    }

};

export const sendMessage = async(sender_username, hisID, text) => {

    try{

        const url = `${base_url}/chat/${hisID}`;

        const body = {
            sender_username: sender_username,
            text: text
        };

        const res = await axios.post(url, body, { withCredentials: true, 'Access-Control-Allow-Credentials': true });

        if(!res || !res.status || res.status !== 201) return {ok: false, dt: res.data ? res.data : null};

        console.log(res.data);

        return {ok: true, dt: res.data ? res.data : null};

    } catch(err){
        return {ok: false, dt: err.response?.data ? err.response.data : null};
    }

};

export const deleteMessage = async(message_id) => {

    try{

        const url = `${base_url}/chat/${message_id}`;

        const res = await axios.delete(url, { withCredentials: true, 'Access-Control-Allow-Credentials': true });

        if(!res || !res.status || res.status !== 200) return {ok: false, dt: res.data ? res.data : null};

        return {ok: true, dt: res.data ? res.data : null};

    } catch(err){
        return {ok: false, dt: err.response?.data ? err.response.data : null};
    }

};


/* Contact fetch functions */
export const getContacts = async() => {

    try{

        const url = `${base_url}/contacts`;

        const res = await axios.get(url, { withCredentials: true, 'Access-Control-Allow-Credentials': true });

        if(!res || !res.status || res.status !== 200) return {ok: false, dt: res.data ? res.data : null};

        return {ok: true, dt: res.data ? res.data : null};

    } catch(err){
        return {ok: false, dt: err.response?.data ? err.response.data : null};
    }

};

export const updateContact = async(contactID) => {

    try{

        const url = `${base_url}/contacts/${contactID}`;

        const res = await axios.patch(url, { withCredentials: true, 'Access-Control-Allow-Credentials': true });

        if(!res || !res.status || res.status !== 200) return {ok: false, dt: res.data ? res.data : null};

        return {ok: true, dt: res.data ? res.data : null};

    } catch(err){
        return {ok: false, dt: err.response?.data ? err.response.data : null};
    }

};

export const createContact = async(contact_id) => {

    try{

        const url = `${base_url}/contacts/${contact_id}`;

        const res = await axios.post(url, { withCredentials: true, 'Access-Control-Allow-Credentials': true });

        if(!res || !res.status || res.status !== 201) return {ok: false, dt: res.data ? res.data : null};

        return {ok: true, dt: res.data ? res.data : null};

    } catch(err){
        return {ok: false, dt: err.response?.data ? err.response.data : null};
    }

};