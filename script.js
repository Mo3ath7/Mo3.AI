const form = document.getElementById("chatForm");
const input = document.getElementById("promptInput");
const messages = document.getElementById("messages");
const welcome = document.getElementById("welcome");
const newChat = document.getElementById("newChat");
const clearBtn = document.getElementById("clearBtn");
const sidebar = document.getElementById("sidebar");
const menuBtn = document.getElementById("menuBtn");
const recentList = document.getElementById("recentList");

const WORKER_URL = "https://m03-ai.moathjazar8.workers.dev/";

function addMessage(text, type) {
  const message = document.createElement("div");
  message.className = `message ${type}`;
  message.textContent = text;
  messages.appendChild(message);
  return message;
}

function showWelcome() {
  welcome.style.display = "block";
  messages.innerHTML = "";
  recentList.innerHTML =
    '<div class="empty-recent">Your conversations will appear here.</div>';
}

async function sendMessage(text) {
  const prompt = text.trim();
  if (!prompt) return;

  welcome.style.display = "none";
  addMessage(prompt, "user");

  const reply = addMessage("Connecting to M03 AI...", "assistant");
  input.value = "";
  input.style.height = "auto";

  recentList.innerHTML = "";
  const recent = document.createElement("div");
  recent.className = "recent-item";
  recent.textContent = prompt.length > 25
    ? prompt.slice(0, 25) + "..."
    : prompt;
  recentList.appendChild(recent);

  try {
    const response = await fetch(WORKER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: prompt })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Request failed");
    }

    reply.textContent = data.reply || "M03 AI received your message.";
  } catch (error) {
    reply.textContent = "Error: " + error.message;
  }

  document.getElementById("chatArea").scrollTop =
    document.getElementById("chatArea").scrollHeight;
}

form.addEventListener("submit", event => {
  event.preventDefault();
  sendMessage(input.value);
});

input.addEventListener("keydown", event => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    form.requestSubmit();
  }
});

input.addEventListener("input", () => {
  input.style.height = "auto";
  input.style.height = Math.min(input.scrollHeight, 120) + "px";
});

document.querySelectorAll(".suggestion").forEach(button => {
  button.addEventListener("click", () => {
    sendMessage(button.dataset.prompt);
  });
});

newChat.addEventListener("click", showWelcome);
clearBtn.addEventListener("click", showWelcome);

menuBtn.addEventListener("click", () => {
  sidebar.classList.toggle("open");
});

document.addEventListener("click", event => {
  if (
    window.innerWidth <= 760 &&
    sidebar.classList.contains("open") &&
    !sidebar.contains(event.target) &&
    !menuBtn.contains(event.target)
  ) {
    sidebar.classList.remove("open");
  }
});

document.getElementById("exploreBtn").addEventListener("click", () => {
  alert("More M03 AI features are coming soon!");
});
