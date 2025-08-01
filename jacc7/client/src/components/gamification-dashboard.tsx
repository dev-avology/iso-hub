import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Trophy, 
  MessageSquare, 
  Calculator, 
  FileText, 
  Zap, 
  Star,
  TrendingUp,
  Target,
  Award
} from "lucide-react";
import { cn } from "@/lib/utils";

interface UserStats {
  id: string;
  username: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  totalChats: number;
  totalMessages: number;
  calculationsPerformed: number;
  documentsAnalyzed: number;
  proposalsGenerated: number;
  currentStreak: number;
  longestStreak: number;
  totalPoints: number;
  level: number;
  rank: number;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
  isUnlocked: boolean;
  unlockedAt?: Date;
  progress?: {
    current: number;
    required: number;
  };
}

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  subtitle?: string;
  color?: string;
}

function StatCard({ title, value, icon, subtitle, color = "blue" }: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center space-x-3">
          <div className={cn(
            "p-2 rounded-lg",
            color === "blue" && "bg-blue-100 dark:bg-blue-900",
            color === "green" && "bg-green-100 dark:bg-green-900",
            color === "yellow" && "bg-yellow-100 dark:bg-yellow-900",
            color === "purple" && "bg-purple-100 dark:bg-purple-900"
          )}>
            {icon}
          </div>
          <div className="flex-1">
            <div className="text-2xl font-bold">{value.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">{title}</div>
            {subtitle && (
              <div className="text-xs text-muted-foreground mt-1">{subtitle}</div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface LeaderboardEntryProps {
  user: UserStats;
  currentUserId: string;
  position: number;
}

function LeaderboardEntry({ user, currentUserId, position }: LeaderboardEntryProps) {
  const isCurrentUser = user.id === currentUserId;
  
  return (
    <div className={cn(
      "flex items-center space-x-3 p-3 rounded-lg",
      isCurrentUser && "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
    )}>
      <div className="flex-shrink-0">
        <Badge variant={position <= 3 ? "default" : "secondary"} className="w-8 h-8 rounded-full flex items-center justify-center">
          {position <= 3 ? (
            <Trophy className="h-4 w-4" />
          ) : (
            <span className="text-xs font-bold">#{position}</span>
          )}
        </Badge>
      </div>
      
      <Avatar className="h-10 w-10">
        <AvatarImage src={user.profileImageUrl} />
        <AvatarFallback>
          {user.firstName?.[0]}{user.lastName?.[0] || user.username[0]}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium truncate">
            {user.firstName && user.lastName 
              ? `${user.firstName} ${user.lastName}` 
              : user.username}
          </p>
          {isCurrentUser && (
            <Badge variant="outline" className="text-xs">You</Badge>
          )}
        </div>
        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
          <span>Level {user.level}</span>
          <span>{user.totalPoints} pts</span>
          <span>{user.totalChats} chats</span>
        </div>
      </div>
      
      <div className="text-right">
        <div className="text-sm font-semibold">{user.totalPoints}</div>
        <div className="text-xs text-muted-foreground">points</div>
      </div>
    </div>
  );
}

function AchievementCard({ achievement }: { achievement: Achievement }) {
  const rarityColors = {
    common: "border-gray-300 bg-gray-50 dark:bg-gray-900",
    rare: "border-blue-300 bg-blue-50 dark:bg-blue-900",
    epic: "border-purple-300 bg-purple-50 dark:bg-purple-900",
    legendary: "border-yellow-300 bg-yellow-50 dark:bg-yellow-900"
  };

  return (
    <Card className={cn(
      "relative overflow-hidden",
      rarityColors[achievement.rarity],
      !achievement.isUnlocked && "opacity-60"
    )}>
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            {achievement.isUnlocked ? (
              <Award className="h-8 w-8 text-yellow-500" />
            ) : (
              <Target className="h-8 w-8 text-muted-foreground" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h4 className="text-sm font-semibold truncate">{achievement.name}</h4>
              <Badge variant="outline" className="text-xs">
                {achievement.rarity}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mb-2">{achievement.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium">{achievement.points} pts</span>
              {achievement.progress && !achievement.isUnlocked && (
                <div className="flex items-center space-x-2">
                  <Progress 
                    value={(achievement.progress.current / achievement.progress.required) * 100} 
                    className="w-16 h-2"
                  />
                  <span className="text-xs text-muted-foreground">
                    {achievement.progress.current}/{achievement.progress.required}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function GamificationDashboard() {
  const { data: userStats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/user-stats'],
    enabled: true
  });

  const { data: achievements, isLoading: achievementsLoading } = useQuery({
    queryKey: ['/api/achievements'],
    enabled: true
  });

  const { data: leaderboard, isLoading: leaderboardLoading } = useQuery({
    queryKey: ['/api/leaderboard'],
    enabled: true
  });

  if (statsLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-16 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const currentUser = userStats?.user;
  const stats = userStats?.stats;

  return (
    <div className="space-y-6">
      {/* User Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Chats"
            value={stats.totalChats}
            icon={<MessageSquare className="h-5 w-5 text-blue-600" />}
            subtitle="Conversations started"
            color="blue"
          />
          <StatCard
            title="Calculations"
            value={stats.calculationsPerformed}
            icon={<Calculator className="h-5 w-5 text-green-600" />}
            subtitle="Rate calculations"
            color="green"
          />
          <StatCard
            title="Documents"
            value={stats.documentsAnalyzed}
            icon={<FileText className="h-5 w-5 text-purple-600" />}
            subtitle="Documents analyzed"
            color="purple"
          />
          <StatCard
            title="Current Streak"
            value={stats.currentStreak}
            icon={<Zap className="h-5 w-5 text-yellow-600" />}
            subtitle="Days in a row"
            color="yellow"
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Trophy className="h-5 w-5" />
              <span>Recent Achievements</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {achievementsLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-20 bg-muted rounded-lg"></div>
                  </div>
                ))}
              </div>
            ) : achievements && achievements.length > 0 ? (
              <div className="space-y-3">
                {achievements.slice(0, 4).map((achievement: Achievement) => (
                  <AchievementCard key={achievement.id} achievement={achievement} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">
                  Start using JACC to unlock achievements!
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Leaderboard */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Leaderboard</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {leaderboardLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-16 bg-muted rounded-lg"></div>
                  </div>
                ))}
              </div>
            ) : leaderboard && leaderboard.length > 0 ? (
              <div className="space-y-2">
                {leaderboard.slice(0, 5).map((user: UserStats, index: number) => (
                  <LeaderboardEntry
                    key={user.id}
                    user={user}
                    currentUserId={currentUser?.id || ''}
                    position={index + 1}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">
                  No leaderboard data available yet
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}