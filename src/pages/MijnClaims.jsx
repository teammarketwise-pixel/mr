import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import Navbar from '@/components/shared/Navbar';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Clock, AlertCircle, Settings, CheckCircle, Zap, Archive, Upload, Loader2, ArrowRight } from 'lucide-react';
import { format, differenceInDays, parseISO } from 'date-fns';
import { nl } from 'date-fns/locale';

const STATUS_CONFIG = {
  'In behandeling': { icon: Clock, color: 'bg-yellow-100 text-yellow-700', dot: 'bg-yellow-500', msg: 'Uw aanvraag wordt bekeken, wij komen spoedig bij u terug.' },
  'Actie vereist': { icon: AlertCircle, color: 'bg-orange-100 text-orange-700', dot: 'bg-orange-500', msg: 'Upload uw afbeelding en betaal uw factuur om verder te gaan.' },
  'In verwerking': { icon: Settings, color: 'bg-blue-100 text-blue-700', dot: 'bg-blue-500', msg: 'Wij regelen alles, u hoort spoedig van ons.' },
  'Bevestigd': { icon: CheckCircle, color: 'bg-green-100 text-green-700', dot: 'bg-green-500', msg: 'Uw campagne is bevestigd.' },
  'Actief': { icon: Zap, color: 'bg-purple-100 text-purple-700', dot: 'bg-purple-500', msg: 'Uw campagne loopt momenteel.' },
  'Afgelopen': { icon: Archive, color: 'bg-gray-100 text-gray-600', dot: 'bg-gray-400', msg: 'Uw campagne is afgelopen.' },
};

export default function MijnClaims() {
  const [uploading, setUploading] = useState({});

  const { data: claims = [], isLoading, refetch } = useQuery({
    queryKey: ['my-claims'],
    queryFn: async () => {
      const user = await base44.auth.me();
      return base44.entities.Claim.filter({ created_by: user.email }, '-created_date', 50);
    },
  });

  const handleUpload = async (claimId, file) => {
    setUploading(prev => ({ ...prev, [claimId]: true }));
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    await base44.entities.Claim.update(claimId, { campagne_afbeelding_url: file_url });
    setUploading(prev => ({ ...prev, [claimId]: false }));
    refetch();
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-28">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-1">Mijn account</p>
          <h1 className="font-clash text-3xl font-semibold text-[#0F172A]">Mijn Claims</h1>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-[#FFD700]" /></div>
        ) : claims.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <p className="text-gray-400 mb-4">U heeft nog geen claims ingediend.</p>
            <Link to="/planner" className="inline-flex items-center gap-2 bg-[#FFD700] text-[#0F172A] px-6 py-3 rounded-full font-bold text-sm hover:scale-[1.02] transition-all">
              Start AI-Locatie Scan <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {claims.map((claim, i) => (
              <ClaimCard key={claim.id} claim={claim} uploading={uploading[claim.id]} onUpload={(file) => handleUpload(claim.id, file)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ClaimCard({ claim, uploading, onUpload }) {
  const cfg = STATUS_CONFIG[claim.status] || STATUS_CONFIG['In behandeling'];
  const Icon = cfg.icon;

  const today = new Date();
  const startD = claim.bevestigde_startdatum ? parseISO(claim.bevestigde_startdatum) : null;
  const endD = claim.bevestigde_einddatum ? parseISO(claim.bevestigde_einddatum) : null;
  const totalDays = startD && endD ? differenceInDays(endD, startD) : 0;
  const daysGone = startD ? Math.max(0, differenceInDays(today, startD)) : 0;
  const daysLeft = endD ? Math.max(0, differenceInDays(endD, today)) : 0;
  const progress = totalDays > 0 ? Math.min(100, Math.round((daysGone / totalDays) * 100)) : 0;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Status bar */}
      <div className={`px-5 py-3 flex items-center gap-2 ${cfg.color}`}>
        <Icon className="w-4 h-4" />
        <span className="font-semibold text-sm">{claim.status}</span>
        <span className="text-xs opacity-70 ml-2">{cfg.msg}</span>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="font-semibold text-[#0F172A]">{claim.company_name}</p>
            <p className="text-xs text-gray-400 mt-0.5">
              Aangevraagd op {format(parseISO(claim.created_date), 'd MMM yyyy', { locale: nl })}
            </p>
          </div>
          <div className="text-right">
            <p className="font-clash text-xl font-semibold text-[#0F172A]">€{claim.prijs_excl_btw?.toLocaleString('nl-NL')}</p>
            <p className="text-[10px] text-gray-400">excl. BTW · {claim.aantal_weken} {claim.aantal_weken === 1 ? 'week' : 'weken'}</p>
          </div>
        </div>

        {/* Locations */}
        <div className="mt-3 bg-gray-50 rounded-xl p-3">
          <p className="text-xs text-gray-400 mb-1">Geselecteerde locaties:</p>
          <pre className="text-xs text-[#0F172A] whitespace-pre-wrap font-sans">{claim.selected_locations_summary}</pre>
        </div>

        {/* Dates */}
        {(claim.start_datum || claim.bevestigde_startdatum) && (
          <div className="mt-3 flex gap-6 text-sm">
            <div>
              <p className="text-xs text-gray-400">Startdatum</p>
              <p className="font-semibold text-[#0F172A]">
                {format(parseISO(claim.bevestigde_startdatum || claim.start_datum), 'd MMM yyyy', { locale: nl })}
              </p>
            </div>
            {(claim.eind_datum || claim.bevestigde_einddatum) && (
              <div>
                <p className="text-xs text-gray-400">Einddatum</p>
                <p className="font-semibold text-[#0F172A]">
                  {format(parseISO(claim.bevestigde_einddatum || claim.eind_datum), 'd MMM yyyy', { locale: nl })}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Progress bar for Actief */}
        {claim.status === 'Actief' && startD && endD && (
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-400 mb-1.5">
              <span>Gestart op {format(startD, 'd MMM', { locale: nl })}</span>
              <span>{daysLeft} dagen resterend</span>
              <span>Eindigt op {format(endD, 'd MMM', { locale: nl })}</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-[#FFD700] rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        {/* Upload zone voor Actie vereist */}
        {claim.status === 'Actie vereist' && (
          <div className="mt-4 border-2 border-dashed border-[#FFD700]/40 rounded-xl p-4 bg-[#FFD700]/5">
            <p className="text-sm font-semibold text-[#0F172A] mb-1">Upload uw campagneafbeelding</p>
            <p className="text-xs text-gray-400 mb-3">Formaat: JPG of PNG · Min. 1920x1080px · Max. 10MB</p>
            {claim.campagne_afbeelding_url ? (
              <div className="flex items-center gap-2 text-green-600 text-sm">
                <CheckCircle className="w-4 h-4" />
                <span>Afbeelding ontvangen</span>
                <a href={claim.campagne_afbeelding_url} target="_blank" rel="noopener noreferrer" className="underline text-xs">Bekijken</a>
              </div>
            ) : (
              <label className={`inline-flex items-center gap-2 bg-[#FFD700] text-[#0F172A] px-4 py-2 rounded-full text-sm font-bold cursor-pointer hover:scale-[1.02] transition-all ${uploading ? 'opacity-60' : ''}`}>
                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                {uploading ? 'Uploaden...' : 'Kies bestand'}
                <input type="file" accept="image/*" className="hidden" disabled={uploading}
                  onChange={e => { if (e.target.files[0]) onUpload(e.target.files[0]); }} />
              </label>
            )}
          </div>
        )}

        {/* Afgelopen knoppen */}
        {claim.status === 'Afgelopen' && (
          <div className="mt-4 flex gap-3">
            <Link to="/planner" className="flex-1 text-center bg-[#FFD700] text-[#0F172A] py-2.5 rounded-full font-bold text-sm hover:scale-[1.02] transition-all">
              Zoek nieuw bord
            </Link>
          </div>
        )}
      </div>
    </motion.div>
  );
}
