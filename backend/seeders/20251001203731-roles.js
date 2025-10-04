"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    /** Get all tenants. */
    let tenants = await queryInterface.sequelize.query(
      "SELECT id FROM tenants"
    );

    tenants = tenants[0];

    const roles = [];
    tenants.forEach((tenant) => {
      roles.push(
        {
          name: "admin",
          tenantId: tenant.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "normal",
          tenantId: tenant.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      );
    });

    await queryInterface.bulkInsert("roles", roles, {
      updateOnDuplicate: ["name", "tenantId", "createdAt", "updatedAt"],
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("roles", null, {});
  },
};
