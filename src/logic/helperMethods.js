import imageCompression from 'browser-image-compression';

export const isValidUsername = (username) => {
    var regexPattern = /^[A-Za-z][A-Za-z0-9_]{2,32}$/;

    if(!regexPattern.test(username))
      return false;

    return true;
};

export const isValidEmail = (email) => {
    const regexPattern = /^\S+@\S+\.\S+$/;

    if(!regexPattern.test(email))
      return false;
  
    return true;
};

export const isValidPassword = (password, confirmPassword) => {

    if(!password || !confirmPassword || password !== confirmPassword || password === "")
        return false;

    if(checkPasswordStrength(password).ok === false)
        return false;
        
    return true;    
        
};

export const checkPasswordStrength = (password) => {

    let strength = 0;
    let tips = "";

    if (password.length >= 8) {
      strength += 1;
    } else {
      return {ok: false, message: "password is too short" };
    }
  
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) {
      strength += 1;
    } else {
      tips += "Use both lowercase and uppercase letters. ";
    }
  
    if (password.match(/\d/)) {
      strength += 1;
    } else {
      tips += "or Include at least one number. ";
    }
  
    if (password.match(/[^a-zA-Z\d]/)) {
      strength += 1;
    } else {
      tips += "or Include at least one special character. ";
    }
  
    if(strength < 2)
        return {ok: false, message: tips };

    if(strength > 3)
        return {ok: true, message: "Strong password" };    

    return {ok: true, message: "medium password" };    

};

export const validateImageType = (image) => {

    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];

    if(allowedTypes.includes(image.type))
      return true;

    return false;
      
};

export const handleImage = async(image, maxSizeinMB) => {
  
  if(!image) return null;

  const options = {
    maxSizeMB: maxSizeinMB,
    maxWidthOrHeight: 1080
  }

  try {
    const compressedFile = await imageCompression(image, options);
    console.log(compressedFile);
    return new File([compressedFile], compressedFile.name, { type: compressedFile.type });  
  } catch (error) {
    console.log(error);
  }

};

export const setLikedPosts = (posts, likedPosts) => {

  if(!posts || posts.length <= 0) return [];

  if(!likedPosts || likedPosts.length <= 0) return posts;

  for (let i = 0; i < posts.length; i++) {

    let isLiked = false;

    for (let j = 0; j < likedPosts.length; j++) {
      if(likedPosts[j].post_liked_id === posts[i]._id){
        isLiked = true;
      }
    }

    posts[i] = {...posts[i], liked: isLiked};
    
  };

  return posts;

};

export const setPostInfoOnComments = (comments, posts) => {

  for (let i = 0; i < comments.length; i++) {
    for (let j = 0; j < posts.length; j++) {
      if(comments[i].post_id === posts[j]._id){
        comments[i] = {
          ...comments[i], 
          post_id: posts[j]._id,
          post_first_image: posts[j].post_images[0], 
          post_title: posts[j].desc, 
          post_created_at: posts[j].createdAt 
        };
      };
    };
  };

  return comments;
};

export const setClientOnChats = (chats, userID) => {

  if(!chats || chats.length <= 0) return [];

  if(Array.isArray(chats)){

    for (let i = 0; i < chats.length; i++) {
      if(chats[i].sender_id === userID){
        chats[i] = {...chats[i], client: true};
      } else {
        chats[i] = {...chats[i], client: false};
      }
    }

  } else {

    if(chats.sender_id === userID){
      chats = {...chats, client: true};
    } else {
      chats = {...chats, client: false};
    }

  }

  return chats;

};
