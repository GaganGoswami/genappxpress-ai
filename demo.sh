#!/usr/bin/env bash
# GenAppXpress Demo Script

set -e

echo "🔥 Welcome to GenAppXpress Demo!"
echo "=================================="
echo ""

if command -v open >/dev/null 2>&1; then
  BROWSER_CMD="open"
elif command -v xdg-open >/dev/null 2>&1; then
  BROWSER_CMD="xdg-open"
elif command -v start >/dev/null 2>&1; then
  BROWSER_CMD="start"
else
  echo "❌ No browser command found"
  exit 1
fi

echo "🚀 Starting demo..."
echo "📂 Opening index.html in your default browser..."
$BROWSER_CMD index.html

echo ""
echo "✨ Demo Features:"
echo "   • Visual technology stack selection including AI frameworks"
echo "   • Real-time compatibility checking for AI integrations"
echo "   • Interactive project structure preview with agent files"
echo "   • Shell script generation and download"
echo "   • Template system with AI-specific stacks like RAG and Chatbots"
echo "   • Dark/Light theme support"
echo ""
echo "🎯 Try creating an AI agent project with LangChain and OpenAI!"
