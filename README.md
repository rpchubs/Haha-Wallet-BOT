# 🌟 Haha Wallet Auto Claimer

An automated tool for claiming karma and completing tasks in Haha Wallet. Built with **Node.js**, featuring a sleek **terminal-based dashboard** for easy interaction.

---

## ✨ Features

✅ **Automated daily check-in**  
✅ **Task auto-completion** (basic + social tasks)  
✅ **Karma and rank tracking**  
✅ **Beautiful terminal dashboard** 🎨  
✅ **Multi-account support** 👥  
✅ **Real-time status updates** 🔄  

---

## 📋 Prerequisites

Before installing, make sure you have:

🔹 A **Haha Wallet account**  
🔹 **Node.js (14 or higher)** and **npm**  
🔹 A stable internet connection 🌐

### 📝 Register Haha Wallet

1. Download and install the Haha Wallet extension:  
   🔗 [Chrome Web Store](https://chromewebstore.google.com/detail/haha-wallet/andhndehpcjpmneneealacgnmealilal?hl=en-US&utm_source=ext_sidebar)
2. **Create an account**:  
   🔗 [Register Haha Wallet](https://join.haha.me/ANONYMOUS-AA27AG)
3. Complete the registration process

---

## 📥 Installation Guide

### 🐧 **For Linux/macOS**

1. **Clone the repository**:
   ```bash
   git clone https://github.com/rpchubs/Haha-Wallet-BOT
   cd Haha-Wallet-BOT
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Set up your accounts**:
   ```bash
   nano data.key
   ```
   📌 Format: `email:password`
   ```
   youremail@example.com:yourpassword
   anotheremail@example.com:anotherpassword
   ```
4. **Run the bot**:
   ```bash
   npm start
   ```

### 🖥️ **For Windows**

1. **Open Command Prompt (cmd) or PowerShell**
2. **Clone the repository**:
   ```powershell
   git clone https://github.com/rpchubs/Haha-Wallet-BOT
   cd HaHa-Wallet-BOT
   ```
3. **Install dependencies**:
   ```powershell
   npm install
   ```
4. **Edit account details**:
   - Open `data.key` in Notepad or a text editor
   - Format: `email:password`
5. **Start the bot**:
   ```powershell
   npm start
   ```

---

## 🎮 Dashboard Controls

🎛 **Navigation**
- Press **`q`** or **`ESC`** to quit ❌
- Press **`r`** to refresh 🔄

---

## 🔍 Features Breakdown

### 🔹 **Multi-Account Support**
- Process multiple accounts sequentially 🔄
- Secure local storage for passwords 🔐

### 🔹 **Automated Task Handling**
- **Daily check-in** ✅
- **Basic task completion** ⚡
- **Social task claiming** 📢
- **Auto-retry on failures** 🔁

### 🔹 **Interactive Dashboard**
- Real-time updates 📊
- Karma balance tracking 💰
- Task progress visualization 📈

---

## 📂 Project Structure

```
haha-wallet-bot/
├── package.json
├── data.key               # Account credentials file
└── src/
    ├── main.js             # Main entry point
    ├── api/
    │   └── hahaApi.js       # API calls
    ├── config/
    │   └── userAgents.js    # User agent config
    ├── services/
    │   ├── accountService.js # Account management
    │   └── taskService.js    # Task processing
    └── ui/
        └── dashboard.js      # Dashboard interface
```

---

## 🛠️ Support

📂 **GitHub Repository**: [RPC Hubs](https://github.com/rpchubs)\
💬 **Community Support**: [Telegram](https://t.me/RPC_Hubs)\
📜 **License**: MIT License

---
## ⚠️ Disclaimer

🚨 **Use this tool at your own risk!** 🚨
- This tool is for **educational purposes only**
- The developers **are not responsible** for any banned accounts or lost karma points

---

💡 **Need Help?** Join our Telegram group for real-time support and discussions! 🚀

### 🎯 Happy Claiming! 🚀

