import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  Activity,
  BarChart3,
  CalendarDays,
  ChevronLeft,
  CircleUserRound,
  Edit3,
  Gamepad2,
  ImagePlus,
  Plus,
  Save,
  Search,
  Settings,
  Shield,
  Trophy,
  Trash2,
  Upload,
  Users,
  X,
  Zap
} from "lucide-react";

type Career = {
  id: string;
  name: string;
  player: string;
  club: string;
  position: string;
  season: string;
  nationality: string;
  number: string;
  photo?: string;
  games: number;
  goals: number;
  assists: number;
  minutes: number;
  trophies: number;
  createdAt: string;
};

type Match = {
  id: string;
  careerId: string;
  opponent: string;
  date: string;
  result: string;
  games: number;
  goals: number;
  assists: number;
  minutes: number;
};

const seed: Career[] = [
  {
    id: "demo-1",
    name: "Minha Carreira FC 26",
    player: "Seu Jogador",
    club: "Meu Clube",
    position: "ATA",
    season: "2025/26",
    nationality: "Brasil",
    number: "9",
    games: 0,
    goals: 0,
    assists: 0,
    minutes: 0,
    trophies: 0,
    createdAt: "2026-09-29T00:00:00.000Z"
  }
];

const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

function App() {
  const [careers, setCareers] = useState<Career[]>(seed);
  const [matches, setMatches] = useState<Match[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [page, setPage] = useState<"home" | "careers" | "career" | "settings">("home");
  const [showCareerForm, setShowCareerForm] = useState(false);
  const [showMatchForm, setShowMatchForm] = useState(false);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    try {
      const savedCareers = localStorage.getItem("my-player-stats-careers");
      const savedMatches = localStorage.getItem("my-player-stats-matches");
      if (savedCareers) setCareers(JSON.parse(savedCareers));
      if (savedMatches) setMatches(JSON.parse(savedMatches));
    } catch {
      // Keep the built-in demo data if browser storage is unavailable or invalid.
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem("my-player-stats-careers", JSON.stringify(careers));
    localStorage.setItem("my-player-stats-matches", JSON.stringify(matches));
  }, [careers, matches, hydrated]);

  const selected = careers.find(c => c.id === selectedId) ?? null;
  const selectedMatches = matches.filter(m => m.careerId === selectedId);
  const total = useMemo(() => careers.reduce((a, c) => ({
    games: a.games + c.games, goals: a.goals + c.goals, assists: a.assists + c.assists
  }), { games: 0, goals: 0, assists: 0 }), [careers]);

  const openCareer = (id: string) => {
    setSelectedId(id);
    setPage("career");
    setEditing(false);
  };

  const removeCareer = (id: string) => {
    if (!confirm("Excluir esta carreira e todos os seus jogos?")) return;
    setCareers(prev => prev.filter(c => c.id !== id));
    setMatches(prev => prev.filter(m => m.careerId !== id));
    if (selectedId === id) { setSelectedId(null); setPage("careers"); }
  };

  const updateCareer = (data: Partial<Career>) => {
    if (!selectedId) return;
    setCareers(prev => prev.map(c => c.id === selectedId ? { ...c, ...data } : c));
    setNotice("Carreira atualizada.");
    setEditing(false);
    setTimeout(() => setNotice(""), 2200);
  };

  const addCareer = (data: Career) => {
    setCareers(prev => [...prev, data]);
    setShowCareerForm(false);
    openCareer(data.id);
  };

  const addMatch = (match: Match) => {
    setMatches(prev => [...prev, match]);
    setCareers(prev => prev.map(c => c.id === match.careerId ? {
      ...c,
      games: c.games + match.games,
      goals: c.goals + match.goals,
      assists: c.assists + match.assists,
      minutes: c.minutes + match.minutes
    } : c));
    setShowMatchForm(false);
  };

  const deleteMatch = (match: Match) => {
    if (!confirm("Remover este jogo das estatísticas?")) return;
    setMatches(prev => prev.filter(m => m.id !== match.id));
    setCareers(prev => prev.map(c => c.id === match.careerId ? {
      ...c,
      games: c.games - match.games,
      goals: c.goals - match.goals,
      assists: c.assists - match.assists,
      minutes: c.minutes - match.minutes
    } : c));
  };

  const filtered = careers.filter(c =>
    [c.name, c.player, c.club, c.season].join(" ").toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand" onClick={() => setPage("home")}>
          <div className="brand-mark">FC</div>
          <div><strong>MY PLAYER</strong><span>STATS</span></div>
        </div>

        <div className="game-badge"><Gamepad2 size={18}/> FC 26 CAREER HUB</div>

        <nav>
          <Nav active={page === "home"} icon={<Activity/>} label="Dashboard" onClick={() => setPage("home")}/>
          <Nav active={page === "careers" || page === "career"} icon={<Users/>} label="Minhas Carreiras" onClick={() => setPage("careers")}/>
          <Nav active={page === "settings"} icon={<Settings/>} label="Configurações" onClick={() => setPage("settings")}/>
        </nav>

        <div className="sidebar-bottom">
          <div className="mini-profile"><CircleUserRound size={34}/><div><b>Meu perfil</b><small>FC 26 Manager</small></div></div>
        </div>
      </aside>

      <main className="content">
        <header className="topbar">
          <div>
            <span className="eyebrow">EA SPORTS FC 26 • CAREER MODE</span>
            <h1>{page === "home" ? "Seu universo de carreiras" : page === "careers" ? "Minhas carreiras" : page === "career" ? selected?.name : "Configurações"}</h1>
          </div>
          <div className="top-actions">
            {page === "careers" && <button className="primary" onClick={() => setShowCareerForm(true)}><Plus size={18}/> Nova carreira</button>}
            {page === "career" && selected && <button className="primary" onClick={() => setShowMatchForm(true)}><Plus size={18}/> Registrar jogo</button>}
          </div>
        </header>

        {notice && <div className="toast">{notice}</div>}

        {page === "home" && <Dashboard careers={careers} total={total} onOpen={openCareer} onNew={() => setShowCareerForm(true)} onAll={() => setPage("careers")}/>}
        {page === "careers" && <CareerList careers={filtered} query={query} setQuery={setQuery} onOpen={openCareer} onNew={() => setShowCareerForm(true)} onDelete={removeCareer}/>}
        {page === "career" && selected && (
          <CareerDetail
            career={selected}
            matches={selectedMatches}
            editing={editing}
            onBack={() => setPage("careers")}
            onEdit={() => setEditing(true)}
            onSave={updateCareer}
            onAddMatch={() => setShowMatchForm(true)}
            onDeleteMatch={deleteMatch}
            onDelete={() => removeCareer(selected.id)}
          />
        )}
        {page === "settings" && <SettingsPage careers={careers} onReset={() => {
          if (confirm("Isso apagará todas as carreiras, jogos e fotos. Continuar?")) {
            localStorage.clear(); setCareers([]); setMatches([]); setSelectedId(null); setPage("careers");
          }
        }}/>}
      </main>

      {showCareerForm && <CareerForm onClose={() => setShowCareerForm(false)} onCreate={addCareer}/>}
      {showMatchForm && selected && <MatchForm careerId={selected.id} onClose={() => setShowMatchForm(false)} onCreate={addMatch}/>}
    </div>
  );
}

function Nav({active, icon, label, onClick}:{active:boolean;icon:React.ReactNode;label:string;onClick:()=>void}) {
  return <button className={"nav-item " + (active ? "active" : "")} onClick={onClick}>{icon}<span>{label}</span></button>;
}

function Dashboard({careers,total,onOpen,onNew,onAll}:{careers:Career[];total:{games:number;goals:number;assists:number};onOpen:(id:string)=>void;onNew:()=>void;onAll:()=>void}) {
  const recent = careers.slice(-3).reverse();
  return <section className="page">
    <div className="hero">
      <div><span className="hero-kicker">CENTRAL DO JOGADOR</span><h2>Suas carreiras.<br/><em>Suas histórias.</em></h2><p>Registre cada partida, gol e assistência da sua jornada no FC 26.</p><button className="primary large" onClick={onNew}><Plus/> Criar nova carreira</button></div>
      <div className="hero-ball"><div>26</div></div>
    </div>
    <div className="stat-grid">
      <Stat icon={<Trophy/>} label="Carreiras" value={careers.length}/>
      <Stat icon={<CalendarDays/>} label="Jogos registrados" value={total.games}/>
      <Stat icon={<Zap/>} label="Gols" value={total.goals}/>
      <Stat icon={<BarChart3/>} label="Assistências" value={total.assists}/>
    </div>
    <div className="section-head"><div><span className="eyebrow">SEU ARQUIVO</span><h3>Carreiras recentes</h3></div><button className="ghost" onClick={onAll}>Ver todas →</button></div>
    <div className="career-grid">{recent.map(c => <CareerCard key={c.id} career={c} onOpen={onOpen}/>)}</div>
    {!recent.length && <Empty onNew={onNew}/>}
  </section>;
}

function Stat({icon,label,value}:{icon:React.ReactNode;label:string;value:number}) {
  return <div className="stat-card"><div className="stat-icon">{icon}</div><div><span>{label}</span><strong>{value}</strong></div></div>;
}

function CareerList({careers,query,setQuery,onOpen,onNew,onDelete}:{careers:Career[];query:string;setQuery:(v:string)=>void;onOpen:(id:string)=>void;onNew:()=>void;onDelete:(id:string)=>void}) {
  return <section className="page">
    <div className="toolbar"><div className="search"><Search size={18}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar carreira, jogador, clube..."/></div><button className="primary" onClick={onNew}><Plus size={18}/> Nova carreira</button></div>
    <div className="career-grid full">{careers.map(c=><CareerCard key={c.id} career={c} onOpen={onOpen} onDelete={onDelete}/>)}</div>
    {!careers.length && <Empty onNew={onNew}/>}
  </section>;
}

function CareerCard({career,onOpen,onDelete}:{career:Career;onOpen:(id:string)=>void;onDelete?:(id:string)=>void}) {
  return <article className="career-card" onClick={()=>onOpen(career.id)}>
    <div className="cover">
      {career.photo ? <img src={career.photo} alt={career.player}/> : <div className="photo-placeholder"><CircleUserRound size={64}/></div>}
      <span className="season">{career.season}</span>
      {onDelete && <button className="icon-delete" onClick={e=>{e.stopPropagation();onDelete(career.id)}}><Trash2 size={16}/></button>}
    </div>
    <div className="card-body"><div className="club-line"><Shield size={15}/> {career.club} <span>#{career.number}</span></div><h4>{career.name}</h4><p>{career.player} • {career.position}</p>
      <div className="card-stats"><b>{career.games}<small>JOGOS</small></b><b>{career.goals}<small>GOLS</small></b><b>{career.assists}<small>AST</small></b></div>
    </div>
  </article>;
}

function Empty({onNew}:{onNew:()=>void}) {
  return <div className="empty"><Gamepad2 size={42}/><h3>Nenhuma carreira encontrada</h3><p>Crie sua primeira carreira e comece a registrar sua jornada.</p><button className="primary" onClick={onNew}><Plus/> Criar carreira</button></div>;
}

function CareerDetail({career,matches,editing,onBack,onEdit,onSave,onAddMatch,onDeleteMatch,onDelete}:{career:Career;matches:Match[];editing:boolean;onBack:()=>void;onEdit:()=>void;onSave:(d:Partial<Career>)=>void;onAddMatch:()=>void;onDeleteMatch:(m:Match)=>void;onDelete:()=>void}) {
  return <section className="page">
    <button className="back" onClick={onBack}><ChevronLeft size={18}/> Todas as carreiras</button>
    <div className="player-head">
      <div className="player-photo">{career.photo ? <img src={career.photo} alt={career.player}/> : <CircleUserRound size={90}/>}</div>
      <div className="player-info"><span className="eyebrow">{career.club} • {career.season}</span><h2>{career.player}</h2><p>{career.position} • #{career.number} • {career.nationality}</p></div>
      <div className="player-actions"><button className="secondary" onClick={onEdit}><Edit3 size={17}/> Editar</button><button className="danger" onClick={onDelete}><Trash2 size={17}/></button></div>
    </div>
    <div className="stat-grid detail-stats">
      <Stat icon={<CalendarDays/>} label="Jogos" value={career.games}/>
      <Stat icon={<Zap/>} label="Gols" value={career.goals}/>
      <Stat icon={<BarChart3/>} label="Assistências" value={career.assists}/>
      <Stat icon={<Trophy/>} label="Títulos" value={career.trophies}/>
    </div>
    {editing && <EditCareer career={career} onCancel={()=>onSave({})} onSave={onSave}/>}
    <div className="section-head"><div><span className="eyebrow">MATCH LOG</span><h3>Partidas registradas</h3></div><button className="primary" onClick={onAddMatch}><Plus size={17}/> Registrar jogo</button></div>
    <div className="match-list">
      {matches.map(m=><div className="match-row" key={m.id}><div className="match-date">{m.date || "—"}</div><div className="match-opponent"><b>{m.opponent}</b><span>{m.result}</span></div><div><strong>{m.games}</strong><small>JOGO</small></div><div><strong>{m.goals}</strong><small>GOL</small></div><div><strong>{m.assists}</strong><small>AST</small></div><div><strong>{m.minutes}</strong><small>MIN</small></div><button className="row-delete" onClick={()=>onDeleteMatch(m)}><Trash2 size={16}/></button></div>)}
      {!matches.length && <div className="empty compact"><CalendarDays size={30}/><p>Você ainda não registrou partidas nesta carreira.</p><button className="secondary" onClick={onAddMatch}><Plus/> Registrar primeira partida</button></div>}
    </div>
  </section>;
}

function EditCareer({career,onCancel,onSave}:{career:Career;onCancel:()=>void;onSave:(d:Partial<Career>)=>void}) {
  const [form,setForm]=useState({...career});
  const photoInput=useRef<HTMLInputElement>(null);
  const photo=(e:ChangeEvent<HTMLInputElement>)=>{const f=e.target.files?.[0];if(!f)return;const r=new FileReader();r.onload=()=>setForm(v=>({...v,photo:String(r.result)}));r.readAsDataURL(f)};
  return <div className="edit-panel"><div className="panel-head"><h3>Editar carreira</h3><button onClick={onCancel}><X/></button></div>
    <div className="form-grid">{["name","player","club","position","season","nationality","number"].map(k=><label key={k}>{k==="name"?"Nome da carreira":k==="player"?"Jogador":k==="club"?"Clube":k==="position"?"Posição":k==="season"?"Temporada":k==="nationality"?"Nacionalidade":"Número"}<input value={(form as any)[k]} onChange={e=>setForm(v=>({...v,[k]:e.target.value}))}/></label>)}</div>
    <div className="photo-upload"><input ref={photoInput} type="file" accept="image/*" hidden onChange={photo}/><button className="secondary" onClick={()=>photoInput.current?.click()}><ImagePlus/> Trocar foto</button>{form.photo&&<img src={form.photo} alt="preview"/>}</div>
    <div className="form-actions"><button className="secondary" onClick={onCancel}>Cancelar</button><button className="primary" onClick={()=>onSave(form)}><Save/> Salvar alterações</button></div>
  </div>;
}

function CareerForm({onClose,onCreate}:{onClose:()=>void;onCreate:(c:Career)=>void}) {
  const [f,setF]=useState({name:"Nova carreira",player:"",club:"",position:"ATA",season:"2025/26",nationality:"Brasil",number:"9",photo:""});
  const input=useRef<HTMLInputElement>(null);
  const photo=(e:ChangeEvent<HTMLInputElement>)=>{const file=e.target.files?.[0];if(!file)return;const r=new FileReader();r.onload=()=>setF(v=>({...v,photo:String(r.result)}));r.readAsDataURL(file)};
  const submit=(e:FormEvent)=>{e.preventDefault();if(!f.player.trim())return;onCreate({...f,id:uid(),games:0,goals:0,assists:0,minutes:0,trophies:0,createdAt:new Date().toISOString()})};
  return <Modal title="Nova carreira" onClose={onClose}><form onSubmit={submit}><div className="form-grid">{[
    ["name","Nome da carreira"],["player","Nome do jogador"],["club","Clube"],["position","Posição"],["season","Temporada"],["nationality","Nacionalidade"],["number","Número da camisa"]
  ].map(([k,l])=><label key={k}>{l}<input required={k==="player"} value={(f as any)[k]} onChange={e=>setF(v=>({...v,[k]:e.target.value}))}/></label>)}</div>
  <div className="photo-upload"><input ref={input} type="file" accept="image/*" hidden onChange={photo}/><button type="button" className="secondary" onClick={()=>input.current?.click()}><Upload/> Adicionar foto</button>{f.photo&&<img src={f.photo} alt="preview"/>}</div>
  <div className="form-actions"><button type="button" className="secondary" onClick={onClose}>Cancelar</button><button className="primary"><Plus/> Criar carreira</button></div></form></Modal>;
}

function MatchForm({careerId,onClose,onCreate}:{careerId:string;onClose:()=>void;onCreate:(m:Match)=>void}) {
  const [f,setF]=useState({opponent:"",date:new Date().toISOString().slice(0,10),result:"VITÓRIA",games:"1",goals:"0",assists:"0",minutes:"90"});
  const submit=(e:FormEvent)=>{e.preventDefault();onCreate({id:uid(),careerId,...f,games:+f.games,goals:+f.goals,assists:+f.assists,minutes:+f.minutes})};
  return <Modal title="Registrar partida" onClose={onClose}><form onSubmit={submit}><div className="form-grid">{[
    ["opponent","Adversário"],["date","Data"],["result","Resultado"],["games","Jogos"],["goals","Gols"],["assists","Assistências"],["minutes","Minutos"]
  ].map(([k,l])=><label key={k}>{l}<input type={["games","goals","assists","minutes"].includes(k)?"number":k==="date"?"date":"text"} min="0" value={(f as any)[k]} onChange={e=>setF(v=>({...v,[k]:e.target.value}))}/></label>)}</div>
  <div className="form-actions"><button type="button" className="secondary" onClick={onClose}>Cancelar</button><button className="primary"><Save/> Salvar partida</button></div></form></Modal>;
}

function Modal({title,onClose,children}:{title:string;onClose:()=>void;children:React.ReactNode}) {
  return <div className="modal-backdrop" onMouseDown={onClose}><div className="modal" onMouseDown={e=>e.stopPropagation()}><div className="panel-head"><div><span className="eyebrow">FC 26</span><h3>{title}</h3></div><button onClick={onClose}><X/></button></div>{children}</div></div>;
}

function SettingsPage({careers,onReset}:{careers:Career[];onReset:()=>void}) {
  return <section className="page settings-page"><div className="settings-card"><Settings size={30}/><h3>Configurações</h3><p>Os dados são salvos automaticamente neste navegador usando armazenamento local.</p><div className="setting-line"><div><b>Carreiras salvas</b><span>{careers.length}</span></div></div><button className="danger wide" onClick={onReset}><Trash2/> Apagar todos os dados</button></div></section>;
}

export default App;
