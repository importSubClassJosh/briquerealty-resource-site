import fs from "node:fs/promises";
import path from "node:path";

const rootDir = process.cwd();
const siteUrl = "https://www.briquerealty.com";
const siteName = "BriqueRealty.com";
const siteTagline = "Georgia real estate education for agents, investors, buyers, sellers, and property professionals";
const contactEmail = "contact@briquerealty.com";

const sitewideDisclaimer =
  "Content on this site is for general educational purposes only and is not legal, tax, financial, lending, or brokerage advice. Real estate rules, contracts, commissions, lending standards, and local practices may change. Readers should consult the appropriate licensed professional, broker, attorney, lender, tax professional, or local authority before making decisions.";

const brokerageDisclosurePlaceholder =
  "Real estate advertising disclosure: This site publishes general real estate education. Any brokerage services or licensed real estate activity must be provided through the appropriate responsible brokerage with all required Georgia brokerage, firm, phone, license, and advertising disclosures. Verify current license and brokerage information before relying on brokerage services.";

const author = {
  name: "The Agent Resource Desk",
  role: "Editorial Team for Georgia Real Estate Agent Education",
  slug: "/author/the-agent-resource-desk/",
  image: "agent-resource-desk-avatar.png",
  bio:
    "The Agent Resource Desk publishes practical guides, checklists, and educational resources for Georgia real estate agents, investors, and property professionals. Content is reviewed for clarity, usefulness, and compliance-minded presentation before publication.",
  boxBio:
    "The Agent Resource Desk publishes practical guides, checklists, and educational resources for Georgia real estate agents, investors, and property professionals. Content is designed to help readers understand real estate processes, ask better questions, and make more informed decisions."
};

const imageAssets = [
  imageAsset("home-hero.png", "Homepage hero", "A premium Georgia real estate education desk scene with keys, contracts, homes, and Atlanta-inspired skyline accents.", "Homepage hero banner", "Create a polished editorial-style real estate education banner for a Georgia real estate resource website homepage. Deep merlot, charcoal, ivory, and brass color palette. Modern Atlanta-inspired real estate atmosphere with elegant homes, contract folder, keys, subtle skyline silhouette, and a laptop on a clean desk. No logos. No readable small text. Professional, trustworthy, premium, clean composition. Wide 1920x800 hero banner aspect ratio.", "1920x800"),
  imageAsset("start-here-banner.png", "Start Here banner", "A clear path-style Georgia real estate resource banner with a notebook, map pins, keys, and home silhouettes.", "Start Here page banner", "Create a polished editorial-style real estate education image for a Start Here page that helps Georgia agents, investors, buyers, and sellers choose a learning path. Deep merlot, charcoal, ivory, and brass color palette. Include subtle elements such as map pins, keys, a checklist notebook, home silhouettes, and a modern Atlanta skyline hint. No logos. No readable small text. Professional, trustworthy, premium, clean composition. Wide 1920x800 banner aspect ratio.", "1920x800"),
  imageAsset("resource-center-banner.png", "Resource Center banner", "A refined resource library scene with categorized folders, contracts, laptop, and Georgia property silhouettes.", "Resource Center page banner", "Create a polished editorial-style real estate education image for a Georgia Real Estate Resource Center. Deep merlot, charcoal, ivory, and brass color palette. Include categorized contract folders, a laptop, keys, a checklist, townhomes, and a subtle Atlanta/Georgia skyline feel. No logos. No readable small text. Professional, trustworthy, premium, clean composition. Wide 1920x800 banner aspect ratio.", "1920x800"),
  imageAsset("articles-index-banner.png", "Articles index banner", "An editorial article library visual with stacked guides, a brass pen, contracts, and Georgia real estate details.", "Articles index banner", "Create a polished editorial-style real estate education image for a real estate articles library. Deep merlot, charcoal, ivory, and brass color palette. Include stacked guide pages, a brass pen, contract folders, keys, and refined Georgia residential real estate details. No logos. No readable small text. Professional, trustworthy, premium, clean composition. Wide 1920x800 banner aspect ratio.", "1920x800"),
  imageAsset("downloads-banner.png", "Downloads banner", "Printable real estate checklist pages arranged beside keys, folders, and a clean laptop.", "Downloads page banner", "Create a polished editorial-style real estate education image for printable real estate checklists and downloads. Deep merlot, charcoal, ivory, and brass color palette. Include checklist pages, a laptop, keys, contract folders, and clean desk styling with a Georgia real estate atmosphere. No logos. No readable small text. Professional, trustworthy, premium, clean composition. Wide 1920x800 banner aspect ratio.", "1920x800"),
  imageAsset("about-site-banner.png", "About the Site banner", "A warm professional Georgia real estate education workspace with property guides and local map details.", "About page banner", "Create a polished editorial-style image for an About the Site page for a Georgia real estate education resource. Deep merlot, charcoal, ivory, and brass color palette. Include a professional desk, property education guides, a Georgia map outline motif without readable labels, keys, and home silhouettes. No logos. No readable small text. Professional, trustworthy, premium, clean composition. Wide 1920x800 banner aspect ratio.", "1920x800"),
  imageAsset("contact-banner.png", "Contact banner", "A clean contact desk scene with message cards, real estate documents, a laptop, and brass accents.", "Contact page banner", "Create a polished editorial-style real estate education image for a Contact page. Deep merlot, charcoal, ivory, and brass color palette. Include message cards, a laptop, real estate documents, keys, and a calm professional Georgia property atmosphere. No logos. No readable small text. Professional, trustworthy, premium, clean composition. Wide 1920x800 banner aspect ratio.", "1920x800"),
  imageAsset("editorial-policy-banner.png", "Editorial Policy banner", "An editorial review scene with marked-up guide pages, a checklist, and compliance-minded resource folders.", "Editorial Policy page banner", "Create a polished editorial-style real estate education image for an Editorial Policy page. Deep merlot, charcoal, ivory, and brass color palette. Include reviewed guide pages, a checklist, contract folders, brass pen, and a clean publication desk. No logos. No readable small text. Professional, trustworthy, premium, clean composition. Wide 1920x800 banner aspect ratio.", "1920x800"),
  imageAsset("real-estate-disclaimer-banner.png", "Real Estate Disclaimer banner", "A careful compliance-oriented scene with documents, a disclosure folder, keys, and restrained Georgia property visuals.", "Real Estate Disclaimer page banner", "Create a polished editorial-style real estate education image for a Real Estate Disclaimer page. Deep merlot, charcoal, ivory, and brass color palette. Include disclosure documents, a contract folder, keys, a checklist, and restrained Georgia real estate elements. No logos. No readable small text. Professional, trustworthy, premium, clean composition. Wide 1920x800 banner aspect ratio.", "1920x800"),
  imageAsset("privacy-policy-banner.png", "Privacy Policy banner", "A privacy and cookie policy scene with a laptop, secure folder, documents, and real estate desk accents.", "Privacy Policy page banner", "Create a polished editorial-style real estate education image for a Privacy Policy page. Deep merlot, charcoal, ivory, and brass color palette. Include a laptop, secure document folder, subtle cookie/privacy symbols without readable text, keys, and clean real estate desk styling. No logos. No readable small text. Professional, trustworthy, premium, clean composition. Wide 1920x800 banner aspect ratio.", "1920x800"),
  imageAsset("agent-resource-desk-avatar.png", "The Agent Resource Desk avatar", "An abstract editorial desk avatar with folders, brass pen, keys, and Georgia real estate education motifs.", "Author profile image", "Create a square editorial desk avatar for The Agent Resource Desk, a transparent editorial team identity for Georgia real estate education. Deep merlot, charcoal, ivory, and brass color palette. Show an elegant desk arrangement with guide folders, brass pen, keys, contract pages, and subtle house silhouettes. No people, no faces, no logos, no readable small text. Professional, trustworthy, premium, clean composition. Square 800x800 aspect ratio.", "800x800")
];

const categories = [
  category("Agent Basics", "agent-basics", "Core guidance for new and growing Georgia real estate agents, from first-client readiness to avoiding early mistakes.", "agent-basics-thumb.png", ["choose-real-estate-brokerage-georgia", "new-georgia-real-estate-agent-first-client-checklist", "new-real-estate-agent-mistakes"]),
  category("Brokerage & Commission Education", "brokerage-commission-education", "Plain-English explanations of brokerage models, commission timing, and questions agents should ask before committing.", "brokerage-commission-thumb.png", ["flat-fee-real-estate-brokerage-georgia-agents", "pay-at-close-real-estate-agents", "choose-real-estate-brokerage-georgia"]),
  category("MLS Education", "mls-education", "MLS-focused learning for agents who need to understand data systems, listing exposure, and local rules.", "mls-education-thumb.png", ["fmls-vs-georgia-mls-agents"]),
  category("Listing Preparation", "listing-preparation", "Practical preparation steps for pricing conversations, listing launches, marketing assets, and seller communication.", "listing-prep-thumb.png", ["listing-prep-checklist-georgia-agents"]),
  category("Buyer Representation", "buyer-representation", "Buyer-side checklists and workflow guides for organized, compliance-minded representation.", "buyer-representation-thumb.png", ["buyer-agent-checklist-georgia-real-estate"]),
  category("Referrals & Rentals", "referrals-rentals", "Referral and rental transaction basics for agents who want to understand lower-volume or relationship-driven opportunities.", "referrals-rentals-thumb.png", ["real-estate-referral-commissions-georgia", "rental-commissions-real-estate-agents"]),
  category("Transaction Basics", "transaction-basics", "Transaction fundamentals including earnest money, closings, timelines, documentation, and communication checkpoints.", "transaction-basics-thumb.png", ["earnest-money-guide-real-estate-agents", "first-real-estate-closing-checklist"]),
  category("Agent Business Growth", "agent-business-growth", "Sustainable business-building systems for referrals, vendors, productivity, and repeatable client service.", "agent-business-growth-thumb.png", ["real-estate-agent-vendor-list", "part-time-real-estate-agent-productivity", "referral-based-real-estate-business"]),
  category("Agent Branding", "agent-branding", "Trust-building and brand-positioning guidance for agents who want a professional public presence without confusion.", "agent-branding-thumb.png", ["real-estate-agent-branding-guide", "dba-branding-real-estate-agents"]),
  category("Compliance-Minded Guides", "compliance-minded-guides", "Cautious educational guides that help agents ask better compliance questions of brokers, MLSs, regulators, and counsel.", "compliance-guides-thumb.png", ["georgia-real-estate-advertising-basics-agents"]),
  category("Investor Education", "investor-education", "Foundational investor education for evaluating rentals, short-term rental considerations, and long-term wealth strategies.", "investor-education-thumb.png", ["short-term-rental-investing-georgia-basics", "real-estate-long-term-wealth-building"]),
  category("Georgia Market Education", "georgia-market-education", "Georgia-focused market education topics for readers learning local property dynamics and due diligence questions.", "georgia-market-thumb.png", []),
  category("Checklists & Downloads", "checklists-downloads", "Printable public resources for agents, buyers, sellers, investors, and property professionals.", "checklists-downloads-thumb.png", [])
];

imageAssets.push(
  ...categories.map((item) =>
    imageAsset(
      item.image,
      `${item.name} category thumbnail`,
      `Editorial thumbnail for ${item.name.toLowerCase()} with real estate education materials and Georgia property motifs.`,
      `${item.name} category card`,
      `Create a polished editorial-style real estate education image for the category "${item.name}". Deep merlot, charcoal, ivory, and brass color palette. Modern Georgia/Atlanta-inspired real estate atmosphere. Include subtle elements such as keys, contract folders, property silhouettes, checklists, laptop, lockbox, map pins, and tasteful brass accents appropriate to the category. No logos. No readable small text. Professional, trustworthy, premium, clean composition. 1200x800 landscape aspect ratio.`,
      "1200x800"
    )
  )
);

const articles = [
  article({
    title: "How to Choose a Real Estate Brokerage in Georgia",
    slug: "choose-real-estate-brokerage-georgia",
    category: "Agent Basics",
    tags: ["brokerage choice", "new agents", "Georgia real estate"],
    image: "choose-real-estate-brokerage-georgia.png",
    alt: "Brokerage comparison folders, keys, and a Georgia real estate checklist on an editorial desk.",
    caption: "A brokerage decision should be based on support, costs, supervision, tools, and fit.",
    meta: "A practical guide for Georgia agents comparing brokerage models, support, fees, training, supervision, and business fit.",
    intro: "Choosing a brokerage is one of the first business decisions a Georgia real estate agent makes. The right fit is not only about the split. It is about supervision, learning environment, transaction support, technology, brand rules, and whether the model matches how you plan to build your business.",
    sections: [
      sec("Start with your actual business stage", "A brand-new agent usually needs different support than an experienced agent with a referral base. Before comparing commission plans, write down what you need in the next ninety days: contract coaching, lead conversion practice, listing preparation help, rental guidance, or a lower fixed cost structure.", ["New agents should prioritize access to broker guidance and transaction review.", "Experienced agents may value autonomy, faster answers, and transparent fees.", "Part-time agents should ask how meetings, training, and support work around limited availability."]),
      sec("Compare supervision and accessibility", "In Georgia, agents should work within the supervision and advertising expectations of their broker and applicable regulators. A practical brokerage conversation should include how questions get answered, who reviews contracts, when escalation is expected, and how quickly support is available during active negotiations.", ["Who reviews my first few contracts?", "How are urgent questions handled after business hours?", "What compliance issues do new agents most often miss?"]),
      sec("Look past the headline commission split", "A high split can still be expensive if monthly fees, transaction fees, technology fees, desk fees, E&O charges, and marketing requirements are not clear. A lower split can still be valuable if it includes real coaching and transaction support. Compare the full annual cost under realistic production scenarios.", ["Estimate one rental, one buyer transaction, one listing, and one referral.", "Ask which fees are due monthly and which are due at closing.", "Confirm whether fees continue when you are inactive."]),
      sec("Understand brand and marketing rules", "Brokerage fit includes how you are allowed to market yourself. Ask about business cards, websites, social media profiles, team names, DBA use, yard signs, email signatures, and required broker disclosure. Do not assume that a design that looks professional is compliant.", ["Ask for written advertising guidelines.", "Confirm approval requirements before ordering signs or launching a website.", "Review MLS, broker, and state regulator expectations before publishing ads."]),
      sec("Use a comparison worksheet", "The strongest decision process is documented. Build a simple worksheet with the brokerage name, monthly cost, transaction cost, support model, training, technology, advertising rules, and exit terms. Then compare the tradeoffs side by side instead of relying on a sales conversation.", ["Support you will actually use", "Costs under realistic production", "Speed and quality of broker access", "Rules for branding and advertising", "Fit with referrals, rentals, or full-time sales"]),
      sec("Questions to ask before signing", "A brokerage agreement affects your money, supervision, public marketing, and transaction workflow. Before signing, slow down and ask direct questions. If something is unclear, request the answer in writing and consider having the agreement reviewed by an appropriate professional.", ["What happens if I transfer later?", "How are pending transactions handled if I leave?", "What expenses are nonrefundable?", "What training is included and what costs extra?", "What are the broker's advertising approval requirements?"])
    ],
    related: ["flat-fee-real-estate-brokerage-georgia-agents", "pay-at-close-real-estate-agents", "new-georgia-real-estate-agent-first-client-checklist"]
  }),
  article({
    title: "Flat-Fee Real Estate Brokerage Explained for Georgia Agents",
    slug: "flat-fee-real-estate-brokerage-georgia-agents",
    category: "Brokerage & Commission Education",
    tags: ["flat fee brokerage", "commission education", "agent expenses"],
    image: "flat-fee-real-estate-brokerage-georgia-agents.png",
    alt: "Flat-fee brokerage cost comparison worksheet with keys and brass calculator.",
    caption: "Flat-fee models can be attractive when agents understand the full cost and support structure.",
    meta: "Understand flat-fee brokerage models, common cost questions, support tradeoffs, and due diligence steps for Georgia real estate agents.",
    intro: "A flat-fee brokerage model generally means an agent pays fixed or transaction-based fees instead of giving up a larger percentage of each commission. The model can be useful for agents who understand their costs, production pattern, and support needs, but it should be evaluated carefully.",
    sections: [
      sec("What flat fee usually means", "Flat fee does not mean free, risk-free, or identical across companies. Some models use monthly fees, per-transaction fees, compliance fees, technology fees, or annual charges. Agents should ask for a complete fee schedule and run examples before deciding.", ["Monthly platform or desk fee", "Transaction fee at closing", "E&O or risk management fee", "Optional training or technology charges"]),
      sec("Why agents consider it", "Agents often compare flat-fee models when they want more predictable costs or when they already generate their own business. The appeal is straightforward: if production is consistent and support needs are manageable, fixed costs may be easier to plan around than percentage splits.", ["Predictable cost structure", "More control over retained commission after fees", "Potential fit for referral-heavy or repeat-client business"]),
      sec("Where the tradeoffs show up", "The lowest fee is not automatically the best business decision. If you are new, need hands-on contract help, or do not yet understand local transaction customs, the cost of weak support can outweigh savings. Evaluate the model based on what happens when a deal becomes complicated.", ["Access to broker review", "Contract and amendment guidance", "Advertising approval process", "Training and accountability", "Dispute escalation support"]),
      sec("How to compare a flat fee with a split", "Use realistic transaction examples. Estimate gross commission, brokerage split, transaction fees, monthly fees, MLS dues, association dues, marketing costs, and taxes. Then compare annual net before personal expenses and taxes. Do not rely on a single best-case closing.", ["One low-price rental", "One buyer-side sale", "One listing-side sale", "One referral-only commission"]),
      sec("Questions to ask a broker", "The best flat-fee conversation is specific. Ask how support is delivered, whether fees apply during inactive months, and whether there are minimums or termination fees. Confirm how commission disbursement, document review, and advertising approval work.", ["Are fees due if I have no closings?", "Who reviews documents before binding deadlines?", "How are commission checks processed?", "What marketing must include broker disclosure?"]),
      sec("When to slow down", "Slow down if the model is explained only as a way to make more money. Brokerage choice also affects supervision, compliance, reputation, and client experience. Agents should check with their broker, attorney, MLS, or state regulator when a rule or document requirement is unclear.", ["Unclear written fee schedule", "No clear support path", "Pressure to sign quickly", "Vague advertising rules"])
    ],
    related: ["choose-real-estate-brokerage-georgia", "pay-at-close-real-estate-agents", "dba-branding-real-estate-agents"]
  }),
  article({
    title: "What New Georgia Real Estate Agents Need Before Their First Client",
    slug: "new-georgia-real-estate-agent-first-client-checklist",
    category: "Agent Basics",
    tags: ["first client", "new agents", "checklist"],
    image: "new-georgia-real-estate-agent-first-client-checklist.png",
    alt: "First-client readiness checklist with Georgia real estate documents, keys, and a laptop.",
    caption: "First-client readiness is about systems, scripts, supervision, and transaction basics.",
    meta: "A first-client readiness checklist for new Georgia real estate agents covering broker support, forms, vendors, MLS access, and communication.",
    intro: "A first client can arrive before an agent feels ready. The goal is not to know everything. The goal is to have a support system, a clear process, and enough preparation to ask the right questions before deadlines matter.",
    sections: [
      sec("Confirm your support chain", "Before showing property or discussing listing strategy, know exactly who you call for contract, disclosure, advertising, MLS, and compensation questions. Save phone numbers and preferred communication channels. New agents should not try to solve complex transaction issues alone.", ["Broker or supervising broker contact", "Transaction coordinator or document review contact", "MLS support link", "Association support link", "Preferred lender and closing attorney contacts"]),
      sec("Set up your public basics", "Your first client will likely look you up. Make sure your public profile is accurate, professional, and consistent with brokerage advertising rules. This includes your website, social media, email signature, business cards, and any directory profiles.", ["Use correct license and brokerage disclosure where required.", "Avoid claims about results you cannot support.", "Keep photos, phone numbers, and email addresses consistent."]),
      sec("Understand your forms path", "Do not wait until the night an offer is due to learn where forms live. Learn how to access forms, save templates, send documents for signature, and submit files for review. Ask your broker which forms commonly apply to buyers, sellers, rentals, referrals, and amendments.", ["Representation agreements", "Disclosure forms", "Purchase and sale agreements", "Amendments and exhibits", "Referral agreements"]),
      sec("Build a mini vendor list", "A new agent does not need a huge vendor database, but a small verified list helps clients move quickly. Keep names for lenders, inspectors, closing attorneys, photographers, insurance contacts, and contractors. Make it clear that clients can choose their own providers.", ["Ask vendors what areas they serve.", "Confirm licensing where relevant.", "Track response time and client feedback.", "Avoid steering or guaranteeing outcomes."]),
      sec("Practice the first conversations", "Preparation includes language. Practice explaining your role, next steps, agency relationship questions, offer timelines, earnest money basics, inspection periods, and when the client should consult another professional. Clear language reduces confusion and builds trust.", ["What happens after a buyer likes a home?", "What should a seller prepare before photos?", "What decisions require lender, attorney, tax, or broker input?"]),
      sec("Use a readiness checklist", "Print a first-client checklist and review it before every early appointment. You will miss fewer details if the process is visible. The checklist should include identity, needs, timeline, financing status, representation documents, next steps, and broker questions.", ["Client goal and timeline", "Required disclosures and agreements", "MLS search or listing prep workflow", "Vendor options", "Broker review checkpoints"])
    ],
    related: ["buyer-agent-checklist-georgia-real-estate", "listing-prep-checklist-georgia-agents", "real-estate-agent-vendor-list"]
  }),
  article({
    title: "FMLS vs Georgia MLS: What Agents Should Understand",
    slug: "fmls-vs-georgia-mls-agents",
    category: "MLS Education",
    tags: ["FMLS", "Georgia MLS", "listing data"],
    image: "fmls-vs-georgia-mls-agents.png",
    alt: "Two MLS data dashboards represented by folders, property cards, and map pins on a Georgia real estate desk.",
    caption: "Agents should understand MLS coverage, data rules, listing entry, and broker expectations.",
    meta: "A cautious agent education guide to FMLS, Georgia MLS, listing exposure, data entry, and questions to ask before relying on MLS systems.",
    intro: "Many Georgia agents hear about both FMLS and Georgia MLS early in their careers. The important issue is not which acronym sounds more familiar. Agents need to understand coverage, broker participation, data rules, listing exposure, compensation fields where applicable, and how MLS procedures affect clients.",
    sections: [
      sec("Think of MLSs as data and cooperation systems", "An MLS is more than a search portal. It is a structured system for listing data, broker cooperation, property history, status changes, showing instructions, and rule enforcement. Agents should treat MLS input as a professional responsibility, not clerical busywork.", ["Listing accuracy", "Status updates", "Photo and media rules", "Compensation and cooperation fields where applicable", "Broker and MLS compliance"]),
      sec("Coverage can vary by market and broker", "Coverage depends on market area, broker membership, listing practices, and property type. Do not promise that every property will appear in one system. Ask your broker which MLS memberships apply to your business and how listings should be entered.", ["Metro Atlanta exposure", "Suburban and regional coverage", "Rental listing practices", "New construction and off-market limitations"]),
      sec("Data rules matter", "Each MLS may have rules for listing entry deadlines, photo standards, remarks, prohibited content, status changes, and corrections. Agents should review current MLS rules directly and check with their broker before publishing listings or making assumptions.", ["Public remarks versus agent-only remarks", "Photo permissions", "Showing instructions", "Coming soon or delayed marketing rules", "Withdrawn, pending, closed, and expired statuses"]),
      sec("Buyers and sellers need plain explanations", "Clients do not need a technical lecture, but they do need to understand where listing information comes from and why accuracy matters. Explain that data can change quickly and that buyers should verify property details through inspections, due diligence, and appropriate professionals.", ["Schools, taxes, zoning, and HOA details should be independently checked.", "Listing remarks are not a substitute for contract terms.", "Property availability can change before a showing is scheduled."]),
      sec("Practical MLS habits", "Agents can reduce errors by using a listing launch checklist, saving source documents, confirming seller-approved details, and reviewing listings after publication. Buyer agents should verify statuses and instructions before scheduling or writing.", ["Review every required field before submission.", "Keep seller-approved descriptions and photo permissions.", "Check status before showings and offers.", "Save MLS support contacts."]),
      sec("Questions for your broker or MLS", "MLS systems change, and local practices vary. When uncertain, ask direct questions and document the answer. Broker instructions and MLS rules should guide how you enter listings, share data, and discuss compensation or cooperation.", ["Which MLS memberships does our office use?", "Which listings must be entered and when?", "Who approves public remarks?", "How are data corrections handled?"])
    ],
    related: ["listing-prep-checklist-georgia-agents", "georgia-real-estate-advertising-basics-agents", "buyer-agent-checklist-georgia-real-estate"]
  }),
  article({
    title: "How Real Estate Referral Commissions Work in Georgia",
    slug: "real-estate-referral-commissions-georgia",
    category: "Referrals & Rentals",
    tags: ["referrals", "commission", "agent relationships"],
    image: "real-estate-referral-commissions-georgia.png",
    alt: "Referral commission question sheet with two agent folders connected by brass map pins.",
    caption: "Referral commissions work best when expectations are documented before the client is introduced.",
    meta: "A practical Georgia agent guide to referral commission questions, documentation, timing, and compliance-minded expectations.",
    intro: "Referral commissions can be a useful part of a real estate business, especially when an agent has relationships outside their service area or specialty. The key is documenting expectations clearly before the client is introduced and before work begins.",
    sections: [
      sec("What a referral commission is", "A referral commission is typically compensation paid from one brokerage to another when a referred client closes a qualifying transaction. The exact terms should be documented in a referral agreement and handled through the appropriate brokerage channels.", ["Referral source", "Receiving agent or brokerage", "Client name and transaction type", "Referral percentage or fee", "Timing and payment instructions"]),
      sec("Document before introductions", "Do not rely on casual texts or verbal assumptions. A simple referral question sheet helps clarify whether the client has consented, what market is involved, who will contact the client, and what transaction types are covered.", ["Buyer, seller, rental, commercial, or investor referral", "Geographic area", "Time limit or expiration", "Excluded transactions", "Broker signatures where required"]),
      sec("Set client expectations carefully", "The client should understand who will serve them and that they can ask questions before moving forward. Avoid making promises about closing, price, financing, legal outcomes, or investment returns. The receiving professional must still determine fit and next steps.", ["Explain the handoff.", "Share contact information.", "Avoid implying guaranteed results.", "Follow up without interfering with representation."]),
      sec("Payment depends on the agreement and closing", "Referral fees commonly depend on a closing or other agreed event. Agents should ask how the fee is calculated, whether it applies to future transactions, and how payment flows through the brokerage. Tax questions should go to a tax professional.", ["Gross commission versus net commission basis", "One transaction or multiple transactions", "Rental renewals or purchases after rentals", "Payment timing after closing"]),
      sec("Avoid common referral mistakes", "Referral problems usually come from vague terms. Agents should not introduce a client first and negotiate later. They should not assume every broker handles referral paperwork the same way. They should not discuss compensation in ways that conflict with broker policy or applicable rules.", ["Late paperwork", "No broker approval", "Unclear client consent", "No expiration date", "Unsupported assumptions about future deals"]),
      sec("Use a question sheet", "A referral question sheet keeps the conversation professional. It does not replace a formal agreement, but it helps agents gather details before asking their broker or attorney what document is appropriate.", ["Who is the client?", "What service do they need?", "What market is involved?", "Has the client approved the introduction?", "What fee is being proposed?"])
    ],
    related: ["rental-commissions-real-estate-agents", "referral-based-real-estate-business", "real-estate-agent-vendor-list"]
  }),
  article({
    title: "Rental Commissions for Real Estate Agents: A Practical Guide",
    slug: "rental-commissions-real-estate-agents",
    category: "Referrals & Rentals",
    tags: ["rentals", "leasing", "commissions"],
    image: "rental-commissions-real-estate-agents.png",
    alt: "Rental commission worksheet with apartment keys, lease folder, and checklist on a clean desk.",
    caption: "Rental work can be useful when agents understand fee timing, broker policy, and client expectations.",
    meta: "A practical agent guide to rental commissions, leasing workflows, landlord and tenant expectations, and fee questions.",
    intro: "Rental transactions can help agents build experience, relationships, and local market knowledge. They can also be time-consuming if expectations, compensation, and documentation are unclear. Agents should understand how rentals fit their broker's policies before accepting leasing work.",
    sections: [
      sec("Rental compensation varies", "Rental commission structures can vary by market, landlord, property manager, broker policy, and listing source. Some fees are based on a portion of one month's rent; others may follow a different written offer of compensation. Agents should confirm the source and terms before investing significant time.", ["Listing source", "Landlord or property manager terms", "Brokerage policy", "Lease start and payment timing", "Renewal or future purchase expectations"]),
      sec("Know who you represent", "Rental clients can include tenants, landlords, investors, or property managers. Agency and representation questions matter. Use the forms, disclosures, and broker instructions that apply to the situation, and avoid giving legal advice about lease terms.", ["Tenant search", "Landlord listing", "Investor leasing strategy", "Property manager relationship"]),
      sec("Screen for readiness", "Rental clients often move quickly. Before scheduling, ask about move date, budget, pet needs, location, application requirements, income documentation, and credit concerns. This saves time and helps clients focus on realistic options.", ["Move-in date", "Monthly budget", "Application fee readiness", "Pet and parking needs", "Required documents"]),
      sec("Protect your time with process", "Rental work can turn into scattered showings without clear boundaries. Use a written process: intake, search criteria, showing schedule, application instructions, and follow-up. Keep communication professional and documented.", ["Set a showing route.", "Confirm availability before driving.", "Explain application timing.", "Track properties shown."]),
      sec("Clarify payment timing", "Agents should ask when rental commissions are earned and paid. Some payments may depend on tenant approval, lease execution, move-in, or landlord payment. Commission handling should go through proper brokerage channels.", ["Lease signed", "Tenant moved in", "Landlord paid invoice", "Brokerage received funds"]),
      sec("Rental checklist", "A small checklist can make rental work more organized. It should include intake, representation questions, search setup, showing confirmations, application steps, payment terms, and follow-up tasks.", ["Client intake complete", "Broker guidance confirmed", "Properties verified before showing", "Application requirements shared", "Commission terms documented"])
    ],
    related: ["real-estate-referral-commissions-georgia", "part-time-real-estate-agent-productivity", "short-term-rental-investing-georgia-basics"]
  }),
  article({
    title: "Pay-at-Close for Real Estate Agents: What It Means and How to Prepare",
    slug: "pay-at-close-real-estate-agents",
    category: "Brokerage & Commission Education",
    tags: ["pay at close", "agent fees", "commission timing"],
    image: "pay-at-close-real-estate-agents.png",
    alt: "Closing table with commission worksheet, brass pen, keys, and pay-at-close planning notes.",
    caption: "Pay-at-close models require agents to plan for cash flow, timing, and transaction uncertainty.",
    meta: "Learn what pay-at-close can mean for real estate agents and how to plan for fees, cash flow, and closing timing.",
    intro: "Pay-at-close usually describes costs that are paid when a transaction closes instead of upfront. That can be helpful for cash flow, but it does not remove the need to understand the fee schedule, failed-transaction risk, and timing.",
    sections: [
      sec("Understand the phrase before relying on it", "Pay-at-close can mean different things depending on the brokerage, vendor, or service provider. It might apply to a transaction fee, marketing expense, platform cost, commission advance, or other charge. Ask for the written terms.", ["What exact fee is deferred?", "When is it due?", "What happens if the transaction does not close?", "Are there extra charges for deferment?"]),
      sec("Plan for transactions that change", "Closings can be delayed, amended, terminated, or moved to a different timeline. If a fee is due only at closing, confirm what happens when the deal falls apart. If a fee becomes due anyway, budget for that possibility.", ["Inspection termination", "Financing delay", "Title issue", "Buyer or seller default question", "Closing rescheduled into a new month"]),
      sec("Do not confuse cash flow with profitability", "Deferring a payment can help monthly cash flow, but it does not automatically make a transaction more profitable. Compare total cost, support received, and how often you expect to close. Agents should track expenses by transaction.", ["Commission earned", "Brokerage fees", "MLS and association costs", "Marketing and travel", "Taxes and professional services"]),
      sec("Ask how payment is processed", "Commission disbursement procedures matter. Agents should know whether fees are deducted from commission, invoiced separately, or paid through another platform. Broker and closing office procedures should be followed.", ["Who receives the commission?", "What documentation is needed?", "When does the agent receive funds?", "What deductions appear on the statement?"]),
      sec("Build a reserve anyway", "A pay-at-close structure should not replace a basic business reserve. Agents still need money for licensing, dues, gas, marketing, signs, lockboxes, continuing education, and personal expenses during slow months.", ["Separate business checking", "Expense tracker", "Tax reserve", "Emergency transaction fund"]),
      sec("Preparation checklist", "Before choosing a pay-at-close arrangement, compare written terms, failed-closing rules, support level, payment processing, and total annual cost. If terms are unclear, ask your broker or an appropriate professional before proceeding.", ["Written fee schedule reviewed", "Failed-closing rule understood", "Commission disbursement process clear", "Annual cost estimate complete", "Broker questions answered"])
    ],
    related: ["flat-fee-real-estate-brokerage-georgia-agents", "choose-real-estate-brokerage-georgia", "first-real-estate-closing-checklist"]
  }),
  article({
    title: "Listing Prep Checklist for Georgia Real Estate Agents",
    slug: "listing-prep-checklist-georgia-agents",
    category: "Listing Preparation",
    tags: ["listing checklist", "seller preparation", "marketing"],
    image: "listing-prep-checklist-georgia-agents.png",
    alt: "Listing preparation checklist with home keys, staging notes, photo schedule, and contract folder.",
    caption: "A listing launch is smoother when pricing, property details, media, and seller expectations are organized early.",
    meta: "A practical listing preparation checklist for Georgia agents covering seller intake, property details, pricing, photos, MLS, and launch readiness.",
    intro: "A strong listing launch is built before the property goes live. Agents need accurate property information, seller-approved details, pricing context, media preparation, disclosure conversations, and a clear marketing timeline.",
    sections: [
      sec("Start with seller goals and constraints", "Before pricing or photos, clarify why the seller is moving, preferred timeline, occupancy, showing limits, payoff questions, repairs, and decision makers. This helps the agent structure the launch around real constraints.", ["Move date", "Occupancy and pets", "HOA or condo documents", "Known repairs or defects", "Preferred communication method"]),
      sec("Gather property facts carefully", "Listing accuracy matters. Agents should verify tax records, lot information, property features, utilities, HOA details, school information, and seller-provided improvements. If a fact affects a decision, encourage independent verification through the appropriate source.", ["Parcel and tax details", "Square footage source", "HOA fees and rules", "Utility providers", "Renovation permits or receipts"]),
      sec("Prepare pricing context", "Pricing is not just pulling similar sales. Review active competition, pending listings, recent sales, property condition, concessions, days on market, and seller goals. Avoid guaranteeing a sale price or timeline.", ["Comparable sales", "Current competition", "Condition adjustments", "Buyer feedback plan", "Price review date"]),
      sec("Plan media and showing readiness", "Photos, floor plans, video, and showing access should be scheduled after the property is clean, safe, and ready. Agents should confirm photo permissions, sign placement, lockbox procedures, and showing instructions with their broker and MLS.", ["Photo appointment", "Staging checklist", "Lockbox and key plan", "Showing windows", "Safety notes"]),
      sec("Review marketing and compliance", "Marketing should follow broker, MLS, fair housing, and advertising rules. Public remarks should describe the property accurately without prohibited language, unsupported claims, or private instructions that belong elsewhere.", ["Broker disclosure", "MLS remarks", "Photo rules", "Fair housing review", "Seller approval before launch"]),
      sec("Listing launch checklist", "Use a final launch checklist before activation. Confirm documents, pricing, media, MLS fields, seller approval, showing setup, sign installation, and follow-up cadence.", ["Listing agreement complete", "Seller disclosures addressed", "Photos uploaded", "MLS data reviewed", "Seller launch email sent"])
    ],
    related: ["fmls-vs-georgia-mls-agents", "georgia-real-estate-advertising-basics-agents", "real-estate-agent-vendor-list"]
  }),
  article({
    title: "Buyer Agent Checklist for Georgia Real Estate Transactions",
    slug: "buyer-agent-checklist-georgia-real-estate",
    category: "Buyer Representation",
    tags: ["buyer agent", "transaction checklist", "Georgia buyers"],
    image: "buyer-agent-checklist-georgia-real-estate.png",
    alt: "Buyer agent transaction checklist with keys, map pins, loan folder, and Georgia home silhouettes.",
    caption: "Buyer representation requires organized intake, property review, offer preparation, and deadline tracking.",
    meta: "A buyer agent checklist for Georgia real estate transactions, from intake and financing to offers, inspections, and closing preparation.",
    intro: "Buyer-side work can move quickly. A checklist helps agents organize the client intake, property search, showing plan, offer strategy, inspection period, financing updates, and closing preparation without relying on memory.",
    sections: [
      sec("Start with client intake", "Before showings, clarify budget, financing status, timing, location priorities, property type, must-haves, decision makers, and communication preferences. Ask what tradeoffs the buyer is willing to make before the market forces a rushed decision.", ["Pre-approval or proof of funds", "Preferred areas", "Commute and lifestyle needs", "Cash needed for closing", "Representation questions"]),
      sec("Set search expectations", "Buyers need to understand that listings change, information can be incomplete, and property details should be verified. Explain how MLS alerts work, how quickly strong listings may move, and how you will handle showing requests.", ["Daily search cadence", "Showing availability", "Backup properties", "Information to verify independently"]),
      sec("Prepare for offers before touring", "A buyer who understands offer terms can move more confidently. Discuss price, earnest money, due diligence, inspection planning, financing contingencies, appraisal questions, closing timeline, and seller concessions in general terms before a specific offer is urgent.", ["Offer deadline process", "Estimated cash needed", "Lender communication", "Attorney or closing office questions", "Broker review path"]),
      sec("Track deadlines visibly", "Once under contract, use a transaction calendar. Deadlines can involve earnest money delivery, inspection period, financing, appraisal, title, HOA documents, insurance, walk-through, and closing. Confirm contract-specific dates with your broker or transaction coordinator.", ["Earnest money due date", "Inspection deadline", "Loan milestones", "Closing date", "Possession terms"]),
      sec("Communicate without over-advising", "Buyer agents coordinate, explain process, and help clients ask better questions. They should avoid legal, tax, lending, inspection, or repair advice that belongs to another professional. The agent can help organize information without replacing specialists.", ["Refer lending questions to the lender.", "Refer title questions to the closing attorney.", "Refer defect questions to inspectors or contractors.", "Refer tax questions to a tax professional."]),
      sec("Buyer transaction checklist", "Use the same checklist for every buyer transaction, then customize it for the contract. Consistency protects the client experience and helps the agent stay calm under deadline pressure.", ["Intake complete", "Financing confirmed", "Offer terms reviewed", "Contract calendar created", "Closing preparation started"])
    ],
    related: ["earnest-money-guide-real-estate-agents", "first-real-estate-closing-checklist", "new-georgia-real-estate-agent-first-client-checklist"]
  }),
  article({
    title: "What Real Estate Agents Should Know About Earnest Money",
    slug: "earnest-money-guide-real-estate-agents",
    category: "Transaction Basics",
    tags: ["earnest money", "contracts", "transaction basics"],
    image: "earnest-money-guide-real-estate-agents.png",
    alt: "Earnest money guide with deposit envelope, contract pages, keys, and deadline checklist.",
    caption: "Earnest money is a contract and deadline issue, not just a deposit amount.",
    meta: "A compliance-minded earnest money guide for agents covering timing, holder questions, documentation, and client communication.",
    intro: "Earnest money is often described as a good-faith deposit, but agents should think about it as a contract-driven deadline and documentation issue. The amount, holder, delivery method, due date, and release process should be handled carefully.",
    sections: [
      sec("Read the contract terms first", "Earnest money obligations come from the written agreement and any applicable instructions. Agents should not assume the due date, holder, or delivery method. Read the contract and confirm questions with the broker or closing professional.", ["Amount", "Holder", "Due date", "Delivery method", "Receipt documentation"]),
      sec("Explain without giving legal advice", "Agents can explain the general process, but legal consequences should be directed to an attorney or broker as appropriate. Avoid promising whether a buyer will get earnest money back or whether a seller can keep it.", ["Use process language.", "Refer dispute questions to the right professional.", "Document delivery and receipt.", "Avoid casual guarantees."]),
      sec("Track delivery like a deadline", "Earnest money should be tracked the same way agents track inspections or closing. Put the due date on the transaction calendar, remind the client early, and obtain confirmation once delivered.", ["Calendar reminder", "Client instruction", "Delivery confirmation", "File upload or receipt", "Broker notification"]),
      sec("Know who holds the funds", "The holder may be a broker, closing attorney, escrow agent, or another agreed party depending on the contract. Agents should understand their brokerage policy and avoid handling funds outside approved procedures.", ["Broker trust account procedures", "Closing attorney instructions", "Wire or certified funds rules", "Receipt requirements"]),
      sec("Prepare for disputes carefully", "If a transaction terminates and earnest money is disputed, agents should slow down. Release procedures can involve signatures, agreement, deadlines, or legal questions. Direct clients to the appropriate professional rather than improvising.", ["Do not pressure a release.", "Keep communications factual.", "Escalate to broker.", "Recommend legal advice when needed."]),
      sec("Earnest money checklist", "A simple checklist reduces risk. It should capture the amount, holder, due date, delivery instructions, receipt, file upload, and follow-up if anything changes.", ["Amount confirmed", "Holder confirmed", "Due date calendared", "Receipt obtained", "Broker questions resolved"])
    ],
    related: ["buyer-agent-checklist-georgia-real-estate", "first-real-estate-closing-checklist", "georgia-real-estate-advertising-basics-agents"]
  }),
  article({
    title: "How to Build a Vendor List as a Real Estate Agent",
    slug: "real-estate-agent-vendor-list",
    category: "Agent Business Growth",
    tags: ["vendor list", "agent systems", "client service"],
    image: "real-estate-agent-vendor-list.png",
    alt: "Real estate vendor list builder with contractor cards, closing folder, keys, and a laptop.",
    caption: "A vendor list is a service system, not a guarantee of results.",
    meta: "Learn how agents can build a practical vendor list for lenders, inspectors, attorneys, photographers, contractors, and client service.",
    intro: "A vendor list helps agents serve clients faster, but it should be built carefully. The goal is to provide options, track performance, and help clients ask better questions without guaranteeing another professional's work.",
    sections: [
      sec("Start with categories clients ask about", "Build the list around actual client questions. Most agents need contacts for lenders, closing attorneys, inspectors, insurance, photographers, cleaners, movers, contractors, pest control, surveyors, and property managers.", ["Lender and mortgage contacts", "Home inspectors", "Closing attorneys", "Insurance agents", "Photographers and cleaners"]),
      sec("Vet before recommending", "Do not add someone just because they are friendly. Ask about licensing where relevant, service area, response time, fees, insurance, capacity, and how they communicate. Track actual client feedback over time.", ["Service area", "Turnaround time", "Pricing transparency", "Professional licensing or insurance", "Client communication style"]),
      sec("Offer options, not guarantees", "A vendor list should not sound like a promise. Clients should be free to choose their own providers, compare options, and conduct their own due diligence. Agents should disclose any relationships or referral arrangements required by law or broker policy.", ["Provide multiple options when possible.", "Avoid saying a vendor is guaranteed.", "Disclose material relationships where required.", "Encourage independent evaluation."]),
      sec("Keep the list organized", "A useful list needs structure. Track category, name, contact, service area, notes, last verified date, and client feedback. Remove vendors who stop responding or create repeated issues.", ["Category", "Contact details", "Service area", "Last verified", "Notes and feedback"]),
      sec("Use the list during transactions", "The vendor list should support the transaction calendar. Buyers may need inspectors quickly. Sellers may need cleaners or repair quotes before photos. Investors may need property managers or contractors.", ["Buyer inspection period", "Seller pre-listing preparation", "Closing insurance needs", "Post-closing repairs"]),
      sec("Vendor list builder checklist", "Review the list quarterly. Confirm contact details, update service areas, remove stale contacts, and add notes from recent transactions. A stale vendor list creates false confidence.", ["Verify contact info", "Confirm service area", "Review feedback", "Remove inactive vendors", "Add backup options"])
    ],
    related: ["listing-prep-checklist-georgia-agents", "buyer-agent-checklist-georgia-real-estate", "referral-based-real-estate-business"]
  }),
  article({
    title: "How Part-Time Real Estate Agents Can Stay Productive",
    slug: "part-time-real-estate-agent-productivity",
    category: "Agent Business Growth",
    tags: ["part-time agents", "productivity", "agent systems"],
    image: "part-time-real-estate-agent-productivity.png",
    alt: "Part-time agent productivity planner with calendar blocks, keys, phone, and real estate folders.",
    caption: "Part-time agents need clear boundaries, repeatable systems, and broker support they can access.",
    meta: "A practical productivity guide for part-time real estate agents balancing clients, compliance, lead follow-up, and limited hours.",
    intro: "Part-time real estate can work, but it cannot be casual. Clients still need timely communication, deadlines still matter, and contracts do not pause because an agent has another job. Productivity comes from boundaries, systems, and honest capacity planning.",
    sections: [
      sec("Choose a narrow service lane", "A part-time agent should avoid trying to serve every lead type. Pick a lane that fits your availability: referrals, rentals, buyers in a specific area, weekend showings, investor networking, or past-client support.", ["Referral coordination", "Rental clients", "First-time buyers", "Specific neighborhoods", "Investor introductions"]),
      sec("Set response windows", "Clients do not need constant access, but they do need clarity. Set realistic communication windows and backup support. If you cannot respond during critical offer or inspection periods, coordinate with your broker or another approved resource.", ["Morning check-in", "Lunch follow-up", "Evening client calls", "Weekend showing blocks"]),
      sec("Use checklists for every workflow", "Limited hours make memory unreliable. Use checklists for buyer intake, listing prep, rental showings, referrals, and closing preparation. Templates let you focus on client judgment instead of recreating the process.", ["Lead intake form", "Showing confirmation template", "Offer prep checklist", "Transaction calendar", "Closing week checklist"]),
      sec("Protect compliance time", "Do not squeeze document review into rushed moments. Schedule time to read contracts, submit files, review advertising, and ask broker questions. If you cannot meet a deadline responsibly, do not take the assignment alone.", ["Contract reading block", "Broker question list", "File submission time", "Advertising review"]),
      sec("Build referral relationships", "Part-time agents can build value by becoming a trusted connector. If a client needs service outside your capacity or market, a documented referral process may be more professional than overextending.", ["Maintain agent contacts", "Use referral agreements", "Follow up respectfully", "Track closed referrals"]),
      sec("Weekly productivity checklist", "A part-time schedule should include a small weekly operating rhythm. Review leads, active clients, deadlines, content, vendor contacts, and broker questions before the week gets busy.", ["Review active deadlines", "Follow up with warm contacts", "Update CRM notes", "Schedule content or outreach", "Send broker questions early"])
    ],
    related: ["real-estate-referral-commissions-georgia", "rental-commissions-real-estate-agents", "new-real-estate-agent-mistakes"]
  }),
  article({
    title: "How Agents Can Build a Referral-Based Real Estate Business",
    slug: "referral-based-real-estate-business",
    category: "Agent Business Growth",
    tags: ["referral business", "agent growth", "relationships"],
    image: "referral-based-real-estate-business.png",
    alt: "Referral-based real estate business map with connected contact cards, keys, and homes.",
    caption: "Referral businesses are built through consistent value, clear handoffs, and trustworthy follow-up.",
    meta: "A practical guide to building a referral-based real estate business through relationships, service systems, and documented handoffs.",
    intro: "A referral-based business is not built by asking everyone for leads once. It is built through consistent follow-up, useful education, clear service lanes, and a reputation for careful handoffs when a client needs help.",
    sections: [
      sec("Define who you serve", "People refer more easily when they understand what you do. Be specific about your market, client type, transaction type, or referral lane. A clear message beats a vague request for anyone who wants to buy or sell.", ["New Georgia agents", "First-time buyers", "Investor referrals", "Rental clients", "Relocation clients"]),
      sec("Create useful touchpoints", "Referral relationships grow when your follow-up is useful. Send checklists, market education, home maintenance reminders, investor due diligence questions, or agent resource links instead of generic sales messages.", ["Quarterly check-in", "Client anniversary note", "Useful checklist", "Local property question", "Vendor introduction"]),
      sec("Make handoffs professional", "When someone refers a client, respond quickly and document the next step. If you are referring out, confirm client consent, market fit, and written terms before making the introduction.", ["Client consent", "Receiving professional contact", "Referral agreement", "Follow-up cadence"]),
      sec("Track relationships in a simple CRM", "A spreadsheet can work if it is maintained. Track name, relationship, last contact, next follow-up, client needs, referral history, and notes. The system should be easy enough to use weekly.", ["Last conversation", "Referral source", "Next follow-up", "Preferred topics", "Closed-loop thank-you"]),
      sec("Protect trust", "Do not send referrals to unvetted providers, overstate expertise, or pressure people for leads. Referral value depends on trust. When you do not know the answer, say so and connect the person to the right professional.", ["No guaranteed outcomes", "Clear scope", "Vetted contacts", "Honest capacity"]),
      sec("Referral business checklist", "A referral-based business needs a clear niche, contact list, follow-up calendar, vendor and agent network, referral paperwork path, and a habit of closing the loop.", ["Define service lane", "Build contact list", "Schedule follow-up", "Document referrals", "Thank sources appropriately"])
    ],
    related: ["real-estate-referral-commissions-georgia", "real-estate-agent-vendor-list", "part-time-real-estate-agent-productivity"]
  }),
  article({
    title: "Real Estate Agent Branding: How to Build Trust Without Overcomplicating It",
    slug: "real-estate-agent-branding-guide",
    category: "Agent Branding",
    tags: ["agent branding", "trust", "marketing"],
    image: "real-estate-agent-branding-guide.png",
    alt: "Agent branding workspace with color swatches, business cards without logos, keys, and listing folder.",
    caption: "Good branding makes an agent easier to understand, remember, and trust.",
    meta: "A practical real estate agent branding guide focused on trust, clarity, consistency, and compliance-minded public presentation.",
    intro: "Agent branding does not have to be complicated. The point is to make your role, market, service style, and contact path clear. Good branding supports trust; it does not replace competence, broker compliance, or client service.",
    sections: [
      sec("Start with positioning, not design", "Before choosing colors or photos, answer simple questions: who do you serve, what problems do you help with, what market do you know, and what should people ask you about? Design should support that clarity.", ["Client type", "Market area", "Service lane", "Tone of voice", "Main call to action"]),
      sec("Keep your public identity consistent", "Use consistent name format, phone number, email, headshot or brand image, brokerage disclosure where required, and service description. Inconsistency makes people wonder whether they found the right person.", ["Website", "Google profile", "Social media", "Business cards", "Email signature"]),
      sec("Build trust with helpful content", "The strongest agent branding often comes from useful explanations. Answer common questions about buying, selling, rentals, referrals, inspections, financing conversations, and local process. Avoid unsupported claims or guaranteed outcomes.", ["Checklists", "Short explainers", "Neighborhood preparation questions", "Buyer and seller timelines"]),
      sec("Respect advertising rules", "Agent branding is still advertising when it promotes real estate services. Ask your broker about required disclosures, team names, DBA rules, social media content, signs, and approval steps before publishing.", ["Broker name and phone where required", "License status language", "Fair housing review", "MLS photo and data rules"]),
      sec("Do not overbuild too early", "A new agent does not need an elaborate brand system. A clean website page, accurate profile, professional email signature, simple content plan, and compliant business card are enough to start.", ["One clear profile page", "Simple contact path", "Three useful guides", "Consistent colors and typography"]),
      sec("Branding checklist", "Use a short checklist before launching a public profile. Confirm clarity, compliance, accuracy, contact path, and whether the content helps the visitor make a better decision.", ["Service lane is clear", "Contact information works", "Broker review complete", "Claims are supportable", "Content is useful"])
    ],
    related: ["dba-branding-real-estate-agents", "georgia-real-estate-advertising-basics-agents", "referral-based-real-estate-business"]
  }),
  article({
    title: "DBA Branding for Real Estate Agents: What to Think Through",
    slug: "dba-branding-real-estate-agents",
    category: "Agent Branding",
    tags: ["DBA", "branding", "advertising compliance"],
    image: "dba-branding-real-estate-agents.png",
    alt: "DBA branding planning board with folders, neutral business cards, keys, and compliance checklist.",
    caption: "DBA branding should be reviewed carefully before public use.",
    meta: "A compliance-minded guide for agents thinking about DBA branding, public names, broker rules, and advertising review.",
    intro: "A DBA or separate brand name can make marketing feel more polished, but it can also create confusion if consumers cannot tell who the broker is, who the licensed agent is, or what entity is responsible. Agents should slow down and review requirements before using a DBA publicly.",
    sections: [
      sec("Clarify what problem the DBA solves", "A separate brand name should have a business reason. It might describe a niche, geographic focus, investor resource, team identity, or education platform. If it only adds complexity, a simple personal or site brand may be better.", ["Niche clarity", "Memorable public name", "Content platform", "Team or referral network", "Investor education resource"]),
      sec("Check broker and state requirements", "Before ordering signs, launching a website, or publishing social profiles, ask your broker what is allowed. DBA, trade name, team name, and advertising rules can involve broker approval, disclosures, registrations, or specific wording.", ["Broker approval", "Trade name registration questions", "Advertising disclosure", "License status", "Fair housing concerns"]),
      sec("Avoid consumer confusion", "A consumer should not be misled about whether they are dealing with a brokerage, team, individual licensee, media site, referral source, or education resource. Use clear language and avoid implying authority you do not have.", ["Who provides brokerage services?", "Who publishes educational content?", "Where does the broker disclosure appear?", "How can a consumer contact the responsible party?"]),
      sec("Plan the full brand footprint", "A DBA is not just a logo. It can affect domains, email, business cards, social media handles, yard signs, listing presentations, email signatures, and online profiles. Review the full footprint before launch.", ["Domain name", "Email address", "Signage", "Social profiles", "Printed material"]),
      sec("Document approvals", "If your broker approves a brand name or advertising format, save the approval. Keep copies of designs, disclosure language, and revisions. This helps avoid confusion later if a platform, MLS, or regulator asks questions.", ["Approval email", "Final design files", "Disclosure wording", "Review date", "Updated versions"]),
      sec("DBA decision checklist", "Before using a DBA publicly, confirm purpose, legal name questions, broker approval, required disclosure, domain ownership, social profiles, and a plan for corrections.", ["Purpose is clear", "Broker reviewed", "Disclosure included", "No fake brokerage impression", "Update process exists"])
    ],
    related: ["real-estate-agent-branding-guide", "georgia-real-estate-advertising-basics-agents", "choose-real-estate-brokerage-georgia"]
  }),
  article({
    title: "Common Mistakes New Real Estate Agents Make After Getting Licensed",
    slug: "new-real-estate-agent-mistakes",
    category: "Agent Basics",
    tags: ["new agent mistakes", "agent basics", "business planning"],
    image: "new-real-estate-agent-mistakes.png",
    alt: "New real estate agent mistake checklist with crossed-out clutter, keys, and a clean planning notebook.",
    caption: "Many early mistakes can be avoided with clearer systems and earlier broker questions.",
    meta: "A plain-English guide to common new real estate agent mistakes and how to avoid them with better systems and expectations.",
    intro: "Getting licensed is a milestone, but it is not the same as being ready to operate a real estate business. New agents often struggle because they focus on the license itself and delay the systems, supervision, and client-readiness work that comes next.",
    sections: [
      sec("Choosing a brokerage only by split", "Commission split matters, but new agents also need supervision, contract help, training, file review, advertising guidance, and a clear support path. A high split with little help can become expensive quickly.", ["Compare support, not only percentages.", "Ask who reviews early files.", "Understand all recurring fees."]),
      sec("Publishing marketing before review", "New agents often rush social media pages, websites, and business cards without confirming broker advertising rules. Slow down and get approval before public launch.", ["Broker disclosure", "License language", "Fair housing issues", "Team or DBA wording"]),
      sec("Waiting too long to build a process", "A lead can become a client before you feel ready. Create intake forms, buyer checklists, listing prep lists, vendor contacts, and transaction calendars before the first serious conversation.", ["Buyer intake", "Seller intake", "Vendor list", "Offer prep checklist", "Closing checklist"]),
      sec("Trying to answer every specialist question", "Clients may ask about lending, taxes, legal rights, repairs, zoning, insurance, and investments. Agents should help coordinate, but they should not pretend to replace attorneys, lenders, inspectors, tax professionals, or local authorities.", ["Know referral points.", "Use cautious language.", "Document professional recommendations."]),
      sec("Ignoring follow-up discipline", "Real estate business grows through consistent follow-up. New agents often make one announcement and then stop. A simple weekly contact plan is better than an elaborate plan that never happens.", ["Past contacts", "Open-house leads", "Vendor relationships", "Referral sources"]),
      sec("Mistake-prevention checklist", "The fix is not complicated. Build a support chain, review advertising, create first-client checklists, track expenses, and ask questions before deadlines become urgent.", ["Support contacts saved", "Marketing approved", "Client workflows ready", "Business expenses tracked", "Broker questions documented"])
    ],
    related: ["new-georgia-real-estate-agent-first-client-checklist", "choose-real-estate-brokerage-georgia", "georgia-real-estate-advertising-basics-agents"]
  }),
  article({
    title: "Georgia Real Estate Advertising Basics for Agents",
    slug: "georgia-real-estate-advertising-basics-agents",
    category: "Compliance-Minded Guides",
    tags: ["advertising compliance", "Georgia agents", "marketing"],
    image: "georgia-real-estate-advertising-basics-agents.png",
    alt: "Georgia real estate advertising review desk with social media cards, disclosure folder, and compliance checklist.",
    caption: "Advertising should be clear, truthful, broker-reviewed, and compliant with current rules.",
    meta: "A compliance-minded overview of Georgia real estate advertising basics for agents, including broker review, disclosures, fair housing, and online content.",
    intro: "Real estate advertising is any public-facing promotion that can affect how consumers understand services, properties, brokerage relationships, or agent identity. Georgia agents should treat advertising as a compliance issue, not only a design task.",
    sections: [
      sec("Start with broker guidance", "Your broker's advertising policy should be the first stop. Ask what must be reviewed, where broker disclosure must appear, how team or DBA names are handled, and what platforms are covered. Policies may apply to websites, social media, signs, flyers, email, and video.", ["Websites", "Social posts", "Business cards", "Yard signs", "Listing flyers"]),
      sec("Use clear identity language", "Consumers should be able to understand who is advertising, who the brokerage is, and how to contact the responsible party where required. Avoid designs or names that make an agent brand look like an unaffiliated brokerage.", ["Agent name or resource identity", "Brokerage disclosure where required", "Contact information", "No misleading trade names"]),
      sec("Avoid unsupported claims", "Advertising should not promise guaranteed savings, income, appreciation, financing approval, legal results, or investment returns. If a statement is factual, be prepared to support it. If it is a personal opinion, do not present it as a guaranteed result.", ["No guaranteed sale price", "No guaranteed rental income", "No fake awards or certifications", "No fabricated testimonials"]),
      sec("Review fair housing concerns", "Real estate advertising should be reviewed through a fair housing lens. Avoid language that suggests preference, limitation, exclusion, or steering. When unsure, check with your broker, attorney, MLS, or appropriate regulator.", ["Property features, not protected classes", "Neutral neighborhood descriptions", "Careful image and audience choices", "No steering language"]),
      sec("Be careful with MLS data and photos", "Listing photos, remarks, status information, and MLS data may have usage rules. Do not copy media or listing data casually. Confirm permissions, attribution rules, and platform requirements before republishing.", ["Photo permission", "Listing status accuracy", "Public remarks rules", "Data display rules"]),
      sec("Advertising review checklist", "Before publishing, review the audience, claim support, broker disclosure, fair housing language, image rights, MLS rules, and correction process. If the content creates doubt, pause and ask before posting.", ["Broker policy checked", "Disclosure visible where required", "Claims supportable", "Fair housing review complete", "Correction path ready"])
    ],
    related: ["real-estate-agent-branding-guide", "dba-branding-real-estate-agents", "fmls-vs-georgia-mls-agents"]
  }),
  article({
    title: "How to Prepare for Your First Real Estate Closing",
    slug: "first-real-estate-closing-checklist",
    category: "Transaction Basics",
    tags: ["closing checklist", "transaction basics", "new agents"],
    image: "first-real-estate-closing-checklist.png",
    alt: "First closing preparation checklist with closing folder, keys, brass pen, and calendar.",
    caption: "Closing preparation starts well before closing day.",
    meta: "A first closing preparation checklist for agents covering documents, lender updates, title questions, walk-through, and client communication.",
    intro: "The first closing can feel intimidating because many people and documents are involved. Agents do not need to do every professional's job, but they do need to coordinate communication, track contract obligations, and help clients prepare for the day.",
    sections: [
      sec("Start with the contract calendar", "Closing preparation begins when the contract is signed. Track financing deadlines, inspection and due diligence periods, title work, appraisal, insurance, HOA documents, and closing date. Confirm the calendar with your broker or transaction coordinator.", ["Binding date", "Earnest money deadline", "Inspection period", "Loan milestones", "Closing date"]),
      sec("Coordinate with lender and closing office", "For financed transactions, the lender and closing office drive many closing requirements. Agents should keep communication clear without giving lending or legal advice. Encourage clients to respond quickly to professional requests.", ["Loan conditions", "Closing disclosure questions", "Title or deed questions", "Wire instructions warning", "Appointment scheduling"]),
      sec("Prepare the client", "Clients may need identification, funds, insurance, utility planning, keys, remote signing questions, and time off work. Provide a general closing-week checklist and direct legal, tax, and lending questions to the appropriate professional.", ["Government ID", "Certified funds or wire process", "Insurance confirmation", "Utility transfer", "Final walk-through"]),
      sec("Plan the final walk-through", "The final walk-through is not a new inspection. It is usually a chance to confirm agreed condition, repairs, and possession-related details. Agents should review contract terms and ask the broker about any concerns before closing.", ["Utilities on", "Repairs documented", "Personal property terms", "Keys and access devices", "Possession timing"]),
      sec("Avoid closing day surprises", "Most closing problems are easier to solve earlier. Confirm file completion, commission instructions, client funds, appointment time, wiring cautions, and outstanding amendments before closing day.", ["File submitted", "Commission instructions confirmed", "Client appointment confirmed", "Outstanding invoices addressed", "Broker questions resolved"]),
      sec("First closing checklist", "Use a visible checklist so the final week is calm. Include contract calendar, lender update, closing office update, insurance, utilities, walk-through, documents, keys, and post-closing follow-up.", ["Calendar reviewed", "Closing office confirmed", "Walk-through scheduled", "Client checklist sent", "Post-closing follow-up planned"])
    ],
    related: ["earnest-money-guide-real-estate-agents", "buyer-agent-checklist-georgia-real-estate", "pay-at-close-real-estate-agents"]
  }),
  article({
    title: "Short-Term Rental Investing Basics for Georgia Property Owners",
    slug: "short-term-rental-investing-georgia-basics",
    category: "Investor Education",
    tags: ["short-term rentals", "investing", "Georgia property"],
    image: "short-term-rental-investing-georgia-basics.png",
    alt: "Short-term rental investing desk with property keys, calendar, laptop, and Georgia home silhouettes.",
    caption: "Short-term rental investing requires local rule checks, expense planning, and realistic operations.",
    meta: "A beginner-friendly guide to short-term rental investing basics for Georgia property owners, including local rules, operations, and risk questions.",
    intro: "Short-term rental investing can look simple from the outside: buy a property, furnish it, list it, and collect bookings. In practice, owners need to understand local rules, HOA limits, taxes, insurance, operations, guest risk, and cash flow before committing.",
    sections: [
      sec("Check local rules first", "Short-term rental rules can vary by city, county, zoning district, HOA, condo association, and platform. Before buying or converting a property, confirm whether short-term rental use is allowed and what permits or taxes may apply.", ["City or county rules", "Zoning", "HOA or condo restrictions", "Business license questions", "Occupancy and safety rules"]),
      sec("Model realistic expenses", "Revenue screenshots do not tell the full story. Owners should model mortgage, taxes, insurance, utilities, furnishings, cleaning, supplies, repairs, platform fees, management, vacancy, and reserves. Tax questions should go to a tax professional.", ["Cleaning", "Utilities", "Furniture replacement", "Maintenance", "Management fees", "Local taxes"]),
      sec("Think like an operator", "Short-term rentals are hospitality businesses. Guests expect clean spaces, quick communication, reliable access, accurate listings, and fast issue resolution. Owners who cannot manage operations may need professional management.", ["Guest messaging", "Turnover schedule", "Lock and access systems", "Emergency repairs", "House rules"]),
      sec("Evaluate property fit", "Not every property is a good short-term rental. Consider parking, noise, neighbors, bedroom count, bathroom count, safety, location, amenities, and whether long-term rental or resale value still works if short-term rental rules change.", ["Parking", "Noise sensitivity", "HOA environment", "Backup exit strategy", "Insurance availability"]),
      sec("Avoid return guarantees", "No one should guarantee bookings, appreciation, or investment returns. Investors should stress-test conservative scenarios and consult lenders, tax professionals, insurance agents, attorneys, and local authorities before deciding.", ["Lower occupancy scenario", "Higher repair costs", "Rule change risk", "Seasonality", "Management turnover"]),
      sec("Short-term rental due diligence checklist", "Before buying or launching, collect rule confirmations, expense estimates, insurance quotes, management options, furnishing budget, reserve plan, and backup rental strategy.", ["Local rules checked", "HOA documents reviewed", "Expense model built", "Insurance quote obtained", "Backup strategy identified"])
    ],
    related: ["real-estate-long-term-wealth-building", "rental-commissions-real-estate-agents", "real-estate-agent-vendor-list"]
  }),
  article({
    title: "Real Estate as a Tool for Building Long-Term Wealth",
    slug: "real-estate-long-term-wealth-building",
    category: "Investor Education",
    tags: ["wealth building", "investor education", "real estate basics"],
    image: "real-estate-long-term-wealth-building.png",
    alt: "Long-term real estate wealth planning desk with property folders, keys, calculator, and timeline.",
    caption: "Real estate can support long-term wealth when buyers understand risk, cash flow, debt, and patience.",
    meta: "A practical educational guide to real estate as a long-term wealth tool, covering cash flow, equity, leverage, risk, and due diligence.",
    intro: "Real estate can be part of a long-term wealth plan, but it is not automatic and it is not risk-free. Property ownership involves debt, maintenance, taxes, insurance, market cycles, tenant issues, and local rule changes. A good plan starts with education and conservative assumptions.",
    sections: [
      sec("Understand the main wealth drivers", "Real estate may build wealth through loan paydown, potential appreciation, cash flow, tax treatment, and inflation-resistant rents. Each driver depends on the property, financing, management, and market conditions. None should be treated as guaranteed.", ["Loan amortization", "Potential appreciation", "Rental income", "Tax considerations", "Operational control"]),
      sec("Cash flow matters", "A property can appreciate and still create stress if monthly expenses exceed income. Investors should estimate mortgage, taxes, insurance, vacancy, repairs, management, utilities, capital improvements, and reserves before buying.", ["Vacancy reserve", "Repair reserve", "Capital expenses", "Management cost", "Insurance changes"]),
      sec("Leverage cuts both ways", "Borrowed money can increase purchasing power, but it also increases risk. Higher payments, rate changes, repairs, or vacancies can strain the owner. Lending questions should be reviewed with qualified lenders and financial professionals.", ["Down payment", "Debt service", "Rate risk", "Refinance assumptions", "Personal liquidity"]),
      sec("Due diligence is the investor's job", "Investors should verify rent potential, local rules, property condition, title issues, HOA limits, insurance availability, taxes, and exit options. An agent can help coordinate, but specialists should handle specialist questions.", ["Inspection", "Rent research", "HOA review", "Insurance quote", "Local rule check"]),
      sec("Think in decades, not headlines", "Long-term wealth building is usually less dramatic than online content suggests. A durable plan emphasizes affordability, reserves, tenant quality, maintenance, and patience over speculation.", ["Conservative rent estimates", "Routine maintenance", "Exit strategy", "Portfolio review", "Professional advice"]),
      sec("Investor education checklist", "Before buying, write down your goal, time horizon, risk tolerance, financing path, cash reserves, management plan, and professional advisors. A checklist makes the decision less emotional.", ["Goal defined", "Numbers stress-tested", "Reserves planned", "Professional input gathered", "Exit strategy considered"])
    ],
    related: ["short-term-rental-investing-georgia-basics", "rental-commissions-real-estate-agents", "real-estate-agent-vendor-list"]
  })
];

imageAssets.push(
  ...articles.map((item) =>
    imageAsset(
      item.image,
      item.title,
      item.alt,
      `Featured image for ${item.title}`,
      `Create a polished editorial-style real estate education image for "${item.title}". Deep merlot, charcoal, ivory, and brass color palette. Modern Georgia/Atlanta-inspired real estate atmosphere. Include subtle elements such as keys, contract folders, city skyline silhouettes, homes, townhomes, apartment buildings, laptops, checklists, closing table details, agent notebook, lockbox, map pins, and tasteful brass accents as appropriate to the topic. No logos. No readable small text. No fake badges, certifications, or seals. Professional, trustworthy, premium, clean composition. 1600x900 landscape feature image aspect ratio.`,
      "1600x900"
    )
  )
);

const downloads = [
  downloadResource("Georgia Agent First-Client Checklist", "georgia-agent-first-client-checklist", "Agent Basics", "A printable readiness checklist for new Georgia agents before the first serious client conversation.", ["Broker support contacts saved", "Representation and disclosure path reviewed", "MLS/search access working", "Forms platform tested", "Public profiles checked for accuracy", "Vendor starter list prepared", "Buyer and seller intake questions drafted", "Transaction calendar template ready"], ["Use before buyer consultations, listing appointments, rental conversations, and referral handoffs.", "Bring unresolved questions to your broker before deadlines matter."]),
  downloadResource("Listing Prep Checklist", "listing-prep-checklist", "Listing Preparation", "A printable seller and listing launch preparation checklist.", ["Seller goals and timeline documented", "Property facts verified against available records", "HOA, condo, utility, and tax questions collected", "Pricing context reviewed", "Photo and showing plan scheduled", "MLS fields and remarks drafted", "Broker advertising review completed", "Seller launch approval documented"], ["Use this before ordering photos or activating a listing.", "Attach seller-approved property notes to your transaction file."]),
  downloadResource("Buyer Agent Transaction Checklist", "buyer-agent-transaction-checklist", "Buyer Representation", "A printable buyer-side transaction workflow from intake through closing.", ["Buyer intake complete", "Financing or proof of funds reviewed", "Search criteria entered", "Offer terms conversation held", "Earnest money deadline calendared", "Inspection and due diligence dates tracked", "Lender and closing office updates monitored", "Walk-through and closing preparation complete"], ["Customize all dates to the written contract.", "Refer lending, legal, tax, and inspection questions to the appropriate professional."]),
  downloadResource("Brokerage Comparison Worksheet", "brokerage-comparison-worksheet", "Brokerage & Commission Education", "A printable worksheet for comparing brokerage costs, support, fees, training, and brand rules.", ["Monthly fees", "Transaction fees", "Commission split or flat fee", "Broker accessibility", "Training included", "Advertising approval process", "Technology and forms support", "Exit or transfer terms"], ["Run the worksheet under realistic transaction examples.", "Do not choose solely by the headline split."]),
  downloadResource("Vendor List Builder", "vendor-list-builder", "Agent Business Growth", "A printable vendor tracking worksheet for agents building a practical service list.", ["Vendor category", "Name and company", "Contact information", "Service area", "Licensing or insurance notes where relevant", "Typical response time", "Client feedback", "Last verified date"], ["Offer options rather than guarantees.", "Review and refresh the list at least quarterly."]),
  downloadResource("First Closing Preparation Checklist", "first-closing-preparation-checklist", "Transaction Basics", "A printable first-closing checklist for agents coordinating final transaction steps.", ["Contract calendar reviewed", "Lender update requested", "Closing office appointment confirmed", "Insurance and utilities reminders sent", "Final walk-through scheduled", "Funds and ID reminders sent", "Commission instructions checked", "Post-closing follow-up planned"], ["Confirm transaction-specific questions with your broker or closing professional.", "Warn clients to verify wire instructions directly with the closing office."]),
  downloadResource("Referral Commission Question Sheet", "referral-commission-question-sheet", "Referrals & Rentals", "A printable question sheet for documenting referral commission expectations before a client handoff.", ["Client name and consent status", "Referring agent and brokerage", "Receiving agent and brokerage", "Market and transaction type", "Proposed referral fee", "Covered time period", "Payment trigger", "Broker signatures or approvals needed"], ["Use before introducing the client.", "Formal referral agreements should follow broker instructions."])
];

const mainPages = [
  "/",
  "/start-here/",
  "/education/",
  "/resource-center/",
  "/articles/",
  "/downloads/",
  "/about/",
  "/contact/",
  "/privacy-policy/",
  "/editorial-policy/",
  "/real-estate-disclaimer/",
  author.slug,
  ...articles.map((item) => `/${item.slug}/`),
  ...categories.map((item) => `/category/${item.slug}/`),
  ...downloads.map((item) => `/downloads/${item.slug}/`)
];

function imageAsset(fileName, title, alt, placement, prompt, intendedDimensions) {
  return { fileName, title, alt, caption: alt, placement, prompt, intendedDimensions };
}

function category(name, slug, description, image, featuredArticles) {
  return { name, slug, description, image, featuredArticles };
}

function sec(heading, body, bullets = []) {
  return { heading, body, bullets };
}

function article(config) {
  return config;
}

function downloadResource(title, slug, categoryName, description, checklist, notes) {
  return { title, slug, category: categoryName, description, checklist, notes };
}

function categoryByName(name) {
  return categories.find((item) => item.name === name);
}

function articleBySlug(slug) {
  return articles.find((item) => item.slug === slug);
}

function downloadBySlug(slug) {
  return downloads.find((item) => item.slug === slug);
}

function asset(fileName) {
  return imageAssets.find((item) => item.fileName === fileName) || {};
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function slugToPath(slug) {
  if (slug === "/") return path.join(rootDir, "index.html");
  const clean = slug.replace(/^\/|\/$/g, "");
  return path.join(rootDir, clean, "index.html");
}

function absoluteUrl(slug) {
  return `${siteUrl}${slug === "/" ? "/" : slug}`;
}

function categoryLink(name) {
  const item = categoryByName(name);
  return item ? `/category/${item.slug}/` : "/resource-center/";
}

function imageTag(fileName, className = "hero-image", loading = "lazy") {
  const item = asset(fileName);
  return `<figure class="${className}">
    <img src="/assets/images/${fileName}" alt="${escapeHtml(item.alt || "")}" loading="${loading}">
    ${item.caption ? `<figcaption>${escapeHtml(item.caption)}</figcaption>` : ""}
  </figure>`;
}

function linkCard({ href, title, text, meta = "", image = "" }) {
  return `<a class="card link-card" href="${href}">
    ${image ? `<img src="/assets/images/${image}" alt="${escapeHtml(asset(image).alt || title)}" loading="lazy">` : ""}
    <span class="card-meta">${escapeHtml(meta)}</span>
    <strong>${escapeHtml(title)}</strong>
    <span>${escapeHtml(text)}</span>
  </a>`;
}

function breadcrumb(items) {
  const links = [`<a href="/">Home</a>`, ...items.map((item) => (item.href ? `<a href="${item.href}">${escapeHtml(item.label)}</a>` : `<span>${escapeHtml(item.label)}</span>`))];
  return `<nav class="breadcrumbs" aria-label="Breadcrumb">${links.join("<span>/</span>")}</nav>`;
}

function toc(sections) {
  return `<nav class="toc" aria-label="Table of contents">
    <strong>On this page</strong>
    ${sections.map((section) => `<a href="#${sectionId(section.heading)}">${escapeHtml(section.heading)}</a>`).join("")}
  </nav>`;
}

function sectionId(heading) {
  return heading.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function authorBox() {
  return `<aside class="author-box">
    <img src="/assets/images/${author.image}" alt="Editorial desk avatar for The Agent Resource Desk" loading="lazy">
    <div>
      <p class="eyebrow">Written by ${author.name}</p>
      <p>${author.boxBio}</p>
      <p><strong>Disclaimer:</strong> This article is for general educational purposes only and is not legal, tax, financial, lending, or brokerage advice.</p>
      <a class="text-link" href="${author.slug}">View author profile</a>
    </div>
  </aside>`;
}

function resourceAuthorNote() {
  return `<aside class="author-box resource-author">
    <img src="/assets/images/${author.image}" alt="Editorial desk avatar for The Agent Resource Desk" loading="lazy">
    <div>
      <p class="eyebrow">Published by ${author.name}</p>
      <p>${author.bio}</p>
      <a class="text-link" href="${author.slug}">View author profile</a>
    </div>
  </aside>`;
}

function disclaimerBlock() {
  return `<aside class="disclaimer-block">
    <strong>Educational disclaimer</strong>
    <p>${escapeHtml(sitewideDisclaimer)}</p>
  </aside>`;
}

function relatedArticles(currentArticle) {
  const related = currentArticle.related.map(articleBySlug).filter(Boolean);
  return `<section class="content-band">
    <div class="section-heading">
      <p class="eyebrow">Keep reading</p>
      <h2>Related Articles</h2>
    </div>
    <div class="card-grid three">${related.map((item) => articleSummaryCard(item)).join("")}</div>
  </section>`;
}

function articleSummaryCard(item) {
  return linkCard({
    href: `/${item.slug}/`,
    title: item.title,
    text: item.meta,
    meta: item.category,
    image: item.image
  });
}

function downloadCard(item) {
  return linkCard({
    href: `/downloads/${item.slug}/`,
    title: item.title,
    text: item.description,
    meta: item.category
  });
}

function pageLayout({ title, description, slug, body, image = "", type = "website", schema = "", scripts = [] }) {
  const canonical = absoluteUrl(slug);
  const pageTitle = slug === "/" ? `${siteName} | ${siteTagline}` : `${title} | ${siteName}`;
  const socialImage = image ? `${siteUrl}/assets/images/${image}` : `${siteUrl}/assets/images/home-hero.png`;
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(pageTitle)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="${canonical}">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:type" content="${type}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${socialImage}">
  <link rel="icon" type="image/png" href="/assets/images/${author.image}">
  <link rel="stylesheet" href="/assets/css/styles.css">
  <script type="application/ld+json">${JSON.stringify(baseSchema(slug))}</script>
  ${schema ? `<script type="application/ld+json">${schema}</script>` : ""}
  ${scripts.map((src) => `<script src="${src}" defer></script>`).join("\n  ")}
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>
  <header class="site-header">
    <a class="brand" href="/" aria-label="${siteName} home">
      <span class="brand-mark">BR</span>
      <span><strong>${siteName}</strong><small>Georgia Real Estate Education</small></span>
    </a>
    <nav class="main-nav" aria-label="Main navigation">
      <a href="/">Home</a>
      <a href="/start-here/">Start Here</a>
      <a href="/education/">Education</a>
      <a href="/resource-center/">Resource Center</a>
      <a href="/articles/">Blog / Articles</a>
      <a href="/about/">About</a>
      <a href="/contact/">Contact</a>
    </nav>
  </header>
  <main id="main">${body}</main>
  <footer class="site-footer">
    <div>
      <strong>${siteName}</strong>
      <p>${escapeHtml(siteTagline)}</p>
      <p class="footer-disclaimer">${escapeHtml(sitewideDisclaimer)}</p>
      <p class="compliance-note"><strong>Advertising disclosure:</strong> ${escapeHtml(brokerageDisclosurePlaceholder)}</p>
    </div>
    <nav aria-label="Footer navigation">
      <a href="/privacy-policy/">Privacy Policy</a>
      <a href="/editorial-policy/">Editorial Policy</a>
      <a href="/real-estate-disclaimer/">Real Estate Disclaimer</a>
      <a href="/education/">Education</a>
      <a href="${author.slug}">${author.name}</a>
      <a href="/downloads/">Checklists & Downloads</a>
    </nav>
  </footer>
</body>
</html>`;
}

function baseSchema(slug) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: siteUrl,
    inLanguage: "en-US",
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/articles/?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    },
    sameAs: []
  };
}

function articleSchema(item) {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: item.title,
    description: item.meta,
    image: `${siteUrl}/assets/images/${item.image}`,
    author: {
      "@type": "Organization",
      name: author.name,
      description: author.bio,
      url: `${siteUrl}${author.slug}`
    },
    publisher: {
      "@type": "Organization",
      name: siteName,
      url: siteUrl
    },
    mainEntityOfPage: absoluteUrl(`/${item.slug}/`),
    articleSection: item.category,
    keywords: item.tags.join(", "),
    inLanguage: "en-US"
  });
}

function educationSchema() {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Course",
    name: "National Real Estate License Exam Prep",
    description:
      "Original national real estate license exam-style practice questions organized by section, with explanations and memory tricks.",
    provider: {
      "@type": "Organization",
      name: siteName,
      sameAs: siteUrl
    },
    educationalLevel: "Professional licensing exam preparation",
    teaches:
      "Property ownership, land use controls, valuation, financing, agency, disclosures, contracts, leasing, transfer of title, real estate practice, fair housing, and real estate calculations",
    inLanguage: "en-US",
    isAccessibleForFree: true,
    offers: {
      "@type": "Offer",
      price: "19.00",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: `${siteUrl}/education/`
    }
  });
}

function hero({ eyebrow, title, text, image, actions = [] }) {
  return `<section class="hero">
    <div class="hero-copy">
      <p class="eyebrow">${escapeHtml(eyebrow)}</p>
      <h1>${escapeHtml(title)}</h1>
      <p>${escapeHtml(text)}</p>
      ${actions.length ? `<div class="actions">${actions.map((item) => `<a class="button ${item.secondary ? "secondary" : ""}" href="${item.href}">${escapeHtml(item.label)}</a>`).join("")}</div>` : ""}
    </div>
    ${imageTag(image, "hero-image", "eager")}
  </section>`;
}

function renderHome() {
  const body = `${hero({
    eyebrow: "Georgia real estate education",
    title: "A practical resource hub for agents, investors, buyers, sellers, and property professionals",
    text: "Explore plain-English guides, printable checklists, and compliance-minded education built around practical real estate questions in Georgia.",
    image: "home-hero.png",
    actions: [
      { href: "/start-here/", label: "Start Here" },
      { href: "/resource-center/", label: "Browse Resource Center", secondary: true }
    ]
  })}
  <section class="content-band">
    <div class="section-heading">
      <p class="eyebrow">Choose a path</p>
      <h2>What Do You Need Today?</h2>
    </div>
    <div class="card-grid four">
      ${linkCard({ href: "/start-here/#new-georgia-agent", title: "New Georgia agents", text: "First-client readiness, brokerage questions, advertising basics, and transaction checklists.", meta: "Agent path" })}
      ${linkCard({ href: "/education/", title: "License exam prep", text: "National exam-style practice by section, with 25 free questions per section and locked mixed exams.", meta: "Education" })}
      ${linkCard({ href: "/start-here/#experienced-agent", title: "Experienced agents", text: "Brokerage models, branding, referrals, vendor systems, and productive independence.", meta: "Agent path" })}
      ${linkCard({ href: "/start-here/#referrals-rentals", title: "Referrals and rentals", text: "Referral commission questions, rental workflows, and relationship-based business building.", meta: "Flexible business" })}
      ${linkCard({ href: "/start-here/#buyers-sellers-investors", title: "Buyers, sellers, investors", text: "Education for listing prep, buyer process, short-term rentals, and long-term wealth planning.", meta: "Public education" })}
    </div>
  </section>
  <section class="content-band tinted">
    <div class="section-heading">
      <p class="eyebrow">Featured guides</p>
      <h2>Recommended First Reads</h2>
    </div>
    <div class="card-grid three">${["choose-real-estate-brokerage-georgia", "new-georgia-real-estate-agent-first-client-checklist", "georgia-real-estate-advertising-basics-agents"].map((slug) => articleSummaryCard(articleBySlug(slug))).join("")}</div>
  </section>
  <section class="content-band">
    <div class="section-heading">
      <p class="eyebrow">Public resources</p>
      <h2>Printable Checklists</h2>
    </div>
    <div class="card-grid three">${downloads.slice(0, 6).map(downloadCard).join("")}</div>
  </section>
  <section class="content-band">${resourceAuthorNote()}</section>`;
  return pageLayout({ title: siteName, description: siteTagline, slug: "/", image: "home-hero.png", body });
}

function renderEducation() {
  const body = `${hero({
    eyebrow: "National real estate exam prep",
    title: "Real Estate License Exam Prep",
    text:
      "Practice national real estate salesperson exam topics by section for free, then unlock mixed practice, timed mock exams, saved progress, missed-question review, and full mnemonic cram sheets for $19.",
    image: "resource-center-banner.png",
    actions: [
      { href: "#practice", label: "Start Free Practice" },
      { href: "#full-exam-prep", label: "Unlock Full Prep - $19", secondary: true }
    ]
  })}
  <section class="education-intro content-band" aria-label="Exam prep overview">
    <div class="education-intro-grid">
      <article>
        <p class="eyebrow">Free by section</p>
        <h2>Choose exactly what you want to drill.</h2>
        <p>Each national topic section includes 25 free original exam-style questions with answer feedback, plain-English explanations, and memory tricks. Mixed practice and timed exams are locked because that is the closest simulation of the real test.</p>
      </article>
      <article>
        <p class="eyebrow">AdSense-ready layout</p>
        <h2>Useful public content first.</h2>
        <p>Public study notes, section explanations, and ad space sit away from quiz buttons and checkout prompts. The paid tier stays simple: one $19 unlock for the serious prep tools.</p>
      </article>
    </div>
    <aside class="ad-slot" aria-label="Advertisement">
      <span>Advertisement</span>
    </aside>
  </section>
  <section id="practice" class="education-shell" data-education-app>
    <noscript>
      <div class="education-panel">
        <h2>JavaScript is required for interactive practice.</h2>
        <p>Enable JavaScript to choose sections, answer questions, and see explanations.</p>
      </div>
    </noscript>
  </section>
  <section id="full-exam-prep" class="content-band tinted">
    <div class="section-heading">
      <p class="eyebrow">Simple pricing</p>
      <h2>Free Sections First. Full Prep When You Are Ready.</h2>
    </div>
    <div class="pricing-grid">
      <article class="pricing-card">
        <p class="eyebrow">Free</p>
        <h3>Section Practice</h3>
        <p class="price">$0</p>
        <ul>
          <li>25 questions in every national topic section</li>
          <li>Correct-answer explanations</li>
          <li>Wrong-answer feedback</li>
          <li>Selected memory tricks while practicing</li>
        </ul>
      </article>
      <article class="pricing-card featured">
        <p class="eyebrow">One-time unlock</p>
        <h3>Full Exam Prep</h3>
        <p class="price">$19</p>
        <ul>
          <li>Mixed practice across all sections</li>
          <li>Timed mock exam mode</li>
          <li>Saved progress with restore access</li>
          <li>Missed-question review</li>
          <li>Weak-area dashboard</li>
          <li>Full mnemonic cram sheet</li>
        </ul>
        <a class="button" href="#practice">Unlock Full Exam Prep - $19</a>
      </article>
    </div>
  </section>
  <section class="content-band">
    <div class="education-note">
      <p class="eyebrow">Current outline alignment</p>
      <h2>Built Around Published National Exam Topics</h2>
      <p>This prep page uses original questions written to match national real estate salesperson exam topics and common multiple-choice patterns. It does not claim to contain actual protected exam questions, and candidates should verify the latest candidate bulletin for their state before scheduling an exam.</p>
      <p>Reference: <a href="https://test-takers.psiexams.com/api/content/bulletin/1001" rel="nofollow">PSI Candidate Information Bulletin</a>.</p>
    </div>
    ${disclaimerBlock()}
  </section>`;
  return pageLayout({
    title: "Real Estate License Exam Prep",
    description:
      "National real estate license exam prep with free section practice, answer explanations, memory tricks, and a $19 full exam prep unlock.",
    slug: "/education/",
    image: "resource-center-banner.png",
    schema: educationSchema(),
    scripts: ["/assets/js/education-quiz.js"],
    body
  });
}

function renderStartHere() {
  const firstReads = ["new-georgia-real-estate-agent-first-client-checklist", "choose-real-estate-brokerage-georgia", "buyer-agent-checklist-georgia-real-estate", "short-term-rental-investing-georgia-basics"];
  const body = `${hero({
    eyebrow: "Start Here",
    title: "Find the Georgia Real Estate Resource That Fits Your Next Step",
    text: "Use this page to choose a learning path, whether you are newly licensed, building independence, exploring referrals and rentals, or trying to understand a Georgia property decision.",
    image: "start-here-banner.png",
    actions: [
      { href: "/resource-center/", label: "Open Resource Center" },
      { href: "/contact/", label: "Contact", secondary: true }
    ]
  })}
  <section class="content-band path-list">
    ${pathSection("new-georgia-agent", "I'm a new Georgia real estate agent", "Start with practical readiness. Focus on brokerage support, forms access, first-client conversations, advertising review, and transaction calendar habits.", ["new-georgia-real-estate-agent-first-client-checklist", "choose-real-estate-brokerage-georgia", "new-real-estate-agent-mistakes"])}
    ${pathSection("experienced-agent", "I'm an experienced agent building independence", "Review brokerage models, pay-at-close structures, vendor systems, branding, and referral-based growth without losing sight of compliance and client service.", ["flat-fee-real-estate-brokerage-georgia-agents", "pay-at-close-real-estate-agents", "referral-based-real-estate-business"])}
    ${pathSection("referrals-rentals", "I'm interested in referrals, rentals, or part-time real estate", "Use structured referral questions, rental intake workflows, and part-time productivity systems so flexible business still feels professional.", ["real-estate-referral-commissions-georgia", "rental-commissions-real-estate-agents", "part-time-real-estate-agent-productivity"])}
    ${pathSection("buyers-sellers-investors", "I'm buying, selling, or investing in Georgia property", "Read public education guides that explain process, preparation, due diligence questions, and when to consult licensed professionals.", ["listing-prep-checklist-georgia-agents", "buyer-agent-checklist-georgia-real-estate", "real-estate-long-term-wealth-building"])}
  </section>
  <section class="content-band tinted">
    <div class="section-heading"><p class="eyebrow">Recommended first reads</p><h2>Start With These Guides</h2></div>
    <div class="card-grid four">${firstReads.map((slug) => articleSummaryCard(articleBySlug(slug))).join("")}</div>
    <div class="actions centered"><a class="button" href="/resource-center/">Go to Resource Center</a><a class="button secondary" href="/contact/">Contact the Site</a></div>
  </section>
  <section class="content-band">${resourceAuthorNote()}</section>`;
  return pageLayout({ title: "Start Here", description: "Choose the right Georgia real estate education path for agents, investors, buyers, sellers, and property professionals.", slug: "/start-here/", image: "start-here-banner.png", body });
}

function pathSection(id, title, text, slugs) {
  return `<article id="${id}" class="path-section">
    <div>
      <p class="eyebrow">Learning path</p>
      <h2>${escapeHtml(title)}</h2>
      <p>${escapeHtml(text)}</p>
    </div>
    <ul>${slugs.map((slug) => `<li><a href="/${slug}/">${escapeHtml(articleBySlug(slug).title)}</a></li>`).join("")}</ul>
  </article>`;
}

function renderResourceCenter() {
  const body = `${hero({
    eyebrow: "Georgia Real Estate Resource Center",
    title: "Guides, Checklists, and Category Hubs for Practical Real Estate Learning",
    text: "Browse organized resources for agent basics, brokerage education, listings, buyer representation, referrals, rentals, investor education, and compliance-minded topics.",
    image: "resource-center-banner.png",
    actions: [
      { href: "/articles/", label: "View Articles" },
      { href: "/downloads/", label: "Open Downloads", secondary: true }
    ]
  })}
  <section class="content-band">
    <div class="section-heading"><p class="eyebrow">Resource library</p><h2>Browse by Category</h2></div>
    <div class="card-grid three">
      ${categories.map((item) => linkCard({ href: `/category/${item.slug}/`, title: item.name, text: item.description, meta: `${item.featuredArticles.length || downloads.filter((download) => download.category === item.name).length} resources`, image: item.image })).join("")}
    </div>
  </section>
  <section class="content-band tinted">${resourceAuthorNote()}</section>`;
  return pageLayout({ title: "Georgia Real Estate Resource Center", description: "Main resource hub for Georgia real estate agents, investors, buyers, sellers, and property professionals.", slug: "/resource-center/", image: "resource-center-banner.png", body });
}

function renderArticlesIndex() {
  const body = `${hero({
    eyebrow: "Blog / Articles",
    title: "Georgia Real Estate Articles and Evergreen Guides",
    text: "Public, indexable real estate education written for agents, investors, buyers, sellers, and property professionals who want practical context before making decisions.",
    image: "articles-index-banner.png",
    actions: [{ href: "/resource-center/", label: "Browse by Category" }, { href: "/downloads/", label: "Printable Resources", secondary: true }]
  })}
  <section class="content-band">
    <div class="section-heading"><p class="eyebrow">All articles</p><h2>Evergreen Resource Library</h2></div>
    <div class="card-grid three">${articles.map(articleSummaryCard).join("")}</div>
  </section>
  <section class="content-band tinted">${resourceAuthorNote()}</section>`;
  return pageLayout({ title: "Blog / Articles", description: "All Georgia real estate education articles from The Agent Resource Desk.", slug: "/articles/", image: "articles-index-banner.png", body });
}

function renderDownloadsIndex() {
  const body = `${hero({
    eyebrow: "Checklists & Downloads",
    title: "Printable Real Estate Worksheets and Checklists",
    text: "Use these public resources without an email gate. Print them for client preparation, agent workflow planning, or brokerage questions.",
    image: "downloads-banner.png",
    actions: [{ href: "/resource-center/", label: "Resource Center" }, { href: "/articles/", label: "Read Articles", secondary: true }]
  })}
  <section class="content-band">
    <div class="section-heading"><p class="eyebrow">Printable pages</p><h2>Public Resources</h2></div>
    <div class="card-grid three">${downloads.map(downloadCard).join("")}</div>
  </section>
  <section class="content-band tinted">${resourceAuthorNote()}</section>`;
  return pageLayout({ title: "Checklists & Downloads", description: "Printable real estate checklists and worksheets for Georgia agents and property professionals.", slug: "/downloads/", image: "downloads-banner.png", body });
}

function renderAbout() {
  const body = `${hero({
    eyebrow: "About the Site",
    title: "Practical Georgia Real Estate Education Without the Brokerage-Centric Noise",
    text: "This site is built as a public learning library for agents, investors, buyers, sellers, and property professionals who want clear guides and better questions.",
    image: "about-site-banner.png",
    actions: [{ href: "/start-here/", label: "Start Here" }, { href: "/editorial-policy/", label: "Editorial Policy", secondary: true }]
  })}
  <section class="article-body">
    <h2>Mission</h2>
    <p>${siteName} publishes practical real estate education focused on Georgia property questions, agent readiness, brokerage education, transaction basics, and investor due diligence. The goal is to help readers understand process, organize questions, and work more effectively with the appropriate licensed professionals.</p>
    <h2>Who This Site Helps</h2>
    <ul>
      <li>New Georgia real estate agents preparing for first-client conversations.</li>
      <li>Experienced agents comparing business models, referrals, rentals, and branding choices.</li>
      <li>Buyers and sellers who want plain-English process education.</li>
      <li>Investors and property owners learning about rentals, short-term rentals, and long-term planning.</li>
    </ul>
    <h2>Role-Based Resource Support</h2>
    <p>Where an agent perspective is useful, the site may refer to the site's licensed Georgia real estate resource or the site's agent resource. Content is published under ${author.name}, a transparent editorial desk identity rather than a fake individual byline.</p>
    ${disclaimerBlock()}
    ${resourceAuthorNote()}
  </section>`;
  return pageLayout({ title: "About the Site", description: "Learn about the mission behind this Georgia real estate education resource hub.", slug: "/about/", image: "about-site-banner.png", body });
}

function renderContact() {
  const body = `${hero({
    eyebrow: "Contact",
    title: "Send a General Inquiry or Correction Request",
    text: "Use the contact form or email address for general questions, article corrections, resource suggestions, or privacy requests. Do not send confidential transaction details through this form.",
    image: "contact-banner.png",
    actions: [{ href: `mailto:${contactEmail}`, label: "Email the Site" }, { href: "/editorial-policy/#corrections", label: "Corrections Process", secondary: true }]
  })}
  <section class="article-body">
    <h2>General Inquiries</h2>
    <p>Email: <a href="mailto:${contactEmail}">${contactEmail}</a></p>
    <form class="contact-form" action="mailto:${contactEmail}" method="post" enctype="text/plain">
      <label>Name <input name="name" autocomplete="name"></label>
      <label>Email <input name="email" type="email" autocomplete="email"></label>
      <label>Topic <select name="topic"><option>General inquiry</option><option>Correction request</option><option>Privacy question</option><option>Resource suggestion</option></select></label>
      <label>Message <textarea name="message" rows="7"></textarea></label>
      <button class="button" type="submit">Prepare Email</button>
    </form>
    <h2>Correction Requests</h2>
    <p>For corrections, include the page URL, the section involved, the concern, and any public source or documentation that helps review the issue. The site reviews correction requests for clarity, usefulness, and compliance-minded presentation.</p>
    <h2>Important Limitations</h2>
    <p>This contact page is for general inquiries. It does not create an attorney-client, broker-client, lender-client, tax-client, or advisory relationship. Do not rely on a contact form submission to satisfy a contract deadline, legal notice requirement, or transaction instruction.</p>
    <aside class="disclaimer-block"><strong>Brokerage/legal disclosure</strong><p>${escapeHtml(brokerageDisclosurePlaceholder)}</p></aside>
  </section>`;
  return pageLayout({ title: "Contact", description: "Contact the Georgia real estate education site for general inquiries, corrections, privacy questions, and resource suggestions.", slug: "/contact/", image: "contact-banner.png", body });
}

function renderPrivacy() {
  const body = `${hero({
    eyebrow: "Privacy Policy",
    title: "Privacy, Cookies, Advertising, and Contact Information",
    text: "This policy explains general data, cookie, advertising, and contact practices for this public real estate education website.",
    image: "privacy-policy-banner.png"
  })}
  <section class="article-body">
    <h2>Information the Site May Collect</h2>
    <p>The site may collect information that visitors choose to submit through contact forms or email, such as name, email address, topic, and message content. Like many websites, hosting providers may also process server logs such as IP address, browser type, device information, referring page, and pages visited.</p>
    <h2>Cookies and Similar Technologies</h2>
    <p>The site may use cookies and similar technologies for basic website functionality, analytics, advertising measurement, and ad personalization if those services are enabled.</p>
    <h2>Google AdSense and Third-Party Advertising</h2>
    <p>Third-party vendors, including Google, may use cookies to serve ads based on a visitor's prior visits to this site or other websites. Advertising partners may personalize, limit, or measure ads. Visitors can manage browser cookies and review ad personalization settings through their browser and Google account controls.</p>
    <h2>Contact Forms and Email</h2>
    <p>Information submitted through the contact form or email may be used to respond to inquiries, review correction requests, address privacy questions, and improve site resources. Do not submit confidential transaction, legal, tax, lending, or financial information through the public contact form.</p>
    <h2>Data Sharing</h2>
    <p>The site may use service providers for hosting, email, analytics, security, and advertising. The site does not sell personal contact form messages as standalone contact lists.</p>
    <h2>Managing Choices</h2>
    <p>Visitors may manage cookies through browser settings. Some features or advertising controls may not work the same way if cookies are blocked. Visitors can also contact the site at <a href="mailto:${contactEmail}">${contactEmail}</a> for privacy questions.</p>
    <h2>Policy Updates</h2>
    <p>This policy may be updated as site features, analytics, advertising, or legal requirements change. The current public version should be reviewed periodically.</p>
  </section>`;
  return pageLayout({ title: "Privacy Policy", description: "Privacy policy covering cookies, Google AdSense, third-party advertising, contact forms, analytics, and privacy questions.", slug: "/privacy-policy/", image: "privacy-policy-banner.png", body });
}

function renderEditorialPolicy() {
  const body = `${hero({
    eyebrow: "Editorial Policy",
    title: "How Real Estate Education Content Is Published and Reviewed",
    text: "This editorial policy explains who publishes the content, why it exists, how corrections are handled, and how AI-assisted drafting may be used.",
    image: "editorial-policy-banner.png"
  })}
  <section class="article-body">
    <h2>Who Publishes the Content</h2>
    <p>Content is published by ${author.name}, the ${author.role}. This is a role-based editorial desk identity for practical Georgia real estate education, not a fake individual human author.</p>
    <h2>Purpose</h2>
    <p>The purpose of the site is to publish practical real estate education, checklists, and plain-English guides for agents, investors, buyers, sellers, and property professionals.</p>
    <h2>Review Standard</h2>
    <p>Content is reviewed for clarity, usefulness, and compliance-minded presentation before publication. The site avoids fake statistics, fabricated quotes, guaranteed outcomes, and private brokerage procedure claims.</p>
    <h2 id="corrections">Corrections Process</h2>
    <p>Readers may request corrections by contacting <a href="mailto:${contactEmail}">${contactEmail}</a> or using the <a href="/contact/">Contact page</a>. Please include the page URL, the specific issue, and any public source that helps evaluate the concern.</p>
    <h2>AI-Assisted Content Statement</h2>
    <p>Content may be drafted, outlined, edited, or organized with AI tools. AI-assisted content should be reviewed before publication for accuracy, usefulness, clarity, and compliance-minded presentation.</p>
    <h2>No Legal, Tax, Financial, Lending, or Brokerage Advice</h2>
    <p>${escapeHtml(sitewideDisclaimer)}</p>
  </section>`;
  return pageLayout({ title: "Editorial Policy", description: "Editorial policy for The Agent Resource Desk, including review standards, corrections, AI-assisted content, and disclaimers.", slug: "/editorial-policy/", image: "editorial-policy-banner.png", body });
}

function renderDisclaimer() {
  const body = `${hero({
    eyebrow: "Real Estate Disclaimer",
    title: "Educational Content, Professional Advice, and Advertising Disclosure",
    text: "Read this page before relying on real estate education content. The site is designed for general education, not personalized legal, tax, lending, financial, or brokerage advice.",
    image: "real-estate-disclaimer-banner.png"
  })}
  <section class="article-body">
    <h2>Educational Content Disclaimer</h2>
    <p>${escapeHtml(sitewideDisclaimer)}</p>
    <h2>No Professional Relationship Created</h2>
    <p>Reading this site, downloading a checklist, sending a general inquiry, or reviewing an article does not create an attorney-client, broker-client, lender-client, tax-client, financial advisory, or other professional advisory relationship.</p>
    <h2>Brokerage Disclosure Placeholder</h2>
    <p>${escapeHtml(brokerageDisclosurePlaceholder)}</p>
    <h2>Fair Housing and Equal Housing</h2>
    <p>The site supports fair housing principles and equal housing opportunity. Real estate advertising, property discussions, and client service should be reviewed through applicable fair housing laws, broker policy, and professional guidance.</p>
    <h2>Accuracy and Updates</h2>
    <p>Real estate rules, forms, contract language, MLS practices, commission structures, lending standards, tax treatment, market conditions, and local rules can change. Content may become outdated or incomplete.</p>
    <h2>Consult the Appropriate Professional</h2>
    <p>Readers should consult the appropriate licensed professional, broker, attorney, lender, tax professional, insurance professional, inspector, contractor, HOA, MLS, regulator, or local authority before making decisions.</p>
  </section>`;
  return pageLayout({ title: "Real Estate Disclaimer", description: "Educational, professional advice, fair housing, brokerage disclosure, and accuracy disclaimers for this real estate resource site.", slug: "/real-estate-disclaimer/", image: "real-estate-disclaimer-banner.png", body });
}

function renderAuthorPage() {
  const body = `${hero({
    eyebrow: "Author Profile",
    title: author.name,
    text: `${author.role}. ${author.bio}`,
    image: author.image,
    actions: [{ href: "/articles/", label: "Read Articles" }, { href: "/editorial-policy/", label: "Editorial Policy", secondary: true }]
  })}
  <section class="content-band">
    <div class="section-heading"><p class="eyebrow">Published resources</p><h2>Articles by ${author.name}</h2></div>
    <div class="card-grid three">${articles.map(articleSummaryCard).join("")}</div>
  </section>`;
  return pageLayout({ title: author.name, description: author.bio, slug: author.slug, image: author.image, body });
}

function renderCategoryPage(item) {
  const fallbackByCategory = {
    "Georgia Market Education": ["fmls-vs-georgia-mls-agents", "short-term-rental-investing-georgia-basics", "real-estate-long-term-wealth-building", "listing-prep-checklist-georgia-agents"]
  };
  const articleMatches = articles.filter((articleItem) => articleItem.category === item.name);
  const fallbackArticles = (fallbackByCategory[item.name] || []).map(articleBySlug).filter(Boolean);
  const visibleArticles = articleMatches.length ? articleMatches : fallbackArticles;
  const downloadMatches = item.name === "Checklists & Downloads" ? downloads : downloads.filter((downloadItem) => downloadItem.category === item.name);
  const body = `${hero({
    eyebrow: "Category",
    title: item.name,
    text: item.description,
    image: item.image,
    actions: [{ href: "/resource-center/", label: "Resource Center" }, { href: "/articles/", label: "All Articles", secondary: true }]
  })}
  <section class="content-band">
    <div class="section-heading"><p class="eyebrow">Articles</p><h2>${escapeHtml(item.name)} Guides</h2></div>
    ${visibleArticles.length ? `<div class="card-grid three">${visibleArticles.map(articleSummaryCard).join("")}</div>` : `<p class="empty-note">Use the printable resources below and the Resource Center to browse related topics.</p>`}
  </section>
  ${downloadMatches.length ? `<section class="content-band tinted"><div class="section-heading"><p class="eyebrow">Downloads</p><h2>Printable Resources</h2></div><div class="card-grid three">${downloadMatches.map(downloadCard).join("")}</div></section>` : ""}
  <section class="content-band">${resourceAuthorNote()}</section>`;
  return pageLayout({ title: item.name, description: item.description, slug: `/category/${item.slug}/`, image: item.image, body });
}

function renderArticlePage(item) {
  const cat = categoryByName(item.category);
  const body = `${breadcrumb([{ label: "Articles", href: "/articles/" }, { label: item.category, href: categoryLink(item.category) }, { label: item.title }])}
  <article class="article">
    <header class="article-header">
      <p class="eyebrow">${escapeHtml(item.category)}</p>
      <h1>${escapeHtml(item.title)}</h1>
      <p class="lede">${escapeHtml(item.intro)}</p>
      <div class="article-meta">
        <span>Written by <a href="${author.slug}">${author.name}</a></span>
        <span>${escapeHtml(author.role)}</span>
      </div>
      ${imageTag(item.image, "article-feature", "eager")}
    </header>
    ${toc(item.sections)}
    <div class="article-body">
      ${item.sections.map((section) => renderArticleSection(section)).join("")}
      <section class="next-links">
        <h2>Helpful next steps</h2>
        <ul>
          <li><a href="/resource-center/">Browse the Georgia Real Estate Resource Center</a></li>
          <li><a href="/start-here/">Use the Start Here guide to choose a learning path</a></li>
          <li><a href="/category/${cat.slug}/">Read more in ${escapeHtml(item.category)}</a></li>
          <li><a href="/downloads/">Open printable checklists and worksheets</a></li>
        </ul>
      </section>
      ${disclaimerBlock()}
      ${authorBox()}
    </div>
  </article>
  ${relatedArticles(item)}`;
  return pageLayout({ title: item.title, description: item.meta, slug: `/${item.slug}/`, image: item.image, type: "article", schema: articleSchema(item), body });
}

function renderArticleSection(section) {
  return `<section id="${sectionId(section.heading)}">
    <h2>${escapeHtml(section.heading)}</h2>
    <p>${escapeHtml(section.body)}</p>
    ${section.bullets.length ? `<ul class="check-list">${section.bullets.map((bullet) => `<li>${escapeHtml(bullet)}</li>`).join("")}</ul>` : ""}
  </section>`;
}

function renderDownloadPage(item) {
  const body = `${breadcrumb([{ label: "Downloads", href: "/downloads/" }, { label: item.title }])}
  <article class="article printable">
    <header class="article-header compact">
      <p class="eyebrow">${escapeHtml(item.category)} / Printable Resource</p>
      <h1>${escapeHtml(item.title)}</h1>
      <p class="lede">${escapeHtml(item.description)}</p>
      <div class="actions"><button class="button" onclick="window.print()">Print this checklist</button><a class="button secondary" href="/downloads/">All downloads</a></div>
    </header>
    <div class="article-body">
      <section>
        <h2>Checklist</h2>
        <ul class="print-checklist">${item.checklist.map((line) => `<li><span></span>${escapeHtml(line)}</li>`).join("")}</ul>
      </section>
      <section>
        <h2>Notes</h2>
        <ul>${item.notes.map((line) => `<li>${escapeHtml(line)}</li>`).join("")}</ul>
      </section>
      <section>
        <h2>Internal resources</h2>
        <ul>
          <li><a href="/resource-center/">Georgia Real Estate Resource Center</a></li>
          <li><a href="${categoryLink(item.category)}">${escapeHtml(item.category)}</a></li>
          <li><a href="/real-estate-disclaimer/">Real Estate Disclaimer</a></li>
        </ul>
      </section>
      ${disclaimerBlock()}
      ${authorBox()}
    </div>
  </article>`;
  return pageLayout({ title: item.title, description: item.description, slug: `/downloads/${item.slug}/`, image: "downloads-banner.png", body });
}

async function writeFile(filePath, content) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, content);
}

async function removeGeneratedDirectories() {
  const dirs = [
    "start-here",
    "resource-center",
    "articles",
    "education",
    "downloads",
    "about",
    "contact",
    "privacy-policy",
    "editorial-policy",
    "real-estate-disclaimer",
    "author",
    "category"
  ];
  await Promise.all(dirs.map((dir) => fs.rm(path.join(rootDir, dir), { recursive: true, force: true })));
  await fs.rm(path.join(rootDir, "index.html"), { force: true });
  await fs.rm(path.join(rootDir, "sitemap.xml"), { force: true });
  await fs.rm(path.join(rootDir, "robots.txt"), { force: true });
}

async function writeImageManifest() {
  const manifest = [];
  for (const item of imageAssets) {
    const imagePath = path.join(rootDir, "assets", "images", item.fileName);
    manifest.push({
      fileName: item.fileName,
      altText: item.alt,
      caption: item.caption,
      intendedPagePlacement: item.placement,
      promptUsed: item.prompt,
      intendedDimensions: item.intendedDimensions,
      actualDimensions: await pngDimensions(imagePath)
    });
  }
  await writeFile(path.join(rootDir, "assets", "images", "image-manifest.json"), JSON.stringify(manifest, null, 2));
}

async function pngDimensions(filePath) {
  try {
    const buffer = await fs.readFile(filePath);
    if (buffer.length >= 24 && buffer.toString("ascii", 1, 4) === "PNG") {
      return `${buffer.readUInt32BE(16)}x${buffer.readUInt32BE(20)}`;
    }
  } catch {
    return null;
  }
  return null;
}

async function writeSitemap() {
  const urls = mainPages.map((slug) => `  <url><loc>${absoluteUrl(slug)}</loc></url>`).join("\n");
  await writeFile(path.join(rootDir, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
  await writeFile(path.join(rootDir, "robots.txt"), `User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n`);
}

async function build() {
  await removeGeneratedDirectories();
  await writeFile(slugToPath("/"), renderHome());
  await writeFile(slugToPath("/start-here/"), renderStartHere());
  await writeFile(slugToPath("/education/"), renderEducation());
  await writeFile(slugToPath("/resource-center/"), renderResourceCenter());
  await writeFile(slugToPath("/articles/"), renderArticlesIndex());
  await writeFile(slugToPath("/downloads/"), renderDownloadsIndex());
  await writeFile(slugToPath("/about/"), renderAbout());
  await writeFile(slugToPath("/contact/"), renderContact());
  await writeFile(slugToPath("/privacy-policy/"), renderPrivacy());
  await writeFile(slugToPath("/editorial-policy/"), renderEditorialPolicy());
  await writeFile(slugToPath("/real-estate-disclaimer/"), renderDisclaimer());
  await writeFile(slugToPath(author.slug), renderAuthorPage());
  for (const item of categories) await writeFile(slugToPath(`/category/${item.slug}/`), renderCategoryPage(item));
  for (const item of articles) await writeFile(slugToPath(`/${item.slug}/`), renderArticlePage(item));
  for (const item of downloads) await writeFile(slugToPath(`/downloads/${item.slug}/`), renderDownloadPage(item));
  await writeImageManifest();
  await writeSitemap();
}

build().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
