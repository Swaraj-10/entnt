// src/server.js
import { createServer, Model, Response } from "miragejs";

export function makeServer({ environment = "development" } = {}) {
  return createServer({
    environment,

    models: {
      job: Model,
      candidate: Model,
    },

    seeds(server) {
      // Jobs
      const sampleJobs = [
        { id: "1", title: "Frontend Developer", status: "active", tags: ["Remote"], order: 1 },
        { id: "2", title: "Backend Engineer", status: "active", tags: ["Full-time"], order: 2 },
        { id: "3", title: "Data Analyst", status: "archived", tags: ["Onsite"], order: 3 },
      ];
      sampleJobs.forEach((j) => server.create("job", j));

      // Candidates
      const sampleCandidates = [
        { id: "1", name: "Alice Johnson", role: "Frontend Developer", email: "alice@example.com", status: "active", tags: ["React", "UI"] },
        { id: "2", name: "Bob Smith", role: "Backend Engineer", email: "bob@example.com", status: "archived", tags: ["Node", "API"] },
        { id: "3", name: "Charlie Brown", role: "Data Analyst", email: "charlie@example.com", status: "active", tags: ["SQL", "Excel"] },
      ];
      sampleCandidates.forEach((c) => server.create("candidate", c));
    },

    routes() {
      this.namespace = "api";
      this.timing = 400; // simulate latency

      // ---------------- JOBS ----------------
      this.get("/jobs", (schema, request) => {
        const jobs = schema.jobs.all().models;
        const page = parseInt(request.queryParams.page || "1");
        const pageSize = parseInt(request.queryParams.pageSize || "5");
        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        const totalPages = Math.ceil(jobs.length / pageSize);

        return { jobs: jobs.slice(start, end), totalPages };
      });

      this.get("/jobs/:id", (schema, request) => {
        const job = schema.jobs.find(request.params.id);
        return job ? job.attrs : new Response(404, {}, { error: "Job not found" });
      });

      this.post("/jobs", (schema, request) => {
        const attrs = JSON.parse(request.requestBody);
        const id = String(Date.now());
        const newJob = schema.jobs.create({ ...attrs, id, status: "active" });
        return newJob.attrs;
      });

      this.patch("/jobs/:id", (schema, request) => {
        const job = schema.jobs.find(request.params.id);
        if (!job) return new Response(404, {}, { error: "Job not found" });
        job.update(JSON.parse(request.requestBody));
        return job.attrs;
      });

      this.patch("/jobs/:id/reorder", (schema, request) => {
        const job = schema.jobs.find(request.params.id);
        if (!job) return new Response(404, {}, { error: "Job not found" });
        return { success: true };
      });

      // ---------------- CANDIDATES ----------------
      this.get("/candidates", (schema) => {
        return { candidates: schema.candidates.all().models };
      });

      this.get("/candidates/:id", (schema, request) => {
        const candidate = schema.candidates.find(request.params.id);
        return candidate ? candidate.attrs : new Response(404, {}, { error: "Candidate not found" });
      });

      this.post("/candidates", (schema, request) => {
        const attrs = JSON.parse(request.requestBody);
        const id = String(Date.now());
        const created = schema.candidates.create({ ...attrs, id, status: attrs.status || "active" });
        return created.attrs;
      });

      this.patch("/candidates/:id", (schema, request) => {
        const candidate = schema.candidates.find(request.params.id);
        if (!candidate) return new Response(404, {}, { error: "Candidate not found" });
        candidate.update(JSON.parse(request.requestBody));
        return candidate.attrs;
      });

      this.delete("/candidates/:id", (schema, request) => {
        const candidate = schema.candidates.find(request.params.id);
        if (!candidate) return new Response(404, {}, { error: "Candidate not found" });
        candidate.destroy();
        return { success: true };
      });
    },
  });
}
