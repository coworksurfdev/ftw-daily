import React from 'react'
import round from 'lodash/round'
import { intlShape } from '../../util/reactIntl'
import { formatMoney } from '../../util/currency'
import { LINE_ITEM_EXTENDED_STAY_DISCOUNT, propTypes } from '../../util/types'
import { types as sdkTypes } from '../../util/sdkLoader'

import css from './BookingBreakdown.css'

const { Money } = sdkTypes

const LineItemDiscountMaybe = (props) => {
  const {
    transaction, intl
  } = props

  const unitPurchase = transaction.attributes.lineItems.find(
    (item) => item.code === LINE_ITEM_EXTENDED_STAY_DISCOUNT && !item.reversal
  )
  if (!unitPurchase) return null

  const { attributes } = transaction
  const isEstimate = transaction.id.uuid === 'estimated-transaction'
  const isSplitPayment = !!attributes.protectedData && attributes.protectedData.linkedProcessId

  if (unitPurchase && unitPurchase.unitPrice) {
    unitPurchase.unitPrice.amount = unitPurchase.unitPrice.amount * unitPurchase.percentage
  } else if (unitPurchase && unitPurchase.lineTotal) {
    unitPurchase.lineTotal.amount = unitPurchase.lineTotal.amount * unitPurchase.percentage
  }

  const total = unitPurchase ? isSplitPayment && !isEstimate
    ? formatMoney(intl, unitPurchase.unitPrice)
    : formatMoney(intl, unitPurchase.lineTotal)
    : null

  const quantity = unitPurchase ? unitPurchase.percentage.toString() : null

  return quantity && total ? (
    <div className={css.lineItem}>
      <span className={css.itemLabel}>
        <span>{`${Math.abs(unitPurchase.percentage)}`}% Extended Stay Discount</span>
      </span>
      <span className={css.itemValue}>{`${total}`}</span>
    </div>
  ) : null
}

LineItemDiscountMaybe.propTypes = {
  transaction: propTypes.transaction.isRequired,
  unitType: propTypes.bookingUnitType.isRequired,
  intl: intlShape.isRequired,
}

export default LineItemDiscountMaybe
