import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageSquare, Sparkles } from 'lucide-react';
import { useParams } from 'react-router-dom';
import aiService from '../../services/aiService';
import { useAuth } from '../../context/AuthContext';
import Spinner from '../common/Spinner';
import MarkdownRenderer from '../common/MarkDownRenderer';
const ChatInterface = () => {
    const { id: documentId } = useParams();
    const { user } = useAuth();
    const [history, setHistory] = useState([]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const messagesEndRef = useRef(null);
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    useEffect(() => {
        const fetchChatHistory = async () => {
            try {
                setInitialLoading(true);
                const response = await aiService.getChatHistory(documentId);
                setHistory(response.data);
            } catch (error) {
                console.error('Failed to fetch chat history: ', error);
            }
            finally {
                setInitialLoading(false);
            }
        };

        fetchChatHistory();
    }, [documentId]);

    useEffect(() => {
        scrollToBottom();
    }, [history]);


    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;
        const userMessage = { role: 'user', content: message, timestamp: new Date() };
        setHistory(prev => [...prev, userMessage]);
        setMessage('');
        setLoading(true);
        try {
            const response = await aiService.chat(documentId, userMessage.content);
            const assistantMessage = {
                role: 'assistant',
                content: response.data.answer,
                timestamp: new Date(),
                relevantChunks: response.data.relevantChunks
            };
            setHistory(prev => [...prev, assistantMessage]);
        } catch (error) {
            console.error('Chat error:', error);
            const errorMessage = {
                role: 'assistant',
                content: 'Sorry, I encountered an error. Please try again.',
                timestamp: new Date()
            };
            setHistory(prev => [...prev, errorMessage]);
        }
        finally {
            setLoading(false);
        }
    }

    const renderMessage = (msg, index) => {
        const isUser = msg.role === 'user';
        return (
            <div key={index} className={`flex items-start gap-3 my-4 ${isUser ? 'justify-end' : ''}`}>
                {!isUser && (
                    <div className='w-9 h-9 rounded-sm bg-black border-2 border-black shadow-[3px_3px_0px_#000] flex items-center justify-center shrink-0'>
                        <Sparkles className='w-4 h-4 text-[#f6f3ea]' strokeWidth={2} />
                    </div>
                )}
                <div className={`max-w-lg p-4 rounded-sm border-2 border-black shadow-[3px_3px_0px_#000] ${isUser
                    ? 'bg-[#ffd400] text-black rounded-br-sm'
                    : 'bg-white text-black rounded-bl-sm'
                    }`}>
                    {isUser ? (
                        <p className='text-sm leading-relaxed'>{msg.content}</p>
                    ) : (
                        <div className='prose prose-sm max-w-none prose-slate'>
                            <MarkdownRenderer content={msg.content} />
                        </div>
                    )}
                </div>
                {isUser && (
                    <div className='w-9 h-9 rounded-sm bg-white border-2 border-black flex items-center justify-center text-black font-semibold text-sm shrink-0 shadow-[3px_3px_0px_#000]'>
                        {user?.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                )}
            </div>
        )
    };

    if (initialLoading) {
        return (
            <div className="flex flex-col h-[70vh] bg-[#f7f2e8] border-2 border-black rounded-sm items-center justify-center shadow-[4px_4px_0px_#000]">
                <div className="w-14 h-14 rounded-sm bg-[#ffd400] border-2 border-black flex items-center justify-center mb-4" >
                    <MessageSquare className="w-7 h-7 text-black" strokeWidth={2} />
                </div >
                <Spinner />
                <p className="text-sm text-neutral-700 mt-3 font-medium">Loading chat history...</p>
            </div >
        );
    }
    return (
        <div className="flex flex-col h-[70vh] bg-[#f7f2e8] border-2 border-black rounded-sm shadow-[4px_4px_0px_#000] overflow-hidden ">
            {/* Messages Area */}
            <div className="flex-1 p-6 overflow-y-auto bg-[#f6f3ea]">
                {history.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <div className="w-16 h-16 rounded-sm bg-[#ffd400] border-2 border-black flex items-center justify-center mb-4 shadow-[3px_3px_0px_#000]">
                            <MessageSquare className="w-8 h-8 text-black" strokeWidth={2} />
                        </div>
                        <h3 className="text-base font-semibold text-black mb-2">Start a conversation</h3>
                        <p className="text-sm text-neutral-700">Ask me anything about the document!</p>
                    </div>
                ) : (
                    history.map(renderMessage)
                )}
                <div ref={messagesEndRef} />
                {loading && (
                    <div className="flex items-center gap-3 my-4">
                        <div className="w-9 h-9 rounded-sm bg-black border-2 border-black shadow-[3px_3px_0px_#000] flex items-center justify-center shrink-0">
                            <Sparkles className="w-4 h-4 text-[#f6f3ea]" strokeWidth={2} />
                        </div>
                        <div className='flex items-center gap-2 px-4 py-3 rounded-sm bg-white border-2 border-black shadow-[3px_3px_0px_#000]'>
                            <div className='flex gap-1'>
                                <span className='w-2 h-2 bg-black rounded-full animate-bounce' style={{ animationDelay: '0ms' }}></span>
                                <span className='w-2 h-2 bg-black rounded-full animate-bounce' style={{ animationDelay: '150ms' }}></span>
                                <span className='w-2 h-2 bg-black rounded-full animate-bounce' style={{ animationDelay: '300ms' }}></span>
                            </div>
                        </div>
                    </div>)}
            </div>

            {/* Input Area */}
            <div className="p-5 border-t-2 border-black bg-[#f7f2e8]">
                <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Ask a follow-up question..."
                        className="flex-1 h-12 px-4 border-2 border-black rounded-sm bg-white text-black placeholder-neutral-500 text-sm font-medium transition-all duration-150 focus:outline-none focus:border-black"
                        disabled={loading}
                    />
                    <button
                        type="submit"
                        disabled={loading || !message.trim()}
                        className="shrink-0 w-12 h-12 bg-black text-[#f6f3ea] rounded-sm border-2 border-black shadow-[3px_3px_0px_#000] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed active:translate-x-0.5 active:translate-y-0.5 flex items-center justify-center">
                        <Send className='w-5 h-5' strokeWidth={2} />
                    </button>
                </form>
            </div>
        </div>
    )
}
export default ChatInterface