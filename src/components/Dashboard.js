import React, { useState, useEffect, useRef } from "react";
import { FiType, FiSlash, FiChevronLeft, FiChevronRight, FiCalendar } from "react-icons/fi";
import Navbar from "./Navbar";

const SearchPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [query, setQuery] = useState("");
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [excludeWords, setExcludeWords] = useState(false);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [highlightedMatches, setHighlightedMatches] = useState([]);
  const [sortByDate, setSortByDate] = useState("default"); // Default, ascending, descending
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [hoveredBlog, setHoveredBlog] = useState(null); // Track hovered blog
  const blogRefs = useRef([]);

  const highlightText = (text, query) => {
    if (!query) return text;
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(${escapedQuery})`, caseSensitive ? "g" : "gi");
    if (excludeWords) {
      return text;
    }
    return text.replace(regex, `<mark class="bg-gray-300">$1</mark>`);
  };

  useEffect(() => {
    const fetchBlogs = async () => {
      const response = await fetch("https://dummyjson.com/posts");
      const blogData = await response.json();
      const enrichedBlogs = blogData.posts.map((blog, index) => ({
        ...blog,
        image: `https://picsum.photos/300/200?random=${index}`,
        timestamp: new Date(Date.now() - Math.random() * 1e10).toISOString(), // Random timestamps
      }));
      setBlogs(enrichedBlogs);
      setFilteredBlogs(enrichedBlogs);
    };
    fetchBlogs();
  }, []);

  useEffect(() => {
    let results = blogs;
    let matches = [];
    if (query) {
      results = blogs.filter((blog, blogIndex) => {
        const titleTarget = caseSensitive ? blog.title : blog.title.toLowerCase();
        const contentTarget = caseSensitive ? blog.body : blog.body.toLowerCase();
        const searchQuery = caseSensitive ? query : query.toLowerCase();

        if (excludeWords) {
          return !(titleTarget.includes(searchQuery) || contentTarget.includes(searchQuery));
        }

        const hasMatch = titleTarget.includes(searchQuery) || contentTarget.includes(searchQuery);
        if (hasMatch) matches.push(blogIndex);
        return hasMatch;
      });
    }

    if (sortByDate === "ascending") {
      results.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    } else if (sortByDate === "descending") {
      results.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    } else {
      results.sort(() => Math.random() - 0.5); 
    }

    setFilteredBlogs(results);
    setHighlightedMatches(matches);
    setCurrentMatchIndex(0);
  }, [query, caseSensitive, excludeWords, blogs, sortByDate]);

  const navigateMatches = (direction) => {
    if (highlightedMatches.length === 0) return;
    const totalMatches = highlightedMatches.length;
    const newIndex = (currentMatchIndex + direction + totalMatches) % totalMatches;
    setCurrentMatchIndex(newIndex);
    blogRefs.current[newIndex]?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-4 pt-20 relative">
      <Navbar />
      <h1 className="text-2xl font-bold mb-6 text-gray-700">Search Blogs</h1>

      {/* Fixed Search Bar */}
      <div className="fixed top-14 right-4 z-10 mx-auto p-4 bg-white rounded-lg shadow-lg w-96 hover:shadow-xl transition-shadow duration-200">
        <div className="relative flex items-center">
          <input
            type="text"
            className="w-full h-10 px-4 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Search blog posts..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="relative">
            <button
              className={`p-2 text-gray-500`}
              title="Sort Options"
              onClick={() => setShowSortDropdown(!showSortDropdown)}
            >
              <FiCalendar size={20} className="text-gray-400" />
            </button>
            {showSortDropdown && (
              <div className="absolute right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg w-32">
                <button
                  className="block px-4 py-2 text-sm hover:bg-gray-200 w-full text-left"
                  onClick={() => setSortByDate("ascending")}
                >
                  Ascending
                </button>
                <button
                  className="block px-4 py-2 text-sm hover:bg-gray-200 w-full text-left"
                  onClick={() => setSortByDate("descending")}
                >
                  Descending
                </button>
                <button
                  className="block px-4 py-2 text-sm hover:bg-gray-200 w-full text-left"
                  onClick={() => setSortByDate("default")}
                >
                  Default
                </button>
              </div>
            )}
          </div>
          <button
            className={`p-2 ${
              caseSensitive ? "text-blue-500 border border-blue-500 rounded-lg" : "text-gray-500"
            }`}
            title="Case Sensitive"
            onClick={() => setCaseSensitive(!caseSensitive)}
          >
            <FiType size={20} />
          </button>
          <button
            className={`p-2 ${
              excludeWords ? "text-blue-500 border border-blue-500 rounded-lg" : "text-gray-500"
            }`}
            title="Exclude Words"
            onClick={() => setExcludeWords(!excludeWords)}
          >
            <FiSlash size={20} />
          </button>
          {query && (
            <>
              <button
                className="p-2 text-gray-500"
                onClick={() => navigateMatches(-1)}
                title="Previous Match"
              >
                <FiChevronLeft size={20} />
              </button>
              <span className="text-gray-600 text-sm mx-2">
                {highlightedMatches.length > 0
                  ? `${currentMatchIndex + 1}/${highlightedMatches.length}`
                  : ""}
              </span>
              <button
                className="p-2 text-gray-500"
                onClick={() => navigateMatches(1)}
                title="Next Match"
              >
                <FiChevronRight size={20} />
              </button>
            </>
          )}
        </div>
      </div>

      <div className="w-full max-w-6xl bg-white rounded-md shadow p-4 mt-24 relative">
        <ul className="grid gap-4 sm:grid-cols-1 md:grid-cols-3">
          {filteredBlogs.map((blog, index) => (
            <li
              key={blog.id}
              className={`p-4 border border-gray-200 rounded-md shadow-sm transition duration-300 relative transform ${
                hoveredBlog === index ? "scale-105" : "scale-100"
              }`}
              ref={(el) => (blogRefs.current[index] = el)}
              onMouseEnter={() => setHoveredBlog(index)}
              onMouseLeave={() => setHoveredBlog(null)}
            >
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-40 object-cover rounded-md mb-2"
              />
              <h3
                className="font-bold text-gray-800 text-lg"
                dangerouslySetInnerHTML={{
                  __html: highlightText(blog.title, query),
                }}
              ></h3>
              <p className="text-gray-600 mt-2">
                Published on: {new Date(blog.timestamp).toLocaleDateString()}
              </p>
              <p
                className="text-gray-600 mt-2"
                dangerouslySetInnerHTML={{
                  __html: highlightText(blog.body, query),
                }}
              ></p>
              <a
                href="/"
                className="text-blue-500 text-sm mt-2 inline-block hover:underline"
              >
                Read More
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SearchPage;
