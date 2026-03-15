import { useEffect, useState } from "react";
import { api } from "../../services/api";
import Card from "../../components/ui/Card";

export default function Leaderboard() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await api.get("/stats/leaderboard");
      setUsers(res.data.users || []);
    })();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black">Leaderboard</h1>

      <div className="space-y-3">
        {users.map((u, i) => (
          <Card key={u._id} className="p-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl brand-gradient text-white grid place-items-center font-black">
                {i + 1}
              </div>
              <div>
                <div className="font-bold">{u.fullName}</div>
                <div className="text-xs text-muted">{u.role}</div>
              </div>
            </div>

            <div className="font-black">{u.points} pts</div>
          </Card>
        ))}
      </div>
    </div>
  );
}