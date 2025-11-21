// ==========================
// 🧩 SISITEMU Y'UMUDUGUDU BACKEND (Node.js + Express + MySQL)
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

// ==========================
// ⚙️ KWIFATANYA NA DATABASE
// ==========================
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "sisitemu_y_umudugudu",
});

db.connect((err) => {
  if (err) {
    console.error("❌ Byanze kwihuza na database:", err);
  } else {
    console.log("✅ Twahuye na database neza!");
  }
});
const JWT_SECRET = "super_secret_token_key";


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

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: "24h" });
    res.json({ message: "✅ Kwinjira byagenze neza", token, role: user.role });
  });
});

// 🔒 Protected route example
app.get("/profile", (req, res) => {
  res.json({ message: "Protected data" });
});




// 🧍‍♂️ ABATURAGE ENDPOINTS (FULL CRUD)
// ============================================================

// ➕ Kongeramo umuturage
app.post("/abaturage", (req, res) => {
  const d = req.body;
  const sql = `
    INSERT INTO abaturage 
    (izina_ribanza, izina_risoza, igitsina, itariki_y_amavuko, indangamuntu, telefone, icyiciro_cy_ubudehe)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(sql, [d.izina_ribanza, d.izina_risoza, d.igitsina, d.itariki_y_amavuko, d.indangamuntu, d.telefone, d.icyiciro_cy_ubudehe],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "✅ Umuturage yanditswe neza!", id: result.insertId });
    });
});

// 📋 Kwerekana abaturage bose
app.get("/abaturage", (req, res) => {
  db.query("SELECT * FROM abaturage", (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// 📄 Kwerekana umwe
app.get("/abaturage/:id", (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM abaturage WHERE umuturage_id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json(result[0]);
  });
});

// ✏️ Kuvugurura umuturage
app.put("/abaturage/:id", (req, res) => {
  const { id } = req.params;
  const d = req.body;
  const sql = `
    UPDATE abaturage SET 
    izina_ribanza=?, izina_risoza=?, igitsina=?, itariki_y_amavuko=?, indangamuntu=?, telefone=?, icyiciro_cy_ubudehe=?
    WHERE umuturage_id=?
  `;
  db.query(sql, [d.izina_ribanza, d.izina_risoza, d.igitsina, d.itariki_y_amavuko, d.indangamuntu, d.telefone, d.icyiciro_cy_ubudehe, id],
    (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "✏️ Amakuru y'umuturage yavuguruwe neza!" });
    });
});

// 🗑️ Gusiba umuturage
app.delete("/abaturage/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM abaturage WHERE umuturage_id = ?", [id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "🗑️ Umuturage yasibwe neza!" });
  });
});

// ============================================================
// 👨‍👩‍👧‍👦 INGO ENDPOINTS (FULL CRUD)
// ============================================================

app.post("/ingo", (req, res) => {
  const d = req.body;
  const sql = `
    INSERT INTO ingo 
    (umukuru_w_urugo, umubare_w_abagize, aho_batuye, ubwoko_bw_inzu, bafite_amazi, bafite_umuyoboro_wamashanyarazi, icyiciro_cy_ubudehe, umudugudu, akagari, umurenge, akarere)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(sql, [d.umukuru_w_urugo, d.umubare_w_abagize, d.aho_batuye, d.ubwoko_bw_inzu, d.fafite_amazi, d.fafite_umuyoboro_wamashanyarazi,
    d.icyiciro_cy_ubudehe, d.umudugudu, d.akagari, d.umurenge, d.akarere],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "🏠 Urugo rwanditswe neza!", id: result.insertId });
    });
});

app.get("/ingo", (req, res) => {
  db.query("SELECT * FROM ingo", (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

app.get("/ingo/:id", (req, res) => {
  db.query("SELECT * FROM ingo WHERE urugo_id=?", [req.params.id], (err, result) => {
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
    WHERE urugo_id=?`;
  db.query(sql, [d.umukuru_w_urugo, d.umubare_w_abagize, d.aho_batuye, d.ubwoko_bw_inzu, d.fafite_amazi, d.fafite_umuyoboro_wamashanyarazi,
    d.icyiciro_cy_ubudehe, d.umudugudu, d.akagari, d.umurenge, d.akarere, id],
    (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "✏️ Urugo ruvuguruwe neza!" });
    });
});

app.delete("/ingo/:id", (req, res) => {
  db.query("DELETE FROM ingo WHERE urugo_id=?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "🗑️ Urugo rwasibwe neza!" });
  });
});

// ============================================================
// 🧑‍💼 ABAYOBOZI ENDPOINTS (FULL CRUD)
// ============================================================

app.post("/abayobozi", (req, res) => {
  const d = req.body;
  const sql = `
    INSERT INTO abayobozi 
    (amazina_yose, telefone, inshingano, umudugudu, itariki_yatangiye, itariki_yarangije)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  db.query(sql, [d.amazina_yose, d.telefone, d.inshingano, d.umudugudu, d.itariki_yatangiye, d.itariki_yarangije],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "👔 Umuyobozi yanditswe neza!", id: result.insertId });
    });
});

app.get("/abayobozi", (req, res) => {
  db.query("SELECT * FROM abayobozi", (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

app.get("/abayobozi/:id", (req, res) => {
  db.query("SELECT * FROM abayobozi WHERE umuyobozi_id=?", [req.params.id], (err, result) => {
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
    WHERE umuyobozi_id=?
  `;
  db.query(sql, [d.amazina_yose, d.telefone, d.inshingano, d.umudugudu, d.itariki_yatangiye, d.itariki_yarangije, id],
    (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "✏️ Umuyobozi yavuguruwe neza!" });
    });
});

app.delete("/abayobozi/:id", (req, res) => {
  db.query("DELETE FROM abayobozi WHERE umuyobozi_id=?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "🗑️ Umuyobozi yasibwe neza!" });
  });
});

// ============================================================
// 📊 RAPORO ENDPOINTS (FULL CRUD)
// ============================================================

// ➕ POST – Kongeramo raporo nshya
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
    (umutwe_wa_raporo, ibisobanuro, itariki_ya_raporo, umubare_w_abaturage, umubare_w_ingo, abanyantege_nke, yakozwe_na)
    VALUES (?, ?, ?, ?, ?, ?, ?)
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

// 📋 GET – Kwerekana raporo zose
app.get("/raporo", (req, res) => {
  const sql = "SELECT * FROM raporo ORDER BY itariki_ya_raporo DESC";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Raporo ntizabonetse:", err);
      return res.status(500).json({ error: "Ntibyashobotse kubona raporo" });
    }
    res.json(results);
  });
});

// 📄 GET – Kwerekana raporo imwe
app.get("/raporo/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM raporo WHERE raporo_id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("❌ Raporo ntibonetse:", err);
      return res.status(500).json({ error: "Ntibyashobotse kubona raporo imwe" });
    }
    res.json(result[0]);
  });
});

// ✏️ PUT – Kuvugurura raporo
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
      umutwe_wa_raporo = ?, 
      ibisobanuro = ?, 
      itariki_ya_raporo = ?, 
      umubare_w_abaturage = ?, 
      umubare_w_ingo = ?, 
      abanyantege_nke = ?, 
      yakozwe_na = ?
    WHERE raporo_id = ?
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
    ],
    (err) => {
      if (err) {
        console.error("❌ Ntibyavuguruwe:", err);
        return res.status(500).json({ error: "Ntibyashobotse kuvugurura raporo" });
      }
      res.json({ message: "✏️ Raporo yavuguruwe neza!" });
    }
  );
});

// 🗑️ DELETE – Gusiba raporo
app.delete("/raporo/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM raporo WHERE raporo_id = ?";
  db.query(sql, [id], (err) => {
    if (err) {
      console.error("❌ Ntibyasibwe:", err);
      return res.status(500).json({ error: "Ntibyashobotse gusiba raporo" });
    }
    res.json({ message: "🗑️ Raporo yasibwe neza!" });
  });
});
// ➕ POST – Add new raporo
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
    (umutwe_wa_raporo, ibisobanuro, itariki_ya_raporo, umubare_w_abaturage, umubare_w_ingo, abanyantege_nke, yakozwe_na)
    VALUES (?, ?, ?, ?, ?, ?, ?)
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
    ],
    (err, result) => {
      if (err) return res.status(500).json({ error: "❌ Raporo ntibashije kwandikwa" });
      res.json({ message: "✅ Raporo yashyizwemo neza!", id: result.insertId });
    }
  );
});

// 📋 GET – All raporo
app.get("/raporo", (req, res) => {
  db.query("SELECT * FROM raporo ORDER BY itariki_ya_raporo DESC", (err, results) => {
    if (err) return res.status(500).json({ error: "Ntibyashobotse kubona raporo" });
    res.json(results);
  });
});

// 📄 GET – One raporo
app.get("/raporo/:id", (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM raporo WHERE raporo_id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: "Ntibyashobotse kubona raporo imwe" });
    res.json(result[0]);
  });
});

// ✏️ PUT – Update raporo
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
    WHERE raporo_id=?
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
    ],
    (err) => {
      if (err) return res.status(500).json({ error: "Ntibyashobotse kuvugurura raporo" });
      res.json({ message: "✏️ Raporo yavuguruwe neza!" });
    }
  );
});

// 🗑️ DELETE – Delete raporo
app.delete("/raporo/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM raporo WHERE raporo_id = ?", [id], (err) => {
    if (err) return res.status(500).json({ error: "Ntibyashobotse gusiba raporo" });
    res.json({ message: "🗑️ Raporo yasibwe neza!" });
  });
});

// 🧑‍💼 IMIBEREHO MYIZA CRUD
// ============================================================

app.post("/imibereho", (req, res) => {
  const {
    muturage_id,
    gahunda_yafashwemo,
    ibisobanuro,
    itariki_yatangiranye,
    imiterere_yayo,
    amazina_y_umuturage
  } = req.body;

  const sql = `
    INSERT INTO imibereho_myiza
    (umuturage_id, gahunda_yafashwemo, ibisobanuro, itariki_yatangiranye, imiterere_yayo, amazina_y_umuturage)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [
    muturage_id,
    gahunda_yafashwemo,
    ibisobanuro,
    itariki_yatangiranye,
    imiterere_yayo,
    amazina_y_umuturage
  ], (err, result) => {
    if (err) throw err;
    res.json({ message: "Byakigiyemo neza!", data: result });
  });
});

// ----------------------------
// READ ALL (GET)
// ----------------------------
app.get("/imibereho", (req, res) => {
  db.query("SELECT * FROM imibereho_myiza", (err, rows) => {
    if (err) throw err;
    res.json(rows);
  });
});

// ----------------------------
// READ ONE (GET by ID)
// ----------------------------
app.get("/imibereho/:id", (req, res) => {
  const sql = "SELECT * FROM imibereho_myiza WHERE imibereho_id = ?";
  db.query(sql, [req.params.id], (err, row) => {
    if (err) throw err;
    res.json(row[0]);
  });
});

// ----------------------------
// UPDATE (PUT)
// ----------------------------
app.put("/imibereho/:id", (req, res) => {
  const {
    muturage_id,
    gahunda_yafashwemo,
    ibisobanuro,
    itariki_yatangiranye,
    imiterere_yayo,
    amazina_y_umuturage
  } = req.body;

  const sql = `
    UPDATE imibereho_myiza SET
      muturage_id = ?, 
      gahunda_yafashwemo = ?, 
      ibisobanuro = ?, 
      itariki_yatangiranye = ?, 
      imiterere_yayo = ?,
      amazina_y_umuturage = ?
    WHERE imibereho_id = ?
  `;

  db.query(sql, [
    muturage_id,
    gahunda_yafashwemo,
    ibisobanuro,
    itariki_yatangiranye,
    imiterere_yayo,
    amazina_y_umuturage,
    req.params.id
  ], (err, result) => {
    if (err) throw err;
    res.json({ message: "Havuguruwe neza!", data: result });
  });
});

// ----------------------------
// DELETE
// ----------------------------
app.delete("/imibereho/:id", (req, res) => {
  const sql = "DELETE FROM imibereho_myiza WHERE imibereho_id = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) throw err;
    res.json({ message: "Byasibwe!", data: result });
  });
});

// ============================================================
// ============================================================
// 🧩 ISIBO ENDPOINTS (FULL CRUD)
// ============================================================

// ➕ Kongeramo isibo
app.post("/isibo", (req, res) => {
  const d = req.body;
  const sql = `
    INSERT INTO isibo 
    (izina_ry_isibo, umuyobozi_w_isibo, umubare_w_abaturage, umudugudu)
    VALUES (?, ?, ?, ?)
  `;
  db.query(
    sql,
    [d.izina_ry_isibo, d.umuyobozi_w_isibo, d.umubare_w_abaturage, d.umudugudu],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({
        message: "✅ Isibo yanditswe neza!",
        id: result.insertId,
      });
    }
  );
});

// 📋 Kwerekana isibo zose
app.get("/isibo", (req, res) => {
  db.query("SELECT * FROM isibo", (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// 📄 Kwerekana isibo imwe
app.get("/isibo/:id", (req, res) => {
  db.query("SELECT * FROM isibo WHERE isibo_id = ?", [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json(result[0]);
  });
});

// ✏️ Kuvugurura isibo
app.put("/isibo/:id", (req, res) => {
  const { id } = req.params;
  const d = req.body;
  const sql = `
    UPDATE isibo SET 
      izina_ry_isibo = ?, 
      umuyobozi_w_isibo = ?, 
      umubare_w_abaturage = ?, 
      umudugudu = ?
    WHERE isibo_id = ?
  `;
  db.query(
    sql,
    [d.izina_ry_isibo, d.umuyobozi_w_isibo, d.umubare_w_abaturage, d.umudugudu, id],
    (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "✏️ Isibo yavuguruwe neza!" });
    }
  );
});

// 🗑️ Gusiba isibo
app.delete("/isibo/:id", (req, res) => {
  db.query("DELETE FROM isibo WHERE isibo_id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "🗑️ Isibo yasibwe neza!" });
  });
});
// ============================================================
// 💼 UBUKUNGU ENDPOINTS (FULL CRUD)
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
    amazina_y_umuturage
  } = req.body;

  const sql = `
    INSERT INTO ubukungu
    (umuturage_id, umurimo, aho_akorera, inkomoko_y_amafaranga, afite_ubutaka, 
     afite_amatungo, afite_konti_yo_kuzigama, amazina_y_umuturage)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
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
      amazina_y_umuturage
    ],
    (err, result) => {
      if (err) throw err;
      res.json({ message: "Byakigiyemo neza!", data: result });
    }
  );
});

// -------------------------------------------------------
// READ ALL (GET)
// -------------------------------------------------------
app.get("/ubukungu", (req, res) => {
  db.query("SELECT * FROM ubukungu", (err, rows) => {
    if (err) throw err;
    res.json(rows);
  });
});

// -------------------------------------------------------
// READ ONE (GET by ID)
// -------------------------------------------------------
app.get("/ubukungu/:id", (req, res) => {
  const sql = "SELECT * FROM ubukungu WHERE ubukungu_id = ?";
  db.query(sql, [req.params.id], (err, row) => {
    if (err) throw err;
    res.json(row[0]);
  });
});

// -------------------------------------------------------
// UPDATE (PUT)
// -------------------------------------------------------
app.put("/ubukungu/:id", (req, res) => {
  const {
    muturage_id,
    umurimo,
    aho_akorera,
    inkomoko_y_amafaranga,
    afite_ubutaka,
    afite_amatungo,
    afite_konti_yo_kuzigama,
    amazina_y_umuturage
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
    WHERE ubukungu_id = ?
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
      req.params.id
    ],
    (err, result) => {
      if (err) throw err;
      res.json({ message: "Havuguruwe neza!", data: result });
    }
  );
});

// -------------------------------------------------------
// DELETE
// -------------------------------------------------------
app.delete("/ubukungu/:id", (req, res) => {
  const sql = "DELETE FROM ubukungu WHERE ubukungu_id = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) throw err;
    res.json({ message: "Byasibwe!", data: result });
  });
});

 // ➤ CREATE
  app.post("/uburezi", (req, res) => {
    const { urwego_rw_amashuri, umwuga, ishuri_yizemo, amazina_y_umuturage } = req.body;

    const sql = `
      INSERT INTO uburezi (urwego_rw_amashuri, umwuga, ishuri_yizemo, amazina_y_umuturage)
      VALUES (?, ?, ?, ?)
    `;

    db.query(sql, [urwego_rw_amashuri, umwuga, ishuri_yizemo, amazina_y_umuturage], (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "Uburezi bwongewe!", id: result.insertId });
    });
  });

  // ➤ READ ALL
  app.get("/uburezi", (req, res) => {
    db.query("SELECT * FROM uburezi", (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json(results);
    });
  });

  // ➤ READ ONE
  app.get("/uburezi/:id", (req, res) => {
    db.query("SELECT * FROM uburezi WHERE uburezi_id = ?", [req.params.id], (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json(results[0]);
    });
  });

  // ➤ UPDATE
  app.put("/uburezi/:id", (req, res) => {
    const { urwego_rw_amashuri, umwuga, ishuri_yizemo, amazina_y_umuturage } = req.body;
    const sql = `
      UPDATE uburezi
      SET urwego_rw_amashuri=?, umwuga=?, ishuri_yizemo=?, amazina_y_umuturage=?
      WHERE uburezi_id=?
    `;
    db.query(sql, [urwego_rw_amashuri, umwuga, ishuri_yizemo, amazina_y_umuturage, req.params.id], (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "Uburezi bwaravuguruwe!" });
    });
  });

  // ➤ DELETE
  app.delete("/uburezi/:id", (req, res) => {
    db.query("DELETE FROM uburezi WHERE uburezi_id = ?", [req.params.id], (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "Uburezi bwasibwe!" });
    });
  });



// ============================================================
// ⚕️ UBUZIMA ENDPOINTS (FULL CRUD)
 // ➤ CREATE
  app.post("/ubuzima", (req, res) => {
    const {
      afite_ubumuga,
      ubwoko_bw_ubumuga,
      indwara_y_igihe_kirekire,
      afite_mutuelle,
      ubwoko_bwa_mutuelle,
      ivuriro_ajyamo,
      amazina_y_umuturage
    } = req.body;

    const sql = `
      INSERT INTO ubuzima 
      (afite_ubumuga, ubwoko_bw_ubumuga, indwara_y_igihe_kirekire, afite_mutuelle, ubwoko_bwa_mutuelle, ivuriro_ajyamo, amazina_y_umuturage)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      sql,
      [afite_ubumuga, ubwoko_bw_ubumuga, indwara_y_igihe_kirekire, afite_mutuelle, ubwoko_bwa_mutuelle, ivuriro_ajyamo, amazina_y_umuturage],
      (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: "Ubuzima bwongewe!", id: result.insertId });
      }
    );
  });

  // ➤ READ ALL
  app.get("/ubuzima", (req, res) => {
    db.query("SELECT * FROM ubuzima", (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json(results);
    });
  });

  // ➤ READ ONE
  app.get("/ubuzima/:id", (req, res) => {
    db.query(
      "SELECT * FROM ubuzima WHERE ubuzima_id = ?",
      [req.params.id],
      (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results[0]);
      }
    );
  });

  // ➤ UPDATE
  app.put("/ubuzima/:id", (req, res) => {
    const {
      afite_ubumuga,
      ubwoko_bw_ubumuga,
      indwara_y_igihe_kirekire,
      afite_mutuelle,
      ubwoko_bwa_mutuelle,
      ivuriro_ajyamo,
      amazina_y_umuturage
    } = req.body;

    const sql = `
      UPDATE ubuzima SET
      afite_ubumuga=?, ubwoko_bw_ubumuga=?, indwara_y_igihe_kirekire=?, 
      afite_mutuelle=?, ubwoko_bwa_mutuelle=?, ivuriro_ajyamo=?, amazina_y_umuturage=?
      WHERE ubuzima_id=?
    `;

    db.query(
      sql,
      [afite_ubumuga, ubwoko_bw_ubumuga, indwara_y_igihe_kirekire, 
       afite_mutuelle, ubwoko_bwa_mutuelle, ivuriro_ajyamo, amazina_y_umuturage, req.params.id],
      (err) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: "Ubuzima bwavuguruwe!" });
      }
    );
  });

  // ➤ DELETE
  app.delete("/ubuzima/:id", (req, res) => {
    db.query(
      "DELETE FROM ubuzima WHERE ubuzima_id = ?",
      [req.params.id],
      (err) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: "Ubuzima bwasibwe!" });
      }
    );
  });




//////////////////////////////////////////////////
// 1️⃣ urubyiruko CRUD
//////////////////////////////////////////////////
app.get("/urubyiruko", (req, res) => {
  db.query("SELECT * FROM urubyiruko", (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.post("/urubyiruko", (req, res) => {
  const q = `INSERT INTO urubyiruko (amazina, imyaka, igitsina, umurimo, nimero_ya_telephone, aderesi, id_number, status) VALUES (?)`;
  const values = [
    req.body.amazina,
    req.body.imyaka,
    req.body.igitsina,
    req.body.umurimo,
    req.body.nimero_ya_telephone,
    req.body.aderesi,
    req.body.id_number,
    req.body.status,
  ];
  db.query(q, [values], (err) => {
    if (err) return res.json(err);
    return res.json("Urubyiruko added successfully");
  });
});

app.put("/urubyiruko/:id", (req, res) => {
  const q = `UPDATE urubyiruko SET amazina=?, imyaka=?, igitsina=?, umurimo=?, nimero_ya_telephone=?, aderesi=?, id_number=?, status=? WHERE id=?`;
  const values = [
    req.body.amazina,
    req.body.imyaka,
    req.body.igitsina,
    req.body.umurimo,
    req.body.nimero_ya_telephone,
    req.body.aderesi,
    req.body.id_number,
    req.body.status,
  ];
  db.query(q, [...values, req.params.id], (err) => {
    if (err) return res.json(err);
    return res.json("Urubyiruko updated successfully");
  });
});

app.delete("/urubyiruko/:id", (req, res) => {
  db.query("DELETE FROM urubyiruko WHERE id=?", [req.params.id], (err) => {
    if (err) return res.json(err);
    return res.json("Urubyiruko deleted successfully");
  });
});

//////////////////////////////////////////////////
// 2️⃣ abasheshe_akanguhe CRUD
//////////////////////////////////////////////////
app.get("/abasheshe_akanguhe", (req, res) => {
  db.query("SELECT * FROM abasheshe_akanguhe", (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.post("/abasheshe_akanguhe", (req, res) => {
  const q = `INSERT INTO abasheshe_akanguhe (amazina, imyaka, igitsina, nimero_ya_telephone, aderesi, ukeneye_ubufasha) VALUES (?)`;
  const values = [
    req.body.amazina,
    req.body.imyaka,
    req.body.igitsina,
    req.body.nimero_ya_telephone,
    req.body.aderesi,
    req.body.ukeneye_ubufasha,
  ];
  db.query(q, [values], (err) => {
    if (err) return res.json(err);
    return res.json("Abasheshe akanguhe added successfully");
  });
});

app.put("/abasheshe_akanguhe/:id", (req, res) => {
  const q = `UPDATE abasheshe_akanguhe SET amazina=?, imyaka=?, igitsina=?, nimero_ya_telephone=?, aderesi=?, ukeneye_ubufasha=? WHERE id=?`;
  const values = [
    req.body.amazina,
    req.body.imyaka,
    req.body.igitsina,
    req.body.nimero_ya_telephone,
    req.body.aderesi,
    req.body.ukeneye_ubufasha,
  ];
  db.query(q, [...values, req.params.id], (err) => {
    if (err) return res.json(err);
    return res.json("Abasheshe akanguhe updated successfully");
  });
});

app.delete("/abasheshe_akanguhe/:id", (req, res) => {
  db.query("DELETE FROM abasheshe_akanguhe WHERE id=?", [req.params.id], (err) => {
    if (err) return res.json(err);
    return res.json("Abasheshe akanguhe deleted successfully");
  });
});

//////////////////////////////////////////////////
// 3️⃣ abana CRUD
//////////////////////////////////////////////////
app.get("/abana", (req, res) => {
  db.query("SELECT * FROM abana", (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.post("/abana", (req, res) => {
  const q = `INSERT INTO abana (amazina, imyaka, igitsina, umubyeyi_wa_mwana, aderesi, aiga) VALUES (?)`;
  const values = [
    req.body.amazina,
    req.body.imyaka,
    req.body.igitsina,
    req.body.umubyeyi_wa_mwana,
    req.body.aderesi,
    req.body.aiga,
  ];
  db.query(q, [values], (err) => {
    if (err) return res.json(err);
    return res.json("Umwana added successfully");
  });
});

app.put("/abana/:id", (req, res) => {
  const q = `UPDATE abana SET amazina=?, imyaka=?, igitsina=?, umubyeyi_wa_mwana=?, aderesi=?, aiga=? WHERE id=?`;
  const values = [
    req.body.amazina,
    req.body.imyaka,
    req.body.igitsina,
    req.body.umubyeyi_wa_mwana,
    req.body.aderesi,
    req.body.aiga,
  ];
  db.query(q, [...values, req.params.id], (err) => {
    if (err) return res.json(err);
    return res.json("Umwana updated successfully");
  });
});

app.delete("/abana/:id", (req, res) => {
  db.query("DELETE FROM abana WHERE id=?", [req.params.id], (err) => {
    if (err) return res.json(err);
    return res.json("Umwana deleted successfully");
  });
});

//////////////////////////////////////////////////
// 4️⃣ abagore_batwite CRUD
//////////////////////////////////////////////////
app.get("/abagore_batwite", (req, res) => {
  db.query("SELECT * FROM abagore_batwite", (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.post("/abagore_batwite", (req, res) => {
  const q = `INSERT INTO abagore_batwite (amazina, imyaka, nimero_ya_telephone, aderesi, amezi_atwite, asuzumwe_kuvuzi) VALUES (?)`;
  const values = [
    req.body.amazina,
    req.body.imyaka,
    req.body.nimero_ya_telephone,
    req.body.aderesi,
    req.body.amezi_atwite,
    req.body.asuzumwe_kuvuzi,
  ];
  db.query(q, [values], (err) => {
    if (err) return res.json(err);
    return res.json("Umugore utwite added successfully");
  });
});

app.put("/abagore_batwite/:id", (req, res) => {
  const q = `UPDATE abagore_batwite SET amazina=?, imyaka=?, nimero_ya_telephone=?, aderesi=?, amezi_atwite=?, asuzumwe_kuvuzi=? WHERE id=?`;
  const values = [
    req.body.amazina,
    req.body.imyaka,
    req.body.nimero_ya_telephone,
    req.body.aderesi,
    req.body.amezi_atwite,
    req.body.asuzumwe_kuvuzi,
  ];
  db.query(q, [...values, req.params.id], (err) => {
    if (err) return res.json(err);
    return res.json("Umugore utwite updated successfully");
  });
});

app.delete("/abagore_batwite/:id", (req, res) => {
  db.query("DELETE FROM abagore_batwite WHERE id=?", [req.params.id], (err) => {
    if (err) return res.json(err);
    return res.json("Umugore utwite deleted successfully");
  });
});

//////////////////////////////////////////////////
// 5️⃣ abana_barimwo_mirire_mibi CRUD
//////////////////////////////////////////////////
app.get("/abana_barimwo_mirire_mibi", (req, res) => {
  db.query("SELECT * FROM abana_barimwo_mirire_mibi", (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.post("/abana_barimwo_mirire_mibi", (req, res) => {
  const q = `INSERT INTO abana_barimwo_mirire_mibi (amazina, imyaka, igitsina, umubyeyi_wa_mwana, aderesi, urwego_rw_imirire, afashijwe) VALUES (?)`;
  const values = [
    req.body.amazina,
    req.body.imyaka,
    req.body.igitsina,
    req.body.umubyeyi_wa_mwana,
    req.body.aderesi,
    req.body.urwego_rw_imirire,
    req.body.afashijwe,
  ];
  db.query(q, [values], (err) => {
    if (err) return res.json(err);
    return res.json("Umwana ufite imirire mibi added successfully");
  });
});

app.put("/abana_barimwo_mirire_mibi/:id", (req, res) => {
  const q = `UPDATE abana_barimwo_mirire_mibi SET amazina=?, imyaka=?, igitsina=?, umubyeyi_wa_mwana=?, aderesi=?, urwego_rw_imirire=?, afashijwe=? WHERE id=?`;
  const values = [
    req.body.amazina,
    req.body.imyaka,
    req.body.igitsina,
    req.body.umubyeyi_wa_mwana,
    req.body.aderesi,
    req.body.urwego_rw_imirire,
    req.body.afashijwe,
  ];
  db.query(q, [...values, req.params.id], (err) => {
    if (err) return res.json(err);
    return res.json("Umwana ufite imirire mibi updated successfully");
  });
});

app.delete("/abana_barimwo_mirire_mibi/:id", (req, res) => {
  db.query("DELETE FROM abana_barimwo_mirire_mibi WHERE id=?", [req.params.id], (err) => {
    if (err) return res.json(err);
    return res.json("Umwana ufite imirire mibi deleted successfully");
  });
});

//////////////////////////////////////////////////
// 6️⃣ abakobwa_babyaye CRUD
//////////////////////////////////////////////////
app.get("/abakobwa_babyaye", (req, res) => {
  db.query("SELECT * FROM abakobwa_babyaye", (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.post("/abakobwa_babyaye", (req, res) => {
  const q = `INSERT INTO abakobwa_babyaye (amazina, imyaka, aderesi, nimero_ya_telephone, umwana_ufite_imyaka, asubiye_mw_ishuri) VALUES (?)`;
  const values = [
    req.body.amazina,
    req.body.imyaka,
    req.body.aderesi,
    req.body.nimero_ya_telephone,
    req.body.umwana_ufite_imyaka,
    req.body.asubiye_mw_ishuri,
  ];
  db.query(q, [values], (err) => {
    if (err) return res.json(err);
    return res.json("Umukobwa wabyaye added successfully");
  });
});

app.put("/abakobwa_babyaye/:id", (req, res) => {
  const q = `UPDATE abakobwa_babyaye SET amazina=?, imyaka=?, aderesi=?, nimero_ya_telephone=?, umwana_ufite_imyaka=?, asubiye_mw_ishuri=? WHERE id=?`;
  const values = [
    req.body.amazina,
    req.body.imyaka,
    req.body.aderesi,
    req.body.nimero_ya_telephone,
    req.body.umwana_ufite_imyaka,
    req.body.asubiye_mw_ishuri,
  ];
  db.query(q, [...values, req.params.id], (err) => {
    if (err) return res.json(err);
    return res.json("Umukobwa wabyaye updated successfully");
  });
});

app.delete("/abakobwa_babyaye/:id", (req, res) => {
  db.query("DELETE FROM abakobwa_babyaye WHERE id=?", [req.params.id], (err) => {
    if (err) return res.json(err);
    return res.json("Umukobwa wabyaye deleted successfully");
  });
});

//////////////////////////////////////////////////
// 7️⃣ urubyiruko_rukora CRUD
//////////////////////////////////////////////////
app.get("/urubyiruko_rukora", (req, res) => {
  db.query("SELECT * FROM urubyiruko_rukora", (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.post("/urubyiruko_rukora", (req, res) => {
  const q = `INSERT INTO urubyiruko_rukora (amazina, imyaka, igitsina, umurimo, nimero_ya_telephone, aderesi, ubuhanga) VALUES (?)`;
  const values = [
    req.body.amazina,
    req.body.imyaka,
    req.body.igitsina,
    req.body.umurimo,
    req.body.nimero_ya_telephone,
    req.body.aderesi,
    req.body.ubuhanga,
  ];
  db.query(q, [values], (err) => {
    if (err) return res.json(err);
    return res.json("Urubyiruko rukora added successfully");
  });
});

app.put("/urubyiruko_rukora/:id", (req, res) => {
  const q = `UPDATE urubyiruko_rukora SET amazina=?, imyaka=?, igitsina=?, umurimo=?, nimero_ya_telephone=?, aderesi=?, ubuhanga=? WHERE id=?`;
  const values = [
    req.body.amazina,
    req.body.imyaka,
    req.body.igitsina,
    req.body.umurimo,
    req.body.nimero_ya_telephone,
    req.body.aderesi,
    req.body.ubuhanga,
  ];
  db.query(q, [...values, req.params.id], (err) => {
    if (err) return res.json(err);
    return res.json("Urubyiruko rukora updated successfully");
  });
});

app.delete("/urubyiruko_rukora/:id", (req, res) => {
  db.query("DELETE FROM urubyiruko_rukora WHERE id=?", [req.params.id], (err) => {
    if (err) return res.json(err);
    return res.json("Urubyiruko rukora deleted successfully");
  });
});

//////////////////////////////////////////////////
// 8️⃣ urubyiruko_rudafite_akazi CRUD
//////////////////////////////////////////////////
app.get("/urubyiruko_rudafite_akazi", (req, res) => {
  db.query("SELECT * FROM urubyiruko_rudafite_akazi", (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.post("/urubyiruko_rudafite_akazi", (req, res) => {
  const q = `INSERT INTO urubyiruko_rudafite_akazi (amazina, imyaka, igitsina, aderesi, nimero_ya_telephone, impamvu_yubushomeri, yigeze_kora, yifuza_umurimo_mwene) VALUES (?)`;
  const values = [
    req.body.amazina,
    req.body.imyaka,
    req.body.igitsina,
    req.body.aderesi,
    req.body.nimero_ya_telephone,
    req.body.impamvu_yubushomeri,
    req.body.yigeze_kora,
    req.body.yifuza_umurimo_mwene,
  ];
  db.query(q, [values], (err) => {
    if (err) return res.json(err);
    return res.json("Urubyiruko rudafite akazi added successfully");
  });
});

app.put("/urubyiruko_rudafite_akazi/:id", (req, res) => {
  const q = `UPDATE urubyiruko_rudafite_akazi SET amazina=?, imyaka=?, igitsina=?, aderesi=?, nimero_ya_telephone=?, impamvu_yubushomeri=?, yigeze_kora=?, yifuza_umurimo_mwene=? WHERE id=?`;
  const values = [
    req.body.amazina,
    req.body.imyaka,
    req.body.igitsina,
    req.body.aderesi,
    req.body.nimero_ya_telephone,
    req.body.impamvu_yubushomeri,
    req.body.yigeze_kora,
    req.body.yifuza_umurimo_mwene,
  ];
  db.query(q, [...values, req.params.id], (err) => {
    if (err) return res.json(err);
    return res.json("Urubyiruko rudafite akazi updated successfully");
  });
});

app.delete("/urubyiruko_rudafite_akazi/:id", (req, res) => {
  db.query("DELETE FROM urubyiruko_rudafite_akazi WHERE id=?", [req.params.id], (err) => {
    if (err) return res.json(err);
    return res.json("Urubyiruko rudafite akazi deleted successfully");
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Server y’Umudugudu ikora kuri http://localhost:5000`);
});
