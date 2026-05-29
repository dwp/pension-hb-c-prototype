//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//

const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()

// Add your routes here

// --- Global backdate middleware: sets req.session.data.backdate once per session ---
function threeMonthsAgoLabel () {
  const now = new Date()
  // Subtract 3 calendar months (keeps same day when possible)
  const d = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate())

  const day = d.getDate()
  const month = d.toLocaleString('en-GB', { month: 'long' })
  const year = d.getFullYear()
  return `${day} ${month} ${year}`
}

router.use((req, res, next) => {
  req.session.data = req.session.data || {}
  if (!req.session.data.backdate) {
    req.session.data.backdate = threeMonthsAgoLabel()
  }
  next()
})

// care home
router.post('/care-home-funding', function(request, response) {

	var permcarehome = request.session.data['permcarehome']
	if (permcarehome == "no"){
		response.redirect("/home-and-household/your-address/home-postcode.html")
	} else {
		response.redirect("/home-and-household/your-address/care-home-funding")
	}
})

router.post('/home-and-household/your-address/home-postcode', function (req, res) {
  res.redirect('/home-and-household/your-address/home-address')
})

router.post('/home-and-household/your-address/home-address', function (req, res) {
  res.redirect('/home-and-household/your-address/council-tax-responsibility')
})


// council tax reduction
router.post('/home-and-household/your-address/council-tax-responsibility', function(request, response) {

	var counciltaxresponsibility = request.session.data['counciltaxresponsibility']
	if (counciltaxresponsibility === "Both me and my partner" ||
    counciltaxresponsibility === "I pay the full amount myself")
  {
		return response.redirect("/home-and-household/your-address/disabled-reduction")
	} else {
		return response.redirect("/home-and-household/your-address/check-your-answers2")
	}
})

// ABOUT THE PLACE YOU LIVE SECTION

//Shared accommodation
router.post('/home-and-household/about-the-place-you-live/shared-accommodation-route', (req, res) => {

  return res.redirect('/home-and-household/about-the-place-you-live/bedroom-amount')
})

// Rent amount → Move-in date
router.post(
  '/home-and-household/rental-and-housing-costs/precheck-move-in-date',
  (req, res) => {
    res.redirect('/home-and-household/rental-and-housing-costs/precheck-move-in-date');
  }
);

// Move-in date → Check answers
router.post(
  '/home-and-household/rental-and-housing-costs/check-your-answers',
  (req, res) => {
    res.redirect('/home-and-household/rental-and-housing-costs/check-your-answers');
  }
);

// GET render: reset error on first load
router.get('/home-and-household/about-the-place-you-live/bedroom-amount', (req, res) => {
  req.session.data['bedroomAmountError'] = false
  res.render('home-and-household/about-the-place-you-live/bedroom-amount')
})

// bedrooms branching
router.post('/home-and-household/about-the-place-you-live/bedroom-amount', function (req, res) {
  // Read the value captured by the input `name="bedroomAmount"`
  const raw = req.session.data['bedroomAmount']

  // Coerce to a number
  const bedrooms = Number(raw)

  // Basic validation: must be a positive integer
  if (!Number.isFinite(bedrooms) || bedrooms < 1) {
    // error page
    req.session.data['bedroomAmountError'] = true
    return res.redirect('/home-and-household/about-the-place-you-live/bedroom-amount')
  }

  // Branching
  if (bedrooms === 1) {
    return res.redirect('/home-and-household/about-the-place-you-live/one-room-only')
  }

  // bedrooms > 1
  return res.redirect('/home-and-household/about-the-place-you-live/overnight-carer')
})

// Do you live in one main room only? - direct route
router.post('/home-and-household/about-the-place-you-live/one-room-only', (req, res) => {

  return res.redirect('/home-and-household/about-the-place-you-live/overnight-carer')
})

// Do you require a non-resident carer to stay overnight in your home? - direct route
router.post('/home-and-household/about-the-place-you-live/overnight-carer', (req, res) => {

  return res.redirect('/home-and-household/about-the-place-you-live/foster-carer')
})

// Are you an approved foster carer? - direct route
router.post('/home-and-household/about-the-place-you-live/foster-carer', (req, res) => {

  return res.redirect('/home-and-household/about-the-place-you-live/check-your-answers')
})


router.post('/home-and-household/your-landlord/live-in-landlord-decision', function (req, res) {

  const liveInLandlord = req.session.data['liveInLandlord']

  if (liveInLandlord === "yes") {
    res.redirect('/home-and-household/your-landlord/landlord-know-previously')
  } else {
    res.redirect('/home-and-household/your-landlord/landlord-postcode')
  }
})


// If know the landlord = yes then ask how else continue to precheck tenancy start date
router.post('/home-and-household/your-landlord/landlord-know-previously', function(request, response) {

	var landlordKnow = request.session.data['landlordKnow']
	if (landlordKnow == "yes"){
		response.redirect("/home-and-household/your-landlord/landlord-know-how")
	} else {
		response.redirect("/home-and-household/your-landlord/precheck-tenancy-start-date")
	}
})

// Did the customer's tenancy start more than 3 months ago - tenancy start date precheck?
router.post('/home-and-household/your-landlord/precheck-tenancy-start-date', function(request, response) {

	var preCheckTenancyStartDate = request.session.data['preCheckTenancyStartDate']
	if (preCheckTenancyStartDate == "no"){
		response.redirect("/home-and-household/your-landlord/tenancy-start-already-provided")
	} else {
		response.redirect("/home-and-household/your-landlord/behind-rent")
	}
})

// Did the customer's tenancy start the same day they moved in? - tenancy-start-already-provided
router.post('/home-and-household/your-landlord/tenancy-start-already-provided', function(request, response) {

	var tenancyStartAlreadyProvided = request.session.data['tenancyStartAlreadyProvided']
	if (tenancyStartAlreadyProvided == "no"){
		response.redirect("/home-and-household/your-landlord/tenancy-start-date")
	} else {
		response.redirect("/home-and-household/your-landlord/behind-rent")
	}
})

// Do you know tenancy end date?
router.post('/home-and-household/your-landlord/behind-rent', function(request, response) {

	var doYouKnowTenancyEndDate = request.session.data['doYouKnowTenancyEndDate']
	if (doYouKnowTenancyEndDate == "yes"){
		response.redirect("/home-and-household/your-landlord/tenancy-end-date")
	} else {
		response.redirect("/home-and-household/your-landlord/behind-rent")
	}
})

// tenancy end date -> on submit, go to behind-rent
router.post('/home-and-household/your-landlord/tenancy-end-date', function (request, response) {

  return response.redirect('/home-and-household/your-landlord/behind-rent')
})
715

// behind on rent -> how much behind on rent, or, check your answers
router.post('/home-and-household/your-landlord/previous-postcode', function(request, response) {

	var behindRent = request.session.data['behindRent']
	if (behindRent == "yes"){
		response.redirect("/home-and-household/your-landlord/behind-rent-amount")
	} else {
		response.redirect("/home-and-household/your-landlord/check-your-answers")
	}
})

// how many weeks behind rent -> on submit, go to check your answers
router.post('/home-and-household/your-landlord/behind-rent-amount', function (request, response) {

  return response.redirect('/home-and-household/your-landlord/check-your-answers')
})

//YOUR PREVIOUS ADDRESS SECTION

// Have you moved address in the last 12 months?
router.post('/home-and-household/your-previous-address/changed-address', function (req, res) {
  const changedAddress = req.session.data['changedAddress']

  if (changedAddress === 'Yes') {
    // changed address - go to previous address page
    return res.redirect('/home-and-household/your-previous-address/previous-postcode')
  } else {
    // not changed address - go to check your answers
    return res.redirect('/home-and-household/your-previous-address/check-your-answers2')
  }
})


// Select the address you lived at previously - direct route
router.post('/home-and-household/your-previous-address/the-previous-address', function (request, response) {

  return response.redirect('/home-and-household/your-previous-address/move-out-date')
})

// When did you move out of your previous address? - direct route
router.post('/home-and-household/your-previous-address/move-out-date', function (request, response) {

  return response.redirect('/home-and-household/your-previous-address/check-your-answers')
})

// OTHER PROPERTY OR LAND SECTION


// Do you own any property or land other than the home you live in?
router.post('/home-and-household/other-property-or-land/other-property', function (req, res) {
  return res.redirect('/home-and-household/other-property-or-land/check-your-answers')
})



// PEOPLE WHO LIVE WITH YOU SECTION

// children responsible page to non dep page - direct route
router.post('/home-and-household/people-who-live-with-you/children-responsible', (req, res) => {

  return res.redirect('/home-and-household/people-who-live-with-you/non-dependant')
})

// non-dependent branching
router.post('/home-and-household/people-who-live-with-you/non-dependant', function (req, res) {
  const nonDep = req.session.data['nonDep']

  if (nonDep === 'Yes') {
    return res.redirect('/home-and-household/people-who-live-with-you/name-nondep1')
  } else {

    return res.redirect('/task-list')
  }
})

// nondep1 name - direct route
router.post('/home-and-household/people-who-live-with-you/name-nondep1', (req, res) => {

  return res.redirect('/home-and-household/people-who-live-with-you/related-nondep1')
})

// nondep1 living situation branching
router.post('/home-and-household/people-who-live-with-you/living-situation-nondep1', function (req, res) {
  const livingSituation = req.session.data['livingSituation']

  if (livingSituation === 'They are from a charity or voluntary organisation') {
    return res.redirect('/home-and-household/people-who-live-with-you/charity-nondep1')
  } else if (livingSituation === 'They live with me but are not responsible for the rent') {
    return res.redirect('/home-and-household/people-who-live-with-you/dob-nondep1')
    } else {

    return res.redirect('/home-and-household/people-who-live-with-you/check-details2-nondep1')
  }
})

// charity - direct route
router.post('/home-and-household/people-who-live-with-you/charity-nondep1', (req, res) => {

  return res.redirect('/home-and-household/people-who-live-with-you/check-details3-nondep1')
})

// nondep1 related branching
router.post('/home-and-household/people-who-live-with-you/related-nondep1', function (req, res) {
  const relatednonDep = req.session.data['relatednonDep']

  if (relatednonDep === 'Yes') {
    return res.redirect('/home-and-household/people-who-live-with-you/how-related-nondep1')
  } else {

    return res.redirect('/home-and-household/people-who-live-with-you/living-situation-nondep1')
  }
})

// nondep1 how related - direct route
router.post('/home-and-household/people-who-live-with-you/how-related-nondep1', (req, res) => {

  return res.redirect('/home-and-household/people-who-live-with-you/living-situation-nondep1')
})

// nondep1 dob - direct route
router.post('/home-and-household/people-who-live-with-you/dob-nondep1', (req, res) => {

  return res.redirect('/home-and-household/people-who-live-with-you/blind-nondep1')
  })

// nondep1 blind - direct route
router.post('/home-and-household/people-who-live-with-you/blind-nondep1', (req, res) => {

  return res.redirect('/home-and-household/people-who-live-with-you/precheck-date-living-together-nondep1')
})

// nondep1 have they been living in the property more than 3 months
router.post('/home-and-household/people-who-live-with-you/precheck-date-living-together-nondep1', function (req, res) {
  const preCheckNonDepMoveInDate = req.session.data['preCheckNonDepMoveInDate']

  if (preCheckNonDepMoveInDate === 'no') {
    return res.redirect('/home-and-household/people-who-live-with-you/date-living-together-nondep1')
  } else {

    return res.redirect('/home-and-household/people-who-live-with-you/education-nondep1')
  }
})

// nondep1 date living together - direct route
router.post('/home-and-household/people-who-live-with-you/date-living-together-nondep1', (req, res) => {

  return res.redirect('/home-and-household/people-who-live-with-you/education-nondep1')
})

// nondep1 education - direct route
router.post('/home-and-household/people-who-live-with-you/education-nondep1', (req, res) => {

  return res.redirect('/home-and-household/people-who-live-with-you/employment-nondep1')
})

// nondep1 related branching
router.post('/home-and-household/people-who-live-with-you/related-nondep1', function (req, res) {
  const relatednonDep = req.session.data['relatednonDep']

  if (relatednonDep === 'Yes') {
    return res.redirect('/home-and-household/people-who-live-with-you/how-related-nondep1')
  } else {
    return res.redirect('/home-and-household/people-who-live-with-you/dob-nondep1')
  }
})

// nondep1 employment branching
router.post('/home-and-household/people-who-live-with-you/employment-nondep1', (req, res) => {
  const employment = req.session.data['employmentNonDep']        // "full-time-employment" | "part-time-employment" | "no"
  const selfEmployment = req.session.data['selfEmploymentNonDep'] // "yes" | "no"

  const noEmployment = employment === 'No'
  const noSelfEmployment = selfEmployment === 'No'

  if (noEmployment && noSelfEmployment) {
    return res.redirect('/home-and-household/people-who-live-with-you/currently-away-nondep1')
  }

  return res.redirect('/home-and-household/people-who-live-with-you/hours-employment-nondep1')
})


// nondep1 16 hours a week or more - direct route
router.post('/home-and-household/people-who-live-with-you/hours-employment-nondep1', (req, res) => {
  return res.redirect('/home-and-household/people-who-live-with-you/gross-income-nondep1')
})

// nondep1 gross income - direct route
router.post('/home-and-household/people-who-live-with-you/gross-income-nondep1', (req, res) => {
  return res.redirect('/home-and-household/people-who-live-with-you/currently-away-nondep1')
})


// GET to render the care page
router.get('/home-and-household/people-who-live-with-you/care-nondep1', (req, res) => {
  res.render('home-and-household/people-who-live-with-you/care-nondep1')
})


// care submit -> benefits
router.post('/home-and-household/people-who-live-with-you/care-nondep1', (req, res) => {
  return res.redirect('/home-and-household/people-who-live-with-you/benefits-nondep1')
})


// nondep1 Do they get any of the following benefits - direct route
router.post('/home-and-household/people-who-live-with-you/benefits-nondep1', (req, res) => {
  return res.redirect('/home-and-household/people-who-live-with-you/rent-nondep1')
})

// Do they pay towards the rent?
router.post('/home-and-household/people-who-live-with-you/rent-nondep1', function (req, res) {
  const rentNonDep = req.session.data['rentNonDep']

  if (rentNonDep === 'Yes') {
    return res.redirect('/home-and-household/people-who-live-with-you/precheck-date-rent-start-nondep1')
  } else {
    return res.redirect('/home-and-household/people-who-live-with-you/currently-away-nondep1')
  }
})

// If not before 3 months ago then when did they start paying?
router.post('/home-and-household/people-who-live-with-you/precheck-date-rent-start-nondep1', function (req, res) {
  const preCheckNonDepRentStart = req.session.data['preCheckNonDepRentStart']

  if (preCheckNonDepRentStart === 'no') {
    return res.redirect('/home-and-household/people-who-live-with-you/date-rent-start-nondep1')
  } else {
    return res.redirect('/home-and-household/people-who-live-with-you/currently-away-nondep1')
  }
})

// start paying rent -> currently away
router.post('/home-and-household/people-who-live-with-you/date-rent-start-nondep1', (req, res) => {
  return res.redirect('/home-and-household/people-who-live-with-you/currently-away-nondep1')
})

// staying away -> child or young person
router.post('/home-and-household/people-who-live-with-you/currently-away-nondep1', (req, res) => {

  return res.redirect('/home-and-household/people-who-live-with-you/child-responsible-nondep1')
})

// Do they have a child or young person living at the property?
router.post('/home-and-household/people-who-live-with-you/child-responsible-nondep1', function (req, res) {
  const childNonDep1 = req.session.data['childNonDep1']

  if (childNonDep1 === 'Yes') {
    return res.redirect('/home-and-household/people-who-live-with-you/child-name-nondep1')
  } else {
    return res.redirect('/home-and-household/people-who-live-with-you/check-details-nondep1')
  }
})

// child name -> child dob
router.post('/home-and-household/people-who-live-with-you/child-name-nondep1', (req, res) => {

  return res.redirect('/home-and-household/people-who-live-with-you/child-dob-nondep1')
})

// child dob -> child gender
router.post('/home-and-household/people-who-live-with-you/child-dob-nondep1', (req, res) => {

  return res.redirect('/home-and-household/people-who-live-with-you/child-gender-nondep1')
})

//child gender -> add another child
router.post('/home-and-household/people-who-live-with-you/child-gender-nondep1', (req, res) => {

  // Get existing children or create empty array
  let children = req.session.data.children || []

  // Add new child
  children.push({
    name: req.session.data['nondep1ChildName'] || '',
    dob: req.session.data['nondep1ChildDob'],
    gender: req.session.data['nondep1ChildGender']
  })

  // Save back to session
  req.session.data.children = children

  // OPTIONAL: clear the temp fields so next child is fresh
  delete req.session.data['nondep1ChildName']
  delete req.session.data['nondep1ChildDob']
  delete req.session.data['nondep1ChildGender']

  res.redirect('/home-and-household/people-who-live-with-you/add-another-child')
})


//remove child from list
router.get('/home-and-household/people-who-live-with-you/remove-child', function (req, res) {

  const index = Number(req.query.index)
  let children = req.session.data.children || []

  children.splice(index, 1)

  req.session.data.children = children

  res.redirect('/home-and-household/people-who-live-with-you/add-another-child')
})


// Do they have another child or young person living at the property?
router.post('/home-and-household/people-who-live-with-you/another-child-nondep1', function (req, res) {
  const anotherChild = req.session.data['anotherChild']

  if (anotherChild === 'Yes') {
    return res.redirect('/home-and-household/people-who-live-with-you/child2-name-nondep1')
  } else {
    return res.redirect('/home-and-household/people-who-live-with-you/check-details-nondep1')
  }
})

// check details -> add another adult
router.post('/home-and-household/people-who-live-with-you/check-details-nondep1', (req, res) => {

if (!req.session.data.nondependants) {
    req.session.data.nondependants = []
  }

  req.session.data.nondependants.push({
    name: req.session.data.nondep1Name
  })

  return res.redirect('/home-and-household/people-who-live-with-you/add-another-person')
})

// Add another adult in your household
router.post('/home-and-household/people-who-live-with-you/add-another-person', (req, res) => {
  const addAnother = req.session.data['addAnother']

  
if (addAnother === 'yes') {

  // ✅ Clear previous name so input is empty
  delete req.session.data.nondep1Name

  return res.redirect('/home-and-household/people-who-live-with-you/name-nondep2')
}


  return res.redirect('/home-and-household/people-who-live-with-you/couple-nondep1')
})

// If nondep1 is in a couple -> couple name else -> task list
router.post('/home-and-household/people-who-live-with-you/couple-nondep1', function (req, res) {
  const coupleNondep1 = req.session.data['coupleNondep1']

  if (coupleNondep1 === 'Yes') {
    return res.redirect('/home-and-household/people-who-live-with-you/couple-name-nondep1')
  } else {
    return res.redirect('/task-list') 
  }
})

// couple-name-nondep1 -> task list
router.post('/home-and-household/people-who-live-with-you/couple-name-nondep1', (req, res) => {

  const selected = req.session.data['PartnerNameNondep1']
  const people = req.session.data.nondependants || []

  const selectedArray = Array.isArray(selected) ? selected : [selected]


// ✅ Prevent mixing "no more couples" with names
if (
  selectedArray.includes('no-more-couples') &&
  selectedArray.length > 1
) {
  return res.redirect('/home-and-household/people-who-live-with-you/couple-name-nondep1')
}

// ✅ Handle "no more couples"
if (selectedArray.includes('no-more-couples')) {
  return res.redirect('/home-and-household/people-who-live-with-you/added-couple')
}
``


  // ✅ Must select exactly 2 people
  if (selectedArray.length !== 2) {
    return res.redirect('/home-and-household/people-who-live-with-you/couple-name-nondep1')
  }

  // ✅ Create couples array if needed
  if (!req.session.data.couples) {
    req.session.data.couples = []
  }

  // ✅ Store couple correctly (IMPORTANT FIX)
  req.session.data.couples.push({
    person1: selectedArray[0],
    person2: selectedArray[1]
  })

  // ✅ Remove selected people
  const remainingPeople = people.filter(person =>
    !selectedArray.includes(person.name)
  )

  req.session.data.nondependants = remainingPeople

  // ✅ CLEAR previous selection (prevents bugs)
  delete req.session.data['PartnerNameNondep1']

  // ✅ IF MORE COUPLES POSSIBLE → LOOP BACK
  if (remainingPeople.length >= 2) {
    return res.redirect('/home-and-household/people-who-live-with-you/couple-name-nondep1')
  }

  // ✅ OTHERWISE GO TO SUMMARY PAGE
  return res.redirect('/home-and-household/people-who-live-with-you/added-couple')
})

//
// --------- Agent View routing ---------
//

// --- Agent view prototype ---

// From "View case details" on new-applications → existing-claim-status
// router.get('/agent-view/new-applications/view', function (req, res) {
//  res.redirect('/agent-view/existing-claim-status');
// });

// Existing Claim Status → Agent Task List (Unverified)
router.post('/agent-view/existing-claim-status-continue', (req, res) => {
  return res.redirect('/agent-view/agent-task-list-unverified')
})

// home-address → home-have-you-verified
router.post('/agent-view/home-your-address', (req, res) => {
  return res.redirect('/agent-view/home-have-you-verified')
})

// home-have-you-verified → home-how-verified if yes
router.post('/agent-view/home-have-you-verified', function (req, res) {
  const homehouseholdverification = req.session.data['homehouseholdverification']

  if (homehouseholdverification === 'more-information') {
    return res.redirect('/agent-view/home-more-info')
  } else {
    return res.redirect('/agent-view/home-how-verified')
  }
})

// home-how-verified → agent-task-list-verified
router.post('/agent-view/home-how-verified', (req, res) => {
  return res.redirect('/agent-view/home-verified')
})

// agent-task-list-verified → information-needed
router.post('/agent-view/agent-task-list-verified', (req, res) => {
  return res.redirect('/agent-view/information-needed')
})

// information-needed → awarded-pc if yes
router.post('/agent-view/information-needed', function (req, res) {
  const infoNeeded = req.session.data['info-needed']

  if (infoNeeded === 'yes') {
    return res.redirect('/agent-view/awarded-pc')
  } else {
    return res.redirect('/agent-view/awaiting-sections')
  }
})



/////
// 
// ---------  one login routing ---------


router.post('/ol-views/ol-start-or-resume', function (req, res) {
  const choice = req.session.data['new-or-saved']

  // For now, both options go to One Login
  res.redirect('/ol-views/sign-in-or-create')
})

router.post('/ol-views/email-address', function (req, res) {
  const email = req.session.data['sss']

  // For now, both options go to One Login
  res.redirect('/ol-views/check-your-email')
})


router.post('/ol-views/choose-security-codes', function (req, res) {
  const method = req.session.data['chooseHowToGetSecurityCodes'];

  if (method === 'textMessage') {
    res.redirect('/ol-views/enter-your-mobile-phone-number');
  } else if (method === 'authenticatorApp') {
    res.redirect('/ol-views/auth-app');
  } else {
    // Fallback if nothing selected
    res.redirect('/ol-views/choose-security-codes');
  }
});


router.post('/ol-views/auth-app', function (req, res) {
  res.redirect('/ol-views/account-created');
});


router.post('/ol-views/protect-identity', function (req, res) {
  res.redirect('/ol-views/benefits')
})


router.post('/ol-views/benefits', function (req, res) {
  let benefits = req.session.data['benefitsGetting'];

  // If nothing selected, make it an empty array
  if (!benefits) {
    benefits = [];
  }

  // If only one checkbox selected, convert string to array
  if (typeof benefits === 'string') {
    benefits = [benefits];
  }

  if (benefits.includes('State Pension')) {
    res.redirect('/ol-views/SP-bank');
  } else {
    res.redirect('/ol-views/benefits-applied');
  }
});

router.post('/ol-views/SP-bank', function (req, res) {
  res.redirect('/ol-views/benefits-applied')
})


const months = [
  'January', 'February', 'March', 'April',
  'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December'
];

router.post('/ol-views/benefits-applied', function(req, res) { 
  const date = new Date();
   let pastYear = date.getFullYear()-3;
   req.session.data['benefitDate'] = date.getDate() + ' ' + months[date.getMonth()] + ' ' + pastYear;
   res.redirect('/ol-views/bank-details')
});


// SAVE AND RETURN JOURNEY


router.post('/save-and-return/landlord-name', function (request, response) {
  // You already get the value via session automatically
  response.redirect('/save-and-return/live-in-landlord')
})

// After landlords name - if they don't live with landlord then what's the landlord's address
router.post('/save-and-return/live-in-landlord', function(request, response) {

	var liveInLandlord = request.session.data['liveInLandlord']
	if (liveInLandlord == "yes"){
		response.redirect("/save-and-return/landlord-know-previously")
	} else {
		response.redirect("/save-and-return/landlord-postcode")
	}
})

// If know the landlord = yes then ask how else continue to precheck tenancy start date
router.post('/save-and-return/landlord-know-previously', function(request, response) {

	var landlordKnow = request.session.data['landlordKnow']
	if (landlordKnow == "yes"){
		response.redirect("/save-and-return/landlord-know-how")
	} else {
		response.redirect("/save-and-return/precheck-tenancy-start-date")
	}
})

// Did the customer's tenancy start more than 3 months ago - tenancy start date precheck?
router.post('/save-and-return/precheck-tenancy-start-date', function(request, response) {

	var preCheckTenancyStartDate = request.session.data['preCheckTenancyStartDate']
	if (preCheckTenancyStartDate == "no"){
		response.redirect("/save-and-return/tenancy-start-already-provided")
	} else {
		response.redirect("/save-and-return/behind-rent")
	}
})

// Did the customer's tenancy start the same day they moved in? - tenancy-start-already-provided
router.post('/save-and-return/tenancy-start-already-provided', function(request, response) {

	var tenancyStartAlreadyProvided = request.session.data['tenancyStartAlreadyProvided']
	if (tenancyStartAlreadyProvided == "no"){
		response.redirect("/save-and-return/tenancy-start-date")
	} else {
		response.redirect("/save-and-return/behind-rent")
	}
})

// Do you know tenancy end date?
router.post('/save-and-return/behind-rent', function(request, response) {

	var doYouKnowTenancyEndDate = request.session.data['doYouKnowTenancyEndDate']
	if (doYouKnowTenancyEndDate == "yes"){
		response.redirect("/save-and-return/tenancy-end-date")
	} else {
		response.redirect("/save-and-return/behind-rent")
	}
})

// tenancy end date -> on submit, go to behind-rent
router.post('/save-and-return/tenancy-end-date', function (request, response) {

  return response.redirect('/save-and-return/behind-rent')
})
715

// behind on rent -> how much behind on rent, or, check your answers
router.post('/save-and-return/previous-postcode', function(request, response) {

	var behindRent = request.session.data['behindRent']
	if (behindRent == "yes"){
		response.redirect("/save-and-return/behind-rent-amount")
	} else {
		response.redirect("/save-and-return/check-your-answers")
	}
})

// how many weeks behind rent -> on submit, go to check your answers
router.post('/save-and-return/behind-rent-amount', function (request, response) {

  return response.redirect('/save-and-return/check-your-answers')
})


// sign out yes or no
router.post('/save-and-return/sign-out-decision', function (req, res) {
  const answer = req.session.data['signOut'];

  if (answer === 'yes') {
    res.redirect('/save-and-return/sign-out-successful');   // your confirmation page
  } else {
    res.redirect('back');          // sends user to previous page
  }
});

router.post('/save-and-return/ol-sign-in', function (req, res) {
  const email = req.session.data['sss']

  // For now, both options go to One Login
  res.redirect('/save-and-return/ol-enter-password')
})

router.post('/save-and-return/ol-enter-password', function (req, res) {
    res.redirect('/save-and-return/ol-check-your-phone');
});