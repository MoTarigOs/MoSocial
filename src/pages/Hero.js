import React, { useEffect, useRef, useState, useContext } from 'react';
import { DataContext } from '../DataContext';
import { getPosts } from '../logic/api';
import { setLikedPosts } from '../logic/helperMethods';
import './Hero.css';
import Button from '../components/Buttons/Button';
import { motion } from 'framer-motion';
import HeroPostCard from '../components/Cards/HeroPostCard';
import Svgs from '../Assets/icons/Svgs';
import Tags from '../components/Tags/Tags';
import Comments from '../components/Comments/Comments';

const Hero = ({ myRef, setIsLoading, isMobile }) => {

    const searchInputRef = useRef();
    const [isLoadingPosts, setIsLoadingPosts] = useState(false);
    const [isComments, setIsComments] = useState(false);
    const [runOnce, setRunOnce] = useState(false);
    const [posts, setPosts] = useState([]);
    const [limit, setLimit] = useState(10);
    const [filter, setFilter] = useState("Date-of-publish");
    const [filterSeen, setFilterSeen] = useState("");
    const [searchText, setSearchText] = useState("");
    const [isTag, setIsTag] = useState(false);
    const { contacts } = useContext(DataContext);

    const handleSearchSubmit = (e) => {
      console.log("searched")
      fetchHomePagePosts();
    };

    const handleDeleteThisPost = (post_id_to_delete) => {
      setPosts(
        posts.filter(
          post => post._id !== post_id_to_delete
        )
      );
    };

    const handleTag = (tagValue) => {
      setSearchText(tagValue);
      setIsLoading(true);
      setTimeout(() => {
        setIsTag(true);
      }, 100);
    };

    useEffect(() => {
      async function handleTagFun (){
        if(searchText.length > 0 && isTag === true){
          setIsTag(false);
          await fetchHomePagePosts();
          setIsLoading(false);
        };
      };
      handleTagFun();

    }, [searchText, isTag]);

    async function fetchHomePagePosts(){

      try{

        if(isLoadingPosts === true) return;

        setIsLoadingPosts(true);

        let myFilter = filter;
        if(filterSeen === "My-Contacts-Only") 
          myFilter = "My-Contacts-Only-" + filter;

        if(searchText.length > 0)
          myFilter = "Search-By-Text-" + myFilter;
 
        console.log("searchText", searchText);

        const res = await getPosts(limit, myFilter, contacts, searchText);
        if(!res || !res?.ok || res.ok === false || !res.dt || res.dt.length <= 0) return setIsLoadingPosts(false);
        console.log(res.dt);
        const newPosts = setLikedPosts(res.dt.posts, res.dt.likedPosts);
        setPosts(newPosts);
        const newLimit = limit > 50 ? limit : limit + 10;
        setLimit(newLimit);

        setIsLoadingPosts(false);

      } catch(err){
          console.log(err.message);
          setIsLoadingPosts(false);
      }

    };

    useEffect(() => {
      setRunOnce(true);
    }, []);

    useEffect(() => {  
      if(runOnce === true){
        fetchHomePagePosts();
      }
    }, [runOnce]);

    return (
      <div className='HeroContainer'>

        <Comments isComments={isComments} setIsComments={setIsComments} />

        <motion.div className='HeroHeader'
          initial={{
            y: -300
          }}
          animate={{
            y: 0
          }}
        >
          {isMobile === false ? (
            <>
              <form className='HeroSearchForm' onSubmit={(e) => e.preventDefault()}>
                <div onClick={(e) => handleSearchSubmit(e)}>
                  <Svgs type={"Search"}/>
                </div>
                <input type='text' placeholder='Search' value={searchText.length > 0 ? searchText : null} ref={searchInputRef} onChange={(e) => setSearchText(e.target.value)}/>
                <select className='selectMenuFilter' onChange={(e) => {
                  setFilter(e.target.value.replaceAll(" ", "-"));
                }}>
                  {[{n: 1, s: "Date of publish"}, 
                  {n: 2, s: "Most Liked Posts"}].map((item) => (
                    <option key={item.n}>{item.s}</option>
                  ))}
                </select>
                <select className='selectMenuFilter' onChange={(e) => {
                  if(e.target.value === "Everyone") return setFilterSeen("");
                  setFilterSeen(e.target.value.replaceAll(" ", "-"));
                }
                }>
                  {[{n: 1, s: "Everyone"}, 
                  {n: 2, s: "My Contacts Only"}].map((item) => (
                    <option key={item.n}>{item.s}</option>
                  ))}
                </select>
              </form>

              <Tags handleTag={handleTag} />
            </>) : (
              <div className='searchForMobile'>
                <Svgs type={"Search"} on_click={handleSearchSubmit}/>
              </div>
            )}
        </motion.div>
      
        <div className='Hero' ref={myRef}>

          <ul className='postsUL'>
            {posts.map((post) => (
              <HeroPostCard 
                key={post._id}
                id={post._id}
                postIsLiked={post.liked}
                creator_name={post.creator_username}
                creator_image={post.creator_image}
                creator_id={post.creator_id}
                images={post.post_images}
                desc={post.desc}
                topCommentCreatorImage={null}
                topCommentCreatorName={"udhfuidshf"}
                topComment={"skjdgfh8ewy7gfsdf78dsfbshjdgfhsdgfywsehfjgsdjhfgsdhjfgjshdghsfg"}
                setIsComments={setIsComments}
                handleDeleteThisPost={handleDeleteThisPost}
              />
            ))}
                      
            <button className='morePostsButton' onClick={() => fetchHomePagePosts()}>{posts.length > 0 && isLoadingPosts === true ? "More posts" : "Get posts"}</button>
            
          </ul>

        </div>

      </div>
    )
};

export default Hero;
