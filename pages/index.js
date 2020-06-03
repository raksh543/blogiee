import React, {useState, Component, useRef, useCallback } from "react";
import Head from "next/head";
import Prismic from "prismic-javascript";
import { RichText } from "prismic-reactjs";

import useBookPages from './useBookPages'

// Project components & functions
import DefaultLayout from "layouts";
import { Header, PostList, SetupRepo } from "components/home";
import { Client } from "utils/prismicHelpers";


export default function App(){
  const [pageNumber, setPageNumber] = useState(1)
  const {
    loading,
    error,
    posts,
    hasMore,
    doc
  }=useBookPages(pageNumber)
  const observer = useRef()
  const lastPostElementRef = useCallback(node =>{
    console.log("------------------------------------")
    console.log(node)
    if(loading) return
    if(observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver( entries => {
      if(entries[0].isIntersecting && hasMore){
        setPageNumber(prevPageNumber => prevPageNumber + 1)
        console.log("visible")
      }
    })
    if (node) observer.current.observe(node)
  }, [loading, hasMore])


  
    return (
      <DefaultLayout>
        <div>element</div>
        {posts.map((post, index )=>{
          console.log("in here")
        if (posts.length === index + 1){
            console.log("in here 1" + post);
         return <div ref={lastPostElementRef} key ={post}>{post} <br/> <img src = "https://www.ibef.org//uploads/blog/blog-sample-img-lrg111.jpg"/></div>
        }else{
          console.log("in here 2" + post);
          return <div key ={post}>{post} <br/><img src = "https://www.ibef.org//uploads/blog/blog-sample-img-lrg111.jpg"/></div>
        }
        })}
        {/* <div>{posts}</div> */}
        <div>{loading && 'Loading...'}</div>
        <div>{error && 'Error'}</div>
      </DefaultLayout>
    );
  
}
