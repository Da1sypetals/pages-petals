# RULES — READ BEFORE ENDING EVERY RESPONSE

1. Never claim something works without testing locally first.
2. Never modify user data in Redis without explicit permission. The data is not yours.
3. Store raw data as-is. Convert on read, never on write.
4. Use iframe for rendering HTML pages that contain scripts.
5. Check filename extension for markdown vs HTML. No content detection hacks.
6. Server-side markdown conversion. No CDN scripts in iframe srcdoc.
7. Never delete user data.
8. Test with curl + browser before claiming a fix works.
9. One rendering path. No type branching, no isHtmlContent, no prose, no cancelled flags.
10. The user's file extension IS the type. .md = markdown, .html = html. Nothing else.

# Design Language

Use **soft-skill** from `taste-skill/skills/soft-skill/SKILL.md`.
Geist, emerald accent, zinc palette, Phosphor Duotone, Motion spring physics.
