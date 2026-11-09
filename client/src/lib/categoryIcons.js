import {
  Briefcase,
  Car,
  CircleEllipsis,
  Clapperboard,
  Gift,
  GraduationCap,
  HeartPulse,
  House,
  Laptop,
  Receipt,
  ShoppingBag,
  TrendingUp,
  UtensilsCrossed,
} from 'lucide-react';

const ICONS = {
  Food: UtensilsCrossed,
  Transport: Car,
  Housing: House,
  Bills: Receipt,
  Shopping: ShoppingBag,
  Health: HeartPulse,
  Entertainment: Clapperboard,
  Education: GraduationCap,
  Salary: Briefcase,
  Freelance: Laptop,
  Gift,
  Investment: TrendingUp,
};

export const getCategoryIcon = (category) => ICONS[category] ?? CircleEllipsis;
