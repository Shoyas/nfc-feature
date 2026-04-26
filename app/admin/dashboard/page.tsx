"use client";

import { useState, useEffect } from "react";
import { 
  Plus, 
  Upload, 
  Tag, 
  BookOpen, 
  BarChart3, 
  Trash2, 
  CheckCircle2,
  AlertCircle,
  Loader2
} from "lucide-react";

export default function AdminDashboard() {
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("");
  const [bracelets, setBracelets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetchBracelets();
  }, []);

  const fetchBracelets = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/bracelet");
      const data = await res.json();
      setBracelets(data);
    } catch (error) {
      console.error("Failed to fetch:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const createBracelet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slug || !category) return;

    try {
      const res = await fetch("/api/bracelet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, category }),
      });

      if (res.ok) {
        setMessage({ type: "success", text: "Bracelet created successfully!" });
        setSlug("");
        setCategory("");
        fetchBracelets();
      } else {
        setMessage({ type: "error", text: "Failed to create bracelet." });
      }
    } catch (error) {
      setMessage({ type: "error", text: "An error occurred." });
    }
  };

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const file = formData.get("file") as File;
    if (!file || file.size === 0) return;

    setIsUploading(true);
    try {
      const res = await fetch("/api/verses/bulk", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setMessage({ type: "success", text: data.message });
        (e.target as HTMLFormElement).reset();
      } else {
        setMessage({ type: "error", text: data.error });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Upload failed." });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] text-[#1A1C21] p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold font-heading">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your NFC bracelets and Bible verses.</p>
          </div>
          
          {message && (
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border animate-in fade-in slide-in-from-top-2 ${
              message.type === "success" ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-700"
            }`}>
              {message.type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              <span className="text-sm font-medium">{message.text}</span>
            </div>
          )}
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard icon={<Tag className="text-blue-600" />} label="Total Bracelets" value={bracelets.length.toString()} />
          <StatCard icon={<BookOpen className="text-purple-600" />} label="Bible Verses" value="Active" />
          <StatCard icon={<BarChart3 className="text-amber-600" />} label="System Status" value="Online" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Forms */}
          <div className="lg:col-span-1 space-y-8">
            {/* Create Bracelet */}
            <section className="bg-white p-6 rounded-2xl border border-border shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <Plus className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold">Add New Bracelet</h2>
              </div>
              <form onSubmit={createBracelet} className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Unique Slug (ID)</label>
                  <input
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="e.g. bracelet-001"
                    className="w-full px-4 py-2 rounded-xl border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="Healing">Healing</option>
                    <option value="Peace">Peace</option>
                    <option value="Identity">Identity</option>
                    <option value="Strength">Strength</option>
                  </select>
                </div>
                <button 
                  type="submit"
                  className="w-full bg-primary text-primary-foreground py-2.5 rounded-xl font-semibold hover:opacity-90 transition-opacity active:scale-[0.98]"
                >
                  Create Bracelet
                </button>
              </form>
            </section>

            {/* Bulk Upload */}
            <section className="bg-white p-6 rounded-2xl border border-border shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <Upload className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold">Bulk Upload Verses</h2>
              </div>
              <p className="text-xs text-muted-foreground mb-4 italic">
                Upload a CSV with "text" and "category" columns.
              </p>
              <form onSubmit={handleUpload} className="space-y-4">
                <div className="border-2 border-dashed border-border rounded-xl p-4 text-center hover:border-primary/50 transition-colors cursor-pointer relative">
                  <input 
                    type="file" 
                    name="file" 
                    accept=".csv"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    required
                  />
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="w-8 h-8 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Click to browse or drag CSV</span>
                  </div>
                </div>
                <button 
                  type="submit"
                  disabled={isUploading}
                  className="w-full bg-[#1A1C21] text-white py-2.5 rounded-xl font-semibold hover:bg-black transition-colors flex items-center justify-center gap-2"
                >
                  {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  {isUploading ? "Uploading..." : "Upload CSV"}
                </button>
              </form>
            </section>
          </div>

          {/* Right Column: Bracelet List */}
          <div className="lg:col-span-2">
            <section className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
              <div className="p-6 border-b border-border flex items-center justify-between">
                <h2 className="text-lg font-semibold">Registered Bracelets</h2>
                <button onClick={fetchBracelets} className="text-xs font-medium text-primary hover:underline">
                  Refresh List
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-muted/30 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      <th className="px-6 py-4">Slug</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Created At</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {isLoading ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-10 text-center">
                          <Loader2 className="w-6 h-6 animate-spin mx-auto text-muted-foreground" />
                        </td>
                      </tr>
                    ) : bracelets.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-10 text-center text-muted-foreground">
                          No bracelets found. Create your first one!
                        </td>
                      </tr>
                    ) : (
                      bracelets.map((b) => (
                        <tr key={b.id} className="hover:bg-muted/10 transition-colors">
                          <td className="px-6 py-4 font-mono text-sm">{b.slug}</td>
                          <td className="px-6 py-4">
                            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                              {b.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">
                            {new Date(b.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button className="text-muted-foreground hover:text-red-600 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-border shadow-sm flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center">
        {icon}
      </div>
      <div>
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-bold text-foreground">{value}</p>
      </div>
    </div>
  );
}