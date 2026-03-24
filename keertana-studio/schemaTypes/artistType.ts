import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'artist',
  title: 'Artist',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'nameTransliterated',
      title: 'Name (English)',
      type: 'string',
      description: 'The English transliteration of the name, if applicable.',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'nameTransliterated',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'ministry',
      title: 'Ministry',
      type: 'reference',
      to: {type: 'ministry'},
      description: 'The ministry this artist represents or is affiliated with.',
    }),
    defineField({
      name: 'bio',
      title: 'Biography',
      type: 'text',
    }),
  ],
})
