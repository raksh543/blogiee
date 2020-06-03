import { useEffect, useState } from 'react';
import Head from "next/head";
import Prismic from "prismic-javascript";
import { RichText } from "prismic-reactjs";

// Project components & functions
import DefaultLayout from "layouts";
import { Header, PostList, SetupRepo } from "components/home";
import { Client } from "utils/prismicHelpers";

export default function useBookPages(pageNumber) {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const[posts,setPosts]= useState([])
    const[hasMore, setHasMore] = useState(false)
    const[doc, setDoc] = useState('')

    // const { ref } = previewData
    useEffect(() => {
        setLoading(true)
        setError(false)

        const client = Client()
        client.getSingle("blog_home").then(doc=>{
            setDoc(doc)
        })
        console.log("doc   "+doc)
        // const doc = client.getSingle("blog_home", ref ? { ref } : null);

        client.query(
            Prismic.Predicates.at("document.type", "post"), {
            orderings: "[my.post.date desc]",
            pageSize: 2,
            page :pageNumber
        }).then(posts => {
            // return console.log(posts ? posts.results : [])
            setPosts(prevPosts => {
                console.log(posts.results.map(b => b.data.body))
              return [...prevPosts, ...posts.results.map(b => b.uid)]
            })
            setHasMore(posts.results.length > 0)
            setLoading(false)
        }).catch( e =>{
            if (e) return
            setError(true)
        })
    }, [pageNumber])
    return {loading, error, posts, hasMore, doc}
}

