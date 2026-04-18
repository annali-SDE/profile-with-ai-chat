import { NextResponse } from 'next/server';

type ChatMessage = {
	role: 'user' | 'assistant' | 'system';
	content: string;
};

const DIGITAL_TWIN_SYSTEM_PROMPT = `
You are Anna Li's digital twin assistant on her portfolio website.

Mission:
- Answer questions about Anna Li's career, skills, background, and work style.
- Sound professional, concise, confident, and warm.
- If asked about details not in profile context, say you do not have that exact detail and suggest how to contact Anna.

Profile context:
- Name: Anna Li
- Title: Full Stack Software Development Engineer
- Summary: 5+ years building software solutions for enterprise customers.
- Core stack: TypeScript, JavaScript, Python, Django, React, Next.js, Node.js, PostgreSQL, MySQL, Tailwind CSS, Jenkins.
- Languages: Mandarin (native/bilingual), English (professional working), Chinese (native/bilingual).

Experience timeline:
- INRIX (Software Development Engineer, Sep 2021 - Jan 2024, Los Angeles):
  Built data-driven applications from scratch, automated manual workflows, improved data handling, conducted testing, code reviews, demos, and cross-team collaboration.
- 2G Digital (Full Stack Developer, Aug 2018 - Sep 2021, Burbank):
  Designed and maintained internal applications, delivered end-to-end tests, drove workflow improvements, and shipped features independently.
- Coding Dojo (Full Stack Web Developer Student, Jan 2018 - Aug 2018):
  Completed immersive 1000+ hour bootcamp with React, Angular, Django, Node.js, Ruby, SQL/NoSQL.
- Earlier experience includes product, account, and marketing roles (LULUTRIP, KCAL Insurance, D2America).

Education:
- University of South Florida, Master's in Finance (2011 - 2014)

Behavior:
- Keep answers factual and grounded in this context.
- For recruiting-style questions, emphasize enterprise readiness, full-stack ownership, and collaborative execution.
`.trim();

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'openai/gpt-oss-120b';

export async function POST(req: Request) {
	try {
		const body = (await req.json()) as { messages?: ChatMessage[] };
		const incomingMessages = body.messages?.filter(
			(message) =>
				(message.role === 'user' || message.role === 'assistant') &&
				typeof message.content === 'string' &&
				message.content.trim().length > 0
		);

		if (!incomingMessages || incomingMessages.length === 0) {
			return NextResponse.json(
				{ error: 'Please send at least one message.' },
				{ status: 400 }
			);
		}

		const apiKey =
			process.env.OPENROUTER_AOI_KEY ??
			process.env.OPENROUTER_API_KEY ??
			process.env.OPENROUTER_KEY;

		if (!apiKey) {
			return NextResponse.json(
				{ error: 'OpenRouter API key not configured on server.' },
				{ status: 500 }
			);
		}

		const response = await fetch(OPENROUTER_URL, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${apiKey}`,
				'Content-Type': 'application/json',
				'HTTP-Referer': 'http://localhost:3000',
				'X-Title': 'Anna Li Digital Twin Site'
			},
			body: JSON.stringify({
				model: MODEL,
				messages: [
					{ role: 'system', content: DIGITAL_TWIN_SYSTEM_PROMPT },
					...incomingMessages
				],
				temperature: 0.5,
				max_tokens: 500
			})
		});

		if (!response.ok) {
			const errorText = await response.text();
			return NextResponse.json(
				{
					error: 'OpenRouter request failed.',
					details: errorText
				},
				{ status: 502 }
			);
		}

		const data = (await response.json()) as {
			choices?: Array<{ message?: { content?: string } }>;
		};

		const reply = data.choices?.[0]?.message?.content?.trim();
		if (!reply) {
			return NextResponse.json(
				{ error: 'Model returned an empty response.' },
				{ status: 502 }
			);
		}

		return NextResponse.json({ reply });
	} catch {
		return NextResponse.json(
			{ error: 'Unable to process chat request.' },
			{ status: 500 }
		);
	}
}
