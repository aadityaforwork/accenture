// pages/community.tsx
import React, { useState } from 'react';

interface Post {
  title: string;
  content: string;
  author: string;
}

const ForumPost: React.FC<Post> = ({ title, content, author }) => {
  return (
    <div className="border p-4 mb-4">
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <p className="text-gray-600">{content}</p>
      <p className="text-sm text-gray-500 mt-2">Posted by {author}</p>
    </div>
  );
};

const CommunityPage: React.FC = () => {
  const [newPost, setNewPost] = useState<Post>({ title: '', content: '', author: 'Anonymous' });
  const [posts, setPosts] = useState<Post[]>([
    // { title: 'First Post Title', content: 'Content of the first post...', author: 'John Doe' },
    // { title: 'Second Post Title', content: 'Content of the second post...', author: 'Jane Doe' },
    // Add more posts as needed
  ]);

  const handlePostSubmit = () => {
    // Check if the new post has a title and content
    if (newPost.title && newPost.content) {
      setPosts([...posts, newPost]);
      // Clear the form after submission
      setNewPost({ title: '', content: '', author: 'Anonymous' });
    }
  };

  return (
    <div className=' grid grid-rows-2'>
    <div className="container mx-20 my-8 text-blue-600">
      <h1 className="text-4xl font-bold mb-4">Community Forum</h1>

      {/* New Post Form */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">New Post</h2>
        <div className="flex flex-col space-y-2">
          <input
            type="text"
            placeholder="Title"
            className="border rounded p-2"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
          />
          <textarea
            placeholder="Write your post here..."
            className="border rounded p-2 h-32"
            value={newPost.content}
            onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
          />
          <button
            className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
            onClick={handlePostSubmit}
          >
            Submit Post
          </button>
        </div>
      </div>

      {/* Display Forum Posts */}
      <div>
        {posts.map((post, index) => (
          <ForumPost key={index} {...post} />
        ))}
      </div>
    </div>
    </div>
  );
};

export default CommunityPage;
