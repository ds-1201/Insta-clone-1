import React, { useState, useEffect } from "react";
import "./App.css";
import Post from "./Post";
import { db, auth } from "./Firebase";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import { Button, Input } from "@material-ui/core";
import ImageUpload from "./ImageUpload";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const [modalStyle] = useState(getModalStyle);
  const classes = useStyles();
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openlogin, setOpenLogin] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        const datas = snapshot.docs.map((doc) => ({
          id: doc.id,
          post: doc.data(),
        }));
        setPosts(datas);
      });
  }, []);

  const submitSignUp = (event) => {
    event.preventDefault();
    if (username.length === 0) {
      alert("Please Enter a valid username");
      return;
    }
    if (password.length < 6) {
      alert("Please Enter a password of minimum 6 characters");
      return;
    }
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({ displayName: username });
      })
      .catch((error) => alert(error.message));
    setOpen(false);
    setEmail("");
    setPassword("");
    setUsername("");
  };

  const submitSignIn = (event) => {
    event.preventDefault();
    if (password.length < 6) {
      alert("Please Enter a password of minimum 6 characters");
      return;
    }
    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));
    setOpenLogin(false);
    setEmail("");
    setPassword("");
  };

  return (
    <div className="app">
      <Modal open={open} onClose={() => setOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img
                className="app__headerImage"
                src="images/logo.png"
                alt="instagram"
              />
            </center>
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="username"
            />
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
            />
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password"
            />
            <Button type="submit" onClick={submitSignUp}>
              Signup
            </Button>
          </form>
        </div>
      </Modal>

      <Modal open={openlogin} onClose={() => setOpenLogin(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img
                className="app__headerImage"
                src="images/logo.png"
                alt="instagram"
              />
            </center>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
            />
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password"
            />
            <Button type="submit" onClick={submitSignIn}>
              Login
            </Button>
          </form>
        </div>
      </Modal>

      <div className="app__header">
        <img
          className="app__headerImage"
          src="images/logo.png"
          alt="instagram"
        />
        {user ? (
          <Button type="button" onClick={() => auth.signOut()}>
            Logout
          </Button>
        ) : (
          <div className="app__loginContainer">
            <Button type="button" onClick={() => setOpen(true)}>
              Signup
            </Button>
            <Button type="button" onClick={() => setOpenLogin(true)}>
              Login
            </Button>
          </div>
        )}
      </div>

      <div className="app__posts">
        {posts.map((post) => (
          <Post
            user={post.post}
            postId={post.id}
            key={post.id}
            loggedInUser={user}
          />
        ))}
      </div>

      {user && <ImageUpload username={user.displayName} />}
    </div>
  );
}

export default App;
