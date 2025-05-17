# Dzidza - Language Learning Platform

A modern language learning platform built for Zimbabweans to learn and translate between different languages. The platform supports translations between English, German, Russian, and Spanish, with plans to integrate local Zimbabwean languages in the future.

## Features

- Real-time translation between multiple languages
- Print or download translations
- Learning resource recommendations
- Support for Zimbabwean languages (coming soon)
- Modern, responsive UI built with React and Tailwind CSS

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- DeepSeek API key

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd dzidza_app
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
VITE_API_URL=https://api.deepseek.com/v1
VITE_API_KEY=your_api_key_here
```

4. Start the development server:
```bash
npm run dev
```

## Usage

1. Select the source language from the dropdown
2. Select the target language from the dropdown
3. Enter the text you want to translate
4. Click the "Translate" button
5. View the translation and learning resources
6. Use the "Print Translation" button to print or save the translation

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
