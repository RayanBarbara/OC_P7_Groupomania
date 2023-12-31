module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [{
      firstName: 'The',
      lastName: 'Admin',
      email: 'admin@groupomania.com',
      password: '$2b$12$UUVZ0gsQLyjnrHmin0ArTeGGMxQmoWjxMYqkXO98z/KB2SZMbbM1i',
      isAdmin: true,
      lastVisitDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};