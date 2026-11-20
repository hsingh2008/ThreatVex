import React, { useState } from 'react';
import { CheckCircle2, Circle, ShieldCheck } from 'lucide-react';

const INITIAL_TASKS = [
  { id: 't1', text: 'Enable Multi-Factor Authentication (2FA) via Authenticator App on primary email and banking accounts', done: true },
  { id: 't2', text: 'Never click on shortened links in unsolicited text messages claiming KYC expiration', done: true },
  { id: 't3', text: 'Ensure home router admin password is changed from the factory default', done: false },
  { id: 't4', text: 'Remember that receiving UPI money never requires entering a UPI PIN', done: true },
  { id: 't5', text: 'Audit your most important passwords to ensure 14+ characters of entropy', done: false },
];

export const SecurityChecklist: React.FC = () => {
  const [tasks, setTasks] = useState(INITIAL_TASKS);

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const completedCount = tasks.filter(t => t.done).length;

  return (
    <div className="p-6 rounded-2xl bg-navy-900 border border-navy-800 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">
            Daily Digital Hygiene Checklist
          </h3>
        </div>
        <span className="text-xs font-mono text-teal-electric">
          {completedCount} / {tasks.length} Complete
        </span>
      </div>

      <div className="space-y-2.5">
        {tasks.map((task) => (
          <div
            key={task.id}
            onClick={() => toggleTask(task.id)}
            className="flex items-start gap-3 p-3 rounded-xl bg-navy-950 border border-navy-800/80 cursor-pointer hover:bg-navy-850/50 transition-colors select-none"
          >
            {task.done ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            ) : (
              <Circle className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
            )}
            <span className={`text-xs leading-relaxed ${task.done ? 'text-slate-400 line-through' : 'text-slate-200'}`}>
              {task.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
