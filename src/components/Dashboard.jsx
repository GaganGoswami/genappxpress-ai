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

  // Simulate feed (could be replaced with real API)
  useEffect(() => {
    setLoadingNews(true);
    const timer = setTimeout(() => {
      setNews([
        { id: 't1', title: 'New in 2025: AI Code Assistants Embed Protocol Tools', tag: 'AI', date: '2025-08-21' },
        { id: 't2', title: 'Edge Functions becoming default for micro-backends', tag: 'Edge', date: '2025-08-19' },
        { id: 't3', title: 'RAG patterns stabilize around hybrid retrieval strategies', tag: 'RAG', date: '2025-08-15' },
        { id: 't4', title: 'Multi-agent workflow orchestration frameworks converge', tag: 'Agents', date: '2025-08-10' }
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
          {id:'p1',projectName:'AI Chatbot',date:'2025-09-01',type:'Web App',frontend:['React'],backend:['Node.js'],aiFrameworks:['LangChain'],templates:['ai-chatbot','web-research']},
          {id:'p2',projectName:'RAG Service',date:'2025-08-28',type:'Service',frontend:['Vue'],backend:['FastAPI'],aiFrameworks:['Haystack'],templates:['rag-service','process-automator']},
          {id:'p3',projectName:'Process Automator',date:'2025-08-20',type:'Automation',frontend:['Svelte'],backend:['Flask'],aiFrameworks:['OpenAI'],templates:['process-automator','code-assistant']},
          {id:'p4',projectName:'Local-first App',date:'2025-08-10',type:'Desktop',frontend:['Electron'],backend:['Express'],aiFrameworks:['None'],templates:['local-first-app']},
        ]);
      } else {
        setRecent(raw.slice(-10).reverse());
      }
    } catch (e) { /* ignore */ }
  }, [deleteId]);

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
    const byTemplate = recent.reduce((acc, r) => { (r.templates || []).forEach(t => { acc[t] = (acc[t] || 0) + 1; }); return acc; }, {});
    return { total, hoursSaved, byTemplate };
  }, [recent]);

  const templateData = Object.entries(metrics.byTemplate).map(([name, value]) => ({ name, value }));
  const pieColors = ['#21808d', '#2da6b2', '#2996a1', '#32b8c6', '#1a6873', '#13343b'];

  const recommended = useMemo(() => {
    const used = new Set(templateData.map(d => d.name));
    const all = (TECH_STACK.templates || []).map(t => t.id);
    return all.filter(t => !used.has(t)).slice(0, 4);
  }, [templateData]);

  return (
    <div className="dashboard-root" aria-label="Dashboard Home">
      <div className="dash-grid dash-grid-threecol">
        <section className="panel recent-panel" aria-labelledby="recent-head">
          <div className="panel-header"><h2 id="recent-head">Recent Projects</h2></div>
          <div className="cards">
            {recent.length === 0 && <div className="placeholder">No projects yet. Generate your first scaffold!</div>}
            {recent.map(r => (
              <div key={r.id} className="card card-wide">
                <div className="card-title">{r.projectName}</div>
                <div className="card-meta">{new Date(r.date || Date.now()).toLocaleDateString()} &middot; <span>{r.type || 'App'}</span></div>
                <div className="stack-line">{[...(r.frontend || []), ...(r.backend || []), ...(r.aiFrameworks || [])].join(', ')}</div>
                {r.templates && r.templates.length > 0 && <div className="badge-line">{r.templates.join('  ')} </div>}
                <div className="card-actions">
                  <button className="card-btn" title="Open" onClick={() => onOpenProject && onOpenProject(r)}>Open</button>
                  <button className="card-btn" title="Export" onClick={() => handleExport(r)}>Export</button>
                  <button className="card-btn danger" title="Delete" onClick={() => handleDelete(r.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </section>
        <div className="centercol-group">
          <section className="panel metrics-panel" aria-labelledby="metrics-head">
            <div className="panel-header"><h2 id="metrics-head">Productivity Matrix</h2></div>
            <div className="metrics-summary">
              <div><strong>{metrics.total}</strong><span>Projects</span></div>
              <div><strong>{metrics.hoursSaved}</strong><span>Hours Saved*</span></div>
              <div><strong>{templateData.length}</strong><span>Templates Used</span></div>
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
            <div className="panel-header"><h2 id="templates-head">Template Gallery</h2></div>
            <div className="gallery">
              {(TECH_STACK.templates || []).slice(0, 8).map(t => (
                <button key={t.id} className="template-chip" onClick={() => onSelectTemplate && onSelectTemplate(t)}>{t.name}</button>
              ))}
            </div>
            {recommended.length > 0 && <div className="recommended">
              <div className="subhead">Recommended</div>
              <div className="gallery small">
                {recommended.map(r => <span key={r} className="template-chip alt">{r}</span>)}
              </div>
            </div>}
          </section>
        </div>
        <section className="panel news-panel" aria-labelledby="news-head">
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
        </section>
      </div>
    </div>
  );
}
