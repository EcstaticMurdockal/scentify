# 🌸 EchoScent - Transform Memories into Scent

> "What does your memory smell like?"

EchoScent is an immersive fragrance discovery platform that transforms cherished memories into unique scent concepts. Powered by artificial intelligence, we bridge the gap between emotion and olfaction, creating personalized fragrance profiles that capture the essence of your most precious moments.

---

## 🎯 Mission

To revolutionize how we connect with our memories through scent. We believe every memory has a fragrance, and every fragrance tells a story.

---

## ✨ Features

### AI-Powered Scent Generation
- **Memory-to-Scent Translation**: Convert text descriptions of memories into unique fragrance concepts
- **Emotion Recognition**: Analyze emotional context to create scents that resonate
- **Cloud AI Support**: Powered by Hugging Face Inference API - no local installation required

### Immersive User Experience
- **Fluid Animations**: Beautiful GSAP-powered transitions and particle effects
- **Sensory Journey**: Evocative loading sequences with floating scent keywords
- **Responsive Design**: Perfect experience across all devices

### Social & Sharing
- **Share Your Creation**: Export and share your unique fragrance on social media
- **Copy to Clipboard**: Easily share detailed fragrance profiles

### Brand Experience
- **Luxury Aesthetic**: Premium design inspired by high-end fragrance brands
- **Glassmorphism Elements**: Modern, sophisticated UI components

---

## 🛠️ Technology Stack

| Category | Technology |
|----------|------------|
| **Frontend** | HTML5, Tailwind CSS, JavaScript ES6+ |
| **Animation** | GSAP (GreenSock Animation Platform) |
| **AI Engine** | Hugging Face Inference API |
| **Fonts** | Playfair Display, Inter |
| **Hosting** | GitHub Pages Ready |

---

## 🚀 Quick Start

### Prerequisites
- Python 3.x (for local development server)
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection (for AI API access)

### Installation & Running

```bash
# Clone the repository
git clone https://github.com/EcstaticMurdockal/scentify.git

# Navigate to project directory
cd scentify

# Start local server
python -m http.server 8080

# Open browser and navigate to
# http://localhost:8080
```

---

## 🧠 AI Configuration

EchoScent uses Hugging Face Inference API which requires no API key for basic usage:

```json
{
  "huggingface": {
    "apiUrl": "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-v0.1",
    "apiKey": "",
    "temperature": 0.8,
    "maxTokens": 500
  },
  "fallback": {
    "enabled": true,
    "reason": "当AI API不可用时使用关键词匹配算法"
  },
  "aiPriority": ["huggingface", "fallback"]
}
```

**AI Provider Details:**

| Provider | Type | Requires API Key | Requires Local Installation |
|----------|------|------------------|----------------------------|
| Hugging Face | Cloud API | ❌ | ❌ |
| Fallback | Keyword Matching | ❌ | ❌ |

---

## 🎨 Design Philosophy

### Color Palette
- **Cream**: `#F5F5F0` - Warm, inviting background
- **Charcoal**: `#1A1A1A` - Rich, sophisticated text
- **Gold**: `#C5A059` - Luxurious accent color
- **Gray**: `#707070` - Subtle secondary text

### Typography
- **Playfair Display**: Elegant serif for headings
- **Inter**: Clean sans-serif for body text

---

## 🌐 SEO & Social

### Meta Tags
- Open Graph support for rich social sharing
- Twitter Card integration
- Structured data for search engines

### Share Features
- Twitter sharing integration
- Clipboard copy functionality
- Custom share text generation

---

## 📁 Project Structure

```
scentify/
├── index.html          # Main application entry
├── script.js           # Core functionality & AI integration
├── styles.css          # Custom styling & animations
├── config.json         # AI configuration settings
├── README.md           # Project documentation
├── .gitignore          # Git ignore rules
└── .github/
    └── workflows/
        └── deploy.yml   # GitHub Pages deployment
```

---

## 🤝 Contributing

We welcome contributions! Please feel free to:
- Submit bug reports
- Suggest new features
- Create pull requests

---

## 📜 License

This project is for demonstration and portfolio purposes. Please contact us for commercial licensing inquiries.

---

## 📧 Contact

- **Website**: [echoscent.app](https://echoscent.app)
- **Twitter**: [@EchoScentApp](https://twitter.com/EchoScentApp)
- **Email**: hello@echoscent.app

---

*Transforming memories into scent since 2024*

---

[![Deploy to GitHub Pages](https://github.com/EcstaticMurdockal/scentify/actions/workflows/deploy.yml/badge.svg)](https://github.com/EcstaticMurdockal/scentify/actions/workflows/deploy.yml)