//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//

const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()

// Add your routes here

// care home
router.post('/care-home-funding', function(request, response) {

	var permcarehome = request.session.data['permcarehome']
	if (permcarehome == "no"){
		response.redirect("/home-and-household/your-address/home-postcode.html")
	} else {
		response.redirect("/home-and-household/your-address/care-home-funding")
	}
})

// council tax reduction
router.post('/disabled-reduction', function(request, response) {

	var counciltaxresponsibility = request.session.data['counciltaxresponsibility']
	if (counciltaxresponsibility == "yes"){
		response.redirect("/home-and-household/your-address/disabled-reduction")
	} else {
		response.redirect("/task-list")
	}
})

// ABOUT THE PLACE YOU LIVE SECTION

//Shared accommodation
router.post('/home-and-household/about-the-place-you-live/shared-accommodation-route', (req, res) => {

  return res.redirect('/home-and-household/about-the-place-you-live/bedroom-amount')
})


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

  return res.redirect('/home-and-household/about-the-place-you-live/live-in-landlord')
})

// Do you know tenancy end date?
router.post('/home-and-household/about-the-place-you-live/behind-rent', function(request, response) {

	var doYouKnowTenancyEndDate = request.session.data['doYouKnowTenancyEndDate']
	if (doYouKnowTenancyEndDate == "yes"){
		response.redirect("/home-and-household/about-the-place-you-live/tenancy-end-date")
	} else {
		response.redirect("/home-and-household/about-the-place-you-live/behind-rent")
	}
})

// tenancy end date -> on submit, go to behind-rent
router.post('/home-and-household/about-the-place-you-live/tenancy-end-date', function (request, response) {

  return response.redirect('/home-and-household/about-the-place-you-live/behind-rent')
})

// behind on rent
router.post('/home-and-household/about-the-place-you-live/previous-postcode', function(request, response) {

	var behindRent = request.session.data['behindRent']
	if (behindRent == "yes"){
		response.redirect("/home-and-household/about-the-place-you-live/behind-rent-amount")
	} else {
		response.redirect("/home-and-household/about-the-place-you-live/previous-postcode")
	}
})

// how many weeks behind rent -> on submit, go to previous-postcode
router.post('/home-and-household/about-the-place-you-live/behind-rent-amount', function (request, response) {

  return response.redirect('/home-and-household/about-the-place-you-live/previous-postcode')
})

// Select the address you lived at previously - direct route
router.post('/home-and-household/about-the-place-you-live/the-previous-address', function (request, response) {

  return response.redirect('/home-and-household/about-the-place-you-live/move-out-date')
})

// When did you move out of your previous address? - direct route
router.post('/home-and-household/about-the-place-you-live/move-out-date', function (request, response) {

  return response.redirect('/task-list')
})

// OTHER PROPERTY OR LAND SECTION

// Do you own any property or land other than the home you live in?
router.post('/home-and-household/other-property-or-land/other-property', function (req, res) {
  const otherproperty = req.session.data['otherproperty']

  if (otherproperty === 'yes') {
    // Go to the address capture page for another property
    return res.redirect('/home-and-household/other-property-or-land/address-other-property')
  } else {
    // No more properties – return to the task list
    return res.redirect('/task-list')
  }
})

// other property or land address label
router.post('/home-and-household/about-the-place-you-live/property-purpose', function (req, res) {
  const line1 = (req.session.data['otherPropertyAddressLine1'] || '').trim()
  const line2 = (req.session.data['otherPropertyAddressLine2'] || '').trim()

  const label = [line1, line2].filter(Boolean).join(', ')
  req.session.data['address-other-property'] = label || 'this property'

  return res.redirect('/home-and-household/other-property-or-land/purpose-other-property')
})

// more-other-property → branch to next step
router.post('/home-and-household/other-property-or-land/more-other-property', function (req, res) {
  const moreOtherProperty = req.session.data['moreOtherProperty']

  if (moreOtherProperty === 'yes') {
    // Go to the address capture page for another property
    return res.redirect('/home-and-household/other-property-or-land/address-other-property')
  } else {
    // No more properties – return to the task list
    return res.redirect('/task-list')
  }
})

// purpose-other-property → on submit, go to the "more other property" page
router.post('/home-and-household/other-property-or-land/purpose-other-property', function (req, res) {

  return res.redirect('/home-and-household/other-property-or-land/more-other-property')
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

  return res.redirect('/home-and-household/people-who-live-with-you/living-situation-nondep1')
})

// nondep1 living situation branching
router.post('/home-and-household/people-who-live-with-you/living-situation-nondep1', function (req, res) {
  const livingSituation = req.session.data['livingSituation']

  if (livingSituation === 'They are from a charity or voluntary organisation') {
    return res.redirect('/home-and-household/people-who-live-with-you/charity-nondep1')
  } else {

    return res.redirect('/home-and-household/people-who-live-with-you/related-nondep1')
  }
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

// nondep1 how related - direct route
router.post('/home-and-household/people-who-live-with-you/how-related-nondep1', (req, res) => {

  return res.redirect('/home-and-household/people-who-live-with-you/dob-nondep1')
})

// nondep1 dob - direct route
router.post('/home-and-household/people-who-live-with-you/dob-nondep1', (req, res) => {

  return res.redirect('/home-and-household/people-who-live-with-you/blind-nondep1')
  })

// nondep1 blind - direct route
router.post('/home-and-household/people-who-live-with-you/blind-nondep1', (req, res) => {

  return res.redirect('/home-and-household/people-who-live-with-you/date-living-together-nondep1')
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
    return res.redirect('/home-and-household/people-who-live-with-you/care-nondep1')
  }

  return res.redirect('/home-and-household/people-who-live-with-you/hours-employment-nondep1')
})


// nondep1 16 hours a week or more - direct route
router.post('/home-and-household/people-who-live-with-you/hours-employment-nondep1', (req, res) => {
  return res.redirect('/home-and-household/people-who-live-with-you/care-nondep1')
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
    return res.redirect('/home-and-household/people-who-live-with-you/couple-nondep1')
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

// child gender -> child disability
router.post('/home-and-household/people-who-live-with-you/child-gender-nondep1', (req, res) => {

  return res.redirect('/home-and-household/people-who-live-with-you/child-disability-nondep1')
})

// child disability -> another child?
router.post('/home-and-household/people-who-live-with-you/child-disability-nondep1', (req, res) => {

  return res.redirect('/home-and-household/people-who-live-with-you/another-child-nondep1')
})

// Do they have another child or young person living at the property?
router.post('/home-and-household/people-who-live-with-you/another-child-nondep1', function (req, res) {
  const anotherChild = req.session.data['anotherChild']

  if (anotherChild === 'Yes') {
    return res.redirect('/home-and-household/people-who-live-with-you/child-name-nondep1')
  } else {
    return res.redirect('/home-and-household/people-who-live-with-you/couple-nondep1')
  }
})

// Is this adult in a relationship with another adult living in your household?
router.post('/home-and-household/people-who-live-with-you/couple-nondep1', function (req, res) {
  const coupleNondep1 = req.session.data['coupleNondep1']

  if (coupleNondep1 === 'Yes') {
    return res.redirect('/home-and-household/people-who-live-with-you/couple-name-nondep1')
  } else {
    return res.redirect('/home-and-household/people-who-live-with-you/check-details-nondep1')
  }
})

// couple name -> check nondep1 answers
router.post('/home-and-household/people-who-live-with-you/couple-name-nondep1', (req, res) => {

  return res.redirect('/home-and-household/people-who-live-with-you/check-details-nondep1')
})

// check details -> add another adult
router.post('/home-and-household/people-who-live-with-you/check-details-nondep1', (req, res) => {

  return res.redirect('/home-and-household/people-who-live-with-you/add-another-person')
})

// Add another adult in your household
router.post('/home-and-household/people-who-live-with-you/add-another-person', function (req, res) {
  const addAnother = req.session.data['addAnother']

  if (addAnother === 'Yes') {
    return res.redirect('/home-and-household/people-who-live-with-you/add-another-person')
  } else {
    return res.redirect('/task-list') 
  }
})