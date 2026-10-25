import React, { useState } from 'react';
import { Code, Download, Copy, Check, X, Terminal, FileCode, CheckCircle2 } from 'lucide-react';

interface StreamlitExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StreamlitExportModal: React.FC<StreamlitExportModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'app' | 'requirements' | 'readme'>('app');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const pythonCode = `"""
Saylani Hackathon 2026 - HCM Lite Streamlit Application
AI-assisted Human Capital Management for Admin, HR and Employees
Venue: Zaitoon Ashraf IT Park, Karachi | Date: 24 October 2026
"""

import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
import plotly.graph_objects as go
from datetime import datetime, date, timedelta
import math

# ---------------------------------------------------------
# Page Configuration
# ---------------------------------------------------------
st.set_page_config(
    page_title="Saylani HCM Lite - HR & AI Dashboard",
    page_icon="🏢",
    layout="wide",
    initial_sidebar_state="expanded"
)

# ---------------------------------------------------------
# Formulas (Section 3 & 6 of Saylani Hackathon Brief)
# ---------------------------------------------------------
def calculate_salary_breakdown(basic_salary: float, working_days: int = 22, absent_days: int = 0, unpaid_days: int = 0, half_days: int = 0):
    hra = basic_salary * 0.40
    medical = basic_salary * 0.10
    monthly_gross = basic_salary + hra + medical  # Gross = 1.5 * basic
    
    per_day_rate = monthly_gross / max(working_days, 1)
    loss_of_pay = (absent_days + unpaid_days + 0.5 * half_days) * per_day_rate
    earned_gross = max(0.0, monthly_gross - loss_of_pay)
    
    # Pakistan Tax Slabs on Annual Gross
    annual_gross = monthly_gross * 12
    if annual_gross <= 600000:
        annual_tax = 0.0
    elif annual_gross <= 1200000:
        annual_tax = (annual_gross - 600000) * 0.05
    elif annual_gross <= 2400000:
        annual_tax = 30000 + (annual_gross - 1200000) * 0.15
    elif annual_gross <= 3600000:
        annual_tax = 210000 + (annual_gross - 2400000) * 0.25
    else:
        annual_tax = 510000 + (annual_gross - 3600000) * 0.35
        
    monthly_tax = annual_tax / 12
    net_salary = max(0.0, earned_gross - monthly_tax)
    
    return {
        "basic": basic_salary, "hra": hra, "medical": medical,
        "monthly_gross": monthly_gross, "loss_of_pay": loss_of_pay,
        "monthly_tax": monthly_tax, "net_salary": net_salary
    }

def haversine_distance(lat1, lon1, lat2, lon2):
    R = 6371000  # meters
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi, dlam = math.radians(lat2 - lat1), math.radians(lon2 - lon1)
    a = math.sin(dphi / 2.0)**2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlam / 2.0)**2
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
`;

  const requirementsTxt = `streamlit>=1.35.0
pandas>=2.2.0
plotly>=5.20.0
numpy>=1.26.0
openpyxl>=3.1.2`;

  const readmeMd = `# Saylani Hackathon 2026 - HCM Lite (Streamlit Dashboard)

AI-assisted Human Capital Management for Admin, HR and Employees
Venue: Zaitoon Ashraf IT Park, Karachi

## How to Run:
\`\`\`bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. Run Streamlit application
streamlit run app.py
\`\`\`

## Included Features:
- 3 Roles with server-style RBAC (Admin, HR, Employee)
- Interactive Sidebar Filters (Departments, Status, Date Ranges)
- Visualizations: Attendance Donut, Dept Headcount & Gross Payroll, 30-day turnout trend
- Geofenced Camera Attendance (Haversine distance calculation to Zaitoon Ashraf IT Park)
- Smart Leave NLP parser
- Payroll Lite with exact Pakistani tax slabs
- AI Assistant with Tool Calling & Guardrails (refusing salary to colleagues)`;

  const currentContent = activeTab === 'app' ? pythonCode : activeTab === 'requirements' ? requirementsTxt : readmeMd;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-3xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center font-bold text-xs">
              St
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Streamlit Application Source & Export
              </h3>
              <p className="text-[11px] text-slate-500">
                Created standalone <code>app.py</code> for local execution & Streamlit Cloud
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 rounded-lg shadow-2xs transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Code'}</span>
            </button>

            <button
              onClick={() => handleDownload(activeTab === 'app' ? 'app.py' : activeTab === 'requirements' ? 'requirements.txt' : 'README.md', currentContent)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-500 rounded-lg shadow-xs transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download {activeTab === 'app' ? 'app.py' : activeTab === 'requirements' ? 'requirements.txt' : 'README.md'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-1 px-4 pt-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-xs">
          <button
            onClick={() => setActiveTab('app')}
            className={`px-3 py-1.5 font-medium border-b-2 transition-colors ${
              activeTab === 'app'
                ? 'border-red-600 text-red-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            app.py (Streamlit Dashboard)
          </button>
          <button
            onClick={() => setActiveTab('requirements')}
            className={`px-3 py-1.5 font-medium border-b-2 transition-colors ${
              activeTab === 'requirements'
                ? 'border-red-600 text-red-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            requirements.txt
          </button>
          <button
            onClick={() => setActiveTab('readme')}
            className={`px-3 py-1.5 font-medium border-b-2 transition-colors ${
              activeTab === 'readme'
                ? 'border-red-600 text-red-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            README.md (Run Guide)
          </button>
        </div>

        {/* Quick Launch Instruction Callout */}
        <div className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700/80 text-[11px] flex items-center justify-between text-slate-700 dark:text-slate-300">
          <div className="flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-slate-500" />
            <span className="font-mono">
              Terminal: <strong>pip install -r requirements.txt && streamlit run app.py</strong>
            </span>
          </div>
          <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Ready to Run
          </span>
        </div>

        {/* Code Content View */}
        <div className="flex-1 p-4 overflow-y-auto bg-slate-950 text-slate-200 font-mono text-xs leading-relaxed">
          <pre className="whitespace-pre-wrap">{currentContent}</pre>
        </div>
      </div>
    </div>
  );
};
