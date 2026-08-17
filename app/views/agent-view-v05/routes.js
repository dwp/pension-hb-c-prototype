//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//

const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()

const version = 'agent-view-v05'

function addTimelineEvent(req, event) {
  req.session.data.timeline = req.session.data.timeline || []

  req.session.data.timeline.unshift(event)
}

function getTimestamp() {
  return new Date().toLocaleString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  })
}

function ensureCaseInProgress(req) {

  if (req.session.data.caseInProgressRecorded) {
    return
  }

  const event =
    req.session.data.agentType === 'pc'
      ? {
          title: 'Pension Credit case in progress',
          byline: 'DWP Pension Credit agent'
        }
      : {
          title: 'Housing Benefit case in progress',
          byline: 'Gateshead Housing Benefit agent'
        }

  addTimelineEvent(req, {
    title: event.title,
    date: getTimestamp(),
    byline: event.byline
  })

  req.session.data.caseInProgressRecorded = true
}

router.post('/agent-view-v05/agent-type', function (req, res) {

  req.session.data.agentType = req.body.agentType

  req.session.data.timeline = [
    {
      title: 'Application received',
      date: '12 February 2026 at 3:00pm',
      byline: 'System'
    }
  ]

  res.redirect('/agent-view-v05/landing-page')
})

// Find someone -> claim record
router.post(`/${version}/find-someone`, (req, res) => {
  return res.redirect(`/${version}/claim-record`)
})

// Claim overview -> personal details
router.post(`/${version}/claim-overview`, (req, res) => {
  ensureCaseInProgress(req)
  return res.redirect(`/${version}/personal-details`)
})

// Personal details -> partner's personal details
router.post(`/${version}/personal-details`, (req, res) => {
    ensureCaseInProgress(req)
  return res.redirect(`/${version}/partner-personal-details`)
})

// partner's personal details -> home details
router.post(`/${version}/partner-personal-details`, (req, res) => {
    ensureCaseInProgress(req)
  return res.redirect(`/${version}/home-details`)
})

// home details -> household details
router.post(`/${version}/home-details`, (req, res) => {
    ensureCaseInProgress(req)
  return res.redirect(`/${version}/household-details`)
})

// household details -> income
router.post(`/${version}/household-details`, (req, res) => {
    ensureCaseInProgress(req)
  return res.redirect(`/${version}/income-details`)
})

// income -> contact details
router.post(`/${version}/income-details`, (req, res) => {
    ensureCaseInProgress(req)
  return res.redirect(`/${version}/contact-details`)
})

// contact details -> payment details
router.post(`/${version}/contact-details`, (req, res) => {
    ensureCaseInProgress(req)
  return res.redirect(`/${version}/payment-details`)
})

// payment details -> task list
router.post(`/${version}/payment-details`, (req, res) => {
    ensureCaseInProgress(req)
  return res.redirect(`/${version}/agent-task-list`)
})

router.get('/agent-view-v05/landing-page', (req, res) => {
  const caseClosed = req.session.data.caseClosed
  req.session.data.caseClosed = false

  res.render('agent-view-v05/landing-page', {
    caseClosed
  })
})

// Pension Credit awarded
router.post('/agent-view-v05/pc-awarded', (req, res) => {
  req.session.data.caseClosed = true
  req.session.data.pensionCreditDecisionRecorded = 'yes'

  res.redirect('/agent-view-v05/landing-page')
})

// Supporting evidence question
router.post('/agent-view-v05/supporting-evidence', function (req, res) {

  const supportingEvidenceReceived =
    req.body.supportingEvidenceReceived

  if (supportingEvidenceReceived === 'yes') {
    res.redirect('/agent-view-v05/what-supporting-evidence')
  } else {

    req.session.data.supportingInformationRecorded = 'yes'

    res.redirect('/agent-view-v05/agent-task-list')
  }

})

// What supporting evidence page
router.post('/agent-view-v05/what-supporting-evidence', function (req, res) {

  req.session.data.supportingInformationRecorded = 'yes'

  const actor =
    req.session.data.agentType === 'pc'
      ? 'DWP Pension Credit agent'
      : 'Gateshead Housing Benefit agent'

  const sectionNames = {
    'claim-overview': 'Claim overview',
    'personal-details': 'Personal details',
    'partner-details': "Partner's personal details",
    'home-details': 'Home details',
    'household-details': 'Household details',
    'income-details': 'Income, money and investments',
    'contact-information': 'Contact details',
    'payment-details': 'Payment details'
  }

  const sections = req.session.data.supportingEvidenceSections || []
  if (sections.length > 0) {
  ensureCaseInProgress(req)
}

  req.session.data.informationReceivedSections =
  req.session.data.informationReceivedSections || []

  sections.forEach(section => {

  if (!req.session.data.informationReceivedSections.includes(section)) {
    req.session.data.informationReceivedSections.push(section)
  }

  addTimelineEvent(req, {
    title: `Supporting evidence received for ${sectionNames[section] || section}`,
    date: getTimestamp(),
    byline: actor
  })

})


  res.redirect('/agent-view-v05/agent-task-list')
  })

// Housing Benefit decision
router.post('/agent-view-v05/hb-award-decision', (req, res) => {

  ensureCaseInProgress(req)

  addTimelineEvent(req, {
    title: 'Housing Benefit decision recorded',
    date: getTimestamp(),
    byline: 'Gateshead Housing Benefit agent'
  })

  req.session.data.caseClosed = true
  req.session.data.housingBenefitDecisionRecorded = 'yes'

  res.redirect('/agent-view-v05/landing-page')
})

// Pension Credit decision
router.post('/agent-view-v05/pc-award-decision', function (req, res) {

  const pensionCreditAward = req.body.pensionCreditAward

  ensureCaseInProgress(req)

  addTimelineEvent(req, {
    title: 'Pension Credit decision recorded',
    date: getTimestamp(),
    byline: 'DWP Pension Credit agent'
  })

  req.session.data.pensionCreditDecisionRecorded = 'yes'

  if (pensionCreditAward === 'pc-awarded') {
    res.redirect('/agent-view-v05/pc-awarded')
  } else {
    res.redirect('/agent-view-v05/agent-task-list')
  }

})