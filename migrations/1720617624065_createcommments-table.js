/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createTable("comments", {
    id: { type: "VARCHAR(50)", primaryKey: true },
    user_id: {
      type: "varchar(50)",
      notNull: true,
      references: "users",
      onDelete: "cascade",
    },
    parent_id: {
      type: "varchar(50)",
      references: "comments",
      onDelete: "cascade",
      default: null,
    },
    thread_id: {
      type: "varchar(50)",
      notNull: true,
      references: "threads",
      onDelete: "cascade",
    },
    body: {
      type: "text",
      notNull: true,
    },
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },

    deleted_at: {
      type: "timestamp",
      default: null,
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable("comments");
};
