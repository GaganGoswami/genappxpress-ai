import React, { useEffect, useState, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { TECH_STACK } from '../data/techData';

/**
 * Dashboard component: central hub showing recent projects, template recommendations,
 * productivity metrics, and a trends/news feed.
 */
export default function Dashboard({ onOpenProject, onSelectTemplate }) {
  const [recent, setRecent] = useState([]);
  const [news, setNews] = useState([]);
  const [loadingNews, setLoadingNews] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  // NLP draft generation state (rule-based heuristic, no real LLM)
  const [nlpInput, setNlpInput] = useState('');
  const [nlpAnalysis, setNlpAnalysis] = useState(null);

  // Simulate feed (could be replaced with real API)
  useEffect(() => {
    setLoadingNews(true);
    const timer = setTimeout(() => {
      setNews([
        { id: 't1', title: 'Vector databases reach production maturity: Pinecone, Chroma lead adoption', tag: 'Vector DB', date: '2025-09-01' },
        { id: 't2', title: 'RAG architectures standardize on hybrid search with vector + keyword', tag: 'RAG', date: '2025-08-28' },
        { id: 't3', title: 'ChromaDB and Qdrant gain traction for local-first AI applications', tag: 'Local-First', date: '2025-08-25' },
        { id: 't4', title: 'Embedding models optimize for semantic chunking strategies', tag: 'Embeddings', date: '2025-08-20' },
        { id: 't5', title: 'Multi-agent workflow orchestration frameworks converge', tag: 'Agents', date: '2025-08-15' },
        { id: 't6', title: 'Edge Functions becoming default for micro-backends', tag: 'Edge', date: '2025-08-10' }
      ]);
      setLoadingNews(false);
    }, 650);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    try {
      const raw = JSON.parse(localStorage.getItem('genappxpress-history') || '[]');
      if (raw.length === 0) {
        setRecent([
          {id:'p1',projectName:'PDF Chat Assistant',date:'2025-09-01',type:'RAG App',frontend:['React'],backend:['FastAPI'],database:['ChromaDB'],aiFrameworks:['LangChain'],llmProviders:['OpenAI'],templates:['pdf-chat','rag-service']},
          {id:'p2',projectName:'Knowledge Base Portal',date:'2025-08-28',type:'Knowledge System',frontend:['Vue'],backend:['FastAPI'],database:['Weaviate','PostgreSQL'],aiFrameworks:['LangChain'],llmProviders:['OpenAI'],templates:['knowledge-base','vector-ingest']},
          {id:'p3',projectName:'Vector Ingest Pipeline',date:'2025-08-25',type:'Data Pipeline',backend:['FastAPI'],database:['Pinecone'],aiFrameworks:['LangChain'],llmProviders:['OpenAI'],templates:['vector-ingest','rag-service']},
          {id:'p4',projectName:'AI Chatbot',date:'2025-08-20',type:'Web App',frontend:['React'],backend:['Node.js'],database:['Redis'],aiFrameworks:['LangChain'],llmProviders:['OpenAI'],templates:['ai-chatbot','web-research']},
          {id:'p5',projectName:'RAG API Service',date:'2025-08-15',type:'Microservice',backend:['FastAPI'],database:['Qdrant'],aiFrameworks:['LangChain'],llmProviders:['OpenAI'],templates:['rag-service','multimodal-assistant']},
          {id:'p6',projectName:'Local-first RAG',date:'2025-08-10',type:'Desktop',frontend:['Electron'],backend:['Express'],database:['ChromaDB'],aiFrameworks:['LangChain'],llmProviders:['Ollama'],templates:['local-first','rag-service']},
        ]);
      } else {
        setRecent(raw.slice(-10).reverse());
      }
    } catch (e) { /* ignore */ }
  }, [deleteId]);

  // Listen for external history updates (e.g., repeated template use) and refresh
  useEffect(() => {
    function refresh(){
      try {
        const raw = JSON.parse(localStorage.getItem('genappxpress-history') || '[]');
        setRecent(raw.slice(-10).reverse());
      } catch(e) { /* ignore */ }
    }
    window.addEventListener('genappxpress-history-updated', refresh);
    return () => window.removeEventListener('genappxpress-history-updated', refresh);
  }, []);

  const handleDelete = (id) => {
    try {
      const raw = JSON.parse(localStorage.getItem('genappxpress-history') || '[]');
      const filtered = raw.filter(r => r.id !== id);
      localStorage.setItem('genappxpress-history', JSON.stringify(filtered));
      setDeleteId(id);
    } catch (e) { /* ignore */ }
  };

  const handleExport = (project) => {
    alert(`Exporting project: ${project.projectName}`);
    // TODO: Implement actual export logic
  };

  const metrics = useMemo(() => {
    const total = recent.length;
    const estMinutesSaved = total * 80;
    const hoursSaved = (estMinutesSaved / 60).toFixed(1);
    // Aggregate distinct template usage across projects (dedupe within each project)
    const byTemplate = recent.reduce((acc, r) => {
      const uniq = Array.from(new Set(r.templates || []));
      uniq.forEach(t => { acc[t] = true; });
      return acc;
    }, {});
    const distinctTemplates = Object.keys(byTemplate).length;
    return { total, hoursSaved, distinctTemplates, distinctTemplateIds: Object.keys(byTemplate) };
  }, [recent]);

  const templateData = (metrics.distinctTemplateIds || []).map(name => ({ name, value: 1 }));
  const pieColors = ['#21808d', '#2da6b2', '#2996a1', '#32b8c6', '#1a6873', '#13343b'];

  const recommended = useMemo(() => {
    const used = new Set(templateData.map(d => d.name));
    const all = (TECH_STACK.templates || []).map(t => t.id);
    return all.filter(t => !used.has(t)).slice(0, 4);
  }, [templateData]);

  // Stack Insights analytics - Enhanced with comprehensive analysis
  const stackInsights = useMemo(() => {
    if (recent.length === 0) return null;

    // Popular combinations analysis
    const combinations = {};
    const allStacks = recent.map(r => {
      const stack = [
        ...(r.frontend || []).map(f => `F:${f}`),
        ...(r.backend || []).map(b => `B:${b}`),
        ...(r.database || []).map(d => `D:${d}`),
        ...(r.aiFrameworks || []).map(a => `AI:${a}`)
      ];
      return stack.sort().join(' + ');
    });

    allStacks.forEach(combo => {
      combinations[combo] = (combinations[combo] || 0) + 1;
    });

    const popularCombos = Object.entries(combinations)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([combo, count]) => ({
        combo: combo.replace(/[FBDAI]+:/g, '').replace(/\s\+\s/g, ' + '),
        count,
        percentage: Math.round((count / recent.length) * 100)
      }));

    // Enhanced template usage analysis
    const templateStats = {};
    recent.forEach(r => {
      (r.templates || []).forEach(template => {
        templateStats[template] = (templateStats[template] || 0) + 1;
      });
    });

    const topTemplates = Object.entries(templateStats)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([template, count]) => ({
        template,
        count,
        percentage: Math.round((count / recent.length) * 100)
      }));

    // Technology trend analysis
    const techTrends = [];
    const frontendCount = recent.filter(r => (r.frontend || []).length > 0).length;
    const aiCount = recent.filter(r => (r.aiFrameworks || []).length > 0).length;
    const fullStackCount = recent.filter(r => (r.frontend || []).length > 0 && (r.backend || []).length > 0).length;
    
    if (aiCount / recent.length >= 0.5) {
      techTrends.push('AI-First Development: 75% of projects use AI frameworks');
    }
    if (fullStackCount / recent.length >= 0.6) {
      techTrends.push('Full-Stack Dominance: Most projects include both frontend & backend');
    }
    if (frontendCount / recent.length >= 0.8) {
      techTrends.push('Frontend-Heavy: 80%+ projects prioritize user interfaces');
    }

    // Enhanced missing dependencies analysis
    const missingDeps = [];
    const suggestions = [];
    recent.forEach(r => {
      const hasReact = (r.frontend || []).some(f => f && f.toLowerCase().includes('react'));
      const hasVue = (r.frontend || []).some(f => f && f.toLowerCase().includes('vue'));
      const hasSvelte = (r.frontend || []).some(f => f && f.toLowerCase().includes('svelte'));
      const hasTypeScript = (r.tools || []).some(t => t && t.toLowerCase().includes('typescript'));
      const hasAI = (r.aiFrameworks || []).length > 0;
      const hasVector = (r.database || []).some(d => d && (d.toLowerCase().includes('vector') || d.toLowerCase().includes('pinecone') || d.toLowerCase().includes('chroma')));
      const hasRedis = (r.database || []).some(d => d && d.toLowerCase().includes('redis'));
      const hasDocker = (r.tools || []).some(t => t && t.toLowerCase().includes('docker'));
      const hasTesting = (r.tools || []).some(t => t && (t.toLowerCase().includes('jest') || t.toLowerCase().includes('pytest') || t.toLowerCase().includes('vitest')));

      if ((hasReact || hasVue || hasSvelte) && !hasTypeScript) {
        suggestions.push(`${r.projectName}: Add TypeScript for better type safety`);
      }
      if (hasAI && !hasVector) {
        suggestions.push(`${r.projectName}: Consider vector database (Pinecone/Chroma) for AI features`);
      }
      if (hasAI && !hasRedis) {
        suggestions.push(`${r.projectName}: Add Redis for AI response caching`);
      }
      if (!hasDocker && (r.backend || []).length > 0) {
        suggestions.push(`${r.projectName}: Docker containerization recommended for backend`);
      }
      if (!hasTesting) {
        suggestions.push(`${r.projectName}: Missing testing framework (Jest/Pytest)`);
      }
    });

    // Enhanced compatibility warnings
    const warnings = [];
    recent.forEach(r => {
      const hasNext = (r.frontend || []).some(f => f && f.toLowerCase().includes('next'));
      const hasVite = (r.tools || []).some(t => t && t.toLowerCase().includes('vite'));
      const hasFastAPI = (r.backend || []).some(b => b && b.toLowerCase().includes('fastapi'));
      const hasExpress = (r.backend || []).some(b => b && (b.toLowerCase().includes('express') || b.toLowerCase().includes('node')));
      const hasFlask = (r.backend || []).some(b => b && b.toLowerCase().includes('flask'));
      const hasElectron = (r.frontend || []).some(f => f && f.toLowerCase().includes('electron'));
      const hasReact = (r.frontend || []).some(f => f && f.toLowerCase().includes('react'));

      if (hasNext && hasVite) {
        warnings.push(`${r.projectName}: Next.js includes bundling - Vite may conflict`);
      }
      if (hasFastAPI && hasExpress) {
        warnings.push(`${r.projectName}: Multiple backend frameworks may cause port conflicts`);
      }
      if (hasElectron && !hasReact && !hasVue && !hasSvelte) {
        warnings.push(`${r.projectName}: Electron works best with modern frontend frameworks`);
      }
      if ((hasFastAPI || hasFlask) && hasExpress) {
        warnings.push(`${r.projectName}: Mixing Python & Node.js backends increases complexity`);
      }
    });

    // Enhanced performance tips with modern practices
    const tips = [];
    const frontendTechs = recent.flatMap(r => r.frontend || []);
    const backendTechs = recent.flatMap(r => r.backend || []);
    const aiTechs = recent.flatMap(r => r.aiFrameworks || []);
    const dbTechs = recent.flatMap(r => r.database || []);
    
    if (frontendTechs.filter(f => f && f.toLowerCase().includes('react')).length >= 1) {
      tips.push('React: Use React.memo, useMemo, and Suspense for better UX');
    }
    if (backendTechs.filter(b => b && b.toLowerCase().includes('fastapi')).length >= 1) {
      tips.push('FastAPI: Implement async endpoints and Pydantic models for validation');
    }
    if (backendTechs.filter(b => b && b.toLowerCase().includes('express')).length >= 1) {
      tips.push('Express: Add compression middleware and implement rate limiting');
    }
    if (aiTechs.length > 0) {
      tips.push('AI Projects: Use streaming responses and implement token budgeting');
    }
    if (frontendTechs.some(f => f && f.toLowerCase().includes('vue'))) {
      tips.push('Vue: Leverage composition API and computed properties for reactivity');
    }
    if (frontendTechs.some(f => f && f.toLowerCase().includes('svelte'))) {
      tips.push('Svelte: Use stores for state management and optimize bundle size');
    }
    if (dbTechs.some(d => d && d.toLowerCase().includes('postgres'))) {
      tips.push('PostgreSQL: Index frequently queried columns and use connection pooling');
    }

    // Security recommendations
    const security = [];
    recent.forEach(r => {
      const hasAuth = (r.tools || []).some(t => t && (t.toLowerCase().includes('auth') || t.toLowerCase().includes('jwt')));
      const hasHTTPS = (r.tools || []).some(t => t && t.toLowerCase().includes('ssl'));
      const hasValidation = (r.tools || []).some(t => t && (t.toLowerCase().includes('joi') || t.toLowerCase().includes('yup') || t.toLowerCase().includes('zod')));
      
      if (!hasAuth && (r.backend || []).length > 0) {
        security.push(`${r.projectName}: Implement authentication (JWT/OAuth)`);
      }
      if (!hasValidation && (r.backend || []).length > 0) {
        security.push(`${r.projectName}: Add input validation library (Zod/Joi)`);
      }
    });

    return {
      popularCombos,
      topTemplates,
      techTrends,
      suggestions: suggestions.slice(0, 4),
      warnings: warnings.slice(0, 3),
      tips: tips.slice(0, 4),
      security: security.slice(0, 2)
    };
  }, [recent]);

  // --- Heuristic NLP analyzer (simple keyword rules) ---
  function analyzeNlp(text){
    const original = text.trim();
    if(!original){ setNlpAnalysis(null); return; }
    const t = original.toLowerCase();
    const keywordTemplates = [
      {re:/(chat|conversation|chatbot)/, id:'ai-chatbot'},
      {re:/(support|ticket)/, id:'support-triage'},
      {re:/(slack)/, id:'slack-bot'},
      {re:/(rag|retrieval|vector)/, id:'rag-service'},
      {re:/(pdf)/, id:'pdf-chat'},
      {re:/(ingest|pipeline)/, id:'vector-ingest'},
      {re:/(research|web research|browsing)/, id:'web-research'},
      {re:/(process|automate|automation)/, id:'process-automator'},
      {re:/(cron|schedule)/, id:'cron-agent'},
      {re:/(workflow)/, id:'workflow-designer'},
      {re:/(orchestrator|router)/, id:'agent-orchestrator'},
      {re:/(code assistant|code-assistant|mcp)/, id:'code-assistant-mcp'},
      {re:/(eval|evaluation)/, id:'evaluation-suite'},
      {re:/(analytics|dashboard)/, id:'analytics-dashboard'},
      {re:/(multimodal|image|vision)/, id:'multimodal-assistant'},
      {re:/(local|offline)/, id:'local-first'},
      {re:/(edge)/, id:'edge-functions'},
      {re:/(email)/, id:'email-assistant'},
      {re:/(jira)/, id:'jira-helper'},
      {re:/(knowledge|docs|documentation)/, id:'knowledge-base'},
    ];
    let templateId = null;
    for(const k of keywordTemplates){ if(k.re.test(t)){ templateId = k.id; break; } }
    // Basic stack extraction (IDs)
    const stack = { frontend:[], backend:[], database:[], tools:[], aiFrameworks:[], llmProviders:[], protocols:[] };
    function pushIf(cond, arr, val){ if(cond && !arr.includes(val)) arr.push(val); }
    pushIf(/react/.test(t), stack.frontend, 'react');
    pushIf(/vue/.test(t), stack.frontend, 'vue');
    pushIf(/next/.test(t), stack.frontend, 'nextjs');
    pushIf(/express|node/.test(t), stack.backend, 'express');
    pushIf(/fastapi|python/.test(t), stack.backend, 'fastapi');
    pushIf(/postgres|pg\b/.test(t), stack.database, 'postgresql');
    pushIf(/mongo/.test(t), stack.database, 'mongodb');
    pushIf(/redis/.test(t), stack.database, 'redis');
    pushIf(/typescript|ts\b/.test(t), stack.tools, 'typescript');
    pushIf(/eslint|lint/.test(t), stack.tools, 'eslint');
    pushIf(/docker|container/.test(t), stack.tools, 'docker');
    pushIf(/langchain/.test(t), stack.aiFrameworks, 'langchain');
    pushIf(/crewai|crew ai/.test(t), stack.aiFrameworks, 'crewai');
    pushIf(/langgraph/.test(t), stack.aiFrameworks, 'langgraph');
    pushIf(/semantic kernel|semantic-kernel/.test(t), stack.aiFrameworks, 'semantic-kernel');
    pushIf(/autogen|auto gen/.test(t), stack.aiFrameworks, 'autogen');
    pushIf(/openai/.test(t), stack.llmProviders, 'openai');
    pushIf(/anthropic|claude/.test(t), stack.llmProviders, 'anthropic');
    pushIf(/gemini|google/.test(t), stack.llmProviders, 'gemini');
    pushIf(/grok|xai|x-ai/.test(t), stack.llmProviders, 'xai');
    pushIf(/ollama|local model/.test(t), stack.llmProviders, 'ollama');
    pushIf(/mcp/.test(t), stack.protocols, 'mcp');
    pushIf(/swarm/.test(t), stack.protocols, 'swarm');
    // If template discovered, merge its preset to ensure baseline
    let templateObj = null;
    if(templateId){
      templateObj = (TECH_STACK.templates||[]).find(tpl => tpl.id === templateId);
      if(templateObj && templateObj.preset){
        Object.keys(stack).forEach(cat => {
          const presetVals = templateObj.preset[cat] || [];
          presetVals.forEach(v => { if(!stack[cat].includes(v)) stack[cat].push(v); });
        });
      }
    }
    // Derive project name
    const projectName = (templateObj?.name || (original.split(/\s+/).slice(0,3).join('-')) || 'nlp-draft').replace(/[^a-z0-9-_]/gi,'-').toLowerCase();
    setNlpAnalysis({ templateId, stack, projectName, matched: keywordTemplates.filter(k=>k.re.test(t)).map(k=>k.id) });
  }

  function applyNlpTemplate(){
    if(!nlpAnalysis) return;
    if(nlpAnalysis.templateId){
      const tpl = (TECH_STACK.templates||[]).find(t=>t.id===nlpAnalysis.templateId);
      if(tpl){ handleTemplateUsage(tpl); return; }
    }
  }

  function openCustomFromNlp(){
    if(!nlpAnalysis) return;
    if(!onOpenProject) return;
    const now = new Date();
    const draft = { id: 'nlp_'+now.getTime().toString(36), date: now.toISOString(), projectName: nlpAnalysis.projectName, type:'Draft', templates: nlpAnalysis.templateId?[nlpAnalysis.templateId]:[], ...nlpAnalysis.stack };
    onOpenProject(draft); // normalization handled by existing logic
  }

  // Patch: handle template usage from gallery to update metrics/chart immediately
  const handleTemplateUsage = (template) => {
    // Create a new project entry for history
    const now = new Date();
    const entry = {
      id: 't_' + now.getTime().toString(36),
      projectName: template.name || template.id,
      date: now.toISOString(),
      type: 'App',
      frontend: template.preset?.frontend?.map(f => TECH_STACK.frontend.find(x => x.id === f)?.name || f) || [],
      backend: template.preset?.backend?.map(b => TECH_STACK.backend.find(x => x.id === b)?.name || b) || [],
      aiFrameworks: template.preset?.aiFrameworks?.map(a => TECH_STACK.aiFrameworks.find(x => x.id === a)?.name || a) || [],
      templates: [template.id],
    };
    try {
      const raw = JSON.parse(localStorage.getItem('genappxpress-history') || '[]');
      raw.push(entry);
      localStorage.setItem('genappxpress-history', JSON.stringify(raw));
      setRecent([entry, ...recent]);
    } catch (e) { /* ignore */ }
    if (onSelectTemplate) onSelectTemplate(template);
  };

  return (
    <div className="dashboard-root" aria-label="Dashboard Home">
      <div className="dash-grid dash-grid-threecol">
        <section className="panel recent-panel" aria-labelledby="recent-head">
          <div className="panel-header"><h2 id="recent-head">Recent Projects 🏗️</h2></div>
          <div className="cards">
            {recent.length === 0 && <div className="placeholder">No projects yet. Generate your first scaffold!</div>}
            {recent.map(r => (
              <div key={r.id} className="card card-wide">
                <div className="card-title">{r.projectName}</div>
                <div className="card-meta">{new Date(r.date || Date.now()).toLocaleDateString()} &middot; <span>{r.type || 'App'}</span></div>
                <div className="stack-line">{[...(r.frontend || []), ...(r.backend || []), ...(r.aiFrameworks || [])].join(', ')}</div>
                {r.templates && r.templates.length > 0 && <div className="badge-line">{r.templates.join('  ')} </div>}
                <div className="card-actions">
                  <button className="card-btn" title="Open" onClick={() => {
                    if(!onOpenProject) return;
                    // Normalize any display names to internal IDs so wizard pre-selects correctly
                    const catKeys = ['frontend','backend','database','tools','aiFrameworks','llmProviders','protocols'];
                    const norm = { ...r };
                    catKeys.forEach(cat => {
                      const list = Array.isArray(r[cat]) ? r[cat] : [];
                      norm[cat] = list.map(val => {
                        if(!val || typeof val !== 'string') return val;
                        const lower = val.toLowerCase();
                        // Direct id match
                        const direct = (TECH_STACK[cat]||[]).find(t => t.id === lower);
                        if(direct) return direct.id;
                        // Name match
                        const byName = (TECH_STACK[cat]||[]).find(t => t.name.toLowerCase() === lower);
                        return byName ? byName.id : val; // fallback original value
                      });
                    });
                    onOpenProject(norm);
                  }}>Open</button>
                  <button className="card-btn" title="Export" onClick={() => handleExport(r)}>Export</button>
                  <button className="card-btn danger" title="Delete" onClick={() => handleDelete(r.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </section>
        <div className="centercol-group">
          <section className="panel metrics-panel" aria-labelledby="metrics-head">
            <div className="panel-header"><h2 id="metrics-head">Productivity Matrix 📈</h2></div>
            <div className="metrics-summary">
              <div><strong>{metrics.total}</strong><span>Projects</span></div>
              <div><strong>{metrics.hoursSaved}</strong><span>Hours Saved*</span></div>
              <div><strong>{metrics.distinctTemplates}</strong><span>Templates Used</span></div>
            </div>
            <div className="chart-row column">
              <div className="mini-chart" aria-label="Template usage pie chart">
                {templateData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie data={templateData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} stroke="none">
                        {templateData.map((entry, i) => (<Cell key={entry.name} fill={pieColors[i % pieColors.length]} />))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : <div className="placeholder" style={{ height: 180 }}>No template data yet.</div>}
              </div>
              <div className="mini-chart" aria-label="Projects over time">
                {recent.length > 0 ? (
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={recent.map(r => ({ name: r.projectName.slice(0, 10), v: 1 }))}>
                      <XAxis dataKey="name" hide />
                      <YAxis hide />
                      <Tooltip />
                      <Bar dataKey="v" fill="#21808d" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : <div className="placeholder" style={{ height: 180 }}>No activity yet.</div>}
              </div>
            </div>
            <div className="fine-print">*Estimated time saved assuming ~80 min manual setup / project.</div>
          </section>
          <section className="panel templates-panel" aria-labelledby="templates-head">
            <div className="panel-header"><h2 id="templates-head">Template Gallery 📋</h2></div>
            {/* Group templates by category */}
            {(() => {
              const groups = (TECH_STACK.templates || []).reduce((acc, t) => {
                const cat = t.category || 'Other';
                acc[cat] = acc[cat] || [];
                acc[cat].push(t);
                return acc;
              }, {});
              const ordered = Object.keys(groups).sort();
              return ordered.map(cat => (
                <div key={cat} className="template-group" aria-label={cat+ ' templates'}>
                  <div className="subhead" style={{marginTop: ordered[0]===cat?0:12}}>{cat}</div>
                  <div className="gallery small">
                    {groups[cat].map(t => (
                      <button key={t.id} className="template-chip" title={t.description} onClick={() => handleTemplateUsage(t)}>{t.name}</button>
                    ))}
                  </div>
                </div>
              ));
            })()}
            {recommended.length > 0 && <div className="recommended" style={{marginTop:16}}>
              <div className="subhead">Recommended (unused)</div>
              <div className="gallery small">
                {recommended.map(r => <span key={r} className="template-chip alt">{r}</span>)}
              </div>
            </div>}
          </section>
        </div>
        <div>
        <section className="panel nlp-panel" aria-labelledby="nlp-head">
          <div className="panel-header"><h2 id="nlp-head">NLP Template Builder 🧠 </h2></div>
          <div className="field" style={{display:'flex', flexDirection:'column', gap:8}}>
            <label htmlFor="nlp-input" style={{fontSize:12, textTransform:'uppercase', letterSpacing:'.05em'}}>Describe your application</label>
            <textarea id="nlp-input" value={nlpInput} onChange={e=>setNlpInput(e.target.value)} placeholder="e.g. Build a RAG service with FastAPI backend and React UI using OpenAI and LangChain" rows={3} style={{resize:'vertical'}} />
            <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
              <button className="secondary" onClick={()=>analyzeNlp(nlpInput)} disabled={!nlpInput.trim()}>Analyze</button>
              {nlpAnalysis && nlpAnalysis.templateId && <button onClick={applyNlpTemplate}>Apply Suggested Template</button>}
              {nlpAnalysis && <button onClick={openCustomFromNlp}>Use Suggested Stack</button>}
              {nlpAnalysis && <button className="ghost" onClick={()=>{setNlpAnalysis(null); setNlpInput('');}}>Reset</button>}
            </div>
          </div>
          {nlpAnalysis && (
            <div className="nlp-results" style={{marginTop:12, fontSize:13, lineHeight:1.5}}>
              {nlpAnalysis.templateId ? (
                <div><strong>Suggested Template:</strong> {nlpAnalysis.templateId}</div>
              ) : <div><strong>No single template matched.</strong> Using custom heuristic stack.</div>}
              <div style={{marginTop:6}}>
                <strong>Stack Draft:</strong>
                <ul style={{margin:'4px 0 0 16px', padding:0}}>
                  {Object.entries(nlpAnalysis.stack).map(([k,v])=> v.length>0 && <li key={k}><span style={{textTransform:'capitalize'}}>{k}</span>: {v.join(', ')}</li>)}
                  {Object.values(nlpAnalysis.stack).every(a=>!a.length) && <li>(none detected)</li>}
                </ul>
              </div>
              {nlpAnalysis.matched && nlpAnalysis.matched.length>1 && <div style={{marginTop:6, opacity:0.75}}>Multiple template signals detected: {nlpAnalysis.matched.join(', ')} (picked first match).</div>}
              <div style={{marginTop:8, fontSize:11, opacity:0.7}}>Rule‑based parsing only. No live LLM calls. Improve description for better matches.</div>
            </div>
          )}
        </section>
        <section className="panel insights-panel" aria-labelledby="insights-head">
          <div className="panel-header"><h2 id="insights-head">Stack Insights 🔧</h2></div>
          <ul className="news-list">
            {!stackInsights && <li className="placeholder">Generate more projects to see insights</li>}
            
            {/* Popular Stack Combinations */}
            {stackInsights && stackInsights.popularCombos.length > 0 && 
              stackInsights.popularCombos.map((combo, i) => (
                <li key={`combo-${i}`} className="news-item">
                  <div className="news-tag">Stack</div>
                  <div className="news-body">
                    <div className="news-title">{combo.combo}</div>
                    <div className="news-date">{combo.percentage}% usage ({combo.count} projects)</div>
                  </div>
                </li>
              ))
            }

            {/* Top Templates */}
            {stackInsights && stackInsights.topTemplates && stackInsights.topTemplates.length > 0 && 
              stackInsights.topTemplates.map((template, i) => (
                <li key={`template-${i}`} className="news-item">
                  <div className="news-tag" style={{background: '#9C27B0'}}>Template</div>
                  <div className="news-body">
                    <div className="news-title">{template.template}</div>
                    <div className="news-date">Used in {template.percentage}% of projects</div>
                  </div>
                </li>
              ))
            }

            {/* Technology Trends */}
            {stackInsights && stackInsights.techTrends && stackInsights.techTrends.length > 0 && 
              stackInsights.techTrends.map((trend, i) => (
                <li key={`trend-${i}`} className="news-item">
                  <div className="news-tag" style={{background: '#673AB7'}}>Trend</div>
                  <div className="news-body">
                    <div className="news-title">{trend}</div>
                    <div className="news-date">Development Pattern</div>
                  </div>
                </li>
              ))
            }

            {/* Enhancement Suggestions */}
            {stackInsights && stackInsights.suggestions && stackInsights.suggestions.length > 0 && 
              stackInsights.suggestions.map((suggestion, i) => (
                <li key={`suggestion-${i}`} className="news-item">
                  <div className="news-tag" style={{background: '#2196F3'}}>Enhance</div>
                  <div className="news-body">
                    <div className="news-title">{suggestion}</div>
                    <div className="news-date">Recommended Addition</div>
                  </div>
                </li>
              ))
            }

            {/* Compatibility Warnings */}
            {stackInsights && stackInsights.warnings && stackInsights.warnings.length > 0 && 
              stackInsights.warnings.map((warning, i) => (
                <li key={`warning-${i}`} className="news-item">
                  <div className="news-tag" style={{background: '#FF9800'}}>Alert</div>
                  <div className="news-body">
                    <div className="news-title">{warning}</div>
                    <div className="news-date">Potential Conflict</div>
                  </div>
                </li>
              ))
            }

            {/* Performance Tips */}
            {stackInsights && stackInsights.tips && stackInsights.tips.length > 0 && 
              stackInsights.tips.map((tip, i) => (
                <li key={`tip-${i}`} className="news-item">
                  <div className="news-tag" style={{background: '#4CAF50'}}>Optimize</div>
                  <div className="news-body">
                    <div className="news-title">{tip}</div>
                    <div className="news-date">Performance Boost</div>
                  </div>
                </li>
              ))
            }

            {/* Security Recommendations */}
            {stackInsights && stackInsights.security && stackInsights.security.length > 0 && 
              stackInsights.security.map((sec, i) => (
                <li key={`security-${i}`} className="news-item">
                  <div className="news-tag" style={{background: '#E91E63'}}>Security</div>
                  <div className="news-body">
                    <div className="news-title">{sec}</div>
                    <div className="news-date">Security Enhancement</div>
                  </div>
                </li>
              ))
            }
          </ul>
        </section>
        {/* <section className="panel news-panel" aria-labelledby="news-head">
          <div className="panel-header"><h2 id="news-head">Trends & Updates</h2></div>
          <ul className="news-list">
            {loadingNews && <li className="placeholder">Loading feed...</li>}
            {news.map(item => (
              <li key={item.id} className="news-item">
                <div className="news-tag">{item.tag}</div>
                <div className="news-body">
                  <div className="news-title">{item.title}</div>
                  <div className="news-date">{item.date}</div>
                </div>
              </li>
            ))}
          </ul>
        </section> */}
        </div>

      </div>
    </div>
  );
}
