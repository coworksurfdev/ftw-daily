import React, { Component, useEffect } from 'react'
import get from 'lodash/get'
import { DayPilot, DayPilotScheduler } from 'daypilot-pro-react'
import { connect } from 'react-redux'
import {
  addEventToAvailabilityCalendar,
  deleteEventFromAvailabilityCalendar, fetchAvailabilityCalendar, updateEventOnAvailabilityCalendar,
} from '../../containers/EditListingPage/EditListingPage.duck'

const Scheduler = (props) => {
  const { listing } = props
  const publicData = get(listing, 'attributes.publicData', {})
  let scheduler

  useEffect(() => {

  }, [])

  const mapRooms = () => {
    const roomGroup = {
      name: 'Rooms / Beds',
      id: 'rooms',
      expanded: true,
      children: []
    }
    console.log(publicData)
    const rooms = (publicData.products || []).map((p) => {
      return {
        name: p.type,
        id: p.id
      }
    })
    roomGroup.children = rooms
    return roomGroup
  }

  const config = {
    timeHeaders: [{ groupBy: 'Month' }, { groupBy: 'Day', format: 'd' }],
    scale: 'Day',
    days: DayPilot.Date.today().daysInYear(),
    startDate: DayPilot.Date.today(),
    timeRangeSelectedHandling: 'Enabled',
    onTimeRangeSelected(args) {
      const dp = scheduler
      DayPilot.Modal.prompt('Create a new event:', 'Event 1').then((modal) => {
        dp.clearSelection()
        if (!modal.result) { return }
        dp.events.add(new DayPilot.Event({
          start: args.start,
          end: args.end,
          id: DayPilot.guid(),
          resource: args.resource,
          text: modal.result
        }))
      })
    },
    eventMoveHandling: 'Update',
    onEventMoved(args) {
      scheduler.message(`Event moved: ${args.e.text()}`)
    },
    eventResizeHandling: 'Update',
    onEventResized(args) {
      scheduler.message(`Event resized: ${args.e.text()}`)
    },
    eventDeleteHandling: 'Update',
    onEventDeleted(args) {
      scheduler.message(`Event deleted: ${args.e.text()}`)
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
    treeEnabled: true,
  }

  return (
    <div>
      <DayPilotScheduler
        {...config}
        resources={[mapRooms()]}
        events={
          [
            {
              id: 1,
              resource: 'R1',
              start: '2020-09-04T00:00:00',
              end: '2020-09-08T00:00:00',
              text: 'Event 1'
            },
            {
              id: 2,
              resource: 'R1',
              start: '2020-09-12T00:00:00',
              end: '2020-09-16T00:00:00',
              text: 'Event 2'
            }
          ]
        }
        ref={(component) => {
          scheduler = component && component.control
        }}
      />
    </div>
  )
}

const mapStateToProps = (state) => {
  return {}
}

const mapDispatchToProps = (dispatch) => ({
  addEventRequest: (params) => dispatch(addEventToAvailabilityCalendar(params)),
  deleteEventRequest: (params) => dispatch(deleteEventFromAvailabilityCalendar(params)),
  updateEventRequest: (params) => dispatch(updateEventOnAvailabilityCalendar(params)),
  fetchCalendarRequest: (params) => dispatch(fetchAvailabilityCalendar(params)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Scheduler)
