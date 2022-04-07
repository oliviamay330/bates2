import Head from "next/head";
import styles from "../styles/Home.module.css";
import { google } from "googleapis";

export async function getServerSideProps({ query }) {
  const auth = await google.auth.getClient({
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });

  const sheets = google.sheets({ version: "v4", auth });

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SHEET_ID,
    range: "Sheet1!A2:B",
  });

  const content = response.data.values.reverse();
  console.log("stuff", content);

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
        <title>Stream of Consciousness</title>
        <meta name="description" content="Emily's recent thoughts" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div>
        <h1 className={styles.title}>What is Emily thinking...</h1>
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
