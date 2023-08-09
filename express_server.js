const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

// installed ejs with npm install ejs
// set ejs as view engine

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

app.set("view engine", "ejs");

let urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

// adding route
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

//adding route
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars); // passing url data to our template
});

// adding a second route and template

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:id", (req, res) => {
  const shortURL = req.params.id;
  const templateVars = {
    id: shortURL,
    longURL: urlDatabase[shortURL],
  };
  res.render("urls_show", templateVars);
});

/*
app.get("/urls/:id", (req, res) => {
  const id = req.params.id;
  const longURL = urlDatabase[id];
  const templateVars = { id: id, longURL: longURL };
  res.render("urls_show", templateVars);
});
*/

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

app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id];
  res.redirect(longURL);
});

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

app.post("/urls/:id", (req, res) => {
  // :id is a param - dynamic / changing depending on what's passed;

  urlDatabase[req.params.id] = req.body.longURL;

  res.redirect("/urls");
});

//Not getting the meat of it - reminder
