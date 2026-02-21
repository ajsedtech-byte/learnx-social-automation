"use client";
import { useTier } from "@/context/TierContext";
import { TIERS } from "@/lib/types";
import Header from "@/components/layout/Header";
import RoleSection from "@/components/layout/RoleSection";
import StorybookDash from "@/components/dashboard/StorybookDash";
import ExplorerDash from "@/components/dashboard/ExplorerDash";
import StudioDash from "@/components/dashboard/StudioDash";
import BoardDash from "@/components/dashboard/BoardDash";
import ProDash from "@/components/dashboard/ProDash";
import ParentPage from "@/app/parent/page";
import TeacherPage from "@/app/teacher/page";
import SchoolAdminPage from "@/app/school-admin/page";
import AdminPage from "@/app/admin/page";
import { EmbeddedProvider } from "@/context/EmbeddedContext";

const DASHBOARDS = {
  storybook: StorybookDash,
  explorer: ExplorerDash,
  studio: StudioDash,
  board: BoardDash,
  pro: ProDash,
};

export default function Home() {
  const { tier } = useTier();
  const tierConfig = TIERS[tier];
  const DashComponent = DASHBOARDS[tier];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          {/* Page title */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold flex items-center justify-center gap-3">
              <span className="text-3xl">{tierConfig.emoji}</span>
              {tierConfig.classes}
              <span className="text-slate-500 font-normal text-lg">·</span>
              <span className="text-slate-400 font-medium text-lg">
                {tierConfig.label}
              </span>
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {tierConfig.description}
            </p>
            <p className="text-xs text-slate-600 mt-0.5">
              All user perspectives for this class group
            </p>
          </div>

          {/* Role sections — collapsible accordion */}
          <div className="space-y-4">
            <RoleSection
              label="Student Dashboard"
              emoji="🎓"
              accentColor={tierConfig.accentColor}
              description={`Student view for ${tierConfig.classes} — ${tierConfig.label} tier`}
              badge="Student"
              defaultOpen
            >
              <DashComponent />
            </RoleSection>

            <RoleSection
              label="Parent Dashboard"
              emoji="👨‍👩‍👧"
              accentColor="#2dd4bf"
              description={`Parent monitoring view for a ${tierConfig.classes} student`}
              badge="Parent"
            >
              <EmbeddedProvider>
                <ParentPage />
              </EmbeddedProvider>
            </RoleSection>

            <RoleSection
              label="Teacher Portal"
              emoji="📚"
              accentColor="#f59e0b"
              description="Class analytics, student progress & mistake patterns"
              badge="Teacher"
            >
              <EmbeddedProvider>
                <TeacherPage />
              </EmbeddedProvider>
            </RoleSection>

            <RoleSection
              label="School Admin"
              emoji="🏫"
              accentColor="#ec4899"
              description="KPIs, classes, teachers, students & reports"
              badge="School"
            >
              <EmbeddedProvider>
                <SchoolAdminPage />
              </EmbeddedProvider>
            </RoleSection>

            <RoleSection
              label="Super Admin"
              emoji="👑"
              accentColor="#a855f7"
              description="Platform-wide analytics & system configuration"
              badge="Platform"
            >
              <EmbeddedProvider>
                <AdminPage />
              </EmbeddedProvider>
            </RoleSection>
          </div>
        </div>
      </div>
    </>
  );
}
