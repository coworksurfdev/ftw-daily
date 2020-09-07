import ReactGA from 'react-ga'

export const initAnalytics = (userId) => {
  if (window) {
    ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYICS_UA, {
      debug: true,
      titleCase: false,
      gaOptions: {
        userId: userId || 'not_set'
      }
    })
  }
}

export const trackEvent = (category, action, value) => {
  try {
    ReactGA.event({
      category,
      action,
      value
    })
  } catch (e) {
    console.log(e)
  }
}
