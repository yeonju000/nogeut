'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Promises 테이블에서 roomNum 컬럼을 NULL 허용으로 변경
    await queryInterface.changeColumn('Promises', 'roomNum', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    // StudentProfiles 테이블에 account 컬럼 추가
    await queryInterface.addColumn('StudentProfiles', 'account', {
      type: Sequelize.STRING(50),
      allowNull: false,
    });

    // StudentProfiles 테이블에서 scoreCount 컬럼 추가
    await queryInterface.addColumn('StudentProfiles', 'scoreCount', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    // SeniorProfiles 테이블에서 scoreCount 컬럼 추가
    await queryInterface.addColumn('SeniorProfiles', 'scoreCount', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Promises 테이블에서 roomNum 컬럼을 NULL 불가로 변경 (원상복구)
    await queryInterface.changeColumn('Promises', 'roomNum', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });

    // StudentProfiles 테이블에서 account 컬럼 삭제
    await queryInterface.removeColumn('StudentProfiles', 'account');

    // StudentProfiles 테이블에서 scoreCount 컬럼 삭제
    await queryInterface.removeColumn('StudentProfiles', 'scoreCount');

    // SeniorProfiles 테이블에서 scoreCount 컬럼 삭제
    await queryInterface.removeColumn('SeniorProfiles', 'scoreCount');
  }
};
