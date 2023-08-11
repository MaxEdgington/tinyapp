# ---------------- AGENDA ---------------

Security :)

- hashing passwords
- bcryptJS (bcrypt)
- middleware (bonus)
- encrypted cookies (cookie-session)
- HTTPS
- REST

### Passwords

plain text passwords should not be stored, because they can be used maliciously

NEVER STORE PASSWORDS AS STRINGS (OR TEXT)

### Hashing

plain-text-string -------------> algo ---> SALT -------> 2308fujs0jf23j40928ujr08wsu43

hashing is one way ------>

To dehash a password, a hacker must try out different passwords until the hash matches the other hash.

```js
const plaintextPass = "secret";

// // time, and making info worth it?
const salt = bcrypt.genSaltSync(10);
console.log(salt);

// // what is a salt?
const hash = bcrypt.hashSync(plaintextPass, salt);
console.log(hash);
```

#### to check plain text with encrypted

```js
const result = bcrypt.compareSync("test", hash);

console.log(result); // true or false?
```

### Encryption

text -----------------------> ENCRYPT ALGO --------> 952jopisfjsrj2rfs90825vik04
952jopisfjsrj2rfs90825vik04 ->ENCRYPT ALGO --------> text

Client(Firefox/Chrome/Safari)

--------LOGIN --------------------------->
<-------GREAT YOU ARE LOGGED IN----------
cookie: 2394psiodkf345kpkfspktp34k5
---------------NEW REQ --------------->
cookie on server: {user_id: 4}

cookie=session package

- how do we make this work
- install cookie session, copy code, go to terminal, restart server, install it, turn server back on
- we're now giong to declare it in server.js

const cookieSession = require('cookie-session');

Step 1 complete

Step 2

We need to use it as middleware

middleware is after the app

app.use(cookieSession({
name: 'banana',
keys: ['one', 'two', 'three', 'four']
}))

// inside is a name and some keys, (one two three four)

// the next part may mess things up

// look into req.session section
we now need to store encrypted cookie on system

for now, we'll switch back to app.get('/') etc and inside store a session

app.get('/', (req,res) => {

req.session.random = 'bacon'; ///////////Here
const user_id = req.cookies.user_id; // 1

    console.log('req.cookies: ',req.cookies);

console.log('req.session: ', req.session);

    // req.session -> random = bacon
    // banana specified at very top is what user sees
    // behind the scenes is what we really store

const templateVars = {user: undefined}
if (user_id) {
templateVars.user = users[user_id];
}
return res.render('home', templateVars);
})

// in server,
switch out

// return res.send("We should log you in :)");
// res.redirect(`${key}/home`);
// res.cookie('user_id', key);

        for
        req.session.user_id = key;
        wherever we're using cookie, we need to change it to session instead

        // how are we going to do that

        // scroll up to


        app.get('/', (req,res) => {

const user_id = req.cookies.user_id; // 1
console.log('req.cookies: ',req.cookies);
console.log('req.session: ', req.session);
const templateVars = {user: undefined}
if (user_id) {
templateVars.user = users[user_id];
}
return res.render('home', templateVars);
})

// we're going to go up to the word cookies and change it for

const user_id = req.session.user_id; // 1

// once saved, we're now back to logged in, the rest of it, even it says Banana, it doesn't matter, login functionality is fixed

// Encrypted Cookies
???

### Encryption

text -----------------------> ENCRYPT ALGO --------> 952jopisfjsrj2rfs90825vik04
952jopisfjsrj2rfs90825vik04 ->ENCRYPT ALGO --------> text

Client(Firefox/Chrome/Safari)

--------LOGIN --------------------------->
<-------GREAT YOU ARE LOGGED IN----------
cookie: 2394psiodkf345kpkfspktp34k5
---------------NEW REQ --------------->
cookie on server: {user_id: 4}

// HTTPS

Kind of like encrytion for your browser

### HTTPS

Computer Server
-------------------------------REQ-------------------------------->
<--------were incrypting this HTML---- decrypt it with this code --
SSL Certificate

<------------------------------RES---------------------------------

none of this we have to do / it's done behind the scenes - it's very very important that you understand it?

is SSL needed to host a website, biggest thing is google says your site isnt safe

The problem lies when you go with a public network, say you're in an airport / starbucks / timhortons / etc.

Computer ---------------------------REQ------------------------>
<-----------------------------------RES-------------------------
|
|
|
--------Look at response
HACKER

                // you're connected to a router, hacker takes router out, hacker makes fake router and calls it the same thing (Starbucks wifi v2) for everyone else it doesn't matter, now whatever response is being sent in, the rrouter / wifi is giving all information to hacker

                // the biggest protection you can do is
                // browser may ask accept SSL certficate
                    // warning / danger -> yes now
                    // as soon as you see warning accept SSL cert chrome
                    // if you see window in a public domain, do yourself a favour and click no - even if a website is SSL certificate protected, if the hacker messes up the wifi,
                    // disconnect, protect your privacy, all you do to set up a certificate is throw money



        If you ever want to learn about cyber security, there's a Kali Linux
        Overthewire - wargames

Tomorrows test is callbacks, objects and arrays and math
