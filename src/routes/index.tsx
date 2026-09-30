import { createFileRoute } from "@tanstack/react-router";
import { Gamepad2, Trophy, Users, BarChart3, Plus, ChevronRight } from "lucide-react";

function Home() {
  return (
    <main className="fc-menu">
      <div className="fc-bg" />
      <section className="fc-shell">
        <header className="fc-header">
          <div>
            <div className="fc-kicker">EA SPORTS FC 26</div>
            <h1>MY PLAYER <span>STATS</span></h1>
            <p>Central de carreiras do seu jogador</p>
          </div>
          <div className="fc-badge"><Gamepad2 size={20}/> CAREER HUB</div>
        </header>

        <section className="hero-card">
          <div>
            <span className="eyebrow">MINHA CARREIRA</span>
            <h2>Comece sua<br/><strong>história no FC 26.</strong></h2>
            <p>Crie e acompanhe suas carreiras, jogos, gols e assistências em um único lugar.</p>
            <button className="primary"><Plus size={19}/> NOVA CARREIRA</button>
          </div>
          <div className="hero-player">09</div>
        </section>

        <h3>MENU PRINCIPAL</h3>
        <div className="menu-grid">
          <button className="menu-card active">
            <div className="icon"><Users/></div>
            <div><b>Minhas Carreiras</b><span>Gerencie seus jogadores e temporadas</span></div>
            <ChevronRight/>
          </button>
          <button className="menu-card">
            <div className="icon"><BarChart3/></div>
            <div><b>Estatísticas</b><span>Gols, assistências, jogos e minutos</span></div>
            <ChevronRight/>
          </button>
          <button className="menu-card">
            <div className="icon"><Trophy/></div>
            <div><b>Títulos</b><span>Acompanhe suas conquistas</span></div>
            <ChevronRight/>
          </button>
        </div>

        <div className="status">
          <span className="dot"/> SISTEMA ONLINE
          <span>•</span> FC 26 CAREER HUB
        </div>
      </section>
    </main>
  );
}

export const Route = createFileRoute("/")({ component: Home });
