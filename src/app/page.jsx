"use client";

import { useEffect, useState } from "react";
import { API_URL, STRAPI_URL } from "../../config";
import { GiSandsOfTime } from "react-icons/gi";
import Image from "next/image";
import { Link } from "next-view-transitions";

export default function Home() {
  const [data, setData] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [resultsFound, setResultsFound] = useState(true);

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
        setData(posts);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const normalizeString = (str) => {
    return str
      .toLowerCase() // Convertir a minúsculas
      .normalize("NFD") // Normalizar la cadena
      .replace(/[\u0300-\u036f]/g, ""); // Eliminar los acentos
  };

  const filteredPosts = data.filter((post) => {
    return normalizeString(post.title).includes(normalizeString(searchQuery));
  });

  return (
    <main className="mainContainer">
      <section>
        <div className="titleBlog">
          <h1>
            Clepsamia
            <sup>
              <GiSandsOfTime />
            </sup>
          </h1>
          {/* <hr /> */}
        </div>
        {filteredPosts.map((post) => (
          <article key={post.id}>
            <Link className="postBlog" href={post.slug}>
              <div className="imagePostBlog">
                <Image
                  width={800}
                  height={800}
                  src={`${STRAPI_URL}${post.coverUrl}`}
                  alt={post.title}
                />
              </div>
              <div>
                <small>{post.newFecha}</small>
                <h2>{post.title}</h2>
                {/* <p>{post.description}</p> */}
              </div>
            </Link>
          </article>
        ))}
      </section>
      <input
        className="searchInput"
        type="text"
        placeholder={"Buscar..."}
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          if (filteredPosts.length === 0) {
            setResultsFound(false);
          } else {
            setResultsFound(true);
          }
        }}
      />
    </main>
    //     <main className="flex min-h-screen flex-col items-center justify-between p-24">
    //       {data.length > 0 ? (
    //         data.map((post) => (
    //           <div key={post.id}>
    //             <h1>{post.title}</h1>
    //             <p>{post.description}</p>
    //             <p>By {post.author}</p>
    //             <p>{post.fecha}</p>
    //             <Image
    //               className=" w-20 h-20 bg-cover"
    //               src={`${STRAPI_URL}${post.coverUrl}`}
    //               alt="Image of animals"
    //               width={600}
    //               height={600}
    //             ></Image>
    //           </div>
    //         ))
    //       ) : (
    //         <p>Cargando...</p>
    //       )}
    //     </main>
  );
}
