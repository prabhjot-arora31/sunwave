import {
  IndianRupee,
  Landmark,
  ShieldCheck,
  Wrench,
  Leaf,
  Clock,
  Home,
  Building2,
  Factory,
  Zap,
  BatteryCharging,
  Blend,
  BadgeCheck,
  Layers,
  ClipboardCheck,
  MapPin,
  FileText,
  ClipboardList,
  Ruler,
  Gauge,
  MonitorSmartphone,
  PanelTop,
  Cpu,
  BatteryFull,
  Layers3,
  Cable,
  type LucideIcon,
} from "lucide-react";

const icons: Record<string, LucideIcon> = {
  IndianRupee,
  Landmark,
  ShieldCheck,
  Wrench,
  Leaf,
  Clock,
  Home,
  Building2,
  Factory,
  Zap,
  BatteryCharging,
  Blend,
  BadgeCheck,
  Layers,
  ClipboardCheck,
  MapPin,
  FileText,
  ClipboardList,
  Ruler,
  Gauge,
  MonitorSmartphone,
  PanelTop,
  Cpu,
  BatteryFull,
  Layers3,
  Cable,
};

export default function DynamicIcon({
  name,
  className = "h-6 w-6",
}: {
  name: string;
  className?: string;
}) {
  const Icon = icons[name] ?? ShieldCheck;
  return <Icon className={className} />;
}
