# SurveyForge 🚀

SurveyForge is an AI-powered survey creation platform that revolutionizes how you create and manage surveys. Simply describe what you want, and let our AI generate professional survey questions instantly.



<div align="center">
  <a href="https://shipwrecked.hackclub.com/?t=ghrm" target="_blank">
    <img src="https://hc-cdn.hel1.your-objectstorage.com/s/v3/739361f1d440b17fc9e2f74e49fc185d86cbec14_badge.png" 
         alt="This project is part of Shipwrecked, the world's first hackathon on an island!" 
         style="width: 35%;">
  </a>
</div>



## 🌟 Features

### 🤖 AI-Powered Survey Generation
- Transform natural language descriptions into well-structured surveys
- Get intelligent question suggestions based on your requirements
- Save hours of manual survey creation time

### 📤 Multi-Platform Export
- Export surveys to Google Forms
- More platforms coming soon (TypeForm, SurveyMonkey, etc.)

### 🎨 Modern User Interface
- Clean, intuitive dashboard
- Dark mode support
- Responsive design for all devices

### 🔒 Secure Authentication
- Powered by Supabase authentication
- Google Sign-in support
- Secure user data handling

## 🚀 Live Demo

Visit [surveyforge.xyz](https://surveyforge.xyz) to try out the live version!

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 19, TailwindCSS
- **Backend**: Next.js API Routes, Supabase
- **AI**: Google Gemini API
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL
- **Styling**: TailwindCSS, Radix UI
- **Animations**: GSAP

## 🏃‍♂️ Running Locally

### Prerequisites

- Node.js 18+ 
- npm/yarn/pnpm
- A Supabase account
- A Google Cloud account (for Gemini API)

### Environment Variables

Create a `.env.local` file in the root directory with:

```bash
# for auth & db
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# currently, we only support gemini
GEMINI_API_KEY=your_gemini_api_key

# for google 0auth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### Installation

1. Clone the repository
```bash
git clone https://github.com/shashwtd/survey-forge.git
cd survey-forge
```

2. Install dependencies
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Start the development server
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app running.

## 📝 Usage

1. Sign in using your email or Google account
2. Click "Create New Survey"
3. Describe your survey requirements in natural language
4. Review and edit the AI-generated questions
5. Export to your preferred platform
6. Share with your audience!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 💖 Support

If you find SurveyForge helpful, consider:
- Giving it a ⭐️ on GitHub
- Sharing it with friends and colleagues
- [Buying me a coffee](coff.ee/heiwa)

## 🔗 Links

- [Website](https://surveyforge.xyz)
- [Bug Report](https://github.com/shashwtd/survey-forge/issues)

---

Built with ❤️ by [shashwtd](https://github.com/shashwtd)
