import { useCallback, useEffect, useState } from "react";
import {
  BarChart3,
  Box,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  ClipboardList,
  Clock3,
  Droplets,
  Eye,
  EyeOff,
  FileSpreadsheet,
  FileText,
  FileClock,
  LayoutDashboard,
  LogOut,
  Menu,
  Minus,
  Package,
  Pencil,
  Plus,
  Receipt,
  Search,
  ShoppingBag,
  Trash2,
  TrendingUp,
  Upload,
  Users,
  X,
} from "lucide-react";
import { readSheet } from "read-excel-file/browser";
import {
  addMaterialStock,
  addTabItems,
  adjustStock,
  closeBatch,
  closeTab,
  completeFirstAccess,
  createBatch,
  createCombo,
  createCost,
  createMaterial,
  createMaterialCategory,
  createProduct,
  createSale,
  createTab,
  createUser,
  deleteBatch,
  deleteCombo,
  deleteCost,
  deleteMaterial,
  deleteMaterialCategory,
  deleteProduct,
  deleteSale,
  deleteTab,
  deleteUser,
  emptyStore,
  getSession,
  importCosts,
  listAuditLogs,
  listUsers,
  loadStore,
  login,
  logout,
  setCostPaid,
  setUserActive,
  updateCost,
  updateCombo,
  updateMaterial,
  updateProduct,
  updateSale,
  updateUser,
  type AuditLog,
  type ManagedUser,
  type SessionUser,
} from "../../lib/controleStore";
import type {
  CostCategory,
  Combo,
  CostEntry,
  CustomerTab,
  Material,
  Product,
  RecipeItem,
  SaleItem,
  StoreData,
} from "../../types/controle";
import { HibiscusLogo } from "../HibiscusLogo";
import "./controle.css";
import "./sale.css";
import "./auth.css";
import "./password.css";
import "./typography.css";
import "./costs.css";
import "./cost-filters.css";
import "./users.css";
import "./actions.css";
import "./audit.css";
import "./reports.css";
import "./materials.css";
import "./dialogs.css";
import "./portions.css";
import "./cost-table.css";
import "./report-export.css";
import "./mobile.css";

type View =
  | "Visão geral"
  | "Vendas"
  | "Comandas"
  | "Combos"
  | "Produtos"
  | "Estoque"
  | "Açaí"
  | "Custos"
  | "Relatórios"
  | "Usuários"
  | "Auditoria";
const money = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const shortDate = (value: string) =>
  new Date(value)
    .toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })
    .replace(".", "");
const uid = (prefix: string) =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

const nav: { label: View; icon: typeof LayoutDashboard }[] = [
  { label: "Visão geral", icon: LayoutDashboard },
  { label: "Vendas", icon: ShoppingBag },
  { label: "Comandas", icon: ClipboardList },
  { label: "Combos", icon: ShoppingBag },
  { label: "Produtos", icon: Package },
  { label: "Estoque", icon: Box },
  { label: "Açaí", icon: Droplets },
  { label: "Custos", icon: Receipt },
  { label: "Relatórios", icon: BarChart3 },
  { label: "Usuários", icon: Users },
  { label: "Auditoria", icon: FileClock },
];

function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="ctl-overlay" onMouseDown={onClose}>
      <section className="ctl-modal" onMouseDown={(e) => e.stopPropagation()}>
        <header>
          <div>
            <small>AFLORA • CONTROLE</small>
            <h2>{title}</h2>
          </div>
          <button className="ctl-icon-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </header>
        {children}
      </section>
    </div>
  );
}

export function Controle() {
  const [data, setData] = useState<StoreData>(emptyStore);
  const [user, setUser] = useState<SessionUser | null>();
  const [view, setView] = useState<View>("Visão geral");
  const [menuOpen, setMenuOpen] = useState(false);
  const [modal, setModal] = useState<
    "sale" | "tab" | "combo" | "product" | "batch" | "cost" | null
  >(null);
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(true);
  const [renderedAt] = useState(Date.now);

  useEffect(() => {
    getSession()
      .then(({ user }) => setUser(user))
      .catch(() => setUser(null));
  }, []);
  useEffect(() => {
    if (user)
      loadStore()
        .then(setData)
        .catch((e) => setToast(e.message))
        .finally(() => setLoading(false));
  }, [user]);
  const notify = useCallback((message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 3200);
  }, []);

  if (user === undefined)
    return <div className="ctl-auth-loading">Carregando...</div>;
  if (!user) return <Login onLogin={setUser} />;
  const isAdmin = user.role !== "employee";
  const canViewAudit = user.username === "victor.nogueira";
  const allowedNav = nav.filter(
    (item) =>
      (isAdmin || ["Visão geral", "Vendas", "Comandas", "Estoque"].includes(item.label)) &&
      (item.label !== "Auditoria" || canViewAudit),
  );

  const todaySales = data.sales.filter(
    (s) => new Date(s.createdAt).toDateString() === new Date().toDateString(),
  );
  const revenue = todaySales.reduce((sum, s) => sum + s.total, 0);
  const acaiRevenue = todaySales
    .flatMap((s) => s.items)
    .filter((i) => i.kind === "acai")
    .reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
  const lowStock = (data.materials ?? []).filter((p) => p.stock <= p.minStock);
  const avgTicket = todaySales.length ? revenue / todaySales.length : 0;
  const openBatch = data.batches.find((b) => b.status === "open");
  const closedBatches = data.batches.filter((b) => b.endedAt);
  const avgBatchDays = closedBatches.length
    ? closedBatches.reduce(
        (sum, b) =>
          sum +
          (new Date(b.endedAt!).getTime() - new Date(b.openedAt).getTime()) /
            86400000,
        0,
      ) / closedBatches.length
    : 0;

  return (
    <div className="controle-shell">
      <aside className={menuOpen ? "ctl-sidebar open" : "ctl-sidebar"}>
        <div className="ctl-brand">
          <HibiscusLogo size="sm" showSubtitle={false} />
          <button onClick={() => setMenuOpen(false)}>
            <X />
          </button>
        </div>
        <nav>
          {allowedNav.map(({ label, icon: Icon }) => (
            <button
              key={label}
              className={view === label ? "active" : ""}
              onClick={() => {
                setView(label);
                setMenuOpen(false);
              }}
            >
              <Icon size={19} />
              {label}
            </button>
          ))}
        </nav>
        <div className="ctl-sidebar-foot">
          <div className="ctl-user">
            <span>{user.username.slice(0, 2).toUpperCase()}</span>
            <div>
              <b>{user.username}</b>
              <small>
                {user.role === "developer"
                  ? "Desenvolvedor"
                  : user.role === "admin"
                    ? "Administrador"
                    : "Funcionário"}
              </small>
            </div>
            <button
              className="ctl-logout"
              title="Sair"
              aria-label="Sair"
              onClick={() => logout().finally(() => setUser(null))}
            >
              <LogOut />
            </button>
          </div>
        </div>
      </aside>
      {menuOpen && (
        <button className="ctl-scrim" onClick={() => setMenuOpen(false)} />
      )}

      <main className="ctl-main">
        <header className="ctl-topbar">
          <button className="ctl-menu" onClick={() => setMenuOpen(true)}>
            <Menu />
          </button>
          <div>
            <span>CONTROLE</span>
            <strong>{view}</strong>
          </div>
          <div className="ctl-top-actions">
            <span className="ctl-date">
              {new Date().toLocaleDateString("pt-BR", {
                weekday: "long",
                day: "2-digit",
                month: "long",
              })}
            </span>
            <button className="ctl-primary" onClick={() => setModal("sale")}>
              <Plus size={18} /> Nova venda
            </button>
          </div>
        </header>
        <div className="ctl-content">
          {loading ? (
            <div className="ctl-loading">Carregando seu painel...</div>
          ) : view === "Visão geral" ? (
            isAdmin ? (
              <Dashboard
                {...{
                  data,
                  revenue,
                  acaiRevenue,
                  avgTicket,
                  lowStock,
                  avgBatchDays,
                  openBatch,
                  renderedAt,
                }}
                onSale={() => setModal("sale")}
                onNavigate={setView}
              />
            ) : (
              <EmployeeHome
                data={data}
                onSale={() => setModal("sale")}
                onStock={() => setView("Estoque")}
              />
            )
          ) : view === "Vendas" ? (
            <Sales
              data={data}
              onNew={() => setModal("sale")}
              employee={!isAdmin}
            />
          ) : view === "Comandas" ? (
            <Tabs
              data={data}
              onNew={() => setModal("tab")}
              onRefresh={async () => setData(await loadStore())}
              notify={notify}
            />
          ) : view === "Combos" && isAdmin ? (
            <Combos data={data} onNew={() => setModal("combo")} onRefresh={async () => setData(await loadStore())} notify={notify} />
          ) : view === "Produtos" && isAdmin ? (
            <Products data={data} onNew={() => setModal("product")} />
          ) : view === "Estoque" ? (
            <Stock
              data={data}
              canEdit={isAdmin}
              onRefresh={async () => setData(await loadStore())}
              onChange={async (id, n) => {
                try {
                  await adjustStock(id, n);
                  setData((d) => ({
                    ...d,
                    materials: d.materials.map((m) =>
                      m.id === id
                        ? { ...m, stock: Math.max(0, m.stock + n) }
                        : m,
                    ),
                  }));
                  notify("Estoque atualizado.");
                } catch (e) {
                  notify((e as Error).message);
                }
              }}
            />
          ) : view === "Açaí" && isAdmin ? (
            <Acai
              data={data}
              renderedAt={renderedAt}
              onBatch={() => setModal("batch")}
              onClose={async (id) => {
                await closeBatch(id);
                setData((d) => ({
                  ...d,
                  batches: d.batches.map((b) =>
                    b.id === id
                      ? {
                          ...b,
                          status: "closed",
                          endedAt: new Date().toISOString(),
                        }
                      : b,
                  ),
                }));
                notify("Lote encerrado.");
              }}
              onDelete={async (id) => {
                await deleteBatch(id);
                setData((d) => ({
                  ...d,
                  batches: d.batches.filter((b) => b.id !== id),
                }));
                notify("Lote excluído.");
              }}
            />
          ) : view === "Custos" && isAdmin ? (
            <Costs
              data={data}
              onRefresh={async () => setData(await loadStore())}
              onNew={() => setModal("cost")}
              onImported={(costs) => {
                setData((d) => ({ ...d, costs: [...costs, ...d.costs] }));
                notify(`${costs.length} custo(s) importado(s).`);
              }}
            />
          ) : view === "Usuários" && isAdmin ? (
            <UsersManager
              currentUsername={user.username}
              currentRole={user.role}
              notify={notify}
            />
          ) : view === "Auditoria" && canViewAudit ? (
            <AuditLogs notify={notify} />
          ) : isAdmin ? (
            <Reports data={data} />
          ) : null}
        </div>
      </main>
      <nav className="ctl-mobile-nav">
        {allowedNav.slice(0, 4).map(({ label, icon: Icon }) => (
          <button
            key={label}
            className={view === label ? "active" : ""}
            onClick={() => setView(label)}
          >
            <Icon />
            <span>{label === "Visão geral" ? "Início" : label}</span>
          </button>
        ))}
        <button onClick={() => setMenuOpen(true)}>
          <Menu />
          <span>Mais</span>
        </button>
      </nav>
      {modal === "sale" && (
        <SaleModal
          data={data}
          onClose={() => setModal(null)}
          onSave={async (sale) => {
            await createSale(sale);
            setData(await loadStore());
            notify("Venda registrada e materiais baixados do estoque.");
            setModal(null);
          }}
        />
      )}
      {modal === "tab" && (
        <TabModal
          data={data}
          onClose={() => setModal(null)}
          onSave={async (tab) => {
            await createTab(tab);
            setData(await loadStore());
            notify("Comanda aberta e itens baixados do estoque.");
            setModal(null);
          }}
        />
      )}
      {modal === "combo" && isAdmin && (
        <ComboModal products={data.products} onClose={() => setModal(null)} onSave={async (combo) => { await createCombo(combo); setData(await loadStore()); notify("Combo cadastrado."); setModal(null); }} />
      )}
      {modal === "product" && isAdmin && (
        <ProductModal
          materials={data.materials}
          onClose={() => setModal(null)}
          onSave={async (p) => {
            try {
              await createProduct(p);
              setData({ ...data, products: [...data.products, p] });
              notify("Produto e receita cadastrados com sucesso!");
              setModal(null);
            } catch (e) {
              notify((e as Error).message);
            }
          }}
        />
      )}
      {modal === "batch" && isAdmin && (
        <BatchModal
          onClose={() => setModal(null)}
          onSave={async (b) => {
            try {
              await createBatch(b);
              setData({ ...data, batches: [b, ...data.batches] });
              notify("Novo lote iniciado!");
              setModal(null);
            } catch (e) {
              notify((e as Error).message);
            }
          }}
        />
      )}
      {modal === "cost" && isAdmin && (
        <CostModal
          onClose={() => setModal(null)}
          onSave={async (cost) => {
            try {
              const result = await createCost(cost);
              setData({ ...data, costs: [...result.costs, ...data.costs] });
              notify("Custo cadastrado.");
              setModal(null);
            } catch (e) {
              notify((e as Error).message);
            }
          }}
        />
      )}
      {toast && <div className="ctl-toast">{toast}</div>}
    </div>
  );
}

function PageTitle({
  eyebrow,
  title,
  text,
  action,
}: {
  eyebrow: string;
  title: string;
  text: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="ctl-page-title">
      <div>
        <span>{eyebrow}</span>
        <h1>{title}</h1>
        <p>{text}</p>
      </div>
      {action}
    </div>
  );
}

function PasswordField({
  label,
  value,
  onChange,
  autoComplete,
  required,
  minLength,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete: string;
  required?: boolean;
  minLength?: number;
  placeholder: string;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <label>
      {label}
      <span className="password-field">
        <input
          autoComplete={autoComplete}
          required={required}
          minLength={minLength}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          aria-label={
            visible
              ? `Ocultar ${label.toLowerCase()}`
              : `Mostrar ${label.toLowerCase()}`
          }
          title={visible ? "Ocultar senha" : "Mostrar senha"}
        >
          {visible ? <EyeOff /> : <Eye />}
        </button>
      </span>
    </label>
  );
}

function Login({ onLogin }: { onLogin: (user: SessionUser) => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [setup, setSetup] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      if (setup) {
        if (password !== confirm) throw new Error("As senhas não coincidem.");
        const result = await completeFirstAccess(password);
        onLogin(result.user);
      } else {
        const result = await login(username, password);
        if (result.setupRequired) {
          setSetup(true);
          setPassword("");
        } else if (result.user) onLogin(result.user);
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="ctl-login">
      <section>
        <div className="login-brand">
          <HibiscusLogo size="md" showSubtitle={false} />
          <small>PAINEL DE CONTROLE</small>
        </div>
        <div>
          <span>{setup ? "PRIMEIRO ACESSO" : "ACESSO RESTRITO"}</span>
          <h1>{setup ? "Crie sua senha" : "Bem-vindo"}</h1>
          <p>
            {setup
              ? `Olá, ${username}. Defina uma senha segura para ativar sua conta.`
              : "Entre com seu usuário e senha para continuar."}
          </p>
        </div>
        <form onSubmit={submit}>
          {!setup && (
            <label>
              Usuário
              <input
                autoComplete="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase())}
                placeholder="Seu usuário"
              />
            </label>
          )}
          <PasswordField
            label="Senha"
            autoComplete={setup ? "new-password" : "current-password"}
            required={setup}
            minLength={setup ? 8 : undefined}
            value={password}
            onChange={setPassword}
            placeholder={
              setup
                ? "Mínimo de 8 caracteres"
                : "Deixe vazio no primeiro acesso"
            }
          />
          {setup && (
            <PasswordField
              label="Confirmar senha"
              autoComplete="new-password"
              required
              minLength={8}
              value={confirm}
              onChange={setConfirm}
              placeholder="Repita a nova senha"
            />
          )}
          {error && <div className="login-error">{error}</div>}
          <button className="ctl-primary" disabled={busy}>
            {busy
              ? "Aguarde..."
              : setup
                ? "Salvar senha e entrar"
                : "Entrar no painel"}
          </button>
        </form>
        <small className="login-security">
          Sessão protegida e acesso baseado em cargo.
        </small>
      </section>
    </div>
  );
}

function EmployeeHome({
  data,
  onSale,
  onStock,
}: {
  data: StoreData;
  onSale: () => void;
  onStock: () => void;
}) {
  const low = data.materials.filter((p) => p.stock <= p.minStock);
  return (
    <>
      <PageTitle
        eyebrow="ÁREA DO FUNCIONÁRIO"
        title="Olá!"
        text="Registre vendas e consulte a disponibilidade dos produtos."
      />
      <section className="employee-actions">
        <button onClick={onSale}>
          <span>
            <ShoppingBag />
          </span>
          <div>
            <b>Registrar nova venda</b>
            <small>Açaí self-service ou produto</small>
          </div>
          <Plus />
        </button>
        <button onClick={onStock}>
          <span>
            <Box />
          </span>
          <div>
            <b>Consultar estoque</b>
            <small>{low.length} item(ns) com estoque baixo</small>
          </div>
          <span>→</span>
        </button>
      </section>
      <article className="ctl-card">
        <div className="ctl-card-head">
          <div>
            <span>DISPONIBILIDADE</span>
            <h3>Estoque atual</h3>
          </div>
        </div>
        <div className="low-list">
          {data.materials.map((p) => (
            <div key={p.id}>
              <span className="product-dot">
                <Package />
              </span>
              <span>
                <b>{p.name}</b>
                <small>Material de estoque</small>
              </span>
              <em>
                {p.stock} {p.unit}
              </em>
            </div>
          ))}
        </div>
      </article>
    </>
  );
}

function Dashboard({
  data,
  revenue,
  acaiRevenue,
  avgTicket,
  lowStock,
  avgBatchDays,
  openBatch,
  renderedAt,
  onSale,
  onNavigate,
}: any) {
  const max = Math.max(...data.sales.slice(0, 7).map((s: any) => s.total), 1);
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayRevenue = data.sales
    .filter(
      (sale: any) =>
        new Date(sale.createdAt).toDateString() === yesterday.toDateString(),
    )
    .reduce((sum: number, sale: any) => sum + sale.total, 0);
  const revenueChange =
    yesterdayRevenue > 0
      ? ((revenue - yesterdayRevenue) / yesterdayRevenue) * 100
      : null;
  const revenueDetail =
    revenueChange === null
      ? revenue > 0
        ? "Sem vendas ontem"
        : "Sem variação em relação a ontem"
      : `${revenueChange >= 0 ? "+" : ""}${revenueChange.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}% vs. ontem`;
  return (
    <>
      <PageTitle
        eyebrow="RESUMO DO DIA"
        title={`Olá! ${greeting}`}
        text="Acompanhe o movimento da loja em tempo real."
        action={
          <button className="ctl-primary desktop-action" onClick={onSale}>
            <Plus size={18} /> Registrar venda
          </button>
        }
      />
      <section className="ctl-kpis">
        <Kpi
          icon={CircleDollarSign}
          label="Faturamento hoje"
          value={money(revenue)}
          detail={revenueDetail}
          accent="green"
        />
        <Kpi
          icon={ShoppingBag}
          label="Vendas hoje"
          value={String(
            data.sales.filter(
              (s: any) =>
                new Date(s.createdAt).toDateString() ===
                new Date().toDateString(),
            ).length,
          )}
          detail={`Ticket médio ${money(avgTicket)}`}
          accent="pink"
        />
        <Kpi
          icon={Droplets}
          label="Açaí vendido"
          value={money(acaiRevenue)}
          detail={`${revenue ? Math.round((acaiRevenue / revenue) * 100) : 0}% das vendas`}
          accent="purple"
        />
        <Kpi
          icon={ClipboardList}
          label="Estoque baixo"
          value={String(lowStock.length)}
          detail="Itens pedem atenção"
          accent="orange"
        />
      </section>
      <section className="ctl-grid-main">
        <article className="ctl-card ctl-chart">
          <div className="ctl-card-head">
            <div>
              <span>DESEMPENHO</span>
              <h3>Vendas recentes</h3>
            </div>
            <button onClick={() => onNavigate("Relatórios")}>
              Ver relatório →
            </button>
          </div>
          <div className="bar-chart">
            {data.sales
              .slice(0, 7)
              .reverse()
              .map((s: any) => (
                <div className="bar-col" key={s.id}>
                  <span>{money(s.total)}</span>
                  <i
                    style={{
                      height: `${Math.max(16, (s.total / max) * 100)}%`,
                    }}
                  ></i>
                  <small>{shortDate(s.createdAt)}</small>
                </div>
              ))}
          </div>
        </article>
        <article className="ctl-card ctl-batch">
          <div className="ctl-card-head">
            <div>
              <span>CONTROLE DE AÇAÍ</span>
              <h3>Lote atual</h3>
            </div>
            <Droplets />
          </div>
          {openBatch ? (
            <>
              <div className="batch-ring">
                <strong>{openBatch.liters}L</strong>
                <small>
                  {openBatch.kind === "acai" ? "Açaí" : "Sorvete"} ·{" "}
                  {openBatch.flavor}
                </small>
              </div>
              <div className="batch-info">
                <span>
                  <Clock3 />
                  Em uso há{" "}
                  <b>
                    {Math.max(
                      1,
                      Math.ceil(
                        (renderedAt - new Date(openBatch.openedAt).getTime()) /
                          86400000,
                      ),
                    )}{" "}
                    dia(s)
                  </b>
                </span>
                <span>
                  <TrendingUp />
                  Média histórica <b>{avgBatchDays.toFixed(1)} dias</b>
                </span>
              </div>
              <button
                className="ctl-secondary full"
                onClick={() => onNavigate("Açaí")}
              >
                Gerenciar lote
              </button>
            </>
          ) : (
            <div className="ctl-empty">Nenhum lote aberto.</div>
          )}
        </article>
      </section>
      <section className="ctl-grid-bottom">
        <article className="ctl-card">
          <div className="ctl-card-head">
            <div>
              <span>ÚLTIMAS VENDAS</span>
              <h3>Movimentações</h3>
            </div>
            <button onClick={() => onNavigate("Vendas")}>Ver todas →</button>
          </div>
          <SalesTable sales={data.sales.slice(0, 4)} />
        </article>
        <article className="ctl-card">
          <div className="ctl-card-head">
            <div>
              <span>ATENÇÃO</span>
              <h3>Estoque baixo</h3>
            </div>
            <button onClick={() => onNavigate("Estoque")}>Ver estoque →</button>
          </div>
          <div className="low-list">
            {lowStock.slice(0, 4).map((p: any) => (
              <div key={p.id}>
                <span className="product-dot">
                  <Package />
                </span>
                <span>
                  <b>{p.name}</b>
                  <small>Material de estoque</small>
                </span>
                <em>
                  {p.stock} {p.unit}
                </em>
              </div>
            ))}
          </div>
        </article>
      </section>
    </>
  );
}

function Kpi({ icon: Icon, label, value, detail, accent }: any) {
  return (
    <article className={`ctl-kpi ${accent}`}>
      <div className="kpi-top">
        <span>
          <Icon />
        </span>
        <small>•••</small>
      </div>
      <p>{label}</p>
      <strong>{value}</strong>
      <small className="kpi-detail">{detail}</small>
    </article>
  );
}

function SalesTable({
  sales,
  manage = false,
}: {
  sales: import("../../types/controle").Sale[];
  manage?: boolean;
}) {
  const [editing, setEditing] = useState<
    import("../../types/controle").Sale | null
  >(null);
  const [deleting, setDeleting] = useState<
    import("../../types/controle").Sale | null
  >(null);
  const [error, setError] = useState("");
  const save = async (
    payment: import("../../types/controle").Sale["payment"],
  ) => {
    if (!editing) return;
    setError("");
    try {
      await updateSale(editing.id, payment);
      window.location.reload();
    } catch (e) {
      setError((e as Error).message);
    }
  };
  const remove = async () => {
    if (!deleting) return;
    setError("");
    try {
      await deleteSale(deleting.id);
      window.location.reload();
    } catch (e) {
      setError((e as Error).message);
    }
  };
  return (
    <>
      <div className={manage ? "ctl-table managed" : "ctl-table"}>
        <div className="ctl-tr ctl-th">
          <span>Venda</span>
          <span>Itens</span>
          <span>Pagamento</span>
          <span>Total</span>
          {manage && <span>Ações</span>}
        </div>
        {sales.map((s) => (
          <div className="ctl-tr" key={s.id}>
            <span>
              <b>#{s.id.replace(/\D/g, "").slice(-4)}</b>
              <small>
                {new Date(s.createdAt).toLocaleString("pt-BR", {
                  day: "2-digit",
                  month: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                {s.discount > 0 ? ` • ${s.discount}% OFF` : ""}
              </small>
            </span>
            <span>
              {s.items.length} {s.items.length === 1 ? "item" : "itens"}
            </span>
            <span>
              <i className="payment-dot"></i>
              {s.payment}
            </span>
            <strong>{money(s.total)}</strong>
            {manage && (
              <span className="row-actions">
                <button
                  title="Editar"
                  onClick={() => {
                    setError("");
                    setEditing(s);
                  }}
                >
                  <Pencil />
                </button>
                <button
                  className="delete"
                  title="Excluir"
                  onClick={() => {
                    setError("");
                    setDeleting(s);
                  }}
                >
                  <Trash2 />
                </button>
              </span>
            )}
          </div>
        ))}
      </div>
      {editing && (
        <SaleEditModal
          sale={editing}
          error={error}
          onClose={() => setEditing(null)}
          onSave={save}
        />
      )}
      {deleting && (
        <ConfirmModal
          title="Excluir venda"
          text="Os itens desta venda serão devolvidos ao estoque. Deseja continuar?"
          error={error}
          onClose={() => setDeleting(null)}
          onConfirm={remove}
        />
      )}
    </>
  );
}

function Sales({
  data,
  onNew,
  employee = false,
}: {
  data: StoreData;
  onNew: () => void;
  employee?: boolean;
}) {
  return (
    <>
      <PageTitle
        eyebrow="MOVIMENTAÇÃO"
        title="Vendas"
        text={
          employee
            ? "Registre uma nova venda. O histórico financeiro é restrito ao administrador."
            : "Consulte, edite e exclua as vendas da loja."
        }
        action={
          <button className="ctl-primary" onClick={onNew}>
            <Plus /> Nova venda
          </button>
        }
      />
      {!employee && (
        <article className="ctl-card">
          <div className="ctl-toolbar">
            <label>
              <Search />
              <input placeholder="Buscar por venda ou produto..." />
            </label>
            <span>{data.sales.length} vendas registradas</span>
          </div>
          <SalesTable sales={data.sales} manage />
        </article>
      )}{" "}
      {employee && (
        <article className="ctl-card employee-sale-card">
          <ShoppingBag />
          <h3>Pronto para atender?</h3>
          <p>Use o botão “Nova venda” para registrar a compra do cliente.</p>
          <button className="ctl-secondary" onClick={onNew}>
            Registrar venda
          </button>
        </article>
      )}
    </>
  );
}

function Tabs({ data, onNew, onRefresh, notify }: { data: StoreData; onNew: () => void; onRefresh: () => Promise<void>; notify: (message: string) => void }) {
  const [paying, setPaying] = useState<CustomerTab | null>(null);
  const [adding, setAdding] = useState<CustomerTab | null>(null);
  const [removing, setRemoving] = useState<CustomerTab | null>(null);
  const [payment, setPayment] = useState<"Pix" | "Dinheiro" | "Cartão">("Pix");
  const [discount, setDiscount] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const discountValue = Math.min(100, Math.max(0, Number(discount.replace(",", ".")) || 0));
  const payable = paying ? paying.total * (1 - discountValue / 100) : 0;
  const finish = async () => {
    if (!paying) return;
    setBusy(true); setError("");
    try { await closeTab(paying.id, payment, discountValue); await onRefresh(); setPaying(null); notify("Comanda paga e venda registrada."); }
    catch (e) { setError((e as Error).message); }
    finally { setBusy(false); }
  };
  const remove = async () => {
    if (!removing) return;
    setBusy(true); setError("");
    try { await deleteTab(removing.id); await onRefresh(); setRemoving(null); notify("Comanda cancelada e itens devolvidos ao estoque."); }
    catch (e) { setError((e as Error).message); }
    finally { setBusy(false); }
  };
  return <>
    <PageTitle eyebrow="ATENDIMENTO" title="Comandas" text="Acompanhe os produtos consumidos e ainda não pagos." action={<button className="ctl-primary" onClick={onNew}><Plus /> Nova comanda</button>} />
    {data.tabs.length ? <div className="tabs-grid">{data.tabs.map((tab) => <article className="ctl-card tab-card" key={tab.id}>
      <header><div><small>COMANDA ABERTA</small><h3>{tab.customerName}</h3></div><ClipboardList /></header>
      <div className="tab-items">{tab.items.map((item, index) => <span key={`${item.productId || item.name}-${index}`}><i>{item.quantity}× {item.name}</i><b>{money(item.quantity * item.unitPrice)}</b></span>)}</div>
      <footer><div><small>Total pendente</small><strong>{money(tab.total)}</strong></div><div className="tab-actions"><button className="ctl-secondary" onClick={()=>setAdding(tab)}><Plus/> Itens</button><button className="ctl-secondary danger" onClick={() => { setError(""); setRemoving(tab); }}>Cancelar</button><button className="ctl-primary" onClick={() => { setError(""); setDiscount(""); setPaying(tab); }}>Receber</button></div></footer>
    </article>)}</div> : <div className="ctl-card ctl-empty"><ClipboardList /><p>Nenhuma comanda aberta.</p><button className="ctl-secondary" onClick={onNew}>Abrir primeira comanda</button></div>}
    {paying && <Modal title={`Receber de ${paying.customerName}`} onClose={() => setPaying(null)}><div className="sale-modal">
      <label className="field"><span>Forma de pagamento</span><div className="pay-options">{(["Pix", "Dinheiro", "Cartão"] as const).map((p) => <button className={payment === p ? "active" : ""} onClick={() => setPayment(p)} key={p}>{p}</button>)}</div></label>
      <label className="field"><span>Desconto (%)</span><div className="percent-input"><input inputMode="decimal" min="0" max="100" placeholder="0" value={discount} onChange={(e) => setDiscount(e.target.value)} /><b>%</b></div></label>
      {error && <div className="modal-error sale-error">{error}</div>}
      <footer><div><small>Total a receber</small><strong>{money(payable)}</strong></div><button className="ctl-primary" disabled={busy} onClick={finish}>{busy ? "Recebendo..." : "Confirmar pagamento"}</button></footer>
    </div></Modal>}
    {removing && <ConfirmModal title="Cancelar comanda" text={`Cancelar a comanda de ${removing.customerName}? Os itens serão devolvidos ao estoque.`} error={error} onClose={() => setRemoving(null)} onConfirm={remove} />}
    {adding&&<TabItemsModal tab={adding} data={data} onClose={()=>setAdding(null)} onSave={async items=>{await addTabItems(adding.id,items);await onRefresh();setAdding(null);notify("Itens adicionados à comanda.")}}/>}
  </>;
}

function TabModal({ data, onClose, onSave }: { data: StoreData; onClose: () => void; onSave: (tab: CustomerTab) => Promise<void> }) {
  const [customerName, setCustomerName] = useState("");
  const [items, setItems] = useState<SaleItem[]>([]);
  const [acaiValue, setAcaiValue] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const add = (p: Product) => setItems((old) => old.some((i) => i.productId === p.id) ? old.map((i) => i.productId === p.id ? { ...i, quantity: i.quantity + 1 } : i) : [...old, { productId: p.id, name: p.name, quantity: 1, unitPrice: p.price, kind: "product" }]);
  const addCombo = (c: Combo) => setItems((old) => old.some((i) => i.comboId === c.id) ? old.map((i) => i.comboId === c.id ? { ...i, quantity: i.quantity + 1 } : i) : [...old, { comboId: c.id, name: c.name, quantity: 1, unitPrice: c.price, kind: "combo" }]);
  const addAcai = () => { const value=Number(acaiValue.replace(",",".")); if(value>0){setItems(old=>[...old,{name:"Açaí self-service",quantity:1,unitPrice:value,kind:"acai"}]);setAcaiValue("")} };
  const change = (id: string | undefined, delta: number) => setItems((old) => old.flatMap((i) => (i.productId||i.comboId) !== id ? [i] : i.quantity + delta > 0 ? [{ ...i, quantity: i.quantity + delta }] : []));
  const total = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const submit = async () => { setSaving(true); setError(""); try { await onSave({ id: uid("c"), customerName: customerName.trim(), createdAt: new Date().toISOString(), items, total, status: "open" }); } catch (e) { setError((e as Error).message); } finally { setSaving(false); } };
  return <Modal title="Abrir comanda" onClose={onClose}><div className="sale-modal">
    <label className="field"><span>Nome da pessoa</span><div className="text-input"><input autoFocus placeholder="Ex.: Mariana" value={customerName} onChange={(e) => setCustomerName(e.target.value)} /></div></label>
    <label className="field"><span>Açaí self-service</span><div className="tab-acai-input"><div className="money-input"><b>R$</b><input inputMode="decimal" placeholder="Valor da pesagem" value={acaiValue} onChange={e=>setAcaiValue(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"){e.preventDefault();addAcai()}}}/></div><button type="button" className="ctl-secondary" disabled={Number(acaiValue.replace(",","."))<=0} onClick={addAcai}><Plus/> Incluir</button></div><small>Informe o valor exibido pela balança.</small></label>
    <div className="quick-products"><span>Produtos e combos consumidos</span><div>{data.products.filter((p) => p.active).map((p) => <button key={p.id} onClick={() => add(p)}><Plus /><span>{p.name}<small>{money(p.price)}</small></span></button>)}{data.combos.filter(c=>c.active).map(c=><button key={c.id} onClick={()=>addCombo(c)}><Plus/><span>{c.name}<small>Combo · {money(c.price)}</small></span></button>)}</div></div>
    {!!items.length && <div className="cart-list">{items.map((i,index) => {const id=i.productId||i.comboId;return <div key={id||`acai-${index}`}><span>{i.quantity}× {i.name}</span><strong>{money(i.quantity * i.unitPrice)}</strong><span className="cart-actions">{i.kind!=="acai"&&<><button onClick={() => change(id, -1)}><Minus /></button><button onClick={() => change(id, 1)}><Plus /></button></>}<button onClick={() => setItems((old) => i.kind==="acai"?old.filter((_,itemIndex)=>itemIndex!==index):old.filter((x) => (x.productId||x.comboId) !== id))}><X /></button></span></div>})}</div>}
    {error && <div className="modal-error sale-error">{error}</div>}
    <footer><div><small>Total da comanda</small><strong>{money(total)}</strong></div><button className="ctl-primary" disabled={!customerName.trim() || !items.length || saving} onClick={submit}>{saving ? "Abrindo..." : "Abrir comanda"}</button></footer>
  </div></Modal>;
}

function TabItemsModal({tab,data,onClose,onSave}:{tab:CustomerTab;data:StoreData;onClose:()=>void;onSave:(items:SaleItem[])=>Promise<void>}) {
  const [items,setItems]=useState<SaleItem[]>([]),[acaiValue,setAcaiValue]=useState(""),[saving,setSaving]=useState(false),[error,setError]=useState("");
  const addProduct=(p:Product)=>setItems(old=>old.some(i=>i.productId===p.id)?old.map(i=>i.productId===p.id?{...i,quantity:i.quantity+1}:i):[...old,{productId:p.id,name:p.name,quantity:1,unitPrice:p.price,kind:"product"}]);
  const addCombo=(c:Combo)=>setItems(old=>old.some(i=>i.comboId===c.id)?old.map(i=>i.comboId===c.id?{...i,quantity:i.quantity+1}:i):[...old,{comboId:c.id,name:c.name,quantity:1,unitPrice:c.price,kind:"combo"}]);
  const addAcai=()=>{const value=Number(acaiValue.replace(",","."));if(value>0){setItems(old=>[...old,{name:"Açaí self-service",quantity:1,unitPrice:value,kind:"acai"}]);setAcaiValue("")}};
  const change=(id:string|undefined,delta:number)=>setItems(old=>old.flatMap(i=>(i.productId||i.comboId)!==id?[i]:i.quantity+delta>0?[{...i,quantity:i.quantity+delta}]:[]));
  const addedTotal=items.reduce((sum,item)=>sum+item.quantity*item.unitPrice,0);
  return <Modal title={`Adicionar itens · ${tab.customerName}`} onClose={onClose}><div className="sale-modal">
    <label className="field"><span>Açaí self-service</span><div className="tab-acai-input"><div className="money-input"><b>R$</b><input autoFocus inputMode="decimal" placeholder="Valor da pesagem" value={acaiValue} onChange={e=>setAcaiValue(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"){e.preventDefault();addAcai()}}}/></div><button type="button" className="ctl-secondary" disabled={Number(acaiValue.replace(",","."))<=0} onClick={addAcai}><Plus/> Incluir</button></div></label>
    <div className="quick-products"><span>Produtos e combos</span><div>{data.products.filter(p=>p.active).map(p=><button key={p.id} onClick={()=>addProduct(p)}><Plus/><span>{p.name}<small>{money(p.price)}</small></span></button>)}{data.combos.filter(c=>c.active).map(c=><button key={c.id} onClick={()=>addCombo(c)}><Plus/><span>{c.name}<small>Combo · {money(c.price)}</small></span></button>)}</div></div>
    {!!items.length&&<div className="cart-list">{items.map((item,index)=>{const id=item.productId||item.comboId;return <div key={id||`acai-${index}`}><span>{item.quantity}× {item.name}</span><strong>{money(item.quantity*item.unitPrice)}</strong><span className="cart-actions">{item.kind!=="acai"&&<><button onClick={()=>change(id,-1)}><Minus/></button><button onClick={()=>change(id,1)}><Plus/></button></>}<button onClick={()=>setItems(old=>item.kind==="acai"?old.filter((_,i)=>i!==index):old.filter(x=>(x.productId||x.comboId)!==id))}><X/></button></span></div>})}</div>}
    {error&&<div className="modal-error sale-error">{error}</div>}<footer><div><small>Novo total: {money(tab.total)} + {money(addedTotal)}</small><strong>{money(tab.total+addedTotal)}</strong></div><button className="ctl-primary" disabled={!items.length||saving} onClick={async()=>{setSaving(true);setError("");try{await onSave(items)}catch(e){setError((e as Error).message)}finally{setSaving(false)}}}>{saving?"Adicionando...":"Adicionar à comanda"}</button></footer>
  </div></Modal>;
}

function Combos({ data, onNew, onRefresh, notify }: { data:StoreData; onNew:()=>void; onRefresh:()=>Promise<void>; notify:(s:string)=>void }) {
  const [editing,setEditing]=useState<Combo|null>(null),[deleting,setDeleting]=useState<Combo|null>(null),[error,setError]=useState("");
  const remove=async()=>{if(!deleting)return;try{await deleteCombo(deleting.id);await onRefresh();setDeleting(null);notify("Combo excluído.")}catch(e){setError((e as Error).message)}};
  return <><PageTitle eyebrow="CATÁLOGO" title="Combos" text="Monte ofertas com vários produtos e um preço único." action={<button className="ctl-primary" onClick={onNew}><Plus/> Novo combo</button>}/>
    {data.combos.length?<div className="product-grid">{data.combos.map(c=><article className="ctl-card product-card" key={c.id}><div className="product-card-icon"><ShoppingBag/></div><span className={c.active?"badge":"badge warn"}>{c.active?"Ativo":"Inativo"}</span><h3>{c.name}</h3><p>{c.items.map(i=>`${i.quantity}× ${data.products.find(p=>p.id===i.productId)?.name||"Produto"}`).join(" + ")}</p><div><strong>{money(c.price)}</strong><small>{c.items.length} produto(s)</small></div><div className="card-actions"><button onClick={()=>setEditing(c)}><Pencil/> Editar</button><button className="delete" onClick={()=>setDeleting(c)}><Trash2/> Excluir</button></div></article>)}</div>:<div className="ctl-card ctl-empty"><ShoppingBag/><p>Nenhum combo cadastrado.</p></div>}
    {editing&&<ComboModal combo={editing} products={data.products} onClose={()=>setEditing(null)} onSave={async c=>{try{await updateCombo(c);await onRefresh();setEditing(null);notify("Combo atualizado.")}catch(e){setError((e as Error).message)}}} error={error}/>} {deleting&&<ConfirmModal title="Excluir combo" text={`Excluir o combo “${deleting.name}”?`} error={error} onClose={()=>setDeleting(null)} onConfirm={remove}/>}</>;
}

function ComboModal({combo,products,onClose,onSave,error=""}:{combo?:Combo;products:Product[];onClose:()=>void;onSave:(c:Combo)=>Promise<void>;error?:string}) {
  const [name,setName]=useState(combo?.name||""),[price,setPrice]=useState(combo?String(combo.price).replace(".",","):""),[active,setActive]=useState(combo?.active??true),[items,setItems]=useState(combo?.items||[]),[saving,setSaving]=useState(false);
  const change=(productId:string,delta:number)=>setItems(old=>{const found=old.find(i=>i.productId===productId);if(!found&&delta>0)return [...old,{productId,quantity:1}];return old.flatMap(i=>i.productId!==productId?[i]:i.quantity+delta>0?[{...i,quantity:i.quantity+delta}]:[])});
  return <Modal title={combo?"Editar combo":"Novo combo"} onClose={onClose}><form className="form-grid" onSubmit={async e=>{e.preventDefault();setSaving(true);try{await onSave({id:combo?.id||uid("cb"),name:name.trim(),price:Number(price.replace(",",".")),active,items})}finally{setSaving(false)}}}><label className="wide">Nome do combo<input required value={name} onChange={e=>setName(e.target.value)} placeholder="Ex.: Dupla de smoothies"/></label><label>Preço do combo<input required inputMode="decimal" value={price} onChange={e=>setPrice(e.target.value)} placeholder="0,00"/></label><label><span>Disponibilidade</span><select value={active?"active":"inactive"} onChange={e=>setActive(e.target.value==="active")}><option value="active">Ativo</option><option value="inactive">Inativo</option></select></label><div className="recipe-builder wide"><div><span>Produtos do combo</span><small>Escolha os itens e suas quantidades.</small></div><div className="combo-product-list">{products.filter(p=>p.active).map(p=>{const quantity=items.find(i=>i.productId===p.id)?.quantity||0;return <div key={p.id}><span>{p.name}<small>{money(p.price)}</small></span><span className="cart-actions"><button type="button" onClick={()=>change(p.id,-1)} disabled={!quantity}><Minus/></button><b>{quantity}</b><button type="button" onClick={()=>change(p.id,1)}><Plus/></button></span></div>})}</div></div>{error&&<div className="modal-error wide">{error}</div>}<footer className="wide"><button type="button" className="ctl-secondary" onClick={onClose}>Cancelar</button><button className="ctl-primary" disabled={!items.length||!name.trim()||Number(price.replace(",","."))<=0||saving}>{saving?"Salvando...":"Salvar combo"}</button></footer></form></Modal>;
}

function Products({ data, onNew }: { data: StoreData; onNew: () => void }) {
  const [editing, setEditing] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState<Product | null>(null);
  const [error, setError] = useState("");
  const save = async (product: Product) => {
    setError("");
    try {
      await updateProduct(product);
      window.location.reload();
    } catch (e) {
      setError((e as Error).message);
    }
  };
  const remove = async () => {
    if (!deleting) return;
    setError("");
    try {
      await deleteProduct(deleting.id);
      window.location.reload();
    } catch (e) {
      setError((e as Error).message);
    }
  };
  return (
    <>
      <PageTitle
        eyebrow="CATÁLOGO"
        title="Produtos"
        text="Gerencie preços, categorias e disponibilidade."
        action={
          <button className="ctl-primary" onClick={onNew}>
            <Plus /> Novo produto
          </button>
        }
      />
      <div className="product-grid">
        {data.products.map((p) => (
          <article className="ctl-card product-card" key={p.id}>
            <div className="product-card-icon">
              <Package />
            </div>
            <span className={p.stock <= p.minStock ? "badge warn" : "badge"}>
              {p.stock <= p.minStock ? "Estoque baixo" : "Ativo"}
            </span>
            <h3>{p.name}</h3>
            <p>
              {p.category} · {p.sku}
            </p>
            <div>
              <strong>{money(p.price)}</strong>
              <small>Receita vinculada ao estoque</small>
            </div>
            <div className="card-actions">
              <button
                onClick={() => {
                  setError("");
                  setEditing(p);
                }}
              >
                <Pencil /> Editar
              </button>
              <button
                className="delete"
                onClick={() => {
                  setError("");
                  setDeleting(p);
                }}
              >
                <Trash2 /> Excluir
              </button>
            </div>
          </article>
        ))}
      </div>
      {editing && (
        <ProductEditModal
          product={editing}
          materials={data.materials}
          error={error}
          onClose={() => setEditing(null)}
          onSave={save}
        />
      )}
      {deleting && (
        <ConfirmModal
          title="Excluir produto"
          text={`Deseja excluir o produto “${deleting.name}”?`}
          error={error}
          onClose={() => setDeleting(null)}
          onConfirm={remove}
        />
      )}
    </>
  );
}

function Stock({
  data,
  canEdit,
  onChange,
  onRefresh,
}: {
  data: StoreData;
  canEdit: boolean;
  onChange: (id: string, n: number) => Promise<void>;
  onRefresh: () => Promise<void>;
}) {
  const [dialog, setDialog] = useState<
    "category" | "material" | "delete-category" | null
  >(null);
  const [editing, setEditing] = useState<Material | null>(null);
  const [deleting, setDeleting] = useState<Material | null>(null);
  const [restocking, setRestocking] = useState<Material | null>(null);
  const [adjusting, setAdjusting] = useState<Material | null>(null);
  const [categoryId, setCategoryId] = useState("");
  const [error, setError] = useState("");
  const categoryName = (id: string) =>
    data.materialCategories.find((c) => c.id === id)?.name || "Sem categoria";
  const close = () => {
    setDialog(null);
    setEditing(null);
    setDeleting(null);
    setRestocking(null);
    setAdjusting(null);
    setError("");
  };
  const addCategory = async (name: string) => {
    setError("");
    const category = { id: uid("mc"), name };
    try {
      await createMaterialCategory(category);
      await onRefresh();
      close();
    } catch (e) {
      setError((e as Error).message);
    }
  };
  const removeCategory = async () => {
    if (!categoryId) return;
    setError("");
    try {
      await deleteMaterialCategory(categoryId);
      await onRefresh();
      close();
    } catch (e) {
      setError((e as Error).message);
    }
  };
  const saveMaterial = async (material: Material) => {
    setError("");
    try {
      if (editing) {
        await updateMaterial(material);
        await onRefresh();
      } else {
        await createMaterial(material);
        await onRefresh();
      }
      close();
    } catch (e) {
      setError((e as Error).message);
    }
  };
  const removeMaterial = async () => {
    if (!deleting) return;
    setError("");
    try {
      await deleteMaterial(deleting.id);
      await onRefresh();
      close();
    } catch (e) {
      setError((e as Error).message);
    }
  };
  return (
    <>
      <PageTitle
        eyebrow="INVENTÁRIO"
        title="Estoque de materiais"
        text={
          canEdit
            ? "Gerencie insumos, acompanhamentos, embalagens e utensílios."
            : "Consulte as quantidades disponíveis."
        }
        action={
          canEdit ? (
            <div className="stock-create-actions">
              <button
                className="ctl-secondary"
                onClick={() => setDialog("category")}
              >
                <Plus /> Categoria
              </button>
              <button
                className="ctl-primary"
                onClick={() => {
                  setError("");
                  setDialog("material");
                }}
              >
                <Plus /> Material
              </button>
            </div>
          ) : undefined
        }
      />
      {canEdit && (
        <div className="category-chips">
          {data.materialCategories.map((c) => (
            <span key={c.id}>{c.name}</span>
          ))}
          {data.materialCategories.length > 0 && (
            <button
              onClick={() => {
                setCategoryId(data.materialCategories[0].id);
                setDialog("delete-category");
              }}
            >
              Gerenciar categorias
            </button>
          )}
        </div>
      )}
      <article className="ctl-card">
        <div
          className={
            canEdit
              ? "stock-list material-stock"
              : "stock-list material-stock readonly"
          }
        >
          <div className="stock-row stock-head">
            <span>Material</span>
            <span>Disponível</span>
            <span>Mínimo</span>
            {canEdit && <span>Ações</span>}
          </div>
          {data.materials.map((m) => (
            <div className="stock-row" key={m.id}>
              <span>
                <b>{m.name}</b>
                <small>
                  {categoryName(m.categoryId)}
                  {m.portionEnabled
                    ? ` · Porção: ${m.portionQuantity} ${m.unit}`
                    : ``}
                </small>
              </span>
              <strong className={m.stock <= m.minStock ? "danger" : ""}>
                {m.portionEnabled && m.portionQuantity > 0
                  ? `${Math.floor(m.stock / m.portionQuantity)} porções`
                  : `${m.stock} ${m.unit}`}
                {m.portionEnabled && m.portionQuantity > 0 && (
                  <small>
                    {m.stock} {m.unit} no total
                  </small>
                )}
              </strong>
              <span>
                {m.minStock} {m.unit}
              </span>
              {canEdit && (
                <span className="stock-actions row-actions">
                  <button
                    className="stock-entry"
                    title="Adicionar entrada de estoque"
                    onClick={() => setRestocking(m)}
                  >
                    <Plus /> Entrada
                  </button>
                  <button
                    title="Definir estoque atual"
                    onClick={() => setAdjusting(m)}
                  >
                    <Pencil /> Saldo
                  </button>
                  <button
                    title="Editar"
                    onClick={() => {
                      setError("");
                      setEditing(m);
                    }}
                  >
                    <Pencil />
                  </button>
                  <button
                    className="delete"
                    title="Excluir"
                    onClick={() => {
                      setError("");
                      setDeleting(m);
                    }}
                  >
                    <Trash2 />
                  </button>
                </span>
              )}
            </div>
          ))}
          {!data.materials.length && (
            <div className="ctl-empty">Nenhum material cadastrado.</div>
          )}
        </div>
      </article>
      {dialog === "category" && (
        <CategoryModal error={error} onClose={close} onSave={addCategory} />
      )}
      {dialog === "material" && (
        <MaterialModal
          categories={data.materialCategories}
          error={error}
          onClose={close}
          onSave={saveMaterial}
        />
      )}
      {editing && (
        <MaterialModal
          material={editing}
          categories={data.materialCategories}
          error={error}
          onClose={close}
          onSave={saveMaterial}
        />
      )}
      {dialog === "delete-category" && (
        <CategoryDeleteModal
          categories={data.materialCategories}
          selected={categoryId}
          onSelect={setCategoryId}
          error={error}
          onClose={close}
          onConfirm={removeCategory}
        />
      )}
      {restocking && (
        <StockEntryModal
          material={restocking}
          error={error}
          onClose={close}
          onSave={async (quantity) => {
            setError("");
            try {
              await addMaterialStock(
                restocking.id,
                quantity,
                restocking.portionEnabled,
                restocking.name,
              );
              await onRefresh();
              close();
            } catch (e) {
              setError((e as Error).message);
            }
          }}
        />
      )}
      {adjusting && (
        <StockBalanceModal
          material={adjusting}
          error={error}
          onClose={close}
          onSave={async (stock) => {
            setError("");
            try {
              await onChange(adjusting.id, stock - adjusting.stock);
              close();
            } catch (e) {
              setError((e as Error).message);
            }
          }}
        />
      )}
      {deleting && (
        <ConfirmModal
          title="Excluir material"
          text={`Deseja excluir o material “${deleting.name}”?`}
          error={error}
          onClose={close}
          onConfirm={removeMaterial}
        />
      )}
    </>
  );
}

function Acai({
  data,
  renderedAt,
  onBatch,
  onClose,
  onDelete,
}: {
  data: StoreData;
  renderedAt: number;
  onBatch: () => void;
  onClose: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const open = data.batches.filter((b) => b.status === "open");
  const [deleting, setDeleting] = useState<
    import("../../types/controle").AcaiBatch | null
  >(null);
  const [error, setError] = useState("");
  const remove = async () => {
    if (!deleting) return;
    setError("");
    try {
      await onDelete(deleting.id);
      setDeleting(null);
    } catch (e) {
      setError((e as Error).message);
    }
  };
  return (
    <>
      <PageTitle
        eyebrow="SELF-SERVICE"
        title="Açaí e sorvetes"
        text="Acompanhe a duração de cada sabor disponível."
        action={
          <button className="ctl-primary" onClick={onBatch}>
            <Plus /> Abrir lote
          </button>
        }
      />
      {open.length > 0 && (
        <section className="open-batch-grid">
          {open.map((batch) => (
            <article className="acai-hero" key={batch.id}>
              <div>
                <span>
                  {batch.kind === "acai" ? "AÇAÍ" : "SORVETE"} • LOTE EM USO
                </span>
                <h2>{batch.flavor}</h2>
                <p>
                  {batch.liters} litros · aberto em{" "}
                  {new Date(batch.openedAt).toLocaleString("pt-BR", {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </p>
              </div>
              <div>
                <small>Tempo em uso</small>
                <strong>
                  {Math.max(
                    1,
                    Math.ceil(
                      (renderedAt - new Date(batch.openedAt).getTime()) /
                        86400000,
                    ),
                  )}{" "}
                  dia(s)
                </strong>
                <button onClick={() => onClose(batch.id)}>
                  Marcar como finalizado
                </button>
              </div>
            </article>
          ))}
        </section>
      )}
      {!open.length && (
        <article className="ctl-card ctl-empty">
          Nenhum lote em uso. Abra um lote para começar o acompanhamento.
        </article>
      )}
      <article className="ctl-card">
        <div className="ctl-card-head">
          <div>
            <span>HISTÓRICO</span>
            <h3>Duração dos lotes por sabor</h3>
          </div>
        </div>
        <div className="batch-history">
          {data.batches.map((b) => (
            <div key={b.id}>
              <span className={b.status === "open" ? "live" : ""}>
                <Droplets />
              </span>
              <div>
                <b>{b.flavor}</b>
                <small>
                  {b.kind === "acai" ? "Açaí" : "Sorvete"} · {b.liters} L ·
                  início: {new Date(b.openedAt).toLocaleDateString("pt-BR")}
                </small>
              </div>
              <div>
                <b>
                  {b.endedAt
                    ? `${((new Date(b.endedAt).getTime() - new Date(b.openedAt).getTime()) / 86400000).toFixed(1)} dias`
                    : "Em uso"}
                </b>
                <small>
                  {b.endedAt
                    ? `Fim: ${new Date(b.endedAt).toLocaleDateString("pt-BR")}`
                    : "Lote atual"}
                </small>
              </div>
              <span className="batch-row-end">
                <strong>{money(b.cost)}</strong>
                <button
                  className="delete"
                  title="Excluir lote"
                  onClick={() => {
                    setError("");
                    setDeleting(b);
                  }}
                >
                  <Trash2 />
                </button>
              </span>
            </div>
          ))}
        </div>
      </article>
      {deleting && (
        <ConfirmModal
          title="Excluir lote"
          text={`Deseja excluir o lote de ${deleting.kind === "acai" ? "açaí" : "sorvete"} sabor “${deleting.flavor}”? Esta ação não poderá ser desfeita.`}
          error={error}
          onClose={() => setDeleting(null)}
          onConfirm={remove}
        />
      )}
    </>
  );
}
const auditModules: Record<string, string> = {
  sales: "Vendas",
  products: "Produtos",
  costs: "Custos",
  users: "Usuários",
  batches: "Açaí e sorvetes",
  materials: "Estoque",
  "material-categories": "Estoque",
};
const auditFieldLabels: Record<string, string> = {
  name: "nome",
  description: "descrição",
  category: "categoria",
  price: "preço",
  cost: "custo",
  payment: "forma de pagamento",
  role: "cargo",
  active: "situação",
  minStock: "estoque mínimo",
  portionEnabled: "uso de porção",
  portionQuantity: "quantidade da porção",
  flavor: "sabor",
  kind: "tipo",
  liters: "volume",
  quantity: "quantidade",
};
function auditEntity(log: AuditLog) {
  const legacy =
    log.entity_type === "api" && Boolean(auditModules[log.entity_id]);
  return {
    type: legacy ? log.entity_id : log.entity_type,
    id: legacy ? String(log.details?.id || "") : log.entity_id,
  };
}
function auditModule(log: AuditLog) {
  const { type } = auditEntity(log);
  return auditModules[type] || type;
}
function auditMessage(log: AuditLog) {
  const details = log.details || {},
    { type, id: idValue } = auditEntity(log),
    module = auditModule(log),
    id = idValue ? ` #${idValue.slice(-8)}` : "";
  const displayName =
    details.name || details.description || details.username || details.flavor;
  let subject =
    type === "material-categories"
      ? `a categoria${displayName ? ` “${displayName}”` : id}`
      : type === "materials"
        ? `o material${displayName ? ` “${displayName}”` : id}`
        : type === "products"
          ? `o produto${displayName ? ` “${displayName}”` : id}`
          : type === "sales"
            ? `a venda${id}`
            : type === "costs"
              ? `o custo${displayName ? ` “${displayName}”` : id}`
              : type === "users"
                ? `o usuário${displayName ? ` “${displayName}”` : id}`
                : type === "batches"
                  ? `o lote${displayName ? ` “${displayName}”` : id}`
                  : `a informação${id}`;
  if (
    type === "materials" &&
    log.action === "update" &&
    details.mode === "portions"
  )
    return `Usuário ${log.actor_username} adicionou ${details.quantity} porção(ões) ao estoque de ${subject} no módulo ${module}.`;
  if (type === "materials" && log.action === "update" && Number(details.delta))
    return `Usuário ${log.actor_username} ${Number(details.delta) > 0 ? "adicionou" : "retirou"} ${Math.abs(Number(details.delta))} unidade(s) de ${subject} no módulo ${module}.`;
  if (type === "costs" && log.action === "update" && "paid" in details)
    return `Usuário ${log.actor_username} ${details.paid ? "marcou como pago" : "desmarcou o pagamento de"} ${subject} no módulo ${module}.`;
  if (
    type === "batches" &&
    log.action === "update" &&
    !Object.keys(details).length
  )
    return `Usuário ${log.actor_username} sinalizou o término de ${subject} no módulo ${module}.`;
  if (type === "sales" && log.action === "create")
    return `Usuário ${log.actor_username} registrou ${subject} no módulo ${module}.`;
  const verb = { create: "criou", update: "editou", delete: "excluiu" }[
    log.action
  ];
  const fields = Object.keys(details)
    .filter((key) => auditFieldLabels[key])
    .map((key) => auditFieldLabels[key]);
  const information =
    log.action === "update" && fields.length
      ? ` (${[...new Set(fields)].join(", ")})`
      : "";
  return `Usuário ${log.actor_username} ${verb} ${subject}${information} no módulo ${module}.`;
}
function AuditLogs({ notify }: { notify: (message: string) => void }) {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [filter, setFilter] = useState("");
  useEffect(() => {
    listAuditLogs()
      .then((r) => setLogs(r.logs))
      .catch((e) => notify(e.message));
  }, [notify]);
  const visible = logs.filter((log) => {
    const term = filter.toLowerCase();
    return !term || auditMessage(log).toLowerCase().includes(term);
  });
  return (
    <>
      <PageTitle
        eyebrow="SEGURANÇA"
        title="Auditoria"
        text="Histórico claro das ações realizadas no sistema."
      />
      <article className="ctl-card">
        <div className="audit-toolbar">
          <label>
            <Search />
            <input
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Buscar usuário, ação ou módulo..."
            />
          </label>
          <span>{visible.length} registros</span>
        </div>
        <div className="audit-list">
          {visible.map((log) => (
            <div className="audit-row" key={log.id}>
              <span className={`audit-icon ${log.action}`}>
                <FileClock />
              </span>
              <div>
                <b>{auditMessage(log)}</b>
                <p>
                  {auditModule(log)} ·{" "}
                  {
                    { create: "Criação", update: "Edição", delete: "Exclusão" }[
                      log.action
                    ]
                  }
                </p>
              </div>
              <time>
                {new Date(log.created_at).toLocaleString("pt-BR", {
                  dateStyle: "short",
                  timeStyle: "short",
                })}
              </time>
            </div>
          ))}
          {!visible.length && (
            <div className="ctl-empty">Nenhuma atividade encontrada.</div>
          )}
        </div>
      </article>
    </>
  );
}
function UsersManager({
  currentUsername,
  currentRole,
  notify,
}: {
  currentUsername: string;
  currentRole: SessionUser["role"];
  notify: (message: string) => void;
}) {
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<ManagedUser | null>(null);
  const [deleting, setDeleting] = useState<ManagedUser | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    listUsers()
      .then((r) => setUsers(r.users))
      .catch((e) => notify(e.message));
  }, [notify]);
  const create = async (username: string, role: "admin" | "employee") => {
    setError("");
    try {
      const result = await createUser(username, role);
      setUsers((old) => [...old, result.user]);
      setCreating(false);
      notify(
        "Usuário criado. No primeiro acesso, ele deverá cadastrar a senha.",
      );
    } catch (err) {
      setError((err as Error).message);
    }
  };
  const toggle = async (user: ManagedUser) => {
    try {
      await setUserActive(user.id, !user.active);
      setUsers((old) =>
        old.map((u) => (u.id === user.id ? { ...u, active: !u.active } : u)),
      );
      notify(user.active ? "Usuário desativado." : "Usuário ativado.");
    } catch (err) {
      notify((err as Error).message);
    }
  };
  const edit = async (username: string, role: "admin" | "employee") => {
    if (!editing) return;
    setError("");
    try {
      await updateUser(editing.id, username, role);
      setUsers((old) =>
        old.map((u) => (u.id === editing.id ? { ...u, username, role } : u)),
      );
      setEditing(null);
      notify("Usuário atualizado.");
    } catch (err) {
      setError((err as Error).message);
    }
  };
  const remove = async () => {
    if (!deleting) return;
    setError("");
    try {
      await deleteUser(deleting.id);
      setUsers((old) => old.filter((u) => u.id !== deleting.id));
      setDeleting(null);
      notify("Usuário excluído.");
    } catch (err) {
      setError((err as Error).message);
    }
  };
  return (
    <>
      <PageTitle
        eyebrow="ADMINISTRAÇÃO"
        title="Usuários"
        text="Crie acessos e controle quem pode entrar no sistema."
        action={
          <button
            className="ctl-primary"
            onClick={() => {
              setError("");
              setCreating(true);
            }}
          >
            <Plus /> Novo usuário
          </button>
        }
      />
      <article className="ctl-card users-list">
        <div className="ctl-card-head">
          <div>
            <span>EQUIPE</span>
            <h3>Usuários cadastrados</h3>
          </div>
        </div>
        {users.map((user) => (
          <div className="user-row" key={user.id}>
            <span>{user.username.slice(0, 2).toUpperCase()}</span>
            <div>
              <b>
                {user.username}
                {user.username === currentUsername ? " (você)" : ""}
              </b>
              <small>
                {user.role === "developer"
                  ? "Desenvolvedor"
                  : user.role === "admin"
                    ? "Administrador"
                    : "Funcionário"}{" "}
                ·{" "}
                {user.needsPassword
                  ? "Aguardando primeiro acesso"
                  : user.active
                    ? "Ativo"
                    : "Desativado"}
              </small>
            </div>
            <i className={user.active ? "active" : ""}></i>
            <span className="row-actions">
              <button
                disabled={
                  user.username === currentUsername ||
                  (currentRole === "admin" && user.role !== "employee")
                }
                title="Editar"
                onClick={() => {
                  setError("");
                  setEditing(user);
                }}
              >
                <Pencil />
              </button>
              <button
                disabled={
                  user.username === currentUsername ||
                  (currentRole === "admin" && user.role !== "employee")
                }
                title={user.active ? "Desativar" : "Ativar"}
                onClick={() => toggle(user)}
              >
                {user.active ? "○" : "●"}
              </button>
              <button
                disabled={
                  user.username === currentUsername ||
                  (currentRole === "admin" && user.role !== "employee")
                }
                className="delete"
                title="Excluir"
                onClick={() => {
                  setError("");
                  setDeleting(user);
                }}
              >
                <Trash2 />
              </button>
            </span>
          </div>
        ))}
      </article>
      {creating && (
        <UserModal
          title="Cadastrar usuário"
          error={error}
          onClose={() => setCreating(false)}
          onSave={create}
        />
      )}
      {editing && (
        <UserModal
          title="Editar usuário"
          user={editing}
          error={error}
          onClose={() => setEditing(null)}
          onSave={edit}
        />
      )}
      {deleting && (
        <ConfirmModal
          title="Excluir usuário"
          text={`Deseja excluir o usuário “${deleting.username}”? O acesso será removido definitivamente.`}
          error={error}
          onClose={() => setDeleting(null)}
          onConfirm={remove}
        />
      )}
    </>
  );
}

const costCategories: CostCategory[] = [
  "Estoque",
  "Mão de obra",
  "Construção",
  "Aluguel",
  "Energia",
  "Marketing",
  "Impostos",
  "Outros",
];
function addMonthsToDate(value: string, months: number) {
  const [year, month, day] = value.split("-").map(Number),
    target = new Date(year, month - 1 + months, 1),
    last = new Date(year, month + months, 0).getDate();
  return inputDate(
    new Date(target.getFullYear(), target.getMonth(), Math.min(day, last)),
  );
}
function Costs({
  data,
  onNew,
  onImported,
  onRefresh,
}: {
  data: StoreData;
  onNew: () => void;
  onImported: (costs: CostEntry[]) => void;
  onRefresh: () => Promise<void>;
}) {
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<CostEntry | null>(null);
  const [deleting, setDeleting] = useState<CostEntry | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(() =>
    inputDate(new Date()).slice(0, 7),
  );
  const [costSearch, setCostSearch] = useState("");
  const costs = data.costs || [];
  const normalizeSearch = (value: string) =>
    value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const monthCosts = costs.filter(
    (c) => c.paymentDate.slice(0, 7) === selectedMonth,
  );
  const query = normalizeSearch(costSearch.trim());
  const visibleCosts = monthCosts
    .filter((c) => {
      if (!query) return true;
      return normalizeSearch(
        [c.description, c.category, c.paidBy, c.notes].filter(Boolean).join(" "),
      ).includes(query);
    })
    .sort((a, b) => a.paymentDate.localeCompare(b.paymentDate));
  const total = monthCosts.reduce((s, c) => s + c.amount, 0);
  const pending = monthCosts
    .filter((c) => !c.paid)
    .reduce((s, c) => s + c.amount, 0);
  const selectedMonthLabel = new Date(
    `${selectedMonth}-01T12:00:00`,
  ).toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
  const moveMonth = (offset: number) =>
    setSelectedMonth(addMonthsToDate(`${selectedMonth}-01`, offset).slice(0, 7));
  const paymentStatus = (date: string, paid: boolean) => {
    if (paid) return { alert: false, label: "Pago" };
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(`${date}T00:00:00`),
      days = Math.ceil((due.getTime() - today.getTime()) / 86400000);
    return {
      alert: days <= 3,
      label:
        days < 0
          ? `Vencido há ${Math.abs(days)} dia(s)`
          : days === 0
            ? "Vence hoje"
            : days <= 3
              ? `Vence em ${days} dia(s)`
              : "",
    };
  };
  const handleFile = async (file: File) => {
    setError("");
    try {
      let rows: unknown[][];
      if (file.name.toLowerCase().endsWith(".csv")) {
        const text = await file.text();
        rows = text
          .split(/\r?\n/)
          .filter(Boolean)
          .map((line) => line.split(";").map((cell) => cell.trim()));
      } else rows = (await readSheet(file)) as unknown[][];
      if (rows.length < 2) throw new Error("A planilha não contém dados.");
      const headers = rows[0].map((v) =>
        String(v || "")
          .trim()
          .toLowerCase(),
      );
      const find = (names: string[]) =>
        headers.findIndex((h) => names.includes(h));
      const indexes = {
        description: find(["descrição", "descricao", "description"]),
        category: find(["categoria", "category"]),
        amount: find(["valor", "custo", "amount"]),
        date: find(["data", "date", "data do lançamento"]),
        paymentDate: find([
          "data de pagamento",
          "data pagamento",
          "vencimento",
          "payment date",
        ]),
        installments: find([
          "parcelas",
          "número de parcelas",
          "numero de parcelas",
          "installments",
        ]),
        recurring: find(["recorrente", "recurring"]),
        notes: find(["observações", "observacoes", "notas", "notes"]),
      };
      if (
        indexes.description < 0 ||
        indexes.category < 0 ||
        indexes.amount < 0 ||
        indexes.date < 0 ||
        indexes.paymentDate < 0
      )
        throw new Error(
          "Use as colunas: Descrição, Categoria, Valor, Data e Data de pagamento.",
        );
      const parseDate = (value: unknown) =>
        value instanceof Date
          ? inputDate(value)
          : String(value || "")
              .split("/")
              .reverse()
              .join("-");
      const parsed = rows
        .slice(1)
        .filter((row) => row.some(Boolean))
        .flatMap((row, index) => {
          const date = parseDate(row[indexes.date]),
            paymentDate = parseDate(row[indexes.paymentDate]),
            category = String(
              row[indexes.category] || "Outros",
            ) as CostCategory;
          if (!costCategories.includes(category))
            throw new Error(`Categoria inválida na linha ${index + 2}.`);
          const amount = Number(
            String(row[indexes.amount] || 0)
              .replace(/R\$\s?/, "")
              .replaceAll(".", "")
              .replace(",", "."),
          );
          if (!Number.isFinite(amount))
            throw new Error(`Valor inválido na linha ${index + 2}.`);
          const installments = Math.max(
              1,
              Number(row[indexes.installments] || 1),
            ),
            groupId = installments > 1 ? uid("grp") : undefined;
          return Array.from({ length: installments }, (_, part) => ({
            id: uid("c"),
            description: String(row[indexes.description] || "").trim(),
            category,
            amount,
            date,
            paymentDate: addMonthsToDate(paymentDate, part),
            recurring: /^(sim|true|1)$/i.test(
              String(row[indexes.recurring] || ""),
            ),
            paid: false,
            notes:
              indexes.notes >= 0 ? String(row[indexes.notes] || "") : undefined,
            installmentNumber: part + 1,
            installmentsTotal: installments,
            installmentGroupId: groupId,
          }));
        });
      await importCosts(parsed);
      onImported(parsed);
    } catch (e) {
      setError((e as Error).message);
    }
  };
  const edit = async (cost: CostEntry) => {
    setError("");
    try {
      await updateCost(cost);
      await onRefresh();
      setEditing(null);
    } catch (err) {
      setError((err as Error).message);
    }
  };
  const remove = async () => {
    if (!deleting) return;
    setError("");
    try {
      await deleteCost(deleting.id);
      await onRefresh();
      setDeleting(null);
    } catch (err) {
      setError((err as Error).message);
    }
  };
  const togglePaid = async (c: CostEntry) => {
    setError("");
    try {
      await setCostPaid(c.id, !c.paid);
      await onRefresh();
    } catch (err) {
      setError((err as Error).message);
    }
  };
  return (
    <>
      <PageTitle
        eyebrow="FINANCEIRO"
        title="Custos"
        text="Controle despesas, parcelas e datas de pagamento."
        action={
          <div className="cost-actions">
            <label className="ctl-secondary">
              <Upload /> Importar planilha
              <input
                type="file"
                accept=".xlsx,.csv"
                onChange={(e) =>
                  e.target.files?.[0] && handleFile(e.target.files[0])
                }
              />
            </label>
            <button className="ctl-primary" onClick={onNew}>
              <Plus /> Novo custo
            </button>
          </div>
        }
      />
      {error && !editing && !deleting && (
        <div className="cost-error">{error}</div>
      )}
      <section className="ctl-kpis cost-kpis">
        <Kpi
          icon={Receipt}
          label="Custos do período"
          value={money(total)}
          detail={`${monthCosts.length} lançamento(s) em ${selectedMonthLabel}`}
          accent="orange"
        />
        <Kpi
          icon={CircleDollarSign}
          label="Pendente no período"
          value={money(pending)}
          detail="Por data de pagamento"
          accent="pink"
        />
      </section>
      <article className="ctl-card">
        <div className="cost-filters">
          <div className="cost-period" aria-label="Selecionar período">
            <button type="button" onClick={() => moveMonth(-1)} title="Mês anterior">
              <ChevronLeft />
            </button>
            <label>
              <span>Período</span>
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => e.target.value && setSelectedMonth(e.target.value)}
              />
            </label>
            <button type="button" onClick={() => moveMonth(1)} title="Próximo mês">
              <ChevronRight />
            </button>
          </div>
          <label className="cost-search">
            <Search />
            <input
              type="search"
              value={costSearch}
              onChange={(e) => setCostSearch(e.target.value)}
              placeholder="Buscar custo, categoria ou responsável"
              aria-label="Buscar custos"
            />
            {costSearch && (
              <button type="button" onClick={() => setCostSearch("")} title="Limpar busca">
                <X />
              </button>
            )}
          </label>
        </div>
        <div className="cost-help">
          Importação: colunas obrigatórias{" "}
          <b>Descrição, Categoria, Valor, Data e Data de pagamento</b>. Use{" "}
          <b>Parcelas</b> para gerar os próximos meses.
        </div>
        <div className="cost-table">
          <div className="cost-row cost-head">
            <span>Descrição</span>
            <span>Categoria</span>
            <span>Pagamento</span>
            <span>Valor</span>
            <span>Ações</span>
          </div>
          {visibleCosts.map((c) => {
            const status = paymentStatus(c.paymentDate, c.paid);
            return (
              <div
                className={`cost-row ${status.alert ? "payment-alert" : ""}`}
                key={c.id}
              >
                <span>
                  <b>{c.description}</b>
                  <small>
                    {c.installmentsTotal && c.installmentsTotal > 1
                      ? `Parcela ${c.installmentNumber}/${c.installmentsTotal}`
                      : c.notes || "Pagamento único"}
                  </small>
                </span>
                <span>
                  <i></i>
                  {c.category}
                </span>
                <span>
                  <b>
                    {new Date(`${c.paymentDate}T12:00:00`).toLocaleDateString(
                      "pt-BR",
                    )}
                  </b>
                  {status.label && <small>{status.label}</small>}
                </span>
                <strong>{money(c.amount)}</strong>
                <span className="row-actions">
                  <button
                    className={c.paid ? "paid-action" : ""}
                    title={c.paid ? "Desmarcar pagamento" : "Marcar como pago"}
                    onClick={() => togglePaid(c)}
                  >
                    <CheckCircle2 />
                  </button>
                  <button
                    title="Editar"
                    onClick={() => {
                      setError("");
                      setEditing(c);
                    }}
                  >
                    <Pencil />
                  </button>
                  <button
                    className="delete"
                    title="Excluir"
                    onClick={() => {
                      setError("");
                      setDeleting(c);
                    }}
                  >
                    <Trash2 />
                  </button>
                </span>
              </div>
            );
          })}
          {!visibleCosts.length && (
            <div className="ctl-empty cost-empty">
              {query
                ? "Nenhum custo encontrado para a busca neste período."
                : "Nenhum custo com pagamento neste período."}
            </div>
          )}
        </div>
      </article>
      {editing && (
        <CostModal
          cost={editing}
          error={error}
          onClose={() => setEditing(null)}
          onSave={edit}
        />
      )}{" "}
      {deleting && (
        <ConfirmModal
          title="Excluir custo"
          text={`Deseja excluir o custo “${deleting.description}”?`}
          error={error}
          onClose={() => setDeleting(null)}
          onConfirm={remove}
        />
      )}
    </>
  );
}

type ReportPeriod = "daily" | "weekly" | "monthly" | "custom";
const inputDate = (date: Date) => {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
};
const reportDate = (value: string) =>
  new Date(value.includes("T") ? value : `${value}T12:00:00`).toLocaleDateString(
    "pt-BR",
  );

const csvCell = (value: unknown) => {
  const safe = String(value ?? "").replaceAll('"', '""');
  const protectedValue = /^[=+\-@]/.test(safe) ? `'${safe}` : safe;
  return `"${protectedValue}"`;
};

function downloadReportCsv(
  sales: StoreData["sales"],
  costs: CostEntry[],
  start: Date,
  end: Date,
) {
  const rows: unknown[][] = [
    ["Relatório Aflora"],
    ["Período", start.toLocaleDateString("pt-BR"), end.toLocaleDateString("pt-BR")],
    [],
    ["Tipo", "Data", "Descrição", "Categoria/Forma", "Quem pagou", "Valor (R$)"],
    ...sales.map((sale) => [
      "Venda",
      reportDate(sale.createdAt),
      sale.items.map((item) => `${item.quantity}x ${item.name}`).join(", "),
      sale.payment,
      "",
      sale.total.toFixed(2).replace(".", ","),
    ]),
    ...costs.map((cost) => [
      "Custo",
      reportDate(cost.date),
      cost.description,
      cost.category,
      cost.paidBy || "Não informado",
      (-cost.amount).toFixed(2).replace(".", ","),
    ]),
  ];
  const content = `\uFEFF${rows.map((row) => row.map(csvCell).join(";")).join("\r\n")}`;
  const url = URL.createObjectURL(
    new Blob([content], { type: "text/csv;charset=utf-8" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = `relatorio-aflora-${inputDate(start)}-a-${inputDate(end)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

async function downloadReportPdf(
  sales: StoreData["sales"],
  costs: CostEntry[],
  start: Date,
  end: Date,
) {
  const [{ jsPDF }, { default: autoTable }] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable"),
  ]);
  const revenue = sales.reduce((sum, sale) => sum + sale.total, 0);
  const expenses = costs.reduce((sum, cost) => sum + cost.amount, 0);
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  doc.setTextColor(131, 24, 63);
  doc.setFontSize(20);
  doc.text("AFLORA", 14, 18);
  doc.setTextColor(35, 32, 31);
  doc.setFontSize(14);
  doc.text("Relatório financeiro", 14, 27);
  doc.setFontSize(9);
  doc.setTextColor(110, 103, 100);
  doc.text(
    `Período: ${start.toLocaleDateString("pt-BR")} a ${end.toLocaleDateString("pt-BR")}`,
    14,
    34,
  );
  doc.setFontSize(10);
  doc.setTextColor(35, 32, 31);
  doc.text(`Receita: ${money(revenue)}`, 14, 44);
  doc.text(`Custos: ${money(expenses)}`, 76, 44);
  doc.text(`Resultado: ${money(revenue - expenses)}`, 132, 44);

  autoTable(doc, {
    startY: 51,
    head: [["Data", "Venda", "Pagamento", "Valor"]],
    body: sales.map((sale) => [
      reportDate(sale.createdAt),
      sale.items.map((item) => `${item.quantity}x ${item.name}`).join(", "),
      sale.payment,
      money(sale.total),
    ]),
    theme: "grid",
    headStyles: { fillColor: [131, 24, 63] },
    styles: { fontSize: 8, cellPadding: 2.5 },
    didDrawPage: (hook) => {
      doc.setFontSize(8);
      doc.setTextColor(130);
      doc.text(`Página ${doc.getNumberOfPages()}`, 196, 289, { align: "right" });
      if (hook.pageNumber > 1) doc.text("Vendas", 14, 10);
    },
  });

  const firstTableEnd = (doc as typeof doc & { lastAutoTable?: { finalY: number } })
    .lastAutoTable?.finalY;
  autoTable(doc, {
    startY: (firstTableEnd || 51) + 9,
    head: [["Data", "Custo", "Categoria", "Quem pagou", "Valor"]],
    body: costs.map((cost) => [
      reportDate(cost.date),
      cost.description,
      cost.category,
      cost.paidBy || "Não informado",
      money(cost.amount),
    ]),
    theme: "grid",
    headStyles: { fillColor: [190, 107, 41] },
    styles: { fontSize: 8, cellPadding: 2.5 },
  });
  doc.save(`relatorio-aflora-${inputDate(start)}-a-${inputDate(end)}.pdf`);
}

function Reports({ data }: { data: StoreData }) {
  const [period, setPeriod] = useState<ReportPeriod>("daily");
  const [customStart, setCustomStart] = useState(() => inputDate(new Date()));
  const [customEnd, setCustomEnd] = useState(() => inputDate(new Date()));
  const now = new Date();
  let start = new Date(now.getFullYear(), now.getMonth(), now.getDate()),
    end = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59,
      999,
    );
  if (period === "weekly") {
    const day = (now.getDay() + 6) % 7;
    start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - day);
  } else if (period === "monthly") {
    start = new Date(now.getFullYear(), now.getMonth(), 1);
  } else if (period === "custom") {
    start = new Date(`${customStart}T00:00:00`);
    end = new Date(`${customEnd}T23:59:59.999`);
  }
  const sales = data.sales.filter((s) => {
    const date = new Date(s.createdAt);
    return date >= start && date <= end;
  });
  const costs = (data.costs || []).filter((c) => {
    const date = new Date(`${c.date}T12:00:00`);
    return date >= start && date <= end;
  });
  const revenue = sales.reduce((sum, s) => sum + s.total, 0),
    expenses = costs.reduce((sum, c) => sum + c.amount, 0),
    balance = revenue - expenses,
    ticket = sales.length ? revenue / sales.length : 0;
  const labels: Record<ReportPeriod, string> = {
    daily: "Hoje",
    weekly: "Esta semana",
    monthly: "Este mês",
    custom: "Personalizado",
  };
  return (
    <>
      <PageTitle
        eyebrow="INTELIGÊNCIA"
        title="Relatórios"
        text="Analise vendas, custos e resultado por período."
        action={
          <div className="report-export-actions">
            <button
              className="ctl-secondary"
              onClick={() => downloadReportCsv(sales, costs, start, end)}
            >
              <FileSpreadsheet /> Planilha
            </button>
            <button
              className="ctl-primary"
              onClick={() => downloadReportPdf(sales, costs, start, end)}
            >
              <FileText /> PDF
            </button>
          </div>
        }
      />
      <section className="report-filter">
        <div>
          {(["daily", "weekly", "monthly", "custom"] as ReportPeriod[]).map(
            (item) => (
              <button
                className={period === item ? "active" : ""}
                key={item}
                onClick={() => setPeriod(item)}
              >
                {labels[item]}
              </button>
            ),
          )}
        </div>
        {period === "custom" && (
          <div className="custom-dates">
            <label>
              De
              <input
                type="date"
                value={customStart}
                max={customEnd}
                onChange={(e) => setCustomStart(e.target.value)}
              />
            </label>
            <span>até</span>
            <label>
              Até
              <input
                type="date"
                value={customEnd}
                min={customStart}
                onChange={(e) => setCustomEnd(e.target.value)}
              />
            </label>
          </div>
        )}
        <small>
          Período: {start.toLocaleDateString("pt-BR")} a{" "}
          {end.toLocaleDateString("pt-BR")}
        </small>
      </section>
      <section className="ctl-kpis report report-kpis">
        <Kpi
          icon={CircleDollarSign}
          label="Receita"
          value={money(revenue)}
          detail={`${sales.length} venda(s)`}
          accent="green"
        />
        <Kpi
          icon={Receipt}
          label="Custos"
          value={money(expenses)}
          detail={`${costs.length} lançamento(s)`}
          accent="orange"
        />
        <Kpi
          icon={TrendingUp}
          label="Resultado"
          value={money(balance)}
          detail={balance >= 0 ? "Saldo positivo" : "Saldo negativo"}
          accent={balance >= 0 ? "purple" : "orange"}
        />
        <Kpi
          icon={ShoppingBag}
          label="Ticket médio"
          value={money(ticket)}
          detail="Por venda"
          accent="pink"
        />
      </section>
      <section className="report-details">
        <article className="ctl-card">
          <div className="ctl-card-head">
            <div>
              <span>VENDAS DO PERÍODO</span>
              <h3>{sales.length} venda(s) encontrada(s)</h3>
            </div>
            <strong>{money(revenue)}</strong>
          </div>
          {sales.length ? (
            <SalesTable sales={sales} />
          ) : (
            <div className="ctl-empty">Nenhuma venda neste período.</div>
          )}
        </article>
        <article className="ctl-card">
          <div className="ctl-card-head">
            <div>
              <span>CUSTOS DO PERÍODO</span>
              <h3>{costs.length} lançamento(s)</h3>
            </div>
            <strong>{money(expenses)}</strong>
          </div>
          <div className="report-cost-list">
            {costs.map((c) => (
              <div key={c.id}>
                <span>
                  <b>{c.description}</b>
                  <small>
                    {c.category} ·{" "}
                    {new Date(`${c.date}T12:00:00`).toLocaleDateString("pt-BR")}
                  </small>
                </span>
                <strong>{money(c.amount)}</strong>
              </div>
            ))}
            {!costs.length && (
              <div className="ctl-empty">Nenhum custo neste período.</div>
            )}
          </div>
        </article>
      </section>
    </>
  );
}

function SaleModal({
  data,
  onClose,
  onSave,
}: {
  data: StoreData;
  onClose: () => void;
  onSave: (
    s: import("../../types/controle").Sale,
    i: SaleItem[],
  ) => Promise<void>;
}) {
  const [saleType, setSaleType] = useState<"acai" | "product">("acai");
  const [items, setItems] = useState<SaleItem[]>([]);
  const [acai, setAcai] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [payment, setPayment] = useState<"Pix" | "Dinheiro" | "Cartão">("Pix");
  const [discount, setDiscount] = useState("");
  const add = (p: Product) =>
    setItems((old) => {
      const found = old.find((i) => i.productId === p.id);
      return found
        ? old.map((i) =>
            i.productId === p.id ? { ...i, quantity: i.quantity + 1 } : i,
          )
        : [
            ...old,
            {
              productId: p.id,
              name: p.name,
              quantity: 1,
              unitPrice: p.price,
              kind: "product",
            },
          ];
    });
  const addCombo = (c: Combo) => setItems((old) => {
    const found=old.find(i=>i.comboId===c.id);
    return found?old.map(i=>i.comboId===c.id?{...i,quantity:i.quantity+1}:i):[...old,{comboId:c.id,name:c.name,quantity:1,unitPrice:c.price,kind:"combo"}];
  });
  const decrease = (id?: string) =>
    setItems((old) =>
      old.flatMap((i) =>
        (i.productId || i.comboId) !== id
          ? [i]
          : i.quantity > 1
            ? [{ ...i, quantity: i.quantity - 1 }]
            : [],
      ),
    );
  const acaiValue = Number(acai.replace(",", "."));
  const finalItems: SaleItem[] =
    saleType === "acai" && acaiValue > 0
      ? [
          {
            name: "Açaí self-service",
            quantity: 1,
            unitPrice: acaiValue,
            kind: "acai",
          },
        ]
      : items;
  const subtotal = finalItems.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0,
  );
  const discountValue = Math.min(100, Math.max(0, Number(discount.replace(",", ".")) || 0));
  const total = Math.round(subtotal * (1 - discountValue / 100) * 100) / 100;
  const choose = (type: "acai" | "product") => {
    setSaleType(type);
    setItems([]);
    setAcai("");
  };
  const submit = async () => {
    setError("");
    setSaving(true);
    try {
      await onSave(
        {
          id: uid("v"),
          createdAt: new Date().toISOString(),
          items: finalItems,
          subtotal,
          discount: discountValue,
          total,
          payment,
        },
        saleType === "product" ? items : [],
      );
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  };
  return (
    <Modal title="Registrar venda" onClose={onClose}>
      <div className="sale-modal">
        <div className="sale-type">
          <span>O que foi vendido?</span>
          <div>
            <button
              className={saleType === "acai" ? "active" : ""}
              onClick={() => choose("acai")}
            >
              <Droplets />
              <b>Açaí self-service</b>
              <small>Informar valor da pesagem</small>
            </button>
            <button
              className={saleType === "product" ? "active" : ""}
              onClick={() => choose("product")}
            >
              <ShoppingBag />
              <b>Produto</b>
              <small>Smoothie, milk shake e outros</small>
            </button>
          </div>
        </div>
        {saleType === "acai" ? (
          <label className="field">
            <span>Valor do açaí self-service</span>
            <div className="money-input">
              <b>R$</b>
              <input
                autoFocus
                inputMode="decimal"
                placeholder="0,00"
                value={acai}
                onChange={(e) => setAcai(e.target.value)}
              />
            </div>
            <small>Digite o valor exibido pela balança/caixa.</small>
          </label>
        ) : (
          <div className="quick-products">
            <span>Selecione o produto</span>
            {data.products.filter((p) => p.active).length ? (
              <div>
                {data.products
                  .filter((p) => p.active)
                  .map((p) => (
                    <button key={p.id} onClick={() => add(p)}>
                      <Plus />
                      <span>
                        {p.name}
                        <small>{money(p.price)}</small>
                      </span>
                    </button>
                  ))}
                {data.combos.filter((c) => c.active).map((c) => (
                  <button key={c.id} onClick={() => addCombo(c)}><Plus /><span>{c.name}<small>Combo · {money(c.price)}</small></span></button>
                ))}
              </div>
            ) : (
              <div className="sale-empty">
                <Package />
                <b>Nenhum produto disponível</b>
                <small>Cadastre produtos antes de registrar a venda.</small>
              </div>
            )}
          </div>
        )}
        {saleType === "product" && items.length > 0 && (
          <div className="cart-list">
            {items.map((i) => (
              <div key={i.productId || i.comboId}>
                <span>
                  {i.quantity}× {i.name}
                </span>
                <strong>{money(i.quantity * i.unitPrice)}</strong>
                <span className="cart-actions">
                  <button onClick={() => decrease(i.productId || i.comboId)}>
                    <Minus />
                  </button>
                  <button
                    onClick={() => i.kind === "combo" ? addCombo(data.combos.find((c) => c.id === i.comboId)!) : add(data.products.find((p) => p.id === i.productId)!)}
                  >
                    <Plus />
                  </button>
                  <button
                    onClick={() =>
                      setItems((old) =>
                        old.filter((x) => (x.productId || x.comboId) !== (i.productId || i.comboId)),
                      )
                    }
                  >
                    <X />
                  </button>
                </span>
              </div>
            ))}
          </div>
        )}
        <label className="field">
          <span>Forma de pagamento</span>
          <div className="pay-options">
            {(["Pix", "Dinheiro", "Cartão"] as const).map((p) => (
              <button
                className={payment === p ? "active" : ""}
                onClick={() => setPayment(p)}
                key={p}
              >
                {p}
              </button>
            ))}
          </div>
        </label>
        <label className="field">
          <span>Desconto (%)</span>
          <div className="percent-input">
            <input inputMode="decimal" min="0" max="100" placeholder="0" value={discount} onChange={(e) => setDiscount(e.target.value)} />
            <b>%</b>
          </div>
          <small>O percentual será retirado do valor final.</small>
        </label>
        {error && (
          <div className="modal-error sale-error" role="alert">
            {error}
          </div>
        )}
        <footer>
          <div>
            <small>Total da venda</small>
            {discountValue > 0 && <span className="discount-summary">De {money(subtotal)} com {discountValue}% OFF</span>}
            <strong>{money(total)}</strong>
          </div>
          <button
            className="ctl-primary"
            disabled={!subtotal || saving}
            onClick={submit}
          >
            {saving ? "Registrando..." : "Finalizar venda"}
          </button>
        </footer>
      </div>
    </Modal>
  );
}

function ProductModal({
  materials,
  onClose,
  onSave,
}: {
  materials: Material[];
  onClose: () => void;
  onSave: (p: Product) => void;
}) {
  const [f, setF] = useState({
    name: "",
    category: "Smoothie",
    sku: "",
    price: "",
    cost: "",
  });
  const [recipe, setRecipe] = useState<RecipeItem[]>([]);
  const [materialId, setMaterialId] = useState(materials[0]?.id || "");
  const [quantity, setQuantity] = useState(
    materials[0]?.portionEnabled ? String(materials[0].portionQuantity) : "",
  );
  const input =
    (k: keyof typeof f) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setF({ ...f, [k]: e.target.value });
  const addRecipe = () => {
    const amount = Number(quantity.replace(",", "."));
    if (!materialId || amount <= 0) return;
    setRecipe((old) => [
      ...old.filter((i) => i.materialId !== materialId),
      { materialId, quantity: amount },
    ]);
    setQuantity("");
  };
  return (
    <Modal title="Novo produto e receita" onClose={onClose}>
      <form
        className="form-grid"
        onSubmit={(e) => {
          e.preventDefault();
          onSave({
            id: uid("p"),
            name: f.name,
            category: f.category,
            sku: f.sku || `PRO-${Date.now().toString().slice(-4)}`,
            unit: "un",
            price: Number(f.price.replace(",", ".")),
            cost: Number(f.cost.replace(",", ".")),
            stock: 0,
            minStock: 0,
            active: true,
            recipe,
          });
        }}
      >
        <label className="wide">
          Nome do produto
          <input
            required
            value={f.name}
            onChange={input("name")}
            placeholder="Ex.: Smoothie de banana"
          />
        </label>
        <label>
          Tipo
          <select value={f.category} onChange={input("category")}>
            <option>Smoothie</option>
            <option>Batida de açaí</option>
            <option>Crepe</option>
            <option>Milk-shake</option>
            <option>Bebida</option>
            <option>Outros</option>
          </select>
        </label>
        <label>
          SKU
          <input
            value={f.sku}
            onChange={input("sku")}
            placeholder="Gerado automaticamente"
          />
        </label>
        <label>
          Preço de venda
          <input
            required
            inputMode="decimal"
            value={f.price}
            onChange={input("price")}
            placeholder="0,00"
          />
        </label>
        <label>
          Custo adicional
          <input
            inputMode="decimal"
            value={f.cost}
            onChange={input("cost")}
            placeholder="0,00"
          />
        </label>
        <div className="recipe-builder wide">
          <div>
            <span>Receita do produto</span>
            <small>
              Defina quanto de cada material é consumido em uma unidade.
            </small>
          </div>
          {materials.length ? (
            <>
              <div className="recipe-inputs">
                <select
                  value={materialId}
                  onChange={(e) => {
                    const id = e.target.value;
                    setMaterialId(id);
                    const selected = materials.find((m) => m.id === id);
                    setQuantity(
                      selected?.portionEnabled
                        ? String(selected.portionQuantity)
                        : "",
                    );
                  }}
                >
                  {materials.map((m) => (
                    <option value={m.id} key={m.id}>
                      {m.name} ({m.unit})
                      {m.portionEnabled
                        ? ` · porção de ${m.portionQuantity} ${m.unit}`
                        : ""}
                    </option>
                  ))}
                </select>
                <input
                  inputMode="decimal"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="Quantidade"
                />
                <button type="button" onClick={addRecipe}>
                  <Plus /> Adicionar
                </button>
              </div>
              <div className="recipe-list">
                {recipe.map((item) => {
                  const material = materials.find(
                    (m) => m.id === item.materialId,
                  );
                  return (
                    <div key={item.materialId}>
                      <span>{material?.name}</span>
                      <b>
                        {item.quantity} {material?.unit}
                      </b>
                      <button
                        type="button"
                        onClick={() =>
                          setRecipe((old) =>
                            old.filter((i) => i.materialId !== item.materialId),
                          )
                        }
                      >
                        <X />
                      </button>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="form-note">
              Cadastre materiais no estoque antes de montar a receita.
            </div>
          )}
        </div>
        <footer className="wide">
          <button type="button" className="ctl-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button className="ctl-primary" disabled={!recipe.length}>
            Cadastrar produto
          </button>
        </footer>
      </form>
    </Modal>
  );
}

function BatchModal({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (b: import("../../types/controle").AcaiBatch) => void;
}) {
  const [kind, setKind] = useState<"acai" | "sorvete">("acai");
  const [flavor, setFlavor] = useState("");
  const [liters, setLiters] = useState("10");
  const [cost, setCost] = useState("");
  return (
    <Modal title="Abrir lote" onClose={onClose}>
      <form
        className="form-grid"
        onSubmit={(e) => {
          e.preventDefault();
          onSave({
            id: uid("l"),
            kind,
            flavor: flavor.trim(),
            liters: Number(liters.replace(",", ".")),
            cost: Number(cost.replace(",", ".")),
            openedAt: new Date().toISOString(),
            status: "open",
          });
        }}
      >
        <label>
          Tipo
          <select
            value={kind}
            onChange={(e) => setKind(e.target.value as typeof kind)}
          >
            <option value="acai">Açaí</option>
            <option value="sorvete">Sorvete</option>
          </select>
        </label>
        <label>
          Sabor
          <input
            required
            value={flavor}
            onChange={(e) => setFlavor(e.target.value)}
            placeholder={
              kind === "acai"
                ? "Ex.: Tradicional, morango"
                : "Ex.: Chocolate, flocos"
            }
          />
        </label>
        <label>
          Volume do lote (L)
          <input
            required
            type="number"
            min="0.1"
            step="0.1"
            value={liters}
            onChange={(e) => setLiters(e.target.value)}
          />
        </label>
        <label>
          Custo do lote
          <input
            required
            inputMode="decimal"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            placeholder="0,00"
          />
        </label>
        <p className="form-note wide">
          Cada sabor é acompanhado separadamente. Quando o recipiente acabar,
          finalize apenas o lote correspondente.
        </p>
        <footer className="wide">
          <button type="button" className="ctl-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button className="ctl-primary">Iniciar lote</button>
        </footer>
      </form>
    </Modal>
  );
}
function CostModal({
  cost,
  onClose,
  onSave,
  error = "",
}: {
  cost?: CostEntry;
  onClose: () => void;
  onSave: (cost: CostEntry) => void;
  error?: string;
}) {
  const today = new Date().toISOString().slice(0, 10);
  const [f, setF] = useState({
    description: cost?.description || "",
    category: cost?.category || ("Estoque" as CostCategory),
    amount: cost ? String(cost.amount).replace(".", ",") : "",
    date: cost?.date || today,
    paymentDate: cost?.paymentDate || today,
    paidBy: cost?.paidBy || "",
    installments: String(cost?.installmentsTotal || 1),
    recurring: cost?.recurring || false,
    notes: cost?.notes || "",
  });
  return (
    <Modal title={cost ? "Editar custo" : "Cadastrar custo"} onClose={onClose}>
      <form
        className="form-grid"
        onSubmit={(e) => {
          e.preventDefault();
          onSave({
            id: cost?.id || uid("c"),
            description: f.description,
            category: f.category,
            amount: Number(f.amount.replace(",", ".")),
            date: f.date,
            paymentDate: f.paymentDate,
            paidBy: f.paidBy.trim(),
            recurring: f.recurring,
            paid: cost?.paid || false,
            paidAt: cost?.paidAt,
            notes: f.notes || undefined,
            installmentNumber: cost?.installmentNumber,
            installmentsTotal: cost?.installmentsTotal,
            installmentGroupId: cost?.installmentGroupId,
            installments: cost ? 1 : Number(f.installments),
          });
        }}
      >
        <label className="wide">
          Descrição
          <input
            required
            value={f.description}
            onChange={(e) => setF({ ...f, description: e.target.value })}
            placeholder="Ex.: Freezer novo"
          />
        </label>
        <label>
          Categoria
          <select
            value={f.category}
            onChange={(e) =>
              setF({ ...f, category: e.target.value as CostCategory })
            }
          >
            {costCategories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <label>
          Valor {Number(f.installments) > 1 ? "de cada parcela" : ""}
          <input
            required
            inputMode="decimal"
            value={f.amount}
            onChange={(e) => setF({ ...f, amount: e.target.value })}
            placeholder="0,00"
          />
        </label>
        <label>
          Data do lançamento
          <input
            required
            type="date"
            value={f.date}
            onChange={(e) => setF({ ...f, date: e.target.value })}
          />
        </label>
        <label>
          Data de pagamento
          <input
            required
            type="date"
            value={f.paymentDate}
            onChange={(e) => setF({ ...f, paymentDate: e.target.value })}
          />
        </label>
        <label className="wide">
          Quem pagou
          <input
            required
            minLength={2}
            maxLength={100}
            value={f.paidBy}
            onChange={(e) => setF({ ...f, paidBy: e.target.value })}
            placeholder="Ex.: Maria, João ou Caixa da empresa"
          />
        </label>
        {!cost && (
          <label>
            Número de parcelas
            <input
              required
              type="number"
              min="1"
              max="120"
              value={f.installments}
              onChange={(e) => setF({ ...f, installments: e.target.value })}
            />
          </label>
        )}
        <label className="check-field">
          <input
            type="checkbox"
            checked={f.recurring}
            onChange={(e) => setF({ ...f, recurring: e.target.checked })}
          />{" "}
          Custo recorrente
        </label>
        <label className="wide">
          Observações
          <input
            value={f.notes}
            onChange={(e) => setF({ ...f, notes: e.target.value })}
            placeholder="Opcional"
          />
        </label>
        {!cost && Number(f.installments) > 1 && (
          <div className="form-note wide">
            Serão criados {f.installments} pagamentos mensais de{" "}
            {money(Number(f.amount.replace(",", ".")) || 0)}, começando em{" "}
            {new Date(`${f.paymentDate}T12:00:00`).toLocaleDateString("pt-BR")}.
          </div>
        )}
        {error && <div className="modal-error wide">{error}</div>}
        <footer className="wide">
          <button type="button" className="ctl-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button className="ctl-primary">
            {cost ? "Salvar alterações" : "Salvar custo"}
          </button>
        </footer>
      </form>
    </Modal>
  );
}
function ConfirmModal({
  title,
  text,
  error = "",
  onClose,
  onConfirm,
}: {
  title: string;
  text: string;
  error?: string;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const [busy, setBusy] = useState(false);
  return (
    <Modal title={title} onClose={onClose}>
      <div className="confirm-dialog">
        <div className="confirm-icon">
          <Trash2 />
        </div>
        <p>{text}</p>
        {error && <div className="modal-error">{error}</div>}
        <footer>
          <button className="ctl-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button
            className="ctl-danger"
            disabled={busy}
            onClick={() => {
              setBusy(true);
              Promise.resolve(onConfirm()).finally(() => setBusy(false));
            }}
          >
            {busy ? "Excluindo..." : "Excluir"}
          </button>
        </footer>
      </div>
    </Modal>
  );
}

function SaleEditModal({
  sale,
  error,
  onClose,
  onSave,
}: {
  sale: import("../../types/controle").Sale;
  error: string;
  onClose: () => void;
  onSave: (payment: import("../../types/controle").Sale["payment"]) => void;
}) {
  const [payment, setPayment] = useState(sale.payment);
  return (
    <Modal title="Editar venda" onClose={onClose}>
      <form
        className="form-grid"
        onSubmit={(e) => {
          e.preventDefault();
          onSave(payment);
        }}
      >
        <label className="wide">
          Forma de pagamento
          <select
            value={payment}
            onChange={(e) => setPayment(e.target.value as typeof payment)}
          >
            <option>Pix</option>
            <option>Dinheiro</option>
            <option>Cartão</option>
          </select>
        </label>
        <div className="modal-summary wide">
          <span>Total da venda</span>
          <strong>{money(sale.total)}</strong>
        </div>
        {error && <div className="modal-error wide">{error}</div>}
        <footer className="wide">
          <button type="button" className="ctl-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button className="ctl-primary">Salvar alterações</button>
        </footer>
      </form>
    </Modal>
  );
}

function ProductEditModal({
  product,
  materials,
  error,
  onClose,
  onSave,
}: {
  product: Product;
  materials: Material[];
  error: string;
  onClose: () => void;
  onSave: (product: Product) => void;
}) {
  const [f, setF] = useState({
    ...product,
    price: String(product.price).replace(".", ","),
    cost: String(product.cost).replace(".", ","),
    stock: String(product.stock),
    minStock: String(product.minStock),
  });
  const [recipe, setRecipe] = useState<RecipeItem[]>(product.recipe || []);
  const [materialId, setMaterialId] = useState(materials[0]?.id || "");
  const [quantity, setQuantity] = useState("");
  const addRecipe = () => {
    const amount = Number(quantity.replace(",", "."));
    if (!materialId || !Number.isFinite(amount) || amount <= 0) return;
    setRecipe((old) => [
      ...old.filter((item) => item.materialId !== materialId),
      { materialId, quantity: amount },
    ]);
    setQuantity("");
  };
  return (
    <Modal title="Editar produto" onClose={onClose}>
      <form
        className="form-grid"
        onSubmit={(e) => {
          e.preventDefault();
          onSave({
            ...product,
            ...f,
            price: Number(f.price.replace(",", ".")),
            cost: Number(f.cost.replace(",", ".")),
            stock: Number(f.stock.replace(",", ".")),
            minStock: Number(f.minStock.replace(",", ".")),
            recipe,
          });
        }}
      >
        <label className="wide">
          Nome do produto
          <input
            required
            value={f.name}
            onChange={(e) => setF({ ...f, name: e.target.value })}
          />
        </label>
        <label>
          Tipo
          <select
            value={f.category}
            onChange={(e) => setF({ ...f, category: e.target.value })}
          >
            <option>Smoothie</option>
            <option>Batida de açaí</option>
            <option>Crepe</option>
            <option>Milk-shake</option>
            <option>Bebida</option>
            <option>Outros</option>
          </select>
        </label>
        <label>
          SKU
          <input
            required
            value={f.sku}
            onChange={(e) => setF({ ...f, sku: e.target.value })}
          />
        </label>
        <label>
          Unidade de venda
          <select
            value={f.unit}
            onChange={(e) => setF({ ...f, unit: e.target.value as Product["unit"] })}
          >
            <option value="un">Unidade</option>
            <option value="kg">Quilograma</option>
            <option value="L">Litro</option>
          </select>
        </label>
        <label>
          Preço de venda
          <input
            required
            inputMode="decimal"
            value={f.price}
            onChange={(e) => setF({ ...f, price: e.target.value })}
          />
        </label>
        <label>
          Custo
          <input
            inputMode="decimal"
            value={f.cost}
            onChange={(e) => setF({ ...f, cost: e.target.value })}
          />
        </label>
        <label>
          Estoque atual
          <input
            required
            min="0"
            step="any"
            type="number"
            inputMode="decimal"
            value={f.stock}
            onChange={(e) => setF({ ...f, stock: e.target.value })}
          />
        </label>
        <label>
          Estoque mínimo
          <input
            required
            min="0"
            step="any"
            type="number"
            inputMode="decimal"
            value={f.minStock}
            onChange={(e) => setF({ ...f, minStock: e.target.value })}
          />
        </label>
        <label className="check-field wide">
          <input
            type="checkbox"
            checked={f.active}
            onChange={(e) => setF({ ...f, active: e.target.checked })}
          />{" "}
          Produto ativo e disponível para venda
        </label>
        <div className="recipe-builder wide">
          <div>
            <span>Receita do produto</span>
            <small>Edite os materiais consumidos por unidade vendida.</small>
          </div>
          {materials.length ? (
            <>
              <div className="recipe-inputs">
                <select
                  value={materialId}
                  onChange={(e) => {
                    const id = e.target.value;
                    setMaterialId(id);
                    const selected = materials.find((m) => m.id === id);
                    setQuantity(selected?.portionEnabled ? String(selected.portionQuantity) : "");
                  }}
                >
                  {materials.map((m) => (
                    <option value={m.id} key={m.id}>{m.name} ({m.unit})</option>
                  ))}
                </select>
                <input
                  inputMode="decimal"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="Quantidade"
                />
                <button type="button" onClick={addRecipe}><Plus /> Adicionar</button>
              </div>
              <div className="recipe-list">
                {recipe.map((item) => {
                  const material = materials.find((m) => m.id === item.materialId);
                  return (
                    <div key={item.materialId}>
                      <span>{material?.name || "Material indisponível"}</span>
                      <b>{item.quantity} {material?.unit}</b>
                      <button type="button" onClick={() => setRecipe((old) => old.filter((i) => i.materialId !== item.materialId))}><X /></button>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="form-note">Nenhum material cadastrado.</div>
          )}
        </div>
        {error && <div className="modal-error wide">{error}</div>}
        <footer className="wide">
          <button type="button" className="ctl-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button className="ctl-primary">Salvar alterações</button>
        </footer>
      </form>
    </Modal>
  );
}

function CategoryModal({
  error,
  onClose,
  onSave,
}: {
  error: string;
  onClose: () => void;
  onSave: (name: string) => void;
}) {
  const [name, setName] = useState("");
  return (
    <Modal title="Nova categoria" onClose={onClose}>
      <form
        className="form-grid"
        onSubmit={(e) => {
          e.preventDefault();
          onSave(name.trim());
        }}
      >
        <label className="wide">
          Nome da categoria
          <input
            autoFocus
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex.: Embalagens"
          />
        </label>
        {error && <div className="modal-error wide">{error}</div>}
        <footer className="wide">
          <button type="button" className="ctl-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button className="ctl-primary">Cadastrar categoria</button>
        </footer>
      </form>
    </Modal>
  );
}

function CategoryDeleteModal({
  categories,
  selected,
  onSelect,
  error,
  onClose,
  onConfirm,
}: {
  categories: StoreData["materialCategories"];
  selected: string;
  onSelect: (id: string) => void;
  error: string;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <Modal title="Gerenciar categorias" onClose={onClose}>
      <div className="confirm-dialog">
        <label>
          Categoria a excluir
          <select value={selected} onChange={(e) => onSelect(e.target.value)}>
            {categories.map((c) => (
              <option value={c.id} key={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <p>
          A categoria só pode ser excluída quando não possuir materiais
          vinculados.
        </p>
        {error && <div className="modal-error">{error}</div>}
        <footer>
          <button className="ctl-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button className="ctl-danger" onClick={onConfirm}>
            Excluir categoria
          </button>
        </footer>
      </div>
    </Modal>
  );
}

function StockEntryModal({
  material,
  error,
  onClose,
  onSave,
}: {
  material: Material;
  error: string;
  onClose: () => void;
  onSave: (quantity: number) => Promise<void>;
}) {
  const [quantity, setQuantity] = useState("");
  const [busy, setBusy] = useState(false);
  const amount = Number(quantity.replace(",", "."));
  return (
    <Modal title="Adicionar estoque" onClose={onClose}>
      <form
        className="form-grid"
        onSubmit={async (e) => {
          e.preventDefault();
          if (!Number.isFinite(amount) || amount <= 0) return;
          setBusy(true);
          try {
            await onSave(amount);
          } finally {
            setBusy(false);
          }
        }}
      >
        <div className="stock-entry-summary wide">
          <span>
            <Package />
          </span>
          <div>
            <small>Material</small>
            <strong>{material.name}</strong>
            <p>
              {material.portionEnabled && material.portionQuantity > 0
                ? `Saldo atual: ${Math.floor(material.stock / material.portionQuantity)} porções (${material.stock} ${material.unit})`
                : `Saldo atual: ${material.stock} ${material.unit}`}
            </p>
          </div>
        </div>
        <label className="wide">
          {material.portionEnabled
            ? `Quantidade de porções repostas`
            : `Quantidade comprada (${material.unit})`}
          <input
            autoFocus
            required
            inputMode="decimal"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder={`Ex.: ${material.unit === "g" || material.unit === "ml" ? "1000" : "10"}`}
          />
          <small className="field-help">
            {material.portionEnabled && material.portionQuantity > 0
              ? `Cada porção corresponde a ${material.portionQuantity} ${material.unit}. `
              : ``}
            O novo saldo será{" "}
            {amount > 0
              ? material.portionEnabled && material.portionQuantity > 0
                ? `${Math.floor(material.stock / material.portionQuantity) + amount} porções (${material.stock + amount * material.portionQuantity} ${material.unit})`
                : `${material.stock + amount} ${material.unit}`
              : `calculado ao informar a quantidade`}
            .
          </small>
        </label>
        {error && <div className="modal-error wide">{error}</div>}
        <footer className="wide">
          <button type="button" className="ctl-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button className="ctl-primary" disabled={busy || amount <= 0}>
            {busy ? "Atualizando..." : "Adicionar ao estoque"}
          </button>
        </footer>
      </form>
    </Modal>
  );
}

function StockBalanceModal({
  material,
  error,
  onClose,
  onSave,
}: {
  material: Material;
  error: string;
  onClose: () => void;
  onSave: (stock: number) => Promise<void>;
}) {
  const [value, setValue] = useState(String(material.stock));
  const [busy, setBusy] = useState(false);
  const stock = Number(value.replace(",", "."));
  return (
    <Modal title="Editar estoque atual" onClose={onClose}>
      <form
        className="form-grid"
        onSubmit={async (e) => {
          e.preventDefault();
          if (!Number.isFinite(stock) || stock < 0) return;
          setBusy(true);
          try {
            await onSave(stock);
          } finally {
            setBusy(false);
          }
        }}
      >
        <div className="form-note wide">
          Informe o saldo total disponível de {material.name}. O valor anterior é {material.stock} {material.unit}.
        </div>
        <label className="wide">
          Estoque atual ({material.unit})
          <input autoFocus required min="0" step="any" type="number" inputMode="decimal" value={value} onChange={(e) => setValue(e.target.value)} />
        </label>
        {error && <div className="modal-error wide">{error}</div>}
        <footer className="wide">
          <button type="button" className="ctl-secondary" onClick={onClose}>Cancelar</button>
          <button className="ctl-primary" disabled={busy || !Number.isFinite(stock) || stock < 0}>{busy ? "Atualizando..." : "Salvar estoque"}</button>
        </footer>
      </form>
    </Modal>
  );
}

function MaterialModal({
  material,
  categories,
  error,
  onClose,
  onSave,
}: {
  material?: Material;
  categories: StoreData["materialCategories"];
  error: string;
  onClose: () => void;
  onSave: (material: Material) => void;
}) {
  const [f, setF] = useState({
    name: material?.name || "",
    categoryId: material?.categoryId || categories[0]?.id || "",
    unit: material?.unit || "g",
    stock: material ? String(material.stock) : "0",
    minStock: material ? String(material.minStock) : "0",
    cost: material ? String(material.cost).replace(".", ",") : "0",
    portionEnabled: material?.portionEnabled || false,
    portionQuantity: material?.portionQuantity
      ? String(material.portionQuantity).replace(".", ",")
      : "",
  });
  return (
    <Modal
      title={material ? "Editar material" : "Cadastrar material"}
      onClose={onClose}
    >
      {categories.length ? (
        <form
          className="form-grid"
          onSubmit={(e) => {
            e.preventDefault();
            onSave({
              id: material?.id || uid("m"),
              name: f.name,
              categoryId: f.categoryId,
              unit: f.unit as Material["unit"],
              stock: Number(f.stock.replace(",", ".")),
              minStock: Number(f.minStock.replace(",", ".")),
              cost: Number(f.cost.replace(",", ".")),
              active: material?.active ?? true,
              portionEnabled: f.portionEnabled,
              portionQuantity: f.portionEnabled
                ? Number(f.portionQuantity.replace(",", "."))
                : 0,
            });
          }}
        >
          <label className="wide">
            Nome do material
            <input
              autoFocus
              required
              value={f.name}
              onChange={(e) => setF({ ...f, name: e.target.value })}
              placeholder="Ex.: Banana, Paçoca ou Copo 500 ml"
            />
          </label>
          <label>
            Categoria
            <select
              required
              value={f.categoryId}
              onChange={(e) => setF({ ...f, categoryId: e.target.value })}
            >
              {categories.map((c) => (
                <option value={c.id} key={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Unidade
            <select
              value={f.unit}
              onChange={(e) =>
                setF({ ...f, unit: e.target.value as Material["unit"] })
              }
            >
              {["un", "g", "ml", "kg", "L"].map((u) => (
                <option key={u}>{u}</option>
              ))}
            </select>
          </label>
          <label>
            {material ? "Estoque atual" : "Estoque inicial"}
            <input
              required
              min="0"
              step="any"
              type="number"
              inputMode="decimal"
              value={f.stock}
              onChange={(e) => setF({ ...f, stock: e.target.value })}
            />
          </label>
          <label>
            Estoque mínimo
            <input
              required
              min="0"
              step="any"
              type="number"
              inputMode="decimal"
              value={f.minStock}
              onChange={(e) => setF({ ...f, minStock: e.target.value })}
            />
          </label>
          <label>
            Custo por unidade
            <input
              inputMode="decimal"
              value={f.cost}
              onChange={(e) => setF({ ...f, cost: e.target.value })}
            />
          </label>
          <label className="check-field wide portion-toggle">
            <input
              type="checkbox"
              checked={f.portionEnabled}
              onChange={(e) => setF({ ...f, portionEnabled: e.target.checked })}
            />{" "}
            Este material utiliza porção padrão
          </label>
          {f.portionEnabled && (
            <label className="wide">
              Quantidade da porção ({f.unit})
              <input
                required
                autoFocus
                inputMode="decimal"
                value={f.portionQuantity}
                onChange={(e) =>
                  setF({ ...f, portionQuantity: e.target.value })
                }
                placeholder="Ex.: 100"
              />
              <small className="field-help">
                Esta quantidade será sugerida automaticamente ao adicionar o
                material a uma receita.
              </small>
            </label>
          )}
          {error && <div className="modal-error wide">{error}</div>}
          <footer className="wide">
            <button type="button" className="ctl-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button className="ctl-primary">
              {material ? "Salvar alterações" : "Cadastrar material"}
            </button>
          </footer>
        </form>
      ) : (
        <div className="confirm-dialog">
          <p>Cadastre uma categoria antes de adicionar materiais ao estoque.</p>
          <footer>
            <button className="ctl-primary" onClick={onClose}>
              Entendi
            </button>
          </footer>
        </div>
      )}
    </Modal>
  );
}

function UserModal({
  title,
  user,
  error,
  onClose,
  onSave,
}: {
  title: string;
  user?: ManagedUser;
  error: string;
  onClose: () => void;
  onSave: (username: string, role: "admin" | "employee") => void;
}) {
  const [username, setUsername] = useState(user?.username || "");
  const [role, setRole] = useState<"admin" | "employee">(
    user?.role === "admin" ? "admin" : "employee",
  );
  return (
    <Modal title={title} onClose={onClose}>
      <form
        className="form-grid"
        onSubmit={(e) => {
          e.preventDefault();
          onSave(username, role);
        }}
      >
        <label className="wide">
          Nome de usuário
          <input
            autoFocus
            required
            minLength={3}
            maxLength={32}
            pattern="[a-z0-9._-]+"
            value={username}
            onChange={(e) =>
              setUsername(e.target.value.toLowerCase().replace(/\s/g, ""))
            }
            placeholder="ex.: joana.silva"
          />
        </label>
        <label className="wide">
          Cargo
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as typeof role)}
          >
            <option value="employee">Funcionário</option>
            <option value="admin">Administrador</option>
          </select>
        </label>
        {!user && (
          <div className="first-access-note wide">
            <b>Primeiro acesso sem senha</b>
            <small>
              O usuário será direcionado para criar uma senha pessoal ao entrar
              pela primeira vez.
            </small>
          </div>
        )}
        {error && <div className="modal-error wide">{error}</div>}
        <footer className="wide">
          <button type="button" className="ctl-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button className="ctl-primary">
            {user ? "Salvar alterações" : "Criar usuário"}
          </button>
        </footer>
      </form>
    </Modal>
  );
}
