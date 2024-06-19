"use client";
import { useEffect, useState } from "react";
import { Link } from "next-view-transitions";
import Image from "next/image";
import { API_URL, STRAPI_URL } from "../../../config";
import { GiSandsOfTime } from "react-icons/gi";
import DOMPurify from "isomorphic-dompurify";
import { marked } from "marked";

function Post({ params }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) {
          throw new Error("Ha ocurrido un error");
        }
        const fetchedData = await res.json();
        const posts = fetchedData.data.map((post) => ({
          id: post.id,
          title: post.attributes.title,
          description: post.attributes.description,
          content: post.attributes.content,
          slug: post.attributes.slug,
          author: post.attributes.author.data[0].attributes.username,
          coverUrl: post.attributes.cover.data.attributes.url,
          fecha: post.attributes.publishedAt,
        }));
        const filteredPosts = posts.filter((post) => post.slug === params.slug);

        const transformDate = (dateString) => {
          const datePart = dateString.split("T")[0];
          const [year, month, day] = datePart.split("-");
          return `${day}·${month}·${year}`;
        };
        const transformedPosts = filteredPosts.map((post) => ({
          ...post,
          newFecha: transformDate(post.fecha),
        }));

        setData(transformedPosts);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [params]);

  //   const filteredPosts = data.filter((post) => post.slug === params.slug);
  return (
    <main className="postMain">
      <section className="postSection">
        {data.map((post) => (
          <article className="postArticle" key={post.id}>
            <div className="hairPost">
              <small>
                Por {post.author} el {post.newFecha}
              </small>
              <Link href={"/"}>
                <small className="clock">
                  <GiSandsOfTime />
                </small>
              </Link>
            </div>
            <hr />
            <header className="headerPost">
              <div className="imagePost">
                <Image
                  width={800}
                  height={800}
                  src={`${STRAPI_URL}${post.coverUrl}`}
                  alt={post.title}
                />
              </div>
              <div className="titlePost">
                <h1>{post.title}</h1>
              </div>
            </header>
            <hr />
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(marked(post.content)),
              }}
            ></div>
          </article>
        ))}
      </section>
    </main>
  );
}

export default Post;
