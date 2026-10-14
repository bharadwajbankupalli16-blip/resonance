
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { tool, role, content, jobDescription = "" } =
      await request.json();

    const allowedTools = ["summary", "bullet", "skills"];

    if (!allowedTools.includes(tool)) {
      return NextResponse.json(
        { error: "Please select a valid writing tool." },
        { status: 400 }
      );
    }

    if (
      typeof role !== "string" ||
      typeof content !== "string" ||
      !role.trim() ||
      !content.trim()
    ) {
      return NextResponse.json(
        { error: "Enter your target job role and resume information." },
        { status: 400 }
      );
    }

    if (
      role.length > 150 ||
      content.length > 10000 ||
      typeof jobDescription !== "string" ||
      jobDescription.length > 10000
    ) {
      return NextResponse.json(
        { error: "Please shorten your input and try again." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "The AI service is not configured on the server." },
        { status: 500 }
      );
    }

    const instructions = {
      summary:
        "Write a concise professional resume summary for the target role. Use only facts supported by the supplied information. Do not invent experience, qualifications, or achievements.",

      bullet:
        "Improve the supplied resume or project bullet points. Use clear action verbs and professional language. Never invent metrics, results, or responsibilities.",

      skills:
        "Compare the supplied skills with the target role and job description. List relevant matches, potential gaps, and useful keywords. Clearly distinguish suggested skills from skills the candidate already has. Never claim the candidate has a skill without evidence."
    };

    const prompt = `
You are a careful resume-writing assistant.

Task: ${instructions[tool]}
Target role: ${role}

Resume information and existing skills:
${content}

Job description:
${jobDescription || "Not provided"}

Return clear, useful plain text. Do not invent facts.
`;

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 700,
          },
        }),
        signal: AbortSignal.timeout(30000),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API request failed:", response.status);

      return NextResponse.json(
        { error: "The AI service could not complete the request. Check your API configuration and usage limits." },
        { status: 502 }
      );
    }

    const result = data.candidates?.[0]?.content?.parts
      ?.map((part) => part.text || "")
      .join("")
      .trim();

    if (!result) {
      return NextResponse.json(
        { error: "The AI returned no text. Please try again." },
        { status: 502 }
      );
    }

    return NextResponse.json({ result });
  } catch (error) {
    console.error("AI writing route failed:", error.message);

    return NextResponse.json(
      { error: "Unable to reach the AI service. Please try again." },
      { status: 500 }
    );
  }
}



