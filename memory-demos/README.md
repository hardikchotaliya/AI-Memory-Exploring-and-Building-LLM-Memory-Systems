# LLM Memory Experiments

Author: [@mor10](https://github.com/mor10)

Four demonstrations of how virtual memory works (and doesn't work) in LLM-powered applications. 

## Installation

### Using GitHub Codespaces (Recommended)
The easiest way to get started is using GitHub Codespaces, which comes pre-configured with all necessary environment variables. 
1. Open the repository in GitHub Codespaces.
2. Navigate to the `memory-demos` folder:
```bash
cd memory-demos
```
3. Start the app:
```bash
npm run dev
```
4. Follow the instructions to open the app in your browser.
5. To stop the app, press `Ctrl+C` in the terminal.

### Local Installation
1. Clone the parent repository
2. Navigate to the `memory-demos` folder:
```bash
cd memory-demos
```
3. Install dependencies:
```bash
npm install
```
4. Copy `template.env` to `.env` and add your GitHub Personal Access Token and/or OpenAI API key.
2. In terminal, run `npm run dev` to start the app.
3. Follow the instructions to open the app in your browser.
4. To stop the app, press `Ctrl+C` in the terminal.


## Configuration

### API Providers
- **GitHub Models** (Default): No additional configuration needed on Codespaces. For local installation, add your GitHub Personal Access Token to `.env`
- **OpenAI**: To use OpenAI's models instead:
  1. Add your OpenAI API key to `.env`
  2. Change the `apiProvider` setting in `./app/config.ts`

## Disclaimer

This application is for demonstration purposes only and should not be used in production environments.
