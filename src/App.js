import React, { useEffect, useState } from "react";
import "./index.scss";
import { Collection } from "./Collection";

const categories = ["Все", "Море", "Горы", "Архитектура", "Города"];

function App() {
  const [selectedCategory, setSelectedCategory] = useState("Все");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        const response = await fetch(`${process.env.PUBLIC_URL}/data.json`);
        const json = await response.json();

        let filteredCollections = json.collections;

        if (selectedCategory !== "Все") {
          filteredCollections = filteredCollections.filter(
            (collection) =>
              collection.category === categories.indexOf(selectedCategory)
          );
        }

        setCollections(filteredCollections);
      } catch (error) {
        console.warn(error);
        alert("Ошибка при получении данных");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedCategory, page]);

  return (
    <div className="App">
      <h1>Моя коллекция фотографий</h1>
      <div className="top">
        <ul className="tags">
          {categories.map((category) => (
            <li
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={selectedCategory === category ? "active" : ""}
            >
              {category}
            </li>
          ))}
        </ul>
        <input
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="search-input"
          placeholder="Поиск по названию"
        />
      </div>
      <div className="content">
        {isLoading ? (
          <h2>Идет загрузка...</h2>
        ) : (
          collections
            .filter((obj) =>
              obj.name.toLowerCase().includes(searchValue.toLowerCase())
            )
            .map((obj, index) => (
              <Collection key={index} name={obj.name} images={obj.photos} />
            ))
        )}
      </div>
      <ul className="pagination">
        {[...Array(5)].map((_, i) => (
          <li
            onClick={() => setPage(i + 1)}
            className={page === i + 1 ? "active" : ""}
            key={i}
          >
            {i + 1}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
