const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("mo_hinh_chat", "root", null, {
  host: "localhost",
  dialect: "mysql",
});
const connection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};
module.exports = connection;
