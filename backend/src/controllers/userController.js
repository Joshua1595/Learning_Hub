const pool = require("../config/db");

const getMyProfile = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, role, avatar_url, bio, created_at
       FROM profiles
       WHERE id = $1`,
      [req.user.id]
    );

    res.status(200).json({ user: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: "Could not fetch profile" });
  }
};

const updateMyProfile = async (req, res) => {
  try {
    const { name, bio, avatarUrl } = req.body;

    const result = await pool.query(
      `UPDATE profiles
       SET
         name = COALESCE($1, name),
         bio = COALESCE($2, bio),
         avatar_url = COALESCE($3, avatar_url),
         updated_at = NOW()
       WHERE id = $4
       RETURNING id, name, role, bio, avatar_url`,
      [name || null, bio || null, avatarUrl || null, req.user.id]
    );

    res.status(200).json({
      message: "Profile updated successfully",
      user: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({ message: "Could not update profile" });
  }
};

module.exports = { getMyProfile, updateMyProfile };