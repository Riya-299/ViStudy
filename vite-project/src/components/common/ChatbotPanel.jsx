import React, { useState, useRef, useEffect } from "react";
import {
  SparklesIcon,
  PaperAirplaneIcon,
  Cog6ToothIcon,
  KeyIcon,
  XMarkIcon,
  CheckIcon,
  ExclamationTriangleIcon
} from "@heroicons/react/24/outline";

/**
 * ViStudy Tutor AI Assistant Panel with Google Gemini AI Integration
 * Context-aware AI tutor supporting Google Gemini 1.5 Flash API with intelligent offline fallback.
 */
export default function ChatbotPanel({ topic, subject, currentFrame, currentStep, totalSteps, hasSolver }) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Gemini API Key Management
  const [apiKey, setApiKey] = useState(() => {
    return localStorage.getItem("gemini_api_key") || import.meta.env.VITE_GEMINI_API_KEY || "";
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [tempApiKey, setTempApiKey] = useState(apiKey);
  const [saveStatus, setSaveStatus] = useState(null);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Welcome message when topic changes
  useEffect(() => {
    if (!topic) return;

    const hasKey = Boolean(apiKey.trim());

    const initialMsg = {
      id: "welcome-msg",
      sender: "tutor",
      text: hasSolver
        ? `Hello! I'm **ViStudy Tutor** (${hasKey ? "⚡ Powered by Gemini AI" : "💡 Offline Assistant Mode"}). We are studying **${topic.title}**!\n\nAsk me any question about the algorithm, step logic, or time complexity!`
        : `Welcome! We are looking at **${topic.title}**. Ask me any conceptual question!`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages([initialMsg]);
  }, [topic?.id, hasSolver, apiKey]);

  // Save API Key Handler
  const handleSaveApiKey = (e) => {
    e?.preventDefault();
    const cleanKey = tempApiKey.trim();
    setApiKey(cleanKey);
    if (cleanKey) {
      localStorage.setItem("gemini_api_key", cleanKey);
      setSaveStatus("Gemini API key saved!");
    } else {
      localStorage.removeItem("gemini_api_key");
      setSaveStatus("Key cleared. Switched to offline tutor mode.");
    }

    setTimeout(() => {
      setSaveStatus(null);
      setIsSettingsOpen(false);
    }, 1200);
  };

  // Call Google Gemini API
  const fetchGeminiResponse = async (query) => {
    const topicTitle = topic?.title || "Data Structures & Algorithms";
    const subjectTitle = subject?.title || "Computer Science";
    const activeLog = currentFrame?.log || "No active step log recorded.";
    const stepNumber = currentStep + 1;

    let stateSummary = "";
    if (currentFrame?.arrayState) {
      stateSummary = `Current Array State: [${currentFrame.arrayState.join(", ")}], Compared Indices: [${(currentFrame.comparedIndices || []).join(", ")}], Swapped: ${currentFrame.isSwapped}`;
    } else if (currentFrame?.processes) {
      stateSummary = `Active Process: ${currentFrame.activeProcess || "None"}, Ready Queue: [${(currentFrame.readyQueue || []).join(", ")}], Current Time: ${currentFrame.currentTime}ms`;
    } else if (currentFrame?.treeNodes) {
      stateSummary = `Incoming Node: ${currentFrame.incomingVal}, Tree Nodes Count: ${currentFrame.treeNodes.length}`;
    }

    const systemPrompt = `You are ViStudy Tutor, a passionate computer science professor on ViStudy — an interactive 3D chalkboard learning application.
The user is currently studying the topic "${topicTitle}" in the subject "${subjectTitle}".

TOPIC OVERVIEW:
${topic?.theory?.overview || "No overview available."}

COMPLEXITY METRICS:
- Best Case: ${topic?.theory?.complexity?.best || "N/A"}
- Average Case: ${topic?.theory?.complexity?.average || "N/A"}
- Worst Case: ${topic?.theory?.complexity?.worst || "N/A"}
- Space: ${topic?.theory?.complexity?.space || "N/A"}

LIVE 3D BOARD CONTEXT:
- Active Step: Step ${stepNumber} of ${totalSteps}
- Step Log: "${activeLog}"
- Board State Summary: ${stateSummary}

USER QUESTION:
"${query}"

INSTRUCTIONS:
1. Provide a direct, highly accurate, educational answer to the user's question.
2. Use Markdown formatting (bolding, code blocks, lists, equations) suitable for a chalkboard tutorial.
3. If the user asks about the current step, reference the live board log and state summary above.
4. Keep the response concise, clear, and encouraging.`;

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey.trim()}`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: systemPrompt }],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData?.error?.message || `Gemini API Error: Status ${response.status}`);
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      throw new Error("No response text received from Gemini API.");
    }
    return text.trim();
  };

  // Built-in Offline Fallback Response Generator
  const generateOfflineResponse = (query) => {
    const q = query.toLowerCase().trim();
    const topicTitle = topic?.title || "Data Structures & Algorithms";
    const topicId = topic?.id || "";
    const activeLog = currentFrame?.log || "No step log recorded for this frame.";
    const stepNumber = currentStep + 1;

    if (q.includes("quantum") || (topicId === "cpu-scheduling" && q.includes("time"))) {
      return `⏱️ **Time Quantum in Round Robin**:\n\nA Time Quantum is the fixed max duration of CPU time allocated to a process before preemption. If a process does not finish, it yields the CPU and re-enters the Ready Queue.`;
    }

    if (q.includes("happening") || q.includes("step") || q.includes("frame") || q.includes("now")) {
      return `📍 **Analysis for Step ${stepNumber} of ${totalSteps}**:\n\n> "${activeLog}"\n\n*Tip*: Step through using the playback controls below the visual board!`;
    }

    if (q.includes("complexity") || q.includes("big o") || q.includes("time") || q.includes("space")) {
      return `⏱️ **Complexity Metrics for ${topicTitle}**:\n\n- **Best Case**: \`${topic?.theory?.complexity?.best || "N/A"}\`\n- **Average Case**: \`${topic?.theory?.complexity?.average || "N/A"}\`\n- **Worst Case**: \`${topic?.theory?.complexity?.worst || "N/A"}\`\n- **Space**: \`${topic?.theory?.complexity?.space || "N/A"}\``;
    }

    return `📖 **ViStudy Tutor Insight for "${query}"**:\n\nRegarding **${topicTitle}**:\n\n${topic?.theory?.overview || "This algorithm performs systematic operations step-by-step."}\n\n📍 *Current Board Step*: **Step ${stepNumber} of ${totalSteps}**\n> "${activeLog}"`;
  };

  // Send Message Handler
  const handleSendMessage = async (textToSend) => {
    const text = textToSend || inputText;
    if (!text.trim() || isTyping) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText("");
    setIsTyping(true);

    try {
      let replyText = "";
      if (apiKey.trim()) {
        // Use Gemini API
        replyText = await fetchGeminiResponse(text);
      } else {
        // Use Offline Engine
        await new Promise((resolve) => setTimeout(resolve, 400));
        replyText = generateOfflineResponse(text);
      }

      const tutorMsg = {
        id: `tutor-${Date.now()}`,
        sender: "tutor",
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, tutorMsg]);
    } catch (err) {
      console.warn("Gemini API call failed, falling back to offline assistant:", err);
      const fallbackText = `⚠️ *(Gemini API Note: ${err.message || "Network issue"}. Falling back to offline tutor)*\n\n` + generateOfflineResponse(text);
      const tutorMsg = {
        id: `tutor-${Date.now()}`,
        sender: "tutor",
        text: fallbackText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, tutorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getDynamicChips = () => {
    if (topic?.id === "cpu-scheduling") {
      return [
        { label: "⏱️ What is Time Quantum?", query: "What is time quantum in round robin?" },
        { label: "⚙️ How does Round Robin work?", query: "Explain Round Robin CPU scheduling" },
        { label: "📊 What is happening in this step?", query: "What is happening in this step?" },
      ];
    }
    if (topic?.id === "bst") {
      return [
        { label: "🌲 What is a BST?", query: "What is a Binary Search Tree?" },
        { label: "🔍 How are nodes inserted?", query: "How are nodes inserted in BST?" },
        { label: "⏱️ Time Complexity?", query: "What is the time complexity of BST?" },
      ];
    }
    return [
      { label: "💡 What's happening in this step?", query: "What is happening in this step?" },
      { label: "⚡ Why are elements highlighted?", query: "Why are elements highlighted?" },
      { label: "⏱️ Time Complexity?", query: "What is the time complexity?" },
    ];
  };

  const suggestionChips = getDynamicChips();

  return (
    <div className="rounded-xl bg-brand-board border-2 border-dashed border-white/10 h-[630px] flex flex-col shadow-lg overflow-hidden animate-fade-in relative">
      {/* Header */}
      <div className="px-4 py-3.5 border-b-2 border-dashed border-white/10 bg-slate-950/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded border border-dashed border-chalk-green/30 text-chalk-green bg-chalk-green/10">
            <SparklesIcon className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h3 className="font-handwritten text-sm font-bold text-chalk-white/90">ViStudy Tutor AI</h3>
            <span
              className={`text-[10px] font-medium flex items-center gap-1 ${
                apiKey.trim() ? "text-chalk-yellow" : "text-chalk-green"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full animate-ping ${
                  apiKey.trim() ? "bg-chalk-yellow" : "bg-chalk-green"
                }`}
              />
              {apiKey.trim() ? "Gemini AI Active" : "Offline Mode"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {hasSolver && (
            <span className="px-2 py-0.5 rounded bg-slate-800 border border-dashed border-white/10 text-[10px] font-handwritten text-chalk-yellow">
              Step {currentStep + 1}/{totalSteps}
            </span>
          )}

          {/* Settings Button */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-1.5 rounded-lg bg-slate-800/80 border border-dashed border-white/15 text-chalk-white/70 hover:text-chalk-yellow hover:border-chalk-yellow/40 transition-colors"
            title="Configure Gemini API Key"
          >
            <Cog6ToothIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Settings Modal Overlay */}
      {isSettingsOpen && (
        <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm z-30 p-5 flex flex-col justify-between animate-fade-in">
          <div>
            <div className="flex items-center justify-between mb-4 border-b border-dashed border-white/10 pb-3">
              <h4 className="font-handwritten text-sm font-bold text-chalk-yellow flex items-center gap-2">
                <KeyIcon className="w-4 h-4" />
                <span>Google Gemini API Configuration</span>
              </h4>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="text-chalk-white/50 hover:text-chalk-white"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-chalk-white/70 font-handwritten leading-relaxed mb-4">
              Enter your Google Gemini API Key to enable live AI responses. Get a free key at{" "}
              <a
                href="https://aistudio.google.com/"
                target="_blank"
                rel="noreferrer"
                className="text-chalk-yellow underline hover:text-chalk-yellow/80"
              >
                Google AI Studio
              </a>.
            </p>

            <form onSubmit={handleSaveApiKey} className="space-y-3">
              <div>
                <label className="block text-[11px] font-handwritten text-chalk-white/60 mb-1">
                  Gemini API Key:
                </label>
                <input
                  type="password"
                  value={tempApiKey}
                  onChange={(e) => setTempApiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full bg-brand-bg border border-dashed border-white/20 rounded px-3 py-2 text-xs text-chalk-white font-mono focus:outline-none focus:border-chalk-yellow"
                />
              </div>

              {saveStatus && (
                <div className="p-2 rounded bg-chalk-green/20 border border-dashed border-chalk-green/40 text-chalk-green text-[11px] font-handwritten flex items-center gap-1.5">
                  <CheckIcon className="w-3.5 h-3.5" />
                  <span>{saveStatus}</span>
                </div>
              )}

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-1.5 rounded bg-chalk-yellow/20 border border-dashed border-chalk-yellow/50 text-chalk-yellow text-xs font-handwritten font-bold hover:bg-chalk-yellow/30"
                >
                  Save API Key
                </button>
                {apiKey && (
                  <button
                    type="button"
                    onClick={() => {
                      setTempApiKey("");
                      setApiKey("");
                      localStorage.removeItem("gemini_api_key");
                      setSaveStatus("Key cleared. Switched to offline mode.");
                      setTimeout(() => {
                        setSaveStatus(null);
                        setIsSettingsOpen(false);
                      }, 1000);
                    }}
                    className="px-3 py-1.5 rounded bg-slate-800 border border-dashed border-chalk-pink/30 text-chalk-pink text-xs font-handwritten hover:bg-chalk-pink/10"
                  >
                    Clear Key
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="text-[10px] text-chalk-white/40 font-handwritten border-t border-dashed border-white/10 pt-3">
            🔒 Key is stored locally in your browser and never sent anywhere except Google's official API.
          </div>
        </div>
      )}

      {/* Message History list */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-950/10 flex flex-col">
        {messages.map((msg) => {
          const isTutor = msg.sender === "tutor";
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isTutor ? "items-start" : "items-end"} animate-fade-in`}
            >
              <div
                className={`max-w-[92%] p-3 rounded-lg border border-dashed text-xs leading-relaxed ${
                  isTutor
                    ? "bg-brand-bg/90 border-chalk-green/30 text-chalk-white/90 shadow-sm"
                    : "bg-chalk-yellow/15 border-chalk-yellow/40 text-chalk-yellow"
                }`}
              >
                <div className="whitespace-pre-line font-handwritten text-[13px]">
                  {msg.text}
                </div>
              </div>
              <span className="text-[9px] text-chalk-white/30 mt-1 px-1">{msg.timestamp}</span>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-brand-bg/40 border border-dashed border-white/10 max-w-[170px]">
            <SparklesIcon className="w-3.5 h-3.5 text-chalk-yellow animate-spin" />
            <span className="text-[11px] font-handwritten text-chalk-white/70">
              {apiKey.trim() ? "Gemini AI thinking..." : "Tutor thinking..."}
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion Chips */}
      <div className="px-3 py-2 border-t border-dashed border-white/10 bg-slate-950/20 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        {suggestionChips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(chip.query)}
            disabled={isTyping}
            className="flex-shrink-0 px-2.5 py-1 rounded-full bg-slate-800/80 border border-dashed border-white/15 text-[10px] font-handwritten text-chalk-white/70 hover:text-chalk-yellow hover:border-chalk-yellow/40 transition-colors disabled:opacity-50"
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Input area */}
      <div className="p-3 border-t-2 border-dashed border-white/10 bg-slate-950/30">
        <div className="flex items-center gap-2 bg-brand-bg border border-dashed border-white/20 rounded-lg px-3 py-1.5 focus-within:border-chalk-yellow/50 transition-colors">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={apiKey.trim() ? "Ask Gemini AI anything..." : "Ask ViStudy Tutor any question..."}
            disabled={isTyping}
            className="w-full bg-transparent text-xs text-chalk-white focus:outline-none placeholder:text-chalk-white/30 font-handwritten text-[13px]"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim() || isTyping}
            className="p-1 rounded text-chalk-yellow hover:bg-chalk-yellow/10 disabled:opacity-30 transition-colors"
            title="Send Message"
          >
            <PaperAirplaneIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
