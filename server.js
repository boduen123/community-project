// ==========================
// 🧩 SISITEMU Y'UMUDUGUDU BACKEND (SECURED)
// ==========================
import bcrypt from "bcryptjs";
import express from "express";
import mysql from "mysql2";
import cors from "cors";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";

const app = express();
app.use(cors());
app.use(bodyParser.json());

const JWT_SECRET = "super_secret_token_key";

// ==========================
// ⚙️ KWIFATANYA NA DATABASE
// ==========================
const db = mysql.createConnection({
  host: "sql203.infinityfree.com",
  user: "if0_40688509",
  password: "helloPSWD",
  database: "if0_40688509_sisitemu_y_umudugudu"
});

db.connect((err) => {
  if (err) {
    console.error("❌ Byanze kwihuza na database:", err);
  } else {
    console.log("✅ Twahuye na database neza!");
  }
});

// ==========================
// 🔓 PUBLIC ROUTES (REGISTER / LOGIN)
// ==========================

// 📝 Register
app.post("/register", async (req, res) => {
  const { national_id, fullname, email, telefone, password, role } = req.body;

  if (!national_id || !fullname || !email || !telefone || !password || !role) {
    return res.status(400).json({ error: "Uzuza ibisabwa byose" });
  }

  if (!/^\d{16}$/.test(national_id)) {
    return res.status(400).json({ error: "Indangamuntu igomba kuba imibare 16" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const sql = `
    INSERT INTO users (national_id, fullname, email, telefone, password, role)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [national_id, fullname, email, telefone, hashedPassword, role], (err, result) => {
    if (err) return res.status(500).json({ error: "Ikosa mu kubika umuyobozi", details: err });
    res.json({ message: "✅ Umuyobozi yanditswe neza!" });
  });
});

// 🔑 Login
app.post("/login", (req, res) => {
  const { national_id, password } = req.body;

  if (!national_id || !password) {
    return res.status(400).json({ error: "Shyiramo indangamuntu na password" });
  }

  db.query("SELECT * FROM users WHERE national_id = ?", [national_id], async (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0) return res.status(404).json({ error: "Umuyobozi ntabonetse" });

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) return res.status(401).json({ error: "Password siyo" });

    // Use user.user_id because that is the primary key in your DB schema
    const token = jwt.sign({ id: user.user_id, role: user.role }, JWT_SECRET, { expiresIn: "24h" });
    res.json({ message: "✅ Kwinjira byagenze neza", token, role: user.role });
  });
});

// ==========================
// 🛡️ AUTH MIDDLEWARE
// ==========================
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"]; // "Bearer TOKEN"
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Nta token, banza winjire (Login)" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Token siyo cyangwa yarangije igihe" });
    req.user = user; // { id, role }
    next();
  });
};

// Apply middleware to ALL following routes
app.use(authenticateToken);

// 🔒 Example protected route
app.get("/profile", (req, res) => {
  res.json({ message: "Protected data", user_id: req.user.id, role: req.user.role });
});

// ===== MESSAGE ENDPOINTS =====

// Create a message for the currently logged-in user
// POST /message
app.post("/message", (req, res) => {
  const { text_user } = req.body;
  const userId = req.user?.id; // user_id from auth

  if (!text_user) {
    return res.status(400).json({ error: "text_user is required" });
  }
  if (!userId) {
    return res.status(401).json({ error: "User not authenticated" });
  }

  const sql = "INSERT INTO message (text_user, user_id) VALUES (?, ?)";
  const values = [text_user, userId];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("DB insert error (message):", err);
      return res.status(500).json({ error: "Database error" });
    }
    return res.json({
      message: "Message yoherejwe neza",
      id: result.insertId,
    });
  });
});

// Get messages only for the currently logged-in user
// GET /message
app.get("/message", (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: "User not authenticated" });
  }

  const sql =
    "SELECT id, text_user, user_id FROM message WHERE user_id = ? ORDER BY id DESC";

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("DB select error (message):", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});


////////// EFP TABLE  IMISANZU


/* ================= UMUSANZU FPR ================= */

/* ================= UMUSANZU FPR ================= */
////////// EFP TABLE IMISANZU

/* ================= UMUSANZU FPR ================= */

// CREATE
app.post("/umusanzu-fpr", (req, res) => {
  const { umuturage, amafaranga, itariki } = req.body;
  const user_id = req.user.id;

  const sql = "INSERT INTO umusanzu_fpr (umuturage, amafaranga, itariki, user_id) VALUES (?, ?, ?, ?)";
  db.query(sql, [umuturage, amafaranga, itariki, user_id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json({ message: "Saved", id: result.insertId });
  });
});

// READ ALL (Filtered by user)
app.get("/umusanzu-fpr", (req, res) => {
  const sql = "SELECT * FROM umusanzu_fpr WHERE user_id = ? ORDER BY id DESC";
  db.query(sql, [req.user.id], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(rows);
  });
});

// UPDATE
app.put("/umusanzu-fpr/:id", (req, res) => {
  const { umuturage, amafaranga, itariki } = req.body;
  const sql = "UPDATE umusanzu_fpr SET umuturage=?, amafaranga=?, itariki=? WHERE id=? AND user_id=?";
  db.query(sql, [umuturage, amafaranga, itariki, req.params.id, req.user.id], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (result.affectedRows === 0) return res.status(403).json({ message: "Not allowed" });
    res.json({ message: "Updated" });
  });
});

// DELETE
app.delete("/umusanzu-fpr/:id", (req, res) => {
  const sql = "DELETE FROM umusanzu_fpr WHERE id=? AND user_id=?";
  db.query(sql, [req.params.id, req.user.id], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (result.affectedRows === 0) return res.status(403).json({ message: "Not allowed" });
    res.json({ message: "Deleted" });
  });
});


/* ================= UMUSANZU EJOHEZA ================= */

// CREATE
app.post("/umusanzu-ejoheza", (req, res) => {
  const { umuturage, amafaranga, itariki } = req.body;
  const user_id = req.user.id;

  const sql = "INSERT INTO umusanzu_ejoheza (umuturage, amafaranga, itariki, user_id) VALUES (?, ?, ?, ?)";
  db.query(sql, [umuturage, amafaranga, itariki, user_id], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json({ message: "Saved", id: result.insertId });
  });
});

// READ ALL
app.get("/umusanzu-ejoheza", (req, res) => {
  const sql = "SELECT * FROM umusanzu_ejoheza WHERE user_id = ? ORDER BY id DESC";
  db.query(sql, [req.user.id], (err, rows) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(rows);
  });
});

// UPDATE
app.put("/umusanzu-ejoheza/:id", (req, res) => {
  const { umuturage, amafaranga, itariki } = req.body;
  const sql = "UPDATE umusanzu_ejoheza SET umuturage=?, amafaranga=?, itariki=? WHERE id=? AND user_id=?";
  db.query(sql, [umuturage, amafaranga, itariki, req.params.id, req.user.id], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (result.affectedRows === 0) return res.status(403).json({ message: "Not allowed" });
    res.json({ message: "Updated" });
  });
});

// DELETE
app.delete("/umusanzu-ejoheza/:id", (req, res) => {
  const sql = "DELETE FROM umusanzu_ejoheza WHERE id=? AND user_id=?";
  db.query(sql, [req.params.id, req.user.id], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (result.affectedRows === 0) return res.status(403).json({ message: "Not allowed" });
    res.json({ message: "Deleted" });
  });
});

// ===== INKUNGA LETA ENDPOINTS =====

// Create a new inkunga for current user
// POST /inkunga_leta
app.post("/inkunga_leta", (req, res) => {
  const { umuturage, ubwoko, amount, itariki } = req.body;
  const userId = req.user?.id;

  if (!umuturage || !ubwoko || !amount || !itariki) {
    return res
      .status(400)
      .json({ error: "Injiza umuturage, ubwoko, amafaranga na itariki." });
  }
  if (!userId) {
    return res.status(401).json({ error: "User not authenticated" });
  }

  const sql =
    "INSERT INTO inkunga_leta (umuturage, ubwoko, amount, itariki, user_id) VALUES (?, ?, ?, ?, ?)";
  const values = [umuturage, ubwoko, amount, itariki, userId];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("DB insert error (inkunga_leta):", err);
      return res.status(500).json({ error: "Database error" });
    }
    return res.json({
      message: "Inkunga yanditswe neza",
      id: result.insertId,
    });
  });
});

// Get all inkunga for current user
// GET /inkunga_leta
app.get("/inkunga_leta", (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: "User not authenticated" });
  }

  const sql =
    "SELECT id, umuturage, ubwoko, amount, itariki, user_id FROM inkunga_leta WHERE user_id = ? ORDER BY itariki DESC, id DESC";

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("DB select error (inkunga_leta):", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});

// OPTIONAL: Update
app.put("/inkunga_leta/:id", (req, res) => {
  const { id } = req.params;
  const { umuturage, ubwoko, amount, itariki } = req.body;
  const userId = req.user?.id;

  if (!umuturage || !ubwoko || !amount || !itariki) {
    return res
      .status(400)
      .json({ error: "Injiza umuturage, ubwoko, amafaranga na itariki." });
  }
  if (!userId) {
    return res.status(401).json({ error: "User not authenticated" });
  }

  const sql =
    "UPDATE inkunga_leta SET umuturage = ?, ubwoko = ?, amount = ?, itariki = ? WHERE id = ? AND user_id = ?";

  db.query(
    sql,
    [umuturage, ubwoko, amount, itariki, id, userId],
    (err, result) => {
      if (err) {
        console.error("DB update error (inkunga_leta):", err);
        return res.status(500).json({ error: "Database error" });
      }
      if (result.affectedRows === 0) {
        return res
          .status(403)
          .json({ error: "Ntibyemewe guhindura iyi nkunga cyangwa ntibonetse" });
      }
      res.json({ message: "✏️ Amakuru y'inkunga yavuguruwe neza!" });
    }
  );
});

// OPTIONAL: Delete
app.delete("/inkunga_leta/:id", (req, res) => {
  const { id } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: "User not authenticated" });
  }

  db.query(
    "DELETE FROM inkunga_leta WHERE id = ? AND user_id = ?",
    [id, userId],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      if (result.affectedRows === 0) {
        return res
          .status(403)
          .json({ error: "Ntibyemewe gusiba iyi nkunga cyangwa ntibaho" });
      }
      res.json({ message: "🗑️ Inkunga yasibwe neza!" });
    }
  );
});
// ============================================================
// 🧍‍♂️ ABATURAGE ENDPOINTS (SECURED)
// ============================================================

app.post("/abaturage", (req, res) => {
  const d = req.body;
  // Automatically insert req.user.id
  const sql = `
    INSERT INTO abaturage 
    (izina_ribanza, izina_risoza, igitsina, itariki_y_amavuko, indangamuntu, telefone, icyiciro_cy_ubudehe, user_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(sql, [d.izina_ribanza, d.izina_risoza, d.igitsina, d.itariki_y_amavuko, d.indangamuntu, d.telefone, d.icyiciro_cy_ubudehe, req.user.id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "✅ Umuturage yanditswe neza!", id: result.insertId });
    });
});

app.get("/abaturage", (req, res) => {
  // Filter by user_id
  db.query("SELECT * FROM abaturage WHERE user_id = ?", [req.user.id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

app.get("/abaturage/:id", (req, res) => {
  const { id } = req.params;
  // Filter by id AND user_id
  db.query("SELECT * FROM abaturage WHERE umuturage_id = ? AND user_id = ?", [id, req.user.id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json(result[0]);
  });
});

app.put("/abaturage/:id", (req, res) => {
  const { id } = req.params;
  const d = req.body;
  // Update only if it belongs to user_id
  const sql = `
    UPDATE abaturage SET 
    izina_ribanza=?, izina_risoza=?, igitsina=?, itariki_y_amavuko=?, indangamuntu=?, telefone=?, icyiciro_cy_ubudehe=?
    WHERE umuturage_id=? AND user_id=?
  `;
  db.query(sql, [d.izina_ribanza, d.izina_risoza, d.igitsina, d.itariki_y_amavuko, d.indangamuntu, d.telefone, d.icyiciro_cy_ubudehe, id, req.user.id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      if (result.affectedRows === 0) return res.status(403).json({ error: "Ntibyemewe guhindura uyu muturage" });
      res.json({ message: "✏️ Amakuru y'umuturage yavuguruwe neza!" });
    });
});

app.delete("/abaturage/:id", (req, res) => {
  const { id } = req.params;
  // Delete only if it belongs to user_id
  db.query("DELETE FROM abaturage WHERE umuturage_id = ? AND user_id = ?", [id, req.user.id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.affectedRows === 0) return res.status(403).json({ error: "Ntibyemewe gusiba uyu muturage" });
    res.json({ message: "🗑️ Umuturage yasibwe neza!" });
  });
});

// ============================================================
// 👨‍👩‍👧‍👦 INGO ENDPOINTS (SECURED)
// ============================================================

app.post("/ingo", (req, res) => {
  const d = req.body;
  const sql = `
    INSERT INTO ingo 
    (umukuru_w_urugo, umubare_w_abagize, aho_batuye, ubwoko_bw_inzu, bafite_amazi, bafite_umuyoboro_wamashanyarazi, icyiciro_cy_ubudehe, umudugudu, akagari, umurenge, akarere, user_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(sql, [d.umukuru_w_urugo, d.umubare_w_abagize, d.aho_batuye, d.ubwoko_bw_inzu, d.fafite_amazi, d.fafite_umuyoboro_wamashanyarazi,
    d.icyiciro_cy_ubudehe, d.umudugudu, d.akagari, d.umurenge, d.akarere, req.user.id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "🏠 Urugo rwanditswe neza!", id: result.insertId });
    });
});

app.get("/ingo", (req, res) => {
  db.query("SELECT * FROM ingo WHERE user_id = ?", [req.user.id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

app.get("/ingo/:id", (req, res) => {
  db.query("SELECT * FROM ingo WHERE urugo_id=? AND user_id=?", [req.params.id, req.user.id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json(result[0]);
  });
});

app.put("/ingo/:id", (req, res) => {
  const { id } = req.params;
  const d = req.body;
  const sql = `
    UPDATE ingo SET 
    umukuru_w_urugo=?, umubare_w_abagize=?, aho_batuye=?, ubwoko_bw_inzu=?, bafite_amazi=?, bafite_umuyoboro_wamashanyarazi=?, icyiciro_cy_ubudehe=?, umudugudu=?, akagari=?, umurenge=?, akarere=? 
    WHERE urugo_id=? AND user_id=?`;
  db.query(sql, [d.umukuru_w_urugo, d.umubare_w_abagize, d.aho_batuye, d.ubwoko_bw_inzu, d.fafite_amazi, d.fafite_umuyoboro_wamashanyarazi,
    d.icyiciro_cy_ubudehe, d.umudugudu, d.akagari, d.umurenge, d.akarere, id, req.user.id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      if (result.affectedRows === 0) return res.status(403).json({ error: "Ntibyemewe" });
      res.json({ message: "✏️ Urugo ruvuguruwe neza!" });
    });
});

app.delete("/ingo/:id", (req, res) => {
  db.query("DELETE FROM ingo WHERE urugo_id=? AND user_id=?", [req.params.id, req.user.id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.affectedRows === 0) return res.status(403).json({ error: "Ntibyemewe" });
    res.json({ message: "🗑️ Urugo rwasibwe neza!" });
  });
});

// ============================================================
// 🧑‍💼 ABAYOBOZI ENDPOINTS (SECURED)
// ============================================================

app.post("/abayobozi", (req, res) => {
  const d = req.body;
  const sql = `
    INSERT INTO abayobozi 
    (amazina_yose, telefone, inshingano, umudugudu, itariki_yatangiye, itariki_yarangije, user_id)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(sql, [d.amazina_yose, d.telefone, d.inshingano, d.umudugudu, d.itariki_yatangiye, d.itariki_yarangije, req.user.id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "👔 Umuyobozi yanditswe neza!", id: result.insertId });
    });
});

app.get("/abayobozi", (req, res) => {
  db.query("SELECT * FROM abayobozi WHERE user_id = ?", [req.user.id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

app.get("/abayobozi/:id", (req, res) => {
  db.query("SELECT * FROM abayobozi WHERE umuyobozi_id=? AND user_id=?", [req.params.id, req.user.id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json(result[0]);
  });
});

app.put("/abayobozi/:id", (req, res) => {
  const { id } = req.params;
  const d = req.body;
  const sql = `
    UPDATE abayobozi SET 
    amazina_yose=?, telefone=?, inshingano=?, umudugudu=?, itariki_yatangiye=?, itariki_yarangije=?
    WHERE umuyobozi_id=? AND user_id=?
  `;
  db.query(sql, [d.amazina_yose, d.telefone, d.inshingano, d.umudugudu, d.itariki_yatangiye, d.itariki_yarangije, id, req.user.id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      if (result.affectedRows === 0) return res.status(403).json({ message: "Ntiwemerewe" });
      res.json({ message: "✏️ Umuyobozi yavuguruwe neza!" });
    });
});

app.delete("/abayobozi/:id", (req, res) => {
  db.query("DELETE FROM abayobozi WHERE umuyobozi_id=? AND user_id=?", [req.params.id, req.user.id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.affectedRows === 0) return res.status(403).json({ message: "Ntiwemerewe" });
    res.json({ message: "🗑️ Umuyobozi yasibwe neza!" });
  });
});

// ============================================================
// 📊 RAPORO ENDPOINTS (SECURED)
// ============================================================

app.post("/raporo", (req, res) => {
  const {
    umutwe_wa_raporo,
    ibisobanuro,
    itariki_ya_raporo,
    umubare_w_abaturage,
    umubare_w_ingo,
    abanyantege_nke,
    yakozwe_na,
  } = req.body;

  const sql = `
    INSERT INTO raporo 
      (umutwe_wa_raporo, ibisobanuro, itariki_ya_raporo, 
       umubare_w_abaturage, umubare_w_ingo, abanyantege_nke, yakozwe_na, user_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      umutwe_wa_raporo,
      ibisobanuro,
      itariki_ya_raporo,
      umubare_w_abaturage,
      umubare_w_ingo,
      abanyantege_nke,
      yakozwe_na,
      req.user.id,
    ],
    (err, result) => {
      if (err) {
        console.error("❌ Ntibyanditse:", err);
        return res.status(500).json({ error: "Raporo ntibashije kwandikwa" });
      }
      res.json({ message: "✅ Raporo yashyizwemo neza!", id: result.insertId });
    }
  );
});

app.get("/raporo", (req, res) => {
  const sql = "SELECT * FROM raporo WHERE user_id=? ORDER BY itariki_ya_raporo DESC";
  db.query(sql, [req.user.id], (err, results) => {
    if (err) {
      console.error("❌ Raporo ntizabonetse:", err);
      return res.status(500).json({ error: "Ntibyashobotse kubona raporo" });
    }
    res.json(results);
  });
});

app.get("/raporo/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM raporo WHERE raporo_id = ? AND user_id=?";
  db.query(sql, [id, req.user.id], (err, result) => {
    if (err) {
      console.error("❌ Raporo ntibonetse:", err);
      return res.status(500).json({ error: "Ntibyashobotse kubona raporo imwe" });
    }
    res.json(result[0]);
  });
});

app.put("/raporo/:id", (req, res) => {
  const { id } = req.params;
  const {
    umutwe_wa_raporo,
    ibisobanuro,
    itariki_ya_raporo,
    umubare_w_abaturage,
    umubare_w_ingo,
    abanyantege_nke,
    yakozwe_na,
  } = req.body;

  const sql = `
    UPDATE raporo SET 
      umutwe_wa_raporo=?, ibisobanuro=?, itariki_ya_raporo=?, 
      umubare_w_abaturage=?, umubare_w_ingo=?, abanyantege_nke=?, yakozwe_na=?
    WHERE raporo_id = ? AND user_id=?
  `;

  db.query(
    sql,
    [
      umutwe_wa_raporo,
      ibisobanuro,
      itariki_ya_raporo,
      umubare_w_abaturage,
      umubare_w_ingo,
      abanyantege_nke,
      yakozwe_na,
      id,
      req.user.id,
    ],
    (err, result) => {
      if (err) {
        console.error("❌ Ntibyavuguruwe:", err);
        return res.status(500).json({ error: "Ntibyashobotse kuvugurura raporo" });
      }
      if (result.affectedRows === 0) return res.status(403).json({ message: "Ntiwemerewe" });
      res.json({ message: "✏️ Raporo yavuguruwe neza!" });
    }
  );
});

app.delete("/raporo/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM raporo WHERE raporo_id = ? AND user_id=?";
  db.query(sql, [id, req.user.id], (err, result) => {
    if (err) {
      console.error("❌ Ntibyasibwe:", err);
      return res.status(500).json({ error: "Ntibyashobotse gusiba raporo" });
    }
    if (result.affectedRows === 0) return res.status(403).json({ message: "Ntiwemerewe" });
    res.json({ message: "🗑️ Raporo yasibwe neza!" });
  });
});

// ============================================================
// 🧑‍💼 IMIBEREHO MYIZA CRUD (SECURED)
// ============================================================

app.post("/imibereho", (req, res) => {
  const {
    muturage_id,
    gahunda_yafashwemo,
    ibisobanuro,
    itariki_yatangiranye,
    imiterere_yayo,
    amazina_y_umuturage,
  } = req.body;

  const sql = `
    INSERT INTO imibereho_myiza
      (umuturage_id, gahunda_yafashwemo, ibisobanuro, itariki_yatangiranye, imiterere_yayo, amazina_y_umuturage, user_id)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      muturage_id,
      gahunda_yafashwemo,
      ibisobanuro,
      itariki_yatangiranye,
      imiterere_yayo,
      amazina_y_umuturage,
      req.user.id,
    ],
    (err, result) => {
      if (err) throw err;
      res.json({ message: "Byakigiyemo neza!", data: result });
    }
  );
});

app.get("/imibereho", (req, res) => {
  db.query("SELECT * FROM imibereho_myiza WHERE user_id=?", [req.user.id], (err, rows) => {
    if (err) throw err;
    res.json(rows);
  });
});

app.get("/imibereho/:id", (req, res) => {
  const sql = "SELECT * FROM imibereho_myiza WHERE imibereho_id = ? AND user_id=?";
  db.query(sql, [req.params.id, req.user.id], (err, row) => {
    if (err) throw err;
    res.json(row[0]);
  });
});

app.put("/imibereho/:id", (req, res) => {
  const {
    muturage_id,
    gahunda_yafashwemo,
    ibisobanuro,
    itariki_yatangiranye,
    imiterere_yayo,
    amazina_y_umuturage,
  } = req.body;

  const sql = `
    UPDATE imibereho_myiza SET
      muturage_id = ?, 
      gahunda_yafashwemo = ?, 
      ibisobanuro = ?, 
      itariki_yatangiranye = ?, 
      imiterere_yayo = ?,
      amazina_y_umuturage = ?
    WHERE imibereho_id = ? AND user_id=?
  `;

  db.query(
    sql,
    [
      muturage_id,
      gahunda_yafashwemo,
      ibisobanuro,
      itariki_yatangiranye,
      imiterere_yayo,
      amazina_y_umuturage,
      req.params.id,
      req.user.id,
    ],
    (err, result) => {
      if (err) throw err;
      if (result.affectedRows === 0) return res.status(403).json({ message: "Ntiwemerewe" });
      res.json({ message: "Havuguruwe neza!", data: result });
    }
  );
});

app.delete("/imibereho/:id", (req, res) => {
  const sql = "DELETE FROM imibereho_myiza WHERE imibereho_id = ? AND user_id=?";
  db.query(sql, [req.params.id, req.user.id], (err, result) => {
    if (err) throw err;
    if (result.affectedRows === 0) return res.status(403).json({ message: "Ntiwemerewe" });
    res.json({ message: "Byasibwe!", data: result });
  });
});

// ============================================================
// 🧩 ISIBO (FULL CRUD with user_id)
// ============================================================

app.post("/isibo", (req, res) => {
  const d = req.body;
  const sql = `
    INSERT INTO isibo 
      (izina_ry_isibo, umuyobozi_w_isibo, umubare_w_abaturage, umudugudu, user_id)
    VALUES (?, ?, ?, ?, ?)
  `;
  db.query(
    sql,
    [d.izina_ry_isibo, d.umuyobozi_w_isibo, d.umubare_w_abaturage, d.umudugudu, req.user.id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "✅ Isibo yanditswe neza!", id: result.insertId });
    }
  );
});

app.get("/isibo", (req, res) => {
  db.query("SELECT * FROM isibo WHERE user_id=?", [req.user.id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

app.get("/isibo/:id", (req, res) => {
  db.query(
    "SELECT * FROM isibo WHERE isibo_id = ? AND user_id=?",
    [req.params.id, req.user.id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json(result[0]);
    }
  );
});

app.put("/isibo/:id", (req, res) => {
  const d = req.body;
  const sql = `
    UPDATE isibo SET 
      izina_ry_isibo = ?, 
      umuyobozi_w_isibo = ?, 
      umubare_w_abaturage = ?, 
      umudugudu = ?
    WHERE isibo_id = ? AND user_id=?
  `;
  db.query(
    sql,
    [d.izina_ry_isibo, d.umuyobozi_w_isibo, d.umubare_w_abaturage, d.umudugudu, req.params.id, req.user.id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      if (result.affectedRows === 0) return res.status(403).json({ message: "Ntiwemerewe" });
      res.json({ message: "✏️ Isibo yavuguruwe neza!" });
    }
  );
});

app.delete("/isibo/:id", (req, res) => {
  db.query(
    "DELETE FROM isibo WHERE isibo_id = ? AND user_id=?",
    [req.params.id, req.user.id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      if (result.affectedRows === 0) return res.status(403).json({ message: "Ntiwemerewe" });
      res.json({ message: "🗑️ Isibo yasibwe neza!" });
    }
  );
});

// ============================================================
// 💼 UBUKUNGU (FULL CRUD with user_id)
// ============================================================

app.post("/ubukungu", (req, res) => {
  const {
    muturage_id,
    umurimo,
    aho_akorera,
    inkomoko_y_amafaranga,
    afite_ubutaka,
    afite_amatungo,
    afite_konti_yo_kuzigama,
    amazina_y_umuturage,
  } = req.body;

  const sql = `
    INSERT INTO ubukungu
      (umuturage_id, umurimo, aho_akorera, inkomoko_y_amafaranga, afite_ubutaka, 
       afite_amatungo, afite_konti_yo_kuzigama, amazina_y_umuturage, user_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      muturage_id,
      umurimo,
      aho_akorera,
      inkomoko_y_amafaranga,
      afite_ubutaka,
      afite_amatungo,
      afite_konti_yo_kuzigama,
      amazina_y_umuturage,
      req.user.id,
    ],
    (err, result) => {
      if (err) throw err;
      res.json({ message: "Byakigiyemo neza!", data: result });
    }
  );
});

app.get("/ubukungu", (req, res) => {
  db.query("SELECT * FROM ubukungu WHERE user_id=?", [req.user.id], (err, rows) => {
    if (err) throw err;
    res.json(rows);
  });
});

app.get("/ubukungu/:id", (req, res) => {
  const sql = "SELECT * FROM ubukungu WHERE ubukungu_id = ? AND user_id=?";
  db.query(sql, [req.params.id, req.user.id], (err, row) => {
    if (err) throw err;
    res.json(row[0]);
  });
});

app.put("/ubukungu/:id", (req, res) => {
  const {
    muturage_id,
    umurimo,
    aho_akorera,
    inkomoko_y_amafaranga,
    afite_ubutaka,
    afite_amatungo,
    afite_konti_yo_kuzigama,
    amazina_y_umuturage,
  } = req.body;

  const sql = `
    UPDATE ubukungu SET
      muturage_id = ?,
      umurimo = ?,
      aho_akorera = ?,
      inkomoko_y_amafaranga = ?,
      afite_ubutaka = ?,
      afite_amatungo = ?,
      afite_konti_yo_kuzigama = ?,
      amazina_y_umuturage = ?
    WHERE ubukungu_id = ? AND user_id=?
  `;

  db.query(
    sql,
    [
      muturage_id,
      umurimo,
      aho_akorera,
      inkomoko_y_amafaranga,
      afite_ubutaka,
      afite_amatungo,
      afite_konti_yo_kuzigama,
      amazina_y_umuturage,
      req.params.id,
      req.user.id,
    ],
    (err, result) => {
      if (err) throw err;
      if (result.affectedRows === 0) return res.status(403).json({ message: "Ntiwemerewe" });
      res.json({ message: "Havuguruwe neza!", data: result });
    }
  );
});

app.delete("/ubukungu/:id", (req, res) => {
  const sql = "DELETE FROM ubukungu WHERE ubukungu_id = ? AND user_id=?";
  db.query(sql, [req.params.id, req.user.id], (err, result) => {
    if (err) throw err;
    if (result.affectedRows === 0) return res.status(403).json({ message: "Ntiwemerewe" });
    res.json({ message: "Byasibwe!", data: result });
  });
});

// ============================================================
// 📚 UBUREZI (FULL CRUD with user_id)
// ============================================================

app.post("/uburezi", (req, res) => {
  const { urwego_rw_amashuri, umwuga, ishuri_yizemo, amazina_y_umuturage } = req.body;

  const sql = `
    INSERT INTO uburezi 
      (urwego_rw_amashuri, umwuga, ishuri_yizemo, amazina_y_umuturage, user_id)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [urwego_rw_amashuri, umwuga, ishuri_yizemo, amazina_y_umuturage, req.user.id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "Uburezi bwongewe!", id: result.insertId });
    }
  );
});

app.get("/uburezi", (req, res) => {
  db.query("SELECT * FROM uburezi WHERE user_id=?", [req.user.id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

app.get("/uburezi/:id", (req, res) => {
  db.query(
    "SELECT * FROM uburezi WHERE uburezi_id = ? AND user_id=?",
    [req.params.id, req.user.id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json(results[0]);
    }
  );
});

app.put("/uburezi/:id", (req, res) => {
  const { urwego_rw_amashuri, umwuga, ishuri_yizemo, amazina_y_umuturage } = req.body;
  const sql = `
      UPDATE uburezi
      SET urwego_rw_amashuri=?, umwuga=?, ishuri_yizemo=?, amazina_y_umuturage=?
      WHERE uburezi_id=? AND user_id=?
    `;
  db.query(
    sql,
    [urwego_rw_amashuri, umwuga, ishuri_yizemo, amazina_y_umuturage, req.params.id, req.user.id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      if (result.affectedRows === 0) return res.status(403).json({ message: "Ntiwemerewe" });
      res.json({ message: "Uburezi bwaravuguruwe!" });
    }
  );
});

app.delete("/uburezi/:id", (req, res) => {
  db.query(
    "DELETE FROM uburezi WHERE uburezi_id = ? AND user_id=?",
    [req.params.id, req.user.id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      if (result.affectedRows === 0) return res.status(403).json({ message: "Ntiwemerewe" });
      res.json({ message: "Uburezi bwasibwe!" });
    }
  );
});

// ============================================================
// ⚕️ UBUZIMA (FULL CRUD with user_id)
// ============================================================

app.post("/ubuzima", (req, res) => {
  const {
    afite_ubumuga,
    ubwoko_bw_ubumuga,
    indwara_y_igihe_kirekire,
    afite_mutuelle,
    ubwoko_bwa_mutuelle,
    ivuriro_ajyamo,
    amazina_y_umuturage,
  } = req.body;

  const sql = `
    INSERT INTO ubuzima 
      (afite_ubumuga, ubwoko_bw_ubumuga, indwara_y_igihe_kirekire, 
       afite_mutuelle, ubwoko_bwa_mutuelle, ivuriro_ajyamo, amazina_y_umuturage, user_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      afite_ubumuga,
      ubwoko_bw_ubumuga,
      indwara_y_igihe_kirekire,
      afite_mutuelle,
      ubwoko_bwa_mutuelle,
      ivuriro_ajyamo,
      amazina_y_umuturage,
      req.user.id,
    ],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "Ubuzima bwongewe!", id: result.insertId });
    }
  );
});

app.get("/ubuzima", (req, res) => {
  db.query("SELECT * FROM ubuzima WHERE user_id=?", [req.user.id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

app.get("/ubuzima/:id", (req, res) => {
  db.query(
    "SELECT * FROM ubuzima WHERE ubuzima_id = ? AND user_id=?",
    [req.params.id, req.user.id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json(results[0]);
    }
  );
});

app.put("/ubuzima/:id", (req, res) => {
  const {
    afite_ubumuga,
    ubwoko_bw_ubumuga,
    indwara_y_igihe_kirekire,
    afite_mutuelle,
    ubwoko_bwa_mutuelle,
    ivuriro_ajyamo,
    amazina_y_umuturage,
  } = req.body;

  const sql = `
      UPDATE ubuzima SET
        afite_ubumuga=?, ubwoko_bw_ubumuga=?, indwara_y_igihe_kirekire=?, 
        afite_mutuelle=?, ubwoko_bwa_mutuelle=?, ivuriro_ajyamo=?, amazina_y_umuturage=?
      WHERE ubuzima_id=? AND user_id=?
    `;

  db.query(
    sql,
    [
      afite_ubumuga,
      ubwoko_bw_ubumuga,
      indwara_y_igihe_kirekire,
      afite_mutuelle,
      ubwoko_bwa_mutuelle,
      ivuriro_ajyamo,
      amazina_y_umuturage,
      req.params.id,
      req.user.id,
    ],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      if (result.affectedRows === 0) return res.status(403).json({ message: "Ntiwemerewe" });
      res.json({ message: "Ubuzima bwavuguruwe!" });
    }
  );
});

app.delete("/ubuzima/:id", (req, res) => {
  db.query(
    "DELETE FROM ubuzima WHERE ubuzima_id = ? AND user_id=?",
    [req.params.id, req.user.id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      if (result.affectedRows === 0) return res.status(403).json({ message: "Ntiwemerewe" });
      res.json({ message: "Ubuzima bwasibwe!" });
    }
  );
});

// ============================================================
// 👪 BYICIRO BYIHARIYE (Urubyiruko, Abana, etc.) – all with user_id
// ============================================================

// 1️⃣ urubyiruko
app.get("/urubyiruko", (req, res) => {
  db.query("SELECT * FROM urubyiruko WHERE user_id=?", [req.user.id], (err, data) =>
    err ? res.json(err) : res.json(data)
  );
});

app.post("/urubyiruko", (req, res) => {
  const q = `
    INSERT INTO urubyiruko 
      (amazina, imyaka, igitsina, umurimo, nimero_ya_telephone, aderesi, id_number, status, user_id) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const v = [
    req.body.amazina,
    req.body.imyaka,
    req.body.igitsina,
    req.body.umurimo,
    req.body.nimero_ya_telephone,
    req.body.aderesi,
    req.body.id_number,
    req.body.status,
    req.user.id,
  ];
  db.query(q, v, (err) => (err ? res.json(err) : res.json("Urubyiruko added successfully")));
});

app.put("/urubyiruko/:id", (req, res) => {
  const q = `
    UPDATE urubyiruko SET 
      amazina=?, imyaka=?, igitsina=?, umurimo=?, nimero_ya_telephone=?, aderesi=?, id_number=?, status=? 
    WHERE id=? AND user_id=?
  `;
  const v = [
    req.body.amazina,
    req.body.imyaka,
    req.body.igitsina,
    req.body.umurimo,
    req.body.nimero_ya_telephone,
    req.body.aderesi,
    req.body.id_number,
    req.body.status,
    req.params.id,
    req.user.id,
  ];
  db.query(q, v, (err, result) =>
    err
      ? res.json(err)
      : result.affectedRows === 0
      ? res.status(403).json({ message: "Ntiwemerewe" })
      : res.json("Urubyiruko updated successfully")
  );
});

app.delete("/urubyiruko/:id", (req, res) => {
  db.query(
    "DELETE FROM urubyiruko WHERE id=? AND user_id=?",
    [req.params.id, req.user.id],
    (err, result) =>
      err
        ? res.json(err)
        : result.affectedRows === 0
        ? res.status(403).json({ message: "Ntiwemerewe" })
        : res.json("Urubyiruko deleted successfully")
  );
});

// 2️⃣ abasheshe_akanguhe
app.get("/abasheshe_akanguhe", (req, res) => {
  db.query("SELECT * FROM abasheshe_akanguhe WHERE user_id=?", [req.user.id], (err, data) =>
    err ? res.json(err) : res.json(data)
  );
});

app.post("/abasheshe_akanguhe", (req, res) => {
  const q = `
    INSERT INTO abasheshe_akanguhe 
      (amazina, imyaka, igitsina, nimero_ya_telephone, aderesi, ukeneye_ubufasha, user_id) 
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  const v = [
    req.body.amazina,
    req.body.imyaka,
    req.body.igitsina,
    req.body.nimero_ya_telephone,
    req.body.aderesi,
    req.body.ukeneye_ubufasha,
    req.user.id,
  ];
  db.query(q, v, (err) => (err ? res.json(err) : res.json("Abasheshe akanguhe added successfully")));
});

app.put("/abasheshe_akanguhe/:id", (req, res) => {
  const q = `
    UPDATE abasheshe_akanguhe SET 
      amazina=?, imyaka=?, igitsina=?, nimero_ya_telephone=?, aderesi=?, ukeneye_ubufasha=? 
    WHERE id=? AND user_id=?
  `;
  const v = [
    req.body.amazina,
    req.body.imyaka,
    req.body.igitsina,
    req.body.nimero_ya_telephone,
    req.body.aderesi,
    req.body.ukeneye_ubufasha,
    req.params.id,
    req.user.id,
  ];
  db.query(q, v, (err, result) =>
    err
      ? res.json(err)
      : result.affectedRows === 0
      ? res.status(403).json({ message: "Ntiwemerewe" })
      : res.json("Abasheshe akanguhe updated successfully")
  );
});

app.delete("/abasheshe_akanguhe/:id", (req, res) => {
  db.query(
    "DELETE FROM abasheshe_akanguhe WHERE id=? AND user_id=?",
    [req.params.id, req.user.id],
    (err, result) =>
      err
        ? res.json(err)
        : result.affectedRows === 0
        ? res.status(403).json({ message: "Ntiwemerewe" })
        : res.json("Abasheshe akanguhe deleted successfully")
  );
});

// 3️⃣ abana
app.get("/abana", (req, res) => {
  db.query("SELECT * FROM abana WHERE user_id=?", [req.user.id], (err, data) =>
    err ? res.json(err) : res.json(data)
  );
});

app.post("/abana", (req, res) => {
  const q = `
    INSERT INTO abana 
      (amazina, imyaka, igitsina, umubyeyi_wa_mwana, aderesi, aiga, user_id) 
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  const v = [
    req.body.amazina,
    req.body.imyaka,
    req.body.igitsina,
    req.body.umubyeyi_wa_mwana,
    req.body.aderesi,
    req.body.aiga,
    req.user.id,
  ];
  db.query(q, v, (err) => (err ? res.json(err) : res.json("Umwana added successfully")));
});

app.put("/abana/:id", (req, res) => {
  const q = `
    UPDATE abana SET 
      amazina=?, imyaka=?, igitsina=?, umubyeyi_wa_mwana=?, aderesi=?, aiga=? 
    WHERE id=? AND user_id=?
  `;
  const v = [
    req.body.amazina,
    req.body.imyaka,
    req.body.igitsina,
    req.body.umubyeyi_wa_mwana,
    req.body.aderesi,
    req.body.aiga,
    req.params.id,
    req.user.id,
  ];
  db.query(q, v, (err, result) =>
    err
      ? res.json(err)
      : result.affectedRows === 0
      ? res.status(403).json({ message: "Ntiwemerewe" })
      : res.json("Umwana updated successfully")
  );
});

app.delete("/abana/:id", (req, res) => {
  db.query(
    "DELETE FROM abana WHERE id=? AND user_id=?",
    [req.params.id, req.user.id],
    (err, result) =>
      err
        ? res.json(err)
        : result.affectedRows === 0
        ? res.status(403).json({ message: "Ntiwemerewe" })
        : res.json("Umwana deleted successfully")
  );
});

// 4️⃣ abagore_batwite
app.get("/abagore_batwite", (req, res) => {
  db.query("SELECT * FROM abagore_batwite WHERE user_id=?", [req.user.id], (err, data) =>
    err ? res.json(err) : res.json(data)
  );
});

app.post("/abagore_batwite", (req, res) => {
  const q = `
    INSERT INTO abagore_batwite 
      (amazina, imyaka, nimero_ya_telephone, aderesi, amezi_atwite, asuzumwe_kuvuzi, user_id) 
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  const v = [
    req.body.amazina,
    req.body.imyaka,
    req.body.nimero_ya_telephone,
    req.body.aderesi,
    req.body.amezi_atwite,
    req.body.asuzumwe_kuvuzi,
    req.user.id,
  ];
  db.query(q, v, (err) => (err ? res.json(err) : res.json("Umugore utwite added successfully")));
});

app.put("/abagore_batwite/:id", (req, res) => {
  const q = `
    UPDATE abagore_batwite SET 
      amazina=?, imyaka=?, nimero_ya_telephone=?, aderesi=?, amezi_atwite=?, asuzumwe_kuvuzi=? 
    WHERE id=? AND user_id=?
  `;
  const v = [
    req.body.amazina,
    req.body.imyaka,
    req.body.nimero_ya_telephone,
    req.body.aderesi,
    req.body.amezi_atwite,
    req.body.asuzumwe_kuvuzi,
    req.params.id,
    req.user.id,
  ];
  db.query(q, v, (err, result) =>
    err
      ? res.json(err)
      : result.affectedRows === 0
      ? res.status(403).json({ message: "Ntiwemerewe" })
      : res.json("Umugore utwite updated successfully")
  );
});

app.delete("/abagore_batwite/:id", (req, res) => {
  db.query(
    "DELETE FROM abagore_batwite WHERE id=? AND user_id=?",
    [req.params.id, req.user.id],
    (err, result) =>
      err
        ? res.json(err)
        : result.affectedRows === 0
        ? res.status(403).json({ message: "Ntiwemerewe" })
        : res.json("Umugore utwite deleted successfully")
  );
});

// 5️⃣ abana_barimwo_mirire_mibi
app.get("/abana_barimwo_mirire_mibi", (req, res) => {
  db.query(
    "SELECT * FROM abana_barimwo_mirire_mibi WHERE user_id=?",
    [req.user.id],
    (err, data) => (err ? res.json(err) : res.json(data))
  );
});

app.post("/abana_barimwo_mirire_mibi", (req, res) => {
  const q = `
    INSERT INTO abana_barimwo_mirire_mibi 
      (amazina, imyaka, igitsina, umubyeyi_wa_mwana, aderesi, urwego_rw_imirire, afashijwe, user_id) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const v = [
    req.body.amazina,
    req.body.imyaka,
    req.body.igitsina,
    req.body.umubyeyi_wa_mwana,
    req.body.aderesi,
    req.body.urwego_rw_imirire,
    req.body.afashijwe,
    req.user.id,
  ];
  db.query(q, v, (err) =>
    err ? res.json(err) : res.json("Umwana ufite imirire mibi added successfully")
  );
});

app.put("/abana_barimwo_mirire_mibi/:id", (req, res) => {
  const q = `
    UPDATE abana_barimwo_mirire_mibi SET 
      amazina=?, imyaka=?, igitsina=?, umubyeyi_wa_mwana=?, aderesi=?, urwego_rw_imirire=?, afashijwe=? 
    WHERE id=? AND user_id=?
  `;
  const v = [
    req.body.amazina,
    req.body.imyaka,
    req.body.igitsina,
    req.body.umubyeyi_wa_mwana,
    req.body.aderesi,
    req.body.urwego_rw_imirire,
    req.body.afashijwe,
    req.params.id,
    req.user.id,
  ];
  db.query(q, v, (err, result) =>
    err
      ? res.json(err)
      : result.affectedRows === 0
      ? res.status(403).json({ message: "Ntiwemerewe" })
      : res.json("Umwana ufite imirire mibi updated successfully")
  );
});

app.delete("/abana_barimwo_mirire_mibi/:id", (req, res) => {
  db.query(
    "DELETE FROM abana_barimwo_mirire_mibi WHERE id=? AND user_id=?",
    [req.params.id, req.user.id],
    (err, result) =>
      err
        ? res.json(err)
        : result.affectedRows === 0
        ? res.status(403).json({ message: "Ntiwemerewe" })
        : res.json("Umwana ufite imirire mibi deleted successfully")
  );
});

// 6️⃣ abakobwa_babyaye
app.get("/abakobwa_babyaye", (req, res) => {
  db.query("SELECT * FROM abakobwa_babyaye WHERE user_id=?", [req.user.id], (err, data) =>
    err ? res.json(err) : res.json(data)
  );
});

app.post("/abakobwa_babyaye", (req, res) => {
  const q = `
    INSERT INTO abakobwa_babyaye 
      (amazina, imyaka, aderesi, nimero_ya_telephone, umwana_ufite_imyaka, asubiye_mw_ishuri, user_id) 
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  const v = [
    req.body.amazina,
    req.body.imyaka,
    req.body.aderesi,
    req.body.nimero_ya_telephone,
    req.body.umwana_ufite_imyaka,
    req.body.asubiye_mw_ishuri,
    req.user.id,
  ];
  db.query(q, v, (err) => (err ? res.json(err) : res.json("Umukobwa wabyaye added successfully")));
});

app.put("/abakobwa_babyaye/:id", (req, res) => {
  const q = `
    UPDATE abakobwa_babyaye SET 
      amazina=?, imyaka=?, aderesi=?, nimero_ya_telephone=?, umwana_ufite_imyaka=?, asubiye_mw_ishuri=? 
    WHERE id=? AND user_id=?
  `;
  const v = [
    req.body.amazina,
    req.body.imyaka,
    req.body.aderesi,
    req.body.nimero_ya_telephone,
    req.body.umwana_ufite_imyaka,
    req.body.asubiye_mw_ishuri,
    req.params.id,
    req.user.id,
  ];
  db.query(q, v, (err, result) =>
    err
      ? res.json(err)
      : result.affectedRows === 0
      ? res.status(403).json({ message: "Ntiwemerewe" })
      : res.json("Umukobwa wabyaye updated successfully")
  );
});

app.delete("/abakobwa_babyaye/:id", (req, res) => {
  db.query(
    "DELETE FROM abakobwa_babyaye WHERE id=? AND user_id=?",
    [req.params.id, req.user.id],
    (err, result) =>
      err
        ? res.json(err)
        : result.affectedRows === 0
        ? res.status(403).json({ message: "Ntiwemerewe" })
        : res.json("Umukobwa wabyaye deleted successfully")
  );
});

// 7️⃣ urubyiruko_rukora
// 7️⃣ urubyiruko_rukora

// GET: Fetch data belonging to the logged-in user
app.get("/urubyiruko_rukora", (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ error: "User ID missing from token" });
  }

  const sql = "SELECT * FROM urubyiruko_rukora WHERE user_id = ?";
  db.query(sql, [req.user.id], (err, data) => {
    if (err) {
      console.error("❌ Error fetching urubyiruko_rukora:", err);
      return res.status(500).json({ error: "Database error", details: err });
    }
    res.json(data);
  });
});

// POST: Insert data linked to the logged-in user
app.post("/urubyiruko_rukora", (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ error: "User ID missing from token" });
  }

  const q = `
    INSERT INTO urubyiruko_rukora 
      (amazina, imyaka, igitsina, umurimo, nimero_ya_telephone, aderesi, ubuhanga, user_id) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const v = [
    req.body.amazina,
    req.body.imyaka,
    req.body.igitsina,
    req.body.umurimo,
    req.body.nimero_ya_telephone,
    req.body.aderesi,
    req.body.ubuhanga,
    req.user.id,
  ];

  db.query(q, v, (err, result) => {
    if (err) {
      console.error("❌ Error inserting urubyiruko_rukora:", err);
      return res.status(500).json({ error: "Failed to insert data", details: err });
    }
    res.json({ message: "Urubyiruko rukora added successfully", id: result.insertId });
  });
});

// PUT: Update data belonging to the logged-in user
app.put("/urubyiruko_rukora/:id", (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ error: "User ID missing from token" });
  }

  const q = `
    UPDATE urubyiruko_rukora SET 
      amazina=?, imyaka=?, igitsina=?, umurimo=?, nimero_ya_telephone=?, aderesi=?, ubuhanga=? 
    WHERE id=? AND user_id=?
  `;
  const v = [
    req.body.amazina,
    req.body.imyaka,
    req.body.igitsina,
    req.body.umurimo,
    req.body.nimero_ya_telephone,
    req.body.aderesi,
    req.body.ubuhanga,
    req.params.id,
    req.user.id,
  ];

  db.query(q, v, (err, result) => {
    if (err) {
      console.error("❌ Error updating urubyiruko_rukora:", err);
      return res.status(500).json({ error: "Failed to update data", details: err });
    }
    if (result.affectedRows === 0) {
      return res.status(403).json({ message: "Ntiwemerewe (Not found or not yours)" });
    }
    res.json({ message: "Urubyiruko rukora updated successfully" });
  });
});

// DELETE: Delete data belonging to the logged-in user
app.delete("/urubyiruko_rukora/:id", (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ error: "User ID missing from token" });
  }

  const q = "DELETE FROM urubyiruko_rukora WHERE id=? AND user_id=?";
  
  db.query(q, [req.params.id, req.user.id], (err, result) => {
    if (err) {
      console.error("❌ Error deleting urubyiruko_rukora:", err);
      return res.status(500).json({ error: "Failed to delete data", details: err });
    }
    if (result.affectedRows === 0) {
      return res.status(403).json({ message: "Ntiwemerewe (Not found or not yours)" });
    }
    res.json({ message: "Urubyiruko rukora deleted successfully" });
  });
});
// 8️⃣ urubyiruko_rudafite_akazi
app.get("/urubyiruko_rudafite_akazi", (req, res) => {
  db.query(
    "SELECT * FROM urubyiruko_rudafite_akazi WHERE user_id=?",
    [req.user.id],
    (err, data) => (err ? res.json(err) : res.json(data))
  );
});

app.post("/urubyiruko_rudafite_akazi", (req, res) => {
  const q = `
    INSERT INTO urubyiruko_rudafite_akazi 
      (amazina, imyaka, igitsina, aderesi, nimero_ya_telephone, impamvu_yubushomeri, yigeze_kora, yifuza_umurimo_mwene, user_id) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const v = [
    req.body.amazina,
    req.body.imyaka,
    req.body.igitsina,
    req.body.aderesi,
    req.body.nimero_ya_telephone,
    req.body.impamvu_yubushomeri,
    req.body.yigeze_kora,
    req.body.yifuza_umurimo_mwene,
    req.user.id,
  ];
  db.query(q, v, (err) =>
    err ? res.json(err) : res.json("Urubyiruko rudafite akazi added successfully")
  );
});

app.put("/urubyiruko_rudafite_akazi/:id", (req, res) => {
  const q = `
    UPDATE urubyiruko_rudafite_akazi SET 
      amazina=?, imyaka=?, igitsina=?, aderesi=?, nimero_ya_telephone=?, impamvu_yubushomeri=?, yigeze_kora=?, yifuza_umurimo_mwene=? 
    WHERE id=? AND user_id=?
  `;
  const v = [
    req.body.amazina,
    req.body.imyaka,
    req.body.igitsina,
    req.body.aderesi,
    req.body.nimero_ya_telephone,
    req.body.impamvu_yubushomeri,
    req.body.yigeze_kora,
    req.body.yifuza_umurimo_mwene,
    req.params.id,
    req.user.id,
  ];
  db.query(q, v, (err, result) =>
    err
      ? res.json(err)
      : result.affectedRows === 0
      ? res.status(403).json({ message: "Ntiwemerewe" })
      : res.json("Urubyiruko rudafite akazi updated successfully")
  );
});

app.delete("/urubyiruko_rudafite_akazi/:id", (req, res) => {
  db.query(
    "DELETE FROM urubyiruko_rudafite_akazi WHERE id=? AND user_id=?",
    [req.params.id, req.user.id],
    (err, result) =>
      err
        ? res.json(err)
        : result.affectedRows === 0
        ? res.status(403).json({ message: "Ntiwemerewe" })
        : res.json("Urubyiruko rudafite akazi deleted successfully")
  );
});

// ==========================
// 🏁 SERVER START
// ==========================
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Server y’Umudugudu ikora kuri http://localhost:${PORT}`);
});