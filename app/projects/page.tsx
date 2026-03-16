import ProjectCard from "@/app/components/ProjectCard";
import Section from "@/app/components/Section";
import { getSiteData } from "@/lib/data";

export default async function ProjectsPage() {
  const siteData = await getSiteData();

  return (
    <div className="min-h-[70vh]">
      <Section
        title="Projects"
        description="Browse a curated selection of recent edits, reels, and client work."
      >
        <div className="grid gap-6 md:grid-cols-2">
          {siteData.projects.map((project) => (
            <ProjectCard
              key={project.id}
              title={project.title}
              description={project.description}
              tags={project.tags}
              videoPath={project.videoPath ?? undefined}
            />
          ))}
        </div>
      </Section>
    </div>
  );
}
