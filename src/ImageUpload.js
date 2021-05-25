import { Button } from "@material-ui/core";
import React, { useState } from "react";
import { storage, db } from "./Firebase";
import firebase from "firebase";
import "./ImageUpload.css";

const fileUpload = document.getElementById("imageUpload__file");

const ImageUpload = ({ username }) => {
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [caption, setCaption] = useState("");

  const imageHandler = (event) => {
    const file = event.target.files[0];
    const fileType = file.type;
    const validImageTypes = ["image/gif", "image/jpeg", "image/png"];
    if (validImageTypes.includes(fileType)) {
      setImage(file);
    } else {
      alert("Please upload a image having .png/.jpeg/.gif");
      fileUpload.value = null;
    }
  };

  const uploadHandler = () => {
    if (caption.length === 0) {
      alert("Please Enter a valid Caption");
      return;
    }
    if (image === null) {
      alert("Please Upload a file of .png/.jpeg/.gif to continue");
      return;
    }
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
      <div className="imageUpload__control">
        <progress
          value={progress}
          max="100"
          className="imageUpload__progress"
        />
        <input
          className="imageUpload__caption"
          type="text"
          placeholder="Enter a caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
        <input type="file" onChange={imageHandler} id="imageUpload__file" />
        <Button className="imageUpload__button" onClick={uploadHandler}>
          Upload
        </Button>
      </div>
    </div>
  );
};

export default ImageUpload;
