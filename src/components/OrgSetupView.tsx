import React, { useState } from 'react';
import { CompanySettings } from '../types';
import { Building, MapPin, Clock, Save, ShieldCheck } from 'lucide-react';

interface OrgSetupViewProps {
  settings: CompanySettings;
  onSaveSettings: (settings: CompanySettings) => void;
}

export const OrgSetupView: React.FC<OrgSetupViewProps> = ({ settings, onSaveSettings }) => {
  const [formData, setFormData] = useState<CompanySettings>({ ...settings });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
          Organization Setup & Business Rules (M2)
        </h1>
        <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-0.5">
          Company configuration parameters applied across all attendance rules, geofence, and payroll
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xs space-y-5 text-xs max-w-3xl">
        {savedSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Settings saved successfully! Stored and applied to subsequent check-ins and cycles.</span>
          </div>
        )}

        <div className="space-y-4">
          <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Building className="w-4 h-4 text-sky-500" />
            General Company Identity
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">Company Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800"
              />
            </div>
            <div>
              <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">Venue Description</label>
              <input
                type="text"
                value={formData.venue_name}
                onChange={(e) => setFormData({ ...formData, venue_name: e.target.value })}
                className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-sky-500" />
            Working Hours & Punctuality Policy (Section 3)
          </h3>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">Office Start Time</label>
              <input
                type="text"
                value={formData.office_start}
                onChange={(e) => setFormData({ ...formData, office_start: e.target.value })}
                className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 font-mono"
              />
            </div>
            <div>
              <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">Grace Period (Minutes)</label>
              <input
                type="number"
                value={formData.grace_minutes}
                onChange={(e) => setFormData({ ...formData, grace_minutes: Number(e.target.value) })}
                className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 font-mono"
              />
            </div>
            <div>
              <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">Half-Day Threshold (Hours)</label>
              <input
                type="number"
                step="0.5"
                value={formData.half_day_hours}
                onChange={(e) => setFormData({ ...formData, half_day_hours: Number(e.target.value) })}
                className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 font-mono"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <MapPin className="w-4 h-4 text-sky-500" />
            Geofence & Office Coordinates (Haversine Formula)
          </h3>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">Latitude</label>
              <input
                type="number"
                step="0.0001"
                value={formData.office_lat}
                onChange={(e) => setFormData({ ...formData, office_lat: Number(e.target.value) })}
                className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 font-mono"
              />
            </div>
            <div>
              <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">Longitude</label>
              <input
                type="number"
                step="0.0001"
                value={formData.office_lng}
                onChange={(e) => setFormData({ ...formData, office_lng: Number(e.target.value) })}
                className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 font-mono"
              />
            </div>
            <div>
              <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">Radius (Meters)</label>
              <input
                type="number"
                value={formData.radius_meters}
                onChange={(e) => setFormData({ ...formData, radius_meters: Number(e.target.value) })}
                className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 font-mono"
              />
            </div>
          </div>
        </div>

        <div className="pt-3 flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-1.5 px-5 py-2 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-lg shadow-xs transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Configuration Rules</span>
          </button>
        </div>
      </form>
    </div>
  );
};
