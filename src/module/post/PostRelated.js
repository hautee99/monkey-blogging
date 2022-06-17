import Heading from "components/layout/Heading";
import { db } from "firebase-app/firebase-config";
import { collection, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import PostItem from "./PostItem";

const PostRelated = ({ categoryId = "" }) => {
  const [category, setCategory] = useState({});
  useEffect(() => {
    const docRef = query(collection(db, "post"));
  });
  if (!category || postMessage.length <= 0) return null;
  if (categoryId) return null;
  return (
    <div className="post-related">
      <Heading>Bài viết liên quan</Heading>
      <div className="grid-layout grid-layout--primary"></div>
    </div>
  );
};

export default PostRelated;
