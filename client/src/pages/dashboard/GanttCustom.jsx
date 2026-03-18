import { useEffect, useState } from "react";
import { api } from "../../services/api";
import Card from "../../components/ui/Card";

export default function GanttCustom() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    const res = await api.get("/tasks");
    setTasks(res.data.tasks || []);
  }

  function daysBetween(start, end) {
    const ms = new Date(end) - new Date(start);
    return Math.max(1, ms / (1000 * 60 * 60 * 24));
  }

  function offsetFromToday(date) {
    const today = new Date();
    const d = new Date(date);
    return (d - today) / (1000 * 60 * 60 * 24);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-black">Gantt Timeline</h1>

      <Card className="p-4 overflow-x-auto">
        <div className="min-w-[1000px] space-y-4">
          {tasks.map((task) => {
            const start = task.startDate || new Date();
            const end = task.deadline || new Date();

            const width = daysBetween(start, end) * 20;
            const left = offsetFromToday(start) * 20;

            return (
              <div key={task._id} className="space-y-1">
                <div className="text-sm font-semibold">
                  {task.title}
                </div>

                <div className="relative h-6 bg-white/10 rounded-lg overflow-hidden">
                  <div
                    className="absolute h-full rounded-lg bg-[rgb(var(--brand))]"
                    style={{
                      left: `${left}px`,
                      width: `${width}px`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}