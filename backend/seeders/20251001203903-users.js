"use strict";

/** @type {import('sequelize-cli').Migration} */
/* seeders/YYYYMMDD-demo-users.js */
const bcrypt = require("bcryptjs");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /** Get all tenants. */
    let tenants = await queryInterface.sequelize.query(
      "SELECT id, subdomain FROM tenants"
    );

    /** Get admin & normal roles. */
    const roles = await queryInterface.sequelize.query(
      "SELECT id FROM roles WHERE name IN ('admin', 'normal')"
    );

    // roles information loaded for seeding

    tenants = tenants[0];
    const [adminRole, normalRole] = roles[0];

    const users = [];

    for (const tenant of tenants) {
      users.push(
        {
          email: `admin_tenant@${tenant.subdomain}.com`,
          password: await bcrypt.hash("password123", 10),
          firstName: "Admin",
          lastName: `Tenant ${tenant.id}`,
          roleId: adminRole?.id || 1,
          tenantId: tenant.id,
          status: "active",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        ...(await Promise.all(
          Array(4)
            .fill()
            .map(async (_, i) => ({
              email: `user${i + 1}_tenant@${tenant.subdomain}.com`,
              password: await bcrypt.hash("password123", 10),
              firstName: `User ${i + 1}`,
              lastName: `Tenant ${tenant.id}`,
              roleId: normalRole?.id || 2,
              tenantId: tenant.id,
              status: "active",
              createdAt: new Date(),
              updatedAt: new Date(),
            }))
        ))
      );
    }

    await queryInterface.bulkInsert("users", users, {
      updateOnDuplicate: [
        "email",
        "password",
        "firstName",
        "lastName",
        "roleId",
        "tenantId",
        "status",
        "createdAt",
        "updatedAt",
      ],
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("users", null, {});
  },
};
