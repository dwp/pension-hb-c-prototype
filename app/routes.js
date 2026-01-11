//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//

const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()

// Add your routes here

// Route: Pension Credit - How to claim (dummy guidance page)
router.get('/pension-credit/how-to-claim', (req, res) => {
  res.render('pension-credit/how-to-claim')
})

// Route: Apply for Housing Benefit - Question page (GET)
router.get('/apply-housing-benefit', (req, res) => {
  res.render('apply-housing-benefit', {
    errors: false,
    data: req.session.data
  })
})

// Route: Apply for Housing Benefit - Question page (POST with validation)
router.post('/apply-housing-benefit', (req, res) => {
  const applyHousingBenefit = req.session.data.applyHousingBenefit

  // Validation: Check if a selection was made
  if (!applyHousingBenefit) {
    // Re-render with errors
    return res.render('apply-housing-benefit', {
      errors: true,
      data: req.session.data
    })
  }

  // If validation passes, redirect to task list
  res.redirect('/task-list')
})

// Route: Task list page
router.get('/task-list', (req, res) => {
  res.render('task-list', {
    data: req.session.data
  })
})

// Placeholder routes for "About you" tasks
router.get('/task/about-you/personal-details', (req, res) => {
  res.redirect('/task-list')
})

router.get('/task/about-you/immigration-status', (req, res) => {
  res.redirect('/task-list')
})

router.get('/task/about-you/time-outside-uk', (req, res) => {
  res.redirect('/task-list')
})

router.get('/task/about-you/time-in-hospital', (req, res) => {
  res.redirect('/task-list')
})

// Address flow routes
// Route: Postcode lookup (GET)
router.get('/address/postcode', (req, res) => {
  res.render('address/postcode', {
    errors: false,
    data: req.session.data
  })
})

// Route: Postcode lookup (POST with validation)
router.post('/address/postcode', (req, res) => {
  const postcode = req.session.data.postcode

  // Validation: Check if postcode was entered
  if (!postcode || postcode.trim() === '') {
    return res.render('address/postcode', {
      errors: [
        {
          text: 'Enter a postcode',
          href: '#postcode'
        }
      ],
      data: req.session.data
    })
  }

  // Basic UK postcode format validation (simple check)
  const postcodeRegex = /^[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}$/i
  if (!postcodeRegex.test(postcode.trim())) {
    return res.render('address/postcode', {
      errors: [
        {
          text: 'Enter a valid UK postcode',
          href: '#postcode'
        }
      ],
      data: req.session.data
    })
  }

  // If validation passes, redirect to address selection
  res.redirect('/address/select-address')
})

// Route: Select address (GET)
router.get('/address/select-address', (req, res) => {
  res.render('address/select-address', {
    errors: false,
    data: req.session.data
  })
})

// Route: Select address (POST with validation)
router.post('/address/select-address', (req, res) => {
  const selectedAddress = req.session.data.selectedAddress

  // Validation: Check if an address was selected
  if (!selectedAddress || selectedAddress === '') {
    return res.render('address/select-address', {
      errors: [
        {
          text: 'Select an address',
          href: '#selectedAddress'
        }
      ],
      data: req.session.data
    })
  }

  // If validation passes, redirect to accommodation type question
  res.redirect('/address/accommodation-type')
})

// Route: Accommodation type (GET)
router.get('/address/accommodation-type', (req, res) => {
  res.render('address/accommodation-type', {
    errors: false,
    data: req.session.data
  })
})

// Route: Accommodation type (POST with validation)
router.post('/address/accommodation-type', (req, res) => {
  const accommodationType = req.session.data.accommodationType

  // Validation: Check if an option was selected
  if (!accommodationType) {
    return res.render('address/accommodation-type', {
      errors: [
        {
          text: 'Select what sort of accommodation you live in',
          href: '#accommodationType'
        }
      ],
      data: req.session.data
    })
  }

  // Conditional branching: if "supported" accommodation, ask who provides support
  if (accommodationType === 'supported') {
    res.redirect('/address/support-provider')
  } else {
    // Otherwise go directly to rent responsibility question
    res.redirect('/address/rent-responsibility')
  }
})

// Route: Support provider (GET) - conditional question
router.get('/address/support-provider', (req, res) => {
  res.render('address/support-provider', {
    errors: false,
    data: req.session.data
  })
})

// Route: Support provider (POST with validation)
router.post('/address/support-provider', (req, res) => {
  const supportProvider = req.session.data.supportProvider

  // Validation: Check if input was provided
  if (!supportProvider || supportProvider.trim() === '') {
    return res.render('address/support-provider', {
      errors: [
        {
          text: 'Enter who provides the support',
          href: '#supportProvider'
        }
      ],
      data: req.session.data
    })
  }

  // If validation passes, redirect to rent responsibility question
  res.redirect('/address/rent-responsibility')
})

// Route: Rent responsibility (GET)
router.get('/address/rent-responsibility', (req, res) => {
  res.render('address/rent-responsibility', {
    errors: false,
    data: req.session.data
  })
})

// Route: Rent responsibility (POST with validation)
router.post('/address/rent-responsibility', (req, res) => {
  const rentResponsibility = req.session.data.rentResponsibility

  // Validation: Check if an option was selected
  if (!rentResponsibility) {
    return res.render('address/rent-responsibility', {
      errors: [
        {
          text: 'Select yes if you are responsible for paying rent or Council Tax',
          href: '#rentResponsibility'
        }
      ],
      data: req.session.data
    })
  }

  // If validation passes, redirect to home type question
  res.redirect('/address/home-type')
})

// Route: Home type (GET)
router.get('/address/home-type', (req, res) => {
  res.render('address/home-type', {
    errors: false,
    data: req.session.data
  })
})

// Route: Home type (POST with validation)
router.post('/address/home-type', (req, res) => {
  const homeType = req.session.data.homeType

  // Validation: Check if an option was selected
  if (!homeType) {
    return res.render('address/home-type', {
      errors: [
        {
          text: 'Select what kind of home you live in',
          href: '#homeType'
        }
      ],
      data: req.session.data
    })
  }

  // If validation passes, redirect to property types question
  res.redirect('/address/property-types')
})

// Route: Property types (GET)
router.get('/address/property-types', (req, res) => {
  res.render('address/property-types', {
    errors: false,
    data: req.session.data
  })
})

// Route: Property types (POST with validation)
router.post('/address/property-types', (req, res) => {
  const propertyType = req.session.data.propertyType

  // Validation: Check if an option was selected
  if (!propertyType) {
    return res.render('address/property-types', {
      errors: [
        {
          text: 'Select the type of property you live in, or select None',
          href: '#propertyType'
        }
      ],
      data: req.session.data
    })
  }

  // Conditional branching: if "commercial-lodgings", ask what sort
  if (propertyType === 'commercial-lodgings') {
    res.redirect('/address/commercial-lodging-type')
  } else {
    // Otherwise, redirect to task list
    res.redirect('/task-list')
  }
})

// Route: Commercial lodging type (GET) - conditional question
router.get('/address/commercial-lodging-type', (req, res) => {
  res.render('address/commercial-lodging-type', {
    errors: false,
    data: req.session.data
  })
})

// Route: Commercial lodging type (POST with validation)
router.post('/address/commercial-lodging-type', (req, res) => {
  const commercialLodgingType = req.session.data.commercialLodgingType

  // Validation: Check if an option was selected
  if (!commercialLodgingType) {
    return res.render('address/commercial-lodging-type', {
      errors: [
        {
          text: 'Select the type of commercial lodging',
          href: '#commercialLodgingType'
        }
      ],
      data: req.session.data
    })
  }

  // If validation passes, redirect to task list
  res.redirect('/task-list')
})

// Route: Manual address entry (stub)
router.get('/address/manual', (req, res) => {
  res.render('address/manual', {
    data: req.session.data
  })
})

// About your property flow routes
// Route: Rent frequency (GET)
router.get('/about-your-property/rent-frequency', (req, res) => {
  res.render('about-your-property/rent-frequency', {
    errors: false,
    data: req.session.data
  })
})

// Route: Rent frequency (POST with validation)
router.post('/about-your-property/rent-frequency', (req, res) => {
  const rentFrequency = req.session.data.rentFrequency

  // Validation: Check if an option was selected
  if (!rentFrequency) {
    return res.render('about-your-property/rent-frequency', {
      errors: [
        {
          text: 'Select how often your rent is due',
          href: '#rentFrequency'
        }
      ],
      data: req.session.data
    })
  }

  // If validation passes, redirect to rent amount question
  res.redirect('/about-your-property/rent-amount')
})

// Route: Rent amount (GET)
router.get('/about-your-property/rent-amount', (req, res) => {
  res.render('about-your-property/rent-amount', {
    errors: false,
    data: req.session.data
  })
})

// Route: Rent amount (POST with validation)
router.post('/about-your-property/rent-amount', (req, res) => {
  const rentAmount = req.session.data['rent-amount']

  // Validation: Check if amount was entered
  if (!rentAmount || rentAmount.trim() === '') {
    return res.render('about-your-property/rent-amount', {
      errors: [
        {
          text: 'Enter how much rent you pay',
          href: '#rent-amount'
        }
      ],
      data: req.session.data
    })
  }

  // Basic validation: check if it's a valid number
  const amount = parseFloat(rentAmount.trim())
  if (isNaN(amount) || amount < 0) {
    return res.render('about-your-property/rent-amount', {
      errors: [
        {
          text: 'Enter a valid amount',
          href: '#rent-amount'
        }
      ],
      data: req.session.data
    })
  }

  // If validation passes, redirect to temporarily away question
  res.redirect('/about-your-property/temporarily-away')
})

// Route: Permanent main home (GET)
router.get('/about-your-property/permanent-main-home', (req, res) => {
  res.render('about-your-property/permanent-main-home', {
    errors: false,
    data: req.session.data
  })
})

// Route: Permanent main home (POST with validation)
router.post('/about-your-property/permanent-main-home', (req, res) => {
  const permanentMainHome = req.session.data['permanent-main-home']

  // Validation: Check if an option was selected
  if (!permanentMainHome) {
    return res.render('about-your-property/permanent-main-home', {
      errors: [
        {
          text: 'Select whether this is your main home now or if you are moving in within the next few weeks',
          href: '#permanent-main-home'
        }
      ],
      data: req.session.data
    })
  }

  // Conditional branching: if "moving-in-soon", ask for claim postcode
  if (permanentMainHome === 'moving-in-soon') {
    res.redirect('/about-your-property/claim-postcode')
  } else {
    // If "main-home-now", ask when they moved in
    res.redirect('/about-your-property/claim-move-in-date')
  }
})

// Route: Claim move in date (GET)
router.get('/about-your-property/claim-move-in-date', (req, res) => {
  res.render('about-your-property/claim-move-in-date', {
    errors: false,
    data: req.session.data
  })
})

// Route: Claim move in date (POST with validation)
router.post('/about-your-property/claim-move-in-date', (req, res) => {
  const day = req.session.data['claim-move-in-date-day']
  const month = req.session.data['claim-move-in-date-month']
  const year = req.session.data['claim-move-in-date-year']

  // Validation: check if all date fields are filled
  if (!day || !month || !year) {
    return res.render('about-your-property/claim-move-in-date', {
      errors: [
        {
          text: 'Enter the date you moved in',
          href: '#claim-move-in-date'
        }
      ],
      data: req.session.data
    })
  }

  // If validation passes, redirect to rent frequency question
  res.redirect('/about-your-property/rent-frequency')
})

// Route: Claim postcode (GET)
router.get('/about-your-property/claim-postcode', (req, res) => {
  res.render('about-your-property/claim-postcode', {
    errors: false,
    data: req.session.data
  })
})

// Route: Claim postcode (POST with validation)
router.post('/about-your-property/claim-postcode', (req, res) => {
  const claimPostcode = req.session.data['claim-postcode']

  // Validation: Check if postcode was entered
  if (!claimPostcode || claimPostcode.trim() === '') {
    return res.render('about-your-property/claim-postcode', {
      errors: [
        {
          text: 'Enter a postcode',
          href: '#claim-postcode'
        }
      ],
      data: req.session.data
    })
  }

  // Basic UK postcode format validation (simple check)
  const postcodeRegex = /^[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}$/i
  if (!postcodeRegex.test(claimPostcode.trim())) {
    return res.render('about-your-property/claim-postcode', {
      errors: [
        {
          text: 'Enter a valid UK postcode',
          href: '#claim-postcode'
        }
      ],
      data: req.session.data
    })
  }

  // If validation passes, redirect to select claim address
  res.redirect('/about-your-property/claim-select-address')
})

// Route: Claim select address (GET)
router.get('/about-your-property/claim-select-address', (req, res) => {
  res.render('about-your-property/claim-select-address', {
    errors: false,
    data: req.session.data
  })
})

// Route: Claim select address (POST with validation)
router.post('/about-your-property/claim-select-address', (req, res) => {
  const claimSelectedAddress = req.session.data['claim-selected-address']

  // Validation: Check if an address was selected
  if (!claimSelectedAddress || claimSelectedAddress === '') {
    return res.render('about-your-property/claim-select-address', {
      errors: [
        {
          text: 'Select an address',
          href: '#claim-selected-address'
        }
      ],
      data: req.session.data
    })
  }

  // If validation passes, redirect to know move in date question
  res.redirect('/about-your-property/know-move-in-date')
})

// Route: Know move in date (GET)
router.get('/about-your-property/know-move-in-date', (req, res) => {
  res.render('about-your-property/know-move-in-date', {
    errors: false,
    data: req.session.data
  })
})

// Route: Know move in date (POST with validation)
router.post('/about-your-property/know-move-in-date', (req, res) => {
  const knowMoveInDate = req.session.data['know-move-in-date']

  // Validation: Check if an option was selected
  if (!knowMoveInDate) {
    return res.render('about-your-property/know-move-in-date', {
      errors: [
        {
          text: 'Select yes if you know the date you are due to move in',
          href: '#know-move-in-date'
        }
      ],
      data: req.session.data
    })
  }

  // Conditional branching: if "yes", ask for the move in date
  if (knowMoveInDate === 'yes') {
    res.redirect('/about-your-property/move-in-date')
  } else {
    // If "no", redirect to the rent frequency page
    res.redirect('/about-your-property/rent-frequency')
  }
})

// Route: Move in date (GET)
router.get('/about-your-property/move-in-date', (req, res) => {
  res.render('about-your-property/move-in-date', {
    errors: false,
    data: req.session.data
  })
})

// Route: Move in date (POST with validation)
router.post('/about-your-property/move-in-date', (req, res) => {
  const day = req.session.data['move-in-date-day']
  const month = req.session.data['move-in-date-month']
  const year = req.session.data['move-in-date-year']

  // Validation: check if all date fields are filled
  if (!day || !month || !year) {
    return res.render('about-your-property/move-in-date', {
      errors: [
        {
          text: 'Enter the date you will move in',
          href: '#move-in-date'
        }
      ],
      data: req.session.data
    })
  }

  // If validation passes, redirect to rent frequency
  res.redirect('/about-your-property/rent-frequency')
})

// Route: Temporarily away (GET)
router.get('/about-your-property/temporarily-away', (req, res) => {
  res.render('about-your-property/temporarily-away', {
    errors: false,
    data: req.session.data
  })
})

// Route: Temporarily away (POST with validation)
router.post('/about-your-property/temporarily-away', (req, res) => {
  const temporarilyAway = req.session.data['temporarily-away']

  // Validation: Check if an option was selected
  if (!temporarilyAway) {
    return res.render('about-your-property/temporarily-away', {
      errors: [
        {
          text: 'Select yes if you are temporarily living away from home',
          href: '#temporarily-away'
        }
      ],
      data: req.session.data
    })
  }

  // If validation passes, redirect to business use question
  res.redirect('/about-your-property/business-use')
})

// Route: Business use (GET)
router.get('/about-your-property/business-use', (req, res) => {
  res.render('about-your-property/business-use', {
    errors: false,
    data: req.session.data
  })
})

// Route: Business use (POST with validation)
router.post('/about-your-property/business-use', (req, res) => {
  const businessUse = req.session.data['business-use']

  // Validation: Check if an option was selected
  if (!businessUse) {
    return res.render('about-your-property/business-use', {
      errors: [
        {
          text: 'Select yes if you or your partner use any part of your home for running a business',
          href: '#business-use'
        }
      ],
      data: req.session.data
    })
  }

  // If validation passes, redirect to task list
  res.redirect('/task-list')
})

// Route: Claim address manual entry (GET) - stub for now
router.get('/about-your-property/claim-address-manual', (req, res) => {
  res.send('<h1>Enter claim address manually</h1><p>This is a placeholder page. <a href="/about-your-property/claim-postcode">Back to postcode</a></p>')
})

// Placeholder routes for "Your home and household" tasks

router.get('/task/home-and-household/your-landlord', (req, res) => {
  res.redirect('/task-list')
})

router.get('/task/home-and-household/your-tenancy', (req, res) => {
  res.redirect('/task-list')
})

router.get('/task/home-and-household/other-property-or-land', (req, res) => {
  res.redirect('/task-list')
})

router.get('/task/home-and-household/people-who-live-with-you', (req, res) => {
  res.send('<h1>People who live with you</h1><p>This is a placeholder page. <a href="/task-list">Back to task list</a></p>')
})

// Household flow routes
// Route: Children (GET)
router.get('/household/children', (req, res) => {
  res.render('household/children', {
    errors: false,
    data: req.session.data
  })
})

// Route: Children (POST with validation and conditional routing)
router.post('/household/children', (req, res) => {
  const hasChildren = req.session.data.hasChildren

  // Validation: Check if an option was selected
  if (!hasChildren) {
    return res.render('household/children', {
      errors: [
        {
          text: 'Select yes if you are responsible for any children or qualifying young people',
          href: '#hasChildren'
        }
      ],
      data: req.session.data
    })
  }

  // Conditional branching: if "no" children, ask about other adults
  if (hasChildren === 'no') {
    res.redirect('/household/other-adults')
  } else {
    // If "yes", stay on the same page for UR purposes (placeholder for now)
    res.redirect('/household/children')
  }
})

// Route: Other adults (GET)
router.get('/household/other-adults', (req, res) => {
  res.render('household/other-adults', {
    errors: false,
    data: req.session.data
  })
})

// Route: Other adults (POST with validation)
router.post('/household/other-adults', (req, res) => {
  const hasOtherAdults = req.session.data.hasOtherAdults

  // Validation: Check if an option was selected
  if (!hasOtherAdults) {
    return res.render('household/other-adults', {
      errors: [
        {
          text: 'Select yes if anyone else who is over 18 lives with you',
          href: '#hasOtherAdults'
        }
      ],
      data: req.session.data
    })
  }

  // Conditional branching: if "yes", ask for first person's name
  if (hasOtherAdults === 'yes') {
    res.redirect('/household/first-person-name')
  } else {
    // If "no", keep them on this page for UR purposes
    res.redirect('/household/other-adults')
  }
})

// Route: First person name (GET)
router.get('/household/first-person-name', (req, res) => {
  res.render('household/first-person-name', {
    errors: false,
    data: req.session.data
  })
})

// Route: First person name (POST with validation)
router.post('/household/first-person-name', (req, res) => {
  const firstPersonName = req.session.data['first-person-name']
  
  // Validation: check if field is not empty
  if (!firstPersonName || firstPersonName.trim() === '') {
    // Set error and re-render the page
    return res.render('household/first-person-name', {
      errors: [
        {
          text: 'Enter the name of the first person that lives with you',
          href: '#first-person-name'
        }
      ],
      data: req.session.data
    })
  }
  
  // If validation passes, redirect to living situation question
  res.redirect('/household/living-situation')
})

// Route: First person relationship (GET)
router.get('/household/first-person-relationship', (req, res) => {
  res.render('household/first-person-relationship', {
    errors: false,
    data: req.session.data
  })
})

// Route: First person relationship (POST with validation)
router.post('/household/first-person-relationship', (req, res) => {
  const firstPersonRelationship = req.session.data['first-person-relationship']
  
  // Validation: check if an option was selected
  if (!firstPersonRelationship) {
    return res.render('household/first-person-relationship', {
      errors: [
        {
          text: 'Select yes if you are related to them',
          href: '#first-person-relationship'
        }
      ],
      data: req.session.data
    })
  }
  
  // If validation passes, redirect to relationship situation question
  res.redirect('/household/first-person-date-of-birth')
})

// Route: Living situation (GET)
router.get('/household/living-situation', (req, res) => {
  res.render('household/living-situation', {
    errors: false,
   data: req.session.data
  })
})

// Route: Living situation (POST with validation)
router.post('/household/living-situation', (req, res) => {
  const livingSituation = req.session.data['living-situation']
  
  // Validation: check if an option was selected
  if (!livingSituation) {
    return res.render('household/living-situation', {
      errors: [
        {
          text: 'Select your living situation',
          href: '#living-situation'
        }
      ],
      data: req.session.data
    })
  }
  
  // If validation passes, redirect to the are you related page
  res.redirect('/household/first-person-relationship')
})

// Route: First person date of birth (GET)
router.get('/household/first-person-date-of-birth', (req, res) => {
  res.render('household/first-person-date-of-birth', {
    errors: false,
    data: req.session.data
  })
})

// Route: First person date of birth (POST with validation)
router.post('/household/first-person-date-of-birth', (req, res) => {
  const day = req.session.data['first-person-dob-day']
  const month = req.session.data['first-person-dob-month']
  const year = req.session.data['first-person-dob-year']
  
  // Validation: check if all date fields are filled
  if (!day || !month || !year) {
    return res.render('household/first-person-date-of-birth', {
      errors: [
        {
          text: 'Enter their date of birth',
          href: '#first-person-dob'
        }
      ],
      data: req.session.data
    })
  }
  
  // If validation passes, redirect to registered blind question
  res.redirect('/household/first-person-registered-blind')
})

// Route: First person registered blind (GET)
router.get('/household/first-person-registered-blind', (req, res) => {
  res.render('household/first-person-registered-blind', {
    errors: false,
    data: req.session.data
  })
})

// Route: First person registered blind (POST with validation)
router.post('/household/first-person-registered-blind', (req, res) => {
  const registeredBlind = req.session.data['first-person-registered-blind']
  
  // Validation: check if an option was selected
  if (!registeredBlind) {
    return res.render('household/first-person-registered-blind', {
      errors: [
        {
          text: 'Select yes if they are registered blind or severely sight impaired',
          href: '#first-person-registered-blind'
        }
      ],
      data: req.session.data
    })
  }
  
  // If validation passes, redirect to living together date question
  res.redirect('/household/first-person-living-together-date')
})

// Route: First person living together date (GET)
router.get('/household/first-person-living-together-date', (req, res) => {
  res.render('household/first-person-living-together-date', {
    errors: false,
    data: req.session.data
  })
})

// Route: First person living together date (POST with validation)
router.post('/household/first-person-living-together-date', (req, res) => {
  const day = req.session.data['first-person-living-together-date-day']
  const month = req.session.data['first-person-living-together-date-month']
  const year = req.session.data['first-person-living-together-date-year']
  
  // Validation: check if all date fields are filled
  if (!day || !month || !year) {
    return res.render('household/first-person-living-together-date', {
      errors: [
        {
          text: 'Enter the date you started living together',
          href: '#first-person-living-together-date'
        }
      ],
      data: req.session.data
    })
  }
  
  // If validation passes, redirect to full time education question
  res.redirect('/household/first-person-full-time-education')
})

// Route: First person full time education (GET)
router.get('/household/first-person-full-time-education', (req, res) => {
  res.render('household/first-person-full-time-education', {
    errors: false,
    data: req.session.data
  })
})

// Route: First person full time education (POST with validation)
router.post('/household/first-person-full-time-education', (req, res) => {
  const fullTimeEducation = req.session.data['first-person-full-time-education']
  
  // Validation: check if an option was selected
  if (!fullTimeEducation) {
    return res.render('household/first-person-full-time-education', {
      errors: [
        {
          text: 'Select whether they are in full time education',
          href: '#first-person-full-time-education'
        }
      ],
      data: req.session.data
    })
  }
  
  // If validation passes, redirect to money from working question
  res.redirect('/household/first-person-money-from-working')
})

// Route: First person money from working (GET)
router.get('/household/first-person-money-from-working', (req, res) => {
  res.render('household/first-person-money-from-working', {
    errors: false,
    data: req.session.data
  })
})

// Route: First person money from working (POST with validation)
router.post('/household/first-person-money-from-working', (req, res) => {
  const employment = req.session.data['first-person-employment']
  const selfEmployed = req.session.data['first-person-self-employed']
  
  const errors = []
  
  // Validation: check if employment option was selected
  if (!employment) {
    errors.push({
      text: 'Select whether they are in employment',
      href: '#first-person-employment'
    })
  }
  
  // Validation: check if self-employed option was selected
  if (!selfEmployed) {
    errors.push({
      text: 'Select whether they are self-employed',
      href: '#first-person-self-employed'
    })
  }
  
  // If there are validation errors, re-render with errors
  if (errors.length > 0) {
    return res.render('household/first-person-money-from-working', {
      errors: errors,
      data: req.session.data
    })
  }
  
  // Conditional routing: if not employed or employed part-time, ask about working hours
  if (employment === 'no' || employment === 'yes-part-time') {
    res.redirect('/household/first-person-working-hours')
  } else {
    // If validation passes, redirect to provides care question
    res.redirect('/household/first-person-provides-care')
  }
})

// Route: First person working hours (GET)
router.get('/household/first-person-working-hours', (req, res) => {
  res.render('household/first-person-working-hours', {
    errors: false,
    data: req.session.data
  })
})

// Route: First person working hours (POST with validation)
router.post('/household/first-person-working-hours', (req, res) => {
  const workingHours = req.session.data['first-person-working-hours']
  
  // Validation: check if an option was selected
  if (!workingHours) {
    return res.render('household/first-person-working-hours', {
      errors: [
        {
          text: 'Select yes if they normally work 16 hours a week or more',
          href: '#first-person-working-hours'
        }
      ],
      data: req.session.data
    })
  }
  
  // If validation passes, redirect to provides care question
  res.redirect('/household/first-person-provides-care')
})

// Route: First person provides care (GET)
router.get('/household/first-person-provides-care', (req, res) => {
  res.render('household/first-person-provides-care', {
    errors: false,
    data: req.session.data
  })
})

// Route: First person provides care (POST with validation)
router.post('/household/first-person-provides-care', (req, res) => {
  const providesCare = req.session.data['first-person-provides-care']
  
  // Validation: check if an option was selected
  if (!providesCare) {
    return res.render('household/first-person-provides-care', {
      errors: [
        {
          text: 'Select yes if they provide care or support',
          href: '#first-person-provides-care'
        }
      ],
      data: req.session.data
    })
  }
  
  // Conditional branching: if "yes", ask about 35 hours care
  if (providesCare === 'yes') {
    res.redirect('/household/first-person-care-35-hours')
  } else {
    // If "no", redirect to benefits question
    res.redirect('/household/first-person-benefits')
  }
})

// Route: First person care 35 hours (GET)
router.get('/household/first-person-care-35-hours', (req, res) => {
  res.render('household/first-person-care-35-hours', {
    errors: false,
    data: req.session.data
  })
})

// Route: First person care 35 hours (POST with validation)
router.post('/household/first-person-care-35-hours', (req, res) => {
  const care35Hours = req.session.data['first-person-care-35-hours']
  
  // Validation: check if an option was selected
  if (!care35Hours) {
    return res.render('household/first-person-care-35-hours', {
      errors: [
        {
          text: 'Select yes if they provide care for at least 35 hours a week',
          href: '#first-person-care-35-hours'
        }
      ],
      data: req.session.data
    })
  }
  
  // If validation passes, redirect to 24 hours care question
  res.redirect('/household/first-person-care-24-hours')
})

// Route: First person care 24 hours (GET)
router.get('/household/first-person-care-24-hours', (req, res) => {
  res.render('household/first-person-care-24-hours', {
    errors: false,
    data: req.session.data
  })
})

// Route: First person care 24 hours (POST with validation)
router.post('/household/first-person-care-24-hours', (req, res) => {
  const care24Hours = req.session.data['first-person-care-24-hours']
  
  // Validation: check if an option was selected
  if (!care24Hours) {
    return res.render('household/first-person-care-24-hours', {
      errors: [
        {
          text: 'Select yes if they provide care for at least 24 hours a week',
          href: '#first-person-care-24-hours'
        }
      ],
      data: req.session.data
    })
  }
  
  // If validation passes, redirect to severely mentally impaired question (temporarily removed from routing because we think its a CRT question)
  res.redirect('/household/first-person-benefits')
})

// Route: First person severely mentally impaired (GET)
router.get('/household/first-person-severely-mentally-impaired', (req, res) => {
  res.render('household/first-person-severely-mentally-impaired', {
    errors: false,
    data: req.session.data
  })
})

// Route: First person severely mentally impaired (POST with validation)
router.post('/household/first-person-severely-mentally-impaired', (req, res) => {
  const severelyMentallyImpaired = req.session.data['first-person-severely-mentally-impaired']
  
  // Validation: check if an option was selected
  if (!severelyMentallyImpaired) {
    return res.render('household/first-person-severely-mentally-impaired', {
      errors: [
        {
          text: 'Select yes if they are severely mentally impaired',
          href: '#first-person-severely-mentally-impaired'
        }
      ],
      data: req.session.data
    })
  }
  
  // If validation passes, redirect to benefits question
  res.redirect('/household/first-person-benefits')
})

// Route: First person benefits (GET)
router.get('/household/first-person-benefits', (req, res) => {
  res.render('household/first-person-benefits', {
    errors: false,
    data: req.session.data
  })
})

// Route: First person benefits (POST with validation)
router.post('/household/first-person-benefits', (req, res) => {
  const benefits = req.session.data['first-person-benefits']
  
  // Validation: check if an option was selected
  if (!benefits) {
    return res.render('household/first-person-benefits', {
      errors: [
        {
          text: 'Select which benefit they are currently getting, or select None',
          href: '#first-person-benefits'
        }
      ],
      data: req.session.data
    })
  }
  
  // Conditional branching: if "universal-credit", ask for amount
  if (benefits === 'universal-credit') {
    res.redirect('/household/first-person-universal-credit-amount')
  } else {
    // Otherwise, redirect to pays rent question
    res.redirect('/household/first-person-pays-rent')
  }
})

// Route: First person universal credit amount (GET)
router.get('/household/first-person-universal-credit-amount', (req, res) => {
  res.render('household/first-person-universal-credit-amount', {
    errors: false,
    data: req.session.data
  })
})

// Route: First person universal credit amount (POST with validation)
router.post('/household/first-person-universal-credit-amount', (req, res) => {
  const ucAmount = req.session.data['first-person-universal-credit-amount']
  
  // Validation: check if amount was entered
  if (!ucAmount || ucAmount.trim() === '') {
    return res.render('household/first-person-universal-credit-amount', {
      errors: [
        {
          text: 'Enter the monthly amount of Universal Credit',
          href: '#first-person-universal-credit-amount'
        }
      ],
      data: req.session.data
    })
  }
  
  // Basic validation: check if it's a valid number
  const amount = parseFloat(ucAmount.trim())
  if (isNaN(amount) || amount < 0) {
    return res.render('household/first-person-universal-credit-amount', {
      errors: [
        {
          text: 'Enter a valid amount',
          href: '#first-person-universal-credit-amount'
        }
      ],
      data: req.session.data
    })
  }
  
  // If validation passes, redirect to pays rent question
  res.redirect('/household/first-person-pays-rent')
})

// Route: First person pays rent (GET)
router.get('/household/first-person-pays-rent', (req, res) => {
  res.render('household/first-person-pays-rent', {
    errors: false,
    data: req.session.data
  })
})

// Route: First person pays rent (POST with validation)
router.post('/household/first-person-pays-rent', (req, res) => {
  const paysRent = req.session.data['first-person-pays-rent']
  
  // Validation: check if an option was selected
  if (!paysRent) {
    return res.render('household/first-person-pays-rent', {
      errors: [
        {
          text: 'Select yes if they pay towards the rent or mortgage',
          href: '#first-person-pays-rent'
        }
      ],
      data: req.session.data
    })
  }
  
  // If validation passes, redirect to national insurance question
  res.redirect('/household/first-person-national-insurance')
})

// Route: First person national insurance (GET)
router.get('/household/first-person-national-insurance', (req, res) => {
  res.render('household/first-person-national-insurance', {
    errors: false,
    data: req.session.data
  })
})

// Route: First person national insurance (POST with validation)
router.post('/household/first-person-national-insurance', (req, res) => {
  const nationalInsurance = req.session.data['first-person-national-insurance']
  
  // Validation: check if an option was selected
  if (!nationalInsurance) {
    return res.render('household/first-person-national-insurance', {
      errors: [
        {
          text: 'Select whether they have a National Insurance Number',
          href: '#first-person-national-insurance'
        }
      ],
      data: req.session.data
    })
  }
  
  // Conditional branching: if "yes-know-number", ask for the NINO
  if (nationalInsurance === 'yes-know-number') {
    res.redirect('/household/first-person-nino-input')
  } else {
    // For "yes-cannot-find" or "no", redirect to hospital question
    res.redirect('/household/first-person-in-hospital')
  }
})

// Route: First person NINO input (GET)
router.get('/household/first-person-nino-input', (req, res) => {
  res.render('household/first-person-nino-input', {
    errors: false,
    data: req.session.data
  })
})

// Route: First person NINO input (POST with validation)
router.post('/household/first-person-nino-input', (req, res) => {
  const nino = req.session.data['first-person-nino']
  
  // Validation: check if NINO was entered
  if (!nino || nino.trim() === '') {
    return res.render('household/first-person-nino-input', {
      errors: [
        {
          text: 'Enter their National Insurance Number',
          href: '#first-person-nino'
        }
      ],
      data: req.session.data
    })
  }
  
  // Basic validation: check if it matches NINO pattern (optional, can be enhanced)
  const ninoPattern = /^[A-Z]{2}\s?\d{2}\s?\d{2}\s?\d{2}\s?[A-D]$/i
  if (!ninoPattern.test(nino.trim())) {
    return res.render('household/first-person-nino-input', {
      errors: [
        {
          text: 'Enter a National Insurance Number in the correct format',
          href: '#first-person-nino'
        }
      ],
      data: req.session.data
    })
  }
  
  // If validation passes, redirect to hospital question
  res.redirect('/household/first-person-in-hospital')
})

// Route: First person in hospital (GET)
router.get('/household/first-person-in-hospital', (req, res) => {
  res.render('household/first-person-in-hospital', {
    errors: false,
    data: req.session.data
  })
})

// Route: First person in hospital (POST with validation)
router.post('/household/first-person-in-hospital', (req, res) => {
  const inHospital = req.session.data['first-person-in-hospital']
  
  // Validation: check if an option was selected
  if (!inHospital) {
    return res.render('household/first-person-in-hospital', {
      errors: [
        {
          text: 'Select yes if they are in hospital at the moment',
          href: '#first-person-in-hospital'
        }
      ],
      data: req.session.data
    })
  }
  
  // If validation passes, redirect to children question
  res.redirect('/household/first-person-has-children')
})

// Route: First person has children (GET)
router.get('/household/first-person-has-children', (req, res) => {
  res.render('household/first-person-has-children', {
    errors: false,
    data: req.session.data
  })
})

// Route: First person has children (POST with validation)
router.post('/household/first-person-has-children', (req, res) => {
  const hasChildren = req.session.data['first-person-has-children']
  
  // Validation: check if an option was selected
  if (!hasChildren) {
    return res.render('household/first-person-has-children', {
      errors: [
        {
          text: 'Select yes if they have any children living with you who they are responsible for',
          href: '#first-person-has-children'
        }
      ],
      data: req.session.data
    })
  }
  
  // If validation passes, redirect to task list
  res.redirect('/task-list')
})

module.exports = router
