import React, { useState, useEffect } from 'react';

interface StudyPlan {
  topic: string;
  goal: string;
  dueDate: string;
}

export default function StudyPlanner() {
  const [topic, setTopic] = useState('');
  const [goal, setGoal] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [plans, setPlans] = useState<StudyPlan[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('studyPlans');
    console.log('[LOAD] studyPlans from storage:', saved);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        console.log('[PARSED]', parsed);
        if (Array.isArray(parsed)) setPlans(parsed);
      } catch (err) {
        console.error('[ERROR] parsing storage data:', err);
      }
    }
    setLoaded(true);
  }, []);

  // Save only after loaded
  useEffect(() => {
    if (loaded) {
      console.log('[SAVE] plans to storage:', plans);
      localStorage.setItem('studyPlans', JSON.stringify(plans));
    }
  }, [plans, loaded]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic || !goal || !dueDate) return;

    const newPlan = { topic, goal, dueDate };
    console.log('[NEW PLAN]', newPlan);

    setPlans(prev => [...prev, newPlan]);
    setTopic('');
    setGoal('');
    setDueDate('');
  };

  const handleDelete = (index: number) => {
    setPlans(prev => prev.filter((_, i) => i !== index));
  };

  const formatDateDMY = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="bg-white p-6 rounded shadow-md max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-semibold mb-4 text-center">📘 Create Study Plan</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Topic (e.g., Calculus)"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Goal (e.g., Master derivatives)"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
          required
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
        >
          Save Plan
        </button>
      </form>

      <div className="mt-6">
        {plans.length === 0 && (
          <p className="text-center text-gray-500">No plans yet.</p>
        )}
        {plans.map((plan, index) => (
          <div key={index} className="mb-4 p-4 border rounded shadow-sm bg-gray-50">
            <p><strong>Topic:</strong> {plan.topic}</p>
            <p><strong>Goal:</strong> {plan.goal}</p>
            <p><strong>Due Date:</strong> {formatDateDMY(plan.dueDate)}</p>
            <button
              onClick={() => handleDelete(index)}
              className="mt-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
