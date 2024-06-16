declare module "bun" {
    interface Env {
        MASTODON_URL: string;
        MASTODON_ACCESS_TOKEN: string;
        OLLAMA_URL: string;
        OLLAMA_MODEL: string;
    }
}
