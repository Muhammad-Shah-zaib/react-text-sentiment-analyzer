import React, { useState, useEffect, useRef } from "react";
import * as toxicity from "@tensorflow-models/toxicity";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl";
import ResultDisplay from "./ResultDisplay";
import { toast, ToastContainer } from "react-toastify"; // Import toast
import "react-toastify/dist/ReactToastify.css"; // Import styles

interface Prediction {
  label: string;
  results: {
    probabilities: { "0": number; "1": number };
    match: boolean | null;
  }[];
}

const SentimentAnalyzer: React.FC = () => {
  const [model, setModel] = useState<toxicity.ToxicityClassifier | null>(null);
  const [text, setText] = useState<string>("");
  const [result, setResult] = useState<Prediction[] | null>(null);
  const [threshold, setThreshold] = useState<number>(0.5);
  const [thresholdInput, setThresholdInput] = useState<string>(
    threshold.toString()
  );
  const [isAnalyzeClicked, setIsAnalyzeClicked] = useState<boolean>(false);
  const [isModelLoaded, setIsModelLoaded] = useState<boolean>(false); // New state for model loading
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false); // State to handle popup
  const updateThresholdRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const loadModel = async () => {
      try {
        await tf.setBackend("webgl");
        await tf.ready();
        const labels = [
          "identity_attack",
          "insult",
          "obscene",
          "severe_toxicity",
          "sexual_explicit",
          "threat",
          "toxicity",
        ];
        const loadedModel = await toxicity.load(threshold, labels);
        setModel(loadedModel);
        setIsModelLoaded(true); // Set the model as loaded
        toast.success("Model Loaded Successfully!"); // Success toast
      } catch (error) {
        console.error("Error loading model:", error);
        toast.error("Error loading the model!"); // Error toast
      }
    };
    loadModel();
  }, [threshold]);

  const analyzeText = async () => {
    if (!model || text.trim() === "") return;
    const predictions = await model.classify([text]);
    // Convert probabilities to a plain object
    const formattedPredictions: Prediction[] = predictions.map(
      (prediction) => ({
        label: prediction.label,
        results: prediction.results.map((result) => ({
          probabilities: {
            "0": result.probabilities[0], // Extract first value from Float32Array
            "1": result.probabilities[1], // Extract second value from Float32Array
          },
          match: result.match,
        })),
      })
    );

    setResult(formattedPredictions);
    setIsPopupOpen(true); // Open popup on results
  };

  const updateThreshold = () => {
    const thresholdValue = parseFloat(thresholdInput);
    if (thresholdValue >= 0 && thresholdValue <= 1) {
      setThreshold(thresholdValue);
      setModel(null);
      toast.success("Threshold Updated Successfully!"); // Success toast for update
    } else {
      setThresholdInput(""); // Reset the input if invalid
      toast.error("Please enter a valid threshold value between 0 and 1."); // Error toast for invalid input
    }
  };

  const handleAnalyzeClick = () => {
    setIsAnalyzeClicked(true);
    setTimeout(() => setIsAnalyzeClicked(false), 200); // Reset after 200ms
  };

  return (
    <div className="sm:min-h-[500px] w-full grid sm:grid-cols-2 sm:gap-0 gap-10 py-10 text-white">
      {/* Title */}
      <div className="flex justify-center h-full flex-col gap-4">
        <span className="cursor-pointer">
          <h3 className="rounded-full bg-emerald-500 inline px-4 py-1.5 text-zinc-900 hover:bg-transparent hover:text-emerald-500 font-semibold font-mono transition-all duration-300 border-2 border-emerald-500">
            Using Toxicity Model
          </h3>
        </span>
        <h1 className="text-5xl md:text-7xl font-bold">
          Text{" "}
          <span className="bg-gradient-to-r from-green-400 via-green-500 to-emerald-400 bg-clip-text text-transparent">
            Sentiment Analysis
          </span>
        </h1>
      </div>

      {/* Analyzer */}
      <div className="w-full h-full max-w-screen overflow-hidden">
        <div className="flex flex-col gap-4">
          {/* Threshold Input */}
          <div className="flex gap-5 items-center">
            <input
              type="text"
              value={thresholdInput}
              onChange={(e) => setThresholdInput(e.target.value)}
              className="w-[50px] px-2 py-1 rounded-md border-2 border-zinc-400 focus:border-emerald-500 outline-none"
              disabled={!isModelLoaded} // Disable until model is loaded
            />
            <button
              onClick={updateThreshold}
              className={`bg-emerald-500 cursor-pointer text-zinc-900 hover:bg-transparent hover:text-emerald-500 border-2 border-emerald-500 font-semibold px-4 py-1.5 rounded-full transition-all duration-300 ${
                isModelLoaded ? "" : "cursor-not-allowed opacity-50"
              }`}
              ref={updateThresholdRef}
              disabled={!isModelLoaded || threshold === Number(thresholdInput)} // Disable when threshold equals input value
            >
              Update Threshold
            </button>
          </div>

          {/* Text Area */}
          <textarea
            value={text}
            rows={3}
            className={`outline-none border-2 border-zinc-600 py-2 rounded-md hover:border-emerald-500 focus:border-emerald-500 px-4`}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text here..."
          />

          {/* Analyze Button */}
          <div className="flex justify-end mr-4">
            <button
              onClick={() => {
                analyzeText();
                handleAnalyzeClick();
              }}
              disabled={!model}
              className={`cursor-pointer w-[100px] px-4 py-2 border-2 transition-all duration-300 hover:bg-emerald-500/20 rounded-md font-bold font-mono 
              ${isAnalyzeClicked ? "scale-95" : ""}
              sm:border-tranparnet border-emerald-500 sm:border-2 sm:outline-none sm:hover:bg-emerald-500/20`}
            >
              {model ? "Analyze" : "Loading model..."}
            </button>
          </div>
        </div>

        {/* Display Results (Desktop) */}
        <div className="mt-4 min-w-[400px] mnax-h-[400px] w-full pr-20 sm:block hidden">
          {result && <ResultDisplay predictions={result} />}
        </div>

        {/* Display Results (Mobile Popup) */}
        <div
          className={`sm:hidden w-full h-full fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1000] bg-black/30 flex items-center justify-center ${
            isPopupOpen ? "fixed" : "hidden"
          } px-4`}
          onClick={() => setIsPopupOpen(false)}
        >
          <div className=" bg-zinc-900 w-full p-5 rounded-lg max-w-full overflow-auto h-[500px] shadow-lg">
            {result && <ResultDisplay predictions={result} />}
            <button
              onClick={() => setIsPopupOpen(false)}
              className="bg-red-500 text-white px-4 py-2 rounded-md mt-4"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* ToastContainer for Toast Notifications */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default SentimentAnalyzer;
