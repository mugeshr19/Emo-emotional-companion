import React from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

const speechrecognition = () => {
    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

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
        <>
            <div>Speech to Text</div>
            <p>Microphone: {listening ? 'on' : 'off'}</p>
            <button onClick={startListening}>Start</button>
            <button onClick={SpeechRecognition.stopListening}>Stop</button>
            <button onClick={resetTranscript}>Clear</button>
            <p>{transcript}</p>
        </>
    );
};

export default speechrecognition;