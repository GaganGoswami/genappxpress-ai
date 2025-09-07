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
  return `# ${cfg.projectName}\n\nGenerated with **GenAppXpress**.\n\n## Selected Stack\n${Object.keys(CATEGORY_LABELS).map(cat=>{const arr=cfg[cat]; if(!arr||!arr.length) return ''; return `- **${CATEGORY_LABELS[cat]}:** ${arr.join(', ')}`;}).filter(Boolean).join('\n')}\n\n## Getting Started\nRun the generated setup script or follow manual steps.\n\n## AI Notes\nIf using AI providers set the API keys in .env before running agent scripts.\n`;}

export function generateStructure(cfg){
  const base = {
    [cfg.projectName]: {
      'README.md': generateReadme(cfg),
      '.env': generateEnv(cfg),
      'package.json': '{\n  "name": "'+cfg.projectName+'",\n  "private": true\n}',
      'agents': cfg.aiFrameworks.length||cfg.llmProviders.length?{
        'main_agent.py': '# Example agent entrypoint\nprint("Agent online")',
        'config': {'providers.yaml':'# provider config placeholder'},
        ...(cfg.protocols.includes('mcp')?{'mcp':{'client.js':'// MCP client placeholder'}}:{}),
      }:undefined,
      'server': cfg.backend.includes('express')?{'server.js':'// express server placeholder'}:undefined,
      'src': cfg.frontend.includes('react')?{'App.jsx':'// React app placeholder','main.jsx':'// entry'}:undefined,
      'database': cfg.database.length?{'schema.sql':'-- SQL schema'}:undefined
    }
  };
  return base;
}

export function flattenStructure(struct, prefix=''){ const files=[]; Object.entries(struct||{}).forEach(([name,val])=>{const path= prefix? prefix+name: name; if(typeof val === 'string'){files.push(path);} else if(val && typeof val === 'object'){files.push(path+'/'); files.push(...flattenStructure(val, path+'/'));}}); return files; }

export function generateScript(cfg){
  const date=new Date().toISOString().split('T')[0];
  const pyDeps = [];
  const nodeDeps = [];
  cfg.aiFrameworks.forEach(id=>{const f=TECH_STACK.aiFrameworks.find(t=>t.id===id); if(f) f.commands.forEach(c=>{if(c.startsWith('pip ')) pyDeps.push(c.replace('pip install','').trim());});});
  cfg.llmProviders.forEach(id=>{const p=TECH_STACK.llmProviders.find(t=>t.id===id); if(p) p.commands.forEach(c=>{if(c.startsWith('pip ')) pyDeps.push(c.replace('pip install','').trim());});});
  const lines = [
    '#!/usr/bin/env bash', '# Generated by GenAppXpress', `# Date: ${date}`, 'set -e', '', 'echo "[INFO] Creating project '+cfg.projectName+'"',
    `mkdir -p ${cfg.projectName}`, 'cd '+cfg.projectName,
  ];
  if(cfg.backend.includes('express')) {lines.push('echo "[INFO] Init Node"','npm init -y','npm install express cors helmet');}
  if(cfg.frontend.includes('react')) {lines.push('echo "[INFO] Adding React"','npm install react react-dom');}
  if(pyDeps.length){lines.push('echo "[INFO] Python deps"','python3 -m venv .venv || python -m venv .venv','source .venv/bin/activate','pip install '+[...new Set(pyDeps)].join(' '));}
  if(cfg.protocols.includes('mcp')) {lines.push('echo "[INFO] MCP SDK"','npm install mcp-sdk');}
  lines.push('echo "[INFO] Writing .env"','cat > .env <<EOF', generateEnv(cfg),'EOF');
  lines.push('echo "[DONE] Scaffold complete"');
  return lines.join('\n');
}
