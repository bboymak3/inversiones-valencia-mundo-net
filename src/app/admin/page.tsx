"use client";

import { useState, useEffect, useCallback } from "react";
import {
  LayoutDashboard,
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  LogOut,
  Upload,
  Image as ImageIcon,
  X,
  Eye,
  Star,
  DollarSign,
  Tag,
  Box,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { PRODUCTS, CATEGORIES, type Product, type Category } from "@/data/catalog";

// ============================================================
// STORE SIMPLE (Zustand-like con useState)
// ============================================================
type AdminState = {
  isAuthed: boolean;
  token: string | null;
  products: Product[];
  loading: boolean;
};

const STORAGE_KEY = "ivmn-admin-auth";

export default function AdminPage() {
  const [state, setState] = useState<AdminState>({
    isAuthed: false,
    token: null,
    products: [],
    loading: true,
  });

  // Verificar sesión guardada
  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    if (saved) {
      try {
        const { token } = JSON.parse(saved);
        if (token) {
          setState((s) => ({ ...s, isAuthed: true, token, loading: false }));
          return;
        }
      } catch {}
    }
    setState((s) => ({ ...s, loading: false }));
  }, []);

  // Cargar productos cuando se autentica
  useEffect(() => {
    if (state.isAuthed && state.products.length === 0) {
      setState((s) => ({ ...s, products: [...PRODUCTS] }));
    }
  }, [state.isAuthed, state.products.length]);

  const handleLogin = (token: string) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ token }));
    setState((s) => ({ ...s, isAuthed: true, token }));
  };

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setState({ isAuthed: false, token: null, products: [], loading: false });
  };

  if (state.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-white">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!state.isAuthed) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return <Dashboard products={state.products} setProducts={(p) => setState((s) => ({ ...s, products: p }))} onLogout={handleLogout} />;
}

// ============================================================
// LOGIN
// ============================================================
function LoginForm({ onLogin }: { onLogin: (token: string) => void }) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Bienvenido al panel de administración");
        onLogin(data.token);
      } else {
        toast.error(data.message || "Contraseña incorrecta");
      }
    } catch (err) {
      toast.error("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-900 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="gradient-ivmn px-8 py-10 text-center">
            <img src="/logo.svg" alt="Logo" className="h-16 mx-auto mb-3" />
            <h1 className="text-2xl font-bold text-white">Panel Administrativo</h1>
            <p className="text-emerald-100 text-sm mt-1">Inversiones Valencia Mundo Net</p>
          </div>
          <form onSubmit={handleSubmit} className="p-8 space-y-4">
            <div>
              <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
                Contraseña de administrador
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu contraseña"
                required
                autoFocus
                className="mt-1.5 border-emerald-200 focus-visible:ring-emerald-500"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full gradient-ivmn text-white h-11"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <LayoutDashboard className="h-4 w-4 mr-2" />}
              Ingresar al panel
            </Button>
            <div className="text-xs text-center text-gray-500 bg-emerald-50 rounded-lg p-3 border border-emerald-100">
              <strong>Contraseña por defecto:</strong> valencia2025
              <br />
              <span className="text-gray-400">(cámbiala en producción con la variable ADMIN_PASSWORD)</span>
            </div>
          </form>
        </div>
        <div className="text-center mt-4 text-emerald-100 text-xs">
          © {new Date().getFullYear()} Inversiones Valencia Mundo Net
        </div>
      </div>
    </div>
  );
}

// ============================================================
// DASHBOARD
// ============================================================
type View = "dashboard" | "products";

function Dashboard({
  products,
  setProducts,
  onLogout,
}: {
  products: Product[];
  setProducts: (p: Product[]) => void;
  onLogout: () => void;
}) {
  const [view, setView] = useState<View>("dashboard");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);

  // Stats
  const totalProducts = products.length;
  const featuredCount = products.filter((p) => p.isFeatured).length;
  const lowStock = products.filter((p) => p.stock < 10).length;
  const totalValue = products.reduce((acc, p) => acc + p.price * p.stock, 0);
  const categories = CATEGORIES.length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="bg-white border-b border-emerald-100 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.svg" alt="Logo" className="h-8" />
            <div className="hidden sm:block">
              <div className="text-sm font-bold text-gray-900">Panel Admin</div>
              <div className="text-xs text-gray-500">Inversiones Valencia Mundo Net</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a href="/" target="_blank" className="text-sm text-emerald-700 hover:text-emerald-800 hidden sm:inline">
              Ver tienda →
            </a>
            <Button variant="ghost" size="sm" onClick={onLogout} className="text-red-600 hover:bg-red-50">
              <LogOut className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Salir</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex gap-6">
        {/* Sidebar */}
        <aside className="w-16 lg:w-56 shrink-0">
          <nav className="space-y-1 sticky top-20">
            <Button
              variant={view === "dashboard" ? "default" : "ghost"}
              onClick={() => setView("dashboard")}
              className={`w-full justify-start ${view === "dashboard" ? "gradient-ivmn text-white" : "text-gray-700"}`}
            >
              <LayoutDashboard className="h-4 w-4 lg:mr-2" />
              <span className="hidden lg:inline">Dashboard</span>
            </Button>
            <Button
              variant={view === "products" ? "default" : "ghost"}
              onClick={() => setView("products")}
              className={`w-full justify-start ${view === "products" ? "gradient-ivmn text-white" : "text-gray-700"}`}
            >
              <Package className="h-4 w-4 lg:mr-2" />
              <span className="hidden lg:inline">Productos</span>
              <Badge variant="secondary" className="ml-auto hidden lg:inline">{totalProducts}</Badge>
            </Button>
          </nav>
        </aside>

        {/* Main */}
        <main className="flex-1 min-w-0">
          {view === "dashboard" && (
            <DashboardView
              totalProducts={totalProducts}
              featuredCount={featuredCount}
              lowStock={lowStock}
              totalValue={totalValue}
              categories={categories}
              onGoToProducts={() => setView("products")}
            />
          )}
          {view === "products" && (
            <ProductsView
              products={products}
              setProducts={setProducts}
              onEdit={(p) => {
                setEditingProduct(p);
                setShowProductForm(true);
              }}
              onNew={() => {
                setEditingProduct(null);
                setShowProductForm(true);
              }}
            />
          )}
        </main>
      </div>

      {/* Product form modal */}
      {showProductForm && (
        <ProductForm
          product={editingProduct}
          onClose={() => {
            setShowProductForm(false);
            setEditingProduct(null);
          }}
          onSave={(p) => {
            if (editingProduct) {
              setProducts(products.map((x) => (x.id === p.id ? p : x)));
              toast.success("Producto actualizado (modo demo)");
            } else {
              setProducts([...products, p]);
              toast.success("Producto creado (modo demo)");
            }
            setShowProductForm(false);
            setEditingProduct(null);
          }}
        />
      )}
    </div>
  );
}

// ============================================================
// DASHBOARD VIEW (stats)
// ============================================================
function DashboardView({
  totalProducts,
  featuredCount,
  lowStock,
  totalValue,
  categories,
  onGoToProducts,
}: {
  totalProducts: number;
  featuredCount: number;
  lowStock: number;
  totalValue: number;
  categories: number;
  onGoToProducts: () => void;
}) {
  const stats = [
    { label: "Total productos", value: totalProducts, icon: Package, color: "from-emerald-500 to-emerald-700" },
    { label: "Destacados", value: featuredCount, icon: Star, color: "from-amber-500 to-amber-600" },
    { label: "Stock bajo", value: lowStock, icon: AlertCircle, color: "from-red-500 to-red-600" },
    { label: "Categorías", value: categories, icon: Tag, color: "from-blue-500 to-blue-600" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500">Resumen general del inventario</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} text-white flex items-center justify-center mb-3`}>
              <s.icon className="h-5 w-5" />
            </div>
            <div className="text-3xl font-extrabold text-gray-900">{s.value}</div>
            <div className="text-xs text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Value card */}
      <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-emerald-100 text-sm">Valor total del inventario</div>
            <div className="text-4xl font-extrabold mt-1">${totalValue.toFixed(2)} USD</div>
            <div className="text-emerald-200 text-xs mt-1">Calculado con stock y precios actuales</div>
          </div>
          <DollarSign className="h-16 w-16 text-emerald-300 opacity-50" />
        </div>
      </div>

      {/* Quick actions */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <h3 className="font-bold text-gray-900 mb-4">Acciones rápidas</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <Button onClick={onGoToProducts} className="gradient-ivmn text-white justify-start">
            <Package className="h-4 w-4 mr-2" />
            Gestionar productos
          </Button>
          <Button variant="outline" onClick={onGoToProducts} className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 justify-start">
            <Plus className="h-4 w-4 mr-2" />
            Agregar producto
          </Button>
          <Button variant="outline" asChild className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 justify-start">
            <a href="/" target="_blank">
              <Eye className="h-4 w-4 mr-2" />
              Ver tienda pública
            </a>
          </Button>
        </div>
      </div>

      {/* R2 info */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
        <div className="flex gap-3">
          <ImageIcon className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
          <div className="text-sm">
            <div className="font-bold text-blue-900">Imágenes servidas desde R2</div>
            <div className="text-blue-700 mt-1">
              Las imágenes de productos se almacenan en el bucket <code className="bg-blue-100 px-1 rounded">ivmn-products</code> bajo la ruta <code className="bg-blue-100 px-1 rounded">inversiones-valencia/products/{`{SKU}`}.jpg</code>.
              Sube imágenes desde el botón "Subir imagen" en el formulario de cada producto.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// PRODUCTS VIEW (tabla + búsqueda)
// ============================================================
function ProductsView({
  products,
  setProducts,
  onEdit,
  onNew,
}: {
  products: Product[];
  setProducts: (p: Product[]) => void;
  onEdit: (p: Product) => void;
  onNew: () => void;
}) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [page, setPage] = useState(0);
  const [confirmDelete, setConfirmDelete] = useState<Product | null>(null);
  const pageSize = 20;

  const filtered = products.filter((p) => {
    if (categoryFilter !== "all" && p.categoryId !== categoryFilter) return false;
    if (search) {
      const term = search.toLowerCase();
      return p.name.toLowerCase().includes(term) || p.sku.toLowerCase().includes(term);
    }
    return true;
  });

  const totalPages = Math.ceil(filtered.length / pageSize);
  const current = filtered.slice(page * pageSize, (page + 1) * pageSize);

  const handleDelete = (p: Product) => {
    setProducts(products.filter((x) => x.id !== p.id));
    toast.success(`"${p.name}" eliminado (modo demo)`);
    setConfirmDelete(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Productos</h1>
          <p className="text-sm text-gray-500">{filtered.length} de {products.length} productos</p>
        </div>
        <Button onClick={onNew} className="gradient-ivmn text-white">
          <Plus className="h-4 w-4 mr-2" />
          Nuevo producto
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar por nombre o SKU..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            className="pl-10 border-emerald-200"
          />
        </div>
        <Select value={categoryFilter} onValueChange={(v) => { setCategoryFilter(v); setPage(0); }}>
          <SelectTrigger className="w-full sm:w-56 border-emerald-200">
            <SelectValue placeholder="Todas las categorías" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las categorías</SelectItem>
            {CATEGORIES.map((c) => (
              <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50">
                <TableHead className="w-16">Img</TableHead>
                <TableHead>Producto</TableHead>
                <TableHead className="hidden md:table-cell">Categoría</TableHead>
                <TableHead className="text-right">Precio</TableHead>
                <TableHead className="text-center hidden sm:table-cell">Stock</TableHead>
                <TableHead className="text-center hidden md:table-cell">Destacado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {current.map((p) => {
                const cat = CATEGORIES.find((c) => c.id === p.categoryId);
                return (
                  <TableRow key={p.id} className="hover:bg-emerald-50/30">
                    <TableCell>
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-lg shrink-0"
                        style={{
                          background: `linear-gradient(135deg, ${p.imageColor}22 0%, ${p.imageColor}55 100%)`,
                        }}
                      >
                        {p.imageEmoji}
                      </div>
                    </TableCell>
                    <TableCell className="min-w-0">
                      <div className="font-semibold text-gray-900 text-sm line-clamp-1">{p.name}</div>
                      <div className="text-xs text-gray-500 font-mono">{p.sku}</div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 text-xs">
                        {cat?.name || "—"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-bold text-emerald-700">${p.price.toFixed(2)}</TableCell>
                    <TableCell className="text-center hidden sm:table-cell">
                      <span className={`text-sm font-semibold ${p.stock < 10 ? "text-red-600" : "text-gray-700"}`}>
                        {p.stock}
                      </span>
                    </TableCell>
                    <TableCell className="text-center hidden md:table-cell">
                      {p.isFeatured ? <Star className="h-4 w-4 text-amber-500 fill-amber-500 inline" /> : <span className="text-gray-300">—</span>}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-emerald-700 hover:bg-emerald-100" onClick={() => onEdit(p)}>
                          <Edit2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:bg-red-50" onClick={() => setConfirmDelete(p)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
              {current.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-gray-500">
                    No se encontraron productos
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-gray-100">
            <div className="text-sm text-gray-500">
              Página {page + 1} de {totalPages}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(page - 1)} className="border-emerald-200">
                Anterior
              </Button>
              <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)} className="border-emerald-200">
                Siguiente
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Confirm delete */}
      <Dialog open={!!confirmDelete} onOpenChange={(open) => !open && setConfirmDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Eliminar producto?</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-600">
              Estás por eliminar <strong className="text-gray-900">{confirmDelete?.name}</strong> ({confirmDelete?.sku}).
            </p>
            <p className="text-xs text-amber-600 mt-2">
              ⚠️ Modo demo: el cambio es solo visual. En producción se eliminaría de D1 y la imagen de R2.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDelete(null)}>Cancelar</Button>
            <Button variant="destructive" onClick={() => confirmDelete && handleDelete(confirmDelete)}>
              <Trash2 className="h-4 w-4 mr-1" />
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ============================================================
// PRODUCT FORM (crear/editar + subir imagen a R2)
// ============================================================
function ProductForm({
  product,
  onClose,
  onSave,
}: {
  product: Product | null;
  onClose: () => void;
  onSave: (p: Product) => void;
}) {
  const isEditing = !!product;
  const [form, setForm] = useState<Product>(
    product || {
      id: `prod-custom-${Date.now()}`,
      categoryId: CATEGORIES[0]?.id || "cat-accesorios",
      sku: `IVMN-CUST-${Date.now()}`,
      name: "",
      slug: "",
      shortDescription: "",
      longDescription: "",
      price: 0,
      currency: "USD",
      stock: 0,
      isFeatured: false,
      brand: "Telemaxca",
      model: "",
      imageColor: "#4CAF50",
      imageEmoji: "📦",
      imageR2Key: "",
      specs: [],
      tags: [],
      rating: 0,
      reviewCount: 0,
    }
  );

  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Generar SKU automático
  useEffect(() => {
    if (!isEditing && form.name) {
      const catPrefix = (form.categoryId.replace("cat-", "").slice(0, 4)).toUpperCase();
      const timestamp = Date.now().toString().slice(-6);
      const newSku = `IVMN-${catPrefix}-${timestamp}`;
      setForm((f) => ({ ...f, sku: newSku, imageR2Key: `inversiones-valencia/products/${newSku}.jpg` }));
    }
  }, [form.categoryId, isEditing]); // eslint-disable-line

  const handleUploadImage = async (file: File) => {
    if (!form.sku) {
      toast.error("Primero guarda el SKU");
      return;
    }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("sku", form.sku);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.success) {
        toast.success("Imagen subida a R2");
        setImagePreview(data.data.url);
        setForm((f) => ({ ...f, imageR2Key: data.data.r2Key }));
      } else {
        toast.error(data.message || "Error al subir imagen");
      }
    } catch (err) {
      toast.error("Error de conexión al subir imagen");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("El nombre es requerido");
      return;
    }
    if (form.price <= 0) {
      toast.error("El precio debe ser mayor a 0");
      return;
    }
    // Generar slug si está vacío
    if (!form.slug) {
      form.slug = form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 50);
    }
    onSave(form);
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isEditing ? <Edit2 className="h-5 w-5 text-emerald-600" /> : <Plus className="h-5 w-5 text-emerald-600" />}
            {isEditing ? "Editar producto" : "Nuevo producto"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Imagen + SKU */}
          <div className="grid sm:grid-cols-[120px_1fr] gap-4">
            <div>
              <Label className="text-xs font-semibold text-gray-700">Imagen del producto</Label>
              <div className="mt-1.5 aspect-square rounded-xl border-2 border-dashed border-emerald-200 hover:border-emerald-400 transition-colors flex flex-col items-center justify-center overflow-hidden bg-emerald-50/50">
                {imagePreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center p-2">
                    <div className="text-3xl mb-1">{form.imageEmoji}</div>
                    <Label htmlFor="img-upload" className="text-xs text-emerald-700 cursor-pointer font-semibold">
                      {uploading ? "Subiendo..." : "Subir a R2"}
                    </Label>
                  </div>
                )}
                <input
                  id="img-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleUploadImage(f);
                  }}
                  disabled={uploading}
                />
              </div>
              <p className="text-[10px] text-gray-500 mt-1 text-center">Bucket: ivmn-products</p>
            </div>
            <div className="space-y-3">
              <div>
                <Label htmlFor="sku" className="text-xs font-semibold text-gray-700">SKU</Label>
                <Input
                  id="sku"
                  value={form.sku}
                  onChange={(e) => setForm({ ...form, sku: e.target.value })}
                  className="mt-1 font-mono text-sm border-emerald-200"
                  placeholder="IVMN-XXXX-0001"
                />
              </div>
              <div>
                <Label htmlFor="r2key" className="text-xs font-semibold text-gray-700">R2 Key</Label>
                <Input
                  id="r2key"
                  value={form.imageR2Key}
                  onChange={(e) => setForm({ ...form, imageR2Key: e.target.value })}
                  className="mt-1 font-mono text-xs border-emerald-200"
                  readOnly
                />
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="border-emerald-200 text-emerald-700"
                  onClick={() => document.getElementById("img-upload")?.click()}
                  disabled={uploading}
                >
                  {uploading ? <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" /> : <Upload className="h-3.5 w-3.5 mr-1" />}
                  Subir imagen
                </Button>
                {imagePreview && (
                  <Button type="button" variant="ghost" size="sm" onClick={() => setImagePreview(null)}>
                    <X className="h-3.5 w-3.5 mr-1" />
                    Quitar
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Nombre */}
          <div>
            <Label htmlFor="name" className="text-sm font-semibold text-gray-700">Nombre *</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="mt-1 border-emerald-200"
              placeholder="Ej: Cámara IP WiFi 1080p"
              required
              autoFocus
            />
          </div>

          {/* Categoría + Marca */}
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <Label className="text-sm font-semibold text-gray-700">Categoría *</Label>
              <Select value={form.categoryId} onValueChange={(v) => setForm({ ...form, categoryId: v })}>
                <SelectTrigger className="mt-1 border-emerald-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="brand" className="text-sm font-semibold text-gray-700">Marca</Label>
              <Input
                id="brand"
                value={form.brand}
                onChange={(e) => setForm({ ...form, brand: e.target.value })}
                className="mt-1 border-emerald-200"
              />
            </div>
          </div>

          {/* Precio + Stock + CompareAt */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <Label htmlFor="price" className="text-sm font-semibold text-gray-700">Precio USD *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })}
                className="mt-1 border-emerald-200"
                required
              />
            </div>
            <div>
              <Label htmlFor="compare" className="text-sm font-semibold text-gray-700">Precio antes</Label>
              <Input
                id="compare"
                type="number"
                step="0.01"
                min="0"
                value={form.compareAtPrice || ""}
                onChange={(e) => setForm({ ...form, compareAtPrice: parseFloat(e.target.value) || undefined })}
                className="mt-1 border-emerald-200"
                placeholder="Opcional"
              />
            </div>
            <div>
              <Label htmlFor="stock" className="text-sm font-semibold text-gray-700">Stock</Label>
              <Input
                id="stock"
                type="number"
                min="0"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: parseInt(e.target.value) || 0 })}
                className="mt-1 border-emerald-200"
              />
            </div>
          </div>

          {/* Descripciones */}
          <div>
            <Label htmlFor="short" className="text-sm font-semibold text-gray-700">Descripción corta</Label>
            <Input
              id="short"
              value={form.shortDescription}
              onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
              className="mt-1 border-emerald-200"
              placeholder="Aparece en la tarjeta del producto"
            />
          </div>
          <div>
            <Label htmlFor="long" className="text-sm font-semibold text-gray-700">Descripción larga</Label>
            <Textarea
              id="long"
              value={form.longDescription}
              onChange={(e) => setForm({ ...form, longDescription: e.target.value })}
              className="mt-1 border-emerald-200 resize-none"
              rows={3}
              placeholder="Descripción detallada del producto"
            />
          </div>

          {/* Emoji + Color */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="emoji" className="text-sm font-semibold text-gray-700">Emoji (placeholder)</Label>
              <Input
                id="emoji"
                value={form.imageEmoji}
                onChange={(e) => setForm({ ...form, imageEmoji: e.target.value })}
                className="mt-1 border-emerald-200 text-xl"
                maxLength={4}
              />
            </div>
            <div>
              <Label htmlFor="color" className="text-sm font-semibold text-gray-700">Color (placeholder)</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="color"
                  type="color"
                  value={form.imageColor}
                  onChange={(e) => setForm({ ...form, imageColor: e.target.value })}
                  className="w-16 h-10 p-1 border border-emerald-200 rounded"
                />
                <Input
                  value={form.imageColor}
                  onChange={(e) => setForm({ ...form, imageColor: e.target.value })}
                  className="flex-1 border-emerald-200 font-mono text-sm"
                />
              </div>
            </div>
          </div>

          {/* Destacado */}
          <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl">
            <Switch
              checked={form.isFeatured}
              onCheckedChange={(c) => setForm({ ...form, isFeatured: c })}
              id="featured"
            />
            <Label htmlFor="featured" className="text-sm font-semibold text-gray-700 cursor-pointer">
              <Star className="h-3.5 w-3.5 inline mr-1 text-amber-500" />
              Producto destacado (aparece primero)
            </Label>
          </div>

          {/* Tags */}
          <div>
            <Label htmlFor="tags" className="text-sm font-semibold text-gray-700">Etiquetas (separadas por coma)</Label>
            <Input
              id="tags"
              value={form.tags.join(", ")}
              onChange={(e) => setForm({ ...form, tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) })}
              className="mt-1 border-emerald-200"
              placeholder="al mayor, catalogo, oferta"
            />
          </div>
        </form>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSubmit} className="gradient-ivmn text-white">
            <CheckCircle2 className="h-4 w-4 mr-1" />
            {isEditing ? "Guardar cambios" : "Crear producto"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
