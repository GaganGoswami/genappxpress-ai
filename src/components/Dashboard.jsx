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

  // Simulate feed (could be replaced with real API)
  useEffect(()=>{
    setLoadingNews(true);
    const timer = setTimeout(()=>{
      setNews([
        { id:'t1', title:'New in 2025: AI Code Assistants Embed Protocol Tools', tag:'AI', date:'2025-08-21' },
        { id:'t2', title:'Edge Functions becoming default for micro-backends', tag:'Edge', date:'2025-08-19' },
        { id:'t3', title:'RAG patterns stabilize around hybrid retrieval strategies', tag:'RAG', date:'2025-08-15' },
        { id:'t4', title:'Multi-agent workflow orchestration frameworks converge', tag:'Agents', date:'2025-08-10' }
      ]); setLoadingNews(false);}, 650);
    return ()=>clearTimeout(timer);
  },[]);

  // Load recent projects from localStorage history
  useEffect(()=>{
    try {
      const raw = JSON.parse(localStorage.getItem('genappxpress-history')||'[]');
      setRecent(raw.slice(-10).reverse());
    } catch(e){ /* ignore */ }
  },[]);

  // Derive productivity metrics
  const metrics = useMemo(()=>{
    const total = recent.length;
    const estMinutesSaved = total * 80; // assume 80 minutes saved per scaffold
    const hoursSaved = (estMinutesSaved/60).toFixed(1);
    const byTemplate = recent.reduce((acc,r)=>{ (r.templates||[]).forEach(t=>{acc[t]=(acc[t]||0)+1;}); return acc; },{});
    return { total, hoursSaved, byTemplate };
  },[recent]);

  const templateData = Object.entries(metrics.byTemplate).map(([name,value])=>({name,value}));
  const pieColors = ['#21808d','#2da6b2','#2996a1','#32b8c6','#1a6873','#13343b'];

  // Recommended templates (simple heuristic)
  const recommended = useMemo(()=>{
    const used = new Set(templateData.map(d=>d.name));
    const all = (TECH_STACK.templates||[]).map(t=>t.id);
    return all.filter(t=>!used.has(t)).slice(0,4);
  },[templateData]);

  return (
    <div className="dashboard-root" aria-label="Dashboard Home">
      <div className="dash-grid">
        <section className="panel" aria-labelledby="recent-head">
          <div className="panel-header"><h2 id="recent-head">Recent Projects</h2></div>
          <div className="cards">
            {recent.length===0 && <div className="placeholder">No projects yet. Generate your first scaffold!</div>}
            {recent.map(r=> (
              <button key={r.id} className="card" onClick={()=>onOpenProject&&onOpenProject(r)}>
                <div className="card-title">{r.projectName}</div>
                <div className="card-meta">{new Date(r.date||Date.now()).toLocaleDateString()}</div>
                <div className="stack-line">{[...r.frontend,...r.backend,...r.aiFrameworks].join(', ')}</div>
                {r.templates && r.templates.length>0 && <div className="badge-line">{r.templates.join(' • ')}</div>}
              </button>
            ))}
          </div>
        </section>
        <section className="panel" aria-labelledby="metrics-head">
          <div className="panel-header"><h2 id="metrics-head">Productivity Metrics</h2></div>
          <div className="metrics-summary">
            <div><strong>{metrics.total}</strong><span>Projects</span></div>
            <div><strong>{metrics.hoursSaved}</strong><span>Hours Saved*</span></div>
            <div><strong>{templateData.length}</strong><span>Templates Used</span></div>
          </div>
          <div className="chart-row">
            <div className="mini-chart" aria-label="Template usage pie chart">
              {templateData.length>0 ? (
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie data={templateData} dataKey="value" nameKey="name" innerRadius={40} outerRadius={70} stroke="none">
                      {templateData.map((entry,i)=>(<Cell key={entry.name} fill={pieColors[i % pieColors.length]} />))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : <div className="placeholder" style={{height:160}}>No template data yet.</div>}
            </div>
            <div className="mini-chart" aria-label="Projects over time">
              {recent.length>0 ? (
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={recent.map(r=>({name:r.projectName.slice(0,10), v:1}))}>
                    <XAxis dataKey="name" hide />
                    <YAxis hide />
                    <Tooltip />
                    <Bar dataKey="v" fill="#21808d" radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : <div className="placeholder" style={{height:160}}>No activity yet.</div>}
            </div>
          </div>
          <div className="fine-print">*Estimated time saved assuming ~80 min manual setup / project.</div>
        </section>
        <section className="panel" aria-labelledby="templates-head">
          <div className="panel-header"><h2 id="templates-head">Template Gallery</h2></div>
          <div className="gallery">
            {(TECH_STACK.templates||[]).slice(0,8).map(t=> (
              <button key={t.id} className="template-chip" onClick={()=>onSelectTemplate&&onSelectTemplate(t)}>{t.name}</button>
            ))}
          </div>
          {recommended.length>0 && <div className="recommended">
            <div className="subhead">Recommended</div>
            <div className="gallery small">
              {recommended.map(r=> <span key={r} className="template-chip alt">{r}</span>)}
            </div>
          </div>}
        </section>
        <section className="panel" aria-labelledby="news-head">
          <div className="panel-header"><h2 id="news-head">Trends & Updates</h2></div>
            <ul className="news-list">
              {loadingNews && <li className="placeholder">Loading feed...</li>}
              {news.map(item=> (
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
