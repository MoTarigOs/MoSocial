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
export const register = async(username, email, password, captchaToken) => {

    try{

        const url = `${base_url}/user/register`;

        const body = {
            username: username,
            email: email,
            password: password,
            captchaToken: captchaToken
        };
        
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

export const sendCodeToEmail = async(email) => {

    try{

        const url = `${base_url}/user/sendCodeToEmail`;

        const body = {
            email: email
        };

        const res = await axios.post(url, body);

        if(!res || res.status !== 201) return {ok: false, dt: res.data};
        
        return {ok: true, dt: res.data}

    } catch(err){
        return {ok: false, dt: err.response.message};
    }
};

export const verifyEmail = async(email, code) => {

    try{

        const url = `${base_url}/user/verifyEmail`;

        const body = {
            email: email,
            eCode: code
        };

        const res = await axios.post(url, body);

        if(!res || res.status !== 200) return {ok: false, dt: res.data};
        
        return {ok: true, dt: res.data}

    } catch(err){
        return {ok: false, dt: err.response.message};
    }
}

export const Login = async(email, password, captchaToken) => {

    try{

        const url = `${base_url}/user/login`;

        const body = {
            email: email,
            password: password,
            captchaToken: captchaToken
        };

        const res = await axios.post(url, body, {withCredentials: true});

        if(!res || !res?.status)
            return {ok: false, dt: null};

        if(res.status !== 201 && res.status !== 402) 
            return {ok: false, dt: res.data ? res.data : "error creating your account"};

        if(res.status === 402) return {ok: true, dt: res.data, isBlocked: true};    

        return {ok: true, dt: res.data ? res.data : "account created successfully"};
   

    } catch(err){
        console.log("err: ", err);
        return {ok: false, dt: err.response.data.blockTime, isBlocked: err.response.status === 402 ? true : false};
    }
};

export const logout = async() => {

    try{

        const url = `${base_url}/user/logout`;

        const res = await axios.post(url, { withCredentials: true, 'Access-Control-Allow-Credentials': true });

        console.log(res);

        if(!res || !res.status || res.status !== 201)
            return {ok: false, dt: "Error logging out please try again"};

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

export const deleteAccount = async() => {

    try{

        const url = `${base_url}/user/delete_account`;

        const res = await axios.delete(url, { withCredentials: true, 'Access-Control-Allow-Credentials': true });

        if(!res?.status || res.status !== 200) return {ok: false, dt: res?.data ? res.data : null};

        return {ok: true, dt: res.data};

    } catch(err) {
        return {ok: false, dt: err.response.data};
    }

};

export const changePasswordSendCode = async(email) => {

    try{

        const url = `${base_url}/user/send_code_new_password`;

        const body = {
            email
        };

        const res = await axios.post(url, body, { withCredentials: true, 'Access-Control-Allow-Credentials': true });

        if(!res?.status || res.status !== 200) return {ok: false, dt: res?.data ? res.data : null};

        return {ok: true, dt: res.data};

    } catch(err) {
        return {ok: false, dt: err.response.data};
    }

};

export const changePassword = async(email, newPassword, eCode) => {

    try{

        const url = `${base_url}/user/make_new_password`;

        const body = {
            email,
            newPassword,
            eCode
        };

        const res = await axios.post(url, body, { withCredentials: true, 'Access-Control-Allow-Credentials': true });

        if(!res?.status || res.status !== 200) return {ok: false, dt: res?.data ? res.data : null};

        return {ok: true, dt: res.data};

    } catch(err) {
        return {ok: false, dt: err.response.data};
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
            picName: profilePicName.length > 0 ? picName : ""
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

export const profilePicFailed = async() => {

    try{

        const url = `${base_url}/profile/pic_upload_failed`;

        const res = await axios.put(url, null, { withCredentials: true, 'Access-Control-Allow-Credentials': true });

        if(!res || !res.status || res.status !== 200) return {ok: false, dt: res.data ? res.data : null}

        return {ok: true, dt: res.data ? res.data : null};  

    } catch(err){
        return {ok: false, dt: err?.response?.data ? err.response.data : "Error getting your profile info please login again"};
    }

}


/* Post page fetch functions */
export const createPost = async(username, creator_pic_name, postPictures, title) => {

    try{

        const post_images_names = [];
        for (let i = 0; i < postPictures.length; i++) {
            post_images_names.push({ picturesNames: `${Date.now()}_${username}_${postPictures[i].name}` });
        };

        const url = `${base_url}/post`;

        const body ={
            creator_image: creator_pic_name,
            post_images_names: post_images_names,
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

export const fetchPic = async(picName) => {

    try{

        const url = `https://f003.backblazeb2.com/file/mosocial-all-images-storage/${picName}`;
        return url;
        const res = await fetch(url);
        const blob = res.blob();
        console.log("Fetch pic res: ", res);
        const imageUrl = URL.createObjectURL(blob);
        return imageUrl;

    } catch(err){
        console.log(err.message);
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

export const postPicsUploadFailed = async(postId) => {

    try{

        const url = `${base_url}/post/${postId}`;

        const res = await axios.delete(url, { withCredentials: true, 'Access-Control-Allow-Credentials': true });

        if(!res || res.status !== 200) return {ok: false, dt: res.data};

        return {ok: true, dt: res.data};

    } catch(err){
        console.log(err.message);
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

export const getComment = async(commentId) => {

    try{

        const url = `${base_url}/comments/admin_comment/${commentId}`;

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

export const sendMessage = async(hisID, text) => {

    try{

        const url = `${base_url}/chat/${hisID}`;

        const body = {
            text: text
        };

        const res = await axios.post(url, body, { withCredentials: true, 'Access-Control-Allow-Credentials': true });

        if(!res || !res.status || res.status !== 201) return {ok: false, dt: res.data ? res.data : null};

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


/* report problems */
export const report = async(
    type, issue, desc, hisUserID, hisUserUsername, id
) => {

    try{

        const url = `${base_url}/report/${type ? type : 'x'}/${id ? id : 'x'}`;

        const body = {
            issue,
            desc,
            hisUserID,
            hisUserUsername
        };

        const res = await axios.post(url, body, { withCredentials: true, 'Access-Control-Allow-Credentials': true });

        if(!res || res.status !== 201) return {ok: false, dt: res?.data ? res.data : null};

        return {ok: true, dt: res?.data ? res.data : null};

    } catch(err){
        console.log(err.message);
        return {ok: false, dt: err.response.data};
    }

};


/* Admin functions */
export const getReports = async(limit) => {

    try {

        const url = `${base_url}/admin/reports/${limit ? limit : 10}`;

        const res = await axios.get(url,  { withCredentials: true, 'Access-Control-Allow-Credentials': true });

        if(!res || res.status !== 200) return {ok: false, dt: res.data};

        return {ok: true, dt: res.data};

    } catch(err){
        return {ok: false, dt: err.response.data};
    }

};

export const deleteReport = async(id) => {

    try {

        const url = `${base_url}/admin/reports/${id}`;

        const res = await axios.delete(url, { withCredentials: true, 'Access-Control-Allow-Credentials': true });

        if(!res || res.status !== 200) return {ok: false, dt: res.data};

        return {ok: false, dt: res.data};
        
    } catch(err) {
        return {ok: false, dt: err.response.data};
    }
};

export const deleteActivity = async(id) => {

    try {

        const url = `${base_url}/admin/admins-activity/${id}`;

        const res = await axios.delete(url, { withCredentials: true, 'Access-Control-Allow-Credentials': true });

        if(!res || res.status !== 200) return {ok: false, dt: res.data};

        return {ok: false, dt: res.data};
        
    } catch(err) {
        return {ok: false, dt: err.response.data};
    }
};

export const getMessage = async(id) => {

    try {

        const url = `${base_url}/admin/chat/${id}`;

        const res = await axios.get(url,  { withCredentials: true, 'Access-Control-Allow-Credentials': true });

        if(!res || res.status !== 200) return {ok: false, dt: res.data};

        return {ok: true, dt: res.data};

    } catch(err){
        return {ok: false, dt: err.response.data};
    }

};

export const deletePostAdmin = async(id, reason) => {

    try {

        const url = `${base_url}/admin/delete/post/${id}`;

        const body = { reason }

        const res = await axios.post(url, body,{ withCredentials: true, 'Access-Control-Allow-Credentials': true });

        if(!res || res.status !== 200) return {ok: false, dt: res.data};

        return {ok: true, dt: res.data};

    } catch(err){
        return {ok: false, dt: err.response.data};
    }

};

export const deleteMessageAdmin = async(messageId, senderId, reason) => {

    try {

        const url = `${base_url}/admin/delete/message/${messageId}`;

        console.log("sender id: ", senderId);

        const body = { senderId, reason };

        const res = await axios.post(url, body,{ withCredentials: true, 'Access-Control-Allow-Credentials': true });

        if(!res || res.status !== 200) return {ok: false, dt: res.data};

        return {ok: true, dt: res.data};

    } catch(err){
        return {ok: false, dt: err.response.data};
    }

};

export const deleteCommentAdmin = async(id, reason) => {

    try {

        const url = `${base_url}/admin/delete/comment/${id}`;

        const body = { reason }

        const res = await axios.post(url, body,{ withCredentials: true, 'Access-Control-Allow-Credentials': true });

        if(!res || res.status !== 200) return {ok: false, dt: res.data};

        return {ok: true, dt: res.data};

    } catch(err){
        return {ok: false, dt: err.response.data};
    }

};

export const blockUserAdmin = async(id, reason, blockDuration) => {

    try {

        const url = `${base_url}/admin/block_user/${id}`;

        const body = { reason, blockDuration };

        const res = await axios.post(url, body, { withCredentials: true, 'Access-Control-Allow-Credentials': true });

        if(!res || res.status !== 201) return {ok: false, dt: res.data};

        return {ok: true, dt: res.data};

    } catch(err){
        return {ok: false, dt: err.response.data};
    }

};

export const unBlockUserAdmin = async(id) => {

    try {

        const url = `${base_url}/admin/un-block-user/${id}`;

        const res = await axios.post(url, null, { withCredentials: true, 'Access-Control-Allow-Credentials': true });

        if(!res || res.status !== 201) return {ok: false, dt: res.data};

        return {ok: true, dt: res.data};

    } catch(err){
        return {ok: false, dt: err.response.data};
    }

};

export const moderate = async(objectId, type) => {

    try {

        const url = `${base_url}/admin/admins-activity/${objectId}`;

        const body = { type };

        const res = await axios.post(url, body, { withCredentials: true, 'Access-Control-Allow-Credentials': true });

        if(!res || res.status !== 201) return {ok: false, dt: res.data};

        return {ok: true, dt: res.data};

    } catch(err){
        return {ok: false, dt: err.response.data};
    }

};

export const getActivities = async(limit, type) => {

    try {

        const url = `${base_url}/admin/admins-activity/${limit}/${type}`;

        const res = await axios.get(url, { withCredentials: true, 'Access-Control-Allow-Credentials': true });

        if(!res || res.status !== 200) return {ok: false, dt: res.data};

        return {ok: true, dt: res.data};

    } catch(err){
        return {ok: false, dt: err.response.data};
    }

};

export const getAdmins = async(limit) => {

    try {

        const url = `${base_url}/admin/admins/${limit}`;

        const res = await axios.get(url, { withCredentials: true, 'Access-Control-Allow-Credentials': true });

        if(!res || res.status !== 200) return {ok: false, dt: res.data};

        return {ok: true, dt: res.data};

    } catch(err){
        return {ok: false, dt: err.response.data};
    }

};

export const deleteAdmin = async(id) => {

    try {

        const url = `${base_url}/admin/remove-admin/${id}`;

        const res = await axios.delete(url, { withCredentials: true, 'Access-Control-Allow-Credentials': true });

        if(!res || res.status !== 200) return {ok: false, dt: res.data};

        return {ok: true, dt: res.data};

    } catch(err){
        return {ok: false, dt: err.response.data};
    }

};

export const getBlocks = async(limit) => {

    try {

        const url = `${base_url}/admin/blocked-users/${limit}`;

        const res = await axios.get(url, { withCredentials: true, 'Access-Control-Allow-Credentials': true });

        if(!res || res.status !== 200) return {ok: false, dt: res.data};

        return {ok: true, dt: res.data};

    } catch(err){
        return {ok: false, dt: err.response.data};
    }

};

export const makeAdmin = async(reason, choosenEmail) => {

    try {

        const url = `${base_url}/admin/make_admin`;

        const body = {
            reason,
            choosenEmail
        };

        const res = await axios.post(url, body, { withCredentials: true, 'Access-Control-Allow-Credentials': true });

        if(!res || res.status !== 200) return {ok: false, dt: res.data};

        return {ok: true, dt: res.data};

    } catch(err){
        return {ok: false, dt: err.response.data};
    }

};
