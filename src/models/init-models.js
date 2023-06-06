var DataTypes = require("sequelize").DataTypes;
var _documents = require("./documents");
var _permissions = require("./permissions");
var _settings = require("./settings");
var _users = require("./users");
var _aboutsubject=require("./aboutsubject")
var _subject=require('./subject');
var _course=require('./course')
function initModels(sequelize) {
  var documents = _documents(sequelize, DataTypes);
  var permissions = _permissions(sequelize, DataTypes);
  var settings = _settings(sequelize, DataTypes);
  var users = _users(sequelize, DataTypes);
var aboutsubject=_aboutsubject(sequelize,DataTypes)
var subject=_subject(sequelize,DataTypes)
var course=_course(sequelize,DataTypes)
  // permissions.belongsToMany(roles, { as: 'role_id_roles', through: role_has_permissions, foreignKey: "permission_id", otherKey: "role_id" });
  // roles.belongsToMany(permissions, { as: 'permission_id_permissions', through: role_has_permissions, foreignKey: "role_id", otherKey: "permission_id" });
  // model_has_permissions.belongsTo(permissions, { as: "permission", foreignKey: "permission_id"});
  // permissions.hasMany(model_has_permissions, { as: "model_has_permissions", foreignKey: "permission_id"});
  // role_has_permissions.belongsTo(permissions, { as: "permission", foreignKey: "permission_id"});
  // permissions.hasMany(role_has_permissions, { as: "role_has_permissions", foreignKey: "permission_id"});
  // model_has_roles.belongsTo(roles, { as: "role", foreignKey: "role_id"});
  // roles.hasMany(model_has_roles, { as: "model_has_roles", foreignKey: "role_id"});
  // role_has_permissions.belongsTo(roles, { as: "role", foreignKey: "role_id"});
  // roles.hasMany(role_has_permissions, { as: "role_has_permissions", foreignKey: "role_id"});

  return {
    documents,
    permissions,
    settings,
    users,
    aboutsubject,
    subject,
    course
    };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;