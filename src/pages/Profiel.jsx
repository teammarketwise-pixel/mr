import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import Navbar from '@/components/shared/Navbar';
import { motion } from 'framer-motion';
import {
  LogOut, LayoutDashboard, Pencil, Cpu, Loader2,
  BarChart2, MapPin, Calendar, Clock, CheckCircle, AlertCircle, Settings, Zap, Archive
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { nl } from 'date-fns/locale';

const STATUS_CONFIG = {
  'In behandeling': { icon: Clock, color: 'bg-yellow-100 text-yellow-700' },
  'Actie vereist':  { icon: AlertCircle, color: 'bg-orange-100 text-orange-700' },
  'In verwerking':  { icon: Settings, color: 'bg-blue-100 text-blue-700' },
  'Bevestigd':      { icon: CheckCircle, color: 'bg-green-100 text-green-700' },
  'Actief':         { icon: Zap, color: 'bg-purple-100 text-purple-700' },
  'Afgelopen':      { icon: Archive, color: 'bg-gray-100 text-gray-600' },
};

export default function Profiel() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoadingAuth, logout } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ full_name: '', company_name: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isLoadingAuth && !isAuthenticated) {
      navigate('/toegang');
    }
  }, [isAuthenticated, isLoadingAuth, navigate]);

  useEffect(() => {
    if (user) {
      setForm({
        full_name: user.full_name || '',
        company_name: user.company_name || '',
      });
    }
  }, [user]);

  const { data: claims = [], isLoading: claimsLoading } = useQuery({
    queryKey: ['profiel-claims', user?.email],
    queryFn: () => base44.entities.Claim.filter({ created_by: user.email }, '-created_date', 100),
    enabled: !!user?.email,
  });

  // Stats
  const totalCampagnes = claims.length;
  const totalBorden = claims.reduce((acc, c) => {
    const ids = (c.selected_location_ids || '').split(',').filter(Boolean);
    return acc + ids.length;
  }, 0);
  const totalWeken = claims.reduce((acc, c) => acc + (c.aantal_weken || 0), 0);
  const recentClaim = claims[0] || null;

  const handleSave = async () => {
    setSaving(true);
    await base44.auth.updateMe({ company_name: form.company_name });
    setSaving(false);
    setEditing(false);
  };

  if (isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <Loader2 className="w-7 h-7 animate-spin text-[#FFD700]" />
      </div>
    );
  }

  if (!user) return null;

  const StatusIcon = recentClaim ? (STATUS_CONFIG[recentClaim.status]?.icon || Clock) : null;

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <Navbar />

      <div className="max-w-3xl mx-auto px-6 py-28">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <p className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-1">Mijn account</p>
          <h1 className="font-clash text-3xl font-semibold text-[#0F172A]">
            Welkom{user.full_name ? `, ${user.full_name.split(' ')[0]}` : ''}.
          </h1>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="grid grid-cols-3 gap-4 mb-6"
        >
          {[
            { icon: BarChart2, label: 'Campagnes', value: totalCampagnes, color: 'text-[#FFD700]' },
            { icon: MapPin,    label: 'Borden geclaimd', value: totalBorden, color: 'text-purple-500' },
            { icon: Calendar,  label: 'Weken actief', value: totalWeken, color: 'text-blue-500' },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center">
              <stat.icon className={`w-5 h-5 mx-auto mb-2 ${stat.color}`} />
              <div className="font-clash text-3xl font-semibold text-[#0F172A]">{stat.value}</div>
              <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Profile card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">Profiel</p>
              {!editing ? (
                <>
                  <p className="font-semibold text-[#0F172A] text-lg">{user.full_name || '—'}</p>
                  {user.company_name && <p className="text-gray-500 text-sm">{user.company_name}</p>}
                  <p className="text-gray-400 text-sm mt-0.5">{user.email}</p>
                </>
              ) : (
                <div className="space-y-2 mt-1">
                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-gray-400 block mb-1">Naam</label>
                    <input
                      value={form.full_name}
                      disabled
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
                      placeholder="Naam (via platform beheerd)"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-gray-400 block mb-1">Bedrijfsnaam</label>
                    <input
                      value={form.company_name}
                      onChange={e => setForm(f => ({ ...f, company_name: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
                      placeholder="Uw bedrijf"
                    />
                  </div>
                </div>
              )}
            </div>

            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#0F172A] border border-gray-200 rounded-full px-3 py-1.5 transition-colors"
              >
                <Pencil className="w-3 h-3" /> Aanpassen
              </button>
            ) : (
              <div className="flex gap-2">
                <button onClick={() => setEditing(false)} className="text-xs text-gray-400 hover:text-gray-600 border border-gray-200 rounded-full px-3 py-1.5 transition-colors">Annuleren</button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="text-xs bg-[#FFD700] text-[#0F172A] font-bold rounded-full px-4 py-1.5 hover:scale-[1.02] transition-all disabled:opacity-60 flex items-center gap-1.5"
                >
                  {saving && <Loader2 className="w-3 h-3 animate-spin" />}
                  Opslaan
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4"
        >
          <Link to="/mijn-claims"
            className="flex items-center gap-3 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md hover:-translate-y-0.5 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-[#FFD700]/15 flex items-center justify-center flex-shrink-0">
              <LayoutDashboard className="w-5 h-5 text-[#0F172A]" />
            </div>
            <div>
              <p className="font-semibold text-[#0F172A] text-sm">Mijn campagnes</p>
              <p className="text-xs text-gray-400">Alle statussen & details</p>
            </div>
          </Link>

          <button
            onClick={() => navigate('/planner')}
            className="flex items-center gap-3 bg-[#0F172A] rounded-2xl border border-transparent shadow-sm p-5 hover:shadow-md hover:-translate-y-0.5 transition-all text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-[#FFD700] flex items-center justify-center flex-shrink-0">
              <Cpu className="w-5 h-5 text-[#0F172A]" />
            </div>
            <div>
              <p className="font-semibold text-white text-sm">Nieuwe campagne starten</p>
              <p className="text-xs text-white/40">Ga naar de AI-wizard</p>
            </div>
          </button>
        </motion.div>

        {/* Recent campaign */}
        {!claimsLoading && recentClaim && (
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4"
          >
            <p className="text-xs uppercase tracking-wider text-gray-400 mb-3">Meest recente campagne</p>
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <p className="font-semibold text-[#0F172A]">{recentClaim.company_name || recentClaim.client_name}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {recentClaim.aantal_weken} {recentClaim.aantal_weken === 1 ? 'week' : 'weken'} ·{' '}
                  {recentClaim.selected_location_ids?.split(',').filter(Boolean).length || 0} bord(en)
                </p>
                {(recentClaim.bevestigde_einddatum || recentClaim.eind_datum) && (
                  <p className="text-xs text-gray-400 mt-0.5">
                    Eindigt op {format(parseISO(recentClaim.bevestigde_einddatum || recentClaim.eind_datum), 'd MMM yyyy', { locale: nl })}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 ${STATUS_CONFIG[recentClaim.status]?.color || 'bg-gray-100 text-gray-600'}`}>
                  {StatusIcon && <StatusIcon className="w-3 h-3" />}
                  {recentClaim.status}
                </span>
              </div>
            </div>
            <Link to="/mijn-claims" className="mt-4 inline-flex items-center gap-1 text-xs text-[#0F172A] font-semibold underline underline-offset-2 hover:opacity-70 transition-opacity">
              Bekijk alle campagnes →
            </Link>
          </motion.div>
        )}

        {/* Logout */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <button
            onClick={() => logout()}
            className="flex items-center gap-2 bg-red-50 text-red-600 border border-red-100 px-5 py-3 rounded-2xl text-sm font-semibold hover:bg-red-100 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Uitloggen
          </button>
        </motion.div>

      </div>
    </div>
  );
}
