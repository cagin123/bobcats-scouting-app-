import { useState } from "react";
import { Search, ChevronUp, ChevronDown, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AppLayout from "@/components/AppLayout";
import PageTransition from "@/components/PageTransition";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Mock rankings data
const mockRankings = [
  { rank: 1, teamNumber: "1234", teamName: "Robot Legends", avgTotal: 60.8, avgAuto: 18.5, avgTeleop: 42.3, climbPct: 85, reliability: 92, defense: 3.2, matchesPlayed: 8 },
  { rank: 2, teamNumber: "5678", teamName: "Mech Warriors", avgTotal: 55.2, avgAuto: 15.2, avgTeleop: 40.0, climbPct: 72, reliability: 88, defense: 4.1, matchesPlayed: 7 },
  { rank: 3, teamNumber: "9012", teamName: "Gear Grinders", avgTotal: 52.1, avgAuto: 12.8, avgTeleop: 39.3, climbPct: 65, reliability: 95, defense: 2.8, matchesPlayed: 8 },
  { rank: 4, teamNumber: "3456", teamName: "Cyber Knights", avgTotal: 48.9, avgAuto: 14.1, avgTeleop: 34.8, climbPct: 80, reliability: 78, defense: 3.5, matchesPlayed: 6 },
  { rank: 5, teamNumber: "7890", teamName: "Iron Eagles", avgTotal: 45.5, avgAuto: 10.2, avgTeleop: 35.3, climbPct: 60, reliability: 85, defense: 4.5, matchesPlayed: 7 },
  { rank: 6, teamNumber: "2345", teamName: "Techno Titans", avgTotal: 42.3, avgAuto: 9.5, avgTeleop: 32.8, climbPct: 55, reliability: 90, defense: 2.2, matchesPlayed: 8 },
  { rank: 7, teamNumber: "6789", teamName: "Circuit Breakers", avgTotal: 38.7, avgAuto: 8.2, avgTeleop: 30.5, climbPct: 45, reliability: 82, defense: 3.8, matchesPlayed: 6 },
  { rank: 8, teamNumber: "1357", teamName: "Robo Rangers", avgTotal: 35.2, avgAuto: 7.8, avgTeleop: 27.4, climbPct: 40, reliability: 75, defense: 4.0, matchesPlayed: 7 },
];

type SortKey = "rank" | "avgTotal" | "avgAuto" | "avgTeleop" | "climbPct" | "reliability" | "defense";

const Rankings = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("rank");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection(key === "rank" ? "asc" : "desc");
    }
  };

  const handleExport = () => {
    toast.success("Exporting rankings to CSV...");
  };

  const filteredRankings = mockRankings
    .filter(
      (team) =>
        team.teamNumber.includes(searchQuery) ||
        team.teamName.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      const aVal = a[sortKey] as number;
      const bVal = b[sortKey] as number;
      return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
    });

  const SortHeader = ({ label, sortKeyName }: { label: string; sortKeyName: SortKey }) => (
    <th
      className="data-cell-header cursor-pointer hover:text-foreground transition-colors whitespace-nowrap"
      onClick={() => handleSort(sortKeyName)}
    >
      <div className="flex items-center gap-1">
        {label}
        {sortKey === sortKeyName && (
          sortDirection === "desc" ? (
            <ChevronDown className="w-3 h-3" />
          ) : (
            <ChevronUp className="w-3 h-3" />
          )
        )}
      </div>
    </th>
  );

  const getRankBadge = (rank: number) => {
    if (rank === 1) return "bg-status-warning text-status-warning-foreground";
    if (rank === 2) return "bg-secondary text-foreground";
    if (rank === 3) return "bg-alliance-red-bg text-alliance-red";
    return "bg-transparent text-muted-foreground";
  };

  return (
    <AppLayout>
      <PageTransition>
      <div className="max-w-6xl mx-auto px-4 py-4 lg:py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h1 className="text-xl font-bold">Rankings</h1>
          <div className="flex items-center gap-3">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search teams..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-10 bg-input border-border"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              className="hidden sm:flex"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Event Info Bar */}
        <div className="flex items-center gap-4 p-4 bg-card rounded-xl mb-4 text-sm">
          <div>
            <span className="text-muted-foreground">Event: </span>
            <span className="font-medium">Regional Championship 2026</span>
          </div>
          <div className="hidden sm:block">
            <span className="text-muted-foreground">Teams: </span>
            <span className="font-mono">{mockRankings.length}</span>
          </div>
          <div className="hidden sm:block">
            <span className="text-muted-foreground">Last Update: </span>
            <span className="font-mono">2 min ago</span>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block card-data overflow-hidden">
          <div className="overflow-x-auto scrollbar-thin">
            <table className="dense-table">
              <thead>
                <tr>
                  <SortHeader label="#" sortKeyName="rank" />
                  <th className="data-cell-header">Team</th>
                  <SortHeader label="Avg Total" sortKeyName="avgTotal" />
                  <SortHeader label="Avg Auto" sortKeyName="avgAuto" />
                  <SortHeader label="Avg Teleop" sortKeyName="avgTeleop" />
                  <SortHeader label="Climb %" sortKeyName="climbPct" />
                  <SortHeader label="Reliability" sortKeyName="reliability" />
                  <SortHeader label="Defense" sortKeyName="defense" />
                  <th className="data-cell-header">MP</th>
                </tr>
              </thead>
              <tbody>
                {filteredRankings.map((team) => (
                  <tr key={team.teamNumber}>
                    <td className="data-cell">
                      <span className={cn(
                        "inline-flex items-center justify-center w-6 h-6 rounded text-xs font-bold",
                        getRankBadge(team.rank)
                      )}>
                        {team.rank}
                      </span>
                    </td>
                    <td className="data-cell">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-semibold">{team.teamNumber}</span>
                        <span className="text-muted-foreground text-sm hidden lg:inline">{team.teamName}</span>
                      </div>
                    </td>
                    <td className="data-cell font-mono font-bold text-primary">{team.avgTotal.toFixed(1)}</td>
                    <td className="data-cell font-mono">{team.avgAuto.toFixed(1)}</td>
                    <td className="data-cell font-mono">{team.avgTeleop.toFixed(1)}</td>
                    <td className="data-cell">
                      <span className={cn(
                        "font-mono",
                        team.climbPct >= 70 ? "text-status-success" : team.climbPct >= 50 ? "text-status-warning" : "text-status-danger"
                      )}>
                        {team.climbPct}%
                      </span>
                    </td>
                    <td className="data-cell">
                      <span className={cn(
                        "font-mono",
                        team.reliability >= 85 ? "text-status-success" : team.reliability >= 70 ? "text-status-warning" : "text-status-danger"
                      )}>
                        {team.reliability}%
                      </span>
                    </td>
                    <td className="data-cell font-mono">{team.defense.toFixed(1)}</td>
                    <td className="data-cell font-mono text-muted-foreground">{team.matchesPlayed}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Card List */}
        <div className="md:hidden mobile-card-list">
          {filteredRankings.map((team) => (
            <div key={team.teamNumber} className="mobile-card-item">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className={cn(
                    "inline-flex items-center justify-center w-8 h-8 rounded text-sm font-bold",
                    getRankBadge(team.rank)
                  )}>
                    {team.rank}
                  </span>
                  <div>
                    <span className="font-mono font-bold text-lg">{team.teamNumber}</span>
                    <div className="text-xs text-muted-foreground">{team.teamName}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-xl font-bold text-primary">{team.avgTotal.toFixed(1)}</div>
                  <div className="text-2xs text-muted-foreground uppercase">Avg Total</div>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2 text-xs pt-2 border-t border-border/50">
                <div className="text-center">
                  <div className="font-mono font-medium">{team.avgAuto.toFixed(1)}</div>
                  <div className="text-muted-foreground">Auto</div>
                </div>
                <div className="text-center">
                  <div className="font-mono font-medium">{team.avgTeleop.toFixed(1)}</div>
                  <div className="text-muted-foreground">Teleop</div>
                </div>
                <div className="text-center">
                  <div className={cn(
                    "font-mono font-medium",
                    team.climbPct >= 70 ? "text-status-success" : team.climbPct >= 50 ? "text-status-warning" : "text-status-danger"
                  )}>
                    {team.climbPct}%
                  </div>
                  <div className="text-muted-foreground">Climb</div>
                </div>
                <div className="text-center">
                  <div className={cn(
                    "font-mono font-medium",
                    team.reliability >= 85 ? "text-status-success" : team.reliability >= 70 ? "text-status-warning" : "text-status-danger"
                  )}>
                    {team.reliability}%
                  </div>
                  <div className="text-muted-foreground">Reliable</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      </PageTransition>
    </AppLayout>
  );
};

export default Rankings;
