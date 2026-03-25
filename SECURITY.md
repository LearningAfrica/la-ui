# Learning Africa UI - Security Policy

## Supported Versions

We release patches for security vulnerabilities in the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability, please follow these steps:

1. **Do NOT** open a public issue
2. Contact the team directly with detailed information:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if available)

## Response Timeline

- **Initial Response**: Within 48 hours
- **Status Update**: Within 7 days
- **Fix Timeline**: Varies based on severity
  - Critical: 1-7 days
  - High: 7-30 days
  - Medium: 30-90 days
  - Low: 90+ days

## Security Best Practices

When contributing or deploying:

1. **Environment Variables**: Never commit `.env` files. Use `.env.example` with placeholder values only
2. **Dependencies**: Keep dependencies up to date and review new packages before adding
3. **Authentication**: Auth tokens are managed via Axios interceptors — never log or expose them
4. **HTTPS**: Always use HTTPS in production
5. **Input Validation**: Validate all user inputs with Zod schemas before submission
6. **Error Handling**: Don't expose sensitive information in error messages

## Security Features

This project includes:

- Error boundaries to prevent information leakage
- Axios API client with auth token interceptors
- Zod schema validation on all form inputs
- Environment variable configuration via `.env` (gitignored)
- Husky pre-commit hooks enforcing lint and format checks

## Acknowledgments

We appreciate the security research community and will acknowledge contributors who report vulnerabilities (with their permission).
