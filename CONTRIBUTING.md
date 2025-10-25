# Contributing to CryptoCore

We love your input! We want to make contributing to CryptoCore as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## 🚀 Development Process

We use GitHub to host code, to track issues and feature requests, as well as accept pull requests.

### Pull Requests

1. Fork the repo and create your branch from `master`.
2. If you've added code that should be tested, add tests.
3. If you've changed APIs, update the documentation.
4. Ensure the test suite passes.
5. Make sure your code lints.
6. Issue that pull request!

## 🐛 Report bugs using Github's [issue tracker](https://github.com/tikajhq/crypto-core/issues)

We use GitHub issues to track public bugs. Report a bug by [opening a new issue](https://github.com/tikajhq/crypto-core/issues/new).

**Great Bug Reports** tend to have:

- A quick summary and/or background
- Steps to reproduce
  - Be specific!
  - Give sample code if you can
- What you expected would happen
- What actually happens
- Notes (possibly including why you think this might be happening, or stuff you tried that didn't work)

## 🔧 Development Setup

```bash
# Clone your fork
git clone https://github.com/your-username/crypto-core.git
cd crypto-core

# Install dependencies
npm install

# Copy configuration
cp configs/defaults.js configs/development.js

# Start development server
npm run dev
```

## 📝 Coding Style

- Use 4 spaces for indentation
- Use meaningful variable names
- Add comments for complex logic
- Follow existing code patterns
- Use ES6+ features where appropriate

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- --grep "Currency"
```

## 📚 Documentation

- Update README.md if you change functionality
- Add JSDoc comments for new functions
- Update API documentation for endpoint changes
- Include examples for new features

## 🆕 Adding New Cryptocurrencies

To add support for a new cryptocurrency:

1. Create currency implementation in `modules/currencies/crypto/[currency]/`
2. Add configuration in `configs/common.js`
3. Update `AVAILABLE_CURRENCIES` list
4. Add tests for the new currency
5. Update documentation

### Example Currency Structure

```
modules/currencies/crypto/newcoin/
├── index.js          # Main currency class
├── config.js         # Currency-specific config
└── README.md         # Currency documentation
```

## 🔐 Security

- Never commit private keys or sensitive configuration
- Use environment variables for secrets
- Validate all inputs
- Follow security best practices for cryptocurrency handling

## 📋 Issue Labels

- `bug`: Something isn't working
- `enhancement`: New feature or request
- `documentation`: Improvements or additions to documentation
- `good first issue`: Good for newcomers
- `help wanted`: Extra attention is needed
- `priority-high`: High priority issue
- `priority-low`: Low priority issue

## 🤝 Code of Conduct

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone.

### Our Standards

Examples of behavior that contributes to creating a positive environment include:

- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

## 🎉 Recognition

Contributors will be recognized in:

- CONTRIBUTORS.md file
- Release notes for significant contributions
- Social media shoutouts for major features

## 📞 Getting Help

- 💬 Join our [Discord community](https://discord.gg/crypto-core)
- 📧 Email the maintainers
- 🐛 Open an issue for bugs
- 💡 Start a discussion for ideas

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

Thank you for contributing to CryptoCore! 🚀