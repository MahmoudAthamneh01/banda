# Security & China Compliance Checklist (Binding)

## Zero External Assets (Hard)
- [ ] No fonts.googleapis.com
- [ ] No cdn.jsdelivr.net / unpkg / cloudflare CDN etc
- [ ] No remote <script> except allowlisted AliCloud endpoints if needed
- [ ] All images/lottie/icons hosted in OSS or local /public/assets
- [ ] Charts library bundled locally

## CSP (Hard)
- default-src 'self'
- connect-src 'self' + our API + allowed AliCloud endpoints only
- img-src 'self' data: + oss allowlist
- font-src 'self' data:
- object-src 'none'

## China Requirements
- [ ] AMap only
- [ ] PIPL: china identities isolated & encrypted (AES-256)
- [ ] Server TZ = Asia/Shanghai
- [ ] No blocked services usage in CN

## KYC/AML
- [ ] KYC required for maker/investor/service provider upgrade
- [ ] sanctions screening on investor/provider
- [ ] source lock for withdrawals (same account as deposit)
- [ ] tiered deposit limits based on verification

## AppSec
- [ ] rate limiting
- [ ] WAF enabled
- [ ] input validation everywhere
- [ ] audit logs for critical actions

## Data Security
- [ ] encrypt sensitive columns
- [ ] secrets in env only
- [ ] backup policy enabled (RDS snapshots, retention)
