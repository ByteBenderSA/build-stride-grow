# CompanAI Business Scenarios Analysis
## Free Trial to Paid Conversion Strategy

### Executive Summary
CompanAI is a coding education platform for beginners using Gemini 2.0 Flash API across 5 core services. This analysis maps maximum token usage, estimates user behavior patterns, calculates API costs, and determines subscription targets needed for profitability.

---

## 1. MAXIMUM TOKEN USAGE ANALYSIS

### Gemini API Services & Token Limits

#### Service 1: AI Assistant Chat (`generateResponse`)
- **Max Output Tokens**: 1,000 per interaction
- **Input Tokens Estimate**: 
  - System prompt: ~800 tokens
  - Context (user progress, project, topics): ~200 tokens
  - Chat history (avg 3-4 messages): ~300 tokens
  - **Total Input**: ~1,300 tokens per interaction
- **Total per Interaction**: ~2,300 tokens (1,300 input + 1,000 output)

#### Service 2: Project Idea Generation (`generateProjectIdea`)
- **Max Output Tokens**: 3,000 per generation
- **Input Tokens Estimate**:
  - Large system prompt with detailed instructions: ~1,200 tokens
  - User input and skill level: ~100 tokens
  - **Total Input**: ~1,300 tokens per generation
- **Total per Generation**: ~4,300 tokens (1,300 input + 3,000 output)

#### Service 3: Refined Prompt Generation (`generateRefinedPrompt`)
- **Max Output Tokens**: 4,000 per refinement
- **Input Tokens Estimate**:
  - Selected idea JSON: ~800 tokens
  - Customization parameters: ~300 tokens
  - System prompt: ~600 tokens
  - **Total Input**: ~1,700 tokens per refinement
- **Total per Refinement**: ~5,700 tokens (1,700 input + 4,000 output)

#### Service 4: Long Form Prompts (`generateLongFormPrompt`)
- **Max Output Tokens**: 4,000 per prompt
- **Input Tokens Estimate**:
  - User prompt: ~200-500 tokens (average 350)
  - **Total Input**: ~350 tokens per prompt
- **Total per Long Form**: ~4,350 tokens (350 input + 4,000 output)

#### Service 5: Message Analysis (`analyzeUserMessage`)
- **Max Output Tokens**: ~150 (JSON response, estimated)
- **Input Tokens Estimate**:
  - Analysis prompt: ~100 tokens
  - User message: ~50 tokens (average)
  - **Total Input**: ~150 tokens per analysis
- **Total per Analysis**: ~300 tokens (150 input + 150 output)

---

## 2. USER BEHAVIOR SCENARIOS

### Current Subscription Limits
- **Free Tier**: 1 idea + 5 AI assistant interactions
- **Pro Tier**: 5 ideas + 50 AI assistant interactions (R70 one-time)
- **Premium Tier**: 20 ideas + 100 AI assistant interactions (R100 one-time)
- **Ultra Tier**: Unlimited usage (R100/month)

### Light Usage Pattern (Free Tier User)
**Monthly Activity:**
- 1 Project Idea Generation: 4,300 tokens
- 1 Refined Prompt (if they upgrade idea): 5,700 tokens
- 5 AI Assistant Interactions: 11,500 tokens (5 × 2,300)
- 3 Message Analysis calls: 900 tokens (3 × 300)
- 0 Long Form Prompts (not typically used by free users)

**Total Monthly Tokens**: 22,400 tokens
**API Cost**: $0.0034 per user/month

### Moderate Usage Pattern (Pro Tier User)
**Monthly Activity:**
- 3 Project Idea Generations: 12,900 tokens (3 × 4,300)
- 2 Refined Prompts: 11,400 tokens (2 × 5,700)
- 25 AI Assistant Interactions: 57,500 tokens (25 × 2,300)
- 1 Long Form Prompt: 4,350 tokens
- 15 Message Analysis calls: 4,500 tokens (15 × 300)

**Total Monthly Tokens**: 90,650 tokens
**API Cost**: $0.0136 per user/month

### Heavy Usage Pattern (Premium Tier User)
**Monthly Activity:**
- 8 Project Idea Generations: 34,400 tokens (8 × 4,300)
- 4 Refined Prompts: 22,800 tokens (4 × 5,700)
- 50 AI Assistant Interactions: 115,000 tokens (50 × 2,300)
- 3 Long Form Prompts: 13,050 tokens (3 × 4,350)
- 25 Message Analysis calls: 7,500 tokens (25 × 300)

**Total Monthly Tokens**: 192,750 tokens
**API Cost**: $0.0289 per user/month

### Power Usage Pattern (Ultra Tier User)
**Monthly Activity:**
- 8 Project Idea Generations: 34,400 tokens (8 × 4,300)
- 6 Refined Prompts: 34,200 tokens (6 × 5,700)
- 100 AI Assistant Interactions: 230,000 tokens (100 × 2,300)
- 10 Long Form Prompts: 43,500 tokens (10 × 4,350)
- 50 Message Analysis calls: 15,000 tokens (50 × 300)

**Total Monthly Tokens**: 357,100 tokens
**API Cost**: $0.0535 per user/month

---

## 3. API COST BREAKDOWN

### Gemini 2.0 Flash Pricing
- **Input tokens**: $0.10 per 1M tokens
- **Output tokens**: $0.40 per 1M tokens

### Cost Per User Type

#### Light Users (Free Tier)
- Input tokens: 8,800 tokens × $0.10/1M = $0.0009
- Output tokens: 13,600 tokens × $0.40/1M = $0.0054
- **Total Cost**: $0.0063 per user/month

#### Moderate Users (Pro Tier)
- Input tokens: 35,700 tokens × $0.10/1M = $0.0036
- Output tokens: 54,950 tokens × $0.40/1M = $0.0220
- **Total Cost**: $0.0256 per user/month

#### Heavy Users (Premium Tier)
- Input tokens: 76,000 tokens × $0.10/1M = $0.0076
- Output tokens: 116,750 tokens × $0.40/1M = $0.0467
- **Total Cost**: $0.0543 per user/month

#### Power Users (Ultra Tier)
- Input tokens: 140,800 tokens × $0.10/1M = $0.0141
- Output tokens: 216,300 tokens × $0.40/1M = $0.0865
- **Total Cost**: $0.1006 per user/month

---

## 4. BUSINESS MODEL SCENARIOS

### Revenue Structure
- **Pro Tier**: R70 one-time payment = $3.85 USD
- **Premium Tier**: R100 one-time payment = $5.50 USD
- **Ultra Tier**: R100/month = $5.50 USD/month

### Scenario A: Conservative Growth
**User Distribution (Month 12):**
- Free users: 1,000 (cost: $6.30/month)
- Pro users: 200 (revenue: $1,100 one-time, cost: $5.12/month)
- Ultra users: 50 (revenue: $275/month, cost: $5.03/month)

**Monthly Financials:**
- Revenue: $275 (recurring) + Pro conversions
- Costs: $16.45 API costs
- **Net Profit**: $258.55/month (94% margin)

### Scenario B: Moderate Growth
**User Distribution (Month 12):**
- Free users: 5,000 (cost: $31.50/month)
- Pro users: 1,000 (revenue: $5,500 one-time, cost: $25.60/month)
- Ultra users: 200 (revenue: $1,100/month, cost: $20.12/month)

**Monthly Financials:**
- Revenue: $1,100 (recurring) + Pro conversions
- Costs: $77.22 API costs
- **Net Profit**: $1,022.78/month (93% margin)

### Scenario C: Aggressive Growth
**User Distribution (Month 12):**
- Free users: 20,000 (cost: $126/month)
- Pro users: 4,000 (revenue: $22,000 one-time, cost: $102.40/month)
- Ultra users: 800 (revenue: $4,400/month, cost: $80.48/month)

**Monthly Financials:**
- Revenue: $4,400 (recurring) + Pro conversions
- Costs: $308.88 API costs
- **Net Profit**: $4,091.12/month (93% margin)

---

## 5. CONVERSION RATE TARGETS

### Required Conversion Rates for Profitability

#### Break-Even Point Analysis
**Fixed Costs** (estimated monthly):
- Hosting/Firebase: $50
- Marketing: $200
- Operations: $100
- **Total Fixed**: $350/month

#### Minimum Users Needed for Break-Even:
**Ultra Tier Conversions**: 64 users needed
- 64 × $5.50 = $352 revenue
- 64 × $0.10 = $6.40 API costs
- Net: $345.60 (covers fixed costs)

#### Conversion Funnel Strategy:
1. **Free to Pro**: Target 20% conversion rate
   - One-time revenue helps offset free user costs
   - Builds trust for future Ultra upgrades

2. **Pro to Ultra**: Target 15% conversion rate  
   - Pro users are pre-qualified as paying customers
   - Higher engagement = higher conversion likelihood

3. **Free to Ultra**: Target 2-3% conversion rate
   - Direct conversion from engaged free users

---

## 6. PROFITABILITY SCENARIOS

### Scenario 1: Conservative Target (Month 6)
**User Base**: 2,000 total users
- Free: 1,600 users
- Pro: 320 users (20% conversion)
- Ultra: 80 users (4% total conversion)

**Monthly Results:**
- Revenue: $440 recurring + $1,760 Pro sales
- API Costs: $18.50
- **Monthly Profit**: $421.50 + Pro revenue

### Scenario 2: Growth Target (Month 12)
**User Base**: 10,000 total users
- Free: 7,500 users
- Pro: 1,500 users (20% conversion)
- Ultra: 1,000 users (10% total conversion)

**Monthly Results:**
- Revenue: $5,500 recurring + $8,250 Pro sales
- API Costs: $147.75
- **Monthly Profit**: $5,352.25 + Pro revenue

### Scenario 3: Scale Target (Month 18)
**User Base**: 50,000 total users
- Free: 35,000 users
- Pro: 10,000 users (28% conversion - improved funnel)
- Ultra: 5,000 users (10% total conversion)

**Monthly Results:**
- Revenue: $27,500 recurring
- API Costs: $720.60
- **Monthly Profit**: $26,779.40

---

## 7. RECOMMENDATIONS

### Immediate Actions (Next 30 days):
1. **Implement usage tracking** with clear limits display
2. **Add upgrade prompts** when users hit limits
3. **Create Pro tier onboarding** flow to drive conversions
4. **A/B test pricing** (R75 vs R100 vs R125)

### Growth Phase (3-6 months):
1. **Focus on free user acquisition** - low API costs make this viable
2. **Optimize conversion funnels** with better UX at limit points
3. **Add value-driven features** for Pro/Ultra tiers
4. **Implement referral program** leveraging low marginal costs

### Scale Phase (6-12 months):
1. **Consider tiered Ultra plans** (R75 basic, R150 premium)
2. **Add enterprise features** for coding bootcamps/schools
3. **Implement API cost monitoring** and alerts
4. **Explore Gemini 1.5 Flash** for cost optimization on basic features

---

## 8. RISK MITIGATION

### API Cost Risks:
- **Monitor token usage** patterns monthly
- **Implement rate limiting** for abuse prevention  
- **Cache common responses** where possible
- **Consider model switching** for different use cases

### Conversion Risks:
- **Track conversion funnels** with analytics
- **Survey non-converting users** for insights
- **Test different pricing strategies** in small cohorts
- **Improve onboarding experience** continuously

---

**Analysis Complete**: API costs are extremely manageable (93%+ margins), making aggressive user acquisition viable while maintaining profitability with modest conversion rates. 