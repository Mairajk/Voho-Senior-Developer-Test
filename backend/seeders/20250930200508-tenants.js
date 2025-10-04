"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "tenants",
      [
        {
          name: "Acme Corp",
          logo: "https://example.com/acme-logo.png",
          primaryColor: "#3498db",
          subdomain: "acme",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Beta Solutions",
          logo: "https://example.com/beta-logo.png",
          primaryColor: "#e74c3c",
          subdomain: "beta",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {
        updateOnDuplicate: [
          "name",
          "logo",
          "primaryColor",
          "subdomain",
          "createdAt",
          "updatedAt",
        ],
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("tenants", null, {
      updateOnDuplicate: [
        "name",
        "logo",
        "primaryColor",
        "subdomain",
        "createdAt",
        "updatedAt",
      ],
    });
  },
};
