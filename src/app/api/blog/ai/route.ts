import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { HfInference } from "@huggingface/inference";

const HF_MODEL_CATALOG_URL = "https://huggingface.co/inference/models";
const HF_USAGE_SETTING_KEY = "ai_blog_hf_usage_metrics_v1";
const OLLAMA_DEFAULT_BASE_URL = "http://127.0.0.1:11434";
const OLLAMA_MODEL_CANDIDATES = ["llama3.2:3b", "mistral:latest", "gemma2:2b"];
const OLLAMA_DEFAULT_TIMEOUT_MS = 230000;
const TITLE_STYLE_GUIDES = [
    "data-driven and analytical",
    "bold and market-focused",
    "practical farm-operations focused",
    "innovation-led but grounded in real agriculture use-cases",
];

type HfModelCandidate = {
    model: string;
    provider: "hf-inference" | "auto";
    priority: number;
    pricing: {
        inputPerMTokens: string;
        outputPerMTokens: string;
    };
    note: string;
};

type UsageCounters = {
    requests: number;
    success: number;
    failed: number;
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    rateLimitErrors: number;
    permissionErrors: number;
    billingErrors: number;
    parseErrors: number;
};

type UsageMetrics = {
    version: 1;
    lastUpdatedAt: string;
    totals: UsageCounters;
    daily: Record<string, UsageCounters>;
    lastAttempt: {
        at: string;
        status: "success" | "error";
        model?: string;
        provider?: string;
        httpStatus?: number;
        error?: string;
    } | null;
};

type BlogAiPayload = {
    title: string;
    excerpt: string;
    category: string;
    content: string;
    readTime: string;
};

type GenerationUsage = {
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
};

type SelectedModel = {
    provider: "ollama" | "huggingface";
    model: string;
    providerRoute?: string;
};

const HUGGING_FACE_FALLBACK_MODELS: HfModelCandidate[] = [
    {
        model: "katanemo/Arch-Router-1.5B",
        provider: "hf-inference",
        priority: 1,
        pricing: { inputPerMTokens: "-", outputPerMTokens: "-" },
        note: "hf-inference route with no listed per-token price on public model catalog.",
    },
    {
        model: "HuggingFaceTB/SmolLM3-3B",
        provider: "hf-inference",
        priority: 2,
        pricing: { inputPerMTokens: "-", outputPerMTokens: "-" },
        note: "hf-inference route with no listed per-token price on public model catalog.",
    },
    {
        model: "mistralai/Mistral-7B-Instruct-v0.2",
        provider: "auto",
        priority: 3,
        pricing: { inputPerMTokens: "0.2", outputPerMTokens: "0.2" },
        note: "Open-source model on external providers (e.g. Together) and may consume credits.",
    },
];

function getErrorMessage(error: unknown): string {
    if (!error) return "Unknown error";
    if (error instanceof Error) return error.message;
    return String(error);
}

function getHttpStatusFromError(error: any): number | undefined {
    return error?.httpResponse?.status;
}

function getHttpBodyError(error: any): string {
    return String(error?.httpResponse?.body?.error || "");
}

function isHfPermissionError(error: unknown): boolean {
    const msg = getErrorMessage(error).toLowerCase();
    const bodyError = getHttpBodyError(error).toLowerCase();

    return (
        msg.includes("sufficient permissions to call inference providers") ||
        bodyError.includes("sufficient permissions to call inference providers") ||
        msg.includes("make calls to the serverless inference api") ||
        bodyError.includes("make calls to the serverless inference api") ||
        msg.includes("hugging face token missing permission") ||
        msg.includes("inference providers")
    );
}

function isHfRateLimitError(error: unknown): boolean {
    const msg = getErrorMessage(error).toLowerCase();
    const bodyError = getHttpBodyError(error).toLowerCase();
    const status = getHttpStatusFromError(error);

    return (
        status === 429 ||
        msg.includes("rate limit") ||
        bodyError.includes("rate limit") ||
        msg.includes("too many requests") ||
        bodyError.includes("too many requests")
    );
}

function isHfBillingError(error: unknown): boolean {
    const msg = getErrorMessage(error).toLowerCase();
    const bodyError = getHttpBodyError(error).toLowerCase();
    const status = getHttpStatusFromError(error);

    return (
        status === 402 ||
        msg.includes("insufficient credits") ||
        bodyError.includes("insufficient credits") ||
        msg.includes("payment") ||
        bodyError.includes("payment")
    );
}

function todayKey() {
    return new Date().toISOString().slice(0, 10);
}

function emptyCounters(): UsageCounters {
    return {
        requests: 0,
        success: 0,
        failed: 0,
        promptTokens: 0,
        completionTokens: 0,
        totalTokens: 0,
        rateLimitErrors: 0,
        permissionErrors: 0,
        billingErrors: 0,
        parseErrors: 0,
    };
}

function defaultMetrics(): UsageMetrics {
    return {
        version: 1,
        lastUpdatedAt: new Date().toISOString(),
        totals: emptyCounters(),
        daily: {},
        lastAttempt: null,
    };
}

function ensureDaily(metrics: UsageMetrics, day: string) {
    if (!metrics.daily[day]) {
        metrics.daily[day] = emptyCounters();
    }
    return metrics.daily[day];
}

function parseMetrics(rawValue?: string | null): UsageMetrics {
    if (!rawValue) return defaultMetrics();
    try {
        const parsed = JSON.parse(rawValue);
        const base = defaultMetrics();
        return {
            ...base,
            ...parsed,
            totals: { ...base.totals, ...(parsed?.totals || {}) },
            daily: parsed?.daily && typeof parsed.daily === "object" ? parsed.daily : {},
            lastAttempt: parsed?.lastAttempt || null,
        };
    } catch {
        return defaultMetrics();
    }
}

async function readMetrics(): Promise<UsageMetrics> {
    try {
        const row = await prisma.globalSetting.findUnique({
            where: { key: HF_USAGE_SETTING_KEY },
            select: { value: true },
        });
        return parseMetrics(row?.value);
    } catch {
        return defaultMetrics();
    }
}

async function saveMetrics(metrics: UsageMetrics) {
    const payload = JSON.stringify({
        ...metrics,
        version: 1,
        lastUpdatedAt: new Date().toISOString(),
    });
    await prisma.globalSetting.upsert({
        where: { key: HF_USAGE_SETTING_KEY },
        update: { value: payload },
        create: { key: HF_USAGE_SETTING_KEY, value: payload },
    });
}

function applyAttemptCounters(
    metrics: UsageMetrics,
    day: string,
    status: "success" | "error",
    usage?: { prompt_tokens?: number; completion_tokens?: number; total_tokens?: number } | null,
    errorKind?: "rate_limit" | "permission" | "billing" | "parse" | "other"
) {
    const daily = ensureDaily(metrics, day);
    metrics.totals.requests += 1;
    daily.requests += 1;

    if (status === "success") {
        metrics.totals.success += 1;
        daily.success += 1;
    } else {
        metrics.totals.failed += 1;
        daily.failed += 1;
    }

    const promptTokens = Number(usage?.prompt_tokens || 0);
    const completionTokens = Number(usage?.completion_tokens || 0);
    const totalTokens = Number(usage?.total_tokens || 0);

    metrics.totals.promptTokens += promptTokens;
    metrics.totals.completionTokens += completionTokens;
    metrics.totals.totalTokens += totalTokens;
    daily.promptTokens += promptTokens;
    daily.completionTokens += completionTokens;
    daily.totalTokens += totalTokens;

    if (errorKind === "rate_limit") {
        metrics.totals.rateLimitErrors += 1;
        daily.rateLimitErrors += 1;
    }
    if (errorKind === "permission") {
        metrics.totals.permissionErrors += 1;
        daily.permissionErrors += 1;
    }
    if (errorKind === "billing") {
        metrics.totals.billingErrors += 1;
        daily.billingErrors += 1;
    }
    if (errorKind === "parse") {
        metrics.totals.parseErrors += 1;
        daily.parseErrors += 1;
    }
}

function summarizeMetrics(metrics: UsageMetrics) {
    const day = todayKey();
    const today = ensureDaily(metrics, day);
    return {
        day,
        today,
        totals: metrics.totals,
        lastAttempt: metrics.lastAttempt,
    };
}

function cleanModelOutput(text: string) {
    return text
        .replace(/<think>[\s\S]*?<\/think>/gi, "")
        .replace(/```json|```/gi, "")
        .trim();
}

function extractJsonCandidate(text: string) {
    const cleaned = cleanModelOutput(text);
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start === -1 || end === -1 || end <= start) return null;
    return cleaned.slice(start, end + 1).trim();
}

function parseJsonCandidate(text: string) {
    const direct = extractJsonCandidate(text);
    if (!direct) return null;
    try {
        return JSON.parse(direct);
    } catch {
        const repaired = direct
            .replace(/[\u201C\u201D]/g, '"')
            .replace(/[\u2018\u2019]/g, "'")
            .replace(/,\s*([}\]])/g, "$1")
            .trim();
        try {
            return JSON.parse(repaired);
        } catch {
            return null;
        }
    }
}

function coerceBlogPayload(raw: any): BlogAiPayload | null {
    if (!raw || typeof raw !== "object") return null;
    const title = String(raw.title || "").trim();
    const excerpt = String(raw.excerpt || "").trim();
    const category = String(raw.category || "").trim();
    const content = String(raw.content || "").trim();
    const readTime = String(raw.readTime || "").trim() || "5 min";

    if (!title || !excerpt || !content) return null;
    return {
        title,
        excerpt: excerpt.slice(0, 160),
        category: normalizeCategory(category),
        content,
        readTime,
    };
}

async function repairMalformedJsonWithModel(
    hf: HfInference,
    candidate: HfModelCandidate,
    malformedOutput: string
): Promise<BlogAiPayload | null> {
    const repairPrompt = `
You are a strict JSON formatter.
Convert the following raw model output into a VALID JSON object.
Return ONLY JSON with exactly these keys: title, excerpt, category, content, readTime.
Rules:
- Use double quotes for all keys and string values.
- Keep content as HTML text string.
- category must be one of: AgTech, Agriculture, Technology, Sustainability, Innovation.
- Do not include markdown, comments, or extra text.

Raw output:
${malformedOutput}
`;

    try {
        const repairResponse = await hf.chatCompletion({
            model: candidate.model,
            provider: candidate.provider as any,
            messages: [{ role: "user", content: repairPrompt }],
            max_tokens: 2500,
            temperature: 0.1,
        });
        const repairedText = repairResponse.choices?.[0]?.message?.content || "";
        const parsed = parseJsonCandidate(repairedText);
        return coerceBlogPayload(parsed);
    } catch {
        return null;
    }
}

function normalizeCategory(category: string) {
    const allowed = ["AgTech", "Agriculture", "Technology", "Sustainability", "Innovation"];
    return allowed.includes(category) ? category : "AgTech";
}

function normalizeTitle(title: string) {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

function titleSimilarityScore(a: string, b: string) {
    const aSet = new Set(normalizeTitle(a).split(" ").filter(Boolean));
    const bSet = new Set(normalizeTitle(b).split(" ").filter(Boolean));
    if (aSet.size === 0 || bSet.size === 0) return 0;
    let intersection = 0;
    for (const token of Array.from(aSet)) {
        if (bSet.has(token)) intersection += 1;
    }
    return (2 * intersection) / (aSet.size + bSet.size);
}

function isTitleTooSimilar(candidate: string, existingTitles: string[]) {
    const normalizedCandidate = normalizeTitle(candidate);
    if (!normalizedCandidate) return true;

    return existingTitles.some((existing) => {
        const normalizedExisting = normalizeTitle(existing);
        if (!normalizedExisting) return false;
        if (normalizedCandidate === normalizedExisting) return true;
        return titleSimilarityScore(candidate, existing) >= 0.78;
    });
}

function buildUniqueFallbackTitle(session: string, currentYear: number, nextYear: number) {
    const sessionLabel = session
        .split(":")
        .slice(1)
        .join(":")
        .split("(")[0]
        .trim();
    const starters = [
        "AgTech Outlook",
        "Future Farms Briefing",
        "Field Intelligence Report",
        "Smart Agriculture Frontier",
    ];
    const hooks = [
        "What Changes in Practice",
        "What Leaders Need Next",
        "From Pilots to Scale",
        "Operational Breakthroughs",
    ];
    const starter = starters[Math.floor(Math.random() * starters.length)];
    const hook = hooks[Math.floor(Math.random() * hooks.length)];
    return `${starter}: ${sessionLabel} in ${currentYear}-${nextYear} - ${hook}`;
}

function hasAgricultureKeyword(title: string) {
    return /(agtech|agriculture|agri|farming|farm|crop|soil|irrigation|harvest|livestock)/i.test(title);
}

function getOllamaTimeoutMs() {
    const raw = Number(process.env.OLLAMA_REQUEST_TIMEOUT_MS || OLLAMA_DEFAULT_TIMEOUT_MS);
    if (!Number.isFinite(raw) || raw < 10000) return OLLAMA_DEFAULT_TIMEOUT_MS;
    return Math.min(raw, 600000);
}

function buildOllamaHeaders(includeContentType = true) {
    const headers: Record<string, string> = includeContentType ? { "Content-Type": "application/json" } : {};
    const bearer = process.env.OLLAMA_API_KEY?.trim();
    const cfId = process.env.OLLAMA_ACCESS_CLIENT_ID?.trim();
    const cfSecret = process.env.OLLAMA_ACCESS_CLIENT_SECRET?.trim();

    if (bearer) headers.Authorization = `Bearer ${bearer}`;
    if (cfId && cfSecret) {
        headers["CF-Access-Client-Id"] = cfId;
        headers["CF-Access-Client-Secret"] = cfSecret;
    }
    return headers;
}

async function callOllama(
    baseUrl: string,
    model: string,
    prompt: string,
    temperature: number
) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), getOllamaTimeoutMs());

    const response = await fetch(`${baseUrl}/api/chat`, {
        method: "POST",
        headers: buildOllamaHeaders(true),
        signal: controller.signal,
        body: JSON.stringify({
            model,
            stream: false,
            format: "json",
            options: { temperature, num_predict: 2500 },
            messages: [{ role: "user", content: prompt }],
        }),
    }).finally(() => clearTimeout(timeout));

    if (!response.ok) {
        const text = await response.text().catch(() => "");
        throw new Error(`HTTP ${response.status}: ${text || "Ollama request failed"}`);
    }

    const data = await response.json();
    return {
        text: String(data?.message?.content || ""),
        usage: {
            prompt_tokens: Number(data?.prompt_eval_count || 0),
            completion_tokens: Number(data?.eval_count || 0),
            total_tokens: Number(data?.prompt_eval_count || 0) + Number(data?.eval_count || 0),
        } as GenerationUsage,
    };
}

async function repairMalformedJsonWithOllama(
    baseUrl: string,
    model: string,
    malformedOutput: string
): Promise<BlogAiPayload | null> {
    const repairPrompt = `
You are a strict JSON formatter.
Convert the following raw model output into a VALID JSON object.
Return ONLY JSON with exactly these keys: title, excerpt, category, content, readTime.
Rules:
- Use double quotes for all keys and string values.
- Keep content as HTML text string.
- category must be one of: AgTech, Agriculture, Technology, Sustainability, Innovation.
- Do not include markdown, comments, or extra text.

Raw output:
${malformedOutput}
`;

    try {
        const repaired = await callOllama(baseUrl, model, repairPrompt, 0.1);
        const parsed = parseJsonCandidate(repaired.text);
        return coerceBlogPayload(parsed);
    } catch {
        return null;
    }
}

export const maxDuration = 300;

export async function GET() {
    const metrics = await readMetrics();
    const summary = summarizeMetrics(metrics);
    const ollamaBaseUrl = process.env.OLLAMA_BASE_URL?.trim() || OLLAMA_DEFAULT_BASE_URL;
    const ollamaAuthConfigured = Boolean(
        process.env.OLLAMA_API_KEY?.trim() ||
        (process.env.OLLAMA_ACCESS_CLIENT_ID?.trim() && process.env.OLLAMA_ACCESS_CLIENT_SECRET?.trim())
    );
    let ollamaReachable = false;
    try {
        const ping = await fetch(`${ollamaBaseUrl}/api/tags`, { headers: buildOllamaHeaders(false) });
        ollamaReachable = ping.ok;
    } catch {
        ollamaReachable = false;
    }

    return NextResponse.json({
        provider: "ollama+huggingface",
        ollama: {
            baseUrl: ollamaBaseUrl,
            reachable: ollamaReachable,
            authConfigured: ollamaAuthConfigured,
            models: OLLAMA_MODEL_CANDIDATES,
        },
        catalogUrl: HF_MODEL_CATALOG_URL,
        huggingFaceModels: HUGGING_FACE_FALLBACK_MODELS,
        metrics: summary,
        rateLimits: {
            note: "Hugging Face Inference Providers does not publish a single universal RPM/TPM limit for all models/providers.",
            practicalLimitSignals: ["HTTP 429 (rate limit)", "HTTP 402 (credits/billing)", "HTTP 403 (permission)"],
        },
    });
}

export async function POST(_request: Request) {
    const huggingFaceApiKey = process.env.HUGGINGFACE_API_KEY?.trim();
    const ollamaBaseUrl = process.env.OLLAMA_BASE_URL?.trim() || OLLAMA_DEFAULT_BASE_URL;

    try {
        const hf = huggingFaceApiKey ? new HfInference(huggingFaceApiKey) : null;
        const metrics = await readMetrics();
        const day = todayKey();
        ensureDaily(metrics, day);

        const sessions = [
            "Session 1: Precision Agriculture & Smart Farming (farm data, IoT sensors, analytics)",
            "Session 2: AI & Machine Learning for Agriculture (yield prediction, pest detection, advisory systems)",
            "Session 3: Sustainable & Climate-Smart Agriculture (water efficiency, soil health, resilience)",
            "Session 4: Farm Robotics & Autonomous Field Systems (weeding, spraying, harvesting, drones)",
            "Session 5: AgTech Market Dynamics & Innovation Ecosystems (startups, adoption, investments, policy)",
            "Session 6: Emerging Agricultural Technologies & Future Farms (next-gen agri infrastructure)"
        ];

        const randomSession = sessions[Math.floor(Math.random() * sessions.length)];
        const currentYear = new Date().getUTCFullYear();
        const nextYear = currentYear + 1;
        const selectedTitleStyle = TITLE_STYLE_GUIDES[Math.floor(Math.random() * TITLE_STYLE_GUIDES.length)];
        const recentTitles = (await prisma.blogPost.findMany({
            select: { title: true },
            orderBy: { createdAt: "desc" },
            take: 20,
        })).map((row) => row.title).filter(Boolean);
        const bannedTitlesHint = recentTitles.length
            ? recentTitles.slice(0, 8).map((title) => `- ${title}`).join("\n")
            : "- (no previous titles)";

        const prompt = `
            You are a tech journalist and content writer for a world-class robotics and AI summit.
            Write a high-quality, professional, and SEO-optimized blog post focused strictly on the following conference track:
            "${randomSession}"
            
            Focus on recent trends, innovations, and breakthroughs for the years ${currentYear} and ${nextYear} related specifically to this topic. 
            The content MUST be highly unique each time. Do not use generic headers or repetitive phrasing.
            Target total length around 700-900 words.
            At the end of the post, add a compelling call to action (CTA) in its own paragraph, mentioning that industry leaders will dive deeply into this exact topic during ${randomSession.split(' (')[0]} at our upcoming summit.
            HARD CONSTRAINTS:
            - Topic must stay strictly in Agriculture + Technology (AgTech) context.
            - Do NOT write generic robotics/AI content outside farming or agriculture.
            - Include practical agriculture references like farms, crops, soil, irrigation, livestock, supply chain, or field operations.
            - Title must clearly indicate agriculture context (use at least one of: AgTech, Agriculture, Farming, Farm, Crop).
            - Do not use years earlier than ${currentYear} unless clearly labeled as background comparison.
            - Title style should be ${selectedTitleStyle}.
            - Avoid overused opening words like "Revolutionizing", "Unlocking", "Transforming", "Future of" unless absolutely necessary.
            - Do not produce a title similar to these recent titles:
            ${bannedTitlesHint}
            
            The response MUST be a VALID JSON object with the following fields:
            {
                "title": "A highly unique, compelling, catchy title for the post (must be different each time)",
                "excerpt": "A short, engaging summary (max 160 characters) for the blog listing",
                "category": "One of: AgTech, Agriculture, Technology, Sustainability, or Innovation",
                "content": "The full blog post content in high-quality HTML format (including <h2>, <p>, <ul>, and the CTA at the end)",
                "readTime": "Estimated read time, e.g., '5 min'"
            }
            
            Ensure the content is insightful, technical yet accessible.
            Return ONLY the JSON object, no explanation, no markdown, no \`<think>\` tags.
            Ensure JSON is parseable with standard JSON.parse. Escape any double quotes inside content with \\" and do not use unescaped line breaks inside strings.
        `;

        let usedModel: SelectedModel | null = null;
        let usage: GenerationUsage | null = null;
        let aiData: BlogAiPayload | null = null;
        let repairedByModel = false;
        let lastRawOutput = "";
        const modelErrors: string[] = [];
        const attemptedModels: string[] = [];

        for (const ollamaModel of OLLAMA_MODEL_CANDIDATES) {
            attemptedModels.push(`ollama/${ollamaModel}`);
            try {
                const response = await callOllama(ollamaBaseUrl, ollamaModel, prompt, 0.25);
                const output = response.text;

                if (typeof output === "string" && output.trim()) {
                    lastRawOutput = output;
                    let parsedPayload: BlogAiPayload | null = coerceBlogPayload(parseJsonCandidate(output));
                    let repaired = false;

                    if (!parsedPayload) {
                        parsedPayload = await repairMalformedJsonWithOllama(ollamaBaseUrl, ollamaModel, output);
                        repaired = !!parsedPayload;
                    }

                    if (parsedPayload) {
                        aiData = parsedPayload;
                        usedModel = { provider: "ollama", model: ollamaModel };
                        usage = response.usage || null;
                        repairedByModel = repaired;
                        break;
                    }

                    modelErrors.push(`ollama/${ollamaModel}: Model returned non-parseable JSON`);
                    continue;
                }
                modelErrors.push(`ollama/${ollamaModel}: Empty response`);
            } catch (err: any) {
                const message = getErrorMessage(err);
                const combinedError = `ollama/${ollamaModel}: ${message}`;
                modelErrors.push(combinedError);
                console.warn(`Ollama attempt failed: ${combinedError}`);
            }
        }

        if (!aiData && hf) {
            for (const candidate of HUGGING_FACE_FALLBACK_MODELS) {
                attemptedModels.push(`huggingface/${candidate.provider}/${candidate.model}`);
                try {
                    const response = await hf.chatCompletion({
                        model: candidate.model,
                        provider: candidate.provider as any,
                        messages: [{ role: "user", content: prompt }],
                        max_tokens: 2500,
                        temperature: 0.25,
                    });

                    const output = response.choices?.[0]?.message?.content;
                    if (typeof output === "string" && output.trim()) {
                        lastRawOutput = output;
                        let parsedPayload: BlogAiPayload | null = coerceBlogPayload(parseJsonCandidate(output));
                        let repaired = false;

                        if (!parsedPayload) {
                            parsedPayload = await repairMalformedJsonWithModel(hf, candidate, output);
                            repaired = !!parsedPayload;
                        }

                        if (parsedPayload) {
                            aiData = parsedPayload;
                            usedModel = { provider: "huggingface", model: candidate.model, providerRoute: candidate.provider };
                            usage = response.usage || null;
                            repairedByModel = repaired;
                            break;
                        }

                        modelErrors.push(`${candidate.provider}/${candidate.model}: Model returned non-parseable JSON`);
                        continue;
                    }
                    modelErrors.push(`${candidate.provider}/${candidate.model}: Empty response`);
                } catch (err: any) {
                    const status = getHttpStatusFromError(err);
                    const bodyError = getHttpBodyError(err);
                    const message = getErrorMessage(err);
                    const combinedError = `${candidate.provider}/${candidate.model}${status ? ` [${status}]` : ""}: ${bodyError || message}`;
                    modelErrors.push(combinedError);
                    console.warn(`Hugging Face attempt failed: ${combinedError}`);

                    if (isHfPermissionError(err) || isHfBillingError(err)) {
                        break;
                    }
                }
            }
        }

        if (!aiData || !usedModel) {
            const joinedErrors = modelErrors.join(" | ");
            const failedByPermission = modelErrors.some((msg) => msg.toLowerCase().includes("permissions"));
            const failedByRateLimit = modelErrors.some((msg) => msg.toLowerCase().includes("rate limit") || msg.includes("[429]"));
            const failedByBilling = modelErrors.some((msg) => msg.toLowerCase().includes("insufficient credits") || msg.includes("[402]") || msg.toLowerCase().includes("payment"));
            const firstHttpStatus = modelErrors.find((msg) => msg.includes("[429]") || msg.includes("[402]") || msg.includes("[403]"));
            const failedByParsing = modelErrors.some((msg) => msg.toLowerCase().includes("non-parseable json"));
            const ollamaUnavailable = modelErrors.some((msg) => msg.toLowerCase().includes("ollama/") && (msg.toLowerCase().includes("fetch failed") || msg.toLowerCase().includes("econnrefused") || msg.toLowerCase().includes("http 5")));

            let statusCode = 500;
            let errorTitle = "AI generation failed";
            let errorDetails = joinedErrors || "All configured AI models failed.";
            let errorKind: "rate_limit" | "permission" | "billing" | "other" = "other";

            if (ollamaUnavailable && !hf) {
                statusCode = 503;
                errorTitle = "Ollama Server Unavailable";
                errorDetails = `Could not reach Ollama at ${ollamaBaseUrl}. Start Ollama and retry, or configure HUGGINGFACE_API_KEY as fallback.`;
            } else if (failedByRateLimit) {
                statusCode = 429;
                errorTitle = "Hugging Face Rate Limit Reached";
                errorDetails = "Rate limit reached for the selected model/provider. Retry after a short wait or switch model/provider.";
                errorKind = "rate_limit";
            } else if (failedByBilling) {
                statusCode = 402;
                errorTitle = "Hugging Face Credits/Billing Limit";
                errorDetails = "Your Hugging Face credits are exhausted or billing is required for this provider/model.";
                errorKind = "billing";
            } else if (failedByPermission) {
                statusCode = 403;
                errorTitle = "Hugging Face Token Permission Error";
                errorDetails = "Your token cannot call Inference Providers. Enable that permission in token settings.";
                errorKind = "permission";
            } else if (failedByParsing) {
                statusCode = 502;
                errorTitle = "Model Output Parse Error";
                errorDetails = "Models responded but all outputs were malformed JSON. Retrying usually resolves this.";
            } else if (firstHttpStatus?.includes("[429]")) {
                errorKind = "rate_limit";
            }

            applyAttemptCounters(metrics, day, "error", null, errorKind);
            metrics.lastAttempt = {
                at: new Date().toISOString(),
                status: "error",
                httpStatus: statusCode,
                error: `${errorTitle}: ${errorDetails}`,
            };
            await saveMetrics(metrics);

            return NextResponse.json({
                error: errorTitle,
                details: errorDetails,
                provider: "ollama+huggingface",
                ollamaBaseUrl,
                docsUrl: HF_MODEL_CATALOG_URL,
                attemptedModels,
                modelErrors,
                lastRawOutputSnippet: lastRawOutput ? cleanModelOutput(lastRawOutput).slice(0, 800) : undefined,
                aiMeta: {
                    attemptedModels,
                    metrics: summarizeMetrics(metrics),
                    catalogUrl: HF_MODEL_CATALOG_URL,
                },
            }, { status: statusCode });
        }

        let titleWasAdjusted = false;
        let finalTitle = aiData.title.trim();
        if (!hasAgricultureKeyword(finalTitle) || isTitleTooSimilar(finalTitle, recentTitles)) {
            titleWasAdjusted = true;
            finalTitle = buildUniqueFallbackTitle(randomSession, currentYear, nextYear);
            if (isTitleTooSimilar(finalTitle, recentTitles)) {
                finalTitle = `${finalTitle} (${Math.floor(100 + Math.random() * 900)})`;
            }
        }
        aiData.title = finalTitle;

        // Generate slug
        const slug = aiData.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');

        // Save as Draft
        const post = await prisma.blogPost.create({
            data: {
                title: aiData.title,
                excerpt: aiData.excerpt,
                category: aiData.category,
                content: aiData.content,
                readTime: aiData.readTime,
                slug: `${slug}-${Math.floor(Math.random() * 10000)}`,
                author: usedModel.provider === "ollama" ? "Ollama AI" : "Hugging Face AI",
                isPublished: false, // AI posts start as drafts
                aiSummary: `Generated via ${usedModel.provider === "ollama" ? "Ollama" : "Hugging Face"} model ${usedModel.model}${usedModel.providerRoute ? ` (${usedModel.providerRoute})` : ""} based on current AgTech trends.${repairedByModel ? " Output auto-repaired to valid JSON." : ""}${titleWasAdjusted ? " Title adjusted for uniqueness/agriculture relevance." : ""}`,
                image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop" // Default high-tech placeholder
            }
        });

        applyAttemptCounters(metrics, day, "success", usage, undefined);
        metrics.lastAttempt = {
            at: new Date().toISOString(),
            status: "success",
            model: usedModel.model,
            provider: usedModel.provider,
        };
        await saveMetrics(metrics);

        return NextResponse.json({
            ...post,
            aiMeta: {
                provider: usedModel.provider,
                model: usedModel.model,
                providerRoute: usedModel.providerRoute || null,
                usage,
                repairedByModel,
                titleWasAdjusted,
                attemptedModels,
                metrics: summarizeMetrics(metrics),
                catalogUrl: HF_MODEL_CATALOG_URL,
                ollamaBaseUrl,
            },
        });
    } catch (error: any) {
        const status = getHttpStatusFromError(error);
        const details = getHttpBodyError(error) || getErrorMessage(error);
        const metrics = await readMetrics();
        const day = todayKey();
        let errorKind: "rate_limit" | "permission" | "billing" | "other" = "other";
        let statusCode = 500;
        let errorTitle = "Failed to generate AI blog post";

        if (isHfRateLimitError(error)) {
            statusCode = 429;
            errorTitle = "Hugging Face Rate Limit Reached";
            errorKind = "rate_limit";
        } else if (details.toLowerCase().includes("ollama")) {
            statusCode = 503;
            errorTitle = "Ollama Server Unavailable";
        } else if (isHfPermissionError(error)) {
            statusCode = 403;
            errorTitle = "Hugging Face Token Permission Error";
            errorKind = "permission";
        } else if (isHfBillingError(error)) {
            statusCode = 402;
            errorTitle = "Hugging Face Credits/Billing Limit";
            errorKind = "billing";
        } else if (status && Number.isInteger(status)) {
            statusCode = status;
        }

        applyAttemptCounters(metrics, day, "error", null, errorKind);
        metrics.lastAttempt = {
            at: new Date().toISOString(),
            status: "error",
            httpStatus: statusCode,
            error: `${errorTitle}: ${details}`,
        };
        await saveMetrics(metrics);

        return NextResponse.json({
            error: errorTitle,
            details,
            provider: "ollama+huggingface",
            docsUrl: HF_MODEL_CATALOG_URL,
            aiMeta: {
                metrics: summarizeMetrics(metrics),
                catalogUrl: HF_MODEL_CATALOG_URL,
                ollamaBaseUrl,
            },
        }, { status: statusCode });
    }
}

