import Groq from "groq-sdk";
import { useState } from "react";

const groq = new Groq({
  apiKey: process.env.REACT_APP_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});

export async function getGroqChatCompletion(prompt) {
  return groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    model: "llama-3.3-70b-versatile",
  });
}

const Grok = () => {
  const [userPrompt, setUserPrompt] = useState("");
  const [email, setEmail] = useState("");
  const [response, setResponse] = useState("");

  const handleSend = async () => {
    const chatCompletion = await getGroqChatCompletion(userPrompt);
    setResponse(chatCompletion.choices[0]?.message?.content || "");
  };

  const handleResponseChange = (e) => {
    const value = e.target.value;
    setResponse(value);
  };

  const handleSendEmail = async () => {
    try {
      const res = await fetch(
        "https://email-backend-bice.vercel.app/send-email",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: email,
            subject: userPrompt,
            text: response,
          }),
        }
      );

      const result = await res.json();
      if (result.success) {
        alert("Email sent successfully!");
      } else {
        alert(`Failed to send email: ${result.error}`);
        console.log(result.error);
      }
    } catch (error) {
      console.error(`Error: ${error.message}`);
    }
  };

  return (
    <div className="app">
      <input
        className="input"
        type="email"
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter Email"
        value={email}
      />
      <input
        className="input"
        type="text"
        onChange={(e) => setUserPrompt(e.target.value)}
        placeholder="Enter Prompt"
        value={userPrompt}
      />
      <button className="sendBtn" onClick={handleSend}>
        Send
      </button>
      <textarea
        className="input"
        value={response}
        onChange={handleResponseChange}
        placeholder="Response will appear here..."
        rows="8"
        cols="50"
      ></textarea>
      <button className="sendBtn" onClick={handleSendEmail}>
        Send Email
      </button>
    </div>
  );
};

export default Grok;
