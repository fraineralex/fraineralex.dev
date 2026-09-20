import 'server-only'

export const jevCandidates = [
  {
    id: 'train-ticket-card',
    description: 'A root card for a train booking summary',
    element: { type: 'Card', props: { title: 'Train ticket' } },
    root: true,
    resource: 'demo-root'
  },
  {
    id: 'spending-overview-card',
    description: 'A root card for a personal spending overview',
    element: { type: 'Card', props: { title: 'Spending overview' } },
    root: true,
    resource: 'demo-root'
  },
  {
    id: 'support-checklist-card',
    description: 'A root card for a support resolution checklist',
    element: { type: 'Card', props: { title: 'Support checklist' } },
    root: true,
    resource: 'demo-root'
  },
  {
    id: 'train-route',
    description: 'Route and departure time for a train ticket',
    element: {
      type: 'Text',
      props: { text: 'Santo Domingo to Santiago, today at 4:30 PM' }
    },
    root: false,
    resource: 'train-route'
  },
  {
    id: 'train-fare',
    description: 'Train fare for the selected ticket',
    element: { type: 'Metric', props: { label: 'Fare', value: 'RD$ 850' } },
    root: false,
    resource: 'train-fare'
  },
  {
    id: 'book-seat',
    description: 'Booking action for a selected train ticket',
    element: { type: 'Button', props: { label: 'Book seat' } },
    root: false,
    resource: 'train-action'
  },
  {
    id: 'weekly-spending',
    description: 'Spending amount for the current week',
    element: { type: 'Metric', props: { label: 'This week', value: '$240' } },
    root: false,
    resource: 'weekly-spending'
  },
  {
    id: 'budget-left',
    description: 'Remaining budget amount',
    element: { type: 'Metric', props: { label: 'Budget left', value: '$160' } },
    root: false,
    resource: 'budget-left'
  },
  {
    id: 'top-category',
    description: 'Most important category in a spending overview',
    element: { type: 'Text', props: { text: 'Top category: groceries' } },
    root: false,
    resource: 'top-category'
  },
  {
    id: 'support-steps',
    description: 'Safe next steps for a support resolution flow',
    element: {
      type: 'List',
      props: {
        items: ['Confirm account email', 'Reset session', 'Escalate if unpaid invoice']
      }
    },
    root: false,
    resource: 'support-steps'
  },
  {
    id: 'resolve-support',
    description: 'Resolution action for a completed support checklist',
    element: { type: 'Button', props: { label: 'Mark resolved' } },
    root: false,
    resource: 'support-action'
  }
] as const
