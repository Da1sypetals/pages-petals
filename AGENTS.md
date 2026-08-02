# Pages Petals — Design Language

This project uses the **soft-skill** design language from `taste-skill/`.

Reference: `taste-skill/skills/soft-skill/SKILL.md`

Key principles:
- Geist font (not Inter)
- Emerald accent (#059669), zinc neutral palette
- Phosphor Icons (Duotone weight)
- Motion (Framer Motion) spring physics — no linear/ease-in-out
- Double-bezel card architecture, generous whitespace
- Anti-center layout bias
- No AI-purple gradients, no generic glassmorphism
- Single rendering path: iframe for page content, server-side markdown conversion
- Filename extension determines markdown vs HTML (.md → markdown, .html → html)
- Store raw data, convert on read
