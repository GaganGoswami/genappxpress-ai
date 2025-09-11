import React, { useEffect, useState, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { TECH_STACK } from '../data/techData';

/**
 * Dashboard component: central hub showing recent projects, template recommendations,
 * productivity metrics, and a trends/news feed.
 */
export default function Dashboard({ onOpenProject, onSelectTemplate, darkMode }) {
  const [recent, setRecent] = useState([]);
  const [news, setNews] = useState([]);
  const [loadingNews, setLoadingNews] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  // NLP draft generation state (rule-based heuristic, no real LLM)
  const [nlpInput, setNlpInput] = useState('');
  const [nlpAnalysis, setNlpAnalysis] = useState(null);
  // Enhanced Stack Insights state
  const [insightsFilter, setInsightsFilter] = useState('all');
  const [appliedSuggestions, setAppliedSuggestions] = useState(new Set());
  const [expandedInsight, setExpandedInsight] = useState(null);

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

  const handleExport = async (project) => {
    try {
      // Import required modules dynamically
      const JSZip = (await import('jszip')).default;
      const { saveAs } = await import('file-saver');
      const { generateScript, generateStructure } = await import('../data/techData');
      
      const zip = new JSZip();
      
      // Normalize project data to match expected config format
      const cfg = {
        projectName: project.projectName,
        description: project.description || `${project.projectName} - Exported from GenAppXpress Dashboard`,
        author: project.author || '',
        license: project.license || 'MIT',
        frontend: project.frontend || [],
        backend: project.backend || [],
        database: project.database || [],
        tools: project.tools || [],
        aiFrameworks: project.aiFrameworks || [],
        llmProviders: project.llmProviders || [],
        protocols: project.protocols || [],
        templates: project.templates || []
      };
      
      // Generate setup script and project structure
      const setupScript = generateScript(cfg);
      const structure = generateStructure(cfg);
      
      // Add core files to ZIP
      zip.file('setup.sh', setupScript);
      zip.file('project.json', JSON.stringify(cfg, null, 2));
      zip.file('README.md', `# ${cfg.projectName}\n\n${cfg.description}\n\nExported from GenAppXpress Dashboard on ${new Date().toLocaleDateString()}\n\n## Quick Start\n\n1. Run \`bash setup.sh\` to install dependencies\n2. Add your API keys to \`.env\` file\n3. Follow the generated project structure\n\n## Templates Used\n${cfg.templates.length > 0 ? cfg.templates.map(t => `- ${t}`).join('\n') : 'None'}\n\n## Tech Stack\n\n**Frontend:** ${cfg.frontend.join(', ') || 'None'}\n**Backend:** ${cfg.backend.join(', ') || 'None'}\n**Database:** ${cfg.database.join(', ') || 'None'}\n**AI Frameworks:** ${cfg.aiFrameworks.join(', ') || 'None'}\n**LLM Providers:** ${cfg.llmProviders.join(', ') || 'None'}`);
      
      // Recursively add generated project structure
      function addStructureToZip(node, pathParts = []) {
        Object.entries(node || {}).forEach(([name, val]) => {
          if (val === undefined) return;
          const newParts = pathParts.concat([name]);
          const relPath = newParts.join('/');
          
          if (typeof val === 'string') {
            zip.file(relPath, val);
          } else if (val && typeof val === 'object') {
            addStructureToZip(val, newParts);
          }
        });
      }
      
      addStructureToZip(structure, []);
      
      // Generate and download ZIP
      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, `${cfg.projectName}-export.zip`);
      
    } catch (error) {
      console.error('Export failed:', error);
      alert(`Export failed: ${error.message}`);
    }
  };

  const metrics = useMemo(() => {
    const total = recent.length;
    const estMinutesSaved = total * 180;
    const hoursSaved = (estMinutesSaved / 60).toFixed(1);
    // Count template usage frequency across all projects
    const templateUsageCount = recent.reduce((acc, r) => {
      const templates = r.templates || [];
      templates.forEach(t => {
        acc[t] = (acc[t] || 0) + 1;
      });
      return acc;
    }, {});
    const distinctTemplates = Object.keys(templateUsageCount).length;
    return { total, hoursSaved, distinctTemplates, templateUsageCount };
  }, [recent]);

  const templateData = Object.entries(metrics.templateUsageCount || {}).map(([name, count]) => ({ name, value: count }));
  const pieColors = ['#21808d', '#2da6b2', '#2996a1', '#32b8c6', '#1a6873', '#13343b'];

  // Template usage data for the gallery
  const templateUsage = metrics.templateUsageCount || {};

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
      const hasVue = (r.frontend || []).some(f => f && f.toLowerCase().includes('vue'));
      const hasSvelte = (r.frontend || []).some(f => f && f.toLowerCase().includes('svelte'));

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

    // Technology adoption metrics
    const adoptionMetrics = {
      frontend: {},
      backend: {},
      database: {},
      aiFrameworks: {},
      llmProviders: {}
    };

    recent.forEach(r => {
      Object.keys(adoptionMetrics).forEach(category => {
        const items = r[category] || [];
        items.forEach(item => {
          if (item) {
            adoptionMetrics[category][item] = (adoptionMetrics[category][item] || 0) + 1;
          }
        });
      });
    });

    // Project health score calculation
    const projectHealthScores = recent.map(r => {
      let score = 50; // Base score
      const hasTypeScript = (r.tools || []).some(t => t && t.toLowerCase().includes('typescript'));
      const hasTesting = (r.tools || []).some(t => t && (t.toLowerCase().includes('jest') || t.toLowerCase().includes('pytest') || t.toLowerCase().includes('vitest')));
      const hasDocker = (r.tools || []).some(t => t && t.toLowerCase().includes('docker'));
      const hasAuth = (r.tools || []).some(t => t && (t.toLowerCase().includes('auth') || t.toLowerCase().includes('jwt')));
      const hasValidation = (r.tools || []).some(t => t && (t.toLowerCase().includes('joi') || t.toLowerCase().includes('yup') || t.toLowerCase().includes('zod')));
      const hasFullStack = (r.frontend || []).length > 0 && (r.backend || []).length > 0;
      const hasModernStack = (r.frontend || []).some(f => f && ['react', 'vue', 'svelte', 'nextjs'].includes(f.toLowerCase()));
      
      if (hasTypeScript) score += 15;
      if (hasTesting) score += 20;
      if (hasDocker) score += 10;
      if (hasAuth) score += 10;
      if (hasValidation) score += 10;
      if (hasFullStack) score += 15;
      if (hasModernStack) score += 10;
      
      return {
        projectName: r.projectName,
        score: Math.min(score, 100),
        improvements: [
          !hasTypeScript && 'Add TypeScript',
          !hasTesting && 'Add Testing Framework',
          !hasDocker && 'Add Docker',
          !hasAuth && 'Add Authentication',
          !hasValidation && 'Add Input Validation'
        ].filter(Boolean)
      };
    });

    const avgHealthScore = projectHealthScores.length > 0 
      ? Math.round(projectHealthScores.reduce((sum, p) => sum + p.score, 0) / projectHealthScores.length)
      : 0;

    // Smart recommendations based on usage patterns
    const smartRecommendations = [];
    
    // Frontend framework recommendations
    const frontendUsage = adoptionMetrics.frontend;
    if (Object.keys(frontendUsage).length === 0) {
      smartRecommendations.push({
        type: 'missing',
        category: 'Frontend',
        title: 'Start with a Frontend Framework',
        description: 'Consider React, Vue, or Svelte for your user interfaces',
        action: 'explore-frontend',
        priority: 'high'
      });
    }

    // AI integration recommendations
    const aiUsage = Object.values(adoptionMetrics.aiFrameworks).reduce((sum, count) => sum + count, 0);
    if (aiUsage === 0 && recent.length > 2) {
      smartRecommendations.push({
        type: 'opportunity',
        category: 'AI',
        title: 'Explore AI Integration',
        description: 'Add LangChain or similar AI frameworks to modernize your projects',
        action: 'add-ai',
        priority: 'medium'
      });
    }

    // Database recommendations
    const dbUsage = adoptionMetrics.database;
    const hasPostgres = dbUsage['postgresql'] || 0;
    const hasMongo = dbUsage['mongodb'] || 0;
    if (hasPostgres > hasMongo * 2) {
      smartRecommendations.push({
        type: 'pattern',
        category: 'Database',
        title: 'PostgreSQL Preference Detected',
        description: 'You favor relational databases - consider PostgreSQL extensions like TimescaleDB',
        action: 'explore-postgres',
        priority: 'low'
      });
    }

    return {
      popularCombos,
      topTemplates,
      techTrends,
      suggestions: suggestions.slice(0, 6),
      warnings: warnings.slice(0, 4),
      tips: tips.slice(0, 6),
      security: security.slice(0, 3),
      adoptionMetrics,
      projectHealthScores,
      avgHealthScore,
      smartRecommendations
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

  // Handle template selection from gallery - navigate to wizard without creating project entries
  const handleTemplateUsage = (template) => {
    // Simply trigger the template selection callback to open the wizard
    // Don't create fake project entries in Recent Projects - those should only be created
    // when users actually generate/complete a project
    if (onSelectTemplate) onSelectTemplate(template);
  };

  // Helper functions for template gallery enhancement
  const getCategoryIcon = (category) => {
    const icons = {
      'AI & RAG': '🤖',
      'Web Applications': '🌐', 
      'API Services': '⚡',
      'Data & Analytics': '📊',
      'Automation': '🔄',
      'Other': '📦'
    };
    return icons[category] || '📦';
  };

  const getCategoryDescription = (category) => {
    const descriptions = {
      'AI & RAG': 'Intelligent applications with AI frameworks and vector databases',
      'Web Applications': 'Full-stack web applications with modern frameworks',
      'API Services': 'Backend services and microservices architectures',
      'Data & Analytics': 'Data processing, analysis, and visualization tools',
      'Automation': 'Workflow automation and process optimization tools',
      'Other': 'Specialized templates for unique use cases'
    };
    return descriptions[category] || 'Templates for various development needs';
  };

  const getTemplateIcon = (templateId) => {
    const icons = {
      'ai-chatbot': '💬', 'support-triage': '🎫', 'slack-bot': '💬',
      'rag-service': '🔍', 'pdf-chat': '📄', 'vector-ingest': '📥',
      'web-research': '🌐', 'process-automator': '⚙️', 'cron-agent': '⏰',
      'workflow-designer': '🔄', 'agent-orchestrator': '🎭', 'code-assistant-mcp': '💻',
      'evaluation-suite': '📝', 'analytics-dashboard': '📊', 'multimodal-assistant': '🎨',
      'local-first': '💾', 'edge-functions': '⚡', 'email-assistant': '📧',
      'jira-helper': '📋', 'knowledge-base': '📚'
    };
    return icons[templateId] || '🔧';
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
              <div style={{
                background: darkMode 
                  ? 'linear-gradient(135deg, #2f959eff 0%, #269986ff 100%)' 
                  : 'linear-gradient(135deg, #2e9090ff 0%, #15697eff 100%)', 
                color: 'white', 
                borderRadius: '12px', 
                padding: '16px', 
                boxShadow: darkMode 
                  ? '0 2px 8px rgba(45, 55, 72, 0.3)' 
                  : '0 2px 8px rgba(203, 213, 224, 0.4)',
                border: darkMode ? '1px solid #4a5568' : '1px solid #e2e8f0'
              }}>
                <strong>{metrics.total}</strong><span>Projects</span>
              </div>
              <div style={{
                background: darkMode 
                  ? 'linear-gradient(135deg, #2f959eff 0%, #269986ff 100%)' 
                  : 'linear-gradient(135deg, #2e9090ff 0%, #15697eff 100%)', 
                color: 'white', 
                borderRadius: '12px', 
                padding: '16px', 
                boxShadow: darkMode 
                  ? '0 2px 8px rgba(43, 108, 176, 0.4)' 
                  : '0 2px 8px rgba(49, 130, 206, 0.3)',
                border: darkMode ? '1px solid #3182ce' : 'none'
              }}>
                <strong>{metrics.hoursSaved}</strong><span>Hours Saved*</span>
              </div>
              <div style={{
                background: darkMode 
                  ? 'linear-gradient(135deg, #2f959eff 0%, #269986ff 100%)' 
                  : 'linear-gradient(135deg, #2e9090ff 0%, #15697eff 100%)', 
                color: 'white', 
                borderRadius: '12px', 
                padding: '16px', 
                boxShadow: darkMode 
                  ? '0 2px 8px rgba(4, 120, 87, 0.4)' 
                  : '0 2px 8px rgba(16, 185, 129, 0.3)',
                border: darkMode ? '1px solid #10b981' : 'none'
              }}>
                <strong>{metrics.distinctTemplates}</strong><span>Templates Used</span>
              </div>
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
              <div className="mini-chart" aria-label="Template usage frequency">
                {templateData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={templateData}>
                      <XAxis dataKey="name" hide />
                      <YAxis hide />
                      <Tooltip 
                        formatter={(value, name) => [`${value} uses`, 'Template Usage']}
                        labelFormatter={(label) => `Template: ${label}`}
                      />
                      <Bar dataKey="value" fill="#21808d" radius={[3, 3, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : <div className="placeholder" style={{ height: 180 }}>No template data yet.</div>}
              </div>
            </div>
            <div className="fine-print">*Estimated time saved assuming ~80 min manual setup / project.</div>
          </section>
          <section className="panel templates-panel" aria-labelledby="templates-head">
            <div className="panel-header">
              <h2 id="templates-head">Template Gallery 📋</h2>
              <div className="template-stats">
                <span className="stat-item">
                  <strong>{(TECH_STACK.templates || []).length}</strong> Templates
                </span>
                <span className="stat-item">
                  <strong>{Object.keys((TECH_STACK.templates || []).reduce((acc, t) => {
                    const cat = t.category || 'Other';
                    acc[cat] = true;
                    return acc;
                  }, {})).length}</strong> Categories
                </span>
              </div>
            </div>
            
            <div className="template-gallery-container">
              {/* Compact Template Cards */}
              <div className="template-cards-grid">
                {(TECH_STACK.templates || []).map(template => {
                  const usageCount = templateUsage[template.id] || 0;
                  const technologies = template.stack ? Object.values(template.stack).flat().filter(tech => tech) : [];
                  
                  return (
                    <div key={template.id} className="template-card">
                      <div className="template-card-header">
                        <div className="template-icon">
                          {getTemplateIcon(template.id)}
                        </div>
                        <div className="usage-counter">
                          {usageCount}
                        </div>
                      </div>
                      
                      <div className="template-card-content">
                        <h3 className="template-title">{template.name}</h3>
                        <p className="template-description">{template.description}</p>
                        
                        <div className="template-tags">
                          {technologies.slice(0, 2).map(tech => (
                            <span key={tech} className="template-tag">{tech}</span>
                          ))}
                        </div>
                      </div>
                      
                      <button 
                        className="use-template-btn"
                        onClick={() => handleTemplateUsage(template)}
                        title={template.description}
                      >
                        Use Template
                      </button>
                    </div>
                  );
                })}
              </div>
              
              {/* Recommended Templates Section */}
              {recommended.length > 0 && (
                <div className="recommended-section">
                  <div className="subhead" style={{ marginTop: 20, marginBottom: 12 }}>
                    📋 RAG / Retrieval ({recommended.length})
                  </div>
                  <p className="recommended-description">Templates for various development needs</p>
                  
                  <div className="template-cards-grid">
                    {recommended.map(templateId => {
                      const template = (TECH_STACK.templates || []).find(t => t.id === templateId);
                      const usageCount = templateUsage[templateId] || 0;
                      const technologies = template?.stack ? Object.values(template.stack).flat().filter(tech => tech) : [];
                      
                      return template ? (
                        <div key={templateId} className="template-card">
                          <div className="template-card-header">
                            <div className="template-icon">
                              {getTemplateIcon(templateId)}
                            </div>
                            <div className="usage-counter">
                              {usageCount}
                            </div>
                          </div>
                          
                          <div className="template-card-content">
                            <h3 className="template-title">{template.name}</h3>
                            <p className="template-description">{template.description}</p>
                            
                            <div className="template-tags">
                              {technologies.slice(0, 2).map(tech => (
                                <span key={tech} className="template-tag">{tech}</span>
                              ))}
                            </div>
                          </div>
                          
                          <button 
                            className="use-template-btn"
                            onClick={() => handleTemplateUsage(template)}
                            title={template.description}
                          >
                            Use Template
                          </button>
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
            </div>
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
        <section className="panel insights-panel" aria-labelledby="insights-head" style={{marginTop: '16px'}}>
          <div className="panel-header">
            <h2 id="insights-head">Stack Insights 🔧</h2>
            {stackInsights && (
              <div style={{display: 'flex', gap: '8px', alignItems: 'center', fontSize: '12px'}}>
                <span>Health Score: <strong style={{color: stackInsights.avgHealthScore > 75 ? '#4CAF50' : stackInsights.avgHealthScore > 50 ? '#FF9800' : '#F44336'}}>{stackInsights.avgHealthScore}/100</strong></span>
                <div style={{width: '60px', height: '4px', background: '#eee', borderRadius: '2px', overflow: 'hidden'}}>
                  <div style={{width: `${stackInsights.avgHealthScore}%`, height: '100%', background: stackInsights.avgHealthScore > 75 ? '#4CAF50' : stackInsights.avgHealthScore > 50 ? '#FF9800' : '#F44336', transition: 'width 0.3s ease'}}></div>
                </div>
              </div>
            )}
          </div>
          
          {stackInsights && (
            <div style={{marginBottom: '12px'}}>
              <div style={{display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '8px'}}>
                {['all', 'recommendations', 'warnings', 'performance', 'security'].map(filter => (
                  <button
                    key={filter}
                    onClick={() => setInsightsFilter(filter)}
                    style={{
                      padding: '4px 8px',
                      fontSize: '11px',
                      borderRadius: '12px',
                      border: 'none',
                      background: insightsFilter === filter ? '#21808d' : '#f0f0f0',
                      color: insightsFilter === filter ? 'white' : '#666',
                      cursor: 'pointer',
                      textTransform: 'capitalize'
                    }}
                  >
                    {filter === 'all' ? 'All Insights' : filter}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="insights-content">
            {!stackInsights && <div className="placeholder">Generate more projects to see insights</div>}
            
            {stackInsights && (
              <>
                {/* Smart Recommendations Section */}
                {(insightsFilter === 'all' || insightsFilter === 'recommendations') && stackInsights.smartRecommendations.length > 0 && (
                  <div className="insights-section">
                    <div className="insights-subhead">🎯 Smart Recommendations</div>
                    {stackInsights.smartRecommendations.map((rec, i) => (
                      <div key={`smart-${i}`} className="insight-card" style={{
                        border: `1px solid ${rec.priority === 'high' ? '#F44336' : rec.priority === 'medium' ? '#FF9800' : '#4CAF50'}`,
                        borderLeft: `4px solid ${rec.priority === 'high' ? '#F44336' : rec.priority === 'medium' ? '#FF9800' : '#4CAF50'}`
                      }}>
                        <div className="insight-header">
                          <span className="insight-tag" style={{background: rec.priority === 'high' ? '#F44336' : rec.priority === 'medium' ? '#FF9800' : '#4CAF50'}}>
                            {rec.category}
                          </span>
                          <span className="insight-priority">{rec.priority} priority</span>
                        </div>
                        <div className="insight-title">{rec.title}</div>
                        <div className="insight-description">{rec.description}</div>
                        <div className="insight-actions">
                          <button 
                            className="insight-action-btn"
                            onClick={() => {
                              // Handle recommendation action
                              console.log('Applying recommendation:', rec.action);
                              setAppliedSuggestions(prev => new Set([...prev, `smart-${i}`]));
                            }}
                            disabled={appliedSuggestions.has(`smart-${i}`)}
                          >
                            {appliedSuggestions.has(`smart-${i}`) ? '✓ Applied' : 'Apply'}
                          </button>
                          <button 
                            className="insight-action-btn secondary"
                            onClick={() => setExpandedInsight(expandedInsight === `smart-${i}` ? null : `smart-${i}`)}
                          >
                            {expandedInsight === `smart-${i}` ? 'Less' : 'Learn More'}
                          </button>
                        </div>
                        {expandedInsight === `smart-${i}` && (
                          <div className="insight-expanded">
                            <p>This recommendation is based on your project patterns and industry best practices.</p>
                            <p>Implementation would involve updating your project configurations and dependencies.</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Technology Adoption Metrics */}
                {(insightsFilter === 'all') && (
                  <div className="insights-section">
                    <div className="insights-subhead">📊 Technology Adoption</div>
                    <div className="adoption-grid">
                      {Object.entries(stackInsights.adoptionMetrics).map(([category, techs]) => {
                        const totalCount = Object.values(techs).reduce((sum, count) => sum + count, 0);
                        if (totalCount === 0) return null;
                        
                        return (
                          <div key={category} className="adoption-category">
                            <div className="adoption-category-title">{category.charAt(0).toUpperCase() + category.slice(1)}</div>
                            <div className="adoption-bars">
                              {Object.entries(techs)
                                .sort(([,a], [,b]) => b - a)
                                .slice(0, 3)
                                .map(([tech, count]) => (
                                  <div key={tech} className="adoption-bar">
                                    <span className="adoption-tech">{tech}</span>
                                    <div className="adoption-bar-container">
                                      <div 
                                        className="adoption-bar-fill" 
                                        style={{width: `${(count / totalCount) * 100}%`}}
                                      ></div>
                                    </div>
                                    <span className="adoption-count">{count}</span>
                                  </div>
                                ))
                              }
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Enhanced Suggestions with Actions */}
                {(insightsFilter === 'all' || insightsFilter === 'recommendations') && stackInsights.suggestions.length > 0 && (
                  <div className="insights-section">
                    <div className="insights-subhead">💡 Enhancement Suggestions</div>
                    {stackInsights.suggestions.map((suggestion, i) => (
                      <div key={`suggestion-${i}`} className="insight-item">
                        <div className="insight-tag" style={{background: '#2196F3'}}>Enhance</div>
                        <div className="insight-content">
                          <div className="insight-title">{suggestion}</div>
                          <div className="insight-actions">
                            <button 
                              className="insight-action-btn"
                              onClick={() => {
                                setAppliedSuggestions(prev => new Set([...prev, `suggestion-${i}`]));
                                // Could trigger actual project enhancement here
                              }}
                              disabled={appliedSuggestions.has(`suggestion-${i}`)}
                            >
                              {appliedSuggestions.has(`suggestion-${i}`) ? '✓ Noted' : 'Apply'}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Interactive Warnings */}
                {(insightsFilter === 'all' || insightsFilter === 'warnings') && stackInsights.warnings.length > 0 && (
                  <div className="insights-section">
                    <div className="insights-subhead">⚠️ Compatibility Warnings</div>
                    {stackInsights.warnings.map((warning, i) => (
                      <div key={`warning-${i}`} className="insight-item warning">
                        <div className="insight-tag" style={{background: '#FF9800'}}>Alert</div>
                        <div className="insight-content">
                          <div className="insight-title">{warning}</div>
                          <div className="insight-actions">
                            <button 
                              className="insight-action-btn"
                              onClick={() => setAppliedSuggestions(prev => new Set([...prev, `warning-${i}`]))}
                              disabled={appliedSuggestions.has(`warning-${i}`)}
                            >
                              {appliedSuggestions.has(`warning-${i}`) ? '✓ Resolved' : 'Fix'}
                            </button>
                            <button 
                              className="insight-action-btn secondary"
                              onClick={() => setExpandedInsight(expandedInsight === `warning-${i}` ? null : `warning-${i}`)}
                            >
                              Details
                            </button>
                          </div>
                        </div>
                        {expandedInsight === `warning-${i}` && (
                          <div className="insight-expanded">
                            <p>This warning indicates a potential configuration conflict that could cause issues during development or deployment.</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Performance Tips */}
                {(insightsFilter === 'all' || insightsFilter === 'performance') && stackInsights.tips.length > 0 && (
                  <div className="insights-section">
                    <div className="insights-subhead">🚀 Performance Tips</div>
                    {stackInsights.tips.map((tip, i) => (
                      <div key={`tip-${i}`} className="insight-item">
                        <div className="insight-tag" style={{background: '#4CAF50'}}>Optimize</div>
                        <div className="insight-content">
                          <div className="insight-title">{tip}</div>
                          <div className="insight-actions">
                            <button 
                              className="insight-action-btn"
                              onClick={() => setAppliedSuggestions(prev => new Set([...prev, `tip-${i}`]))}
                              disabled={appliedSuggestions.has(`tip-${i}`)}
                            >
                              {appliedSuggestions.has(`tip-${i}`) ? '✓ Applied' : 'Implement'}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Security Recommendations */}
                {(insightsFilter === 'all' || insightsFilter === 'security') && stackInsights.security.length > 0 && (
                  <div className="insights-section">
                    <div className="insights-subhead">🔒 Security Recommendations</div>
                    {stackInsights.security.map((sec, i) => (
                      <div key={`security-${i}`} className="insight-item security">
                        <div className="insight-tag" style={{background: '#E91E63'}}>Security</div>
                        <div className="insight-content">
                          <div className="insight-title">{sec}</div>
                          <div className="insight-actions">
                            <button 
                              className="insight-action-btn"
                              onClick={() => setAppliedSuggestions(prev => new Set([...prev, `security-${i}`]))}
                              disabled={appliedSuggestions.has(`security-${i}`)}
                            >
                              {appliedSuggestions.has(`security-${i}`) ? '✓ Secured' : 'Secure'}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Project Health Scores */}
                {(insightsFilter === 'all') && stackInsights.projectHealthScores.length > 0 && (
                  <div className="insights-section">
                    <div className="insights-subhead">🏥 Project Health Analysis</div>
                    <div className="health-scores">
                      {stackInsights.projectHealthScores
                        .sort((a, b) => b.score - a.score)
                        .slice(0, 5)
                        .map((project, i) => (
                          <div key={`health-${i}`} className="health-item">
                            <div className="health-project">{project.projectName}</div>
                            <div className="health-score">
                              <span style={{color: project.score > 75 ? '#4CAF50' : project.score > 50 ? '#FF9800' : '#F44336'}}>
                                {project.score}/100
                              </span>
                              <div className="health-bar">
                                <div style={{width: `${project.score}%`, background: project.score > 75 ? '#4CAF50' : project.score > 50 ? '#FF9800' : '#F44336'}}></div>
                              </div>
                            </div>
                            {project.improvements.length > 0 && (
                              <div className="health-improvements">
                                <small>Needs: {project.improvements.slice(0, 2).join(', ')}</small>
                              </div>
                            )}
                          </div>
                        ))
                      }
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
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
