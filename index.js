
import { Nodebox } from "@codesandbox/nodebox";

const previewIframe = document.getElementById("preview-iframe");

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
export default function Homepage({ name }) {
  return (
    <div>
      <h1>Hello, {name}</h1>
      <p>The name "{name}" has been received from server-side props.</p>
    </div>
  )
}

export function getServerSideProps() {
  return {
    props: {
      name: 'John'
    }
  }
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
