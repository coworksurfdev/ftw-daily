import React from 'react'
import PropTypes from 'prop-types'
import { intlShape } from '../../util/reactIntl'
import routeConfiguration from '../../routeConfiguration'
import {
  LISTING_PAGE_PARAM_TYPE_DRAFT,
  LISTING_PAGE_PARAM_TYPE_NEW,
  LISTING_PAGE_PARAM_TYPES,
} from '../../util/urlHelpers'
import { ensureListing } from '../../util/data'
import { createResourceLocatorString } from '../../util/routes'
import {
  EditListingAvailabilityPanel,
  EditListingDescriptionPanel,
  EditListingFeaturesPanel,
  EditListingLocationPanel,
  EditListingPhotosPanel,
  // EditListingPoliciesPanel,
  EditListingPricingPanel,
  EditListingProductsPanel
} from '..'
import EditListingColivingPanel from '../EditListingColivingPanel/EditListingColivingPanel'
import EditListingCoworkingPanel from '../EditListingCoworkingPanel/EditListingCoworkingPanel'
import EditListingSurfingPanel from '../EditListingSurfingPanel/EditListingSurfingPanel'

import css from './EditListingWizard.css'

export const DESCRIPTION = 'description'
export const COLIVING = 'coliving'
export const COWORKING = 'coworking'
export const SURFING = 'surfing'
export const AVAILABILITY = 'availability'
export const FEATURES = 'features'
// export const POLICY = 'policy';
export const LOCATION = 'location'
export const PRICING = 'pricing'
export const PRODUCTS = 'products'
export const PHOTOS = 'photos'

// EditListingWizardTab component supports these tabs
export const SUPPORTED_TABS = [
  DESCRIPTION,
  COLIVING,
  COWORKING,
  SURFING,
  FEATURES,
  // POLICY,
  LOCATION,
  PRICING,
  PRODUCTS,
  AVAILABILITY,
  PHOTOS,
]

const pathParamsToNextTab = (params, tab, marketplaceTabs) => {
  const nextTabIndex = marketplaceTabs.findIndex((s) => s === tab) + 1
  const nextTab
    = nextTabIndex < marketplaceTabs.length
      ? marketplaceTabs[nextTabIndex]
      : marketplaceTabs[marketplaceTabs.length - 1]
  return { ...params, tab: nextTab }
}

// When user has update draft listing, he should be redirected to next EditListingWizardTab
const redirectAfterDraftUpdate = (listingId, params, tab, marketplaceTabs, history) => {
  const currentPathParams = {
    ...params,
    type: LISTING_PAGE_PARAM_TYPE_DRAFT,
    id: listingId,
  }
  const routes = routeConfiguration()

  // Replace current "new" path to "draft" path.
  // Browser's back button should lead to editing current draft instead of creating a new one.
  if (params.type === LISTING_PAGE_PARAM_TYPE_NEW) {
    const draftURI = createResourceLocatorString('EditListingPage', routes, currentPathParams, {})
    history.replace(draftURI)
  }

  // Redirect to next tab
  const nextPathParams = pathParamsToNextTab(currentPathParams, tab, marketplaceTabs)
  const to = createResourceLocatorString('EditListingPage', routes, nextPathParams, {})
  history.push(to)
}

const EditListingWizardTab = (props) => {
  const {
    tab,
    marketplaceTabs,
    params,
    errors,
    fetchInProgress,
    newListingPublished,
    history,
    images,
    availability,
    listing,
    handleCreateFlowTabScrolling,
    handlePublishListing,
    onUpdateListing,
    onCreateListingDraft,
    onImageUpload,
    onUpdateImageOrder,
    onRemoveImage,
    onChange,
    updatedTab,
    updateInProgress,
    intl,
  } = props

  const { type } = params
  const isNewURI = type === LISTING_PAGE_PARAM_TYPE_NEW
  const isDraftURI = type === LISTING_PAGE_PARAM_TYPE_DRAFT
  const isNewListingFlow = isNewURI || isDraftURI

  const currentListing = ensureListing(listing)
  const imageIds = (imgs) => {
    return imgs ? imgs.map((img) => {
      if (typeof img === 'string') {
        return img
      }
      return img.imageId || img.id
    }) : null
  }

  const onCompleteEditListingWizardTab = (tab, updateValues, shouldRedirect) => {
    // Normalize images for API call
    const { images: updatedImages, ...otherValues } = updateValues
    const imageProperty
      = typeof updatedImages !== 'undefined' ? { images: imageIds(updatedImages) } : {}
    const updateValuesWithImages = { ...otherValues, ...imageProperty }

    if (isNewListingFlow) {
      const onUpsertListingDraft = isNewURI
        ? (tab, updateValues) => onCreateListingDraft(updateValues)
        : onUpdateListing

      const upsertValues = isNewURI
        ? updateValuesWithImages
        : { ...updateValuesWithImages, id: currentListing.id }

      onUpsertListingDraft(tab, upsertValues)
      .then((r) => {
        if (tab !== marketplaceTabs[marketplaceTabs.length - 1]) {
          // Create listing flow: smooth scrolling polyfill to scroll to correct tab
          handleCreateFlowTabScrolling(false)

          // After successful saving of draft data, user should be redirected to next tab
          if (shouldRedirect) {
            redirectAfterDraftUpdate(r.data.data.id.uuid, params, tab, marketplaceTabs, history)
          }
        } else {
          handlePublishListing(currentListing.id)
        }
      })
      .catch((e) => {
        // No need for extra actions
      })
    } else {
      onUpdateListing(tab, { ...updateValuesWithImages, id: currentListing.id })
    }
  }

  const panelProps = (tab) => {
    return {
      className: css.panel,
      errors,
      listing,
      onChange,
      panelUpdated: updatedTab === tab,
      updateInProgress,
      // newListingPublished and fetchInProgress are flags for the last wizard tab
      ready: newListingPublished,
      disabled: fetchInProgress,
    }
  }

  switch (tab) {
    case DESCRIPTION: {
      const submitButtonTranslationKey = isNewListingFlow
        ? 'EditListingWizard.saveNewDescription'
        : 'EditListingWizard.saveEditDescription'
      return (
        <EditListingDescriptionPanel
          {...panelProps(DESCRIPTION)}
          submitButtonText={intl.formatMessage({ id: submitButtonTranslationKey })}
          onSubmit={(values, shouldRedirect) => {
            onCompleteEditListingWizardTab(tab, values, shouldRedirect)
          }}
        />
      )
    }
    case COLIVING: {
      const submitButtonTranslationKey = isNewListingFlow
        ? 'EditListingWizard.saveNewColiving'
        : 'EditListingWizard.saveEditColiving'
      return (
        <EditListingColivingPanel
          {...panelProps(COLIVING)}
          submitButtonText={intl.formatMessage({ id: submitButtonTranslationKey })}
          onSubmit={(values, shouldRedirect) => {
            onCompleteEditListingWizardTab(tab, values, shouldRedirect)
          }}
        />
      )
    }
    case COWORKING: {
      const submitButtonTranslationKey = isNewListingFlow
        ? 'EditListingWizard.saveNewCoworking'
        : 'EditListingWizard.saveEditCoworking'
      return (
        <EditListingCoworkingPanel
          {...panelProps(COWORKING)}
          submitButtonText={intl.formatMessage({ id: submitButtonTranslationKey })}
          onSubmit={(values, shouldRedirect) => {
            onCompleteEditListingWizardTab(tab, values, shouldRedirect)
          }}
        />
      )
    }
    case SURFING: {
      const submitButtonTranslationKey = isNewListingFlow
        ? 'EditListingWizard.saveNewSurfing'
        : 'EditListingWizard.saveEditSurfing'
      return (
        <EditListingSurfingPanel
          {...panelProps(SURFING)}
          submitButtonText={intl.formatMessage({ id: submitButtonTranslationKey })}
          onSubmit={(values, shouldRedirect) => {
            onCompleteEditListingWizardTab(tab, values, shouldRedirect)
          }}
        />
      )
    }
    case FEATURES: {
      const submitButtonTranslationKey = isNewListingFlow
        ? 'EditListingWizard.saveNewFeatures'
        : 'EditListingWizard.saveEditFeatures'
      return (
        <EditListingFeaturesPanel
          {...panelProps(FEATURES)}
          submitButtonText={intl.formatMessage({ id: submitButtonTranslationKey })}
          onSubmit={(values, shouldRedirect) => {
            onCompleteEditListingWizardTab(tab, values, true)
          }}
        />
      )
    }
    // case POLICY: {
    //   const submitButtonTranslationKey = isNewListingFlow
    //     ? 'EditListingWizard.saveNewPolicies'
    //     : 'EditListingWizard.saveEditPolicies';
    //   return (
    //     <EditListingPoliciesPanel
    //       {...panelProps(POLICY)}
    //       submitButtonText={intl.formatMessage({ id: submitButtonTranslationKey })}
    //       onSubmit={values => {
    //         onCompleteEditListingWizardTab(tab, values);
    //       }}
    //     />
    //   );
    // }
    case LOCATION: {
      const submitButtonTranslationKey = isNewListingFlow
        ? 'EditListingWizard.saveNewLocation'
        : 'EditListingWizard.saveEditLocation'
      return (
        <EditListingLocationPanel
          {...panelProps(LOCATION)}
          submitButtonText={intl.formatMessage({ id: submitButtonTranslationKey })}
          onSubmit={(values) => {
            onCompleteEditListingWizardTab(tab, values, true)
          }}
        />
      )
    }
    case PRODUCTS: {
      const submitButtonTranslationKey = isNewListingFlow
        ? 'EditListingWizard.saveNewProducts'
        : 'EditListingWizard.saveEditProducts'
      return (
        <EditListingProductsPanel
          {...panelProps(PRODUCTS)}
          submitButtonText={intl.formatMessage({ id: submitButtonTranslationKey })}
          images={images}
          onImageUpload={onImageUpload}
          onRemoveImage={onRemoveImage}
          onUpdateImageOrder={onUpdateImageOrder}
          onSubmit={(values, shouldRedirect) => {
            onCompleteEditListingWizardTab(tab, values, shouldRedirect)
          }}
        />
      )
    }
    case PRICING: {
      const submitButtonTranslationKey = isNewListingFlow
        ? 'EditListingWizard.saveNewPricing'
        : 'EditListingWizard.saveEditPricing'
      return (
        <EditListingPricingPanel
          {...panelProps(PRICING)}
          submitButtonText={intl.formatMessage({ id: submitButtonTranslationKey })}
          onSubmit={(values) => {
            onCompleteEditListingWizardTab(tab, values, true)
          }}
        />
      )
    }
    case AVAILABILITY: {
      return (
        <EditListingAvailabilityPanel
          {...panelProps(AVAILABILITY)}
          availability={availability}
          submitButtonText={intl.formatMessage({ id: 'EditListingWizard.next' })}
          onSubmit={(values) => {
            onCompleteEditListingWizardTab(tab, values, true)
          }}
        />
      )
    }
    case PHOTOS: {
      const submitButtonTranslationKey = isNewListingFlow
        ? 'EditListingWizard.saveNewPhotos'
        : 'EditListingWizard.saveEditPhotos'

      return (
        <EditListingPhotosPanel
          {...panelProps(PHOTOS)}
          submitButtonText={intl.formatMessage({ id: submitButtonTranslationKey })}
          images={images}
          onImageUpload={onImageUpload}
          onRemoveImage={onRemoveImage}
          onSubmit={(values) => {
            onCompleteEditListingWizardTab(tab, values)
          }}
          onUpdateImageOrder={onUpdateImageOrder}
        />
      )
    }
    default:
      return null
  }
}

EditListingWizardTab.defaultProps = {
  listing: null,
  updatedTab: null,
}

const {
  array, bool, func, object, oneOf, shape, string
} = PropTypes

EditListingWizardTab.propTypes = {
  params: shape({
    id: string.isRequired,
    slug: string.isRequired,
    type: oneOf(LISTING_PAGE_PARAM_TYPES).isRequired,
    tab: oneOf(SUPPORTED_TABS).isRequired,
  }).isRequired,
  errors: shape({
    createListingDraftError: object,
    publishListingError: object,
    updateListingError: object,
    showListingsError: object,
    uploadImageError: object,
  }).isRequired,
  fetchInProgress: bool.isRequired,
  newListingPublished: bool.isRequired,
  history: shape({
    push: func.isRequired,
    replace: func.isRequired,
  }).isRequired,
  images: array.isRequired,
  availability: object.isRequired,

  // We cannot use propTypes.listing since the listing might be a draft.
  listing: shape({
    attributes: shape({
      publicData: object,
      description: string,
      geolocation: object,
      pricing: object,
      title: string,
    }),
    images: array,
  }),

  handleCreateFlowTabScrolling: func.isRequired,
  handlePublishListing: func.isRequired,
  onUpdateListing: func.isRequired,
  onCreateListingDraft: func.isRequired,
  onImageUpload: func.isRequired,
  onUpdateImageOrder: func.isRequired,
  onRemoveImage: func.isRequired,
  onChange: func.isRequired,
  updatedTab: string,
  updateInProgress: bool.isRequired,

  intl: intlShape.isRequired,
}

export default EditListingWizardTab
