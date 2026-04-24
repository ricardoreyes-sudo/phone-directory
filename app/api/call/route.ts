import { NextRequest, NextResponse } from "next/server";

const CLOUDTALK_BASE_URL = "https://my.cloudtalk.io/api";

export async function POST(req: NextRequest) {
  try {
    const { callee } = await req.json();

    if (!callee?.trim()) {
      return NextResponse.json({ error: "Callee phone number is required" }, { status: 400 });
    }

    const apiKeyId = process.env.CLOUDTALK_API_KEY_ID;
    const apiKeySecret = process.env.CLOUDTALK_API_KEY_SECRET;
    const callerExtension = process.env.CLOUDTALK_CALLER_EXTENSION;

    if (!apiKeyId || !apiKeySecret) {
      return NextResponse.json(
        { error: "CloudTalk credentials are not configured on the server" },
        { status: 500 }
      );
    }

    // Build Basic Auth header from API key ID and secret
    const credentials = Buffer.from(`${apiKeyId}:${apiKeySecret}`).toString("base64");

    // CloudTalk Click-to-Call API endpoint
    const response = await fetch(`${CLOUDTALK_BASE_URL}/calls/create.json`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // The phone number to dial (the contact/friend)
        callee: callee.trim(),
        // The internal extension or agent initiating the call (optional, depends on your setup)
        ...(callerExtension && { caller: callerExtension }),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data?.message ?? "CloudTalk API returned an error", details: data },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: `Failed to initiate call: ${message}` }, { status: 500 });
  }
}
