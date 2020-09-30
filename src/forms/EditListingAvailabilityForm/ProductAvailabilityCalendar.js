import React, { Component, useEffect } from 'react'
import get from 'lodash/get'
import { DayPilot, DayPilotScheduler } from 'daypilot-pro-react'
import { connect } from 'react-redux'
import {
  addEventToAvailabilityCalendar,
  deleteEventFromAvailabilityCalendar, fetchAvailabilityCalendar, updateEventOnAvailabilityCalendar,
} from '../../containers/EditListingPage/EditListingPage.duck'

const Scheduler = (props) => {
  const {
    listing,
    fetchingAvailabilityCalendar,
    ampAvailabilityCalendar,
    availabilityCalendarRequestError
  } = props

  const publicData = get(listing, 'attributes.publicData', {})
  let scheduler

  useEffect(() => {
    props.fetchCalendarRequest(listing.id.uuid)
  }, [])

  const mapRooms = () => {
    const roomGroup = {
      name: 'Rooms / Beds',
      id: 'rooms',
      expanded: true,
      children: []
    }
    const rooms = (publicData.products || []).map((p) => {
      return {
        name: p.type,
        id: p.id
      }
    })
    roomGroup.children = rooms
    return roomGroup
  }

  const mapCWSEvents = () => {
    return ampAvailabilityCalendar.map((v) => {
      return {
        id: v.id,
        resource: v.productId,
        start: v.startDate,
        end: v.endDate,
        text: v.title ? v.title : 'Booking',
        moveDisabled: v.isCWSEvent,
        resizeDisabled: v.isCWSEvent,
        clickDisabled: v.isCWSEvent,
        rightClickDisabled: v.isCWSEvent,
        deleteDisabled: v.isCWSEvent
      }
    })
  }

  const config = {
    timeHeaders: [{ groupBy: 'Month' }, { groupBy: 'Day', format: 'd' }],
    scale: 'Day',
    days: DayPilot.Date.today().daysInYear(),
    startDate: DayPilot.Date.today(),
    timeRangeSelectedHandling: 'Enabled',
    onTimeRangeSelected: async (args) => {
      const dp = scheduler
      DayPilot.Modal.prompt('Name of booking', '')
      .then(async (modal) => {
        dp.clearSelection()
        if (!modal.result) { return }
        dp.events.add(new DayPilot.Event({
          start: args.start,
          end: args.end,
          id: DayPilot.guid(),
          resource: args.resource,
          text: modal.result
        }))
        await props.addEventRequest({
          listingId: listing.id.uuid,
          startDate: args.start,
          endDate: args.end,
          productId: args.resource,
          title: modal.result || 'Booking'
        })
      })
    },
    eventMoveHandling: 'Update',
    onEventMoved: async (args) => {
      console.log(args)
      scheduler.message(`Event moved: ${args.e.text()}`)
      await props.updateEventRequest({
        id: get(args, 'e.data.id'),
        startDate: args.newStart,
        endDate: args.newEnd,
        productId: get(args, 'e.data.resource')
      })
    },
    eventResizeHandling: 'Update',
    onEventResized: async (args) => {
      console.log(args, 'resized')
      scheduler.message(`Event resized: ${args.e.text()}`)
      await props.updateEventRequest({
        id: get(args, 'e.data.id'),
        startDate: args.newStart,
        endDate: args.newEnd,
        productId: get(args, 'e.data.resource')
      })
    },
    eventDeleteHandling: 'Update',
    onEventDeleted: async (args) => {
      scheduler.message(`Event deleted: ${args.e.text()}`)
      await props.deleteEventRequest(get(args, 'e.data.id'))
    },
    eventClickHandling: 'Disabled',
    eventHoverHandling: 'Bubble',
    bubble: new DayPilot.Bubble({
      onLoad(args) {
        // if event object doesn't specify "bubbleHtml" property
        // this onLoad handler will be called to provide the bubble HTML
        args.html = 'Event details'
      }
    }),
    onBeforeRowHeaderRender: (args) => {
      args.row.html = `<span style='font-weight: bold'>${args.row.name}</span>`
    },
    treeEnabled: true,
  }

  return (
    <div>
      <DayPilotScheduler
        {...config}
        eventHeight={50}
        rowMinHeight={50}
        cellWidth={50}
        resources={[mapRooms()]}
        events={mapCWSEvents()}
        ref={(component) => {
          scheduler = component && component.control
        }}
      />
    </div>
  )
}

const mapStateToProps = (state) => {
  console.log(state)
  const {
    fetchingAvailabilityCalendar,
    ampAvailabilityCalendar,
    availabilityCalendarRequestError
  } = state.EditListingPage
  return {
    fetchingAvailabilityCalendar,
    ampAvailabilityCalendar,
    availabilityCalendarRequestError
  }
}

const mapDispatchToProps = (dispatch) => ({
  addEventRequest: (params) => dispatch(addEventToAvailabilityCalendar(params)),
  deleteEventRequest: (eventId) => dispatch(deleteEventFromAvailabilityCalendar(eventId)),
  updateEventRequest: (params) => dispatch(updateEventOnAvailabilityCalendar(params)),
  fetchCalendarRequest: (params) => dispatch(fetchAvailabilityCalendar(params)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Scheduler)
