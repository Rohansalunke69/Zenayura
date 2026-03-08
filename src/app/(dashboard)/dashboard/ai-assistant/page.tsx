"use client";
import { useState, useRef, useEffect } from "react";
import { Send, Leaf, Paperclip, X } from "lucide-react";

export default function AIAssistantPage() {
    const [query, setQuery] = useState("");
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string, imageUrl?: string }[]>([
        { role: 'assistant', content: 'Namaste! I am your Zenayura Ayurvedic Assistant. How are you feeling today? Please share any health problems or symptoms.' }
    ]);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const [isLoading, setIsLoading] = useState(false);

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const tempUrl = URL.createObjectURL(file);
            setSelectedImage(tempUrl);
        }
    };

    const removeImage = () => {
        setSelectedImage(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        // Allow sending if there's either text or an image
        if ((!query.trim() && !selectedImage) || isLoading) return;

        const userMessage = {
            role: 'user' as const,
            content: query,
            ...(selectedImage && { imageUrl: selectedImage })
        };
        const newMessages = [...messages, userMessage];

        setMessages(newMessages);
        setQuery("");
        setSelectedImage(null);
        setIsLoading(true);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: newMessages })
            });
            const data = await res.json();

            if (res.ok && data.text) {
                setMessages(prev => [...prev, { role: 'assistant', content: data.text }]);
            } else {
                setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I am having trouble connecting to my Ayurvedic knowledge base right now." }]);
            }
        } catch (error) {
            setMessages(prev => [...prev, { role: 'assistant', content: "An unexpected error occurred. Please try again." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full w-full max-w-5xl mx-auto gap-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
                <h1 className="text-[28px] font-bold text-[#355f41]">AI Health Assistant</h1>
            </div>

            {/* Chat Container */}
            <div className="flex-1 overflow-hidden relative rounded-[20px] bg-white/90 backdrop-blur-md border border-[#e2efe2] shadow-sm flex flex-col">
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 md:p-8 flex flex-col gap-6">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.role === 'assistant' && (
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f0fdf4] text-[#598b61] border border-[#dcfce7]">
                                    <Leaf className="h-5 w-5" />
                                </div>
                            )}
                            <div className={`max-w-[85%] sm:max-w-[75%] px-1 text-[15px] leading-relaxed ${msg.role === 'assistant'
                                ? 'text-slate-600 pt-2'
                                : 'bg-white border border-slate-100 shadow-sm rounded-[20px] px-6 py-4 text-slate-600'
                                }`}>
                                {msg.imageUrl && (
                                    <div className="mb-3">
                                        <img src={msg.imageUrl} alt="Attached" className="max-h-60 rounded-xl border border-slate-200 object-cover" />
                                    </div>
                                )}
                                {msg.content && <p>{msg.content}</p>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Image Preview and Input Bar */}
            <form onSubmit={handleSend} className="relative mt-2 flex flex-col gap-2">
                {selectedImage && (
                    <div className="relative self-start ml-2">
                        <img src={selectedImage} alt="Preview" className="h-20 w-20 rounded-xl border border-slate-200 object-cover shadow-sm bg-white" />
                        <button
                            type="button"
                            onClick={removeImage}
                            className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-red-600 border border-red-200 hover:bg-red-200 transition"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                )}

                <div className="relative flex items-center bg-white/95 backdrop-blur-md rounded-full border border-[#e2efe2] shadow-sm p-2 gap-2">
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleImageSelect}
                    />
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex shrink-0 items-center justify-center h-10 w-10 rounded-full text-slate-400 hover:text-[#598b61] hover:bg-[#f0fdf4] transition"
                        title="Attach Photo"
                    >
                        <Paperclip className="h-5 w-5" />
                    </button>

                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="e.g. I have been experiencing dry skin, anxiety..."
                        className="flex-1 bg-transparent px-2 py-3 text-[15px] text-slate-700 placeholder:text-slate-400 focus:outline-none"
                    />
                    <button
                        type="submit"
                        disabled={(!query.trim() && !selectedImage) || isLoading}
                        className="flex shrink-0 items-center justify-center h-12 w-12 rounded-full bg-[#598b61] text-white hover:bg-[#4b7752] transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                    >
                        <Send className="h-5 w-5 -ml-0.5" />
                    </button>
                </div>
            </form>
        </div>
    );
}
