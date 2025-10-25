# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Comprehensive README with SEO optimization
- Docker and Docker Compose support
- GitHub Actions CI/CD pipeline
- Issue templates for better community engagement
- Contributing guidelines
- ESLint configuration
- Test coverage reporting
- Security vulnerability scanning
- Non-commercial license for controlled usage

### Changed
- Updated package.json with proper metadata and keywords
- Improved project structure and documentation
- Enhanced .gitignore for better file management
- License changed from proprietary to Non-Commercial License

### Security
- **REDACTED ALL PASSWORDS**: Replaced all hardcoded passwords with `[REDACTED]` for security
- Redacted RPC passwords across all cryptocurrency client configurations
- Redacted database and service passwords in setup scripts
- Added security notice in README about credential redaction

### Removed
- Removed .tikle.yml deployment configuration
- Removed .gitlab-ci.yml in favor of GitHub Actions

## [1.0.0] - 2018-03-19

### Added
- Multi-currency cryptocurrency transaction server
- Support for 11 major cryptocurrencies:
  - Bitcoin (BTC)
  - Ethereum (ETH)
  - Ripple (XRP)
  - Dash (DASH)
  - Dogecoin (DOGE)
  - Litecoin (LTC)
  - Qtum (QTUM)
  - DigiByte (DGB)
  - MonaCoin (MONA)
  - Vertcoin (VTC)
  - BlackCoin (BLK)
- RESTful HTTP API for all operations
- WebSocket API for real-time updates
- Wallet generation and management
- Transaction monitoring and processing
- Rate synchronization service
- MongoDB integration for data persistence
- Health monitoring and metrics
- Auto-transaction processing
- External callback system
- Comprehensive logging with Winston
- Rate limiting and security features

### Security
- Private key encryption
- Input validation
- Secure RPC connections
- Rate limiting implementation

---

### Legend
- `Added` for new features
- `Changed` for changes in existing functionality
- `Deprecated` for soon-to-be removed features
- `Removed` for now removed features
- `Fixed` for any bug fixes
- `Security` for vulnerability fixes