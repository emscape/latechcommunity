# LA Tech Community Website

Welcome to the LA Tech Community placeholder website project! This is a team effort to create an engaging landing page for **latechcommunity.org**.

## Quick Start

### Project Structure
```
latechcommunity/
├── .github/
│   └── instructions/          # File-specific instructions
├── assets/                    # Graphics and images
├── docs/                      # Project documentation
├── scripts/                   # JavaScript
├── styles/                    # CSS modules (BEM)
├── tests/                     # Vitest unit tests
├── index.html                 # Pages are served from the repo root
├── volunteer.html
├── thank-you.html
├── PROJECT_PROGRESS.md        # Milestone tracking
├── DESIGN_NOTES.md            # Design decisions
└── copilot-instructions.md    # Workspace instructions
```

### Getting Started

1. **Review the Design**: Add your graphic to `/assets/` and review the design guide
2. **Set Up**: Examine `DESIGN_NOTES.md` for brand guidelines
3. **Build**: Pages live at the repo root, with CSS in `/styles/` and JavaScript in `/scripts/`
4. **Test**: `npm install`, then `npm test` (Node is only used for tests; the site has no build step)
5. **Track Progress**: Update `PROJECT_PROGRESS.md` as you complete tasks

### Upcoming Events

The Events section loads upcoming events from each chapter's gdg.community.dev page in the browser (`scripts/events.js`). To add or remove a chapter, edit the `CHAPTERS` list there; a chapter's ID is the `chapter_id` value in its page source. If the feed can't be reached, the section falls back to the "View GDG LA Events" link.

## Team References

- **Design Guidelines**: See [DESIGN_NOTES.md](./DESIGN_NOTES.md)
- **Shared Knowledge**: See [/memories/repo/](./memories/repo/)
- **Project Progress**: See [PROJECT_PROGRESS.md](./PROJECT_PROGRESS.md)
- **To-Do Items**: See [TODO.md](./TODO.md)

## Contributing

- Follow the workspace instructions in `copilot-instructions.md`
- Maintain accessibility standards (WCAG 2.1 AA)
- Use semantic HTML and BEM CSS naming conventions
- Reference design decisions in commit messages

## URL
📍 [latechcommunity.org](https://latechcommunity.org)

---

**Project Started**: March 6, 2026
