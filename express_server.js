const express = require("express");
const { cookie } = require("request");
const cookieSession = require("cookie-session");
const { restart } = require("nodemon");
const bcrypt = require("bcryptjs");
const { getUserByEmail } = require("./helpers.js");

const app = express();

const PORT = 8080;

app.use(
  cookieSession({
    name: "session",
    keys: ["key1", "key2"],
  })
);
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");

// URLS

const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW",
  },
};

const urlsForUser = (userId) => {
  const urls = {};
  let urlKeys = Object.keys(urlDatabase);

  for (let key of urlKeys) {
    if (urlDatabase[key].userID === userId) {
      urls[key] = urlDatabase[key];
    }
  }
  return urls;
};

// USERS

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
  aJ48lW: {
    id: "aJ48lW",
    email: "b@example.com",
    password: "$2a$10$OffVUP7ugVx/rX5vVkjeE.mv64tHN9QrjltWPTUw0Hrh7Al74FcKi",
  },
};

//Generating Random String
const generateRandomString = () => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = 6;
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
};

//TEST ROUTE
app.get("/", (req, res) => {
  res.send("Hello!");
});

// TEST ROUTE
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// GET U/:ID - Shareable

app.get("/u/:id", (req, res) => {
  const shortURL = req.params.id;
  const longURL = urlDatabase[shortURL].longURL;

  if (!longURL) {
    res.status(404).send("Link not found");
    return;
  }

  res.redirect(longURL);
});

// GET URLS

app.get("/urls", (req, res) => {
  const userId = req.session.user_id;
  const user = users[userId];

  if (!user) {
    return res.status(400).send("Must be logged in");
  }

  const urls = urlsForUser(userId);
  const templateVars = { urls, user };
  res.render("urls_index", templateVars);
});

// GET URLS/NEW

app.get("/urls/new", (req, res) => {
  const userId = req.session.user_id;
  const user = users[userId];

  if (!req.session.user_id) {
    res.redirect("/login");

    return;
  }
  res.render("urls_new", { user });
});

// GET URLS/REGISTER

app.get("/register", (req, res) => {
  const userId = req.session.user_id;
  const user = users[userId];

  if (!req.session.user_id) {
    res.render("urls_register", { user });
    return;
  }

  res.redirect("/urls");
});

// GET URLS/LOGIN

app.get("/login", (req, res) => {
  const userId = req.session.user_id;
  const user = users[userId];

  if (req.session.user_id) {
    res.redirect("/urls");
    return;
  }

  res.render("urls_login", { user });
});

// GET URLS/:ID (SHOW)

app.get("/urls/:id", (req, res) => {
  const userId = req.session.user_id;
  if (!userId) {
    res.status(400).send("User is not logged in");
    return;
  }

  const user = users[userId];
  if (!user) {
    res.status(401).send("ID does not exist");
    return;
  }

  const shortURL = req.params.id;
  if (!urlDatabase[shortURL]) {
    res.status(404).send("Link not found");
    return;
  }

  if (userId !== urlDatabase[req.params.id].userID) {
    res.status(403).send("User does not own URL");
    return;
  }

  const templateVars = {
    id: shortURL,
    longURL: urlDatabase[shortURL].longURL,
    user,
  };
  res.render("urls_show", templateVars);
});

// POST URLS

app.post("/urls", (req, res) => {
  const userId = req.session.user_id;

  if (!userId) {
    res.status(400).send("Must be signed in to create links");

    return;
  }

  const shortId = generateRandomString();

  const longString = req.body.longURL;
  urlDatabase[shortId] = {
    longURL: longString,
    userID: userId,
  };
  res.redirect(`/urls/${shortId}`);
});

// POST REGISTER

app.post("/register", (req, res) => {
  const email = req.body.email;
  const passwordText = req.body.password;

  if (!passwordText || !email) {
    return res.status(400).send("Error 400: Empty email or password");
  }

  if (getUserByEmail(email, users)) {
    return res.status(400).send("Error 400: Email Already Exists");
  }

  const id = generateRandomString();
  const password = bcrypt.hashSync(passwordText, 10);
  users[id] = { id, email, password };

  req.session.user_id = id;

  res.redirect("/urls");
});

// POST DELETE

app.post("/urls/:id/delete", (req, res) => {
  const userId = req.session.user_id;
  const user = users[userId];
  if (!user) {
    res.status(401).send("User is not logged in");
    return;
  }

  const url = urlDatabase[req.params.id];
  if (url.userID !== userId) {
    res.status(403).send("User does not own URL");
    return;
  }

  delete urlDatabase[req.params.id];
  res.redirect("/urls");
});

// POST EDIT

app.post("/urls/:id", (req, res) => {
  const userID = req.session.user_id;
  const user = users[userID];
  if (!user) {
    res.status(401).send("User is not logged in");
    return;
  }

  const url = urlDatabase[req.params.id];
  if (url.userID !== userID) {
    res.status(403).send("User does not own URL");
    return;
  }

  url.longURL = req.body.longURL;

  res.redirect("/urls");
});

// POST LOGIN

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const user = getUserByEmail(email, users);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(403).send("Invalid Login");
  }

  req.session.user_id = user.id;
  res.redirect("/urls");
});

// POST LOGOUT

app.post("/logout", (req, res) => {
  res.clearCookie("session.sig");
  res.clearCookie("session");
  res.redirect("/login");
});

// Listener
app.listen(PORT, () => {});
