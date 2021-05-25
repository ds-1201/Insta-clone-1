import React, { useEffect, useState } from "react";
import "./Post.css";
import { Avatar } from "@material-ui/core";
import { db } from "./Firebase";
import firebase from "firebase";

const Post = (props) => {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  useEffect(() => {
    const unsubscribe = db
      .collection("posts")
      .doc(props.postId)
      .collection("comments")
      .orderBy("timestamp")
      .onSnapshot((snapshot) => {
        const datas = snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }));
        setComments(datas);
      });

    return () => {
      unsubscribe();
    };
  }, [props.postId]);

  const postComment = (event) => {
    event.preventDefault();
    const userComment = {
      username: props.loggedInUser.displayName,
      text: comment,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    };
    db.collection("posts")
      .doc(props.postId)
      .collection("comments")
      .add(userComment);
    setComment("");
  };

  return (
    <div className="post">
      <div className="post__header">
        <Avatar className="post__avatar" />
        <h3>{props.user.username}</h3>
      </div>
      <img className="post__img" src={props.user.imgURL} alt="" />
      <div className="post__comments">
        <p className="post__caption">
          <strong>{props.user.username} :</strong> {props.user.caption}
        </p>
        {comments.map((comment) => (
          <p key={comment.id} className="post__text">
            <strong>{comment.data.username} :</strong> {comment.data.text}
          </p>
        ))}
      </div>
      <div className="post__commentForm">
        {props.loggedInUser && (
          <form className="post__form">
            <input
              type="text"
              className="post__input"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment..."
            />
            <button
              type="submit"
              disabled={!comment}
              className="post__button"
              onClick={postComment}
            >
              Post
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Post;

// : (
//         <center>
//           <h3 className="post__loginCheck">Login to comment</h3>
//         </center>
//       // )}
