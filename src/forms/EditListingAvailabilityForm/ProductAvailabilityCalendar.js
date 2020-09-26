import React, { Component } from 'react'
import { DayPilot, DayPilotScheduler } from 'daypilot-pro-react'
import { connect } from 'react-redux'
import { addEventToAvailabilityCalendar } from '../../containers/EditListingPage/EditListingPage.duck';

class Scheduler extends Component {
  constructor(props) {
    super(props)

    this.state = {
      timeHeaders: [{ groupBy: 'Month' }, { groupBy: 'Day', format: 'd' }],
      scale: 'Day',
      days: DayPilot.Date.today().daysInMonth(),
      startDate: DayPilot.Date.today().firstDayOfMonth(),
      timeRangeSelectedHandling: 'Enabled',
      onTimeRangeSelected(args) {
        const dp = this
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
        this.message(`Event moved: ${args.e.text()}`)
      },
      eventResizeHandling: 'Update',
      onEventResized(args) {
        this.message(`Event resized: ${args.e.text()}`)
      },
      eventDeleteHandling: 'Update',
      onEventDeleted(args) {
        this.message(`Event deleted: ${args.e.text()}`)
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
      treeEnabled: false,
    }
  }

  componentDidMount() {
    // load resource and event data
    this.setState({
      resources: [
        { name: 'Room 1', id: 'A' },
        { name: 'Room 2', id: 'B' },
        { name: 'Room 3', id: 'C' },
        { name: 'Room 4', id: 'D' },
        { name: 'Room 5', id: 'E' },
        { name: 'Room 6', id: 'F' },
        { name: 'Room 7', id: 'G' }
      ],
      events: [
        {
          id: 1,
          text: 'Event 1',
          start: '2018-05-02T00:00:00',
          end: '2018-05-05T00:00:00',
          resource: 'A'
        },
        {
          id: 2,
          text: 'Event 2',
          start: '2018-05-03T00:00:00',
          end: '2018-05-10T00:00:00',
          resource: 'C',
          barColor: '#38761d',
          barBackColor: '#93c47d'
        },
        {
          id: 3,
          text: 'Event 3',
          start: '2018-05-02T00:00:00',
          end: '2018-05-08T00:00:00',
          resource: 'D',
          barColor: '#f1c232',
          barBackColor: '#f1c232'
        },
        {
          id: 4,
          text: 'Event 3',
          start: '2018-05-02T00:00:00',
          end: '2018-05-08T00:00:00',
          resource: 'E',
          barColor: '#cc0000',
          barBackColor: '#ea9999'
        }
      ]
    })
  }

  render() {
    const { ...config } = this.state
    return (
      <div>
        <DayPilotScheduler
          {...config}
          rowMinHeight={50}
          ref={(component) => {
            this.scheduler = component && component.control
          }}
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {}
}

const mapDispatchToProps = (dispatch) => ({
  fetchCalendar: (params) => dispatch(addEventToAvailabilityCalendar(params))
})

export default connect(mapStateToProps, mapDispatchToProps)(Scheduler)
