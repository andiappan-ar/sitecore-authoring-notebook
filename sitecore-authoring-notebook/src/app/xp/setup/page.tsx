"use client";

import { useEffect, useRef, useState } from "react";

export default function AuthoringXP() {
    const [form, setForm] = useState({
        authoringUrl: "",
        accessToken: "",
        graphqlType: "non-edge",
        itemUrl: "",
        apiKey: ""
    });

    const [authoringResult, setAuthoringResult] = useState<any>(null);
    const [itemResult, setItemResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [status, setStatus] = useState<{ authoring: string | null; item: string | null }>({
        authoring: null,
        item: null,
    });
    const [isConfigValid, setIsConfigValid] = useState(false);
    const [configSaved, setConfigSaved] = useState(false);

    const saveButtonRef = useRef<HTMLButtonElement | null>(null);

    useEffect(() => {
        if (authoringResult?.validation === "passed" && itemResult?.validation === "passed") {
            setIsConfigValid(true);
            // Move focus to Save button
            setTimeout(() => {
                saveButtonRef.current?.focus();
            }, 100);
        } else {
            setIsConfigValid(false);
        }
    }, [authoringResult, itemResult]);

    const handleChange = (e: any) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const fallbackClientFetchItem = async () => {
        try {
            const query = { query: "query { sites { name } }" };
            const url = `${form.itemUrl}?sc_apikey=${form.apiKey}`;
            const headers: any = { "Content-Type": "application/json" };

            const res = await fetch(url, {
                method: "POST",
                headers,
                body: JSON.stringify(query),
            });

            const text = await res.text();
            let data;
            try {
                data = JSON.parse(text);
            } catch {
                data = { raw: text };
            }

            const response = {
                query,
                status: res.status,
                statusText: res.statusText,
                body: data,
                validation: res.ok && data?.data?.sites ? "passed" : "failed",
            };

            setItemResult(response);
            setStatus((prev) => ({ ...prev, item: response.validation === "passed" ? "success" : "error" }));
        } catch (err: any) {
            console.error("Client-side fallback fetch failed:", err);
            setItemResult({
                query: { query: "query { sites { name } }" },
                error: err.message,
                status: "Unavailable",
                statusText: "Fetch failed",
                validation: "failed",
            });
            setStatus((prev) => ({ ...prev, item: "error" }));
            setError(`Item fallback failed: ${err.message}`);
        }
    };

    const validate = async (type: "authoring" | "item") => {
        setError(null);
        const route = type === "authoring" ? "/api/xp/validate-authoring" : "/api/xp/validate-item";
        const payload =
            type === "authoring"
                ? { url: form.authoringUrl, token: form.accessToken }
                : { url: form.itemUrl, apiKey: form.apiKey };

        try {
            const res = await fetch(route, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Unknown server error");

            const response = {
                query: { query: "query { sites { name } }" },
                ...data,
                validation: "passed",
            };

            if (type === "authoring") {
                setAuthoringResult(response);
                setStatus((prev) => ({ ...prev, authoring: "success" }));
            } else {
                setItemResult(response);
                setStatus((prev) => ({ ...prev, item: "success" }));
            }
        } catch (err: any) {
            console.warn("Server fetch failed");
            if (type === "item") await fallbackClientFetchItem();
            else {
                setAuthoringResult({
                    query: { query: "query { sites { name } }" },
                    error: err.message,
                    status: "Unavailable",
                    statusText: "Fetch failed",
                    validation: "failed",
                });
                setStatus((prev) => ({ ...prev, authoring: "error" }));
                setError(`Authoring validation failed: ${err.message}`);
            }
        }
    };

    const handleSaveConfig = async () => {
        const config = {
            xpAuthoringUrl: form.authoringUrl,
            xpAccessToken: form.accessToken,
            xpItemUrl: form.itemUrl,
            xpApiKey: form.apiKey,
            xpGraphqlType: form.graphqlType,
        };

        try {
            const res = await fetch("/api/xp/session/save-xp-config", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(config),
            });

            if (!res.ok) throw new Error("Failed to save config to session");
            setConfigSaved(true);
        } catch (err) {
            console.error("Error saving config to server session:", err);
        }
    };

    return (
        <div className="p-8 max-w-xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Sitecore GraphQL Endpoint Setup</h2>

            <h3 className="font-semibold mt-6">Authoring API</h3>
            <input name="authoringUrl" placeholder="URL" onChange={handleChange} className="border p-2 w-full" />
            <input name="accessToken" placeholder="Access Token" onChange={handleChange} className="border p-2 w-full mt-2" />
            <button onClick={() => validate("authoring")} className="bg-black text-white px-4 py-2 rounded mt-3">
                Validate Authoring
            </button>
            {status.authoring === "success" && <p className="text-green-600 text-sm mt-1">Validation Success</p>}
            {status.authoring === "error" && <p className="text-red-600 text-sm mt-1">Validation Failed</p>}
            {authoringResult && (
                <pre className="bg-gray-100 p-2 mt-2 text-xs">{JSON.stringify(authoringResult, null, 2)}</pre>
            )}

            <h3 className="font-semibold mt-6">Item API</h3>
            <input name="itemUrl" placeholder="URL" onChange={handleChange} className="border p-2 w-full" />
            <input name="apiKey" placeholder="API Key" onChange={handleChange} className="border p-2 w-full mt-2" />
            <button onClick={() => validate("item")} className="bg-black text-white px-4 py-2 rounded mt-3">
                Validate Item
            </button>
            {status.item === "success" && <p className="text-green-600 text-sm mt-1">Validation Success</p>}
            {status.item === "error" && <p className="text-red-600 text-sm mt-1">Validation Failed</p>}
            {itemResult && (
                <pre className="bg-gray-100 p-2 mt-2 text-xs">{JSON.stringify(itemResult, null, 2)}</pre>
            )}

            {isConfigValid && !configSaved && (
                <button
                    ref={saveButtonRef}
                    onClick={handleSaveConfig}
                    className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
                >
                    Save API Config
                </button>
            )}

            {configSaved && (
                <>                    
                    <p className="mt-4">
                        <a
                            href="/xp/lab"
                            className="text-blue-600 underline hover:text-blue-800 font-medium"
                        >
                            → Go to Authoring Lab
                        </a>
                    </p>
                </>
            )}

            {configSaved && <p className="text-green-500 mt-2">Configuration saved to server session.</p>}
            {error && <p className="text-red-500 mt-3 text-sm">{error}</p>}
        </div>
    );
}
