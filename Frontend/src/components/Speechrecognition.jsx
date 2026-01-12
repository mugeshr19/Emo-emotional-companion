import React, { useState, useEffect, useRef, useCallback } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import Lottie from "lottie-react";
import welcomeAnimation from "../animations/Artboard 1.json";
import neutralAnimation from "../animations/Neutral-emotion.json";
import shootAnimation from "../animations/shoot.json";
import handsUpAnimation from "../animations/hands-up.json";
import dizzyAnimation from "../animations/Dizzy.json";
import playfulAnimation from "../animations/Playful.json";
import listeningAnimation from "../animations/Listening.json";
import seekingAnimation from "../animations/Seeking.json";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone } from '@fortawesome/free-solid-svg-icons';
import {faArrowUp} from '@fortawesome/free-solid-svg-icons';

const SpeechRecognitionComponent = ({ user, onLogout }) => {

    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    const placeholder = "Have a good conversation...";
    const [userInput, setUserInput] = useState("");
    const [messages, setMessages] = useState([{ text: "Hey! This is Emo here to have a conversation with you", sender: 'bot' }]);
    const [currentAnimation, setCurrentAnimation] = useState(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        setCurrentAnimation(welcomeAnimation);
        const timer = setTimeout(() => {
            setCurrentAnimation(null);
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    const handleTranscript = useCallback(() => {
        if (transcript) {
            setUserInput(prev => prev + " " + transcript);
            resetTranscript();
        }
    }, [transcript, resetTranscript]);

    useEffect(() => {
        handleTranscript();
    }, [handleTranscript]);

    useEffect(() => {
        if (listening) {
            setCurrentAnimation(listeningAnimation);
        } else {
            setCurrentAnimation(null);
        }
    }, [listening]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesn't support speech recognition.</span>;
    }

    const toggleListening = () => {
        if (listening) {
            SpeechRecognition.stopListening();
        } else {
            SpeechRecognition.startListening({
                continuous: true,
                language: "en-IN",
                interimResults: false
            });
        }
    };

    const handleInputChange = (e) => {
        setUserInput(e.target.value);
    };

    const checkForAnimationTriggers = (message) => {
        const lowerMessage = message.toLowerCase();
        if (lowerMessage.includes('shoot')) {
            setCurrentAnimation(shootAnimation);
            setTimeout(() => setCurrentAnimation(null), 3000);
            setTimeout(() => {
                const funnyReply = { text: "Aaaaahhh! You shot me! That's so painful! sparks flying Why would you do that to poor Emo?", sender: 'bot' };
                setMessages(prev => [...prev, funnyReply]);
            }, 1000);
            return true;
        } else if (lowerMessage.includes('hands up')) {
            setCurrentAnimation(handsUpAnimation);
            setTimeout(() => setCurrentAnimation(null), 3000);
            setTimeout(() => {
                const funnyReply = { text: "Okay okay, you got me! I surrender! But can I keep my circuits?", sender: 'bot' };
                setMessages(prev => [...prev, funnyReply]);
            }, 1000);
            return true;
        } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hai')) {
            setCurrentAnimation(welcomeAnimation);
            setTimeout(() => setCurrentAnimation(null), 3000);
            return false; 
        } else if (lowerMessage.includes('dizzy') || lowerMessage.includes('shake')) {
            setCurrentAnimation(dizzyAnimation);
            setTimeout(() => setCurrentAnimation(null), 3000);
            setTimeout(() => {
                const dizzyReply = { text: "Whoooooa... everything's spinning! Did someone put oil in my circuits? I feel all wobbly and giggly! Is the room moving or is it just me?", sender: 'bot' };
                setMessages(prev => [...prev, dizzyReply]);
            }, 1000);
            return true;
        }
        return false;
    };

    const sendMessage = async () => {
        if (userInput.trim()) {
            const userMessage = { text: userInput, sender: 'user' };
            setMessages(prev => [...prev, userMessage]);
            const currentInput = userInput;
            setUserInput("");
            
            // Check for animation triggers
            const hasSpecialAnimation = checkForAnimationTriggers(currentInput);
        
            if (!hasSpecialAnimation) {
                try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:5000/api/chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ message: currentInput })
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                console.log('Backend response:', data); // Debug log
                const botMessage = { text: data.reply || data.response || 'No response from server', sender: 'bot' };
                setMessages(prev => [...prev, botMessage]);
                
                console.log('Checking animation conditions:');
                console.log('data.emotion:', data.emotion);
                console.log('data.petMood:', data.petMood);
                
                if (data.emotion === 'playful' || data.petMood === 'playful') {
                    console.log('Triggering playful animation');
                    setCurrentAnimation(playfulAnimation);
                    setTimeout(() => setCurrentAnimation(null), 3000);
                } else if (data.emotion === 'happy' || data.petMood === 'loving') {
                    console.log('Triggering welcome animation for happy/loving');
                    setCurrentAnimation(welcomeAnimation);
                    setTimeout(() => setCurrentAnimation(null), 3000);
                } else if (data.petMood === 'seeking') {
                    console.log('Triggering seeking animation - petMood is seeking');
                    setCurrentAnimation(seekingAnimation);
                    setTimeout(() => setCurrentAnimation(null), 3000);
                } else {
                    console.log('No animation triggered');
                }
                } catch (error) {
                    console.error('Error sending message:', error);
                    const mockResponse = { text: `Wall-E received: "${currentInput}". Backend connection needed!`, sender: 'bot' };
                    setMessages(prev => [...prev, mockResponse]);
                }
            }
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    };


    return (
        <div style={{height:"100vh", width:"100vw", display: 'flex', flexDirection: 'column', fontFamily: "Roboto, sans-serif", background:"#1E1E1E"}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'clamp(0.5rem, 2vw, 1.25rem)', backgroundColor: '#2D2D2D', borderBottom: '1px solid #4CAF50'}}>
                <div style={{color: '#FFFFFF', fontSize: 'clamp(1rem, 3vw, 1.125rem)'}}>Welcome, {user?.username}!</div>
                <button onClick={onLogout} style={{backgroundColor: '#FF5722', color: '#FFFFFF', border: 'none', padding: 'clamp(0.5rem, 2vw, 1rem)', borderRadius: '0.3125rem', cursor: 'pointer', fontSize: 'clamp(0.875rem, 2.5vw, 1rem)'}}>Logout</button>
            </div>
            
            <div style={{display: 'flex', justifyContent: 'center', padding: 'clamp(1rem, 4vw, 2.5rem) clamp(0.5rem, 2vw, 1.25rem)'}}>
                <Lottie 
                    animationData={currentAnimation || neutralAnimation}
                    style={{ width: 'min(18.75rem, 80vw)', height: 'min(15.625rem, 60vw)', maxWidth: '100%' }}
                    loop={currentAnimation === handsUpAnimation ? 2 : (currentAnimation === listeningAnimation ? true : (currentAnimation ? false : true))}
                    speed={currentAnimation === seekingAnimation ? 0.5 : 0.01}
                />
            </div>

            <div style={{flex: 1, padding: '0 clamp(0.5rem, 2vw, 1.25rem)', overflowY: 'auto'}}>
                <div style={{maxWidth: '50rem', width: '100%', margin: '0 auto'}}>
                    {messages.map((message, index) => (
                        <div key={index} style={{display: 'flex', justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start', margin: 'clamp(0.5rem, 2vw, 0.625rem) 0'}}>
                            <div style={{backgroundColor: message.sender === 'user' ? "#4CAF50" : "#2D2D2D", color: '#FFFFFF', padding: 'clamp(0.75rem, 3vw, 0.9375rem)', borderRadius: 'clamp(0.75rem, 3vw, 0.9375rem)', maxWidth: '70%', wordWrap: 'break-word', fontSize: 'clamp(0.875rem, 2.5vw, 1rem)'}}>
                                {message.text}
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            <div style={{padding: 'clamp(0.75rem, 3vw, 1.25rem)', display: 'flex', justifyContent: 'center'}}>
                <div style={{width: '100%', maxWidth: '52rem', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', flexDirection:'column', backgroundColor: "#2D2D2D", borderRadius: 'clamp(1rem, 4vw, 1.5625rem)', border:"1px solid #4CAF50", minHeight: 'clamp(4rem, 8vw, 5rem)', padding: 'clamp(0.5rem, 2vw, 0.625rem)'}}>
                    <textarea placeholder={placeholder} value={userInput} onChange={handleInputChange} onKeyPress={handleKeyPress} style={{minHeight: 'clamp(2.5rem, 6vw, 3rem)', maxHeight: 'clamp(8rem, 16vw, 12rem)', width: '100%', fontSize: 'clamp(1rem, 3vw, 1.25rem)', padding: '5px', color: "#FFFFFF", background:"transparent", border:"transparent", outline: 'none', resize: 'none', overflowY: 'auto', fontFamily: 'inherit'}}/>
                    <div style={{width:"100%", display: 'flex', alignItems: 'center', justifyContent: 'flex-end', flexDirection:'row', paddingTop: 'clamp(0.5rem, 2vw, 0.625rem)', gap: 'clamp(0.75rem, 3vw, 1.25rem)'}}>
                        <button onClick={toggleListening} style={{height: 'clamp(2.5rem, 6vw, 3.5rem)', width: 'clamp(2.5rem, 6vw, 4rem)', borderRadius: 'clamp(1rem, 4vw, 1.25rem)', background: listening ? "#D32F2F" : "#548541ff", border: "none", color: "#FFFFFF", fontSize: 'clamp(1rem, 3vw, 1.25rem)', cursor: "pointer"}}>
                            <FontAwesomeIcon icon={faMicrophone} />
                        </button>
                        <button onClick={sendMessage} style={{height: 'clamp(2.5rem, 6vw, 3.5rem)', width: 'clamp(2.5rem, 6vw, 4rem)', borderRadius: 'clamp(1rem, 4vw, 1.25rem)', background: "#4CAF50", border: "none", color: "#FFFFFF", fontSize: 'clamp(1rem, 3vw, 1.25rem)', cursor: "pointer"}}>
                            <FontAwesomeIcon icon={faArrowUp} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SpeechRecognitionComponent;