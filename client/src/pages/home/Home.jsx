import { Header } from "../../components/header";
import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { fetchAllScheduledPosts, deleteScheduledPost } from "../../apiClient";
import { AdminContext } from "../../App"; // Adjust the path if needed

export const Home = () => {
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [confirmDeletePost, setConfirmDeletePost] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useContext(AdminContext);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await fetchAllScheduledPosts();
        setPosts(data);
      } catch (err) {
        console.error("Failed to fetch scheduled posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const getPostTypeColor = (postType) => {
    switch (postType) {
      case "general":
        return "bg-yellow-100 text-yellow-800";
      case "birthday":
        return "bg-red-100 text-red-800";
      case "event":
        return "bg-blue-100 text-blue-800";
      case "holiday":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const capitalizeFirstLetter = (string) => {
    if (!string) return "";
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const openModal = (post) => {
    setSelectedPost(post);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPost(null);
  };

  return (
    <>
      <Header />

      {/* LOADING */}
      {loading && (
        <div className="fixed inset-0 bg-transparent z-50 flex items-center justify-center">
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce" />
            <div
              className="w-3 h-3 bg-red-400 rounded-full animate-bounce"
              style={{ animationDelay: "0.15s" }}
            />
            <div
              className="w-3 h-3 bg-blue-400 rounded-full animate-bounce"
              style={{ animationDelay: "0.3s" }}
            />
            <div
              className="w-3 h-3 bg-green-400 rounded-full animate-bounce"
              style={{ animationDelay: "0.45s" }}
            />
          </div>
        </div>
      )}

      {/* CONTENT */}
      {!loading && (
        <div className="p-4 max-w-5xl mx-auto px-4 sm:px-6 mt-16">
          {posts.length === 0 ? (
            <div className="bg-gray-100 rounded-lg p-8 text-center shadow-md">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                No scheduled posts yet.
              </h2>
              <p className="text-gray-600 mb-6">
                You can create your first scheduled post here.
              </p>
              <Link
                to="/create"
                className={`px-6 py-2 rounded-full ${
                  isAdmin
                    ? "bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer"
                    : "bg-gray-300 text-gray-600 cursor-not-allowed"
                }`}
                tabIndex={isAdmin ? 0 : -1}
                onClick={(e) => {
                  if (!isAdmin) e.preventDefault();
                }}
              >
                Schedule a post
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <div
                  key={post._id}
                  className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md hover:scale-[1.01] transition-all flex flex-col"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${getPostTypeColor(
                        post.post_type
                      )}`}
                    >
                      {capitalizeFirstLetter(post.post_type)}
                    </span>
                    <div className="flex items-center space-x-2">
                      <Link
                        to={`/create/${post._id}`}
                        title="Edit"
                        className={`text-lg ${
                          isAdmin
                            ? "text-gray-500 hover:text-blue-600 cursor-pointer"
                            : "text-gray-300 cursor-not-allowed"
                        }`}
                        tabIndex={isAdmin ? 0 : -1}
                        onClick={(e) => {
                          if (!isAdmin) e.preventDefault();
                        }}
                      >
                        <i className="fa-regular fa-pen-to-square" />
                      </Link>
                      <button
                        onClick={() => {
                          if (isAdmin) {
                            setConfirmDeletePost(post);
                          } else {
                            alert(
                              "You need to be in Admin Mode to delete scheduled posts."
                            );
                          }
                        }}
                        title="Delete"
                        className={`text-lg ${
                          isAdmin
                            ? "text-gray-500 hover:text-red-600 cursor-pointer"
                            : "text-gray-300 cursor-not-allowed"
                        }`}
                        disabled={!isAdmin}
                      >
                        <i className="fa-regular fa-trash-can" />
                      </button>
                    </div>
                  </div>

                  {post.images?.length > 0 && (
                    <div
                      className="relative mb-3 cursor-pointer"
                      onClick={() => openModal(post)}
                    >
                      <img
                        src={post.images[0]}
                        alt="Post preview"
                        loading="lazy"
                        className="w-full h-48 object-cover rounded-lg border border-gray-100"
                      />
                      {post.images.length > 1 && (
                        <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center text-white text-lg font-semibold">
                          +{post.images.length - 1}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex flex-col justify-between h-full flex-grow">
                    <div className="mb-2">
                      <p className="text-sm text-gray-800 line-clamp-2">
                        {post.message}
                      </p>
                    </div>
                    <div className="mt-auto">
                      <p className="text-xs text-gray-500">
                        🕒{" "}
                        {format(
                          new Date(post.schedule_publish_time),
                          "MMM d, yyyy · h:mm a"
                        )}
                      </p>
                      <button
                        className="mt-2 text-sm font-medium text-blue-600 hover:underline"
                        onClick={() => openModal(post)}
                      >
                        View
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* IMAGE VIEW MODAL */}
      {showModal && selectedPost && (
        <div className="fixed inset-0 z-50 backdrop-blur-sm bg-white/30 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative p-6 shadow-2xl">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-xl"
              onClick={closeModal}
              title="Close"
            >
              <i className="fa-solid fa-xmark" />
            </button>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">
                {capitalizeFirstLetter(selectedPost.post_type)}
              </h3>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                {selectedPost.message}
              </p>
              {selectedPost.images?.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {selectedPost.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`Post image ${idx + 1}`}
                      loading="lazy"
                      className="rounded-lg object-cover h-60 w-full"
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {confirmDeletePost && (
        <div className="fixed inset-0 z-50 backdrop-blur-sm bg-white/30 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 shadow-2xl max-w-sm w-full text-center relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-red-600 text-xl"
              onClick={() => setConfirmDeletePost(null)}
            >
              <i className="fa-solid fa-xmark" />
            </button>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Are you sure you want to delete this scheduled post?
            </h3>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setConfirmDeletePost(null)}
                className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  try {
                    await deleteScheduledPost(confirmDeletePost._id);
                    setPosts((prev) =>
                      prev.filter((post) => post._id !== confirmDeletePost._id)
                    );
                    setConfirmDeletePost(null);
                  } catch (err) {
                    console.error("Delete failed:", err);
                  }
                }}
                className="px-4 py-2 rounded-md bg-red-500 hover:bg-red-600 text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
