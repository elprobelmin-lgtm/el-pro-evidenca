export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0b0b0b",
        color: "#ffffff",
        fontFamily: "Arial, sans-serif",
        padding: "24px",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        <header
          style={{
            borderBottom: "2px solid #f58220",
            paddingBottom: "20px",
            marginBottom: "30px",
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: "34px",
              fontWeight: "800",
            }}
          >
            EL-PRO
          </h1>

          <p
            style={{
              color: "#f58220",
              marginTop: "6px",
              fontWeight: "bold",
            }}
          >
            ELEKTROINŠTALACIJE
          </p>

          <p style={{ color: "#aaa" }}>
            Evidenca zaposlenih, delovnih ur in zahtevkov
          </p>
        </header>

        <h2 style={{ marginBottom: "20px" }}>
          Nadzorna plošča
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
          }}
        >
          <Card
            title="Zaposleni"
            description="Pregled in upravljanje zaposlenih"
          />

          <Card
            title="Delovne ure"
            description="Vnos in pregled opravljenih ur"
          />

          <Card
            title="Projekti"
            description="Pregled aktivnih projektov"
          />

          <Card
            title="Zahtevki"
            description="Dopusti, odsotnosti in drugi zahtevki"
          />
        </div>

        <div
          style={{
            marginTop: "35px",
            padding: "20px",
            background: "#151515",
            borderRadius: "14px",
            border: "1px solid #333",
          }}
        >
          <h3 style={{ marginTop: 0 }}>
            EL-PRO Elektroinštalacije
          </h3>

          <p style={{ color: "#aaa", marginBottom: 0 }}>
            Interni sistem za vodenje zaposlenih in delovnih evidenc.
          </p>
        </div>
      </div>
    </main>
  );
}

function Card({ title, description }) {
  return (
    <div
      style={{
        background: "#151515",
        border: "1px solid #333",
        borderRadius: "14px",
        padding: "22px",
      }}
    >
      <h3
        style={{
          marginTop: 0,
          marginBottom: "10px",
          color: "#f58220",
        }}
      >
        {title}
      </h3>

      <p
        style={{
          color: "#aaa",
          margin: 0,
          lineHeight: "1.5",
        }}
      >
        {description}
      </p>
    </div>
  );
              }
