import Divider from '@material-ui/core/Divider'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import ListSubheader from '@material-ui/core/ListSubheader'
import Tooltip from '@material-ui/core/Tooltip'
import React, { Component } from 'react'
import get from 'lodash/get'
import {
  bool, func, object, string
} from 'prop-types'
import { compose } from 'redux'
import { Form as FinalForm } from 'react-final-form'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import IconButton from '@material-ui/core/IconButton'
import FileCopyIcon from '@material-ui/icons/FileCopy'
import CalendarTodayIcon from '@material-ui/icons/CalendarToday'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import classNames from 'classnames'
import { intlShape, injectIntl, FormattedMessage } from '../../util/reactIntl'
import { propTypes } from '../../util/types'
import { Form, Button } from '../../components'

import ManageAvailabilityCalendar from './ManageAvailabilityCalendar'
import css from './EditListingAvailabilityForm.css'
// import ProductAvailabilityCalender from './ProductAvailabilityCalendar'

export class EditListingAvailabilityFormComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      scheduler: null
    }
  }

  async componentDidMount() {
    const ProductAvailabilityCalender = await import('./ProductAvailabilityCalendar')
    this.setState({
      scheduler:
        <ProductAvailabilityCalender.default
          listing={this.props.listing || {}}
        />
    })
  }

  generateICalLinks() {
    const { listing } = this.props
    const publicData = get(listing, 'attributes.publicData', {})
    return (
      <List
        subheader={<ListSubheader component="div" id="ical-subheader-list"><CalendarTodayIcon style={{ marginRight: 20 }}/>iCalendar URLs</ListSubheader>}
      >
        {
          (publicData.products || []).map((prod) => {
            const basePath = process.env.REACT_APP_ENV === 'red' ? '/red' : ''
            return (
              <ListItem>
                <ListItemText
                  primary={prod.type}
                />
                <ListItemSecondaryAction>
                  <Tooltip title="Copy iCal Link To Clipboard" aria-label="Copy iCal Link To Clipboard">
                    <CopyToClipboard text={
                      `https://api.coworksurf.world${basePath}/room_ical/${listing.id.uuid}/${prod.id}/${process.env.REACT_APP_ICAL_KEY}/calendar.ics`
                    }>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                      >
                        <FileCopyIcon />
                      </IconButton>
                    </CopyToClipboard>
                  </Tooltip>
                </ListItemSecondaryAction>
                <Divider />
              </ListItem>
            )
          })
        }
      </List>
    )
  }

  render() {
    return (
      <FinalForm
        {...this.props}
        render={(formRenderProps) => {
          const {
            className,
            rootClassName,
            disabled,
            ready,
            handleSubmit,
            // intl,
            invalid,
            pristine,
            saveActionMsg,
            updated,
            updateError,
            updateInProgress,
            availability,
            availabilityPlan,
            listingId,
            listing
          } = formRenderProps

          const errorMessage = updateError ? (
            <p className={css.error}>
              <FormattedMessage id="EditListingAvailabilityForm.updateFailed" />
            </p>
          ) : null

          const classes = classNames(rootClassName || css.root, className)
          const submitReady = (updated && pristine) || ready
          const submitInProgress = updateInProgress
          const submitDisabled = invalid || disabled || submitInProgress

          return (
            <Form className={classes} onSubmit={handleSubmit}>
              {errorMessage}
              <div className={css.calendarWrapper}>
                {
                  this.state.scheduler ? this.state.scheduler : null
                }
              </div>
              <div>
                {this.generateICalLinks()}
              </div>
              <Button
                className={css.submitButton}
                type="submit"
                inProgress={submitInProgress}
                disabled={submitDisabled}
                ready={submitReady}
              >
                {saveActionMsg}
              </Button>
            </Form>
          )
        }}
      />
    )
  }
}

EditListingAvailabilityFormComponent.defaultProps = {
  updateError: null,
}

EditListingAvailabilityFormComponent.propTypes = {
  intl: intlShape.isRequired,
  onSubmit: func.isRequired,
  saveActionMsg: string.isRequired,
  disabled: bool.isRequired,
  ready: bool.isRequired,
  updated: bool.isRequired,
  updateError: propTypes.error,
  updateInProgress: bool.isRequired,
  availability: object.isRequired,
  availabilityPlan: propTypes.availabilityPlan.isRequired,
}

export default compose(injectIntl)(EditListingAvailabilityFormComponent)
