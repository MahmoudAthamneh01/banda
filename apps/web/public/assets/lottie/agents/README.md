# AI Agent Lottie Animations

**Status:** Placeholder - Animations not yet sourced  
**Priority:** P1 (High) - Required for AI system

## Required Animations (8 agents):

1. **wukong_idle.json** - Cyber Wukong (fraud detection, low stock alerts)
2. **mandrill_idle.json** - Magistrate Mandrill (dispute resolution)
3. **deal_cat.json** - Deal Cat (negotiation assistant)
4. **style_guru.json** - Style Guru (fashion recommendations)
5. **trust_mother.json** - Trust Mother (trust & safety)
6. **hungry_panda.json** - Hungry Panda (gamification, red packets)
7. **chatty_bird.json** - Chatty Bird (customer support)
8. **host_panda.json** - Host Panda (onboarding, education)

## Sourcing Options:

### Option A: Custom (Recommended)
- Design in Figma → Export to After Effects → Bodymovin plugin → Lottie JSON
- Cost: Designer time
- Quality: ⭐⭐⭐⭐⭐

### Option B: Purchase from LottieFiles
- Browse: https://lottiefiles.com/featured
- Search for: monkey, cat, bird, panda animations
- Cost: ~$10-50 per animation
- Quality: ⭐⭐⭐⭐

### Option C: Free Alternatives
- LottieFiles free section: https://lottiefiles.com/free
- Customize colors/speed in editor
- Cost: Free
- Quality: ⭐⭐⭐

### Option D: Placeholder SVGs (Temporary)
- Use static SVG icons until lottie ready
- Switch to animated lottie in Sprint 2
- Cost: Free
- Quality: ⭐⭐ (no animation)

## File Requirements:

- Format: .json (Lottie JSON)
- Max size: <100KB per file
- Loop: true (idle animations)
- FPS: 30
- Dimensions: 512x512 or 1024x1024

## Integration:

See: `apps/web/src/components/agents/AgentRenderer.tsx` (to be created in Sprint 2)
