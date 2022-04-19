import Head from "next/head";
import styles from "../styles/Home.module.css";
import { google } from "googleapis";

export async function getServerSideProps({ query }) {
  const target = ["https://www.googleapis.com/auth/spreadsheets.readonly"];
  const jwt = new google.auth.JWT(
    process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
    null,
    process.env.GOOGLE_SHEETS_PRIVATE_KEY || "",
    target
  );
  // LOCAL DEV = (process.env.GOOGLE_SHEETS_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
  // PROD = process.env.GOOGLE_SHEETS_PRIVATE_KEY || "",
  const sheets = google.sheets({ version: "v4", auth: jwt });
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SPREADSHEET_ID,
    range: "Sheet1!A2:B",
  });

  const content = response.data.values.reverse();

  return {
    props: {
      content,
    },
  };
}

export default function Home({ content }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>bates venditti</title>
        <meta name="description" content="Bates' recent thoughts" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div>
        <a href="https://cooltext.com">
          <img
            src="https://images.cooltext.com/5596992.png"
            width="920"
            height="114"
            alt="bates is googling..."
          />
        </a>

        {content.map((v) => (
          <a key={v[0]} href={"//www.google.com/search?q=" + v[0]}>
            <div className={styles.card}>
              <p className={styles.content}>{v[0]}</p>
              <p className={styles.date}>{v[1]}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
