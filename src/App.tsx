import { useState } from "react";
import "./App.css";

function App() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
      setConfidence(null);
    }
  };

  const handlePredict = async () => {
    if (!image) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("file", image);

    try {
      const res = await fetch("http://localhost:8000/predict", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setResult(data.prediction.replaceAll("_", " "));
      setConfidence((data.confidence * 100));
    } catch (err) {
      alert("Gagal terhubung ke backend");
    }

    setLoading(false);
  };

  return (
    <div className="container">
      <h1 className="title">🍃 Leaf Disease Detection</h1>

      <label className="upload-box">
        <input type="file" accept="image/*" onChange={handleImageChange} hidden />
        {preview ? (
          <img src={preview} alt="preview" className="preview" />
        ) : (
          <span>📷 Upload Gambar Daun</span>
        )}
      </label>

      <button className="detect-btn" onClick={handlePredict} disabled={loading}>
        {loading ? "Mendeteksi..." : "Mendeteksi"}
      </button>

      {result && confidence !== null && (
        <div className="result-card">
          <h2>📊 Hasil Prediksi</h2>
          <p><strong>Penyakit:</strong> {result}</p>
          <p><strong>Confidence:</strong> {confidence.toFixed(2)}%</p>
        </div>
      )}
    </div>
  );
}

export default App;
