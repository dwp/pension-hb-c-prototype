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
  res.send('<h1>Your personal details</h1><p>This is a placeholder page. <a href="/task-list">Back to task list</a></p>')
})

router.get('/task/about-you/immigration-status', (req, res) => {
  res.send('<h1>Your immigration status</h1><p>This is a placeholder page. <a href="/task-list">Back to task list</a></p>')
})

router.get('/task/about-you/time-outside-uk', (req, res) => {
  res.send('<h1>Time you have spent outside the UK</h1><p>This is a placeholder page. <a href="/task-list">Back to task list</a></p>')
})

router.get('/task/about-you/time-in-hospital', (req, res) => {
  res.send('<h1>Time you have spent in hospital</h1><p>This is a placeholder page. <a href="/task-list">Back to task list</a></p>')
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

// Route: Property types (GET) - placeholder
router.get('/address/property-types', (req, res) => {
  res.render('address/property-types', {
    data: req.session.data
  })
})

// Route: Manual address entry (stub)
router.get('/address/manual', (req, res) => {
  res.render('address/manual', {
    data: req.session.data
  })
})

// Placeholder routes for "Your home and household" tasks
router.get('/task/home-and-household/your-address', (req, res) => {
  res.send('<h1>Your address</h1><p>This is a placeholder page. <a href="/task-list">Back to task list</a></p>')
})

router.get('/task/home-and-household/about-place-you-live', (req, res) => {
  res.send('<h1>About the place you live</h1><p>This is a placeholder page. <a href="/task-list">Back to task list</a></p>')
})

router.get('/task/home-and-household/claim-address', (req, res) => {
  res.send('<h1>Claim address</h1><p>This is a placeholder page. <a href="/task-list">Back to task list</a></p>')
})

router.get('/task/home-and-household/your-landlord', (req, res) => {
  res.send('<h1>Your landlord</h1><p>This is a placeholder page. <a href="/task-list">Back to task list</a></p>')
})

router.get('/task/home-and-household/your-tenancy', (req, res) => {
  res.render('<h1>Your tenancy</h1><p>This is a placeholder page. <a href="/task-list">Back to task list</a></p>')
})

router.get('/task/home-and-household/other-property-or-land', (req, res) => {
  res.send('<h1>Other property or land you own</h1><p>This is a placeholder page. <a href="/task-list">Back to task list</a></p>')
})

router.get('/task/home-and-household/people-who-live-with-you', (req, res) => {
  res.send('<h1>People who live with you</h1><p>This is a placeholder page. <a href="/task-list">Back to task list</a></p>')
})
