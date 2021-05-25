import React from "react";
import "./Post.css";
import { Avatar } from "@material-ui/core";

const Post = (props) => {
  return (
    <div className="post">
      <div className="post__header">
        <Avatar className="post__avatar" />
        <h3>{props.user.username}</h3>
      </div>

      <img className="post__img" src={props.user.image} alt="" />
      <div className="post__comments">
        <p className="post__text">
          <strong>{props.user.username} :</strong> {props.user.caption}
        </p>
      </div>
    </div>
  );
};

export default Post;
