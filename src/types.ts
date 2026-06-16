export type TabType = 
  | 'dashboard' 
  | 'idea-gen' 
  | 'seo-gen' 
  | 'script-gen' 
  | 'viral-score' 
  | 'thumbnail-analyzer'
  | 'analytics'
  | 'content-planner'
  | 'trending'
  | 'ai-coach'
  | 'gamification'
  | 'saved-projects'
  | 'profile'
  | 'admin-panel'
  | 'subscriptions';

export interface VideoIdea {
  title: string;
  hook: string;
  targetAudience: string;
  viralPotential: number;
  competition: 'Low' | 'Medium' | 'High';
  engagementRating: 'Outstanding' | 'Very High' | 'High' | 'Steady';
}

export interface CreatorChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
}
