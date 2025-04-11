import React, { useRef, useState } from "react";
import { Button, Card, CardContent, Typography } from "@mui/material";
import { CameraAlt, Send } from "@mui/icons-material";
import axios from "axios";

const Proctoring = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ Start Webcam
  const startWebcam = () => {
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    });
  };

  // ✅ Capture Image
  const captureImage = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (canvas && video) {
      const context = canvas.getContext("2d");
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
    }
  };

  // ✅ Send Image for Analysis
  const sendForAnalysis = async () => {
    setLoading(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.toBlob(async (blob) => {
      const formData = new FormData();
      formData.append("image", blob, "frame.jpg");

      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/api/analyze-frame/",
          formData,
          {
            headers: {
              Authorization: `Token ${localStorage.getItem("userToken")}`, // Ensure authentication
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setAnalysis(response.data);
      } catch (error) {
        console.error("Error analyzing frame:", error);
      } finally {
        setLoading(false);
      }
    }, "image/jpeg");
  };

  return (
    <Card sx={{ maxWidth: 600, margin: "auto", mt: 4, p: 2 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Proctoring System
        </Typography>
        <video ref={videoRef} autoPlay width="100%" height="300" />
        <canvas ref={canvasRef} width={640} height={480} style={{ display: "none" }} />

        <Button
          variant="contained"
          color="primary"
          startIcon={<CameraAlt />}
          onClick={startWebcam}
          sx={{ mt: 2, mr: 2 }}
        >
          Start Webcam
        </Button>

        <Button
          variant="contained"
          color="secondary"
          startIcon={<Send />}
          onClick={captureImage}
          sx={{ mt: 2, mr: 2 }}
        >
          Capture
        </Button>

        <Button
          variant="contained"
          color="success"
          onClick={sendForAnalysis}
          disabled={loading}
          sx={{ mt: 2 }}
        >
          {loading ? "Analyzing..." : "Analyze Frame"}
        </Button>

        {analysis && (
          <Card sx={{ mt: 2, p: 2 }}>
            <Typography variant="body1">Face Count: {analysis.face_count}</Typography>
            <Typography variant="body1">Suspicious: {analysis.suspicious ? "Yes" : "No"}</Typography>
            <Typography variant="body1">Warnings: {analysis.warnings.join(", ")}</Typography>
            {analysis.saved_image && (
              <img src={analysis.saved_image} alt="Analyzed" width="100%" />
            )}
          </Card>
        )}
      </CardContent>
    </Card>
  );
};

export default Proctoring;
