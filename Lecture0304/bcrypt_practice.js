const bcrypt = require("bcryptjs");

const password = "1234";

const salt = bcrypt.genSaltSync();
console.log("salt:      ", salt);
const hashedPassword = bcrypt.hashSync(password, salt);

console.log("password:  ", hashedPassword);

// form-info

const formPassword = "helloWorld";

const result = bcrypt.compareSync(formPassword, hashedPassword);

console.log(result);

// from this we now have a salt, and an extended password
// the first same part of the password is a salt - salt is the stirng that makes the string more efficient - based on the string I'm going to use my algorithm to scramble up your word, the first part of the salt is always included, the rest of it is your password. For the hacker, even though the salt is included it's different for every single password.

// because the salt changes the encryption of the password is still the same, the hacker will, there will be no tell based on that string, that's hashing in a nutshell, it uses a salt, the salt jumbles up your words and there's no way to ever check.

// if it's one way how

// whatever text you pass in folloed by the hash, behind the scenes the password will be hashed up and the two hashes will be checked, and if those match it gives truthy if not falsey

// in our database we have stored hash, then we use this new function called bcrypt compare sync

// from form we've gotten the password, e.g. the word password, be can now use bcrypt.compareSync() which takes the regular string and takes the hashed password we have stored behind the scenes, it takes a string and performs the hash on it, and transforms it into somethng that resembles

// I want you to rehash and compare it, it will use the salt to compare the salt,

// hash = hash? yes/no?

// For every password, we'll run passwords with bcrypt and replace server.js with giant hash
