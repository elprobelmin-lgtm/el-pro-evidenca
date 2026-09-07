"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://hcshvgopiwgbenbsrckr.supabase.co",
  "sb_publishable_cArVbfA1yYVp4gRyr6Ajrw_ngx__jND"
);

const TOKEN_KEY = "elpro_session_token";

const C = {
  bg: "#090909",
  card: "#151515",
  card2: "#1b1b1b",
  border: "#303030",
  text: "#ffffff",
  muted: "#999999",
  orange: "#ff7412",
  red: "#ff555f",
  green: "#42d77d",
};

function first(data) {
  return Array.isArray(data) ? data[0] : data;
}

async function rpc(name, args = {}) {
  const { data, error } = await supabase.rpc(name, args);
  if (error) throw new Error(error.message);
  return data;
}

function hours(minutes) {
  const m = Number(minutes || 0);
  return `${Math.floor(m / 60)} h ${m % 60} min`;
}

function dateSI(value) {
  if (!value) return "";
  return new Date(`${value}T12:00:00`).toLocaleDateString("sl-SI");
}

const S = {
  page: {
    minHeight: "100vh",
    background: C.bg,
    color: C.text,
    fontFamily: "Arial, sans-serif",
  },
  wrap: {
    width: "min(920px, 100%)",
    margin: "0 auto",
    padding: "22px 18px 80px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    paddingBottom: 20,
    borderBottom: `1px solid ${C.border}`,
  },
  logoRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  logo: {
    width: 52,
    height: 52,
    borderRadius: 16,
    background: C.orange,
    color: "#080808",
    display: "grid",
    placeItems: "center",
    fontSize: 34,
    fontWeight: 900,
  },
  nav: {
    display: "flex",
    gap: 8,
    overflowX: "auto",
    margin: "20px 0",
    paddingBottom: 4,
  },
  btn: {
    border: 0,
    borderRadius: 12,
    padding: "12px 16px",
    fontWeight: 800,
  },
  card: {
    background: C.card,
    border: `1px solid ${C.border}`,
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
  },
  input: {
    width: "100%",
    padding: "14px 15px",
    borderRadius: 12,
    border: `1px solid ${C.border}`,
    background: C.card2,
    color: C.text,
    marginTop: 7,
    marginBottom: 14,
    fontSize: 16,
  },
  label: {
    display: "block",
    fontWeight: 700,
    color: "#ddd",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    padding: "13px 0",
    borderBottom: `1px solid ${C.border}`,
  },
};

function Logo() {
  return (
    <div style={S.logoRow}>
      <div style={S.logo}>ϟ</div>
      <div>
        <div style={{ fontSize: 25, fontWeight: 900 }}>EL-PRO</div>
        <div
          style={{
            color: C.orange,
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: 3,
          }}
        >
          ELEKTROINŠTALACIJE
        </div>
      </div>
    </div>
  );
}

function Message({ error, ok }) {
  if (!error && !ok) return null;

  return (
    <div
      style={{
        padding: 12,
        borderRadius: 11,
        margin: "10px 0",
        background: error ? "#351519" : "#12301e",
        color: error ? "#ff8990" : "#82e8aa",
      }}
    >
      {error || ok}
    </div>
  );
}

function Login({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError("");

    if (!name.trim()) return setError("Vpišite ime in priimek.");
    if (!/^\d{4,6}$/.test(pin))
      return setError("PIN mora imeti 4–6 številk.");

    setBusy(true);

    try {
      const data = await rpc(
        mode === "login" ? "elpro_login" : "elpro_register",
        {
          p_name: name.trim(),
          p_pin: pin,
        }
      );

      const user = first(data);

      if (!user?.token) throw new Error("Prijava ni uspela.");

      localStorage.setItem(TOKEN_KEY, user.token);
      onLogin(user.token);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main
      style={{
        ...S.page,
        display: "grid",
        placeItems: "center",
        padding: 18,
      }}
    >
      <div style={{ width: "min(480px,100%)" }}>
        <div style={{ ...S.card, padding: 25 }}>
          <Logo />

          <p
            style={{
              color: C.muted,
              textAlign: "center",
              lineHeight: 1.6,
              margin: "28px 0",
            }}
          >
            Evidenca delovnega časa in odsotnosti za zaposlene.
          </p>

          <div
            style={{
              display: "flex",
              background: "#202020",
              padding: 5,
              borderRadius: 14,
              marginBottom: 20,
            }}
          >
            {[
              ["login", "Prijava"],
              ["register", "Registracija"],
            ].map(([id, text]) => (
              <button
                key={id}
                onClick={() => setMode(id)}
                style={{
                  ...S.btn,
                  flex: 1,
                  background: mode === id ? C.orange : "transparent",
                  color: mode === id ? "#111" : C.muted,
                }}
              >
                {text}
              </button>
            ))}
          </div>

          <form onSubmit={submit}>
            <label style={S.label}>
              Ime in priimek
              <input
                style={S.input}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Janez Novak"
              />
            </label>

            <label style={S.label}>
              PIN koda
              <input
                style={S.input}
                type="password"
                inputMode="numeric"
                value={pin}
                onChange={(e) =>
                  setPin(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                placeholder="••••"
              />
            </label>

            <Message error={error} />

            <button
              disabled={busy}
              style={{
                ...S.btn,
                width: "100%",
                background: C.orange,
                color: "#111",
                fontSize: 17,
              }}
            >
              {busy
                ? "Počakajte..."
                : mode === "login"
                ? "Prijava"
                : "Registracija"}
            </button>
          </form>

          <p
            style={{
              color: "#666",
              fontSize: 12,
              textAlign: "center",
              marginTop: 20,
            }}
          >
            Administrator: Belmin Bečirović
          </p>
        </div>
      </div>
    </main>
  );
}

function Work({ token }) {
  const today = new Date().toISOString().slice(0, 10);

  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    date: today,
    object: "",
    start: "07:00",
    end: "15:00",
    breakMinutes: "30",
    note: "",
  });

  const [error, setError] = useState("");
  const [ok, setOk] = useState("");

  async function load() {
    try {
      const data = await rpc("elpro_my_work", {
        p_token: token,
        p_from: null,
        p_to: null,
      });

      setItems(data || []);
    } catch (e) {
      setError(e.message);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function save(e) {
    e.preventDefault();
    setError("");
    setOk("");

    try {
      await rpc("elpro_add_work", {
        p_token: token,
        p_work_date: form.date,
        p_object_name: form.object.trim(),
        p_start_time: form.start,
        p_end_time: form.end,
        p_break_minutes: Number(form.breakMinutes || 0),
        p_note: form.note || null,
      });

      setForm({
        ...form,
        object: "",
        note: "",
      });

      setOk("Delovne ure so shranjene.");
      await load();
    } catch (e) {
      setError(e.message);
    }
  }

  async function remove(id) {
    if (!confirm("Izbrišem ta vnos?")) return;

    try {
      await rpc("elpro_delete_work", {
        p_token: token,
        p_work_id: id,
      });

      load();
    } catch (e) {
      setError(e.message);
    }
  }

  const total = useMemo(
    () => items.reduce((a, b) => a + Number(b.total_minutes || 0), 0),
    [items]
  );

  return (
    <>
      <h1>Delovne ure</h1>

      <div style={S.card}>
        <h2>Nov vnos</h2>

        <form onSubmit={save}>
          <label style={S.label}>
            Datum
            <input
              style={S.input}
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
          </label>

          <label style={S.label}>
            Objekt / projekt
            <input
              style={S.input}
              value={form.object}
              onChange={(e) => setForm({ ...form, object: e.target.value })}
              placeholder="npr. Gorenje Velenje"
            />
          </label>

          <label style={S.label}>
            Začetek
            <input
              style={S.input}
              type="time"
              value={form.start}
              onChange={(e) => setForm({ ...form, start: e.target.value })}
            />
          </label>

          <label style={S.label}>
            Konec
            <input
              style={S.input}
              type="time"
              value={form.end}
              onChange={(e) => setForm({ ...form, end: e.target.value })}
            />
          </label>

          <label style={S.label}>
            Pavza / malica (min)
            <input
              style={S.input}
              type="number"
              value={form.breakMinutes}
              onChange={(e) =>
                setForm({ ...form, breakMinutes: e.target.value })
              }
            />
          </label>

          <label style={S.label}>
            Opomba
            <input
              style={S.input}
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              placeholder="Neobvezno"
            />
          </label>

          <Message error={error} ok={ok} />

          <button
            style={{
              ...S.btn,
              background: C.orange,
              color: "#111",
              width: "100%",
            }}
          >
            Shrani ure
          </button>
        </form>
      </div>

      <div style={S.card}>
        <h2>Moja evidenca</h2>

        <p style={{ color: C.orange, fontWeight: 800 }}>
          Skupaj: {hours(total)}
        </p>

        {items.length === 0 ? (
          <p style={{ color: C.muted }}>Ni vnosov.</p>
        ) : (
          items.map((x) => (
            <div style={S.row} key={x.id}>
              <div>
                <b>{x.object_name}</b>
                <div style={{ color: C.muted, marginTop: 5 }}>
                  {dateSI(x.work_date)} · {x.start_time?.slice(0, 5)}–
                  {x.end_time?.slice(0, 5)}
                </div>
              </div>

              <div style={{ textAlign: "right" }}>
                <b>{hours(x.total_minutes)}</b>
                <br />
                <button
                  onClick={() => remove(x.id)}
                  style={{
                    border: 0,
                    background: "transparent",
                    color: C.red,
                    marginTop: 7,
                  }}
                >
                  Izbriši
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}

function Leaves({ token }) {
  const today = new Date().toISOString().slice(0, 10);

  const [items, setItems] = useState([]);
  const [type, setType] = useState("annual");
  const [from, setFrom] = useState(today);
  const [to, setTo] = useState(today);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");

  async function load() {
    try {
      setItems((await rpc("elpro_my_leaves", { p_token: token })) || []);
    } catch (e) {
      setError(e.message);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function send(e) {
    e.preventDefault();
    setError("");
    setOk("");

    try {
      await rpc("elpro_request_leave", {
        p_token: token,
        p_leave_type: type,
        p_date_from: from,
        p_date_to: to,
        p_note: note || null,
      });

      setNote("");
      setOk("Zahtevek je poslan.");
      load();
    } catch (e) {
      setError(e.message);
    }
  }

  const names = {
    annual: "Letni dopust",
    sick: "Bolniška",
    other: "Druga odsotnost",
  };

  return (
    <>
      <h1>Odsotnosti</h1>

      <div style={S.card}>
        <h2>Nov zahtevek</h2>

        <form onSubmit={send}>
          <label style={S.label}>
            Vrsta
            <select
              style={S.input}
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="annual">Letni dopust</option>
              <option value="sick">Bolniška</option>
              <option value="other">Drugo</option>
            </select>
          </label>

          <label style={S.label}>
            Od
            <input
              style={S.input}
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            />
          </label>

          <label style={S.label}>
            Do
            <input
              style={S.input}
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
          </label>

          <label style={S.label}>
            Opomba
            <input
              style={S.input}
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </label>

          <Message error={error} ok={ok} />

          <button
            style={{
              ...S.btn,
              background: C.orange,
              color: "#111",
              width: "100%",
            }}
          >
            Pošlji zahtevek
          </button>
        </form>
      </div>

      <div style={S.card}>
        <h2>Moji zahtevki</h2>

        {items.length === 0 ? (
          <p style={{ color: C.muted }}>Ni zahtevkov.</p>
        ) : (
          items.map((x) => (
            <div style={S.row} key={x.id}>
              <div>
                <b>{names[x.leave_type] || x.leave_type}</b>
                <div style={{ color: C.muted, marginTop: 5 }}>
                  {dateSI(x.date_from)} – {dateSI(x.date_to)}
                </div>
              </div>

              <b
                style={{
                  color:
                    x.status === "approved"
                      ? C.green
                      : x.status === "rejected"
                      ? C.red
                      : "#e5ad32",
                }}
              >
                {x.status === "approved"
                  ? "Odobreno"
                  : x.status === "rejected"
                  ? "Zavrnjeno"
                  : "Na čakanju"}
              </b>
            </div>
          ))
        )}
      </div>
    </>
  );
}

function Admin({ token }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  async function load() {
    try {
      setError("");
      setData(first(await rpc("elpro_admin_overview", { p_token: token })));
    } catch (e) {
      setError(e.message);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function leaveStatus(id, status) {
    try {
      await rpc("elpro_set_leave_status", {
        p_token: token,
        p_leave_id: id,
        p_status: status,
        p_admin_note: null,
      });

      load();
    } catch (e) {
      setError(e.message);
    }
  }

  async function userActive(id, active) {
    try {
      await rpc("elpro_set_user_active", {
        p_token: token,
        p_user_id: id,
        p_active: active,
      });

      load();
    } catch (e) {
      setError(e.message);
    }
  }

  if (!data) {
    return (
      <>
        <h1>Administracija</h1>
        <Message error={error} />
        <p>Nalaganje...</p>
      </>
    );
  }

  const employees = data.employees || [];
  const work = data.work || [];
  const leaves = data.leaves || [];

  return (
    <>
      <h1>Administracija</h1>
      <Message error={error} />

      <div style={S.card}>
        <h2>Zaposleni</h2>

        {employees.map((x) => (
          <div style={S.row} key={x.id}>
            <div>
              <b>{x.name}</b>
              <div style={{ color: C.muted }}>
                {x.role === "admin" ? "Administrator" : "Zaposleni"}
              </div>
            </div>

            {x.role !== "admin" && (
              <button
                onClick={() => userActive(x.id, !x.active)}
                style={{
                  ...S.btn,
                  background: x.active ? "#351519" : "#143120",
                  color: x.active ? C.red : C.green,
                }}
              >
                {x.active ? "Deaktiviraj" : "Aktiviraj"}
              </button>
            )}
          </div>
        ))}
      </div>

      <div style={S.card}>
        <h2>Zahtevki</h2>

        {leaves.length === 0 ? (
          <p style={{ color: C.muted }}>Ni zahtevkov.</p>
        ) : (
          leaves.map((x) => (
            <div style={S.row} key={x.id}>
              <div>
                <b>{x.user_name}</b>
                <div style={{ color: C.muted }}>
                  {dateSI(x.date_from)} – {dateSI(x.date_to)}
                </div>
              </div>

              {x.status === "pending" ? (
                <div>
                  <button
                    onClick={() => leaveStatus(x.id, "approved")}
                    style={{
                      ...S.btn,
                      background: "#153b26",
                      color: C.green,
                      marginRight: 6,
                    }}
                  >
                    ✓
                  </button>

                  <button
                    onClick={() => leaveStatus(x.id, "rejected")}
                    style={{
                      ...S.btn,
                      background: "#38181c",
                      color: C.red,
                    }}
                  >
                    ×
                  </button>
                </div>
              ) : (
                <b>{x.status}</b>
              )}
            </div>
          ))
        )}
      </div>

      <div style={S.card}>
        <h2>Vse delovne ure</h2>

        {work.map((x) => (
          <div style={S.row} key={x.id}>
            <div>
              <b>{x.user_name}</b>
              <div style={{ color: C.muted }}>
                {x.object_name} · {dateSI(x.work_date)}
              </div>
            </div>

            <b>{hours(x.total_minutes)}</b>
          </div>
        ))}
      </div>
    </>
  );
}

function Profile({ token, user }) {
  const [oldPin, setOldPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");

  async function change(e) {
    e.preventDefault();

    try {
      await rpc("elpro_change_pin", {
        p_token: token,
        p_old_pin: oldPin,
        p_new_pin: newPin,
      });

      setOldPin("");
      setNewPin("");
      setError("");
      setOk("PIN je spremenjen.");
    } catch (e) {
      setOk("");
      setError(e.message);
    }
  }

  return (
    <>
      <h1>Profil</h1>

      <div style={S.card}>
        <h2>{user.name}</h2>
        <p style={{ color: C.muted }}>
          {user.role === "admin" ? "Administrator" : "Zaposleni"}
        </p>

        <form onSubmit={change}>
          <label style={S.label}>
            Trenutni PIN
            <input
              style={S.input}
              type="password"
              inputMode="numeric"
              value={oldPin}
              onChange={(e) => setOldPin(e.target.value)}
            />
          </label>

          <label style={S.label}>
            Novi PIN
            <input
              style={S.input}
              type="password"
              inputMode="numeric"
              value={newPin}
              onChange={(e) => setNewPin(e.target.value)}
            />
          </label>

          <Message error={error} ok={ok} />

          <button
            style={{
              ...S.btn,
              background: C.orange,
              color: "#111",
            }}
          >
            Spremeni PIN
          </button>
        </form>
      </div>
    </>
  );
}

function Dashboard({ token, user }) {
  const [work, setWork] = useState([]);
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    Promise.all([
      rpc("elpro_my_work", {
        p_token: token,
        p_from: null,
        p_to: null,
      }),
      rpc("elpro_my_leaves", {
        p_token: token,
      }),
    ])
      .then(([w, l]) => {
        setWork(w || []);
        setLeaves(l || []);
      })
      .catch(() => {});
  }, []);

  const mins = work.reduce((a, b) => a + Number(b.total_minutes || 0), 0);

  return (
    <>
      <h1>Dobrodošli, {user.name.split(" ")[0]}</h1>
      <p style={{ color: C.muted }}>Pregled vaših evidenc.</p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2,1fr)",
          gap: 12,
          marginTop: 20,
        }}
      >
        <div style={S.card}>
          <b style={{ color: C.orange, fontSize: 27 }}>{work.length}</b>
          <div style={{ color: C.muted, marginTop: 8 }}>Vnosov ur</div>
        </div>

        <div style={S.card}>
          <b style={{ color: C.orange, fontSize: 27 }}>{hours(mins)}</b>
          <div style={{ color: C.muted, marginTop: 8 }}>Skupaj</div>
        </div>

        <div style={S.card}>
          <b style={{ color: C.orange, fontSize: 27 }}>
            {leaves.filter((x) => x.status === "pending").length}
          </b>
          <div style={{ color: C.muted, marginTop: 8 }}>Na čakanju</div>
        </div>

        <div style={S.card}>
          <b style={{ color: C.orange, fontSize: 27 }}>
            {leaves.filter((x) => x.status === "approved").length}
          </b>
          <div style={{ color: C.muted, marginTop: 8 }}>Odobreno</div>
        </div>
      </div>
    </>
  );
}

export default function Home() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState("home");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = localStorage.getItem(TOKEN_KEY);

    if (t) setToken(t);
    else setLoading(false);
  }, []);

  useEffect(() => {
    if (!token) return;

    setLoading(true);

    rpc("elpro_me", {
      p_token: token,
    })
      .then((data) => {
        const u = first(data);

        if (!u?.id) throw new Error("Neveljavna seja.");

        setUser(u);
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, [token]);

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
    setTab("home");
  }

  if (loading) {
    return (
      <main
        style={{
          ...S.page,
          display: "grid",
          placeItems: "center",
        }}
      >
        <div>
          <Logo />
          <p style={{ color: C.muted, textAlign: "center" }}>Nalaganje...</p>
        </div>
      </main>
    );
  }

  if (!user) return <Login onLogin={setToken} />;

  const tabs =
    user.role === "admin"
      ? [
          ["home", "Pregled"],
          ["work", "Ure"],
          ["leave", "Odsotnosti"],
          ["admin", "Admin"],
          ["profile", "Profil"],
        ]
      : [
          ["home", "Domov"],
          ["work", "Ure"],
          ["leave", "Odsotnosti"],
          ["profile", "Profil"],
        ];

  return (
    <main style={S.page}>
      <div style={S.wrap}>
        <header style={S.header}>
          <Logo />

          <div style={{ textAlign: "right" }}>
            <b>{user.name}</b>
            <div style={{ color: C.muted, fontSize: 12 }}>
              {user.role === "admin" ? "Administrator" : "Zaposleni"}
            </div>

            <button
              onClick={logout}
              style={{
                border: 0,
                background: "transparent",
                color: C.orange,
                marginTop: 6,
              }}
            >
              Odjava
            </button>
          </div>
        </header>

        <div style={S.nav}>
          {tabs.map(([id, label]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              style={{
                ...S.btn,
                whiteSpace: "nowrap",
                background: tab === id ? C.orange : C.card,
                color: tab === id ? "#111" : C.muted,
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === "home" && <Dashboard token={token} user={user} />}
        {tab === "work" && <Work token={token} />}
        {tab === "leave" && <Leaves token={token} />}
        {tab === "admin" && user.role === "admin" && <Admin token={token} />}
        {tab === "profile" && (
          <Profile token={token} user={user} />
        )}
      </div>
    </main>
  );
}
