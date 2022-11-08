export enum GQL_MUTATIONS {
    ORDER_EDIT_BEGIN = `mutation orderEditBegin($id: ID!) {
        orderEditBegin(id: $id) {
          userErrors {
            field
            message
          }
          calculatedOrder {
               id
            lineItems(first: 15){
              edges{
                node{
                  id
                  quantity
                }
              }
            }
            originalOrder{
              lineItems(first: 15){
                edges{
                  node{
                    id
                    variant{
                        id
                    }
                  }
                }
              }
            }
          }
        }
    }`,
    ORDER_EDIT_COMMIT = `mutation commitEdit($id: ID!) {
        orderEditCommit(id: $id, notifyCustomer: false, staffNote: "Order edited by Payments Manager (Plexo) APP") {
          order {
            id
          }
          userErrors {
            field
            message
          }
        }
    }`,
    ORDER_EDIT_ADD_ITEM_DISCOUNT = `mutation orderEditAddLineItemDiscount(
        $id: ID!, 
        $discount: OrderEditAppliedDiscountInput!, 
        $lineItemId: ID!
    ) {
        orderEditAddLineItemDiscount(id: $id, discount: $discount, lineItemId: $lineItemId) {
          addedDiscountStagedChange {
            id
            value
            description
          }
          calculatedLineItem {
            id
            quantity
          }
          calculatedOrder {
            id
            addedLineItems(first: 5) {
                edges {
                    node {
                        id
                        quantity
                    }
                }
            }
          }
          userErrors {
            field
            message
          }
        }
    }`,
    ORDER_EDIT_ADD_ITEM = `mutation orderEditAddVariant($id: ID!, $quantity: Int!, $variantId: ID!) {
        orderEditAddVariant(id: $id, quantity: $quantity, variantId: $variantId, allowDuplicates: true) {
          calculatedLineItem {
            id
            quantity
          }
          calculatedOrder {
            id
            addedLineItems(first: 5) {
                edges {
                    node {
                        id
                        quantity
                    }
                }
            }
          }
          userErrors {
            field
            message
          }
        }
    }`,
    ORDER_EDIT_REMOVE_ITEM = `mutation changeLineItemQuantity($id: ID!, $lineItemId: ID!) {
        orderEditSetQuantity(id: $id, lineItemId: $lineItemId, quantity: 0) {
            calculatedOrder {
                id
                addedLineItems(first: 5) {
                    edges {
                        node {
                            id
                            quantity
                        }
                    }
                }
            }
            userErrors {
                field
                message
            }
        }
    }`
}