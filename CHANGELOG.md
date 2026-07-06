# Changelog

All notable changes to the Sharek CLI will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.15] - 2026-07-06

### Changed
- Forked from [postiz-agent](https://github.com/gitroomhq/postiz-agent) 2.0.15 (commit `41c5a9d`) and rebranded for Sharek
- Package/command renamed `postiz` → `sharek`; env vars `POSTIZ_*` → `SHAREK_*`; credentials moved to `~/.sharek/`
- Default API URL is now `https://dash.sharek.app/api`; default auth server is `https://cli-auth.sharek.app`
- Auth server (`server/`): Dockerfile added for container deployment; verify page restyled to Sharek brand colors

Entries below this point are inherited from the upstream Postiz CLI changelog (rebranded names).

## [1.0.0] - 2026-02-13

### Added
- Initial release of Sharek CLI
- `posts:create` - Create new social media posts
- `posts:list` - List all posts with pagination and search
- `posts:delete` - Delete posts by ID
- `integrations:list` - List connected social media integrations
- `upload` - Upload media files (images)
- Environment variable configuration (SHAREK_API_KEY, SHAREK_API_URL)
- Comprehensive help documentation
- Example scripts for basic usage and AI agent integration
- SKILL.md for AI agent usage patterns

### Features
- Command-line interface for Sharek API
- Support for scheduled posts
- Multi-platform posting via integrations
- Media upload functionality
- User-friendly error messages with emojis
- JSON output for programmatic parsing
- Comprehensive examples for AI agents
