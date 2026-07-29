import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MessageSquare, Send, Mic, FileUp, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function RespondToConcern() {
  const { token } = useParams();
  const [concern, setConcern]     = useState(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [text, setText]           = useState('');
  const [audioFile, setAudioFile] = useState(null);
  const [docFile, setDocFile]     = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/respond/${token}/`)
      .then(r => r.ok ? r.json() : Promise.reject('Invalid link'))
      .then(data => {
        setConcern(data);
        if (data.already_responded) setSubmitted(true);
      })
      .catch(() => setError('This link is invalid or has expired.'))
      .finally(() => setLoading(false));
  }, [token]);

  const handleSubmit = async () => {
    if (!text && !audioFile && !docFile) {
      setError('Please provide at least a text response, audio, or document.');
      return;
    }
    setSubmitting(true);
    setError('');
    const fd = new FormData();
    fd.append('response_text', text);
    if (audioFile)  fd.append('audio_file', audioFile);
    if (docFile)    fd.append('document_file', docFile);

    try {
      const res = await fetch(`${API_BASE}/respond/${token}/`, { method: 'POST', body: fd });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || 'Submission failed');
      }
      setSubmitted(true);
    } catch (e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <RefreshCw size={28} className="animate-spin text-blue-500" />
    </div>
  );

  if (error && !concern) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-md w-full text-center">
        <AlertCircle size={40} className="text-red-400 mx-auto mb-4" />
        <h2 className="text-lg font-bold text-gray-800 mb-2">Invalid Link</h2>
        <p className="text-sm text-gray-500">{error}</p>
      </div>
    </div>
  );

  if (submitted) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-md w-full text-center">
        <CheckCircle2 size={48} className="text-emerald-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-800 mb-2">Response Submitted</h2>
        <p className="text-sm text-gray-500">
          Thank you. Your response has been recorded and will be reviewed by HR.
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full max-w-lg">

        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
          <div className="bg-blue-600 rounded-xl p-2.5">
            <MessageSquare size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-gray-800">HR Concern — Confidential</h1>
            <p className="text-xs text-gray-400">Your response is private and secure</p>
          </div>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Context */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">
              {concern.reason_category} concern
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">{concern.message}</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2.5 rounded-xl">{error}</div>
          )}

          {/* Text response */}
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1.5">
              Your Response
            </label>
            <textarea
              rows={5}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write your response here… This is private and only visible to HR."
              className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 bg-gray-50 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 resize-none"
            />
          </div>

          {/* Audio upload */}
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1.5">
              <Mic size={12} className="inline mr-1" /> Voice / Audio (optional)
            </label>
            <label className="flex items-center gap-3 px-4 py-3 border border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-colors">
              <Mic size={16} className="text-gray-400" />
              <span className="text-sm text-gray-500">{audioFile ? audioFile.name : 'Upload audio file…'}</span>
              <input type="file" accept="audio/*" className="hidden" onChange={(e) => setAudioFile(e.target.files[0])} />
            </label>
          </div>

          {/* Document upload */}
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1.5">
              <FileUp size={12} className="inline mr-1" /> Document (optional)
            </label>
            <label className="flex items-center gap-3 px-4 py-3 border border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-colors">
              <FileUp size={16} className="text-gray-400" />
              <span className="text-sm text-gray-500">{docFile ? docFile.name : 'Upload document…'}</span>
              <input type="file" accept=".pdf,.doc,.docx,.png,.jpg" className="hidden" onChange={(e) => setDocFile(e.target.files[0])} />
            </label>
          </div>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-sm py-3 rounded-xl transition-colors"
          >
            {submitting ? <RefreshCw size={15} className="animate-spin" /> : <Send size={15} />}
            {submitting ? 'Submitting…' : 'Submit Response'}
          </button>

          <p className="text-xs text-gray-400 text-center">
            Your response is confidential. Only authorized HR personnel can view it.
          </p>
        </div>
      </div>
    </div>
  );
}