const pool = require("../config/db");

const getCategories = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM categories ORDER BY name ASC"
    );

    res.status(200).json({ categories: result.rows });
  } catch (error) {
    res.status(500).json({ message: "Could not fetch categories" });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const result = await pool.query(
      `INSERT INTO categories (name, description)
       VALUES ($1, $2)
       RETURNING *`,
      [name.trim(), description || null]
    );

    res.status(201).json({
      message: "Category created successfully",
      category: result.rows[0],
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(400).json({ message: "Category already exists" });
    }

    res.status(500).json({ message: "Could not create category" });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    const result = await pool.query(
      `UPDATE categories
       SET
         name = COALESCE($1, name),
         description = COALESCE($2, description)
       WHERE id = $3
       RETURNING *`,
      [name?.trim() || null, description || null, req.params.categoryId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({
      message: "Category updated successfully",
      category: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({ message: "Could not update category" });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM categories WHERE id = $1 RETURNING id",
      [req.params.categoryId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Could not delete category" });
  }
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};