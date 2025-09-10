/**
 * GenAppXpress Tech Stack Data & Utilities
 * ----------------------------------------
 * This module defines the supported technology stacks, templates, and utility functions
 * for project scaffolding, compatibility checking, environment generation, and script creation.
 *
 * ## Exports:
 * - TECH_STACK: Object containing all supported frontend, backend, database, tools, AI frameworks, LLM providers, protocols, and templates.
 * - CATEGORY_LABELS: Mapping of stack keys to human-readable labels.
 * - checkCompatibility(selected): Checks for conflicts and warnings in a selected stack.
 * - generateEnv(selected): Generates .env file content based on selected providers.
 * - generateReadme(cfg): Creates a README.md string for the generated project.
 * - generateStructure(cfg): Returns a nested object representing the project file structure and contents.
 * - flattenStructure(struct, prefix): Flattens a nested structure to a list of file paths.
 * - generateScript(cfg): Generates a bash setup script for the selected stack/template.
 *
 * ## Key Concepts:
 * - Template Presets: Each template defines a preset stack (frontend, backend, AI, etc.) used for scaffolding and dependency aggregation.
 * - Compatibility: Functions check for valid combinations and warn about unsupported pairings.
 * - Script Generation: The setup script installs only the dependencies relevant to the selected template or stack.
 * - Structure Generation: Project files are generated based on the selected stack and template, with enhancements for specific templates.
 *
 * ## Usage:
 * Import this module in your React app or CLI to access stack data and utilities for project generation.
 * Example:
 *   import { TECH_STACK, generateScript } from './techData';
 *   const script = generateScript({ projectName: 'MyApp', templates: ['ai-chatbot'], ... });
 *
 * ## For More Info:
 * See README.md or visit the GenAppXpress documentation site.
 */
// Tech stack, labels, compatibility, and generation logic for GenAppXpress
export const TECH_STACK = {
  frontend: [
    {id:'react',name:'React',description:'UI library',compatible:['vite','webpack','typescript','tailwind','jest','express','fastapi'],commands:['npm install react react-dom'],configFiles:['src/App.jsx']},
    {id:'vue',name:'Vue.js',description:'Progressive framework',compatible:['vite','webpack','typescript'],commands:['npm install vue'],configFiles:['src/main.js']},
    {id:'nextjs',name:'Next.js',description:'SSR React framework',compatible:['typescript','tailwind'],commands:['npx create-next-app@latest'],configFiles:['next.config.js']},
  ],
  backend: [
    {id:'express',name:'Express.js',description:'Fast Node.js web framework',compatible:['react','vue','nextjs','postgresql','mysql','mongodb','sqlite','redis','langchain','openai'],commands:['npm install express cors helmet'],configFiles:['server/server.js']},
    {id:'fastapi',name:'FastAPI',description:'Python high-performance API',compatible:['postgresql','mysql','sqlite','langchain','openai','anthropic','gemini'],commands:['pip install fastapi uvicorn'],configFiles:['api/main.py']},
  ],
  database: [
    {id:'postgresql',name:'PostgreSQL',description:'Advanced RDBMS',compatible:['express','fastapi','springboot','django','langchain','mcp'],commands:['npm install pg'],configFiles:['database/schema.sql']},
    {id:'mongodb',name:'MongoDB',description:'Document database',compatible:['express','node'],commands:['npm install mongoose'],configFiles:['database/models']},
    {id:'redis',name:'Redis',description:'In-memory cache & store',compatible:['express','fastapi','langchain'],commands:['npm install ioredis'],configFiles:['database/redis.js']},
    {id:'pinecone',name:'Pinecone',description:'Managed vector database',compatible:['langchain','openai','anthropic','gemini','fastapi','express'],commands:['pip install pinecone-client'],configFiles:['database/vector/pinecone_client.py']},
    {id:'chroma',name:'ChromaDB',description:'Open-source vector database',compatible:['langchain','openai','anthropic','gemini','fastapi','express'],commands:['pip install chromadb'],configFiles:['database/vector/chroma_client.py']},
    {id:'weaviate',name:'Weaviate',description:'Vector search engine',compatible:['langchain','openai','anthropic','gemini','fastapi','express'],commands:['pip install weaviate-client'],configFiles:['database/vector/weaviate_client.py']},
    {id:'qdrant',name:'Qdrant',description:'Vector similarity search',compatible:['langchain','openai','anthropic','gemini','fastapi','express'],commands:['pip install qdrant-client'],configFiles:['database/vector/qdrant_client.py']},
  ],
  tools: [
    {id:'docker',name:'Docker',description:'Containers & compose',compatible:['*'],commands:['docker --version'],configFiles:['Dockerfile','docker-compose.yml']},
    {id:'eslint',name:'ESLint',description:'Linting',compatible:['react','vue','express'],commands:['npm install -D eslint'],configFiles:['.eslintrc.cjs']},
    {id:'typescript',name:'TypeScript',description:'Static typing',compatible:['react','vue','nextjs','express'],commands:['npm install -D typescript @types/node'],configFiles:['tsconfig.json']},
  ],
  aiFrameworks: [
    {id:'langchain',name:'LangChain',description:'Chaining & agents',compatible:['openai','anthropic','gemini','xai','ollama','mcp','fastapi','express'],commands:['pip install langchain'],configFiles:['agents/agent.py']},
    {id:'crewai',name:'CrewAI',description:'Role-based multi-agent',compatible:['openai','anthropic','gemini','xai','ollama'],commands:['pip install crewai'],configFiles:['agents/crew_agent.py']},
    {id:'langgraph',name:'LangGraph',description:'Graph orchestration',compatible:['openai','anthropic','gemini'],commands:['pip install langgraph'],configFiles:['agents/graph/graph.py']},
    {id:'semantic-kernel',name:'Semantic Kernel',description:'Model-agnostic orchestration',compatible:['openai','anthropic','gemini','xai'],commands:['pip install semantic-kernel'],configFiles:['agents/sk/kernel.py']},
    {id:'autogen',name:'Microsoft AutoGen',description:'Multi-agent orchestration',compatible:['openai','anthropic','gemini'],commands:['pip install pyautogen'],configFiles:['agents/autogen/loop.py']},
  ],
  llmProviders: [
    {id:'openai',name:'OpenAI',description:'Agents + GPT models',compatible:['langchain','crewai','langgraph','semantic-kernel','autogen'],commands:['pip install openai'],configFiles:['providers/openai_client.py']},
    {id:'anthropic',name:'Anthropic',description:'Claude models',compatible:['langchain','crewai','langgraph','semantic-kernel'],commands:['pip install anthropic'],configFiles:['providers/anthropic_client.py']},
    {id:'gemini',name:'Google Gemini',description:'Multimodal models',compatible:['langchain','crewai','langgraph'],commands:['pip install google-generativeai'],configFiles:['providers/gemini_client.py']},
    {id:'xai',name:'xAI Grok',description:'Grok models',compatible:['langchain','crewai'],commands:['pip install groq'],configFiles:['providers/xai_client.py']},
    {id:'ollama',name:'Ollama',description:'Local models runtime',compatible:['langchain','crewai','semantic-kernel'],commands:[],configFiles:['providers/ollama_client.py']},
  ],
  protocols: [
    {id:'mcp',name:'MCP',description:'Model Context Protocol integration',compatible:['openai','anthropic','langchain','postgresql'],commands:['npm install mcp-sdk'],configFiles:['agents/mcp/client.js']},
    {id:'swarm',name:'Swarm',description:'Lightweight agent protocol concept',compatible:['openai','anthropic'],commands:[],configFiles:['agents/swarm/readme.md']},
  ],
  templates: [
  {id:'ai-chatbot',name:'AI Chatbot',category:'Conversational',description:'Streaming chat UI + provider adapter',preset:{frontend:['react'],backend:['express'],aiFrameworks:['langchain'],llmProviders:['openai'],protocols:[]}},
  {id:'support-triage',name:'Support Triage Bot',category:'Conversational',description:'Classify & respond to support tickets',preset:{frontend:['react'],backend:['express'],aiFrameworks:['langchain'],llmProviders:['anthropic'],protocols:[]}},
  {id:'slack-bot',name:'Slack Bot',category:'Conversational',description:'Slack events + agent replies',preset:{backend:['express'],aiFrameworks:['crewai'],llmProviders:['openai'],protocols:[]}},
  {id:'rag-service',name:'RAG Service',category:'RAG / Retrieval',description:'Embedding + vector search API',preset:{backend:['fastapi'],database:['chroma'],aiFrameworks:['langchain'],llmProviders:['openai'],protocols:[]}},
  {id:'pdf-chat',name:'PDF Chat',category:'RAG / Retrieval',description:'Upload PDFs and chat over content',preset:{frontend:['react'],backend:['fastapi'],database:['chroma'],aiFrameworks:['langchain'],llmProviders:['openai'],protocols:[]}},
  {id:'vector-ingest',name:'Vector Ingest Pipeline',category:'RAG / Retrieval',description:'Chunking + embedding loader service',preset:{backend:['fastapi'],database:['pinecone'],aiFrameworks:['langchain'],llmProviders:['openai'],protocols:[]}},
  {id:'web-research',name:'Web Research Agent',category:'Research / Automation',description:'Planning + browsing tools',preset:{frontend:['react'],backend:['express'],aiFrameworks:['crewai'],llmProviders:['openai'],protocols:['mcp']}},
  {id:'process-automator',name:'Process Automator',category:'Research / Automation',description:'Role agents for workflows',preset:{backend:['fastapi'],aiFrameworks:['crewai'],llmProviders:['anthropic'],protocols:[]}},
  {id:'cron-agent',name:'Scheduled Cron Agent',category:'Research / Automation',description:'Time / cron triggered background tasks',preset:{backend:['fastapi'],aiFrameworks:['langchain'],llmProviders:['openai'],protocols:[]}},
  {id:'workflow-designer',name:'Workflow Designer',category:'Orchestration',description:'Visual multi-agent flow editor',preset:{frontend:['react'],backend:['express'],aiFrameworks:['crewai'],llmProviders:['openai'],protocols:[]}},
  {id:'agent-orchestrator',name:'Agent Orchestrator',category:'Orchestration',description:'Router + tool registry service',preset:{backend:['fastapi'],aiFrameworks:['langgraph'],llmProviders:['openai'],protocols:['mcp']}},
  {id:'code-assistant-mcp',name:'Code Assistant + MCP',category:'Dev Tools',description:'Dev agent w/ repo tools',preset:{frontend:['react'],backend:['express'],aiFrameworks:['langchain'],llmProviders:['anthropic'],protocols:['mcp']}},
  {id:'evaluation-suite',name:'Evaluation Suite',category:'Dev Tools',description:'Prompt & agent eval harness',preset:{backend:['fastapi'],aiFrameworks:['langchain'],llmProviders:['openai'],protocols:[]}},
  {id:'analytics-dashboard',name:'Analytics Dashboard',category:'Observability',description:'Usage metrics + tracing UI',preset:{frontend:['react'],backend:['express'],aiFrameworks:['langchain'],llmProviders:['openai'],protocols:[]}},
  {id:'multimodal-assistant',name:'Multimodal Assistant',category:'Multimodal',description:'Image + text reasoning',preset:{frontend:['react'],backend:['fastapi'],aiFrameworks:['langchain'],llmProviders:['gemini'],protocols:[]}},
  {id:'multimodal-search',name:'Multimodal Search',category:'Multimodal',description:'Blend text & image search over corpus',preset:{backend:['fastapi'],aiFrameworks:['langchain'],llmProviders:['gemini'],protocols:[]}},
  {id:'local-first',name:'Local-first App',category:'Local & Edge',description:'Offline dev w/ Ollama',preset:{frontend:['react'],backend:['express'],aiFrameworks:['langchain'],llmProviders:['ollama'],protocols:[]}},
  {id:'edge-functions',name:'Edge Functions Starter',category:'Local & Edge',description:'Geo-distributed serverless agents',preset:{frontend:['react'],backend:['express'],aiFrameworks:['langchain'],llmProviders:['openai'],protocols:[]}},
  {id:'email-assistant',name:'Email Assistant',category:'Integrations',description:'Summarize & draft replies',preset:{backend:['fastapi'],aiFrameworks:['langchain'],llmProviders:['anthropic'],protocols:[]}},
  {id:'jira-helper',name:'Jira Helper',category:'Integrations',description:'Ticket summarization & action suggestions',preset:{backend:['express'],aiFrameworks:['langchain'],llmProviders:['openai'],protocols:[]}},
  {id:'knowledge-base',name:'Knowledge Base Portal',category:'Knowledge',description:'Docs site + semantic search',preset:{frontend:['react'],backend:['fastapi'],database:['weaviate'],aiFrameworks:['langchain'],llmProviders:['openai'],protocols:[]}},
  ]
};

export const CATEGORY_LABELS = {
  frontend:'Frontend', backend:'Backend', database:'Database', tools:'Dev Tools', aiFrameworks:'AI Frameworks', llmProviders:'LLM Providers', protocols:'Protocols'
};

export function checkCompatibility(selected){
  const conflicts=[]; const warnings=[];
  selected.frontend.forEach(fid=>{selected.backend.forEach(bid=>{
    const f=TECH_STACK.frontend.find(t=>t.id===fid); const b=TECH_STACK.backend.find(t=>t.id===bid);
    if(f && b){
      const frontOk = f.compatible.includes(bid) || f.compatible.includes('*');
      const backOk = b.compatible.includes(fid) || b.compatible.includes('*');
      if(!frontOk && !backOk){conflicts.push(`${f.name} may not pair cleanly with ${b.name}`);} }
  });});
  selected.aiFrameworks.forEach(aid=>{const af=TECH_STACK.aiFrameworks.find(a=>a.id===aid); if(!af) return; selected.llmProviders.forEach(pid=>{if(!af.compatible.includes(pid)){warnings.push(`${af.name} not validated for provider ${pid} – check docs.`);}});});
  if(selected.protocols.includes('mcp') && !selected.llmProviders.some(p=>['openai','anthropic'].includes(p))){warnings.push('MCP usually paired with OpenAI or Anthropic for richer tool calling.');}
  return {conflicts,warnings};
}

export function generateEnv(selected){
  let lines=[]; 
  // LLM Provider API keys
  if(selected.llmProviders.includes('openai')) lines.push('OPENAI_API_KEY=');
  if(selected.llmProviders.includes('anthropic')) lines.push('ANTHROPIC_API_KEY=');
  if(selected.llmProviders.includes('gemini')) lines.push('GEMINI_API_KEY=');
  if(selected.llmProviders.includes('xai')) lines.push('XAI_API_KEY=');
  if(selected.llmProviders.includes('ollama')) lines.push('OLLAMA_HOST=localhost');
  
  // Vector Database configurations
  if(selected.database.includes('pinecone')) {
    lines.push('PINECONE_API_KEY=');
    lines.push('PINECONE_ENVIRONMENT=us-east-1-aws');
  }
  if(selected.database.includes('chroma')) {
    lines.push('CHROMA_DB_PATH=./chroma_db');
  }
  if(selected.database.includes('weaviate')) {
    lines.push('WEAVIATE_URL=http://localhost:8080');
    lines.push('WEAVIATE_API_KEY=');
  }
  if(selected.database.includes('qdrant')) {
    lines.push('QDRANT_URL=http://localhost:6333');
    lines.push('QDRANT_API_KEY=');
  }
  
  lines.push('NODE_ENV=development');
  return lines.join('\n');
}

export function generateReadme(cfg){
  const stackLines = Object.keys(CATEGORY_LABELS).map(cat=>{const arr=cfg[cat]; if(!arr||!arr.length) return ''; return `- **${CATEGORY_LABELS[cat]}:** ${arr.join(', ')}`;}).filter(Boolean).join('\n');
  const templateLine = cfg.templates && cfg.templates.length ? `\n## Templates\n- ${cfg.templates.join(', ')}` : '';
  return `# ${cfg.projectName}\n\nGenerated with **GenAppXpress**.${templateLine}\n\n## Selected Stack\n${stackLines}\n\n## Getting Started\nRun the generated setup script or follow manual steps.\n\n## AI Notes\nIf using AI providers set the API keys in .env before running agent scripts.\n`;}

export function generateStructure(cfg){
  const useTS = cfg.tools.includes('typescript');
  const reactSelected = cfg.frontend.includes('react');
  const vueSelected = cfg.frontend.includes('vue');
  const nextSelected = cfg.frontend.includes('nextjs');
  const expressSelected = cfg.backend.includes('express');
  const fastapiSelected = cfg.backend.includes('fastapi');
  const selectedTemplates = cfg.templates || []; // array of template ids

  const pkg = {
    name: cfg.projectName,
    private: true,
    type: 'module',
    scripts: {
      ...(reactSelected || vueSelected ? { dev: 'vite', build: 'vite build', preview: 'vite preview' } : {}),
      ...(nextSelected ? { dev: 'next dev', build: 'next build', start: 'next start' } : {}),
      ...(expressSelected ? { server: 'node server/server.js' } : {}),
      ...(fastapiSelected ? { 'api': 'uvicorn api.main:app --reload' } : {}),
    },
    dependencies: {},
    devDependencies: {}
  };

  function addDep(name, version='latest'){ pkg.dependencies[name]=version; }
  function addDevDep(name, version='latest'){ pkg.devDependencies[name]=version; }

  if(reactSelected){ addDep('react'); addDep('react-dom'); addDep('vite'); }
  if(vueSelected){ addDep('vue'); addDep('vite'); }
  if(nextSelected){ addDep('next'); addDep('react'); addDep('react-dom'); }
  if(expressSelected){ addDep('express'); addDep('cors'); addDep('helmet'); }
  // If OpenAI provider selected and potential chat usage, include openai dependency
  if(cfg.llmProviders.includes('openai') && expressSelected && reactSelected){ addDep('openai'); }
  if(cfg.database.includes('postgresql')) addDep('pg');
  if(cfg.database.includes('mongodb')) addDep('mongoose');
  if(cfg.database.includes('redis')) addDep('ioredis');
  if(cfg.protocols.includes('mcp')) addDep('mcp-sdk');
  if(cfg.tools.includes('eslint')) { addDevDep('eslint'); }
  if(useTS){ addDevDep('typescript'); if(expressSelected) addDevDep('@types/express'); if(reactSelected) { addDevDep('@types/react'); addDevDep('@types/react-dom'); } }

  // --- FRONTEND CODE (React / Vue / Next) ---
  const srcDir = {};
  if(reactSelected){
    const appFile = useTS? 'App.tsx':'App.jsx';
    const mainFile = useTS? 'main.tsx':'main.jsx';
    const wantChatUI = cfg.llmProviders.length>0 && (expressSelected || fastapiSelected);
    const chatComponentName = 'ChatClient';
    if(wantChatUI){
      srcDir['components'] = srcDir['components'] || {};
      srcDir['components'][`${chatComponentName}.${useTS?'tsx':'jsx'}`] = `import React, { useState } from 'react';\nexport default function ${chatComponentName}(){\n  const [messages,setMessages]=useState([]);\n  const [input,setInput]=useState('');\n  async function send(e){ e.preventDefault(); if(!input.trim()) return; const userMsg={role:'user',content:input}; setMessages(m=>[...m,userMsg]); setInput(''); try { const r=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message: userMsg.content})}); const j=await r.json(); setMessages(m=>[...m,{role:'assistant',content:j.reply||JSON.stringify(j)}]); } catch(err){ setMessages(m=>[...m,{role:'assistant',content:'Error: '+err.message}]); }}\n  return <div style={{border:'1px solid #ccc',borderRadius:8,padding:16,marginTop:24}}><h3 style={{marginTop:0}}>Chat</h3><div style={{maxHeight:200,overflow:'auto',background:'#111b1c',color:'#d6f2f4',padding:8,borderRadius:6,fontFamily:'monospace',fontSize:12}}>{messages.map((m,i)=><div key={i}><strong>{m.role==='user'?'You':'AI'}:</strong> {m.content}</div>)}</div><form onSubmit={send} style={{display:'flex',gap:8,marginTop:8}}><input value={input} onChange={e=>setInput(e.target.value)} placeholder='Ask something...' style={{flex:1,padding:8}}/><button type='submit'>Send</button></form></div>; }`;
    }
    srcDir[appFile] = `import React from 'react';${wantChatUI?`\nimport ${chatComponentName} from './components/${chatComponentName}';`:''}\nexport default function App(){\n  return <div style={{fontFamily:'sans-serif',padding:32}}><h1>${cfg.projectName}</h1><p>Generated with GenAppXpress.</p>${wantChatUI?`<${chatComponentName} />`:''}</div>;\n}`;
    srcDir[mainFile] = `import React from 'react';\nimport { createRoot } from 'react-dom/client';\nimport App from './${appFile}';\nconst rootEl = document.getElementById('root');\nif(rootEl){ createRoot(rootEl).render(<App />); }`;
  }
  if(vueSelected){
    srcDir['main.js'] = `import { createApp } from 'vue';\nconst App={template:'<div style=\\"font-family:sans-serif;padding:32\\"><h1>${cfg.projectName}</h1><p>Generated with GenAppXpress (Vue).</p></div>'};\ncreateApp(App).mount('#root');`;
  }
  if(nextSelected){
    srcDir['pages'] = { 'index.js': `export default function Home(){return (<main style={{fontFamily:'sans-serif',padding:32}}><h1>${cfg.projectName}</h1><p>Generated with GenAppXpress (Next.js).</p></main>);}` };
    srcDir['next.config.js'] = `/** @type {import('next').NextConfig} */\nconst nextConfig = {};\nexport default nextConfig;`;
  }

  const indexHtml = (reactSelected||vueSelected) ? { 'index.html': `<!DOCTYPE html>\n<html><head><meta charset='UTF-8'/><title>${cfg.projectName}</title></head><body><div id='root'></div><script type='module' src='${reactSelected? (useTS?'src/main.tsx':'src/main.jsx') : 'src/main.js'}'></script></body></html>` } : {};

  // --- BACKEND CODE (Express) ---
  // --- SERVER (Express) with optional chat route integration ---
  let serverDir = undefined;
  let includeChatRoute = false;
  if(expressSelected){
    // If React frontend and any LLM provider selected, add a chat route
    includeChatRoute = reactSelected && cfg.llmProviders.length>0;
    const chatRouteFile = includeChatRoute ? {
      'routes': {
        'chat.js': `import { Router } from 'express';\n// Chat route dynamically uses provider if available.\nconst router = Router();\nconst haveOpenAI = !!process.env.OPENAI_API_KEY;\nconst haveOllama = !!process.env.OLLAMA_HOST;\nlet openaiClient = null;\n${cfg.llmProviders.includes('openai')?"try { const OpenAI = (await import('openai')).default; openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY }); } catch(_) {}\n":""}router.post('/chat', async (req,res)=>{\n  const { message } = req.body || {};\n  if(!message){ return res.status(400).json({error:'message required'}); }\n  try {\n    if(openaiClient && haveOpenAI){\n      const completion = await openaiClient.chat.completions.create({ model:'gpt-4o-mini', messages:[{role:'user', content: message}] });\n      return res.json({ reply: completion.choices[0].message.content });\n    }\n    if(haveOllama){\n      const host = process.env.OLLAMA_HOST || 'http://localhost:11434';\n      const r = await fetch(host+'/api/generate',{method:'POST',headers:{'Content-Type':'application/json'}, body: JSON.stringify({model:'llama3', prompt: message})});\n      const j = await r.json();\n      return res.json({ reply: (j.response||'').trim() });\n    }\n    return res.json({ reply: 'Echo: '+message });\n  } catch(err){\n    console.error(err);\n    return res.status(500).json({ error: err.message });\n  }\n});\nexport default router;\n`
      }
    } : {};
    const serverJs = `import express from 'express';\nimport cors from 'cors';\nimport helmet from 'helmet';\n${includeChatRoute?"import chatRouter from './routes/chat.js';\n":""}const app = express();\napp.use(helmet());\napp.use(cors());\napp.use(express.json());\napp.get('/api/health', (_req,res)=>res.json({ ok: true }));\n${includeChatRoute?"app.use('/api', chatRouter);\n":""}const port = process.env.PORT || 3001;\napp.listen(port, ()=>console.log('Express server running on '+port));\n`;
    serverDir = { 'server.js': serverJs, ...(chatRouteFile||{}) };
  }

  // --- BACKEND CODE (FastAPI) ---
  const wantRag = fastapiSelected && cfg.aiFrameworks.includes('langchain') && cfg.llmProviders.includes('openai');
  const apiDir = fastapiSelected ? {
    'main.py': `from fastapi import FastAPI, Depends\nfrom pydantic import BaseModel\nimport os\napp = FastAPI()\nclass Echo(BaseModel):\n    message: str\n@app.get('/health')\nasync def health():\n    return {'ok': True}\n@app.post('/echo')\nasync def echo(payload: Echo):\n    return {'echo': payload.message}\n${wantRag?"from .rag import get_retriever\nclass Ask(BaseModel):\n    question: str\n@app.post('/rag')\nasync def rag(q: Ask, retriever = Depends(get_retriever)):\n    docs = retriever(q.question)\n    return {'chunks': docs}\n":""}if __name__ == '__main__':\n    import uvicorn\n    uvicorn.run(app, host='0.0.0.0', port=int(os.getenv('PORT', 8000)))\n`,
    ...(wantRag ? { 'rag.py': `# Minimal placeholder retriever for RAG demo\nfrom typing import List, Callable\nCORPUS = [\n  'GenAppXpress accelerates scaffolding.',\n  'LangChain enables composable LLM workflows.',\n  'FastAPI delivers high-performance async APIs.'\n]\ndef simple_retriever(query: str) -> List[str]:\n  q=query.lower().split()\n  return [c for c in CORPUS if any(tok in c.lower() for tok in q)][:3]\ndef get_retriever() -> Callable[[str], List[str]]:\n  return simple_retriever\n` } : {})
  } : undefined;

  // --- DATABASE FILES ---
  const dbDir = cfg.database.length ? {} : undefined;
  if(dbDir){
    if(cfg.database.includes('postgresql')) dbDir['schema.sql'] = `-- Example PostgreSQL schema\nCREATE TABLE IF NOT EXISTS items (id SERIAL PRIMARY KEY, name TEXT NOT NULL);`;
    if(cfg.database.includes('mongodb')) dbDir['models'] = { 'index.js': `import mongoose from 'mongoose';\nconst ItemSchema = new mongoose.Schema({ name: String });\nexport const Item = mongoose.model('Item', ItemSchema);` };
    if(cfg.database.includes('redis')) dbDir['redis.js'] = `import Redis from 'ioredis';\nexport const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');`;
    
    // Vector Database clients
    if(cfg.database.includes('pinecone')) {
      dbDir['vector'] = dbDir['vector'] || {};
      dbDir['vector']['pinecone_client.py'] = `"""Pinecone vector database client setup."""\nimport os\nfrom pinecone import Pinecone, ServerlessSpec\n\n# Initialize Pinecone\npc = Pinecone(api_key=os.getenv('PINECONE_API_KEY'))\n\n# Example index configuration\nINDEX_NAME = 'rag-embeddings'\nDIMENSION = 1536  # OpenAI ada-002 embeddings\n\ndef create_index():\n    \"\"\"Create index if it doesn't exist.\"\"\"\n    if INDEX_NAME not in pc.list_indexes().names():\n        pc.create_index(\n            name=INDEX_NAME,\n            dimension=DIMENSION,\n            metric='cosine',\n            spec=ServerlessSpec(cloud='aws', region='us-east-1')\n        )\n    return pc.Index(INDEX_NAME)\n\ndef get_index():\n    \"\"\"Get existing index.\"\"\"\n    return pc.Index(INDEX_NAME)\n\nif __name__ == '__main__':\n    index = create_index()\n    print(f'Connected to Pinecone index: {INDEX_NAME}')`;
    }
    
    if(cfg.database.includes('chroma')) {
      dbDir['vector'] = dbDir['vector'] || {};
      dbDir['vector']['chroma_client.py'] = `"""ChromaDB vector database client setup."""\nimport chromadb\nfrom chromadb.config import Settings\nimport os\n\n# Initialize ChromaDB client\nclient = chromadb.PersistentClient(\n    path=os.getenv('CHROMA_DB_PATH', './chroma_db'),\n    settings=Settings(anonymized_telemetry=False)\n)\n\n# Default collection name\nCOLLECTION_NAME = 'rag_documents'\n\ndef get_or_create_collection(name=COLLECTION_NAME):\n    \"\"\"Get or create a collection.\"\"\"\n    return client.get_or_create_collection(\n        name=name,\n        metadata={\"hnsw:space": "cosine"}\n    )\n\ndef add_documents(collection, documents, embeddings, ids, metadatas=None):\n    \"\"\"Add documents to collection.\"\"\"\n    collection.add(\n        documents=documents,\n        embeddings=embeddings,\n        ids=ids,\n        metadatas=metadatas or [{}] * len(documents)\n    )\n\ndef query_collection(collection, query_embedding, n_results=5):\n    \"\"\"Query collection with embedding.\"\"\"\n    return collection.query(\n        query_embeddings=[query_embedding],\n        n_results=n_results\n    )\n\nif __name__ == '__main__':\n    collection = get_or_create_collection()\n    print(f'ChromaDB collection ready: {COLLECTION_NAME}')`;
    }
    
    if(cfg.database.includes('weaviate')) {
      dbDir['vector'] = dbDir['vector'] || {};
      dbDir['vector']['weaviate_client.py'] = `"""Weaviate vector database client setup."""\nimport weaviate\nimport os\n\n# Initialize Weaviate client\nclient = weaviate.Client(\n    url=os.getenv('WEAVIATE_URL', 'http://localhost:8080'),\n    auth_client_secret=weaviate.AuthApiKey(api_key=os.getenv('WEAVIATE_API_KEY', ''))\n)\n\n# Schema definition\nSCHEMA = {\n    "classes": [{\n        "class": "Document",\n        "description": "RAG document chunks",\n        "properties": [\n            {\n                "name": "content",\n                "dataType": ["text"],\n                "description": "Document content"\n            },\n            {\n                "name": "source",\n                "dataType": ["string"],\n                "description": "Source file or URL"\n            },\n            {\n                "name": "chunk_id",\n                "dataType": ["int"],\n                "description": "Chunk identifier"\n            }\n        ]\n    }]\n}\n\ndef create_schema():\n    \"\"\"Create schema if it doesn't exist.\"\"\"\n    try:\n        client.schema.create(SCHEMA)\n        print("Schema created successfully")\n    except Exception as e:\n        print(f"Schema might already exist: {e}")\n\ndef add_document(content, source, chunk_id):\n    \"\"\"Add a document to Weaviate.\"\"\"\n    return client.data_object.create(\n        data_object={\n            "content": content,\n            "source": source,\n            "chunk_id": chunk_id\n        },\n        class_name="Document"\n    )\n\ndef search_documents(query, limit=5):\n    \"\"\"Search documents using vector similarity.\"\"\"\n    return (\n        client.query\n        .get("Document", ["content", "source", "chunk_id"])\n        .with_near_text({"concepts": [query]})\n        .with_limit(limit)\n        .do()\n    )\n\nif __name__ == '__main__':\n    create_schema()\n    print('Weaviate client ready')`;
    }
    
    if(cfg.database.includes('qdrant')) {
      dbDir['vector'] = dbDir['vector'] || {};
      dbDir['vector']['qdrant_client.py'] = `"""Qdrant vector database client setup."""\nfrom qdrant_client import QdrantClient\nfrom qdrant_client.http import models\nimport os\n\n# Initialize Qdrant client\nclient = QdrantClient(\n    url=os.getenv('QDRANT_URL', 'http://localhost:6333'),\n    api_key=os.getenv('QDRANT_API_KEY')\n)\n\n# Collection configuration\nCOLLECTION_NAME = 'rag_documents'\nVECTOR_SIZE = 1536  # OpenAI ada-002 embeddings\n\ndef create_collection():\n    \"\"\"Create collection if it doesn't exist.\"\"\"\n    try:\n        client.create_collection(\n            collection_name=COLLECTION_NAME,\n            vectors_config=models.VectorParams(\n                size=VECTOR_SIZE,\n                distance=models.Distance.COSINE\n            )\n        )\n        print(f"Collection '{COLLECTION_NAME}' created")\n    except Exception as e:\n        print(f"Collection might already exist: {e}")\n\ndef add_points(points):\n    \"\"\"Add points to collection.\"\"\"\n    return client.upsert(\n        collection_name=COLLECTION_NAME,\n        points=points\n    )\n\ndef search_points(query_vector, limit=5):\n    \"\"\"Search for similar vectors.\"\"\"\n    return client.search(\n        collection_name=COLLECTION_NAME,\n        query_vector=query_vector,\n        limit=limit\n    )\n\nif __name__ == '__main__':\n    create_collection()\n    print('Qdrant client ready')`;
    }
  }

  // --- AI PROVIDERS ---
  const providersDir = (cfg.llmProviders.length) ? {} : undefined;
  if(providersDir){
    if(cfg.llmProviders.includes('openai')) providersDir['openai_client.py'] = `from openai import OpenAI\nimport os\nclient = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))\nif __name__ == '__main__':\n    resp = client.chat.completions.create(model='gpt-4o-mini', messages=[{'role':'user','content':'Hello from OpenAI'}])\n    print(resp.choices[0].message.content)`;
    if(cfg.llmProviders.includes('anthropic')) providersDir['anthropic_client.py'] = `import anthropic, os\nclient = anthropic.Anthropic(api_key=os.getenv('ANTHROPIC_API_KEY'))\nif __name__ == '__main__':\n    msg = client.messages.create(model='claude-3-5-sonnet', max_tokens=50, messages=[{'role':'user','content':'Hello from Anthropic'}])\n    print(msg.content[0].text)`;
    if(cfg.llmProviders.includes('gemini')) providersDir['gemini_client.py'] = `import google.generativeai as genai, os\ngenai.configure(api_key=os.getenv('GEMINI_API_KEY'))\nif __name__ == '__main__':\n    model = genai.GenerativeModel('gemini-1.5-flash')\n    resp = model.generate_content('Hello from Gemini')\n    print(resp.text)`;
    if(cfg.llmProviders.includes('xai')) providersDir['xai_client.py'] = `from groq import Groq\nimport os\nclient = Groq(api_key=os.getenv('XAI_API_KEY'))\nif __name__ == '__main__':\n    resp = client.chat.completions.create(model='grok-beta', messages=[{'role':'user','content':'Hello from Grok'}])\n    print(resp.choices[0].message.content)`;
    if(cfg.llmProviders.includes('ollama')) providersDir['ollama_client.py'] = `import requests, os, json\nbase = os.getenv('OLLAMA_HOST','http://localhost:11434')\nif __name__ == '__main__':\n    r = requests.post(base+'/api/generate', json={'model':'llama3','prompt':'Hello from Ollama'})\n    print(r.json())`;
  }

  // --- AI FRAMEWORKS ---
  const frameworkDir = (cfg.aiFrameworks.length || providersDir) ? {} : undefined;
  if(frameworkDir){
    if(cfg.aiFrameworks.includes('langchain')) frameworkDir['agent_langchain.py'] = `"""LangChain quickstart example."""\nimport os\nfrom langchain_openai import ChatOpenAI\nfrom langchain_core.prompts import ChatPromptTemplate\nmodel = ChatOpenAI(api_key=os.getenv('OPENAI_API_KEY'), model='gpt-4o-mini', temperature=0)\nprompt = ChatPromptTemplate.from_messages([('system','You are concise.'),('user','{q}')])\nchain = prompt | model\nif __name__ == '__main__':\n    print(chain.invoke({'q':'Say hi in 5 words.'}))`;
    if(cfg.aiFrameworks.includes('crewai')) frameworkDir['agent_crewai.py'] = `"""CrewAI mini crew."""\nfrom crewai import Agent, Task, Crew\nassistant = Agent(role='Helper', goal='Assist briefly', backstory='A helpful AI', allow_delegation=False)\njob = Task(description='Give one-sentence motivation', agent=assistant)\nif __name__ == '__main__':\n    crew = Crew(agents=[assistant], tasks=[job])\n    print(crew.kickoff())`;
    if(cfg.aiFrameworks.includes('langgraph')) frameworkDir['agent_langgraph.py'] = `"""LangGraph minimal graph."""\nfrom langgraph.graph import StateGraph, END\nclass State(dict): pass\ndef one(s:State): s['msg']='Hello'; return s\ndef two(s:State): s['msg']+=' Graph'; return s\nsg=StateGraph(State)\nsg.add_node('one',one); sg.add_node('two',two)\nsg.set_entry_point('one'); sg.add_edge('one','two'); sg.add_edge('two',END)\napp=sg.compile()\nif __name__=='__main__': print(app.invoke({}))`;
    if(cfg.aiFrameworks.includes('semantic-kernel')) frameworkDir['agent_sk.py'] = `"""Semantic Kernel sample."""\nimport asyncio, os\nimport semantic_kernel as sk\nfrom semantic_kernel.connectors.ai.open_ai import OpenAIChatCompletion\nasync def main():\n  kernel=sk.Kernel()\n  if os.getenv('OPENAI_API_KEY'):\n    kernel.add_service(OpenAIChatCompletion(service_id='openai', api_key=os.getenv('OPENAI_API_KEY'), model_id='gpt-4o-mini'))\n    svc=kernel.get_service('openai'); print(await svc.complete('Write a 4 word motto.'))\n  else: print('No OPENAI_API_KEY set.')\nif __name__=='__main__': asyncio.run(main())`;
    if(cfg.aiFrameworks.includes('autogen')) frameworkDir['agent_autogen.py'] = `"""AutoGen simple chat."""\nfrom autogen import AssistantAgent, UserProxyAgent\nassistant=AssistantAgent('assistant'); user=UserProxyAgent('user', code_execution_config=False)\nif __name__=='__main__': user.initiate_chat(assistant, message='Say hi succinctly.')`;
  }

  // --- TEMPLATE-SPECIFIC ENHANCEMENTS ---
  function enhanceForTemplates(projectRoot){
    if(!selectedTemplates.length) return;
    // AI Chatbot: ensure chat instructions & README addition
    if(selectedTemplates.includes('ai-chatbot')){
      // Add frontend helper util
      if(reactSelected){
        projectRoot.src = projectRoot.src || {};
        projectRoot.src['chatApi.js'] = `export async function sendChat(message){ const r= await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message})}); return r.json(); }`;
      }
      // Append README guidance
      projectRoot['README.md'] += `\n## AI Chatbot\nStart backend (Express) then frontend. Use the chat box to converse with the selected model.${cfg.llmProviders.includes('openai')?' Requires OPENAI_API_KEY in .env.':''}\n`;
    }
    if(selectedTemplates.includes('rag-service') && fastapiSelected){
      // Enhanced RAG service with vector database integration
      const api = projectRoot.api || {};
      const hasVectorDB = cfg.database.some(db => ['pinecone', 'chroma', 'weaviate', 'qdrant'].includes(db));
      
      if(hasVectorDB) {
        // Advanced RAG with proper vector database
        api['vector_store.py'] = `"""Vector database integration for RAG service."""\nimport os\nfrom typing import List, Dict, Any\nfrom openai import OpenAI\n\n# Initialize OpenAI for embeddings\nclient = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))\n\n${cfg.database.includes('chroma') ? `\nimport chromadb\nfrom database.vector.chroma_client import get_or_create_collection\n\nclass ChromaVectorStore:\n    def __init__(self):\n        self.collection = get_or_create_collection()\n    \n    def add_documents(self, documents: List[str], metadatas: List[Dict] = None):\n        embeddings = self._get_embeddings(documents)\n        ids = [f"doc_{i}" for i in range(len(documents))]\n        self.collection.add(\n            documents=documents,\n            embeddings=embeddings,\n            ids=ids,\n            metadatas=metadatas or [{}] * len(documents)\n        )\n    \n    def similarity_search(self, query: str, k: int = 5) -> List[str]:\n        query_embedding = self._get_embeddings([query])[0]\n        results = self.collection.query(\n            query_embeddings=[query_embedding],\n            n_results=k\n        )\n        return results['documents'][0] if results['documents'] else []\n\nvector_store = ChromaVectorStore()` : ''}\n\n${cfg.database.includes('pinecone') ? `\nfrom database.vector.pinecone_client import get_index\n\nclass PineconeVectorStore:\n    def __init__(self):\n        self.index = get_index()\n    \n    def add_documents(self, documents: List[str], metadatas: List[Dict] = None):\n        embeddings = self._get_embeddings(documents)\n        vectors = []\n        for i, (doc, embedding) in enumerate(zip(documents, embeddings)):\n            vectors.append({\n                'id': f'doc_{i}',\n                'values': embedding,\n                'metadata': {'text': doc, **(metadatas[i] if metadatas else {})}\n            })\n        self.index.upsert(vectors=vectors)\n    \n    def similarity_search(self, query: str, k: int = 5) -> List[str]:\n        query_embedding = self._get_embeddings([query])[0]\n        results = self.index.query(\n            vector=query_embedding,\n            top_k=k,\n            include_metadata=True\n        )\n        return [match['metadata']['text'] for match in results['matches']]\n\nvector_store = PineconeVectorStore()` : ''}\n\ndef _get_embeddings(texts: List[str]) -> List[List[float]]:\n    \"\"\"Get embeddings using OpenAI.\"\"\"\n    response = client.embeddings.create(\n        model="text-embedding-ada-002",\n        input=texts\n    )\n    return [embedding.embedding for embedding in response.data]\n\ndef get_vector_store():\n    \"\"\"Get the configured vector store instance.\"\"\"\n    return vector_store`;
        
        api['ingest.py'] = `"""Enhanced document ingestion with vector embeddings."""\nfrom vector_store import get_vector_store\nimport os\nfrom typing import List\n\n# Sample documents for RAG\nSAMPLE_DOCS = [\n    "GenAppXpress is a rapid application scaffolding tool that generates full-stack applications with AI integration.",\n    "RAG (Retrieval Augmented Generation) combines vector search with language models for enhanced context.",\n    "FastAPI provides high-performance async APIs with automatic documentation generation.",\n    "LangChain enables composable LLM workflows with memory, tools, and agent capabilities.",\n    "Vector databases like Pinecone and ChromaDB store embeddings for semantic similarity search.",\n    "OpenAI's text-embedding-ada-002 model creates high-quality embeddings for text similarity.",\n    "Chunking strategies improve retrieval by breaking documents into optimal sizes.",\n    "Semantic search finds relevant content based on meaning rather than keyword matching."\n]\n\ndef ingest_documents(documents: List[str] = None):\n    \"\"\"Ingest documents into vector database.\"\"\"\n    if not documents:\n        documents = SAMPLE_DOCS\n    \n    vector_store = get_vector_store()\n    \n    # Add metadata for each document\n    metadatas = [{'source': 'sample_docs', 'chunk_id': i} for i in range(len(documents))]\n    \n    print(f"Ingesting {len(documents)} documents...")\n    vector_store.add_documents(documents, metadatas)\n    print("✅ Documents ingested successfully!")\n    \n    # Test search\n    print("\\n🔍 Testing search...")\n    results = vector_store.similarity_search("What is RAG?", k=3)\n    for i, result in enumerate(results, 1):\n        print(f"{i}. {result[:100]}...")\n\nif __name__ == '__main__':\n    ingest_documents()`;
        
        // Update main.py to use vector store
        if(api['main.py']) {
          api['main.py'] = api['main.py'].replace(
            'from .rag import get_retriever',
            'from .vector_store import get_vector_store'
          ).replace(
            '@app.post(\'/rag\')\nasync def rag(q: Ask, retriever = Depends(get_retriever)):\n    docs = retriever(q.question)\n    return {\'chunks\': docs}',
            '@app.post(\'/rag\')\nasync def rag(q: Ask):\n    vector_store = get_vector_store()\n    docs = vector_store.similarity_search(q.question, k=5)\n    return {\'question\': q.question, \'retrieved_chunks\': docs, \'num_results\': len(docs)}'
          );
        }
      } else {
        // Fallback to simple embedding store
        api['embeddings.py'] = `"""Simple in-memory embedding store (character code mean vector)."""\nfrom __future__ import annotations\nfrom math import sqrt\nfrom typing import List, Tuple\nSTORE: List[Tuple[str, float]] = []\ndef embed(text: str) -> float:\n    if not text: return 0.0\n    return sum(ord(c) for c in text) / len(text)\ndef add(doc: str): STORE.append((doc, embed(doc)))\ndef similarity(a: float, b: float) -> float:\n    # Since scalar, negative distance transform\n    return 1.0 - abs(a-b) / (max(a,b)+1e-6) if (a or b) else 0.0\ndef topk(query: str, k=3):\n    qv = embed(query)\n    scored = sorted(((doc, similarity(qv, dv)) for doc,dv in STORE), key=lambda x: x[1], reverse=True)\n    return [d for d,_ in scored[:k]]\nif __name__=='__main__':\n    docs=['LangChain enables composition.','FastAPI is fast.','RAG augments generation.']\n    for d in docs: add(d)\n    print(topk('fast api speed'))`;
        api['ingest.py'] = `"""Bulk ingest sample documents into embedding store."""\nfrom .embeddings import add\nSAMPLE=['GenAppXpress scaffolds projects.','Retrieval augments context','OpenAI provides powerful models']\nfor s in SAMPLE: add(s)\nprint('Ingested', len(SAMPLE), 'documents')`;
      }
      
      projectRoot.api = api;
      const vectorDBNote = hasVectorDB ? `\n## Vector Database\nThis project uses ${cfg.database.filter(db => ['pinecone', 'chroma', 'weaviate', 'qdrant'].includes(db)).join(' + ')} for vector storage.\nMake sure to set the required API keys in .env file.\n` : '';
      projectRoot['README.md'] += `\n## RAG Service\nRun:\n1. source .venv/bin/activate\n2. python api/ingest.py\n3. uvicorn api.main:app --reload\nPOST /rag {"question": "Your query"}${vectorDBNote}\n`;
    }
    if(selectedTemplates.includes('local-first') && expressSelected){
      // Provide a README note for Ollama usage
      projectRoot['README.md'] += `\n## Local-first\nStarts with Ollama. Ensure 'ollama run llama3' has been executed and OLLAMA_HOST is set if remote.\n`;
    }
    if(selectedTemplates.includes('web-research')){
      // CrewAI web research scaffold (Python)
      projectRoot.agents = projectRoot.agents || {};
      projectRoot.agents['web_research.py'] = `"""Simple web research crew using CrewAI (placeholder scraping)."""\nimport requests, re\nfrom crewai import Agent, Task, Crew\nURLS=['https://example.com','https://www.iana.org/domains/reserved']\nEXTRACT_RE=re.compile(r'<title>(.*?)</title>', re.I|re.S)\ndef fetch_title(u:str):\n    try:\n        html=requests.get(u,timeout=10).text\n        m=EXTRACT_RE.search(html)\n        return (u, m.group(1).strip() if m else 'No Title')\n    except Exception as e:\n        return (u, f'Error: {e}')\nresearcher=Agent(role='Researcher', goal='Collect page titles', backstory='Find concise titles', allow_delegation=False)\nsummary_agent=Agent(role='Summarizer', goal='Summarize findings', backstory='Combine results', allow_delegation=False)\nresults=[]\nresearch_task=Task(description='Fetch titles from a preset URL list', agent=researcher, expected_output='List of (url,title) pairs', tools=[], async_execution=False)\nsummary_task=Task(description='Summarize the titles list into one sentence', agent=summary_agent, context=[research_task])\nif __name__=='__main__':\n    for u in URLS: results.append(fetch_title(u))\n    print('Collected:', results)\n    print('Summary: Titles collected for', len(results), 'pages.')`;
      projectRoot['README.md'] += `\n## Web Research\nRun: source .venv/bin/activate && python agents/web_research.py\nOutputs collected titles (placeholder). Extend with real scraping & tool sets.\n`;
    }
    if(selectedTemplates.includes('process-automator')){
      projectRoot.agents = projectRoot.agents || {};
      projectRoot.agents['process_automator.py'] = `"""CrewAI process automation skeleton."""\nfrom crewai import Agent, Task, Crew\nplanner=Agent(role='Planner', goal='Break a workflow request into steps', backstory='Understands processes')\nexecutor=Agent(role='Executor', goal='Execute a single described step', backstory='Carries out instructions precisely')\nreviewer=Agent(role='Reviewer', goal='Validate outputs', backstory='Checks quality')\nplan_task=Task(description='Create 3 high level steps to onboard a new engineer', agent=planner)\nexec_tasks=[Task(description='Execute step {i}', agent=executor, context=[plan_task]) for i in range(1,4)]\nreview_task=Task(description='Review execution outputs', agent=reviewer, context=exec_tasks)\nif __name__=='__main__':\n    crew=Crew(agents=[planner,executor,reviewer], tasks=[plan_task,*exec_tasks,review_task])\n    print('Automation run starting...')\n    crew.kickoff()`;
      projectRoot['README.md'] += `\n## Process Automator\nRun: source .venv/bin/activate && python agents/process_automator.py\nDemonstrates planner -> executor -> reviewer pattern.\n`;
    }
    if(selectedTemplates.includes('code-assistant-mcp') && cfg.protocols.includes('mcp')){
      // Enhance MCP client with file browsing + simple tool invocation
      const agentsRoot = projectRoot.agents || {};
      agentsRoot.mcp = agentsRoot.mcp || {};
      agentsRoot.mcp['client.js'] = `#!/usr/bin/env node\n// Simplified MCP client placeholder demonstrating planned structure.\nimport fs from 'fs';\nimport path from 'path';\nfunction listFiles(dir){ return fs.readdirSync(dir).slice(0,50); }\nfunction readFileSafe(p){ try { return fs.readFileSync(p,'utf8').slice(0,2000); } catch(e){ return 'ERR:'+e.message; } }\nif (import.meta.url === 'file://'+process.argv[1]){\n  const dir=process.argv[2]||'.';\n  console.log('Files:', listFiles(dir));\n  const first = listFiles(dir)[0];\n  if(first){ console.log('Preview of', first, ':'); console.log(readFileSafe(path.join(dir, first))); }\n}`;
      agentsRoot.mcp['tools'] = { 'fsTool.js': `export function list(dir='.'){ return { files: [] }; } // Placeholder real MCP tool would expose spec.` };
      projectRoot.agents = agentsRoot;
      projectRoot['README.md'] += `\n## Code Assistant (MCP)\nMCP stub: run node agents/mcp/client.js to list project files (placeholder). Integrate real MCP SDK for tool calling.\n`;
    }
    if(selectedTemplates.includes('multimodal-assistant') && fastapiSelected && cfg.llmProviders.includes('gemini')){
      if(projectRoot.api && projectRoot.api['main.py']){
        projectRoot.api['main.py'] += `\n# Multimodal endpoint (Gemini)\ntry:\n    import google.generativeai as genai\n    if os.getenv('GEMINI_API_KEY'):\n        genai.configure(api_key=os.getenv('GEMINI_API_KEY'))\n        from fastapi import Body\n        @app.post('/vision')\n        async def vision(payload: dict = Body(...)):\n            prompt = payload.get('prompt','Describe image')\n            image_url = payload.get('image_url')\n            model = genai.GenerativeModel('gemini-1.5-flash')\n            parts=[prompt]\n            if image_url: parts.append({'image_url': image_url})\n            resp = model.generate_content(parts)\n            return {'text': resp.text}\nexcept Exception as e:\n    print('Gemini vision route skipped:', e)\n`;
        projectRoot['README.md'] += `\n## Multimodal Assistant\nEndpoint POST /vision {"prompt":"...","image_url":"..."} returns model text output (simplified).\n`;
      }
    }
    if(selectedTemplates.includes('knowledge-base') && fastapiSelected){
      const api = projectRoot.api || {};
      const hasVectorDB = cfg.database.some(db => ['pinecone', 'chroma', 'weaviate', 'qdrant'].includes(db));
      
      if(hasVectorDB) {
        api['knowledge_base.py'] = `"""Advanced knowledge base with vector search and chunking."""\nimport os\nfrom typing import List, Dict, Any\nfrom vector_store import get_vector_store\nfrom openai import OpenAI\n\nclient = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))\n\nclass KnowledgeBase:\n    def __init__(self):\n        self.vector_store = get_vector_store()\n        self.knowledge_docs = [\n            "GenAppXpress is a rapid development platform that scaffolds full-stack applications with AI integration capabilities.",\n            "Vector databases enable semantic search by storing high-dimensional embeddings of text content.",\n            "RAG combines retrieval systems with generative models to provide contextually accurate responses.",\n            "FastAPI provides high-performance async endpoints with automatic documentation generation.",\n            "LangChain framework enables composable LLM workflows with memory and tool integration.",\n            "Chunking strategies are crucial for optimal retrieval - typical sizes range from 200-1000 tokens.",\n            "Embedding models like text-embedding-ada-002 convert text into dense vector representations.",\n            "Similarity search uses cosine similarity or dot product to find semantically related content."\n        ]\n    \n    def initialize_kb(self):\n        """Initialize knowledge base with documents."""\n        print("🔄 Initializing knowledge base...")\n        self.vector_store.add_documents(\n            self.knowledge_docs,\n            [{'source': 'kb_init', 'doc_id': i} for i in range(len(self.knowledge_docs))]\n        )\n        print(f"✅ Knowledge base initialized with {len(self.knowledge_docs)} documents")\n    \n    def search(self, query: str, k: int = 5) -> List[str]:\n        """Search knowledge base for relevant documents."""\n        return self.vector_store.similarity_search(query, k=k)\n    \n    def ask(self, question: str) -> Dict[str, Any]:\n        """Answer questions using retrieved context."""\n        # Retrieve relevant documents\n        context_docs = self.search(question, k=3)\n        context = "\\n".join(context_docs)\n        \n        # Generate answer using OpenAI\n        prompt = f"""Answer the question based on the following context:\n        \nContext:\n{context}\n\nQuestion: {question}\n\nAnswer:"""\n        \n        try:\n            response = client.chat.completions.create(\n                model="gpt-3.5-turbo",\n                messages=[{"role": "user", "content": prompt}],\n                max_tokens=150,\n                temperature=0.1\n            )\n            answer = response.choices[0].message.content.strip()\n        except Exception as e:\n            answer = f"Error generating answer: {str(e)}"\n        \n        return {\n            "question": question,\n            "answer": answer,\n            "context": context_docs,\n            "num_sources": len(context_docs)\n        }\n\n# Global KB instance\nkb = KnowledgeBase()\n\nif __name__ == '__main__':\n    kb.initialize_kb()\n    result = kb.ask("What is GenAppXpress?")\n    print(f"Q: {result['question']}")\n    print(f"A: {result['answer']}")`;
        
        // Add KB endpoint to main.py
        if(api['main.py']) {
          api['main.py'] += `\n# Knowledge Base endpoints\nfrom knowledge_base import kb\n\n@app.post('/kb/init')\nasync def init_kb():\n    kb.initialize_kb()\n    return {'message': 'Knowledge base initialized'}\n\n@app.post('/kb/ask')\nasync def ask_kb(q: Ask):\n    result = kb.ask(q.question)\n    return result\n\n@app.post('/kb/search')\nasync def search_kb(q: Ask):\n    results = kb.search(q.question, k=5)\n    return {'query': q.question, 'results': results}`;
        }
      } else {
        api['kb.py'] = `"""Knowledge base with simple keyword search."""\nfrom typing import List\nknowledge_base = [\n    "GenAppXpress accelerates development with AI scaffolding",\n    "FastAPI handles async requests with automatic documentation", \n    "React provides dynamic UIs with component architecture",\n    "Vector databases enable semantic search capabilities",\n    "RAG combines retrieval with generation for better context"\n]\n\ndef search_kb(query: str) -> List[str]:\n    """Simple keyword-based search."""\n    return [doc for doc in knowledge_base if any(word.lower() in doc.lower() for word in query.split())]\n\nif __name__ == '__main__':\n    print("Sample search:", search_kb("development"))`;
      }
      
      projectRoot.api = api;
      const kbNote = hasVectorDB ? `\n## Knowledge Base\nAdvanced semantic search with vector database.\nEndpoints: POST /kb/init, /kb/ask, /kb/search\n` : `\n## Knowledge Base\nSimple keyword-based search system.\n`;
      projectRoot['README.md'] += kbNote;
    }
    if(selectedTemplates.includes('pdf-chat') && fastapiSelected){
      const api = projectRoot.api || {};
      const hasVectorDB = cfg.database.some(db => ['pinecone', 'chroma', 'weaviate', 'qdrant'].includes(db));
      
      if(hasVectorDB) {
        api['pdf_processor.py'] = `"""PDF processing and chunking for RAG."""\nimport os\nfrom typing import List, Dict, Any\nfrom io import BytesIO\nfrom vector_store import get_vector_store\n\ntry:\n    import PyPDF2\n    import tiktoken\nexcept ImportError:\n    print("Install: pip install PyPDF2 tiktoken")\n    PyPDF2 = None\n    tiktoken = None\n\nclass PDFProcessor:\n    def __init__(self):\n        self.vector_store = get_vector_store()\n        self.encoding = tiktoken.get_encoding("cl100k_base") if tiktoken else None\n        self.chunk_size = 500  # tokens\n        self.chunk_overlap = 50\n    \n    def extract_text(self, pdf_bytes: bytes) -> str:\n        """Extract text from PDF bytes."""\n        if not PyPDF2:\n            return "PDF processing not available - install PyPDF2"\n        \n        pdf_file = BytesIO(pdf_bytes)\n        pdf_reader = PyPDF2.PdfReader(pdf_file)\n        text = ""\n        \n        for page in pdf_reader.pages:\n            text += page.extract_text() + "\\n"\n        \n        return text\n    \n    def chunk_text(self, text: str, filename: str = "document") -> List[Dict[str, Any]]:\n        """Split text into chunks with metadata."""\n        if not self.encoding:\n            # Fallback to character-based chunking\n            chunk_size_chars = self.chunk_size * 4  # rough estimate\n            chunks = []\n            for i in range(0, len(text), chunk_size_chars):\n                chunk_text = text[i:i + chunk_size_chars]\n                chunks.append({\n                    'text': chunk_text,\n                    'metadata': {\n                        'source': filename,\n                        'chunk_id': i // chunk_size_chars,\n                        'start_char': i,\n                        'end_char': min(i + chunk_size_chars, len(text))\n                    }\n                })\n            return chunks\n        \n        # Token-based chunking\n        tokens = self.encoding.encode(text)\n        chunks = []\n        \n        for i in range(0, len(tokens), self.chunk_size - self.chunk_overlap):\n            chunk_tokens = tokens[i:i + self.chunk_size]\n            chunk_text = self.encoding.decode(chunk_tokens)\n            \n            chunks.append({\n                'text': chunk_text,\n                'metadata': {\n                    'source': filename,\n                    'chunk_id': i // (self.chunk_size - self.chunk_overlap),\n                    'token_start': i,\n                    'token_end': min(i + self.chunk_size, len(tokens)),\n                    'token_count': len(chunk_tokens)\n                }\n            })\n        \n        return chunks\n    \n    def process_pdf(self, pdf_bytes: bytes, filename: str) -> Dict[str, Any]:\n        """Process PDF: extract text, chunk, and store in vector DB."""\n        try:\n            # Extract text\n            text = self.extract_text(pdf_bytes)\n            if not text.strip():\n                return {'error': 'No text extracted from PDF'}\n            \n            # Chunk text\n            chunks = self.chunk_text(text, filename)\n            \n            # Store in vector database\n            texts = [chunk['text'] for chunk in chunks]\n            metadatas = [chunk['metadata'] for chunk in chunks]\n            \n            self.vector_store.add_documents(texts, metadatas)\n            \n            return {\n                'filename': filename,\n                'text_length': len(text),\n                'num_chunks': len(chunks),\n                'status': 'processed'\n            }\n        \n        except Exception as e:\n            return {'error': f'Error processing PDF: {str(e)}'}\n    \n    def search_documents(self, query: str, k: int = 5) -> List[str]:\n        """Search processed documents."""\n        return self.vector_store.similarity_search(query, k=k)\n\n# Global processor instance\npdf_processor = PDFProcessor()`;
        
        // Add PDF endpoints to main.py
        if(api['main.py']) {
          api['main.py'] += `\n# PDF Chat endpoints\nfrom fastapi import File, UploadFile\nfrom pdf_processor import pdf_processor\nfrom openai import OpenAI\n\nclient = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))\n\n@app.post('/pdf/upload')\nasync def upload_pdf(file: UploadFile = File(...)):\n    if not file.filename.endswith('.pdf'):\n        return {'error': 'File must be a PDF'}\n    \n    pdf_bytes = await file.read()\n    result = pdf_processor.process_pdf(pdf_bytes, file.filename)\n    return result\n\n@app.post('/pdf/chat')\nasync def chat_with_pdf(q: Ask):\n    # Search relevant chunks\n    context_docs = pdf_processor.search_documents(q.question, k=3)\n    \n    if not context_docs:\n        return {'error': 'No documents found. Please upload a PDF first.'}\n    \n    # Generate response using context\n    context = \"\\n\\n\".join(context_docs)\n    prompt = f\"\"\"Answer the question based on the following PDF content:\n\nContent:\n{context}\n\nQuestion: {q.question}\n\nAnswer:\"\"\"\n    \n    try:\n        response = client.chat.completions.create(\n            model=\"gpt-3.5-turbo\",\n            messages=[{\"role\": \"user\", \"content\": prompt}],\n            max_tokens=200,\n            temperature=0.1\n        )\n        answer = response.choices[0].message.content.strip()\n        \n        return {\n            'question': q.question,\n            'answer': answer,\n            'sources': len(context_docs),\n            'context_preview': context[:200] + '...' if len(context) > 200 else context\n        }\n    except Exception as e:\n        return {'error': f'Error generating response: {str(e)}'}\n\n@app.get('/pdf/documents')\nasync def list_documents():\n    # This would require extending vector store to track documents\n    return {'message': 'Document listing not implemented yet'}`;
        }
      } else {
        api['pdf_simple.py'] = `"""Simple PDF text extraction without vector storage."""\ntry:\n    import PyPDF2\nexcept ImportError:\n    PyPDF2 = None\n\ndef extract_pdf_text(pdf_bytes: bytes) -> str:\n    \"\"\"Extract text from PDF bytes.\"\"\"\n    if not PyPDF2:\n        return \"PDF processing not available - install PyPDF2\"\n    \n    from io import BytesIO\n    pdf_file = BytesIO(pdf_bytes)\n    pdf_reader = PyPDF2.PdfReader(pdf_file)\n    text = \"\"\n    \n    for page in pdf_reader.pages:\n        text += page.extract_text() + \"\\n\"\n    \n    return text\n\n# Simple in-memory storage\nuploaded_pdfs = {}\n\ndef store_pdf(filename: str, text: str):\n    uploaded_pdfs[filename] = text\n\ndef search_pdfs(query: str) -> list:\n    results = []\n    for filename, text in uploaded_pdfs.items():\n        if query.lower() in text.lower():\n            # Return first 500 chars containing the query\n            idx = text.lower().find(query.lower())\n            start = max(0, idx - 100)\n            end = min(len(text), idx + 400)\n            results.append({\n                'filename': filename,\n                'snippet': text[start:end]\n            })\n    return results`;
      }
      
      projectRoot.api = api;
      pyPackages.add('PyPDF2');
      if(hasVectorDB) pyPackages.add('tiktoken');
      
      const pdfNote = hasVectorDB ? 
        `\n## PDF Chat\nUpload PDFs and chat with content using vector search.\nEndpoints: POST /pdf/upload, /pdf/chat, GET /pdf/documents\n` :
        `\n## PDF Chat\nSimple PDF text extraction and keyword search.\n`;
      projectRoot['README.md'] += pdfNote;
    }
    if(selectedTemplates.includes('vector-ingest') && fastapiSelected){
      const api = projectRoot.api || {};
      const hasVectorDB = cfg.database.some(db => ['pinecone', 'chroma', 'weaviate', 'qdrant'].includes(db));
      
      if(hasVectorDB) {
        api['ingest_pipeline.py'] = `"""Advanced document ingestion pipeline with chunking strategies."""\nimport os\nimport json\nfrom typing import List, Dict, Any, Optional\nfrom pathlib import Path\nfrom vector_store import get_vector_store\n\ntry:\n    import tiktoken\n    from langchain.text_splitter import RecursiveCharacterTextSplitter\n    from langchain.document_loaders import DirectoryLoader, TextLoader, JSONLoader\nexcept ImportError:\n    print("Install: pip install tiktoken langchain")\n    tiktoken = None\n    RecursiveCharacterTextSplitter = None\n\nclass DocumentIngestor:\n    def __init__(self):\n        self.vector_store = get_vector_store()\n        self.encoding = tiktoken.get_encoding("cl100k_base") if tiktoken else None\n        \n        # Chunking strategies\n        self.strategies = {\n            'recursive': {\n                'chunk_size': 1000,\n                'chunk_overlap': 200,\n                'separators': [\"\\n\\n\", \"\\n\", \" \", \"\"]\n            },\n            'semantic': {\n                'chunk_size': 500,\n                'chunk_overlap': 50,\n                'separators': [\".\", \"!\", \"?\"]\n            },\n            'fixed': {\n                'chunk_size': 512,\n                'chunk_overlap': 0\n            }\n        }\n    \n    def count_tokens(self, text: str) -> int:\n        \"\"\"Count tokens in text.\"\"\"\n        if self.encoding:\n            return len(self.encoding.encode(text))\n        return len(text.split())  # Fallback word count\n    \n    def chunk_document(self, text: str, strategy: str = 'recursive', metadata: Dict = None) -> List[Dict]:\n        \"\"\"Chunk document using specified strategy.\"\"\"\n        config = self.strategies.get(strategy, self.strategies['recursive'])\n        metadata = metadata or {}\n        \n        if RecursiveCharacterTextSplitter and strategy == 'recursive':\n            splitter = RecursiveCharacterTextSplitter(\n                chunk_size=config['chunk_size'],\n                chunk_overlap=config['chunk_overlap'],\n                separators=config['separators']\n            )\n            chunks = splitter.split_text(text)\n        else:\n            # Fallback manual chunking\n            chunk_size = config['chunk_size']\n            overlap = config.get('chunk_overlap', 0)\n            chunks = []\n            \n            for i in range(0, len(text), chunk_size - overlap):\n                chunk = text[i:i + chunk_size]\n                if chunk.strip():\n                    chunks.append(chunk)\n        \n        # Add metadata to each chunk\n        chunk_docs = []\n        for i, chunk in enumerate(chunks):\n            chunk_metadata = {\n                **metadata,\n                'chunk_id': i,\n                'chunk_strategy': strategy,\n                'token_count': self.count_tokens(chunk),\n                'char_count': len(chunk)\n            }\n            chunk_docs.append({\n                'text': chunk,\n                'metadata': chunk_metadata\n            })\n        \n        return chunk_docs\n    \n    def ingest_file(self, file_path: str, strategy: str = 'recursive') -> Dict[str, Any]:\n        \"\"\"Ingest a single file.\"\"\"\n        try:\n            path = Path(file_path)\n            \n            # Read file based on extension\n            if path.suffix.lower() == '.json':\n                with open(path, 'r', encoding='utf-8') as f:\n                    data = json.load(f)\n                text = json.dumps(data, indent=2) if isinstance(data, dict) else str(data)\n            else:\n                with open(path, 'r', encoding='utf-8', errors='ignore') as f:\n                    text = f.read()\n            \n            # Prepare metadata\n            metadata = {\n                'source': str(path),\n                'filename': path.name,\n                'extension': path.suffix,\n                'file_size': path.stat().st_size\n            }\n            \n            # Chunk document\n            chunks = self.chunk_document(text, strategy, metadata)\n            \n            # Store in vector database\n            texts = [chunk['text'] for chunk in chunks]\n            metadatas = [chunk['metadata'] for chunk in chunks]\n            \n            self.vector_store.add_documents(texts, metadatas)\n            \n            return {\n                'file': str(path),\n                'status': 'success',\n                'chunks_created': len(chunks),\n                'total_tokens': sum(chunk['metadata']['token_count'] for chunk in chunks),\n                'strategy_used': strategy\n            }\n        \n        except Exception as e:\n            return {\n                'file': file_path,\n                'status': 'error',\n                'error': str(e)\n            }\n    \n    def ingest_directory(self, dir_path: str, strategy: str = 'recursive', file_pattern: str = '**/*') -> Dict[str, Any]:\n        \"\"\"Ingest all files in a directory.\"\"\"\n        try:\n            path = Path(dir_path)\n            if not path.exists():\n                return {'error': f'Directory {dir_path} does not exist'}\n            \n            files = list(path.glob(file_pattern))\n            text_files = [f for f in files if f.is_file() and f.suffix.lower() in ['.txt', '.md', '.json', '.py', '.js', '.html', '.csv']]\n            \n            results = []\n            for file_path in text_files:\n                result = self.ingest_file(str(file_path), strategy)\n                results.append(result)\n            \n            successful = [r for r in results if r.get('status') == 'success']\n            failed = [r for r in results if r.get('status') == 'error']\n            \n            return {\n                'directory': dir_path,\n                'files_processed': len(text_files),\n                'successful': len(successful),\n                'failed': len(failed),\n                'total_chunks': sum(r.get('chunks_created', 0) for r in successful),\n                'total_tokens': sum(r.get('total_tokens', 0) for r in successful),\n                'results': results\n            }\n        \n        except Exception as e:\n            return {'error': f'Error processing directory: {str(e)}'}\n    \n    def get_stats(self) -> Dict[str, Any]:\n        \"\"\"Get ingestion statistics.\"\"\"\n        # This would require extending vector store to provide stats\n        return {\n            'message': 'Statistics not implemented - requires vector store extension',\n            'available_strategies': list(self.strategies.keys())\n        }\n\n# Global ingestor instance\ningestor = DocumentIngestor()`;
        
        // Add ingestion endpoints to main.py
        if(api['main.py']) {
          api['main.py'] += `\n# Vector Ingestion endpoints\nfrom ingest_pipeline import ingestor\nfrom fastapi import Form\n\n@app.post('/ingest/file')\nasync def ingest_file(file_path: str = Form(...), strategy: str = Form('recursive')):\n    result = ingestor.ingest_file(file_path, strategy)\n    return result\n\n@app.post('/ingest/directory')\nasync def ingest_directory(\n    dir_path: str = Form(...), \n    strategy: str = Form('recursive'),\n    pattern: str = Form('**/*')\n):\n    result = ingestor.ingest_directory(dir_path, strategy, pattern)\n    return result\n\n@app.get('/ingest/stats')\nasync def get_ingest_stats():\n    return ingestor.get_stats()\n\n@app.get('/ingest/strategies')\nasync def get_strategies():\n    return {\n        'strategies': list(ingestor.strategies.keys()),\n        'configs': ingestor.strategies\n    }`;
        }
      } else {
        api['simple_ingest.py'] = `"""Simple document ingestion without vector storage."""\nimport os\nimport json\nfrom pathlib import Path\nfrom typing import List, Dict, Any\n\n# Simple in-memory document store\ndocument_store = []\n\ndef ingest_file(file_path: str) -> Dict[str, Any]:\n    \"\"\"Ingest a single file into memory.\"\"\"\n    try:\n        path = Path(file_path)\n        \n        if path.suffix.lower() == '.json':\n            with open(path, 'r', encoding='utf-8') as f:\n                content = json.load(f)\n            text = json.dumps(content, indent=2) if isinstance(content, dict) else str(content)\n        else:\n            with open(path, 'r', encoding='utf-8', errors='ignore') as f:\n                text = f.read()\n        \n        document_store.append({\n            'id': len(document_store),\n            'source': str(path),\n            'filename': path.name,\n            'content': text,\n            'word_count': len(text.split())\n        })\n        \n        return {\n            'file': str(path),\n            'status': 'success',\n            'word_count': len(text.split()),\n            'document_id': len(document_store) - 1\n        }\n    except Exception as e:\n        return {\n            'file': file_path,\n            'status': 'error',\n            'error': str(e)\n        }\n\ndef search_documents(query: str) -> List[Dict]:\n    \"\"\"Simple keyword search.\"\"\"\n    results = []\n    for doc in document_store:\n        if query.lower() in doc['content'].lower():\n            results.append({\n                'id': doc['id'],\n                'filename': doc['filename'],\n                'snippet': doc['content'][:200] + '...' if len(doc['content']) > 200 else doc['content']\n            })\n    return results\n\ndef get_stats():\n    return {\n        'total_documents': len(document_store),\n        'total_words': sum(doc['word_count'] for doc in document_store)\n    }`;
      }
      
      projectRoot.api = api;
      const ingestNote = hasVectorDB ? 
        `\n## Vector Ingest Pipeline\nAdvanced document ingestion with multiple chunking strategies.\nEndpoints: POST /ingest/file, /ingest/directory, GET /ingest/stats, /ingest/strategies\nSupported strategies: recursive, semantic, fixed\n` :
        `\n## Simple Document Ingest\nBasic file ingestion and keyword search.\n`;
      projectRoot['README.md'] += ingestNote;
    }
  }
  // --- CONFIG / SUPPORT FILES (must be defined before base spreads) ---
  const eslintFile = cfg.tools.includes('eslint') ? { '.eslintrc.cjs': `module.exports = { env:{browser:true,es2021:true,node:true}, extends:['eslint:recommended'${reactSelected?",'plugin:react/recommended'":''}], parserOptions:{ ecmaVersion:12, sourceType:'module' }, rules:{} };` } : {};
  const tsConfig = useTS ? { 'tsconfig.json': JSON.stringify({ compilerOptions:{target:'ES2020',module:'ESNext',jsx:'react-jsx',moduleResolution:'Node',esModuleInterop:true,strict:true,skipLibCheck:true}, include:['src'] }, null, 2) } : {};
  const dockerFiles = cfg.tools.includes('docker') ? {
    'Dockerfile': `# Simple multi-stage build for Node + optional frontend\nFROM node:20-alpine AS base\nWORKDIR /app\nCOPY package*.json ./\nRUN npm install\nCOPY . .\nCMD [\"npm\",\"run\",\"dev\"]`,
    'docker-compose.yml': `version: '3.9'\nservices:\n  app:\n    build: .\n    ports:\n      - '5173:5173'\n      - '3001:3001'\n    environment:\n      - NODE_ENV=development\n${cfg.database.includes('postgresql')?"  db:\n    image: postgres:16\n    environment:\n      - POSTGRES_PASSWORD=postgres\n    ports:\n      - '5432:5432'\n":''}`
  } : {};
  // Python requirements aggregation (before base so we can spread requirementsFile)
  const pyPackages = new Set();
  if(fastapiSelected){ pyPackages.add('fastapi'); pyPackages.add('uvicorn'); }
  cfg.llmProviders.forEach(id=>{ if(id==='openai') pyPackages.add('openai'); if(id==='anthropic') pyPackages.add('anthropic'); if(id==='gemini') pyPackages.add('google-generativeai'); if(id==='xai') pyPackages.add('groq'); if(id==='ollama') pyPackages.add('requests'); });
  cfg.aiFrameworks.forEach(id=>{ if(id==='langchain') pyPackages.add('langchain'); if(id==='crewai') pyPackages.add('crewai'); if(id==='langgraph') pyPackages.add('langgraph'); if(id==='semantic-kernel') pyPackages.add('semantic-kernel'); if(id==='autogen') pyPackages.add('pyautogen'); });
  if(wantRag){ pyPackages.add('chromadb'); pyPackages.add('pydantic'); }
  // Vector database dependencies
  cfg.database.forEach(id => {
    if(id === 'chroma') pyPackages.add('chromadb');
    if(id === 'pinecone') pyPackages.add('pinecone-client');
    if(id === 'weaviate') pyPackages.add('weaviate-client');
    if(id === 'qdrant') pyPackages.add('qdrant-client');
  });
  if(selectedTemplates.includes('web-research')) { pyPackages.add('beautifulsoup4'); pyPackages.add('requests'); }
  const requirementsFile = pyPackages.size ? { 'requirements.txt': Array.from(pyPackages).sort().join('\n')+'\n' } : {};

  // Build base structure first (after we have config/support files)
  const base = {
    [cfg.projectName]: {
      'README.md': generateReadme(cfg),
      '.env': generateEnv(cfg),
      'package.json': JSON.stringify(pkg, null, 2),
      ...eslintFile,
      ...tsConfig,
      ...dockerFiles,
      ...indexHtml,
      ...requirementsFile,
      ...(Object.keys(srcDir).length? { 'src': srcDir }: {}),
      ...(serverDir? { 'server': serverDir }: {}),
      ...(apiDir? { 'api': apiDir }: {}),
      ...(dbDir? { 'database': dbDir }: {}),
      ...(providersDir||frameworkDir ? { 'agents': { ...(frameworkDir||{}), 'providers': providersDir || {} } } : {}),
    }
  };
  // Apply template enhancements mutating base[cfg.projectName]
  enhanceForTemplates(base[cfg.projectName]);
  // Add aggregator script & dev:full script if applicable
  if(base[cfg.projectName].agents){
    const agentScriptNames = [];
    if(frameworkDir){
      if(cfg.aiFrameworks.includes('langchain')) agentScriptNames.push(['LangChain','agent_langchain.py']);
      if(cfg.aiFrameworks.includes('crewai')) agentScriptNames.push(['CrewAI','agent_crewai.py']);
      if(cfg.aiFrameworks.includes('langgraph')) agentScriptNames.push(['LangGraph','agent_langgraph.py']);
      if(cfg.aiFrameworks.includes('semantic-kernel')) agentScriptNames.push(['Semantic Kernel','agent_sk.py']);
      if(cfg.aiFrameworks.includes('autogen')) agentScriptNames.push(['AutoGen','agent_autogen.py']);
    }
    const runAll = `"""Run all available agent example scripts sequentially."""\nimport subprocess, sys, os\nROOT = os.path.dirname(__file__)\nSCRIPTS = ${JSON.stringify(agentScriptNames)}\nif __name__=='__main__':\n    if not SCRIPTS: print('No agent scripts selected.')\n    for name, script in SCRIPTS:\n        path = os.path.join(ROOT, script)\n        if os.path.exists(path):\n            print(f'\n=== {name} ({script}) ===')\n            subprocess.run([sys.executable, path], check=False)\n        else:\n            print('Missing', script)\n`;
    base[cfg.projectName].agents['run_all_agents.py'] = runAll;
    if(pkg.scripts && pkg.scripts.server && pkg.scripts.dev){
      addDevDep('concurrently');
      pkg.scripts['dev:full'] = 'concurrently "npm run server" "npm run dev"';
      base[cfg.projectName]['package.json'] = JSON.stringify(pkg, null, 2);
      base[cfg.projectName]['README.md'] += '\n### Full-stack Dev\nUse `npm run dev:full` to start both server and frontend (requires concurrently).\n';
    }
  }
  return base;
}

export function flattenStructure(struct, prefix=''){ const files=[]; Object.entries(struct||{}).forEach(([name,val])=>{const path= prefix? prefix+name: name; if(typeof val === 'string'){files.push(path);} else if(val && typeof val === 'object'){files.push(path+'/'); files.push(...flattenStructure(val, path+'/'));}}); return files; }

export function generateScript(cfg){
  const date=new Date().toISOString().split('T')[0];
  // If a template is selected, use its preset for dependency aggregation
  let stack = cfg;
  if (cfg.templates && cfg.templates.length === 1) {
    const template = TECH_STACK.templates.find(t => t.id === cfg.templates[0]);
    if (template && template.preset) {
      stack = { ...cfg, ...template.preset };
    }
  }
  const pyDeps = new Set();
  const nodeDeps = new Set();
  // Aggregate dependencies from stack
  if(stack.backend && stack.backend.includes('express')) ['express','cors','helmet'].forEach(d=>nodeDeps.add(d));
  if(stack.frontend && stack.frontend.includes('react')) ['react','react-dom','vite'].forEach(d=>nodeDeps.add(d));
  if(stack.frontend && stack.frontend.includes('vue')) ['vue','vite'].forEach(d=>nodeDeps.add(d));
  if(stack.frontend && stack.frontend.includes('nextjs')) ['next','react','react-dom'].forEach(d=>nodeDeps.add(d));
  if(stack.database && stack.database.includes('postgresql')) nodeDeps.add('pg');
  if(stack.database && stack.database.includes('mongodb')) nodeDeps.add('mongoose');
  if(stack.database && stack.database.includes('redis')) nodeDeps.add('ioredis');
  if(stack.protocols && stack.protocols.includes('mcp')) nodeDeps.add('mcp-sdk');
  if(stack.tools && stack.tools.includes('eslint')) nodeDeps.add('eslint');
  if(stack.tools && stack.tools.includes('typescript')) ['typescript','@types/node'].forEach(d=>nodeDeps.add(d));
  // Add openai dep if openai provider selected and express/react chat route likely used
  if(stack.llmProviders && stack.llmProviders.includes('openai') && stack.backend && stack.backend.includes('express') && stack.frontend && stack.frontend.includes('react')) nodeDeps.add('openai');
  if(stack.templates && stack.templates.includes('local-first') && stack.llmProviders && stack.llmProviders.includes('ollama')) { /* no extra node dep */ }

  (stack.aiFrameworks||[]).forEach(id=>{const f=TECH_STACK.aiFrameworks.find(t=>t.id===id); if(f) f.commands.forEach(c=>{ if(c.startsWith('pip ')) c.replace('pip install','').trim().split(/\s+/).forEach(p=>pyDeps.add(p)); });});
  (stack.llmProviders||[]).forEach(id=>{const p=TECH_STACK.llmProviders.find(t=>t.id===id); if(p) p.commands.forEach(c=>{ if(c.startsWith('pip ')) c.replace('pip install','').trim().split(/\s+/).forEach(q=>pyDeps.add(q)); });});

  const lines = [
    '#!/usr/bin/env bash', '# Generated by GenAppXpress', `# Date: ${date}`, 'set -e', '',
    'echo "[INFO] Creating project '+cfg.projectName+'"',
    `mkdir -p ${cfg.projectName}`,
    'cd '+cfg.projectName,
    'echo "[INFO] Installing Node dependencies"',
    'npm install '+ (nodeDeps.size? Array.from(nodeDeps).join(' '): 'react'),
  ];
  if(pyDeps.size){
    lines.push('echo "[INFO] Setting up Python virtual environment"');
    lines.push('python3 -m venv .venv || python -m venv .venv');
    lines.push('source .venv/bin/activate');
    lines.push('pip install '+Array.from(pyDeps).join(' '));
  }
  const envContent = generateEnv(stack).replace(/`/g,'\`');
  lines.push('echo "[INFO] Writing .env"',`printf '%s\\n' "${envContent.split('\n').join('\\n')}" > .env`);
  if(stack.backend && stack.backend.includes('fastapi')) lines.push('echo "[INFO] To run FastAPI: source .venv/bin/activate && uvicorn api.main:app --reload"');
  if(stack.backend && stack.backend.includes('express')) lines.push('echo "[INFO] To run Express: npm run server"');
  if(stack.frontend && (stack.frontend.includes('react')||stack.frontend.includes('vue'))) lines.push('echo "[INFO] To run Frontend: npm run dev"');
  if(stack.frontend && stack.frontend.includes('nextjs')) lines.push('echo "[INFO] To run Next.js: npm run dev"');
  lines.push('echo "[DONE] Scaffold complete"');
  return lines.join('\n');
}
