(function () {
  var FREE_LIMIT = 25;
  var STATE_POOL_MULTIPLIER = 6;
  var PASS_CONFIDENCE_GOAL = 90;
  var DEFAULT_STATE_CODE = "GA";
  var STORAGE_KEY = "brqEducationProgress";
  var STATE_CHOICE_KEY = "brqEducationStateCode";
  var ACCESS_TOKEN_KEY = "brqEducationAccessToken";
  var ACCESS_EMAIL_KEY = "brqEducationAccessEmail";
  var ACCESS_CODE_KEY = "brqEducationAccessCode";
  var PENDING_EMAIL_KEY = "brqEducationPendingAccount";
  var CHECKOUT_URL = "https://buy.stripe.com/28EaEW62x1Hf6kq8pWbjW05";
  var ACCESS_API_URL = "https://brique-education-access.josue-brique.workers.dev";

  function checkoutUrl(email) {
    var url = new URL(CHECKOUT_URL);
    if (email) url.searchParams.set("prefilled_email", email);
    url.searchParams.set("client_reference_id", checkoutReferenceId());
    url.searchParams.set("utm_source", "briquerealty");
    url.searchParams.set("utm_medium", "education_page");
    url.searchParams.set("utm_campaign", "all_state_exam_prep");
    return url.href;
  }

  function checkoutReferenceId() {
    try {
      var existing = sessionStorage.getItem("brqEducationCheckoutReference");
      if (existing) return existing;
      var bytes = new Uint8Array(8);
      crypto.getRandomValues(bytes);
      var suffix = Array.from(bytes, function (byte) {
        return byte.toString(16).padStart(2, "0");
      }).join("");
      var reference = "brqedu_" + Date.now().toString(36) + "_" + suffix;
      sessionStorage.setItem("brqEducationCheckoutReference", reference);
      return reference;
    } catch (error) {
      return "brqedu_" + Date.now().toString(36);
    }
  }

  function trackEvent(name, params) {
    var payload = Object.assign(
      {
        event_category: "education_exam_prep",
        item_id: "all_state_exam_prep_full",
        item_name: "BriqueRealty All-State Full Exam Prep",
        currency: "USD",
        value: 19
      },
      params || {}
    );
    try {
      window.dataLayer = window.dataLayer || [];
      if (typeof window.gtag === "function") window.gtag("event", name, payload);
      else window.dataLayer.push(Object.assign({ event: name }, payload));
    } catch (error) {
      return;
    }
  }

  function q(prompt, correct, wrong, explanation, memory) {
    return {
      prompt: prompt,
      correct: correct,
      wrong: wrong,
      explanation: explanation,
      memory: memory
    };
  }

  function profile(code, name, examQuestions, nationalQuestions, stateQuestions) {
    return {
      code: code,
      name: name,
      examQuestions: examQuestions,
      nationalQuestions: nationalQuestions,
      stateQuestions: stateQuestions
    };
  }

  var stateProfiles = [
    profile("AL", "Alabama", 120, 80, 40),
    profile("AK", "Alaska", 120, 80, 40),
    profile("AZ", "Arizona", 190, 80, 110),
    profile("AR", "Arkansas", 120, 80, 40),
    profile("CA", "California", 150, 100, 50),
    profile("CO", "Colorado", 154, 80, 74),
    profile("CT", "Connecticut", 120, 80, 40),
    profile("DE", "Delaware", 120, 80, 40),
    profile("DC", "District of Columbia", 110, 80, 30),
    profile("FL", "Florida", 100, 70, 30),
    profile("GA", "Georgia", 152, 100, 52),
    profile("HI", "Hawaii", 130, 80, 50),
    profile("ID", "Idaho", 120, 80, 40),
    profile("IL", "Illinois", 140, 100, 40),
    profile("IN", "Indiana", 120, 80, 40),
    profile("IA", "Iowa", 120, 80, 40),
    profile("KS", "Kansas", 110, 80, 30),
    profile("KY", "Kentucky", 120, 80, 40),
    profile("LA", "Louisiana", 135, 80, 55),
    profile("ME", "Maine", 120, 80, 40),
    profile("MD", "Maryland", 110, 80, 30),
    profile("MA", "Massachusetts", 120, 80, 40),
    profile("MI", "Michigan", 115, 80, 35),
    profile("MN", "Minnesota", 120, 80, 40),
    profile("MS", "Mississippi", 120, 80, 40),
    profile("MO", "Missouri", 140, 100, 40),
    profile("MT", "Montana", 113, 80, 33),
    profile("NE", "Nebraska", 120, 80, 40),
    profile("NV", "Nevada", 120, 80, 40),
    profile("NH", "New Hampshire", 120, 80, 40),
    profile("NJ", "New Jersey", 110, 80, 30),
    profile("NM", "New Mexico", 130, 80, 50),
    profile("NY", "New York", 75, 55, 20),
    profile("NC", "North Carolina", 120, 80, 40),
    profile("ND", "North Dakota", 120, 80, 40),
    profile("OH", "Ohio", 120, 80, 40),
    profile("OK", "Oklahoma", 120, 80, 40),
    profile("OR", "Oregon", 130, 80, 50),
    profile("PA", "Pennsylvania", 120, 80, 40),
    profile("RI", "Rhode Island", 120, 80, 40),
    profile("SC", "South Carolina", 120, 80, 40),
    profile("SD", "South Dakota", 120, 80, 40),
    profile("TN", "Tennessee", 120, 80, 40),
    profile("TX", "Texas", 110, 80, 30),
    profile("UT", "Utah", 130, 80, 50),
    profile("VT", "Vermont", 120, 80, 40),
    profile("VA", "Virginia", 120, 80, 40),
    profile("WA", "Washington", 110, 80, 30),
    profile("WV", "West Virginia", 120, 80, 40),
    profile("WI", "Wisconsin", 120, 80, 40),
    profile("WY", "Wyoming", 120, 80, 40)
  ];

  var sections = [
    {
      id: "property-ownership",
      name: "Property Ownership",
      weight: "About 10%",
      summary: "Ownership rights, estates, legal descriptions, fixtures, easements, liens, and title limits.",
      topics: ["Fixtures", "Estates", "Easements", "Legal descriptions", "Liens"],
      questions: [
        q("Which test is most often used to decide whether personal property has become a fixture?", "Annexation, adaptation, and agreement.", ["Only the cost of the item.", "Only whether the seller bought it.", "Only whether the item can be moved."], "Fixtures are judged by attachment, adaptation to the property, and agreement between the parties.", "AAA: attached, adapted, agreed."),
        q("A restaurant tenant installs removable ovens for its business. What are those most likely called?", "Trade fixtures.", ["Emblements.", "Appurtenances.", "Encroachments."], "Trade fixtures are business items installed by a tenant and usually removable if removed properly before lease end.", "Trade fixture = tenant trade tool."),
        q("Which phrase best describes real property?", "Land plus things permanently attached to it and rights that run with it.", ["Only movable personal belongings.", "Only buildings without land.", "Only property with a mortgage."], "Real property includes land, improvements, attachments, and associated ownership rights.", "Real stays with the real estate."),
        q("Which item is typically personal property before it is attached to real estate?", "A refrigerator sitting in a warehouse.", ["A built-in cabinet.", "A recorded easement.", "A planted tree."], "Personal property is movable unless it becomes attached or legally treated as part of the real estate.", "Personal property can be picked up personally."),
        q("Which right is part of the bundle of rights?", "The right to exclude others.", ["The right to ignore zoning.", "The right to refuse property taxes.", "The right to conceal material facts."], "Ownership includes possession, control, enjoyment, exclusion, and disposition, subject to law.", "DEEPC: disposition, enjoyment, exclusion, possession, control."),
        q("Which estate usually gives the broadest ownership interest?", "Fee simple absolute.", ["Life estate.", "Leasehold estate.", "License."], "Fee simple absolute is the highest private ownership estate and can continue indefinitely.", "Fee simple = fullest fee."),
        q("A person owns property only for the duration of another person's life. What is this?", "Life estate.", ["Fee simple defeasible.", "Tenancy at sufferance.", "Easement in gross."], "A life estate lasts for a measured life and ends when that life ends.", "Life estate lives with a life."),
        q("When a life estate ends and title returns to the original grantor, what interest did the grantor keep?", "Reversion.", ["Remainder.", "Accretion.", "Subrogation."], "A reversion returns ownership to the grantor or the grantor's estate after the temporary estate ends.", "Reversion reverts back."),
        q("Which ownership form usually requires time, title, interest, and possession?", "Joint tenancy.", ["Tenancy in common.", "Severalty.", "Leasehold."], "Joint tenancy traditionally requires the four unities: time, title, interest, and possession.", "TTIP: time, title, interest, possession."),
        q("Two unrelated investors own unequal shares and may leave their shares to heirs. What ownership form best fits?", "Tenancy in common.", ["Joint tenancy with survivorship.", "Tenancy at will.", "License."], "Tenants in common may hold unequal interests and each interest can pass by will or inheritance.", "Common can be uneven."),
        q("A property is owned by one person or one legal entity. What is this called?", "Ownership in severalty.", ["Joint tenancy.", "Tenancy in common.", "Community property."], "Severalty means ownership is severed from other owners and held by one owner.", "Severalty = solo."),
        q("A condo owner usually owns which property interest?", "A unit plus an undivided interest in common elements.", ["Only shares in a corporation.", "Only a leasehold interest.", "Only the land under the building footprint."], "Condominium ownership combines individual unit ownership with shared common-element ownership.", "Condo = cube plus common."),
        q("In a cooperative, the resident most commonly owns what?", "Shares in a corporation and a proprietary lease.", ["A fee simple unit deed.", "Only an easement.", "Only a tax certificate."], "Co-op residents generally own shares in the owning entity and receive occupancy rights through a lease.", "Co-op = corporation plus occupancy."),
        q("Which easement benefits a specific parcel of land?", "Easement appurtenant.", ["Easement in gross.", "License.", "Encroachment."], "An easement appurtenant runs with land and involves a dominant and servient estate.", "Appurtenant attaches to a parcel."),
        q("Which easement benefits a person or company rather than another parcel?", "Easement in gross.", ["Easement appurtenant.", "Fee simple determinable.", "Remainder interest."], "An easement in gross benefits an individual or entity, such as a utility company.", "Gross goes to a person or company."),
        q("Long, open, hostile, continuous use may create which right?", "Prescriptive easement.", ["Lease option.", "Novation.", "Subordination."], "A prescriptive easement can arise from use that meets state-law requirements over time.", "Prescription = time-based use."),
        q("A neighbor's fence extends over the lot line. What is the best term?", "Encroachment.", ["Encumbrance only by lien.", "Escheat.", "Emblement."], "An encroachment is an unauthorized physical intrusion onto another property.", "Encroachment crosses."),
        q("Which item is an encumbrance?", "A recorded mortgage lien.", ["A paid-off utility bill.", "A canceled listing flyer.", "A rejected offer."], "An encumbrance is a claim, charge, or liability that affects title or use.", "Encumbrance = extra burden."),
        q("Which lien is usually specific to one property?", "Mortgage lien.", ["Judgment lien.", "Income tax lien.", "General creditor lien."], "A mortgage lien usually attaches to the specific real estate pledged as collateral.", "Mortgage lien sticks to the mortgaged property."),
        q("Which private limit may restrict paint color, fences, or exterior changes?", "Deed restriction.", ["Eminent domain.", "Police power.", "Accession."], "Private deed restrictions or covenants can limit property use beyond public zoning rules.", "Deed restriction rides in the deed chain."),
        q("Owners along rivers and streams usually have what type of water rights?", "Riparian rights.", ["Littoral rights.", "Air rights.", "Mineral rights only."], "Riparian rights generally relate to flowing water such as rivers and streams.", "River = riparian."),
        q("Owners along lakes, seas, or oceans usually have what type of water rights?", "Littoral rights.", ["Riparian rights.", "Possessory rights only.", "Avulsion rights."], "Littoral rights generally relate to standing bodies of water.", "Lake = littoral."),
        q("A legal description begins at a point of beginning and follows boundaries. Which system is this?", "Metes and bounds.", ["Lot and block.", "Rectangular survey only.", "Street address."], "Metes and bounds uses distances, directions, monuments, and a point of beginning.", "Metes measures, bounds borders."),
        q("Which legal description uses townships, ranges, sections, and principal meridians?", "Rectangular government survey.", ["Metes and bounds.", "Lot and block.", "Assessor parcel nickname."], "The rectangular survey system divides land by meridians, baselines, townships, ranges, and sections.", "Township-range-section = survey grid."),
        q("Which legal description is common in recorded subdivisions?", "Lot and block.", ["Metes and bounds only.", "Informal neighborhood name.", "Tax estimate."], "Lot and block descriptions refer to recorded subdivision plats.", "Lot and block lives on a plat.")
      ]
    },
    {
      id: "land-use-controls",
      name: "Land Use Controls",
      weight: "About 5%",
      summary: "Public powers, zoning, building rules, environmental limits, private restrictions, and subdivision controls.",
      topics: ["Zoning", "Government powers", "Variances", "Environmental rules", "Private controls"],
      questions: [
        q("Which government power is the basis for zoning?", "Police power.", ["Eminent domain.", "Escheat.", "Accession."], "Police power lets government regulate property use to protect public health, safety, morals, and welfare.", "Police power protects people."),
        q("Taking private property for public use with compensation is called what?", "Eminent domain.", ["Escheat.", "Spot zoning.", "Laches."], "Eminent domain is the government's power to take property for public use with just compensation.", "Eminent domain = government takes, pays."),
        q("When property transfers to the state because an owner dies without heirs, what is the term?", "Escheat.", ["Condemnation.", "Variance.", "Adverse possession."], "Escheat prevents property from becoming ownerless when no legal heirs exist.", "No heirs? It cheats to the state: escheat."),
        q("Which government power funds public services through ad valorem charges?", "Taxation.", ["Avulsion.", "Novation.", "Subrogation."], "Property taxation is a government power tied to assessed value and local tax rates.", "Ad valorem = according to value."),
        q("What does a comprehensive or master plan usually guide?", "Long-term community development and land use.", ["Private mortgage payoff only.", "Exact title insurance premium only.", "A buyer's personal moving plan."], "A master plan guides public policy, zoning, transportation, development, and community goals.", "Master plan = map for growth."),
        q("A property owner wants permission to deviate from dimensional zoning because of hardship. What is needed?", "Variance.", ["Deed.", "Lis pendens.", "Warranty."], "A variance allows limited relief from zoning requirements when legal hardship standards are met.", "Variance varies the rule."),
        q("A use that was legal before a zoning change may be allowed to continue as what?", "Legal nonconforming use.", ["Illegal spot zoning.", "Escheat use.", "Constructive eviction."], "A legal nonconforming use existed lawfully before a zoning change and may continue under local rules.", "Grandfathered use = nonconforming."),
        q("A use allowed only if stated conditions are met is often called what?", "Conditional use or special exception.", ["Fee simple absolute.", "Trade fixture.", "Specific lien."], "Conditional uses are allowed by ordinance only when required standards or approvals are satisfied.", "Condition = allowed if conditions are met."),
        q("Which rule usually sets minimum construction and safety standards?", "Building code.", ["Listing agreement.", "Deed of trust.", "Bill of sale."], "Building codes regulate construction standards such as safety, structure, and occupancy.", "Building code builds safely."),
        q("What document often confirms a building can be occupied for its approved use?", "Certificate of occupancy.", ["Certificate of title insurance.", "Broker price opinion.", "Purchase option."], "A certificate of occupancy confirms code or use approval for occupancy under local procedures.", "CO = can occupy."),
        q("Which private control is commonly enforced by a homeowners association?", "Covenants, conditions, and restrictions.", ["Eminent domain.", "Police power.", "Escheat."], "CC&Rs are private restrictions often enforced by associations or affected owners.", "CC&R = community controls and rules."),
        q("If zoning and a private deed restriction conflict, which rule should an owner assume controls?", "The more restrictive rule often controls unless invalidated.", ["The least restrictive rule always controls.", "Only the listing agent decides.", "The rule with the newest paint color controls."], "Owners usually must satisfy both public and private limits, so the stricter valid rule can matter.", "Two rules? Follow the tighter valid one."),
        q("Which issue is most associated with CERCLA liability?", "Cleanup responsibility for hazardous waste contamination.", ["Setting commission rates.", "Recording a deed.", "Calculating acreage."], "CERCLA can impose cleanup liability on certain owners and operators of contaminated property.", "CERCLA cleans contamination."),
        q("Flood zones are usually important because they affect what?", "Use restrictions, insurance, lending, and risk disclosures.", ["Only mailbox color.", "Only broker commission split.", "Only deed font size."], "Flood-zone status can affect insurance requirements, financing, construction limits, and buyer due diligence.", "Flood zone = finance, insurance, risk."),
        q("Wetlands regulation is usually tied to what concern?", "Protection of sensitive water-related land and ecosystems.", ["Broker advertising slogans.", "Fixture ownership.", "Mortgage note signatures."], "Wetlands rules can restrict filling, draining, or building on protected areas.", "Wetlands are water-watch lands."),
        q("A zoning rule requiring a building to sit a certain distance from a lot line is called what?", "Setback requirement.", ["Setoff clause.", "Subordination clause.", "Suit for partition."], "Setbacks regulate how close structures can be to property lines or roads.", "Set back from the boundary."),
        q("A local rule limiting units per acre is regulating what?", "Density.", ["Hypothecation.", "Accretion.", "Remainder."], "Density controls how much development or how many units may be placed on land.", "Density = how dense the development is."),
        q("A buffer zone is most commonly used to do what?", "Separate incompatible land uses.", ["Create a promissory note.", "Cancel a deed.", "Set an interest rate."], "Buffers soften impacts between uses, such as residential and commercial areas.", "Buffer = barrier between uses."),
        q("A change that singles out a small parcel for a use inconsistent with the surrounding plan may raise what issue?", "Spot zoning.", ["Sublease.", "Avulsion.", "Estoppel certificate."], "Spot zoning concerns arise when a small area receives inconsistent treatment without proper planning basis.", "Spot zoning spots one parcel."),
        q("Reducing allowed intensity of land use through zoning is often called what?", "Downzoning.", ["Upselling.", "Escalation.", "Partition."], "Downzoning reduces permitted density or intensity and can affect value and development options.", "Downzoning dials development down."),
        q("Which public control reviews division of land into lots and streets?", "Subdivision regulation.", ["Option contract.", "General warranty covenant.", "Percentage lease."], "Subdivision regulations govern plats, lots, roads, infrastructure, and approvals.", "Subdivision rules divide land."),
        q("A charge for a specific public improvement benefiting nearby parcels is usually what?", "Special assessment.", ["General warranty deed.", "Leasehold estate.", "Seller concession."], "Special assessments fund specific improvements such as sidewalks, sewers, or street lighting.", "Special improvement, special assessment."),
        q("Which is a private land use control rather than a public control?", "Restrictive covenant.", ["Zoning ordinance.", "Building code.", "Property tax."], "Restrictive covenants are private limits created by deed, subdivision, or association documents.", "Covenants are private promises."),
        q("What is the usual purpose of zoning ordinances?", "Separate and regulate land uses.", ["Guarantee investment returns.", "Replace title insurance.", "Set national exam scores."], "Zoning ordinances control land use categories, intensity, building placement, and related standards.", "Zone = use zone."),
        q("Which item is most likely to require local permit review before construction?", "Adding a new room to a house.", ["Writing a thank-you note.", "Reading a listing photo caption.", "Buying moving boxes."], "Permits help local government check construction plans against building and zoning rules.", "Build first? Permit first.")
      ]
    },
    {
      id: "valuation-market-analysis",
      name: "Valuation and Market Analysis",
      weight: "About 7%",
      summary: "Value principles, appraisal methods, comparable adjustments, depreciation, income analysis, and market forces.",
      topics: ["Market value", "Sales comparison", "Cost approach", "Income approach", "Depreciation"],
      questions: [
        q("Which phrase best describes market value?", "The most probable price under normal conditions between informed, unpressured parties.", ["The seller's dream price.", "The original purchase price.", "The amount of the down payment."], "Market value estimates the most probable price in an arm's-length sale with typical conditions.", "Market value = most probable, not most hopeful."),
        q("Which is most likely to prepare a formal appraisal?", "A licensed or certified appraiser.", ["Only the buyer's friend.", "Only a moving company.", "Only the tax collector."], "Formal appraisals are prepared by qualified appraisers under applicable standards.", "Appraiser appraises."),
        q("A CMA prepared by an agent is mainly used for what?", "Helping estimate listing or offer strategy.", ["Replacing a lender appraisal.", "Issuing title insurance.", "Recording a deed."], "A comparative market analysis helps agents and clients discuss pricing but is not the same as a formal appraisal.", "CMA = compare market activity."),
        q("Which approach compares the subject property to recently sold similar properties?", "Sales comparison approach.", ["Cost approach.", "Income approach.", "Summation of debits."], "Sales comparison is based on comparable sales and market adjustments.", "Sales comparison compares sales."),
        q("In sales comparison, adjustments are made to which property?", "Comparable properties.", ["The legal description only.", "The mortgage note only.", "The appraiser's license."], "Adjustments are made to comparables to make them more like the subject property.", "Adjust comps toward the subject."),
        q("Which approach is often strongest for new or special-purpose buildings?", "Cost approach.", ["Income approach only.", "GRM only.", "Lease option method."], "The cost approach estimates land value plus current improvement cost less depreciation.", "Cost approach asks: what would it cost now?"),
        q("Which cost approach term means building an exact duplicate?", "Reproduction cost.", ["Replacement cost.", "External depreciation.", "Capitalization."], "Reproduction cost estimates the cost to duplicate the same structure exactly.", "Reproduction reproduces the original."),
        q("Which cost approach term means building a modern equivalent with similar utility?", "Replacement cost.", ["Reproduction cost.", "Gross rent multiplier.", "Assemblage."], "Replacement cost estimates a substitute with equivalent utility using modern materials and standards.", "Replacement replaces utility."),
        q("Which approach is most used for income-producing property?", "Income approach.", ["Metes and bounds.", "Lot and block.", "Trade fixture method."], "The income approach converts expected income into value.", "Income approach follows income."),
        q("What is the basic capitalization rate formula?", "Net operating income divided by value.", ["Value divided by property taxes.", "Loan balance plus down payment.", "Rent multiplied by commission."], "Cap rate equals NOI divided by value; value can be estimated by NOI divided by cap rate.", "I over V = R."),
        q("If NOI is $60,000 and the cap rate is 6%, what is value?", "$1,000,000.", ["$100,000.", "$360,000.", "$10,000."], "Value equals NOI divided by cap rate: 60,000 / 0.06 = 1,000,000.", "NOI divided by rate gets value."),
        q("Which formula best describes gross rent multiplier?", "Sale price divided by gross rent.", ["NOI divided by value.", "Assessed value times millage.", "Loan amount divided by interest."], "GRM relates price to gross rent and is a quick, rough income indicator.", "GRM = price over gross rent."),
        q("Physical deterioration is caused by what?", "Wear, tear, age, or damage.", ["A bad floor plan only.", "Outside neighborhood decline only.", "A survey correction only."], "Physical deterioration is depreciation from condition and aging of the property.", "Physical = physical wear."),
        q("Functional obsolescence is caused by what?", "Poor design or outdated utility within the property.", ["Nearby highway noise only.", "A general market boom.", "A recorded deed."], "Functional obsolescence comes from layout, design, or feature problems.", "Functional = function fails."),
        q("External obsolescence is caused by what?", "Negative influences outside the property.", ["A cracked interior tile only.", "A missing appliance only.", "A buyer's counteroffer only."], "External obsolescence comes from outside factors such as traffic, market decline, or nearby nuisances.", "External = outside enemy."),
        q("The principle of substitution says a buyer will usually do what?", "Not pay more than the cost of an equally desirable substitute.", ["Always pay the seller's asking price.", "Ignore comparable properties.", "Choose the oldest building."], "Substitution underlies sales comparison and cost reasoning.", "Substitution stops overpaying."),
        q("The principle of contribution asks what?", "How much a feature adds to or subtracts from value.", ["How much the feature originally cost.", "What color the feature is.", "Which lender holds the note."], "Contribution measures market value impact, not necessarily cost.", "Contribution = value contribution."),
        q("A modest home gaining value because it is near superior homes illustrates what?", "Progression.", ["Regression.", "Condemnation.", "Escheat."], "Progression is when lower-value property benefits from higher-value surroundings.", "Progression pulls up."),
        q("A luxury home losing value because it is surrounded by inferior properties illustrates what?", "Regression.", ["Progression.", "Accretion.", "Novation."], "Regression is when higher-value property is pulled down by lower-value surroundings.", "Regression pulls down."),
        q("Highest and best use must usually be legally permissible, physically possible, financially feasible, and what else?", "Maximally productive.", ["Emotionally preferred.", "Newest construction.", "Seller selected."], "Highest and best use analyzes the most profitable legally and physically possible use.", "Four tests: legal, physical, feasible, productive."),
        q("What is reconciliation in appraisal?", "Weighing approaches to reach a final value opinion.", ["Recording a deed.", "Canceling a lease.", "Paying a tax bill."], "Reconciliation evaluates the reliability of value indications from different approaches.", "Reconcile = bring values together."),
        q("Assemblage means what?", "Combining parcels into one larger ownership.", ["Splitting a lease payment.", "Canceling a contract.", "Replacing an appraiser."], "Assemblage combines parcels; plottage can be the added value created by the combination.", "Assemblage assembles parcels."),
        q("Plottage is best described as what?", "Added value from assembling parcels.", ["The cost of recording a deed.", "A monthly mortgage payment.", "A tenant's trade fixture."], "Plottage is the value increase that may result when parcels are assembled.", "Plot plus advantage = plottage."),
        q("Assessed value is primarily used for what?", "Property tax calculation.", ["A buyer's final loan approval only.", "An agent's commission split.", "A seller's moving estimate."], "Assessed value is a tax assessment figure and may differ from market value.", "Assessed means tax assessed."),
        q("Supply and demand affect value because value generally rises when what happens?", "Demand increases and supply is limited.", ["Supply increases without demand.", "No buyer wants the property.", "The legal description gets longer."], "Scarcity and demand are core forces in market value.", "Demand up, supply tight, price pressure up.")
      ]
    },
    {
      id: "financing",
      name: "Financing",
      weight: "About 10%",
      summary: "Loans, lending disclosures, mortgage instruments, points, foreclosure, federal laws, and common loan types.",
      topics: ["Mortgage notes", "Loan types", "TILA", "RESPA", "Foreclosure"],
      questions: [
        q("Which document is the borrower's promise to repay?", "Promissory note.", ["Mortgage only.", "Deed only.", "Title policy."], "The note is the debt promise; the mortgage or deed of trust secures the debt with property.", "Note = debt note."),
        q("Which document usually creates the real estate security interest for the lender?", "Mortgage or deed of trust.", ["Bill of sale.", "Lease abstract.", "Survey sketch."], "A mortgage or deed of trust pledges real estate as collateral for the loan.", "Security instrument secures repayment."),
        q("Pledging property as loan collateral without giving up possession is called what?", "Hypothecation.", ["Subrogation.", "Novation.", "Accretion."], "Hypothecation lets a borrower keep possession while the property secures the debt.", "Hypothecation = have it, but pledged."),
        q("A fully amortized loan does what by the end of the term?", "Pays principal and interest down to zero.", ["Pays interest only forever.", "Never reduces principal.", "Requires no payments."], "Fully amortized payments retire the debt over the loan term.", "Amortize = amount dies down."),
        q("In a fixed-rate mortgage, what remains the same?", "The interest rate.", ["Property taxes.", "Insurance premiums.", "Market value."], "A fixed-rate loan keeps the note rate fixed, though taxes and insurance can change.", "Fixed rate fixes the rate."),
        q("An adjustable-rate mortgage is most associated with what?", "An interest rate that can change under the loan terms.", ["A deed restriction.", "A title defect.", "A fixed tax assessment."], "ARMs adjust according to an index, margin, caps, and adjustment schedule.", "ARM adjusts."),
        q("One discount point equals what?", "One percent of the loan amount.", ["One percent of the purchase price every time.", "One dollar per thousand.", "One month of interest."], "A point is 1% of the loan amount, often paid to affect rate or loan pricing.", "Point points to 1 percent of loan."),
        q("Loan-to-value ratio compares what?", "Loan amount to property value or price.", ["Interest to taxes.", "Rent to security deposit.", "Commission to net income."], "LTV equals loan amount divided by value or price used by the lender.", "Loan over value = LTV."),
        q("Private mortgage insurance is usually tied to what?", "Conventional loans with low borrower equity.", ["VA funding fee only.", "Cash purchases only.", "Seller financing only."], "PMI protects the lender when a conventional borrower has a higher LTV.", "PMI protects mortgage investor."),
        q("Which loan is insured by the Federal Housing Administration?", "FHA loan.", ["VA loan.", "Conventional uninsured loan.", "Seller carryback only."], "FHA insures qualifying loans made by approved lenders.", "FHA = federal housing insurance."),
        q("Which loan program is associated with eligible veterans and a guaranty?", "VA loan.", ["FHA loan.", "USDA rural grant only.", "Bridge loan only."], "VA loans are guaranteed for eligible veterans, service members, and certain spouses.", "VA = veterans."),
        q("A conventional loan is best described as what?", "A loan not insured or guaranteed by a government agency.", ["Always seller financed.", "Always interest-free.", "Always a construction loan."], "Conventional loans are made under private/institutional guidelines without FHA/VA-style insurance or guaranty.", "Conventional = not government-insured."),
        q("TILA and Regulation Z focus most on what?", "Consumer credit cost disclosure.", ["Recording deeds.", "Zoning variances.", "HOA paint rules."], "Truth in Lending/Reg Z requires disclosure of credit terms such as APR for covered loans.", "TILA tells the truth in lending."),
        q("RESPA most directly regulates what?", "Certain settlement practices and disclosures for covered residential loans.", ["State zoning maps.", "Broker dress codes.", "Metes and bounds descriptions."], "RESPA addresses settlement disclosures, kickbacks, and related residential mortgage practices.", "RESPA = real estate settlement procedures."),
        q("Which form gives early estimated loan and closing costs?", "Loan Estimate.", ["Warranty deed.", "Brokerage agreement.", "Estoppel certificate."], "The Loan Estimate is provided early for many consumer mortgage applications.", "Loan Estimate estimates early."),
        q("Which form gives final loan and closing cost details before closing?", "Closing Disclosure.", ["Open listing.", "Plat map.", "Lease option."], "The Closing Disclosure gives final terms and costs before many mortgage closings.", "Closing Disclosure discloses closing."),
        q("The Equal Credit Opportunity Act prohibits what?", "Discrimination in credit based on protected characteristics.", ["All credit checks.", "All mortgage interest.", "All property taxes."], "ECOA bars discrimination in lending on protected bases such as race, color, religion, national origin, sex, marital status, age, and public assistance status.", "ECOA = equal credit opportunity."),
        q("Usury laws primarily regulate what?", "Excessive interest rates.", ["Legal descriptions.", "Appraisal license renewal.", "Subdivision names."], "Usury laws limit interest or lending charges under applicable law.", "Usury = unlawful interest."),
        q("Foreclosure is best described as what?", "A legal process to enforce a security interest after default.", ["A buyer's inspection period.", "A seller's tax exemption.", "A zoning appeal."], "Foreclosure allows a lender to pursue the collateral when the borrower defaults.", "Foreclosure closes out the borrower's rights."),
        q("A short sale usually requires what?", "Lender approval to accept less than the debt owed.", ["No seller consent.", "No mortgage on the property.", "Automatic buyer ownership."], "In a short sale, sale proceeds are insufficient to pay the debt, so lender approval is needed.", "Short sale = proceeds short of debt."),
        q("Subordination changes what?", "Lien priority.", ["The legal description shape.", "The buyer's age.", "The number of fixtures."], "A subordination agreement lets one lien move behind another in priority.", "Subordination sends one lien below."),
        q("Seller financing means what?", "The seller extends credit to the buyer for part of the purchase price.", ["The seller must pay all cash.", "The lender owns the listing.", "The appraisal is canceled."], "Seller financing occurs when the seller carries a note or otherwise finances the buyer.", "Seller financing = seller acts like lender."),
        q("A buydown is used to do what?", "Reduce the borrower's interest rate or payment for a period or under loan terms.", ["Change the legal owner automatically.", "Eliminate title insurance.", "Create a zoning variance."], "A buydown uses funds to lower the rate or payment according to the loan agreement.", "Buydown buys the payment down."),
        q("An escrow or impound account commonly collects what?", "Taxes and insurance with the mortgage payment.", ["Only moving costs.", "Only inspection objections.", "Only seller net proceeds."], "Lenders may collect taxes and insurance into escrow accounts to pay them when due.", "Impound holds taxes and insurance."),
        q("A loan origination fee is usually charged for what?", "Making or processing the loan.", ["Recording a subdivision plat.", "Issuing a zoning variance.", "Preparing a home inspection."], "Origination fees compensate the lender or originator for creating the loan.", "Origination originates the loan.")
      ]
    },
    {
      id: "agency",
      name: "Agency Principles",
      weight: "About 13%",
      summary: "Client duties, customer obligations, agency types, disclosure, confidentiality, dual agency, and broker supervision.",
      topics: ["Fiduciary duties", "Clients vs customers", "Dual agency", "Disclosure", "Broker supervision"],
      questions: [
        q("A principal in an agency relationship is also called what?", "Client.", ["Customer.", "Escrow holder.", "General contractor."], "The principal is the client who authorizes an agent to act on the client's behalf.", "Principal = person you represent."),
        q("A buyer who is not represented by the listing agent is best described as what to that agent?", "Customer.", ["Client.", "Principal.", "Fiduciary."], "A customer receives honesty and required disclosures but is not owed full client fiduciary duties by that agent.", "Client gets loyalty; customer gets honesty."),
        q("Which mnemonic covers common fiduciary duties?", "OLD CAR.", ["TTIP.", "MARIA.", "PITI."], "OLD CAR stands for obedience, loyalty, disclosure, confidentiality, accounting, and reasonable care.", "OLD CAR carries fiduciary duties."),
        q("Which duty requires putting the client's interests first within lawful limits?", "Loyalty.", ["Escheat.", "Accretion.", "Subordination."], "Loyalty requires the agent to act in the client's best interest, while still obeying law and disclosure duties.", "Loyalty is client-first."),
        q("Which duty requires following lawful client instructions?", "Obedience.", ["Confession.", "Condemnation.", "Contribution."], "Obedience applies to lawful instructions, not illegal or unethical directions.", "Obey lawful orders."),
        q("Which duty normally survives agency termination?", "Confidentiality.", ["Showing every house forever.", "Paying the client's taxes.", "Guaranteeing loan approval."], "Confidentiality usually continues after the agency relationship ends.", "Confidentiality continues."),
        q("Which duty requires careful handling of money and documents?", "Accounting.", ["Avulsion.", "Accession.", "Assemblage."], "Accounting requires proper handling and tracking of funds and property entrusted to the agent.", "Accounting accounts for money."),
        q("Agency created by spoken or written agreement is what?", "Express agency.", ["Implied agency.", "Ostensible title.", "Escheat."], "Express agency is intentionally created by agreement, often written for real estate brokerage.", "Express = expressly agreed."),
        q("Agency inferred from behavior may be what?", "Implied agency.", ["Severalty.", "Novation.", "Taxation."], "Implied agency can arise from conduct, even without a formal express agreement.", "Implied = shown by actions."),
        q("A party appearing to be an agent because of the principal's actions may create what risk?", "Ostensible or apparent agency.", ["Riparian ownership.", "Metes and bounds.", "Physical deterioration."], "Apparent agency can arise when a principal causes others to reasonably believe agency exists.", "Apparent agency appears authorized."),
        q("An agent authorized for one specific transaction is usually what type?", "Special agent.", ["Universal agent.", "General contractor.", "Tenant at sufferance."], "Real estate licensees are commonly special agents for a specific transaction or task.", "Special agent = specific job."),
        q("A property manager with continuing authority over a property is often what type of agent?", "General agent.", ["Special agent only.", "Universal agent always.", "No agent ever."], "A general agent has ongoing authority over a range of tasks in a business or property context.", "General agent handles general ongoing work."),
        q("An agent with broad authority under a power of attorney may be what type?", "Universal agent.", ["Subagent only.", "Customer only.", "Licensee only."], "A universal agent has broad authority to act for the principal, often through power of attorney.", "Universal = unusually broad."),
        q("Representing both buyer and seller in the same transaction is called what?", "Dual agency.", ["Subrogation.", "Avulsion.", "Plottage."], "Dual agency involves one brokerage or agent representing both sides and usually requires informed consent where allowed.", "Dual = two sides."),
        q("Designated agency usually means what?", "Different agents in the same brokerage are designated for different clients.", ["No one represents anyone.", "One buyer owns two houses.", "A lender sets zoning."], "Designated agency separates representation inside a brokerage when allowed by law and brokerage policy.", "Designated = assigned agents."),
        q("Undisclosed dual agency is risky because it does what?", "Violates loyalty and informed consent expectations.", ["Automatically records a deed.", "Always lowers property taxes.", "Creates a legal description."], "Dual agency without required disclosure and consent can breach fiduciary duties and licensing rules.", "Dual needs disclosure."),
        q("Which fact should generally be disclosed to a customer?", "Known material defect affecting the property.", ["The seller's private minimum price unless authorized.", "The buyer's private maximum unless authorized.", "Confidential client motivation."], "Agents usually must disclose known material facts while protecting client confidences.", "Material facts matter."),
        q("A licensee buying property for personal account should disclose what?", "The licensee's ownership interest or licensed status as required.", ["Only favorite paint colors.", "Only commission split.", "Nothing under any circumstances."], "Licensees must avoid hidden self-dealing and follow disclosure rules when personally involved.", "Self-interest should not be secret."),
        q("Ministerial acts are best described as what?", "Administrative tasks that do not require discretion or advice.", ["Full fiduciary representation.", "A guaranteed appraisal.", "A deed transfer."], "Ministerial acts can include factual or clerical help without creating full agency duties, depending on law.", "Ministerial = mechanical help."),
        q("A broker's responsibility for affiliated licensees is generally called what?", "Supervision.", ["Accretion.", "Reconciliation.", "Regression."], "Brokers are responsible for supervising licensed activity under their brokerage.", "Broker supervises the business."),
        q("Which duty is owed to both clients and customers?", "Honesty and fair dealing.", ["Full loyalty to both sides.", "Confidentiality of both sides in conflict.", "Guaranteed profit."], "Even without client status, parties are owed honesty and required disclosure.", "Everyone gets honesty."),
        q("A buyer agency agreement primarily creates what?", "A representation relationship between buyer and brokerage.", ["Title insurance.", "A zoning variance.", "A mortgage payoff."], "Buyer agency agreements establish representation terms, duties, and compensation issues.", "Buyer agency = buyer representation."),
        q("Agency can terminate by which event?", "Completion, expiration, mutual agreement, revocation, or death/incapacity in many cases.", ["Only paint color change.", "Only a new listing photo.", "Only a higher tax assessment."], "Agency can end through performance, time, agreement, cancellation, or operation of law.", "Agency ends by done, date, decision, or death."),
        q("A seller's confidential reason for moving should be disclosed only when what?", "The seller authorizes disclosure or law requires it.", ["A buyer asks casually.", "The agent thinks it is interesting.", "A neighbor knows a rumor."], "Confidential motivations are protected unless authorized or legally required to disclose.", "Motivation is confidential unless permitted."),
        q("Reasonable care means what in agency practice?", "Using competence and diligence expected of a real estate professional.", ["Guaranteeing every result.", "Replacing legal advice.", "Ignoring deadlines."], "Reasonable care requires skill, diligence, and attention within the agent's role.", "Care = competent caution.")
      ]
    },
    {
      id: "property-disclosures",
      name: "Property Disclosures",
      weight: "About 6%",
      summary: "Known defects, federal lead rules, environmental concerns, agency disclosure, licensee interest, and risk communication.",
      topics: ["Lead-based paint", "Material defects", "Environmental hazards", "Agency disclosure", "Licensee interest"],
      questions: [
        q("Federal lead-based paint disclosure rules generally apply to housing built before what year?", "1978.", ["1968.", "1988.", "2008."], "Federal lead disclosure rules apply to most pre-1978 residential housing.", "Lead before 78."),
        q("Which item is most likely a material defect requiring disclosure?", "Known active roof leak.", ["Seller's favorite curtains.", "Buyer's preferred lender.", "A neighbor's paint color."], "A material defect is an important condition that could affect value, use, or desirability.", "Material means it matters."),
        q("A latent defect is best described as what?", "A hidden defect not readily observable.", ["A defect visible from the street.", "A buyer's loan term.", "A recorded plat."], "Latent defects are hidden and may require disclosure if known and material.", "Latent = lying low."),
        q("Which statement is safest when a buyer asks about square footage?", "Identify the source and advise verification.", ["Guarantee it from memory.", "Invent a number.", "Say square footage never matters."], "Measurements can vary by source, so source disclosure and verification are safer.", "Source it, then verify it."),
        q("Agency disclosure informs parties about what?", "Who the licensee represents.", ["The exact future market value.", "The buyer's moving budget.", "The seller's tax return."], "Agency disclosure clarifies representation and helps avoid confusion about duties.", "Agency disclosure answers: who do I work for?"),
        q("A licensee selling property they own should usually disclose what?", "Their licensed status or ownership interest as required.", ["Only that they like the property.", "Only the appraiser's name.", "Only the buyer's initials."], "Licensees must avoid misleading parties about their interest in the transaction.", "Licensed owner? Disclose the role."),
        q("Which environmental issue can require careful disclosure and expert review?", "Known underground storage tank.", ["A fresh welcome mat.", "A new mailbox number.", "A moved sofa."], "Underground tanks can create contamination and liability concerns.", "Tank underground can mean trouble underground."),
        q("Asbestos is most associated with what?", "Older building materials and health risk when disturbed.", ["Loan interest only.", "Zoning setbacks only.", "Commission splits only."], "Asbestos may be present in older materials and should be handled by qualified professionals.", "Asbestos = ask before disturbing."),
        q("Radon is best described as what?", "A naturally occurring radioactive gas that can enter buildings.", ["A title insurance clause.", "A mortgage discount point.", "A legal description method."], "Radon can affect indoor air quality and often requires testing to know levels.", "Radon rises from rock/soil."),
        q("Mold concerns should usually be handled how?", "Disclose known issues and recommend qualified inspection or remediation advice.", ["Hide stains with furniture.", "Guarantee it is harmless.", "Diagnose it without expertise."], "Agents should not overstate expertise; known issues should be disclosed and referred to specialists.", "Mold = disclose, do not diagnose."),
        q("Flood hazard disclosure is important because it may affect what?", "Insurance, financing, use, and risk.", ["Only the agent's business card.", "Only the title font.", "Only the number of bedrooms allowed nationally."], "Flood status can affect buyer risk, lender requirements, and insurance costs.", "Flood affects finance and future risk."),
        q("HOA disclosures are important because buyers may need to know what?", "Rules, fees, assessments, and restrictions.", ["The seller's favorite restaurant.", "The buyer's credit score.", "The appraiser's home address."], "Association documents can affect cost, use, leasing, pets, improvements, and ownership duties.", "HOA = house owner obligations."),
        q("A seller property disclosure is usually meant to do what?", "Communicate known property conditions.", ["Replace inspections completely.", "Guarantee no future repairs.", "Set the mortgage interest rate."], "Disclosure forms help sellers share known conditions but do not replace inspections.", "Disclosure informs; inspection verifies."),
        q("If an agent does not know the answer to a property condition question, the best response is what?", "Say they do not know and direct the party to verify with the proper source.", ["Guess confidently.", "Promise a result.", "Ignore the question."], "Agents should avoid guessing and should route technical questions to proper experts.", "Do not know? Say so and source it."),
        q("Which fact is more likely to require disclosure than confidential motivation?", "Known structural defect.", ["Seller's private bottom price.", "Buyer's private maximum price.", "Seller's urgency if confidential."], "Material property facts are treated differently from confidential client strategy or motivation.", "Defects disclose; strategy protect."),
        q("A conflict of interest should usually be handled how?", "Disclose it before the party relies on the licensee's advice.", ["Hide it until closing.", "Mention it only after a dispute.", "Assume it never matters."], "Conflicts can affect trust and consent, so timely disclosure is critical.", "Conflict concealed becomes conflict compounded."),
        q("Which federal disclosure is tied to settlement costs and affiliated business arrangements?", "RESPA disclosure.", ["Lead paint only.", "Zoning certificate only.", "Metes and bounds notice."], "RESPA includes rules for settlement disclosures and affiliated business arrangements in covered transactions.", "RESPA = settlement practice disclosure."),
        q("Property condition statements should generally avoid what?", "Unsupported guarantees.", ["Known facts.", "Source references.", "Verification recommendations."], "Unsupported guarantees can mislead buyers and create risk.", "No proof, no promise."),
        q("An agent learns a listed home has a known septic failure. What should the agent generally do?", "Follow disclosure duties and broker guidance before a buyer relies on incomplete information.", ["Keep marketing as if no issue exists.", "Tell buyers inspections are not needed.", "Change the school district in the remarks."], "Known material conditions should be handled through required disclosure and broker procedures.", "Septic failure is not a secret feature."),
        q("Which is a safer advertising disclosure practice?", "Use accurate claims that can be supported.", ["Use exaggerated guarantees.", "Hide required brokerage information.", "Invent awards."], "Advertising should be truthful, supportable, and compliant with applicable rules.", "Advertise only what you can substantiate."),
        q("A buyer asks if a property is haunted. Many states treat stigmatized property how?", "Rules vary by state, so check state law and broker guidance.", ["Always a federal disclosure.", "Never relevant anywhere.", "Always title insurance only."], "Stigmatized property rules vary, so candidates should avoid one-size-fits-all answers unless the exam specifies.", "Stigma rules are state-specific."),
        q("Which is the best answer when disclosure law varies by state?", "Follow the state's current law and required forms.", ["Assume every state is identical.", "Use only internet rumors.", "Skip broker review."], "National questions often test the general concept while state portions test local details.", "State details live in state law."),
        q("Why should inspection reports be handled carefully?", "They may contain technical findings that should not be distorted or selectively hidden.", ["They always replace appraisals.", "They set zoning automatically.", "They eliminate all future repairs."], "Inspection findings should be shared and interpreted according to contract, law, and expert guidance.", "Inspection reports require careful reporting."),
        q("What is the safest practice for environmental claims like 'no mold' or 'lead free'?", "Avoid guarantees unless supported by proper testing and documentation.", ["Say it if the house smells clean.", "Say it if the seller is confident.", "Say it if the buyer wants reassurance."], "Environmental conditions often require expert testing, not casual assurances.", "Test before you testify."),
        q("Which statement about disclosures is most exam-safe?", "Disclose known material facts and avoid practicing outside your expertise.", ["Conceal defects to protect the sale.", "Give legal advice whenever asked.", "Guarantee every seller statement."], "The exam often rewards honest disclosure, documentation, and proper referral to experts.", "Disclose, document, defer to experts.")
      ]
    },
    {
      id: "contracts",
      name: "Contracts",
      weight: "About 17%",
      summary: "Contract formation, validity, contingencies, remedies, option rights, assignments, amendments, and breach.",
      topics: ["Offer and acceptance", "Consideration", "Contingencies", "Breach", "Remedies"],
      questions: [
        q("Which element is required for a valid contract?", "Offer and acceptance.", ["A specific paint color.", "A recorded survey every time.", "A lender appraisal every time."], "A valid contract generally requires offer, acceptance, consideration, capacity, and legal purpose.", "COAL: consideration, offer/acceptance, ability, legality."),
        q("Consideration means what in a contract?", "Something of value exchanged by the parties.", ["Only cash paid at closing.", "Only a deed restriction.", "Only an appraisal report."], "Consideration can be money, promises, performance, or other value recognized by law.", "Consideration = exchange."),
        q("The statute of frauds generally requires real estate sales contracts to be what?", "In writing and signed by the party to be charged.", ["Only verbal.", "Recorded before offer.", "Printed on blue paper."], "Most real estate sale contracts must be written to be enforceable.", "Frauds fears forgotten words: write it down."),
        q("A contract signed by a minor is usually what?", "Voidable by the minor.", ["Always void for everyone.", "Always fully executed.", "Always illegal."], "Minors generally lack full legal capacity, making many contracts voidable by the minor.", "Minor may make it voidable."),
        q("A contract for an illegal purpose is what?", "Void.", ["Voidable only by the seller.", "Valid but expensive.", "Executory."], "A contract requiring illegal performance has no legal effect.", "Illegal = void."),
        q("An enforceable contract with all required elements is what?", "Valid.", ["Void.", "Unilateral only.", "Unrecorded lien."], "A valid contract meets legal requirements for enforceability.", "Valid = legally alive."),
        q("A contract that appears valid but one party may cancel is what?", "Voidable.", ["Void.", "Executed.", "Novated."], "Voidable contracts can be avoided by a party with a legal reason, such as incapacity, duress, or fraud.", "Voidable = can be voided."),
        q("A contract that has not yet been fully performed is what?", "Executory.", ["Executed.", "Recorded.", "Escheated."], "Executory means performance remains to be completed.", "Executory = still executing."),
        q("A contract that has been fully performed is what?", "Executed.", ["Executory.", "Voidable.", "Implied."], "Executed means the parties have completed performance.", "Executed = done."),
        q("A counteroffer usually does what to the original offer?", "Rejects and terminates it.", ["Automatically accepts it.", "Records it.", "Converts it to a lease."], "A counteroffer is a new offer and usually terminates the original offer.", "Counter kills and creates."),
        q("A financing contingency protects a buyer mainly if what happens?", "The buyer cannot obtain financing under stated terms.", ["The buyer dislikes the paint.", "The seller wants more rent.", "The tax assessor changes office hours."], "Contingencies create conditions that must be satisfied or waived.", "Contingency = condition."),
        q("An inspection contingency usually gives a buyer what?", "A right to inspect and act under the contract terms.", ["Automatic ownership.", "Guaranteed repair by every seller.", "No need for deadlines."], "Inspection contingencies depend on the written contract and deadlines.", "Inspect within the inspection period."),
        q("Time is of the essence means what?", "Deadlines must be strictly followed.", ["Deadlines never matter.", "Only verbal dates matter.", "Only the lender can read dates."], "Time-is-of-the-essence clauses make timely performance critical.", "Essence = exact deadline energy."),
        q("Assignment of a contract means what?", "Transferring contractual rights to another party.", ["Replacing the contract with a new one for all parties.", "Recording a deed.", "Creating a zoning variance."], "Assignment transfers rights unless restricted, while duties may remain unless released.", "Assignment assigns rights."),
        q("Novation means what?", "Replacing an old contract or party with a new one by agreement.", ["Adding a fixture.", "Recording a plat.", "Estimating value."], "Novation substitutes a new obligation or party and releases the old one if agreed.", "Novation = new obligation."),
        q("A breach of contract is what?", "Failure to perform a contractual duty without legal excuse.", ["A new legal description.", "A type of ownership.", "A tax assessment method."], "Breach occurs when a party fails to meet required contract terms.", "Breach breaks the promise."),
        q("Specific performance asks a court to do what?", "Require a party to perform the contract.", ["Set a new interest rate.", "Issue a driver's license.", "Create a flood map."], "Specific performance is an equitable remedy often tied to unique real estate.", "Specific performance = perform specifically."),
        q("Liquidated damages are best described as what?", "A pre-agreed damages amount in the contract.", ["A property tax bill.", "A lender's interest rate.", "An appraisal method."], "Liquidated damages clauses set agreed damages if enforceable under law.", "Liquidated damages are listed in advance."),
        q("Rescission does what?", "Cancels the contract and attempts to restore parties to prior positions.", ["Adds a new buyer automatically.", "Raises the appraisal.", "Creates a leasehold estate."], "Rescission unwinds a contract when allowed.", "Rescind = rewind."),
        q("An option contract gives the optionee what?", "The right, but not the obligation, to buy or lease under stated terms.", ["Automatic ownership without exercise.", "A guaranteed mortgage.", "A zoning permit."], "An option binds the optionor while giving the optionee a choice during the option period.", "Option = optional for optionee."),
        q("A right of first refusal gives a holder what?", "A chance to match or accept an offer before sale to another.", ["Automatic deed today.", "A mortgage payoff.", "A title insurance license."], "A right of first refusal is triggered when the owner decides to sell under covered terms.", "First refusal = first chance."),
        q("An amendment does what to a contract?", "Changes the existing contract by agreement.", ["Creates a new contract with no relation.", "Records the deed.", "Terminates all duties automatically."], "Amendments modify contract terms and should be agreed to by required parties.", "Amendment amends."),
        q("An addendum usually does what?", "Adds terms or information to a contract.", ["Erases all signatures.", "Creates a tax lien.", "Approves a loan."], "An addendum is attached to and becomes part of the contract when agreed.", "Addendum adds."),
        q("Earnest money is best described as what?", "A deposit showing buyer seriousness and governed by the contract.", ["A required federal tax.", "A broker's guaranteed commission.", "A zoning fee."], "Earnest money handling depends on the contract, escrow rules, and applicable law.", "Earnest = serious money."),
        q("Fraud or material misrepresentation may make a contract what?", "Voidable by the injured party.", ["Automatically fully performed.", "A deed restriction.", "A leasehold estate."], "Misrepresentation can give the injured party a right to rescind or seek remedies.", "Fraud can make the deal voidable.")
      ]
    },
    {
      id: "leasing-property-management",
      name: "Leasing and Property Management",
      weight: "About 3%",
      summary: "Leasehold estates, lease types, tenant rights, assignments, subleases, management duties, and rental practice.",
      topics: ["Leasehold estates", "Lease types", "Subleasing", "Management agreements", "Tenant protections"],
      questions: [
        q("Which estate has a definite beginning and ending date?", "Estate for years.", ["Periodic tenancy.", "Tenancy at will.", "Tenancy at sufferance."], "An estate for years lasts for a fixed term and ends automatically on the stated date.", "For years = fixed term, even if not years."),
        q("A month-to-month tenancy is usually what?", "Periodic tenancy.", ["Estate for years.", "Freehold estate.", "Life estate."], "Periodic tenancy renews automatically for successive periods until terminated by notice.", "Periodic repeats by period."),
        q("A tenancy with no fixed term that can be ended by either party is what?", "Tenancy at will.", ["Tenancy at sufferance.", "Fee simple.", "Easement appurtenant."], "Tenancy at will continues only as long as both parties allow it, subject to notice rules.", "At will = as parties will."),
        q("A tenant stays after lease expiration without permission. What is this?", "Tenancy at sufferance.", ["Estate for years.", "Joint tenancy.", "Net lease."], "Tenancy at sufferance exists when a tenant wrongfully holds over.", "Sufferance = owner suffers holdover."),
        q("A gross lease usually means the tenant pays what?", "Fixed rent while the landlord pays many property expenses.", ["All taxes, insurance, and maintenance separately.", "Only a percentage of sales.", "No rent ever."], "In a gross lease, landlord expenses are built into the rent structure.", "Gross lease = one gross rent."),
        q("A net lease usually shifts what to the tenant?", "Some property expenses in addition to rent.", ["Ownership title.", "Zoning authority.", "Appraisal license."], "Net leases may require tenants to pay taxes, insurance, maintenance, or other expenses.", "Net lease nets expenses to tenant."),
        q("A percentage lease is commonly based on what?", "Tenant sales revenue.", ["Survey acreage.", "Loan-to-value only.", "Property tax millage only."], "Percentage leases often include base rent plus a percentage of gross sales.", "Percentage lease follows percent of sales."),
        q("A ground lease usually leases what?", "Land for long-term development or use.", ["Only a refrigerator.", "Only a brokerage logo.", "Only a title policy."], "Ground leases lease land, often allowing tenant improvements during a long term.", "Ground lease = ground."),
        q("Assignment of a lease generally transfers what?", "The tenant's entire leasehold interest to another party.", ["Only one bedroom for one night.", "Only a repair invoice.", "Only title insurance."], "Assignment transfers the lease interest, though original tenant liability depends on terms and law.", "Assignment assigns the lease."),
        q("A sublease generally creates what?", "A new lease from tenant to subtenant for less than the tenant's full interest.", ["A deed from landlord to tenant.", "A mortgage payoff.", "A zoning amendment."], "A sublease transfers less than the full remaining leasehold interest.", "Sublease = under the lease."),
        q("Quiet enjoyment means the tenant has what right?", "Possession without improper landlord interference.", ["Silence from all neighbors.", "Free rent forever.", "Automatic property ownership."], "Quiet enjoyment protects the tenant's lawful possession from interference.", "Quiet enjoyment = peaceful possession."),
        q("Constructive eviction may occur when what happens?", "Landlord actions or failures make the premises unusable and tenant leaves under legal standards.", ["A tenant paints a wall.", "A buyer changes lenders.", "A tax bill is mailed."], "Constructive eviction is tied to serious interference with use and legal requirements.", "Constructive eviction forces leaving without a formal lockout."),
        q("The implied warranty of habitability is most tied to what?", "Minimum livable condition in residential leases.", ["Commercial commission splits.", "Title insurance premiums.", "Survey monuments."], "Habitability requires basic residential living standards under applicable law.", "Habitability = habitable home."),
        q("An eviction is best described as what?", "A legal process to remove a tenant.", ["A private self-help lockout in every state.", "A title transfer.", "A loan application."], "Evictions must follow legal procedures; self-help lockouts are often prohibited.", "Eviction needs process."),
        q("A property management agreement establishes what?", "The manager's authority, duties, compensation, and scope.", ["The buyer's loan approval.", "A zoning variance.", "A deed restriction automatically."], "Management agreements define what the manager may do for the owner.", "Management agreement manages authority."),
        q("A property manager's rent handling is most tied to which duty?", "Accounting.", ["Avulsion.", "Escheat.", "Progression."], "Managers must account for rents, deposits, expenses, and owner funds.", "Rent money needs accounting."),
        q("A rent roll usually lists what?", "Tenants, rents, lease terms, and occupancy information.", ["Only building permits.", "Only deed covenants.", "Only appraisal licenses."], "Rent rolls summarize income and occupancy for rental properties.", "Rent roll rolls up rental income."),
        q("CAM charges are most associated with what?", "Common area maintenance expenses.", ["Closing attorney memorandum.", "Capital asset mortgage.", "Condemnation appraisal method."], "CAM charges allocate common-area costs in many commercial leases.", "CAM = common area maintenance."),
        q("Security deposits are used primarily for what?", "Tenant obligations such as unpaid rent or damage, subject to law.", ["Broker advertising awards.", "Automatic appraisal increases.", "Title transfer taxes only."], "Security deposit handling is heavily regulated and varies by state.", "Deposit secures duties."),
        q("A landlord's right of entry should usually be governed by what?", "Lease terms and applicable law.", ["The landlord's mood only.", "The appraiser's schedule only.", "The buyer's lender only."], "Entry rules protect tenant possession and landlord access needs.", "Entry needs authority."),
        q("Fair housing rules in rentals prohibit what?", "Discrimination based on protected classes.", ["Screening applicants using lawful criteria.", "Collecting rent under a lease.", "Maintaining common areas."], "Rental housing is heavily tested under fair housing principles.", "Fair housing applies to rentals too."),
        q("A lease option combines a lease with what?", "An option to buy.", ["An automatic deed transfer.", "A tax foreclosure.", "A survey correction."], "A lease option gives a tenant an option to purchase under stated terms.", "Lease option = lease plus option."),
        q("A sale-leaseback means what?", "Owner sells the property and leases it back from the buyer.", ["Tenant buys furniture only.", "Broker leases a sign.", "Lender cancels the note."], "Sale-leaseback converts ownership into tenancy while often freeing capital.", "Sell it, lease it back."),
        q("A management budget helps an owner plan what?", "Income, expenses, reserves, and operations.", ["Only legal description words.", "Only buyer agency duties.", "Only survey monuments."], "Budgets guide rental operations, cash flow, maintenance, and reserves.", "Budget = building business plan."),
        q("Preventive maintenance is valuable because it can do what?", "Reduce larger repair problems and protect property value.", ["Eliminate all tenant duties.", "Guarantee appreciation.", "Replace insurance."], "Property management includes ongoing maintenance planning and risk reduction.", "Preventive maintenance prevents bigger problems.")
      ]
    },
    {
      id: "transfer-title",
      name: "Transfer of Title",
      weight: "About 8%",
      summary: "Deeds, title evidence, recording, notice, liens, title defects, probate, foreclosure, and ownership transfer.",
      topics: ["Deeds", "Title insurance", "Recording", "Notice", "Liens"],
      questions: [
        q("Which party conveys title in a deed?", "Grantor.", ["Grantee.", "Mortgagee.", "Tenant."], "The grantor gives or conveys title; the grantee receives it.", "Grantor grants."),
        q("Which party receives title in a deed?", "Grantee.", ["Grantor.", "Lienor.", "Servient tenant."], "The grantee receives the interest conveyed by the grantor.", "Grantee gets."),
        q("A deed must generally be what to transfer title?", "Delivered and accepted.", ["Only photographed.", "Only discussed verbally.", "Only placed in a drawer forever."], "Delivery and acceptance are required for deed effectiveness.", "Deed must be delivered."),
        q("Which deed gives the broadest promises by the grantor?", "General warranty deed.", ["Quitclaim deed.", "Tax deed only.", "Bill of sale."], "A general warranty deed includes broad covenants covering the title history.", "General warranty = greatest guarantee."),
        q("Which deed usually warrants only against defects caused by the grantor?", "Special warranty deed.", ["General warranty deed.", "Quitclaim deed.", "Sheriff's bill."], "Special warranty deeds limit warranties to the grantor's period of ownership.", "Special warranty = seller's watch only."),
        q("Which deed transfers whatever interest the grantor may have without warranties?", "Quitclaim deed.", ["General warranty deed.", "Special assessment deed.", "Trust deed note."], "A quitclaim deed releases the grantor's interest, if any, without title warranties.", "Quitclaim = quit any claim."),
        q("Title insurance primarily protects against what?", "Covered title defects.", ["Future market decline.", "Bad paint choices.", "Interest rate increases."], "Title insurance protects against covered title risks according to the policy.", "Title insurance insures title."),
        q("An abstract of title is best described as what?", "A summary of recorded title history.", ["A promise to lend money.", "A zoning permission.", "A property tax rate."], "An abstract summarizes recorded documents affecting title.", "Abstract abstracts the records."),
        q("Chain of title means what?", "The sequence of ownership transfers.", ["A physical chain on a gate.", "A list of mortgage rates.", "A zoning district."], "Chain of title traces ownership from one owner to the next.", "Chain links owners."),
        q("A cloud on title is what?", "A possible defect or claim affecting title.", ["A weather condition.", "A brokerage commission.", "A lease payment."], "A cloud creates uncertainty about ownership or marketability.", "Cloud makes title unclear."),
        q("A quiet title action is used to do what?", "Resolve competing title claims.", ["Lower property taxes automatically.", "Create a lease.", "Set a commission rate."], "Quiet title actions ask a court to determine title interests.", "Quiet title quiets claims."),
        q("Recording a deed gives what type of notice to the world?", "Constructive notice.", ["Actual notice only.", "No notice.", "Physical notice only."], "Recording puts the public on constructive notice of the recorded interest.", "Constructive notice is constructed by records."),
        q("A buyer who personally knows about an unrecorded easement has what?", "Actual notice.", ["No notice.", "Only constructive notice.", "Only inquiry by mail."], "Actual notice means direct knowledge of a fact.", "Actual = actually knows."),
        q("Priority of liens is often based on what?", "Time of recording, subject to exceptions.", ["Alphabetical order.", "Paint color.", "Bedroom count."], "Lien priority usually follows recording order, but taxes and statutes can create exceptions.", "First in time, first in line."),
        q("A voluntary lien is created by what?", "Owner agreement, such as a mortgage.", ["A court judgment only.", "Unpaid property taxes only.", "Adverse possession only."], "Voluntary liens are intentionally created by the owner.", "Voluntary = owner volunteered collateral."),
        q("An involuntary lien arises by what?", "Operation of law without owner agreement.", ["Owner signing a mortgage.", "Buyer signing a note.", "Tenant signing a lease."], "Involuntary liens include tax liens, judgment liens, and mechanic's liens.", "Involuntary = not invited."),
        q("Which lien is commonly filed by contractors for unpaid work?", "Mechanic's lien.", ["Riparian lien.", "Littoral lien.", "Progression lien."], "Mechanic's liens protect those who improve property and are unpaid, subject to law.", "Mechanic fixes, mechanic's lien."),
        q("Property tax liens often have what priority?", "High or superior priority under law.", ["Always last priority.", "No priority.", "Only alphabetical priority."], "Tax liens often receive special priority over other liens.", "Taxes tend to jump the line."),
        q("Probate is most associated with what?", "Handling a deceased person's estate.", ["Approving zoning setbacks.", "Issuing a mortgage rate.", "Calculating GRM."], "Probate is the legal process for administering a decedent's estate.", "Probate processes passing property."),
        q("Adverse possession can transfer title when possession meets what?", "State-law requirements such as open, notorious, hostile, continuous possession.", ["Only a verbal request.", "Only a low offer.", "Only a lease application."], "Adverse possession requirements vary but commonly involve long, visible, hostile possession.", "OCEAN: open, continuous, exclusive, adverse, notorious."),
        q("Escrow closing uses a neutral party to do what?", "Hold documents and funds until conditions are met.", ["Represent both parties as broker.", "Guarantee market value.", "Change zoning."], "Escrow coordinates funds, documents, and closing instructions.", "Escrow holds until instructions are satisfied."),
        q("A deed restriction affects title because it does what?", "Limits property use through recorded private restrictions.", ["Guarantees loan approval.", "Sets the national exam score.", "Erases all liens."], "Recorded restrictions can run with the land and affect future owners.", "Restriction rides with title."),
        q("Marketable title is title that is generally what?", "Free from reasonable doubt or serious defects.", ["Guaranteed to rise in value.", "Uninsurable forever.", "Only verbal."], "Marketable title can be conveyed without exposing the buyer to reasonable litigation risk.", "Marketable title can be marketed."),
        q("A lis pendens gives notice of what?", "Pending litigation affecting real property.", ["A new paint color.", "A completed appraisal.", "A paid utility bill."], "Lis pendens warns that a lawsuit may affect title or rights in the property.", "Lis pendens = litigation pending."),
        q("A title search is intended to find what?", "Recorded interests, liens, and defects affecting title.", ["Future interest rates.", "Moving company prices.", "Interior design trends."], "Title searches review public records for ownership and encumbrances.", "Search title before trusting title.")
      ]
    },
    {
      id: "real-estate-practice",
      name: "Real Estate Practice and Fair Housing",
      weight: "About 13%",
      summary: "Fair housing, antitrust, advertising, offers, trust funds, recordkeeping, consumer protection, and professional conduct.",
      topics: ["Fair housing", "Antitrust", "Advertising", "Trust funds", "Offers"],
      questions: [
        q("Which law prohibits discrimination in housing based on protected classes?", "Fair Housing Act.", ["RESPA only.", "TILA only.", "CERCLA only."], "The Fair Housing Act prohibits discrimination in covered housing activities.", "Fair Housing = fair access."),
        q("Which is a protected class under federal fair housing law?", "Familial status.", ["Occupation as an investor.", "Favorite sports team.", "Preferred paint color."], "Federal protected classes include race, color, religion, sex, disability, familial status, and national origin.", "Remember: race, color, religion, sex, disability, familial status, national origin."),
        q("Steering means what?", "Guiding buyers toward or away from areas based on protected class.", ["Showing homes by price range.", "Explaining commute times neutrally.", "Scheduling inspections."], "Steering is discriminatory direction based on protected characteristics.", "Steering steers people unfairly."),
        q("Blockbusting means what?", "Inducing sales by suggesting protected-class changes will affect value.", ["Recording a deed.", "Dividing a section.", "Replacing a fixture."], "Blockbusting uses fear of demographic change to generate transactions and is prohibited.", "Blockbusting busts trust in a block."),
        q("Redlining is most associated with what?", "Denying services or credit based on neighborhood protected-class patterns.", ["Painting property lines red.", "Correcting a contract typo.", "Creating a CMA."], "Redlining denies or limits services in areas for discriminatory reasons.", "Redline means unfair line around areas."),
        q("A reasonable accommodation is usually tied to what protected class?", "Disability.", ["Investor status.", "Cash buyer status.", "Brokerage brand."], "Reasonable accommodations adjust rules or practices so people with disabilities can use housing.", "Accommodation adapts for disability."),
        q("Which advertisement is most likely a fair housing problem?", "\"Perfect for singles, no children preferred.\"", ["\"Three bedrooms near public park.\"", "\"Updated kitchen with quartz counters.\"", "\"Two-car garage and fenced yard.\""], "Ads should describe property features, not preferred protected classes.", "Describe the property, not the person."),
        q("Price fixing is prohibited by which body of law?", "Antitrust law.", ["Fixture law.", "Survey law.", "Probate law only."], "Competitors cannot agree to set commission rates or fees.", "Antitrust hates agreed prices."),
        q("Which statement about commissions is safest?", "Commissions are negotiable and set independently.", ["All brokers charge the same.", "The government sets every commission.", "Agents must follow a neighborhood rate."], "Antitrust rules prohibit agreements that fix commissions.", "Never say standard commission."),
        q("Market allocation occurs when competitors agree to do what?", "Divide territories, customers, or property types.", ["Disclose material defects.", "Use written contracts.", "Verify square footage."], "Competitors cannot agree to split markets to reduce competition.", "Allocation allocates markets illegally."),
        q("A group boycott is what?", "Competitors agreeing not to deal with a person or business.", ["A buyer rejecting a counteroffer alone.", "A seller choosing one offer.", "A lender denying credit for lawful reasons."], "Group boycotts are antitrust violations when competitors coordinate refusal to deal.", "Boycott = group shutout."),
        q("A tying arrangement requires what?", "One product or service as a condition of another.", ["A property inspection.", "A legal description.", "A title search."], "Illegal tying can occur when a consumer must buy one service to get another.", "Tie-in ties products together."),
        q("Earnest money received by a brokerage should generally be handled how?", "Deposited and accounted for under law and broker policy.", ["Placed in an agent's personal pocket.", "Spent before closing.", "Ignored until dispute."], "Trust funds require careful handling, records, and timely deposit according to rules.", "Trust money goes to trust handling."),
        q("When presenting offers, the safest general rule is what?", "Present all offers promptly unless legally instructed otherwise.", ["Hide low offers automatically.", "Present only cash offers.", "Wait until after closing."], "Agents should follow law, broker policy, and client instructions for timely offer presentation.", "Offer in hand? Present per rules."),
        q("Advertising should generally include what?", "Truthful, nonmisleading information and required brokerage disclosures.", ["Guaranteed appreciation.", "Hidden license status.", "False awards."], "Real estate advertising must be accurate and comply with broker and license-law requirements.", "Ads need accuracy and authority."),
        q("Do-not-call rules mainly affect what?", "Telephone solicitation.", ["Deed validity.", "Zoning density.", "Title insurance claims."], "DNC rules limit telemarketing calls and require compliance procedures.", "Do not call means do not call."),
        q("RESPA referral fee rules generally prohibit what?", "Kickbacks for settlement service referrals.", ["Lawful payment for actual services.", "Written buyer agency.", "Property inspections."], "RESPA restricts unearned fees and kickbacks in covered settlement services.", "RESPA rejects referral kickbacks."),
        q("Recordkeeping rules matter because brokers must be able to show what?", "Transaction, trust, and disclosure records as required.", ["Only social media likes.", "Only paint samples.", "Only moving truck mileage."], "Real estate practice requires documentation and retention under applicable rules.", "Records rescue recollection."),
        q("A licensee should avoid giving legal advice because what?", "Legal advice belongs to attorneys.", ["Clients dislike clear referrals.", "Contracts never need review.", "Law is never tested."], "Agents can explain process but should refer legal interpretation to attorneys.", "Explain process; refer law."),
        q("Which action best protects consumer privacy?", "Limit sharing of personal information to legitimate transaction needs.", ["Post loan documents publicly.", "Email private data casually.", "Keep no security practices."], "Consumer information should be handled carefully and shared only as appropriate.", "Privacy protects people."),
        q("What is puffing?", "Subjective sales talk that is not a factual guarantee.", ["A required title covenant.", "A mortgage payoff.", "A zoning map."], "Puffing is opinion; misrepresentation is false or misleading fact.", "Puffing is opinion, not promise."),
        q("Misrepresentation is more serious than puffing because it involves what?", "False or misleading facts.", ["A subjective opinion only.", "A legal description.", "A rent roll."], "Misrepresentation can create legal liability and contract remedies.", "Facts must be factual."),
        q("A safety plan for showings is part of what practice concern?", "Risk management.", ["Adverse possession.", "Reconciliation.", "Escheat."], "Licensees should manage personal, client, property, and transaction risk.", "Risk management manages risk."),
        q("A broker price opinion is best described as what?", "An informal estimate of price, not a formal appraisal.", ["A title policy.", "A mortgage note.", "A deed."], "BPOs and CMAs are not the same as appraisals and should be presented accurately.", "BPO = broker price opinion."),
        q("The safest exam answer when a licensee is unsure about compliance is usually what?", "Ask the broker or appropriate professional before acting.", ["Guess quickly.", "Ignore the issue.", "Promise the client it is fine."], "The exam rewards documentation, supervision, and proper referral.", "When unsure, escalate before action.")
      ]
    },
    {
      id: "real-estate-calculations",
      name: "Real Estate Calculations",
      weight: "About 8%",
      summary: "Area, acreage, prorations, commissions, LTV, points, interest, taxes, cap rates, GRM, NOI, and conversions.",
      topics: ["Acreage", "Proration", "Commission", "LTV", "Cap rates"],
      questions: [
        q("How many square feet are in one acre?", "43,560.", ["40,320.", "45,360.", "35,460."], "One acre equals 43,560 square feet.", "4 grandmas going 35 in a 60 = 43,560."),
        q("A lot is 100 feet by 200 feet. How many square feet is it?", "20,000 square feet.", ["2,000 square feet.", "30,000 square feet.", "10,200 square feet."], "Area of a rectangle equals length times width: 100 x 200 = 20,000.", "Rectangle area = long side times wide side."),
        q("A 87,120 square foot parcel contains how many acres?", "2 acres.", ["1 acre.", "3 acres.", "4 acres."], "87,120 / 43,560 = 2 acres.", "Divide square feet by 43,560."),
        q("A commission is 6% on a $300,000 sale. What is the total commission?", "$18,000.", ["$1,800.", "$12,000.", "$36,000."], "300,000 x 0.06 = 18,000.", "Percent means move decimal and multiply."),
        q("An agent receives 60% of an $18,000 commission. How much does the agent receive?", "$10,800.", ["$7,200.", "$18,600.", "$6,000."], "18,000 x 0.60 = 10,800.", "Split the commission by the split percent."),
        q("A buyer gets a $240,000 loan on a $300,000 purchase. What is the LTV?", "80%.", ["20%.", "75%.", "125%."], "Loan-to-value equals loan amount divided by value: 240,000 / 300,000 = 0.80.", "Loan over value."),
        q("A buyer pays 20% down on a $300,000 purchase. What is the down payment?", "$60,000.", ["$30,000.", "$80,000.", "$240,000."], "300,000 x 0.20 = 60,000.", "Down payment = price times down percent."),
        q("Two points on a $200,000 loan equal what?", "$4,000.", ["$2,000.", "$20,000.", "$400."], "One point is 1% of the loan. Two points = 2% x 200,000 = 4,000.", "Points point to percent of loan."),
        q("Annual interest on a $100,000 interest-only loan at 6% is what?", "$6,000.", ["$600.", "$16,000.", "$1,667."], "100,000 x 0.06 = 6,000 annual interest.", "Interest = principal x rate x time."),
        q("Monthly interest on $100,000 at 6% interest-only is what?", "$500.", ["$6,000.", "$50.", "$1,200."], "Annual interest is 6,000; monthly is 6,000 / 12 = 500.", "Annual to monthly: divide by 12."),
        q("NOI is $50,000 and value is $625,000. What is the cap rate?", "8%.", ["6%.", "10%.", "12.5%."], "Cap rate = NOI / value = 50,000 / 625,000 = 0.08.", "I over V = R."),
        q("NOI is $72,000 and cap rate is 9%. What is value?", "$800,000.", ["$648,000.", "$72,009.", "$80,000."], "Value = NOI / rate = 72,000 / 0.09 = 800,000.", "Value = income divided by rate."),
        q("A property sells for $480,000 and annual gross rent is $48,000. What is GRM?", "10.", ["0.10.", "48.", "100."], "GRM = price / gross rent = 480,000 / 48,000 = 10.", "GRM = price over gross rent."),
        q("Gross income is $100,000 and operating expenses are $35,000. What is NOI?", "$65,000.", ["$135,000.", "$35,000.", "$100,000."], "NOI equals gross operating income minus operating expenses.", "NOI = income minus operating expenses."),
        q("A building costs $500,000 and depreciates straight-line over 25 years. Annual depreciation is what?", "$20,000.", ["$25,000.", "$12,500.", "$5,000."], "500,000 / 25 = 20,000 per year.", "Straight-line depreciation divides evenly."),
        q("Assessed value is $200,000 and tax rate is 25 mills. Annual tax is what?", "$5,000.", ["$500.", "$25,000.", "$8,000."], "25 mills means 0.025. 200,000 x 0.025 = 5,000.", "Mills move three decimals."),
        q("Market value is $400,000 and assessment ratio is 40%. Assessed value is what?", "$160,000.", ["$400,040.", "$100,000.", "$240,000."], "400,000 x 0.40 = 160,000.", "Assessed = market times assessment ratio."),
        q("Annual taxes are $3,600. What is the monthly tax amount for proration?", "$300.", ["$30.", "$600.", "$3,600."], "3,600 / 12 = 300 per month.", "Annual to monthly: divide by 12."),
        q("Rent is $1,500 per month. Using a 30-day month, daily rent is what?", "$50.", ["$45.", "$60.", "$500."], "1,500 / 30 = 50 per day.", "Monthly over 30 = daily for 30-day prorations."),
        q("A house sells for $360,000 and is 2,000 square feet. Price per square foot is what?", "$180.", ["$18.", "$200.", "$720."], "360,000 / 2,000 = 180 per square foot.", "Price per foot = price divided by feet."),
        q("A seller owes $210,000, pays $18,000 commission, and sells for $300,000 before other costs. Approximate net is what?", "$72,000.", ["$90,000.", "$108,000.", "$282,000."], "300,000 - 210,000 - 18,000 = 72,000.", "Net = sale price minus debts and costs."),
        q("A buyer receives a 3% seller concession on a $300,000 price. What is the concession?", "$9,000.", ["$3,000.", "$30,000.", "$900."], "300,000 x 0.03 = 9,000.", "Concession = price times percent."),
        q("One section in the rectangular survey system contains how many acres?", "640 acres.", ["43,560 acres.", "160 acres.", "36 acres."], "One section is one square mile, or 640 acres.", "Section has 640; township has 36 sections."),
        q("One township contains how many sections?", "36 sections.", ["6 sections.", "30 sections.", "640 sections."], "A township is six miles by six miles, making 36 one-square-mile sections.", "6 by 6 = 36."),
        q("A seller paid $250,000 and sells for $325,000 before costs. The gross gain is what?", "$75,000.", ["$575,000.", "$65,000.", "$25,000."], "325,000 - 250,000 = 75,000 gross gain before costs and tax details.", "Gain = sale minus basis in simple exam math.")
      ]
    }
  ];

  var state = {
    sectionId: null,
    index: 0,
    answers: [],
    selectedChoice: null,
    mode: "dashboard",
    session: null,
    progress: loadProgress(),
    accessStatus: "locked",
    accessEmail: "",
    accessToken: "",
    accessCode: "",
    accessMessage: "",
    progressSyncStatus: "",
    selectedStateCode: loadStateChoice()
  };

  function loadStateChoice() {
    try {
      return localStorage.getItem(STATE_CHOICE_KEY) || DEFAULT_STATE_CODE;
    } catch (error) {
      return DEFAULT_STATE_CODE;
    }
  }

  function loadProgress() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch (error) {
      return {};
    }
  }

  function saveProgress() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.progress));
    } catch (error) {
      return;
    }
    syncProgress();
  }

  function isUnlocked() {
    return state.accessStatus === "unlocked";
  }

  function apiPost(path, payload) {
    return fetch(ACCESS_API_URL + path, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload || {})
    }).then(function (response) {
      return response.json().then(function (data) {
        if (!response.ok || !data.ok) {
          var error = new Error(data.error || "request_failed");
          error.data = data;
          throw error;
        }
        return data;
      });
    });
  }

  function storeAccess(payload) {
    state.accessStatus = "unlocked";
    state.accessToken = payload.token || state.accessToken;
    state.accessEmail = payload.email || state.accessEmail;
    state.accessCode = payload.access_code || state.accessCode;
    state.accessMessage = "Full prep unlocked.";
    try {
      if (state.accessToken) localStorage.setItem(ACCESS_TOKEN_KEY, state.accessToken);
      if (state.accessEmail) localStorage.setItem(ACCESS_EMAIL_KEY, state.accessEmail);
      if (state.accessCode) localStorage.setItem(ACCESS_CODE_KEY, state.accessCode);
      localStorage.removeItem("brqEducationFullPrepUnlocked");
    } catch (error) {
      return;
    }
  }

  function loadStoredAccess() {
    try {
      state.accessToken = localStorage.getItem(ACCESS_TOKEN_KEY) || "";
      state.accessEmail = localStorage.getItem(ACCESS_EMAIL_KEY) || "";
      state.accessCode = localStorage.getItem(ACCESS_CODE_KEY) || "";
      if (state.accessToken) state.accessStatus = "checking";
    } catch (error) {
      return;
    }
  }

  function cleanCheckoutUrl() {
    if (window.history && window.history.replaceState) {
      window.history.replaceState({}, document.title, window.location.pathname + "#practice");
    }
  }

  function hydratePaidUnlockFromUrl(root) {
    var params = new URLSearchParams(window.location.search);
    var sessionId = params.get("session_id");
    if (!sessionId) return false;
    state.accessStatus = "checking";
    state.accessMessage = "Verifying your Stripe payment...";
    renderDashboard(root);
    apiPost("/claim", { session_id: sessionId })
      .then(function (payload) {
        storeAccess(payload);
        trackEvent("purchase", {
          transaction_id: payload.transaction_id || sessionId,
          value: payload.value || 19,
          currency: String(payload.currency || "usd").toUpperCase()
        });
        cleanCheckoutUrl();
        loadCloudProgress(root);
        renderDashboard(root);
        renderAccessSuccess(root, payload);
      })
      .catch(function () {
        state.accessStatus = "locked";
        state.accessMessage = "Payment verification did not complete. Use restore access or contact support with your Stripe receipt.";
        renderDashboard(root);
        renderPaywall(root, state.accessMessage);
      });
    return true;
  }

  function verifyStoredAccess(root) {
    if (!state.accessToken) return;
    state.accessStatus = "checking";
    state.accessMessage = "Checking saved full-prep access...";
    renderDashboard(root);
    apiPost("/verify", { token: state.accessToken })
      .then(function (payload) {
        storeAccess(Object.assign({}, payload, { token: state.accessToken }));
        loadCloudProgress(root);
        renderDashboard(root);
      })
      .catch(function () {
        state.accessStatus = "locked";
        state.accessMessage = "Saved access could not be verified. Restore with your email and access code.";
        try {
          localStorage.removeItem(ACCESS_TOKEN_KEY);
        } catch (error) {
          return;
        }
        renderDashboard(root);
      });
  }

  function mergeProgress(remoteProgress) {
    if (!remoteProgress || typeof remoteProgress !== "object") return;
    Object.keys(remoteProgress).forEach(function (sectionId) {
      var local = state.progress[sectionId] || {};
      var remote = remoteProgress[sectionId] || {};
      state.progress[sectionId] = Object.assign({}, remote, local);
      if (remote.completedAt && (!local.completedAt || remote.completedAt > local.completedAt)) {
        state.progress[sectionId].score = remote.score;
        state.progress[sectionId].total = remote.total;
        state.progress[sectionId].completedAt = remote.completedAt;
      }
      var missed = []
        .concat(Array.isArray(remote.missed) ? remote.missed : [])
        .concat(Array.isArray(local.missed) ? local.missed : []);
      if (missed.length) {
        var seen = {};
        state.progress[sectionId].missed = missed.filter(function (item) {
          if (!item || !item.prompt || seen[item.prompt]) return false;
          seen[item.prompt] = true;
          return true;
        }).slice(-40);
      }
    });
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.progress));
    } catch (error) {
      return;
    }
  }

  function loadCloudProgress(root) {
    if (!state.accessToken) return;
    apiPost("/progress/get", { token: state.accessToken })
      .then(function (payload) {
        mergeProgress(payload.progress);
        state.progressSyncStatus = "Progress synced.";
        if (state.mode === "dashboard") renderDashboard(root);
      })
      .catch(function () {
        state.progressSyncStatus = "Progress is saved locally. Cloud sync will retry later.";
      });
  }

  function syncProgress() {
    if (!state.accessToken || state.accessStatus !== "unlocked") return;
    apiPost("/progress/save", { token: state.accessToken, progress: state.progress })
      .then(function () {
        state.progressSyncStatus = "Progress synced.";
      })
      .catch(function () {
        state.progressSyncStatus = "Progress saved locally.";
      });
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function currentSection() {
    return sections.find(function (section) {
      return section.id === state.sectionId;
    });
  }

  function questionItemsForSection(section) {
    return section.questions.map(function (question) {
      return Object.assign({ sectionName: section.name, sourceSectionId: section.id }, question);
    });
  }

  function allQuestionItems() {
    return sections.reduce(function (items, section) {
      return items.concat(questionItemsForSection(section));
    }, []);
  }

  function formatNumber(value) {
    return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  function selectedStateProfile() {
    return (
      stateProfiles.find(function (item) {
        return item.code === state.selectedStateCode;
      }) || stateProfiles.find(function (item) {
        return item.code === DEFAULT_STATE_CODE;
      })
    );
  }

  function statePoolTarget(profile) {
    return profile.examQuestions * STATE_POOL_MULTIPLIER;
  }

  function stateOptionsHtml(selectedCode) {
    return stateProfiles
      .map(function (profile) {
        return '<option value="' + profile.code + '"' + (profile.code === selectedCode ? " selected" : "") + ">" + escapeHtml(profile.name) + "</option>";
      })
      .join("");
  }

  function shuffled(items) {
    return items
      .map(function (item) {
        return { item: item, rank: Math.random() };
      })
      .sort(function (a, b) {
        return a.rank - b.rank;
      })
      .map(function (entry) {
        return entry.item;
      });
  }

  function renderPaidSessionLoading(root, mode) {
    var profile = selectedStateProfile();
    var label = mode === "mock" ? "Building timed readiness exam..." : mode === "state" ? "Loading state law drill..." : "Loading mixed practice...";
    root.innerHTML = [
      '<div class="education-app education-results">',
      '<button class="text-link education-back" data-action="dashboard">Back to sections</button>',
      '<p class="eyebrow">Full prep unlocked</p>',
      '<h2>' + escapeHtml(label) + '</h2>',
      '<p>Pulling a fresh ' + escapeHtml(profile.name) + ' session from the secure prep bank.</p>',
      '</div>'
    ].join("");
  }

  function startSession(root, session) {
    state.session = session;
    state.sectionId = session.sectionId || null;
    state.index = 0;
    state.answers = [];
    state.selectedChoice = null;
    state.mode = "quiz";
    renderQuiz(root);
    root.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function startSection(root, sectionId) {
    var section = sections.find(function (item) {
      return item.id === sectionId;
    });
    startSession(root, {
      type: "section",
      sectionId: section.id,
      name: section.name,
      questions: questionItemsForSection(section),
      timed: false
    });
  }

  function paidNationalQuestions(count) {
    return shuffled(allQuestionItems()).slice(0, count);
  }

  function startPaidPractice(root, mode) {
    if (!isUnlocked()) {
      renderPaywall(root);
      return;
    }
    renderPaidSessionLoading(root, mode);
    apiPost("/session/start", {
      token: state.accessToken,
      mode: mode,
      state_code: state.selectedStateCode
    })
      .then(function (payload) {
        var serverSession = payload.session || {};
        var stateQuestions = Array.isArray(serverSession.questions) ? serverSession.questions : [];
        var nationalCount = Number(serverSession.nationalQuestionCount || 0);
        var questions = stateQuestions;
        if (nationalCount > 0) questions = shuffled(paidNationalQuestions(nationalCount).concat(stateQuestions));
        if (!questions.length) throw new Error("empty_paid_session");
        startSession(root, {
          type: serverSession.type || mode,
          sectionId: serverSession.sectionId || null,
          name: serverSession.name || "Full Prep Session",
          questions: questions,
          timed: Boolean(serverSession.timed)
        });
      })
      .catch(function (error) {
        state.mode = "dashboard";
        if (error && error.data && (error.data.error === "invalid_token" || error.data.error === "inactive_entitlement")) {
          state.accessStatus = "locked";
          state.accessMessage = "Full prep access needs to be restored before loading paid sessions.";
        } else {
          state.accessMessage = "The secure prep bank did not load. Try again, or restore access if this keeps happening.";
        }
        renderDashboard(root);
        renderPaywall(root, state.accessMessage);
      });
  }

  function startMixedPractice(root) {
    startPaidPractice(root, "mixed");
  }

  function startStatePractice(root) {
    startPaidPractice(root, "state");
  }

  function startMockExam(root) {
    startPaidPractice(root, "mock");
  }

  function missedQuestions() {
    var missed = [];
    Object.keys(state.progress).forEach(function (key) {
      var record = state.progress[key];
      if (Array.isArray(record?.missed)) missed = missed.concat(record.missed);
    });
    return missed;
  }

  function storeMissed(question) {
    if (!question.sourceSectionId) return;
    var record = state.progress[question.sourceSectionId] || {};
    var missed = Array.isArray(record.missed) ? record.missed : [];
    if (!missed.some(function (item) { return item.prompt === question.prompt; })) {
      missed.push({
        sectionName: question.sectionName,
        prompt: question.prompt,
        correct: question.correct,
        explanation: question.explanation,
        memory: question.memory
      });
    }
    record.missed = missed.slice(-40);
    state.progress[question.sourceSectionId] = record;
    saveProgress();
  }

  function clearMissed(question) {
    if (!question.sourceSectionId) return;
    var record = state.progress[question.sourceSectionId];
    if (!record || !Array.isArray(record.missed)) return;
    record.missed = record.missed.filter(function (item) {
      return item.prompt !== question.prompt;
    });
    state.progress[question.sourceSectionId] = record;
    saveProgress();
  }

  function choiceSet(question, index) {
    var choices = [{ text: question.correct, correct: true }].concat(
      question.wrong.map(function (text) {
        return { text: text, correct: false };
      })
    );
    var shift = index % choices.length;
    return choices.slice(shift).concat(choices.slice(0, shift));
  }

  function sectionScore(sectionId) {
    var record = state.progress[sectionId];
    if (!record) return null;
    return record.score + "/" + record.total;
  }

  function renderDashboard(root) {
    var unlocked = isUnlocked();
    var checking = state.accessStatus === "checking";
    var profile = selectedStateProfile();
    var statePoolSize = statePoolTarget(profile);
    var accessBanner = "";
    if (checking) {
      accessBanner = '<div class="unlock-confirm dashboard-unlock is-checking"><h3>Checking access...</h3><p>' + escapeHtml(state.accessMessage || "Verifying your full-prep unlock.") + "</p></div>";
    } else if (unlocked) {
      accessBanner =
        '<div class="unlock-confirm dashboard-unlock"><h3>Full prep unlocked.</h3><p>All-state practice, mixed practice, timed readiness exams, missed-question review, cloud-synced progress, and the full mnemonic cram sheet are available.' +
        (state.accessEmail ? " Signed in as " + escapeHtml(state.accessEmail) + "." : "") +
        (state.progressSyncStatus ? " " + escapeHtml(state.progressSyncStatus) : "") +
        '</p><div class="access-actions"><button class="button secondary" data-action="show-access-code">Access Code</button><button class="button secondary" data-action="sync-progress">Sync Progress</button></div></div>';
    } else if (state.accessMessage) {
      accessBanner = '<div class="unlock-confirm dashboard-unlock is-warning"><h3>Restore full prep.</h3><p>' + escapeHtml(state.accessMessage) + '</p><button class="button secondary" data-action="paywall">Restore Access</button></div>';
    }
    root.innerHTML = [
      '<div class="education-app">',
      '<div class="education-topbar">',
      '<div class="education-dashboard-copy"><p class="eyebrow">Practice dashboard</p><h2>Pick your state, then train past the pass line.</h2><p>Every national section still has 25 free questions. The $19 full prep unlock adds all-state law drills, 6x exam-size question pools, timed readiness exams, saved progress, missed-question review, and the full mnemonic cram sheet. If you can keep scoring 90%+ here, you are practicing with the kind of margin that makes the real exam feel familiar.</p></div>',
      '<div class="education-actions">',
      '<button class="button" data-action="' + (unlocked ? "mixed-practice" : "paywall") + '"' + (checking ? " disabled" : "") + '>Mixed Practice</button>',
      '<button class="button secondary" data-action="' + (unlocked ? "mock-exam" : "paywall") + '"' + (checking ? " disabled" : "") + ">Mock Exam</button>",
      '</div>',
      '</div>',
      accessBanner,
      '<div class="education-stats">',
      '<span><strong>' + stateProfiles.length + '</strong><small>state exams</small></span>',
      '<span><strong>6x</strong><small>exam-size pools</small></span>',
      '<span><strong>' + PASS_CONFIDENCE_GOAL + '%+</strong><small>readiness target</small></span>',
      '</div>',
      '<article class="education-section-card state-picker-card">',
      '<div class="education-section-copy"><span class="education-weight">All-state mode</span><h3>' + escapeHtml(profile.name) + ' exam prep</h3><p>Pull from ' + formatNumber(statePoolSize) + ' ' + escapeHtml(profile.name) + ' state-law practice questions, built at 6x the ' + profile.examQuestions + '-question exam target. Drill until 90%+ is repeatable, then sit for the actual exam with more margin.</p></div>',
      '<label class="state-picker-label">Choose your state exam<select data-state-select aria-label="Choose state exam">' + stateOptionsHtml(profile.code) + '</select></label>',
      '<div class="education-topic-row"><span>' + profile.examQuestions + ' exam questions</span><span>' + formatNumber(statePoolSize) + ' practice pool</span><span>' + PASS_CONFIDENCE_GOAL + '%+ goal</span></div>',
      '<div class="education-card-footer"><span>State drills and readiness exams unlock with full prep.</span><button class="button secondary" data-action="' + (unlocked ? "state-practice" : "paywall") + '"' + (checking ? " disabled" : "") + '>State Drill</button><button class="button" data-action="' + (unlocked ? "mock-exam" : "paywall") + '"' + (checking ? " disabled" : "") + '>Start Readiness Exam</button></div>',
      '</article>',
      '<div class="education-stats">',
      '<span><strong>' + sections.length + '</strong><small>national sections</small></span>',
      '<span><strong>' + sections.length * FREE_LIMIT + '</strong><small>free questions</small></span>',
      '<span><strong>$19</strong><small>one-time unlock</small></span>',
      '</div>',
      '<div class="education-section-grid">',
      sections
        .map(function (section) {
          var score = sectionScore(section.id);
          return (
            '<article class="education-section-card">' +
            '<div class="education-section-copy"><span class="education-weight">' +
            escapeHtml(section.weight) +
            '</span><h3>' +
            escapeHtml(section.name) +
            '</h3><p>' +
            escapeHtml(section.summary) +
            '</p></div>' +
            '<div class="education-topic-row">' +
            section.topics
              .map(function (topic) {
                return '<span>' + escapeHtml(topic) + "</span>";
              })
              .join("") +
            '</div><div class="education-card-footer"><span>' +
            (score ? "Last score: " + escapeHtml(score) : "25 free questions") +
            '</span><button class="button secondary" data-start="' +
            section.id +
            '">Practice</button></div></article>'
          );
        })
        .join(""),
      '</div>',
      '<aside class="monetag-inline-ad education-ad" data-monetag-inline-ad="education-dashboard" data-monetag-creative="https://importsubclassjosh.github.io/assets/images/monetag-real-estate-resource.jpg" data-monetag-zone="11121121" aria-label="Advertisement"><a href="https://omg10.com/4/11121121" target="_blank" rel="sponsored noopener noreferrer"><span class="monetag-inline-ad__art" aria-hidden="true"><img src="https://importsubclassjosh.github.io/assets/images/monetag-real-estate-resource.jpg" width="900" height="375" alt="" loading="lazy" decoding="async"></span><span class="monetag-inline-ad__copy"><span class="monetag-inline-ad__label">Advertisement</span><strong>Explore a useful real estate resource.</strong><span class="monetag-inline-ad__text">A sponsored pick for readers comparing guides, tools, education, and next steps.</span></span><span class="monetag-inline-ad__cta">See sponsor pick</span></a></aside>',
      '<div class="education-lock-row">',
      '<button class="locked-feature" data-action="' + (unlocked ? "state-practice" : "paywall") + '"><span>' + (unlocked ? "Unlocked" : "Locked") + '</span><strong>All-State Law Drills</strong><small>' + formatNumber(statePoolSize) + ' questions for ' + escapeHtml(profile.name) + ' alone.</small></button>',
      '<button class="locked-feature" data-action="' + (unlocked ? "mixed-practice" : "paywall") + '"><span>' + (unlocked ? "Unlocked" : "Locked") + '</span><strong>Mixed Practice</strong><small>National plus ' + escapeHtml(profile.name) + ' state law together.</small></button>',
      '<button class="locked-feature" data-action="' + (unlocked ? "mock-exam" : "paywall") + '"><span>' + (unlocked ? "Unlocked" : "Locked") + '</span><strong>90% Readiness Exam</strong><small>' + profile.examQuestions + '-question timed simulation with a 90%+ target.</small></button>',
      '<button class="locked-feature" data-action="' + (unlocked ? "missed-review" : "paywall") + '"><span>' + (unlocked ? "Unlocked" : "Locked") + '</span><strong>Missed Questions</strong><small>Review only what you got wrong.</small></button>',
      '<button class="locked-feature" data-action="' + (unlocked ? "cram-sheet" : "paywall") + '"><span>' + (unlocked ? "Unlocked" : "Locked") + '</span><strong>Mnemonic Sheet</strong><small>Printable cram sheet for the night before.</small></button>',
      '</div>',
      '</div>'
    ].join("");
  }

  function renderQuiz(root) {
    var session = state.session;
    var question = session.questions[state.index];
    var choices = choiceSet(question, state.index);
    var selected = state.selectedChoice;
    var answered = selected !== null;
    var correctChoice = choices.find(function (choice) {
      return choice.correct;
    });
    var progressPercent = Math.round(((state.index + (answered ? 1 : 0)) / session.questions.length) * 100);

    root.innerHTML = [
      '<div class="education-app education-quiz">',
      '<button class="text-link education-back" data-action="dashboard">Back to sections</button>',
      '<div class="quiz-header"><div><p class="eyebrow">' +
        escapeHtml(question.sectionName || session.name) +
        '</p><h2>Question ' +
        (state.index + 1) +
        ' of ' +
        session.questions.length +
        (session.timed ? ' <span class="timer-pill">Timed mode</span>' : "") +
        '</h2></div><button class="button secondary" data-action="' + (isUnlocked() ? "save-progress" : "paywall") + '">Save Progress</button></div>',
      '<div class="quiz-progress"><span style="width:' + progressPercent + '%"></span></div>',
      '<article class="question-panel">',
      '<h3>' + escapeHtml(question.prompt) + '</h3>',
      '<div class="answer-grid">',
      choices
        .map(function (choice, idx) {
          var className = "answer-choice";
          if (answered && choice.correct) className += " correct";
          if (answered && selected === idx && !choice.correct) className += " wrong";
          return '<button class="' + className + '" data-choice="' + idx + '"' + (answered ? " disabled" : "") + ">" + escapeHtml(choice.text) + "</button>";
        })
        .join(""),
      '</div>',
      answered
        ? '<div class="answer-feedback ' +
          (choices[selected].correct ? "is-correct" : "is-wrong") +
          '"><p class="eyebrow">' +
          (choices[selected].correct ? "Correct" : "Review this") +
          '</p><h3>' +
          (choices[selected].correct ? "That is the best answer." : "Best answer: " + escapeHtml(correctChoice.text)) +
          '</h3><p><strong>Why the right answer is right:</strong> ' +
          escapeHtml(question.explanation) +
          '</p>' +
          (!choices[selected].correct
            ? '<p><strong>Why your answer is wrong:</strong> "' +
              escapeHtml(choices[selected].text) +
              '" is a distractor. It does not match the rule being tested here.</p>'
            : "") +
          '<p><strong>Memory trick:</strong> ' +
          escapeHtml(question.memory) +
          '</p></div>'
        : "",
      '<div class="quiz-nav">',
      '<button class="button secondary" data-action="dashboard">Exit</button>',
      answered
        ? state.index + 1 === session.questions.length
          ? '<button class="button" data-action="finish">See Score</button>'
          : '<button class="button" data-action="next">Next Question</button>'
        : '<button class="button" disabled>Select an answer</button>',
      '</div>',
      '</article>',
      '</div>'
    ].join("");
  }

  function renderResults(root) {
    var session = state.session;
    var score = state.answers.filter(Boolean).length;
    var percent = Math.round((score / session.questions.length) * 100);
    var hitReadinessGoal = percent >= PASS_CONFIDENCE_GOAL;
    var missed = session.questions
      .map(function (question, index) {
        return { question: question, correct: state.answers[index] };
      })
      .filter(function (item) {
        return !item.correct;
      });
    if (session.sectionId) {
      var previous = state.progress[session.sectionId] || {};
      state.progress[session.sectionId] = Object.assign({}, previous, {
        score: score,
        total: session.questions.length,
        completedAt: new Date().toISOString()
      });
      saveProgress();
    }
    root.innerHTML = [
      '<div class="education-app education-results">',
      '<p class="eyebrow">Practice complete</p>',
      '<h2>' + escapeHtml(session.name) + " Score: " + score + "/" + session.questions.length + " (" + percent + "%)</h2>",
      isUnlocked()
        ? hitReadinessGoal
          ? '<p>That is the target zone: 90%+ here means you are practicing above the real pass line with room for pressure, wording changes, and state-law curveballs. Keep the margin repeatable before test day.</p>'
          : '<p>You finished this paid prep mode. Keep drilling missed questions until 90%+ becomes repeatable; that is the margin this course is built around.</p>'
        : '<p>You finished the free section practice. All-state law drills, mixed practice, timed mock exams, saved progress, missed-question review, and the complete mnemonic cram sheet are included in the $19 full prep unlock.</p>',
      '<div class="result-actions">' + (isUnlocked() ? '<button class="button" data-action="mock-exam">Run 90% Readiness Exam</button><button class="button secondary" data-action="mixed-practice">Run Mixed Practice</button><button class="button secondary" data-action="cram-sheet">Open Mnemonic Sheet</button>' : '<button class="button" data-action="paywall">Unlock Full Exam Prep - $19</button>') + '<button class="button secondary" data-action="dashboard">Choose Another Section</button></div>',
      missed.length
        ? '<section class="missed-preview"><h3>Missed-question preview</h3>' +
          missed
            .slice(0, 3)
            .map(function (item) {
              return '<article><strong>' + escapeHtml(item.question.prompt) + '</strong><p>' + escapeHtml(item.question.explanation) + '</p></article>';
            })
            .join("") +
          (missed.length > 3 ? '<button class="locked-feature inline-lock" data-action="' + (isUnlocked() ? "missed-review" : "paywall") + '"><span>' + (isUnlocked() ? "Unlocked" : "Locked") + "</span><strong>Review all " + missed.length + " missed questions</strong></button>" : "") +
          "</section>"
        : '<section class="missed-preview"><h3>Clean section.</h3><p>That is a strong section result. Mixed practice is the next useful test because the real exam does not keep topics separated.</p></section>',
      '</div>'
    ].join("");
  }

  function renderMissedReview(root) {
    var missed = missedQuestions();
    if (!missed.length) {
      root.innerHTML = [
        '<div class="education-app education-results">',
        '<button class="text-link education-back" data-action="dashboard">Back to sections</button>',
        '<p class="eyebrow">Missed-question review</p>',
        '<h2>No missed questions saved yet.</h2>',
        '<p>Answer section questions or run mixed practice. Questions you miss will collect here for focused review.</p>',
        '<div class="result-actions"><button class="button" data-action="mixed-practice">Run Mixed Practice</button><button class="button secondary" data-action="dashboard">Dashboard</button></div>',
        '</div>'
      ].join("");
      return;
    }
    startSession(root, {
      type: "missed",
      name: "Missed-Question Review",
      questions: missed.map(function (item) {
        return {
          sectionName: item.sectionName,
          sourceSectionId: null,
          prompt: item.prompt,
          correct: item.correct,
          wrong: ["A tempting distractor from the original topic.", "A rule from a different section.", "An answer that sounds close but misses the tested concept."],
          explanation: item.explanation,
          memory: item.memory
        };
      }),
      timed: false
    });
  }

  function renderCramSheet(root) {
    root.innerHTML = [
      '<div class="education-app cram-sheet">',
      '<button class="text-link education-back" data-action="dashboard">Back to sections</button>',
      '<div class="quiz-header"><div><p class="eyebrow">Full mnemonic cram sheet</p><h2>Night-Before Memory Tricks</h2><p>Use this as a quick review pass before mixed practice or a timed mock exam.</p></div><button class="button secondary" onclick="window.print()">Print</button></div>',
      '<div class="cram-grid">',
      sections
        .map(function (section) {
          return (
            '<article class="cram-card"><p class="eyebrow">' +
            escapeHtml(section.name) +
            '</p><h3>' +
            escapeHtml(section.topics.join(" / ")) +
            '</h3><ul>' +
            section.questions
              .slice(0, 5)
              .map(function (question) {
                return '<li><strong>' + escapeHtml(question.correct) + ':</strong> ' + escapeHtml(question.memory) + "</li>";
              })
              .join("") +
            "</ul></article>"
          );
        })
        .join(""),
      '</div>',
      '</div>'
    ].join("");
  }

  function renderToast(root, message) {
    root.insertAdjacentHTML("beforeend", '<div class="education-toast" role="status">' + escapeHtml(message) + "</div>");
    window.setTimeout(function () {
      var toast = root.querySelector(".education-toast");
      if (toast) toast.remove();
    }, 1800);
  }

  function renderAccessSuccess(root, payload) {
    var codeBlock = payload.access_code
      ? '<div class="access-code-box"><span>Your restore code</span><strong data-access-code>' +
        escapeHtml(payload.access_code) +
        '</strong><button class="button secondary" data-action="copy-code">Copy Code</button></div><p class="fine-print">Save this code. It lets you restore your $19 unlock on another browser with the same checkout email.</p>'
      : '<p class="fine-print">Your unlock is active. If you already saved a restore code, keep it for another browser.</p>';
    root.insertAdjacentHTML(
      "beforeend",
      '<div class="education-modal" role="dialog" aria-modal="true" aria-label="Full Prep Unlocked"><div class="education-modal-card"><button class="modal-close" data-action="close-paywall" aria-label="Close">Close</button><p class="eyebrow">Payment verified</p><h2>Full prep is unlocked.</h2><p>All-state law drills, 6x exam-size pools, mixed practice, timed 90% readiness exams, missed-question review, saved progress, and the full mnemonic cram sheet are ready.</p>' +
        codeBlock +
        '<div class="result-actions"><button class="button" data-action="mixed-practice">Start Mixed Practice</button><button class="button secondary" data-action="dashboard">Dashboard</button></div></div></div>'
    );
  }

  function renderPaywall(root, message) {
    trackEvent("view_item", { item_variant: "full_prep_paywall" });
    var pendingEmail = "";
    try {
      pendingEmail = localStorage.getItem(PENDING_EMAIL_KEY) || state.accessEmail || "";
    } catch (error) {
      pendingEmail = state.accessEmail || "";
    }
    root.insertAdjacentHTML(
      "beforeend",
      '<div class="education-modal" role="dialog" aria-modal="true" aria-label="Unlock Full Exam Prep"><div class="education-modal-card"><button class="modal-close" data-action="close-paywall" aria-label="Close">Close</button><p class="eyebrow">Full Exam Prep</p><h2>Unlock the real test simulation.</h2>' +
        (message ? '<div class="form-message">' + escapeHtml(message) + "</div>" : "") +
        '<p>You have free section practice. The $19 unlock adds every state exam mode and a 6x pool so you can keep drilling until 90%+ feels normal before test day.</p><ul class="education-modal-benefits"><li>All 50 states plus DC</li><li>6x exam-size state question pools</li><li>Mixed national and state practice</li><li>Timed 90% readiness exam mode</li><li>Saved progress, restore code, and missed-question review</li><li>Full mnemonic cram sheet for final review</li></ul><form class="unlock-form" data-unlock-form><label>Email for checkout<input name="email" type="email" autocomplete="email" required placeholder="you@example.com" value="' +
        escapeHtml(pendingEmail) +
        '"></label><button class="button" type="submit">Continue to Secure Stripe Checkout - $19</button></form><div class="restore-divider"><span>Already paid?</span></div><form class="unlock-form restore-form" data-restore-form><label>Email used at checkout<input name="email" type="email" autocomplete="email" required placeholder="you@example.com" value="' +
        escapeHtml(pendingEmail) +
        '"></label><label>Restore code<input name="access_code" type="text" autocomplete="off" required placeholder="BRQ-XXXX-XXXX-XXXX"></label><button class="button secondary" type="submit">Restore Full Prep</button></form><p class="fine-print">Checkout is handled by Stripe. After payment, BriqueRealty verifies the Stripe session and issues a restore code for this one-time unlock.</p></div></div>'
    );
  }

  function removePaywall(root) {
    var modal = root.querySelector(".education-modal");
    if (modal) modal.remove();
  }

  function handleClick(root, event) {
    var start = event.target.closest("[data-start]");
    var action = event.target.closest("[data-action]");
    var choice = event.target.closest("[data-choice]");

    if (start) {
      startSection(root, start.getAttribute("data-start"));
      return;
    }

    if (choice && state.selectedChoice === null) {
      var question = state.session.questions[state.index];
      var choices = choiceSet(question, state.index);
      var selectedIndex = Number(choice.getAttribute("data-choice"));
      state.selectedChoice = selectedIndex;
      state.answers[state.index] = Boolean(choices[selectedIndex].correct);
      if (choices[selectedIndex].correct) clearMissed(question);
      else storeMissed(question);
      renderQuiz(root);
      return;
    }

    if (!action) return;
    var name = action.getAttribute("data-action");
    if (name === "dashboard") {
      state.mode = "dashboard";
      state.selectedChoice = null;
      renderDashboard(root);
    }
    if (name === "next") {
      state.index += 1;
      state.selectedChoice = null;
      renderQuiz(root);
    }
    if (name === "finish") {
      state.mode = "results";
      renderResults(root);
    }
    if (name === "mixed-practice") {
      if (isUnlocked()) startMixedPractice(root);
      else renderPaywall(root);
    }
    if (name === "state-practice") {
      if (isUnlocked()) startStatePractice(root);
      else renderPaywall(root);
    }
    if (name === "mock-exam") {
      if (isUnlocked()) startMockExam(root);
      else renderPaywall(root);
    }
    if (name === "missed-review") {
      if (isUnlocked()) renderMissedReview(root);
      else renderPaywall(root);
    }
    if (name === "cram-sheet") {
      if (isUnlocked()) renderCramSheet(root);
      else renderPaywall(root);
    }
    if (name === "save-progress") {
      saveProgress();
      renderToast(root, isUnlocked() ? "Progress saved and syncing." : "Progress saved in this browser.");
    }
    if (name === "paywall") {
      removePaywall(root);
      renderPaywall(root);
    }
    if (name === "show-access-code") {
      removePaywall(root);
      renderAccessSuccess(root, { access_code: state.accessCode });
    }
    if (name === "copy-code") {
      var code = root.querySelector("[data-access-code]");
      if (code && navigator.clipboard) {
        navigator.clipboard.writeText(code.textContent || "");
        renderToast(root, "Access code copied.");
      }
    }
    if (name === "sync-progress") {
      saveProgress();
      renderToast(root, "Progress sync started.");
    }
    if (name === "close-paywall") {
      removePaywall(root);
    }
  }

  function handleChange(root, event) {
    var picker = event.target.closest("[data-state-select]");
    if (!picker) return;
    state.selectedStateCode = picker.value || DEFAULT_STATE_CODE;
    try {
      localStorage.setItem(STATE_CHOICE_KEY, state.selectedStateCode);
    } catch (error) {
      // State choice persistence is optional; the dashboard can still update.
    }
    renderDashboard(root);
  }

  function handleSubmit(root, event) {
    var form = event.target.closest("[data-unlock-form]");
    var restoreForm = event.target.closest("[data-restore-form]");
    if (!form && !restoreForm) return;
    event.preventDefault();

    if (restoreForm) {
      var restoreEmail = restoreForm.elements.email.value.trim();
      var accessCode = restoreForm.elements.access_code.value.trim();
      restoreForm.querySelector("button").disabled = true;
      apiPost("/restore", { email: restoreEmail, access_code: accessCode })
        .then(function (payload) {
          storeAccess(Object.assign({}, payload, { access_code: accessCode }));
          removePaywall(root);
          loadCloudProgress(root);
          renderDashboard(root);
          renderAccessSuccess(root, { access_code: state.accessCode });
        })
        .catch(function () {
          restoreForm.querySelector("button").disabled = false;
          var existing = restoreForm.querySelector(".form-message");
          if (existing) existing.remove();
          restoreForm.insertAdjacentHTML("afterbegin", '<div class="form-message">That email and restore code did not match. Check your Stripe receipt email and saved code.</div>');
        });
      return;
    }

    var email = form.elements.email.value.trim();
    try {
      localStorage.setItem(PENDING_EMAIL_KEY, email);
    } catch (error) {
      return;
    }
    if (CHECKOUT_URL) {
      trackEvent("begin_checkout", { item_variant: "full_prep_checkout" });
      window.location.href = checkoutUrl(email);
      return;
    }
    form.innerHTML = '<div class="unlock-confirm"><h3>Email saved in this browser.</h3><p>Checkout is temporarily unavailable. Try again in a few minutes.</p></div>';
  }

  function initOne(root) {
    if (root.getAttribute("data-education-ready") === "true") return;
    root.setAttribute("data-education-ready", "true");
    loadStoredAccess();
    renderDashboard(root);
    var hasCheckoutReturn = hydratePaidUnlockFromUrl(root);
    if (!hasCheckoutReturn) verifyStoredAccess(root);
    root.addEventListener("click", function (event) {
      handleClick(root, event);
    });
    root.addEventListener("change", function (event) {
      handleChange(root, event);
    });
    root.addEventListener("submit", function (event) {
      handleSubmit(root, event);
    });
  }

  function init() {
    document.querySelectorAll("[data-education-app]").forEach(initOne);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
