import { serve } from "bun";
const distPath = "/app/frontend/dist";

serve({
    port: 5173,
    fetch(req) {
        const url = new URL(req.url);
        let filePath = `${distPath}${url.pathname}`;


        if (url.pathname === "/") {
            filePath = `${distPath}/index.html`;
        }

        console.log(`Request for ${url.pathname} - Attempting to serve ${filePath}`);

        try {
            return new Response(Bun.file(filePath));
        } catch (err) {
            console.error("Error serving file:", err);
            return new Response("File not found", { status: 404 });
        }
    },
});
