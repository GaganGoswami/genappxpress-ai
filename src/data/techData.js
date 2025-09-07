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
    {id:'ai-chatbot',name:'AI Chatbot',description:'Streaming chat UI + provider adapter',preset:{frontend:['react'],backend:['express'],aiFrameworks:['langchain'],llmProviders:['openai'],protocols:[]}},
    {id:'rag-service',name:'RAG Service',description:'Embedding + vector search API',preset:{backend:['fastapi'],aiFrameworks:['langchain'],llmProviders:['openai'],protocols:[]}},
    {id:'web-research',name:'Web Research Agent',description:'Planning + browsing tools',preset:{frontend:['react'],backend:['express'],aiFrameworks:['crewai'],llmProviders:['openai'],protocols:['mcp']}},
    {id:'process-automator',name:'Process Automator',description:'Role agents for workflows',preset:{backend:['fastapi'],aiFrameworks:['crewai'],llmProviders:['anthropic'],protocols:[]}},
    {id:'code-assistant-mcp',name:'Code Assistant + MCP',description:'Dev agent w/ repo tools',preset:{frontend:['react'],backend:['express'],aiFrameworks:['langchain'],llmProviders:['anthropic'],protocols:['mcp']}},
    {id:'multimodal-assistant',name:'Multimodal Assistant',description:'Image + text reasoning',preset:{frontend:['react'],backend:['fastapi'],aiFrameworks:['langchain'],llmProviders:['gemini'],protocols:[]}},
    {id:'local-first',name:'Local-first App',description:'Offline dev w/ Ollama',preset:{frontend:['react'],backend:['express'],aiFrameworks:['langchain'],llmProviders:['ollama'],protocols:[]}},
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
  let lines=[]; if(selected.llmProviders.includes('openai')) lines.push('OPENAI_API_KEY=');
  if(selected.llmProviders.includes('anthropic')) lines.push('ANTHROPIC_API_KEY=');
  if(selected.llmProviders.includes('gemini')) lines.push('GEMINI_API_KEY=');
  if(selected.llmProviders.includes('xai')) lines.push('XAI_API_KEY=');
  if(selected.llmProviders.includes('ollama')) lines.push('OLLAMA_HOST=localhost');
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
      // Replace / extend rag.py with simple embedding & similarity (if exists)
      const api = projectRoot.api || {};
      api['embeddings.py'] = `"""Simple in-memory embedding store (character code mean vector)."""\nfrom __future__ import annotations\nfrom math import sqrt\nfrom typing import List, Tuple\nSTORE: List[Tuple[str, float]] = []\ndef embed(text: str) -> float:\n    if not text: return 0.0\n    return sum(ord(c) for c in text) / len(text)\ndef add(doc: str): STORE.append((doc, embed(doc)))\ndef similarity(a: float, b: float) -> float:\n    # Since scalar, negative distance transform\n    return 1.0 - abs(a-b) / (max(a,b)+1e-6) if (a or b) else 0.0\ndef topk(query: str, k=3):\n    qv = embed(query)\n    scored = sorted(((doc, similarity(qv, dv)) for doc,dv in STORE), key=lambda x: x[1], reverse=True)\n    return [d for d,_ in scored[:k]]\nif __name__=='__main__':\n    docs=['LangChain enables composition.','FastAPI is fast.','RAG augments generation.']\n    for d in docs: add(d)\n    print(topk('fast api speed'))`;
      api['ingest.py'] = `"""Bulk ingest sample documents into embedding store."""\nfrom .embeddings import add\nSAMPLE=['GenAppXpress scaffolds projects.','Retrieval augments context','OpenAI provides powerful models']\nfor s in SAMPLE: add(s)\nprint('Ingested', len(SAMPLE), 'documents')`;
      if(api['rag.py']){
        api['rag.py'] = api['rag.py'] + "\n# NOTE: For more advanced vector search integrate FAISS or Chroma.\n";
      }
      projectRoot.api = api;
      projectRoot['README.md'] += `\n## RAG Service\nRun:\n1. source .venv/bin/activate\n2. python api/ingest.py\n3. uvicorn api.main:app --reload\nPOST /rag {\"question\": \"Your query\"}\n`;
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
  const pyDeps = new Set();
  const nodeDeps = new Set();
  // Aggregate dependencies from selection
  if(cfg.backend.includes('express')) ['express','cors','helmet'].forEach(d=>nodeDeps.add(d));
  if(cfg.frontend.includes('react')) ['react','react-dom','vite'].forEach(d=>nodeDeps.add(d));
  if(cfg.frontend.includes('vue')) ['vue','vite'].forEach(d=>nodeDeps.add(d));
  if(cfg.frontend.includes('nextjs')) ['next','react','react-dom'].forEach(d=>nodeDeps.add(d));
  if(cfg.database.includes('postgresql')) nodeDeps.add('pg');
  if(cfg.database.includes('mongodb')) nodeDeps.add('mongoose');
  if(cfg.database.includes('redis')) nodeDeps.add('ioredis');
  if(cfg.protocols.includes('mcp')) nodeDeps.add('mcp-sdk');
  if(cfg.tools.includes('eslint')) nodeDeps.add('eslint');
  if(cfg.tools.includes('typescript')) ['typescript','@types/node'].forEach(d=>nodeDeps.add(d));
  // Add openai dep if openai provider selected and express/react chat route likely used
  if(cfg.llmProviders.includes('openai') && cfg.backend.includes('express') && cfg.frontend.includes('react')) nodeDeps.add('openai');
  if(cfg.templates && cfg.templates.includes('local-first') && cfg.llmProviders.includes('ollama')) { /* no extra node dep */ }

  cfg.aiFrameworks.forEach(id=>{const f=TECH_STACK.aiFrameworks.find(t=>t.id===id); if(f) f.commands.forEach(c=>{ if(c.startsWith('pip ')) c.replace('pip install','').trim().split(/\s+/).forEach(p=>pyDeps.add(p)); });});
  cfg.llmProviders.forEach(id=>{const p=TECH_STACK.llmProviders.find(t=>t.id===id); if(p) p.commands.forEach(c=>{ if(c.startsWith('pip ')) c.replace('pip install','').trim().split(/\s+/).forEach(q=>pyDeps.add(q)); });});

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
  const envContent = generateEnv(cfg).replace(/`/g,'\`');
  lines.push('echo "[INFO] Writing .env"',`printf '%s\\n' "${envContent.split('\n').join('\\n')}" > .env`);
  if(cfg.backend.includes('fastapi')) lines.push('echo "[INFO] To run FastAPI: source .venv/bin/activate && uvicorn api.main:app --reload"');
  if(cfg.backend.includes('express')) lines.push('echo "[INFO] To run Express: npm run server"');
  if(cfg.frontend.includes('react')||cfg.frontend.includes('vue')) lines.push('echo "[INFO] To run Frontend: npm run dev"');
  if(cfg.frontend.includes('nextjs')) lines.push('echo "[INFO] To run Next.js: npm run dev"');
  lines.push('echo "[DONE] Scaffold complete"');
  return lines.join('\n');
}
