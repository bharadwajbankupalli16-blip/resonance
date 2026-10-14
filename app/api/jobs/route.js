
import { NextResponse } from "next/server";
import { Pool } from "pg";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const globalForJobs = globalThis;

const pool =
  globalForJobs.jobsPool ||
  new Pool({
    connectionString: process.env.DATABASE_URL,
  });

if (process.env.NODE_ENV !== "production") {
  globalForJobs.jobsPool = pool;
}

const seedJobs = [
  {
    id: "seed-1",
    title: "QA Automation Engineer",
    company: "Virtusa",
    location: "Hyderabad",
    experience: "Fresher - 2 Years",
    job_type: "Full Time",
    description:
      "Develop automated test scripts using Selenium, perform testing with JMeter, and collaborate with development teams.",
    skills: "Selenium, JMeter, SDLC, Testing",
    posted_date: "2026-10-10",
    apply_link:
      "https://www.virtusa.com/careers/job-search/global/en/job/VIRVIRGLOBALCREQ264555EXTERNALENGLOBAL/Associate",
  },
  {
    id: "seed-2",
    title: "Autonomy Test Engineer",
    company: "Caterpillar",
    location: "Bangalore / Chennai",
    experience: "Fresher",
    job_type: "Full Time",
    description:
      "Engineering and software testing opportunity focused on autonomy systems.",
    skills: "Engineering, Computer Science, Testing",
    posted_date: "2026-10-10",
    apply_link:
      "https://careers.caterpillar.com/en/jobs/r0000396875/autonomy-test-engineer/",
  },
  {
    id: "seed-3",
    title: "Associate Engineer",
    company: "KPIT",
    location: "Bangalore",
    experience: "Fresher",
    job_type: "Full Time",
    description:
      "Engineering role involving technical documentation and product deliverables.",
    skills: "B.E./B.Tech, Engineering",
    posted_date: "2026-10-10",
    apply_link:
      "https://app.joinsuperset.com/join/#/signup/student?jp=451f5fb6-c3eb-4cee-9828-6f285fe9a131",
  },
  {
    id: "seed-4",
    title: "Associate, Quality Services",
    company: "Amazon",
    location: "Chennai",
    experience: "Fresher",
    job_type: "Full Time",
    description:
      "Manual testing support, execution of documented test instructions, and accurate test reporting.",
    skills: "QA, Testing, Quality Assurance",
    posted_date: "2026-10-10",
    apply_link: "https://www.amazon.jobs/en/jobs/10551844/quality-service-associate",
  },
  {
    id: "seed-5",
    title: "Associate Software Engineer",
    company: "Ford",
    location: "Chennai",
    experience: "Fresher - 2 Years",
    job_type: "Full Time",
    description:
      "Software engineering role involving Java, Spring Boot, REST APIs, SQL, testing, and backend development.",
    skills: "Java, Spring Boot, PostgreSQL, SQL, Kafka, JUnit",
    posted_date: "2026-10-10",
    apply_link:
      "https://www.careers.ford.com/job/chennai/associate-software-engineer/48560/101714131408",
  },
  {
    id: "seed-6",
    title: "Graduate Trainee",
    company: "NTT DATA",
    location: "Bangalore",
    experience: "Fresher",
    job_type: "Full Time",
    description:
      "Entry-level service desk support, request logging, documentation, and incident escalation.",
    skills: "Communication, Documentation, Service Desk",
    posted_date: "2026-10-10",
    apply_link:
      "https://careers.nttdata.com/global/en/job/NTT1GLOBALR148482EXTERNALENGLOBAL/Graduate-Trainee",
  },
  {
    id: "seed-7",
    title: "Operations Analyst",
    company: "ANZ",
    location: "Bangalore",
    experience: "Fresher",
    job_type: "Full Time",
    description:
      "Customer operations and support across digital service channels.",
    skills: "Communication, Customer Service, Operations",
    posted_date: "2026-10-10",
    apply_link: "https://careers.anz.com/job/Bengaluru-Operations-Analyst/1368628966/",
  },
  {
    id: "seed-8",
    title: "Associate Data Engineer",
    company: "TransUnion",
    location: "Pune",
    experience: "Fresher - 2 Years",
    job_type: "Full Time",
    description:
      "Data engineering opportunity with a hybrid work arrangement noted in the supplied listing.",
    skills: "Data Engineering, Data Processing",
    posted_date: "2026-10-10",
    apply_link:
      "https://transunion.wd5.myworkdayjobs.com/en-GB/TransUnion/job/Pune/Associate-Data-Engineer_19041633",
  },
  {
    id: "seed-9",
    title: "TCS National Qualifier Test",
    company: "TCS iON",
    location: "PAN India",
    experience: "Fresher - 2 Years",
    job_type: "Full Time",
    description:
      "National Qualifier Test information for students and early-career candidates.",
    skills: "Aptitude, Domain Skills",
    posted_date: "2026-10-09",
    apply_link: "https://www.tcsion.com/hub/national-qualifier-test/",
  },
  {
    id: "seed-10",
    title: "Process Associate",
    company: "Wipro",
    location: "Kolkata",
    experience: "Fresher",
    job_type: "Full Time",
    description:
      "The supplied listing mentions English communication and typing skills.",
    skills: "Communication, Typing",
    posted_date: "2026-10-09",
    apply_link: "https://careers.wipro.com/job/Kolkata-Process-Associate-IND-700091/207744-en_US/",
  },
];

async function initializeDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS external_jobs_cache (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      company TEXT NOT NULL,
      location TEXT,
      experience TEXT,
      job_type TEXT,
      description TEXT,
      skills TEXT,
      posted_date TEXT,
      apply_link TEXT,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  const countResult = await pool.query(
    "SELECT COUNT(*)::int AS count FROM external_jobs_cache"
  );

  if (countResult.rows[0].count === 0) {
    for (const job of seedJobs) {
      await saveJob(job);
    }
  }
}

async function saveJob(job) {
  const id = String(job.id ?? job.job_id ?? job.jobId ?? "");
  if (!id) return;

  const title = job.job_title || job.title || job.position || "Job title not provided";
  const company = job.company || job.company_name || job.employer || "Company not specified";
  const location = job.location || job.city || "";
  const experience = job.experience || job.experience_required || "";
  const jobType = job.job_type || job.employment_type || job.type || "";
  const description = job.job_description || job.description || "";
  const skills = Array.isArray(job.skills)
    ? job.skills.join(", ")
    : String(job.education_and_skills || job.skills || job.required_skills || "");
  const postedDate = job.posted_date || job.posted_at || job.created_at || "";
  const applyLink = job.apply_link || job.application_url || job.url || job.job_url || "";

  await pool.query(
    `INSERT INTO external_jobs_cache
      (id, title, company, location, experience, job_type, description, skills, posted_date, apply_link, updated_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,NOW())
     ON CONFLICT (id) DO UPDATE SET
       title = EXCLUDED.title,
       company = EXCLUDED.company,
       location = EXCLUDED.location,
       experience = EXCLUDED.experience,
       job_type = EXCLUDED.job_type,
       description = EXCLUDED.description,
       skills = EXCLUDED.skills,
       posted_date = EXCLUDED.posted_date,
       apply_link = EXCLUDED.apply_link,
       updated_at = NOW()`,
    [
      id,
      title,
      company,
      location,
      experience,
      jobType,
      description,
      skills,
      postedDate,
      applyLink,
    ]
  );
}

async function readSavedJobs() {
  const result = await pool.query(`
    SELECT id, title, company, location, experience,
           job_type, description, skills, posted_date, apply_link
    FROM external_jobs_cache
    ORDER BY posted_date DESC NULLS LAST, company ASC
  `);

  return result.rows.map((job) => ({
    ...job,
    job_title: job.title,
    job_description: job.description,
    education_and_skills: job.skills,
  }));
}

export async function GET() {
  try {
    await initializeDatabase();
  } catch (error) {
    console.error("Jobs database initialization failed:", error.message);

    return NextResponse.json(
      {
        error:
          "Could not access PostgreSQL. Check DATABASE_URL and your database connection.",
      },
      { status: 500 }
    );
  }

  const apiKey = process.env.INDIAN_API_KEY;

  if (apiKey) {
    try {
      const response = await fetch("https://jobs.indianapi.in/jobs?limit=10", {
        headers: {
          "X-Api-Key": apiKey,
          Accept: "application/json",
        },
        cache: "no-store",
        signal: AbortSignal.timeout(10000),
      });

      const text = await response.text();
      let data;

      try {
        data = JSON.parse(text);
      } catch {
        data = {};
      }

      if (response.ok) {
        const jobs = Array.isArray(data)
          ? data
          : Array.isArray(data.jobs)
            ? data.jobs
            : Array.isArray(data.data)
              ? data.data
              : [];

        for (const job of jobs) {
          await saveJob(job);
        }

        const savedJobs = await readSavedJobs();

        return NextResponse.json({
          success: true,
          source: "provider_and_database",
          total: savedJobs.length,
          jobs: savedJobs,
        });
      }

      console.warn("Jobs provider returned:", response.status, data);
    } catch (error) {
      console.warn("Jobs provider unavailable:", error.message);
    }
  }

  // Provider failed or returned 429: serve previously saved rows.
  try {
    const jobs = await readSavedJobs();

    return NextResponse.json({
      success: true,
      source: "database_cache",
      cached: true,
      warning:
        "Showing saved listings because fresh jobs could not be retrieved. Check each employer's careers page to confirm the vacancy is still open.",
      total: jobs.length,
      jobs,
    });
  } catch (error) {
    console.error("Could not read saved jobs:", error.message);

    return NextResponse.json(
      { error: "Could not retrieve jobs from PostgreSQL." },
      { status: 500 }
    );
  }
}
