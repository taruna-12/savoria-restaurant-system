import React, { useState, useEffect } from 'react';
import { X, Mail, RefreshCw, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

export const EmailLogsModal = ({ isOpen, onClose }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await api.getEmailLogs();
      if (res.success) {
        setLogs(res.logs);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchLogs();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden text-white flex flex-col max-h-[85vh]">

        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-dining-900 to-slate-900 border-b border-amber-800/40 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center">
              <Mail className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-amber-200">Automated Email & Alert Dispatcher</h3>
              <p className="text-xs text-slate-400">Real-time Nodemailer service logs for booking tokens & status updates</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={fetchLogs}
              className="p-2 rounded-lg bg-slate-800 text-amber-300 hover:bg-slate-700"
              title="Refresh logs"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-slate-800 text-slate-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Logs Stream */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {logs.length === 0 ? (
            <div className="text-center py-12 text-slate-500 space-y-2">
              <Send className="w-10 h-10 mx-auto text-slate-600" />
              <p className="text-sm font-semibold">No emails dispatched yet in current session.</p>
              <p className="text-xs">Create a table reservation or update order status to trigger email dispatchers!</p>
            </div>
          ) : (
            logs.map(log => (
              <div
                key={log.id}
                className="p-4 bg-slate-800/80 border border-slate-700/70 rounded-xl space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-amber-300 flex items-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>TO: {log.to}</span>
                  </span>
                  <span className="text-slate-400">{new Date(log.timestamp).toLocaleTimeString()}</span>
                </div>

                <p className="text-sm font-semibold text-white">{log.subject}</p>

                <div className="p-3 bg-slate-950/80 rounded-lg text-xs font-mono text-slate-300 whitespace-pre-wrap border border-slate-800">
                  {log.content}
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span>Type: <strong className="text-amber-200">{log.type}</strong></span>
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-semibold">
                    {log.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 text-white text-xs font-bold rounded-lg hover:bg-slate-700"
          >
            Close Viewer
          </button>
        </div>

      </div>
    </div>
  );
};
