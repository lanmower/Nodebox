import { Nodebox } from "@codesandbox/nodebox";

const previewIframe = document.getElementById("preview-iframe");
console.log('test')
async function init() {
  // Create a new Nodebox runtime to evaluate Node.js code.
  const runtime = new Nodebox({
    // Provide a reference to the iframe on the page
    // that will mount the Nodebox runtime, allowing it to
    // communicate with the rest of the application.
    iframe: document.getElementById("nodebox-iframe"),
  });

  // Establish a connection to the runtime.
  await runtime.connect();

  // Populate the file system with a Next.js project.
  await runtime.fs.init({
    "package.json": JSON.stringify({
      name: "nextjs-preview",
      dependencies: {
        "@next/swc-wasm-nodejs": "12.1.6",
        next: "12.1.6",
        react: "18.2.0",
        "react-dom": "18.2.0",
      },
    }),
    // On the index page, let's illustrate how server-side props
    // propagate to your page component in Next.js.
    "pages/index.jsx": `
import styles from '../styles/Home.module.css';

export default function Homepage({ name }) {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Welcome to My Fancy Demo!</h1>
      </header>
      <main className={styles.main}>
        <h2>Hello, {name}</h2>
        <p className={styles.description}>
          The name "{name}" has been received from server-side props.
        </p>
      </main>
      <footer className={styles.footer}>
        <p>Powered by Next.js</p>
      </footer>
    </div>
  )
}

export async function getServerSideProps() {
  return {
    props: {
      name: 'John'
    }
  }
}
    `,
    "styles/Home.module.css": `
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  font-family: 'Arial', sans-serif;
  background: linear-gradient(135deg, #f0e7f4, #e2e2e2);
  padding: 20px;
}

.header {
  background: #6a4eae;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  color: white;
  width: 100%;
}

.title {
  margin: 0;
  font-size: 2.5rem;
}

.main {
  text-align: center;
  margin: 20px 0;
}

.description {
  border-top: 1px solid #6a4eae;
  padding: 10px;
  margin-top: 10px;
  color: #333;
}

.footer {
  margin-top: auto;
  padding: 20px;
  text-align: center;
  font-size: 0.875rem;
}
    `,
});
  // Create a shell where we will be running Next.js.
  const shell = runtime.shell.create();

  // Start the Next.js development server.
  const nextProcess = await shell.runCommand("next", ["dev"]);

  // Assign the preview URL for Next.js development server
  // to the preview iframe on the page.
  const previewInfo = await runtime.preview.getByShellId(nextProcess.id);
  previewIframe.setAttribute("src", previewInfo.url);
}

init();
