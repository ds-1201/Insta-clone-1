import { Button } from "@material-ui/core";
import React, { useState } from "react";
import { storage, db } from "./Firebase";
import firebase from "firebase";
import "./ImageUpload.css";

const ImageUpload = ({ username }) => {
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [caption, setCaption] = useState("");

  const imageHandler = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const uploadHandler = () => {
    const uploadTask = storage.ref(`images/${image.name}`).put(image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        console.log(error.message);
      },
      () => {
        storage
          .ref("images")
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            db.collection("posts").add({
              imgURL: url,
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              caption: caption,
              username: username,
            });
            setProgress(0);
            setCaption("");
            setImage(null);
          });
      }
    );
  };

  return (
    <div className="imageUpload">
      <progress value={progress} max="100" className="imageUpload__progress" />
      <input
        type="text"
        placeholder="Enter a caption"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
      />
      <input type="file" onChange={imageHandler} />
      <Button onClick={uploadHandler}>Upload</Button>
    </div>
  );
};

export default ImageUpload;
