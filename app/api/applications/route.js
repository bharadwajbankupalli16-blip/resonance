
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { db } from "@/lib/db";

export const runtime = "nodejs";

const STATUSES = [
  "Interested",
  "Applied",
  "Interview",
  "Offer",
  "Rejected",
];

async function getUserId(request) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token?.id) return null;

  const userId = Number(token.id);

  return Number.isSafeInteger(userId) && userId > 0
    ? userId
    : null;
}

function errorResponse(error, message) {
  console.error("Applications API error:", error.message);
  return NextResponse.json({ error: message }, { status: 500 });
}

// Read applications belonging to the signed-in user.
export async function GET(request) {
  try {
    const userId = await getUserId(request);

    if (!userId) {
      return NextResponse.json(
        { error: "Please sign in to view applications." },
        { status: 401 }
      );
    }

    
const result = await db.query(
  `SELECT
     a.id,
     COALESCE(a.notes::jsonb ->> 'company', j.company, '') AS company,
     COALESCE(
       a.notes::jsonb ->> 'role',
       j.title,
       'Saved application'
     ) AS role,
     COALESCE(a.notes::jsonb ->> 'location', j.location, '') AS location,
     a.status,
     COALESCE(a.applied_at::date, CURRENT_DATE) AS date
   FROM applications a
   LEFT JOIN jobs j ON j.id = a.job_id
   WHERE a.user_id = $1
   ORDER BY a.applied_at DESC NULLS LAST, a.id DESC`,
  [userId]
);

    

    return NextResponse.json({ applications: result.rows });
  } catch (error) {
    return errorResponse(error, "Unable to load applications.");
  }
}

// Add an application.
export async function POST(request) {
  try {
    const userId = await getUserId(request);

    if (!userId) {
      return NextResponse.json(
        { error: "Please sign in to add applications." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const company =
      typeof body.company === "string" ? body.company.trim() : "";
    const role =
      typeof body.role === "string" ? body.role.trim() : "";
    const location =
      typeof body.location === "string" ? body.location.trim() : "";
    const status = body.status || "Interested";

    const date =
      typeof body.date === "string" &&
      /^\d{4}-\d{2}-\d{2}$/.test(body.date)
        ? body.date
        : null;

    if (
      !company ||
      company.length > 160 ||
      !role ||
      role.length > 160 ||
      location.length > 160 ||
      !STATUSES.includes(status)
    ) {
      return NextResponse.json(
        { error: "Enter valid company, role, location, and status." },
        { status: 400 }
      );
    }

    // Keep company, role, and location in the existing notes column.
    // job_id remains NULL because this form does not select a job record.
    const notes = JSON.stringify({ company, role, location });

    const result = await db.query(
      `INSERT INTO applications
         (user_id, job_id, resume_id, status, applied_at, notes)
       VALUES ($1, NULL, NULL, $2,
               COALESCE($3::date::timestamp, CURRENT_TIMESTAMP), $4)
       RETURNING id, status, applied_at, notes`,
      [userId, status, date, notes]
    );

    return NextResponse.json(
      {
        application: {
          id: String(result.rows[0].id),
          company,
          role,
          location,
          status: result.rows[0].status,
          date: String(result.rows[0].applied_at).slice(0, 10),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    return errorResponse(error, "Unable to add application.");
  }
}

// Update the status of an application owned by the signed-in user.
export async function PATCH(request) {
  try {
    const userId = await getUserId(request);

    if (!userId) {
      return NextResponse.json(
        { error: "Please sign in to update applications." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const id = Number(body.id);
    const status = body.status;

    if (
      !Number.isSafeInteger(id) ||
      id < 1 ||
      !STATUSES.includes(status)
    ) {
      return NextResponse.json(
        { error: "Invalid application ID or status." },
        { status: 400 }
      );
    }

    const result = await db.query(
      `UPDATE applications
       SET status = $1
       WHERE id = $2 AND user_id = $3
       RETURNING id, status`,
      [status, id, userId]
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { error: "Application not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      application: {
        id: String(result.rows[0].id),
        status: result.rows[0].status,
      },
    });
  } catch (error) {
    return errorResponse(error, "Unable to update application.");
  }
}

// Delete only the signed-in user's application.
export async function DELETE(request) {
  try {
    const userId = await getUserId(request);

    if (!userId) {
      return NextResponse.json(
        { error: "Please sign in to delete applications." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get("id"));

    if (!Number.isSafeInteger(id) || id < 1) {
      return NextResponse.json(
        { error: "Invalid application ID." },
        { status: 400 }
      );
    }

    const result = await db.query(
      `DELETE FROM applications
       WHERE id = $1 AND user_id = $2
       RETURNING id`,
      [id, userId]
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { error: "Application not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return errorResponse(error, "Unable to delete application.");
  }
}
