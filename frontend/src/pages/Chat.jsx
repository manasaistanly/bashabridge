import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Mic, Send, Volume2, Globe, Bot, User } from 'lucide-react';
import useAuthStore from '../store/authStore';
import useLearningStore from '../store/learningStore';
import api from '../services/api';

export default function Chat() {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const { selectedLanguage, languages, fetchLanguages, setLanguage } = useLearningStore();

    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const recognitionRef = useRef(null);

    // Initial greeting
    useEffect(() => {
        if (!selectedLanguage) {
            // If no language selected, fetch and start with the first one or prompt
            fetchLanguages();
        } else {
            setMessages([
                {
                    id: 1,
                    sender: 'ai',
                    text: `Hello! I'm your ${selectedLanguage.name} tutor. Let's practice conversation!`,
                    translation: `Namaste! I am your ${selectedLanguage.name} tutor.`,
                    audio: null
                }
            ]);
        }
    }, [selectedLanguage]);

    // Initialize Speech Recognition
    useEffect(() => {
        if ('webkitSpeechRecognition' in window) {
            const recognition = new window.webkitSpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;

            // Set language code based on selected language if possible, else default to English/Mix
            // Ideally we map selectedLanguage.code to BCP 47 tags (e.g., 'ta-IN', 'hi-IN')
            const langCodeMap = {
                'ta': 'ta-IN', 'te': 'te-IN', 'hi': 'hi-IN',
                'kn': 'kn-IN', 'ml': 'ml-IN', 'mr': 'mr-IN'
            };
            recognition.lang = selectedLanguage ? langCodeMap[selectedLanguage.code] || 'en-US' : 'en-US';

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setInputText(transcript);
                setIsListening(false);
            };

            recognition.onerror = (event) => {
                console.error('Speech recognition error', event.error);
                setIsListening(false);
            };

            recognition.onend = () => {
                setIsListening(false);
            };

            recognitionRef.current = recognition;
        }
    }, [selectedLanguage]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputText.trim() || !selectedLanguage) return;

        const userMessage = {
            id: Date.now(),
            sender: 'user',
            text: inputText,
        };

        setMessages(prev => [...prev, userMessage]);
        setInputText('');
        setIsLoading(true);

        try {
            const response = await api.post('/chat', {
                message: userMessage.text,
                languageId: selectedLanguage._id
            });

            const data = response.data.data;

            const aiMessage = {
                id: Date.now() + 1,
                sender: 'ai',
                text: data.message,
                translation: data.translation,
                audio: data.audio
            };

            setMessages(prev => [...prev, aiMessage]);

            // Auto play audio
            speakText(data.audio, selectedLanguage.code);

        } catch (error) {
            console.error('Chat error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop();
        } else {
            setInputText('');
            recognitionRef.current?.start();
            setIsListening(true);
        }
    };

    const speakText = (text, langCode) => {
        if (!text) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        // Try to match voice
        // Note: Browser support for Indian languages varies
        utterance.lang = langCode === 'hi' ? 'hi-IN' :
            langCode === 'ta' ? 'ta-IN' :
                langCode === 'te' ? 'te-IN' : 'en-IN';
        window.speechSynthesis.speak(utterance);
    };

    return (
        <div className="h-screen flex flex-col pb-6 px-4 md:px-0 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between py-4 border-b border-white/10 mb-4">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate('/dashboard')} className="p-2 rounded-xl hover:bg-white/10">
                        <ArrowLeft className="w-5 h-5 text-slate-400" />
                    </button>
                    <div>
                        <h1 className="font-bold text-xl flex items-center gap-2">
                            <Bot className="w-6 h-6 text-indigo-400" />
                            AI Tutor
                        </h1>
                        <p className="text-xs text-slate-400">Practicing {selectedLanguage?.name}</p>
                    </div>
                </div>

                {/* Language Switcher Mini */}
                <div className="flex gap-2">
                    {languages.map(lang => (
                        <button
                            key={lang._id}
                            onClick={() => setLanguage(lang)}
                            className={`text-2xl opacity-50 hover:opacity-100 transition-opacity ${selectedLanguage?._id === lang._id ? 'opacity-100 scale-110' : ''}`}
                            title={lang.name}
                        >
                            {lang.flag}
                        </button>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4 scrollbar-hide">
                {messages.map((msg) => (
                    <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`max-w-[80%] rounded-2xl p-4 ${msg.sender === 'user'
                                ? 'bg-indigo-600 text-white rounded-tr-sm'
                                : 'bg-slate-800 text-slate-200 rounded-tl-sm'
                            }`}>
                            <div className="mb-1 text-lg font-medium">{msg.text}</div>

                            {msg.sender === 'ai' && (
                                <div className="border-t border-white/10 pt-2 mt-2">
                                    <p className="text-sm text-slate-400 italic mb-2">{msg.translation}</p>
                                    <button
                                        onClick={() => speakText(msg.audio, selectedLanguage?.code)}
                                        className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors inline-flex"
                                    >
                                        <Volume2 className="w-4 h-4 text-indigo-400" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-slate-800 rounded-2xl p-4 rounded-tl-sm flex gap-2 items-center">
                            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" />
                            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-75" />
                            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-150" />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="relative glass-card bg-slate-800/50 p-2 rounded-2xl flex items-center gap-2">
                <button
                    type="button"
                    onClick={toggleListening}
                    className={`p-3 rounded-xl transition-all ${isListening ? 'bg-red-500/20 text-red-400 animate-pulse' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
                >
                    <Mic className="w-5 h-5" />
                </button>

                <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={isListening ? "Listening..." : "Type or speak..."}
                    className="flex-1 bg-transparent border-none outline-none text-white placeholder-slate-500 px-2"
                />

                <button
                    type="submit"
                    disabled={!inputText.trim() || isLoading}
                    className="p-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <Send className="w-5 h-5" />
                </button>
            </form>
        </div>
    );
}
