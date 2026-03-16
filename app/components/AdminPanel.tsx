"use client";

import { useEffect, useState } from "react";
import { SiteData, Bio, Project, Experience, Software, VideoItem, Review } from "@/lib/data";

type Tab = "bio" | "projects" | "experience" | "softwares" | "videos" | "upload" | "reviews";

export default function AdminPanel() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [tab, setTab] = useState<Tab>("bio");
  const [siteData, setSiteData] = useState<SiteData | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [uploadState, setUploadState] = useState<"idle" | "uploading" | "done">("idle");

  const loadAuth = async () => {
    try {
      const res = await fetch("/api/auth", { credentials: "include" });
      const data = await res.json();
      setAuthenticated(data.ok === true);
    } catch {
      setAuthenticated(false);
    }
  };

  const loadData = async () => {
    const res = await fetch("/api/site-data", { credentials: "include" });
    if (res.ok) {
      const data = await res.json();
      setSiteData(data);
    }
  };

  useEffect(() => {
    loadAuth();
  }, []);

  useEffect(() => {
    if (authenticated) {
      loadData();
    }
  }, [authenticated]);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const password = String(formData.get("password") ?? "");

    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      setAuthenticated(true);
    } else {
      setAuthenticated(false);
      setMessage("Invalid password. Please try again.");
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth", { method: "DELETE", credentials: "include" });
    setAuthenticated(false);
    setSiteData(null);
    setMessage("Logged out.");
  };

  const handleSave = async (updatedData: SiteData) => {
    const res = await fetch("/api/site-data", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(updatedData),
    });

    if (res.ok) {
      const data = await res.json();
      setSiteData(data);
      setMessage("Saved successfully.");
    } else {
      const error = await res.json();
      setMessage(error.error ?? "Save failed.");
    }
  };

  const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    setUploadState("uploading");
    setMessage(null);

    try {
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) {
        const errorData = await uploadRes.json().catch(() => ({ error: "Upload failed" }));
        setMessage(errorData.error || "Upload failed. Make sure the file is a video under 500MB.");
        setUploadState("idle");
        return;
      }

      const { filePath, title, description } = await uploadRes.json();

      // Add to site data videos
      const updated = {
        ...siteData,
        videos: [
          {
            id: `video-${Date.now()}`,
            title,
            description,
            filePath,
          },
          ...(siteData?.videos ?? []),
        ],
      };

      const updateRes = await fetch("/api/site-data", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(updated),
      });

      if (!updateRes.ok) {
        setMessage("Could not save video entry to site data.");
        setUploadState("idle");
        return;
      }

      const updatedData = await updateRes.json();
      setSiteData(updatedData);
      setMessage("Video uploaded and added to library.");
      setUploadState("done");
      form.reset();
    } catch (error) {
      setMessage("Upload failed. Please try again.");
      setUploadState("idle");
    }
  };

  const tabButton = (value: Tab, label: string) => (
    <button
      type="button"
      onClick={() => setTab(value)}
      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
        tab === value
          ? "bg-white/15 text-white"
          : "text-white/70 hover:bg-white/10"
      }`}
    >
      {label}
    </button>
  );

  if (authenticated === null) {
    return <div className="p-10 text-center text-white/70">Checking authentication…</div>;
  }

  if (!authenticated) {
    return (
      <div className="mx-auto max-w-xl px-6 py-16">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-10">
          <h1 className="text-2xl font-semibold text-white">Admin Login</h1>
          <p className="mt-2 text-sm text-white/70">
            Enter your admin password to update content and upload videos.
          </p>
          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <input
              name="password"
              type="password"
              placeholder="Admin password"
              className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-white/40 focus:outline-none"
            />
            <button
              type="submit"
              className="w-full rounded-full bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
            >
              Log in
            </button>
          </form>
          {message ? (
            <p className="mt-4 text-sm text-rose-300">{message}</p>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-white">Admin Dashboard</h1>
          <p className="mt-2 text-sm text-white/70">
            Manage site content, upload videos, and control what clients see.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {tabButton("bio", "Bio")}
          {tabButton("projects", "Projects")}
          {tabButton("experience", "Experience")}
          {tabButton("softwares", "Softwares")}
          {tabButton("videos", "Videos")}
          {tabButton("reviews", "Reviews")}
          {tabButton("upload", "Upload Video")}
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-full border border-white/15 bg-black/40 px-4 py-2 text-sm font-semibold text-white/70 transition hover:bg-white/10"
          >
            Logout
          </button>
        </div>
      </div>

      {message ? (
        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-amber-100">
          {message}
        </div>
      ) : null}

      <div className="mt-8">
        {tab === "bio" && siteData ? (
          <BioForm bio={siteData.bio} onSave={(updatedBio) => handleSave({ ...siteData, bio: updatedBio })} />
        ) : tab === "projects" && siteData ? (
          <ProjectsForm projects={siteData.projects} onSave={(updatedProjects) => handleSave({ ...siteData, projects: updatedProjects })} />
        ) : tab === "experience" && siteData ? (
          <ExperienceForm experience={siteData.experience} onSave={(updatedExperience) => handleSave({ ...siteData, experience: updatedExperience })} />
        ) : tab === "softwares" && siteData ? (
          <SoftwaresForm softwares={siteData.softwares} onSave={(updatedSoftwares) => handleSave({ ...siteData, softwares: updatedSoftwares })} />
        ) : tab === "videos" && siteData ? (
          <VideosForm videos={siteData.videos} onSave={(updatedVideos) => handleSave({ ...siteData, videos: updatedVideos })} />
        ) : tab === "reviews" && siteData ? (
          <ReviewsForm reviews={siteData.reviews} onSave={(updatedReviews) => handleSave({ ...siteData, reviews: updatedReviews })} />
        ) : tab === "upload" ? (
          <div className="space-y-6">
            <p className="text-sm text-white/70">
              Upload a new video file and add it to the video library. After upload, the video is saved in <code className="rounded bg-white/10 px-1 py-0.5 text-xs text-white/80">/public/uploads</code>.
            </p>
            <form onSubmit={handleUpload} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <input
                  name="title"
                  required
                  placeholder="Video title"
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-white/40 focus:outline-none"
                />
                <input
                  name="description"
                  required
                  placeholder="Short description"
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-white/40 focus:outline-none"
                />
              </div>
              <input
                name="file"
                type="file"

                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-white/40 focus:outline-none"
              />
              <button
                type="submit"
                disabled={uploadState === "uploading"}
                className="rounded-full bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {uploadState === "uploading" ? "Uploading..." : "Upload video"}
              </button>
            </form>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function BioForm({ bio, onSave }: { bio: Bio; onSave: (updated: Bio) => void }) {
  const [formData, setFormData] = useState(bio);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    const uploadFormData = new FormData();
    uploadFormData.append("file", file);
    uploadFormData.append("type", "image");

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData,
      });
      if (res.ok) {
        const data = await res.json();
        setFormData({ ...formData, profilePic: data.imagePath });
      } else {
        alert("Failed to upload image");
      }
    } catch {
      alert("Upload failed");
    }
    setUploading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold text-white">Edit Bio</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-white/40 focus:outline-none"
        />
        <input
          type="text"
          placeholder="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-white/40 focus:outline-none"
        />
      </div>
      <input
        type="text"
        placeholder="Tagline"
        value={formData.tagline}
        onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
        className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-white/40 focus:outline-none"
      />
      <textarea
        placeholder="About"
        value={formData.about}
        onChange={(e) => setFormData({ ...formData, about: e.target.value })}
        rows={4}
        className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-white/40 focus:outline-none"
      />
      <div className="space-y-2">
        <label className="text-sm text-white/70">Profile Picture</label>
        {formData.profilePic && (
          <img src={formData.profilePic} alt="Profile" className="h-20 w-20 rounded-full object-cover" />
        )}
        <input
          type="file"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleImageUpload(file);
          }}
          disabled={uploading}
          className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-white/40 focus:outline-none"
        />
        {uploading && <p className="text-sm text-amber-300">Uploading...</p>}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <input
          type="email"
          placeholder="Email"
          value={formData.contact.email}
          onChange={(e) => setFormData({ ...formData, contact: { ...formData.contact, email: e.target.value } })}
          className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-white/40 focus:outline-none"
        />
        <input
          type="tel"
          placeholder="Phone"
          value={formData.contact.phone}
          onChange={(e) => setFormData({ ...formData, contact: { ...formData.contact, phone: e.target.value } })}
          className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-white/40 focus:outline-none"
        />
      </div>
      <input
        type="url"
        placeholder="Website"
        value={formData.contact.website}
        onChange={(e) => setFormData({ ...formData, contact: { ...formData.contact, website: e.target.value } })}
        className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-white/40 focus:outline-none"
      />
      <div className="space-y-2">
        <label className="text-sm text-white/70">Social Links (one per line, format: name=url)</label>
        <textarea
          placeholder="linkedin=https://linkedin.com/in/yourprofile&#10;instagram=https://instagram.com/yourprofile"
          value={Object.entries(formData.contact.socials).map(([k, v]) => `${k}=${v}`).join('\n')}
          onChange={(e) => {
            const lines = e.target.value.split('\n').filter(l => l.trim());
            const socials: Record<string, string> = {};
            lines.forEach(line => {
              const [k, v] = line.split('=');
              if (k && v) socials[k.trim()] = v.trim();
            });
            setFormData({ ...formData, contact: { ...formData.contact, socials } });
          }}
          rows={3}
          className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-white/40 focus:outline-none"
        />
      </div>
      <button type="submit" className="rounded-full bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/15">
        Save Bio
      </button>
    </form>
  );
}

function ProjectsForm({ projects, onSave }: { projects: Project[]; onSave: (updated: Project[]) => void }) {
  const [list, setList] = useState(projects);

  const addProject = () => {
    setList([...list, { id: `project-${Date.now()}`, title: '', description: '', tags: [], videoPath: '' }]);
  };

  const updateProject = (index: number, field: keyof Project, value: any) => {
    const newList = [...list];
    newList[index] = { ...newList[index], [field]: value };
    setList(newList);
  };

  const removeProject = (index: number) => {
    setList(list.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(list);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Edit Projects</h2>
        <button type="button" onClick={addProject} className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/15">
          Add Project
        </button>
      </div>
      {list.map((project, index) => (
        <div key={project.id} className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Project {index + 1}</h3>
            <button type="button" onClick={() => removeProject(index)} className="text-red-400 hover:text-red-300">Remove</button>
          </div>
          <input
            type="text"
            placeholder="Title"
            value={project.title}
            onChange={(e) => updateProject(index, 'title', e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-white/40 focus:outline-none"
          />
          <textarea
            placeholder="Description"
            value={project.description}
            onChange={(e) => updateProject(index, 'description', e.target.value)}
            rows={3}
            className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-white/40 focus:outline-none"
          />
          <input
            type="text"
            placeholder="Tags (comma separated)"
            value={project.tags.join(', ')}
            onChange={(e) => updateProject(index, 'tags', e.target.value.split(',').map(t => t.trim()))}
            className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-white/40 focus:outline-none"
          />
          <input
            type="text"
            placeholder="Video Path (optional)"
            value={project.videoPath || ''}
            onChange={(e) => updateProject(index, 'videoPath', e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-white/40 focus:outline-none"
          />
        </div>
      ))}
      <button type="submit" className="rounded-full bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/15">
        Save Projects
      </button>
    </form>
  );
}

function ExperienceForm({ experience, onSave }: { experience: Experience[]; onSave: (updated: Experience[]) => void }) {
  const [list, setList] = useState(experience);

  const addExperience = () => {
    setList([...list, { id: `exp-${Date.now()}`, role: '', company: '', period: '', description: '', highlights: [] }]);
  };

  const updateExperience = (index: number, field: keyof Experience, value: any) => {
    const newList = [...list];
    newList[index] = { ...newList[index], [field]: value };
    setList(newList);
  };

  const removeExperience = (index: number) => {
    setList(list.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(list);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Edit Experience</h2>
        <button type="button" onClick={addExperience} className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/15">
          Add Experience
        </button>
      </div>
      {list.map((exp, index) => (
        <div key={exp.id} className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Experience {index + 1}</h3>
            <button type="button" onClick={() => removeExperience(index)} className="text-red-400 hover:text-red-300">Remove</button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <input
              type="text"
              placeholder="Role"
              value={exp.role}
              onChange={(e) => updateExperience(index, 'role', e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-white/40 focus:outline-none"
            />
            <input
              type="text"
              placeholder="Company"
              value={exp.company}
              onChange={(e) => updateExperience(index, 'company', e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-white/40 focus:outline-none"
            />
          </div>
          <input
            type="text"
            placeholder="Period (e.g., 2020 - Present)"
            value={exp.period}
            onChange={(e) => updateExperience(index, 'period', e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-white/40 focus:outline-none"
          />
          <textarea
            placeholder="Description"
            value={exp.description}
            onChange={(e) => updateExperience(index, 'description', e.target.value)}
            rows={3}
            className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-white/40 focus:outline-none"
          />
          <textarea
            placeholder="Highlights (one per line)"
            value={exp.highlights.join('\n')}
            onChange={(e) => updateExperience(index, 'highlights', e.target.value.split('\n').filter(h => h.trim()))}
            rows={4}
            className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-white/40 focus:outline-none"
          />
        </div>
      ))}
      <button type="submit" className="rounded-full bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/15">
        Save Experience
      </button>
    </form>
  );
}

function SoftwaresForm({ softwares, onSave }: { softwares: Software[]; onSave: (updated: Software[]) => void }) {
  const [list, setList] = useState(softwares);

  const addSoftware = () => {
    setList([...list, { id: `sw-${Date.now()}`, name: '', description: '' }]);
  };

  const updateSoftware = (index: number, field: keyof Software, value: string) => {
    const newList = [...list];
    newList[index] = { ...newList[index], [field]: value };
    setList(newList);
  };

  const removeSoftware = (index: number) => {
    setList(list.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(list);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Edit Softwares</h2>
        <button type="button" onClick={addSoftware} className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/15">
          Add Software
        </button>
      </div>
      {list.map((sw, index) => (
        <div key={sw.id} className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Software {index + 1}</h3>
            <button type="button" onClick={() => removeSoftware(index)} className="text-red-400 hover:text-red-300">Remove</button>
          </div>
          <input
            type="text"
            placeholder="Name"
            value={sw.name}
            onChange={(e) => updateSoftware(index, 'name', e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-white/40 focus:outline-none"
          />
          <textarea
            placeholder="Description"
            value={sw.description}
            onChange={(e) => updateSoftware(index, 'description', e.target.value)}
            rows={2}
            className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-white/40 focus:outline-none"
          />
        </div>
      ))}
      <button type="submit" className="rounded-full bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/15">
        Save Softwares
      </button>
    </form>
  );
}

function VideosForm({ videos, onSave }: { videos: VideoItem[]; onSave: (updated: VideoItem[]) => void }) {
  const [list, setList] = useState(videos);

  const addVideo = () => {
    setList([...list, { id: `video-${Date.now()}`, title: '', description: '', filePath: '' }]);
  };

  const updateVideo = (index: number, field: keyof VideoItem, value: string) => {
    const newList = [...list];
    newList[index] = { ...newList[index], [field]: value };
    setList(newList);
  };

  const removeVideo = (index: number) => {
    setList(list.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(list);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Edit Videos</h2>
        <button type="button" onClick={addVideo} className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/15">
          Add Video
        </button>
      </div>
      {list.map((video, index) => (
        <div key={video.id} className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Video {index + 1}</h3>
            <button type="button" onClick={() => removeVideo(index)} className="text-red-400 hover:text-red-300">Remove</button>
          </div>
          <input
            type="text"
            placeholder="Title"
            value={video.title}
            onChange={(e) => updateVideo(index, 'title', e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-white/40 focus:outline-none"
          />
          <textarea
            placeholder="Description"
            value={video.description}
            onChange={(e) => updateVideo(index, 'description', e.target.value)}
            rows={2}
            className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-white/40 focus:outline-none"
          />
          <input
            type="text"
            placeholder="File Path (e.g., /uploads/video.mp4)"
            value={video.filePath}
            onChange={(e) => updateVideo(index, 'filePath', e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-white/40 focus:outline-none"
          />
        </div>
      ))}
      <button type="submit" className="rounded-full bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/15">
        Save Videos
      </button>
    </form>
  );
}

function ReviewsForm({ reviews, onSave }: { reviews: Review[]; onSave: (updated: Review[]) => void }) {
  const [list, setList] = useState(reviews);

  const addReview = () => {
    setList([...list, { id: `review-${Date.now()}`, name: '', rating: 5, comment: '', date: new Date().toISOString() }]);
  };

  const updateReview = (index: number, field: keyof Review, value: any) => {
    const newList = [...list];
    newList[index] = { ...newList[index], [field]: value };
    setList(newList);
  };

  const removeReview = (index: number) => {
    setList(list.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(list);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Edit Reviews</h2>
        <button type="button" onClick={addReview} className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/15">
          Add Review
        </button>
      </div>
      {list.map((review, index) => (
        <div key={review.id} className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Review {index + 1}</h3>
            <button type="button" onClick={() => removeReview(index)} className="text-red-400 hover:text-red-300">Remove</button>
          </div>
          <input
            type="text"
            placeholder="Name"
            value={review.name}
            onChange={(e) => updateReview(index, 'name', e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-white/40 focus:outline-none"
          />
          <input
            type="number"
            placeholder="Rating (1-5)"
            min="1"
            max="5"
            value={review.rating}
            onChange={(e) => updateReview(index, 'rating', parseInt(e.target.value) || 5)}
            className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-white/40 focus:outline-none"
          />
          <textarea
            placeholder="Comment"
            value={review.comment}
            onChange={(e) => updateReview(index, 'comment', e.target.value)}
            rows={3}
            className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-white/40 focus:outline-none"
          />
          <input
            type="date"
            placeholder="Date"
            value={review.date.split('T')[0]}
            onChange={(e) => updateReview(index, 'date', new Date(e.target.value).toISOString())}
            className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-white/40 focus:outline-none"
          />
        </div>
      ))}
      <button type="submit" className="rounded-full bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/15">
        Save Reviews
      </button>
    </form>
  );
}
