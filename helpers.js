//LOOKUP HELPER FUNCTION

const getUserByEmail = (email, database) => {    // goes looks through users and returns the user
  for (let user in database) {
    // use in for objects
    if (database[user].email === email) {
      return database[user];
    }
  }
  return null;
};

module.exports = { getUserByEmail };