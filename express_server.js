const express = require("express");
const { cookie } = require("request");
const cookieParser = require("cookie-parser");

const app = express();

const PORT = 8080; // default port 8080

let userError = false;
/*

const toggleError = function () {
  setTimeout(() => {
    userError = false;
  }, 3000);
};
*/

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");

// installed ejs with npm install ejs
// set ejs as view engine

// URLS

let urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
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
  123: {
    id: "123",
    email: "t@example.com",
    password: "t",
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

//LOOKUP HELPER FUNCTION

const lookupHelperFunction = (password, userEmail) => {
  let userKeys = Object.keys(users);

  if (password === null) {
    for (let key of userKeys) {
      if (users[key].email === userEmail) {
        return true;
      }
    }
    return false;
  } else {
    for (let key of userKeys) {
      if (users[key].password === password) {
        return true;
      }
    }
    return false;
  }
};

const lookupLoginHelperFunction = (password, userEmail) => {
  let userKeys = Object.keys(users);

  for (let key of userKeys) {
    if (users[key].email === userEmail && users[key].password === password) {
      return true;
    }
  }
  return false;
};

const helperFunction = (password, userEmail) => {
  for (let user in users) {
    // use in for objects
    if (users[user].email === userEmail && users[user].password === password) {
      return users[user];
    }
  }
  return false;
};

const lookupUserByUserID = (userId) => {
  let userKeys = Object.keys(users);

  for (let key of userKeys) {
    if (users[key].id === userId) {
      return users[key];
    }
  }
  return null;
};

//TEST ROUTE

app.get("/", (req, res) => {
  res.send("Hello!");
});

// TEST ROUTE
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

// TEST ROUTE
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

// adding route -> not completely sure what this is for
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// GET U/:ID

app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id];
  res.redirect(longURL);
});

// GET URLS

app.get("/urls", (req, res) => {
  const userId = req.cookies.user_id;
  const user = lookupUserByUserID(userId);
  //Now we have user!

  console.log("Req Cookies", req.cookies);
  //DO MORE STUFF HERE!!

  const templateVars = { urls: urlDatabase, user };
  res.render("urls_index", templateVars); // passing url data to our template
});

// GET URLS/NEW

app.get("/urls/new", (req, res) => {
  const userId = req.cookies.user_id;
  const user = users[userId];
  //Now we have user!
  console.log("+++ ", req.cookies["user_id"]);
  res.render("urls_new", { user });
});

// GET URLS/REGISTER

app.get("/urls/register", (req, res) => {
  const userId = req.cookies.user_id;
  const user = users[userId];
  //Now we have user!
  res.render("urls_register", { user });
});

// GET URLS/REGISTER

app.get("/urls/login", (req, res) => {
  const userId = req.cookies.user_id;
  const user = users[userId];
  //Now we have user!
  res.render("urls_login", { user });
});

/*
app.get("/urls/:id", (req, res) => {
  const id = req.params.id;
  const longURL = urlDatabase[id];
  const templateVars = { id: id, longURL: longURL };
  res.render("urls_show", templateVars);
});
*/

// GET URLS/:ID (SHOW)

app.get("/urls/:id", (req, res) => {
  const userId = req.cookies.user_id;
  const user = users[userId];
  //Now we have user!

  const shortURL = req.params.id;

  const templateVars = {
    id: shortURL,
    longURL: urlDatabase[shortURL],
    user,
  };
  res.render("urls_show", templateVars);
});

// POST URLS

app.post("/urls", (req, res) => {
  //console.log(req.body); // Log the POST request body to the console
  let randomString = generateRandomString();
  //let long = req.body.longURL;
  //console.log(id);
  //urlDatabase.longURL = randomString;
  let longString = req.body.longURL;
  urlDatabase[randomString] = longString;
  res.redirect(`/urls/${randomString}`);
});

// POST REGISTER

app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  //!!check more stuff here later!!

  if (!password || !email) {
    res.status(400).send("Error 400: Empty email or password");

    return;
    // If the e-mail or password are empty strings, send back a response with the 400 status code.
  } else if (lookupHelperFunction(null, email)) {
    res.status(400).send("Error 400: Email Already Exists");
    return;
    // If someone tries to register with an email that is already in the users object, send back a response with the 400 status code.
  } else {
    let id = generateRandomString();

    // our register
    users[id] = { id, email, password };

    res.cookie("user_id", id);
    console.log(users);
    res.redirect("/urls");
    //res.redirect("/register");
  }

  //users[userId] = id;
});

// POST DELETE

app.post("/urls/:id/delete", (req, res) => {
  // :id is a param - dynamic / changing depending on what's passed;
  //delete req.body.id;
  // console.log(urlDatabase);
  //console.log(req.params); //object of keys where each key is the name of the param;
  delete urlDatabase[req.params.id]; // I need to reference the database I'm trying to delete, then the requested parameters (displayed through :id) and then .id to get the key for the delete method
  //delete urlDatabase[req.body];
  // delete urlDatabase;

  res.redirect("/urls");
});

// POST EDIT

app.post("/urls/:id", (req, res) => {
  // :id is a param - dynamic / changing depending on what's passed;

  urlDatabase[req.params.id] = req.body.longURL;

  res.redirect("/urls");
});

// POST LOGIN

app.post("/login", (req, res) => {
  //console.log(req.body);
  const email = req.body.email;
  const password = req.body.password;

  if (lookupLoginHelperFunction(password, email)) {
    let userInfo = helperFunction(password, email);
    res.cookie("user_id", userInfo.id);
    console.log("UserInfo", userInfo);
    res.redirect("/urls");

    // If someone tries to register with an email that is already in the users object, send back a response with the 400 status code.
  } else if (!lookupHelperFunction(null, email)) {
    res.status(403).send("Error 403: Email Cannot be found");
    return;
  }

  if (!lookupHelperFunction(password, null)) {
    res.status(403).send("Error 403: Password does not match");
    return;
  }
});

//users[userId] = id;

// POST LOGOUT

app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/login");
});
