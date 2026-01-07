import React, { useState, useEffect } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import Lottie from "lottie-react";
import welcomeAnimation from "../animations/Artboard 1.json";
import neutralAnimation from "../animations/Neutral-emotion.json";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone } from '@fortawesome/free-solid-svg-icons';

const speechrecognition = () => {
    const [showWelcome, setShowWelcome] = useState(true);
    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    const [placeholder,setplaceholder] = useState("Have a good conversation...")

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowWelcome(false);
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesn't support speech recognition.</span>;
    }

    const startListening = () => {
        SpeechRecognition.startListening({
            continuous: true,
            language: 'en-IN'
        });
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' ,fontFamily: "Roboto, sans-serif"}}>
            <Lottie 
                animationData={showWelcome ? welcomeAnimation : neutralAnimation}
                style={{ width: 300, height: 250 }}
                loop={true}
                speed={showWelcome ? 0.02 : 0.01}
            />
            <div>Speech to Text</div>
            <p>Microphone: {listening ? 'on' : 'off'}</p>
            <div style={{ display: 'flex', gap: '10px', margin: '10px 0' }}>
                <input type="text" placeholder={placeholder} style={{height:"3rem", width: "25rem" ,borderRadius:"25px",display:"flex",justifyContent:"center",fontSize: "20px",alignItems:"center",padding:"10px",border:"1px solid #ccc "}}></input>
                <button onClick={startListening}>
                    <FontAwesomeIcon icon={faMicrophone} /> Start
                </button>
                <button onClick={SpeechRecognition.stopListening}>Stop</button>
                <button onClick={resetTranscript}>Clear</button>
            </div>
            <p style={{ textAlign: 'center', maxWidth: '400px' }}>{transcript}</p>
        </div>
    );
};

export default speechrecognition;