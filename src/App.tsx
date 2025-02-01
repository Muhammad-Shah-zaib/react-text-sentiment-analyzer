import "./App.css";
import SentimentAnalyzer from "./components/SentimentAnalyzert";

function App() {
  return (
    <div className="max-h-[90vh] overflow-hidden sm:max-h-auto flex pb-4 flex-col items-between justify-center items-center min-h-[90vh] md:min-h-screen min-w-screen bg-zinc-900 px-4">
      <header></header>
      <section className="max-w-7xl min-h-[500px] w-full my-auto  overflow-auto flex flex-col gap-4 ">
        <SentimentAnalyzer />
      </section>
      <footer className="flex justify-between w-full">
        <div id="socials">
          <a
            href="https://www.linkedin.com/in/muhammad-shahzaib-311724292/"
            target="_blank"
          >
            <i className="fa-brands fa-linkedin fa-xl text-zinc-600 hover:text-sky-700"></i>
          </a>
        </div>
        <a
          href="https://muhammad-shah-zaib.vercel.app"
          target="_blank"
          className="text-zinc-600 hover:text-zinc-400 hover:underline"
        >
          Developed by Shahzaib
        </a>
      </footer>
    </div>
  );
}

export default App;
