'use strict';
module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define('Like', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    UserId: {
      type: DataTypes.INTEGER
    },
    TweetId: {
      type: DataTypes.INTEGER
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: 'Like',
    tableName: 'Likes',
    underscored: true
  });
  Like.associate = function(models) {
    Like.belongsTo(models.User, { foreignKey: 'UserId' })
    Like.belongsTo(models.Tweet, { foreignKey: 'TweetId' })
  };
  return Like;
};