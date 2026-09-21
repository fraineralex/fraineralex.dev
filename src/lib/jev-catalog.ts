import { defineCatalog } from '@json-render/core'
import { schema } from '@json-render/react/schema'
import { z } from 'zod'

export const jevCatalog = defineCatalog(schema, {
  components: {
    Card: {
      props: z.object({
        title: z.string().max(80)
      }),
      slots: ['default'],
      description: 'A container card for one coherent piece of information'
    },
    Text: {
      props: z.object({
        text: z.string().max(160)
      }),
      description: 'Supporting text that explains a card or next step'
    },
    Metric: {
      props: z.object({
        label: z.string().max(40),
        value: z.string().max(40)
      }),
      description: 'A concise label and value pair'
    },
    Button: {
      props: z.object({
        label: z.string().max(40)
      }),
      description: 'A visual action label for a product flow'
    },
    List: {
      props: z.object({
        items: z.array(z.string().max(80)).min(1).max(3)
      }),
      description: 'A short checklist of next steps'
    }
  },
  actions: {}
})
